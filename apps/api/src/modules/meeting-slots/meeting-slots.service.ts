import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { AccountProvider } from '../../lib/constants';
import {
  CalendarEvent,
  ExternalCalendarService,
} from '../calendars/external-calendar.service';
import { MeetingGroupsService } from '../meeting-groups/meeting-groups.service';
import { CreateMeetingSlotDto } from './dto/create-meeting-slot.dto';
import { UpdateMeetingSlotDto } from './dto/update-meeting-slot.dto';
import { MeetingSlot } from './entities/meeting-slot.entity';

function getAvailableSlots(
  calendars: CalendarEvent[][],
  windowStart: Date,
  windowEnd: Date,
  slotMinutes: number,
  limit: number,
) {
  const windowStartMs = windowStart.getTime();
  const windowEndMs = windowEnd.getTime();
  const slotMs = slotMinutes * 60 * 1000;

  // normalize + clamp + validate
  const allEvents = calendars
    .flat()
    .map((e) => {
      const start = new Date(e.start.dateTime).getTime();
      const end = new Date(e.end.dateTime).getTime();

      return {
        start: Math.max(start, windowStartMs),
        end: Math.min(end, windowEndMs),
      };
    })
    .filter((e) => e.start < e.end);

  allEvents.sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const event of allEvents) {
    if (!merged.length) {
      merged.push({ ...event });
      continue;
    }

    const last = merged[merged.length - 1];

    if (event.start <= last.end) {
      last.end = Math.max(last.end, event.end);
    } else {
      merged.push({ ...event });
    }
  }

  const free: { start: number; end: number }[] = [];
  let cursor = windowStartMs;

  for (const busy of merged) {
    if (busy.start > cursor) {
      free.push({ start: cursor, end: busy.start });
    }
    cursor = Math.max(cursor, busy.end);
  }

  if (cursor < windowEndMs) {
    free.push({ start: cursor, end: windowEndMs });
  }

  const slots: { start: Date; end: Date }[] = [];

  for (const interval of free) {
    let t = interval.start;

    while (t + slotMs <= interval.end) {
      slots.push({
        start: new Date(t),
        end: new Date(t + slotMs),
      });
      t += slotMs;
    }
  }

  return slots.slice(0, limit);
}

@Injectable()
export class MeetingSlotsService {
  constructor(
    @InjectRepository(MeetingSlot)
    private readonly repository: Repository<MeetingSlot>,
    @Inject(MeetingGroupsService)
    private readonly meetingGroupService: MeetingGroupsService,
    @Inject(ExternalCalendarService)
    private readonly externalCalendarService: ExternalCalendarService,
  ) {}

  async calculate(meetingGroupId: string) {
    const meetingGroup = await this.meetingGroupService.findOneBy(
      {
        id: meetingGroupId,
        participants: {
          oauth_connected: true,
          user: {
            accounts: {
              providerId: In([AccountProvider.GOOGLE]),
            },
            calendars: {
              providerId: In([AccountProvider.GOOGLE]),
            },
          },
        },
      },
      {
        participants: {
          user: {
            accounts: true,
            calendars: true,
          },
        },
      },
    );
    if (!meetingGroup) return;

    console.log(meetingGroup);
    const timeMin = meetingGroup.after.toISOString();
    const timeMax = meetingGroup.before.toISOString();
    console.log(timeMin, timeMax);

    const results = await Promise.all(
      meetingGroup.participants.flatMap((participant) => {
        const account = participant.user.accounts[0];

        return participant.user.calendars.map((calendar) =>
          this.externalCalendarService.listEvents('google', {
            account: { ...account, user: participant.user },
            calendarId: calendar.calendarId,
            timeMin,
            timeMax,
          }),
        );
      }),
    );
    console.log(JSON.stringify(results), results);
    const blah = getAvailableSlots(
      results,
      meetingGroup.after,
      meetingGroup.before,
      meetingGroup.duration,
      5,
    );
    console.log(blah);

    for (const [idx, slot] of blah.entries()) {
      await this.upsert({
        meetingGroupId: meetingGroup.id,
        start_at: slot.start,
        end_at: slot.end,
        rank: idx,
      });
    }
  }

  async upsert(createMeetingSlotDto: CreateMeetingSlotDto) {
    const found = await this.repository.findOneBy({
      meetingGroupId: createMeetingSlotDto.meetingGroupId,
      rank: createMeetingSlotDto.rank,
    });
    if (found) {
      return await this.update(found.id, createMeetingSlotDto);
    }
    return await this.create(createMeetingSlotDto);
  }

  async create(createMeetingSlotDto: CreateMeetingSlotDto) {
    const meeting = this.repository.create(createMeetingSlotDto);
    return await this.repository.save(meeting);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations?: FindOptionsRelations<MeetingSlot>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingSlot>,
    relations?: FindOptionsRelations<MeetingSlot>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateMeetingSlotDto: UpdateMeetingSlotDto) {
    const meeting = await this.findOne(id);
    return await this.repository.update(id, {
      ...meeting,
      ...updateMeetingSlotDto,
    });
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meeting.id);
  }
}
