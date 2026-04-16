/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CalendarProvider } from '../../lib/constants';
import { Account } from '../accounts/entities/account.entity';
import { ExternalCalendarService } from '../calendars/external-calendar.service';
import { MeetingAttendeesService } from '../meeting-attendees/meeting-attendees.service';
import { MeetingGroupsService } from '../meeting-groups/meeting-groups.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingsService } from './meetings.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meetings', version: '1' })
export class MeetingsController {
  constructor(
    @Inject(MeetingsService)
    private readonly meetingsService: MeetingsService,
    @Inject(MeetingGroupsService)
    private readonly meetingGroupsService: MeetingGroupsService,
    @Inject(MeetingAttendeesService)
    private readonly meetingAttendeesService: MeetingAttendeesService,
    @Inject(ExternalCalendarService)
    private readonly externalCalendarService: ExternalCalendarService,
  ) {}

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.meetingsService.findAllBy({
      meetingGroup: { creatorId: req.user.userId },
    });
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingsService.findOne(id);
  }

  // TODO... Move to CQRS
  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    const group = await this.meetingGroupsService.findOneBy(
      {
        id: createMeetingDto.meetingGroupId,
        creatorId: req.user.userId,
      },
      { participants: true },
    );
    if (!group) {
      throw new BadRequestException();
    }
    const result = await this.meetingsService.create(createMeetingDto);
    const attendees = group.participants.map((participant) => {
      return {
        email: participant.email,
      };
    });
    const calendarId = req.user.user.calendars.filter(
      (c) => c.providerId === CalendarProvider.GOOGLE,
    )[0].calendarId;

    const externalEvent = await this.externalCalendarService.createEvent(
      'google',
      {
        account: req.user,
        calendarId,
        event: {
          summary: group.summary,
          description: group.description,
          attendees,
          reminders: { useDefault: true },
          start: {
            dateTime: result.start_at.toISOString(),
          },
          end: {
            dateTime: result.end_at.toISOString(),
          },
        },
      },
    );
    for (const participant of group.participants) {
      await this.meetingAttendeesService.create({
        userId: participant.userId,
        meetingId: result.id,
        externalEventId: externalEvent.id!,
        email: participant.email,
      });
    }
    return result;
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    return await this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingsService.remove(id);
  }
}
