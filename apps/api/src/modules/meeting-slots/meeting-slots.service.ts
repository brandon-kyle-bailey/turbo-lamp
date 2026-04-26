import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { AccountProvider, ParticipantAuthState } from '../../lib/constants';
import {
  CalendarEvent,
  ExternalCalendarService,
} from '../calendars/external-calendar.service';
import { MeetingGroupsService } from '../meeting-groups/meeting-groups.service';
import { MeetingGroupVersionsService } from '../meeting-groups/meeting-group-versions.service';
import { MeetingGroupVersionStatus } from '../meeting-groups/entities/meeting-group-version.entity';
import { CreateMeetingSlotDto } from './dto/create-meeting-slot.dto';
import { UpdateMeetingSlotDto } from './dto/update-meeting-slot.dto';
import { MeetingSlot } from './entities/meeting-slot.entity';

@Injectable()
export class MeetingSlotsService {
  constructor(
    @InjectRepository(MeetingSlot)
    private readonly repository: Repository<MeetingSlot>,
    @Inject(MeetingGroupsService)
    private readonly meetingGroupService: MeetingGroupsService,
    @Inject(MeetingGroupVersionsService)
    private readonly versionService: MeetingGroupVersionsService,
    @Inject(ExternalCalendarService)
    private readonly externalCalendarService: ExternalCalendarService,
  ) {}

  async calculate(meetingGroupId: string, creatorId: string) {
    const meetingGroup = await this.meetingGroupService.findOneBy(
      {
        creatorId,
        id: meetingGroupId,
        participants: {
          authState: ParticipantAuthState.AUTHORIZED,
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
    if (!meetingGroup) throw new NotFoundException();
    if (!meetingGroup.participants) throw new NotFoundException();

    const activeVersion =
      await this.versionService.findActiveVersion(meetingGroupId);

    if (activeVersion.status !== MeetingGroupVersionStatus.ACTIVE) {
      throw new Error(
        'Can only compute slots for active meeting group versions',
      );
    }

    const flattenedCalendarEvents = await Promise.all(
      meetingGroup.participants.flatMap((participant) => {
        const account = participant.user.accounts.find(
          (account) => account.providerId === AccountProvider.GOOGLE,
        )!;
        return participant.user.calendars.map((calendar) =>
          this.externalCalendarService.listEvents(
            calendar.providerId as 'google',
            {
              account,
              calendarId: calendar.externalId,
              timeMin: activeVersion.after.toISOString(),
              timeMax: activeVersion.before.toISOString(),
            },
          ),
        );
      }),
    );
    const availabletimeSlots = this.getAvailableSlots(
      flattenedCalendarEvents,
      activeVersion.after,
      activeVersion.before,
      activeVersion.duration,
      5,
    );

    const createdMeetingSlots: Promise<MeetingSlot | null>[] = [];
    for (const [idx, slot] of availabletimeSlots.entries()) {
      createdMeetingSlots.push(
        this.upsert({
          meetingGroupId: meetingGroup.id,
          start: slot.start,
          end: slot.end,
          rank: idx,
        }),
      );
    }

    const computedSlots = availabletimeSlots.map((slot, idx) => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      rank: idx,
    }));

    await this.versionService.updateVersion(
      meetingGroupId,
      activeVersion.version,
      {
        computedSlots,
        slotsComputedAt: new Date(),
      },
    );

    return await Promise.all(createdMeetingSlots);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where: FindOptionsWhere<MeetingSlot> | FindOptionsWhere<MeetingSlot>[],
    relations?: FindOptionsRelations<MeetingSlot>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(id: string, relations?: FindOptionsRelations<MeetingSlot>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingSlot> | FindOptionsWhere<MeetingSlot>[],
    relations?: FindOptionsRelations<MeetingSlot>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async upsert(createMeetingSlotDto: CreateMeetingSlotDto) {
    await this.repository.upsert(createMeetingSlotDto, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['meetingGroupId', 'start', 'end'],
    });
    return this.findOneBy({
      meetingGroupId: createMeetingSlotDto.meetingGroupId,
      start: createMeetingSlotDto.start,
      end: createMeetingSlotDto.end,
    });
  }

  async create(
    createMeetingSlotDto: CreateMeetingSlotDto & { createdBy: string },
  ) {
    return await this.repository.save(
      this.repository.create(createMeetingSlotDto),
    );
  }

  async update(id: string, updateMeetingSlotDto: UpdateMeetingSlotDto) {
    const result = await this.repository.update(id, {
      ...updateMeetingSlotDto,
    });
    if (!result.affected) {
      throw new NotFoundException();
    }
    return await this.findOne(id);
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meeting.id);
  }

  private getAvailableSlots(
    calendars: CalendarEvent[][],
    windowStart: Date,
    windowEnd: Date,
    slotMinutes: number,
    limit: number,
  ) {
    const windowStartMs = windowStart.getTime();
    const windowEndMs = windowEnd.getTime();
    const slotMs = slotMinutes * 60 * 1000;

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
}
