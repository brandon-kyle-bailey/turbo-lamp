/* eslint-disable @typescript-eslint/no-unused-vars */
import {
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
    @Inject(MeetingAttendeesService)
    private readonly meetingAttendeesService: MeetingAttendeesService,
    @Inject(ExternalCalendarService)
    private readonly externalCalendarService: ExternalCalendarService,
  ) {}

  @Post()
  async create(
    @Body() createMeetingDto: CreateMeetingDto,
    @Req() req: Request & { user: Account },
  ) {
    const result = await this.meetingsService.create(createMeetingDto);
    const relatedMeeting = await this.meetingsService.findOne(result.id, {
      meetingGroup: {
        participants: true,
      },
    });
    const attendees = relatedMeeting!.meetingGroup.participants.map(
      (participant) => {
        return {
          email: participant.email,
        };
      },
    );
    const calendarId = req.user.user.calendars.filter(
      (c) => c.providerId === CalendarProvider.GOOGLE,
    )[0].calendarId;

    const externalEvent = await this.externalCalendarService.createEvent(
      'google',
      {
        account: req.user,
        calendarId,
        event: {
          summary: relatedMeeting!.meetingGroup.title,
          description: 'test',
          attendees,
          reminders: { useDefault: true },
          start: {
            dateTime: relatedMeeting!.start_at.toISOString(),
          },
          end: {
            dateTime: relatedMeeting!.end_at.toISOString(),
          },
        },
      },
    );
    for (const participant of relatedMeeting!.meetingGroup.participants) {
      await this.meetingAttendeesService.create({
        userId: participant.userId,
        meetingId: result.id,
        externalEventId: externalEvent.id!,
        email: participant.email,
      });
    }
    return result;
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.meetingsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: Account },
  ) {
    return await this.meetingsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @Req() req: Request & { user: Account },
  ) {
    return await this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: Account },
  ) {
    return await this.meetingsService.remove(id);
  }
}
