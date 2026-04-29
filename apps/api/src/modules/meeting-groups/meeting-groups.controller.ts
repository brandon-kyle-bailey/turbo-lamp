import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  ParticipantAuthState,
  ParticipantInvitationState,
} from '../../libs/constants';
import { Account } from '../accounts/entities/account.entity';
import { MeetingParticipantsService } from '../meeting-participants/meeting-participants.service';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { MeetingGroupsService } from './meeting-groups.service';
import { Logger } from '@nestjs/common';
import { convertDateToTimezone } from '../../utils/helpers/datetimes';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-groups', version: '1' })
export class MeetingGroupsController {
  private readonly logger = new Logger(MeetingGroupsController.name);
  constructor(
    @Inject(MeetingGroupsService)
    private readonly meetingGroupsService: MeetingGroupsService,
    @Inject(MeetingParticipantsService)
    private readonly meetingParticipantService: MeetingParticipantsService,
  ) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingGroupDto: CreateMeetingGroupDto,
  ) {
    const calendar = req.user.calendars.find(
      (c) => c.id === createMeetingGroupDto.calendarId,
    );
    if (!calendar) {
      throw new BadRequestException();
    }
    const sanitizedAfter = new Date(createMeetingGroupDto.after);
    const sanitizedBefore = new Date(createMeetingGroupDto.before);
    const timezonedAfter = convertDateToTimezone(
      sanitizedAfter,
      calendar.timezone,
    );
    const timezonedBefore = convertDateToTimezone(
      sanitizedBefore,
      calendar.timezone,
    );
    const result = await this.meetingGroupsService.create({
      ...createMeetingGroupDto,
      after: timezonedAfter,
      before: timezonedBefore,
      timezone: calendar.timezone,
      authorId: req.user.userId,
      createdBy: req.user.userId,
    });

    await this.meetingParticipantService.create({
      createdBy: req.user.userId,
      meetingGroupId: result.id,
      email: req.user.user.email,
      userId: req.user.userId,
      required: true,
      authState: ParticipantAuthState.AUTHORIZED,
      invitationState: ParticipantInvitationState.ACCEPTED,
    });

    return result;
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    const result = await this.meetingGroupsService.findAllBy(
      [
        { authorId: req.user.userId },
        { participants: { userId: req.user.userId } },
      ],
      {
        participants: { user: true },
      },
    );
    return result;
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const result = await this.meetingGroupsService.findOneBy(
      { id },
      {
        participants: { user: true },
      },
    );
    return result;
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingGroupDto: UpdateMeetingGroupDto,
  ) {
    const found = await this.meetingGroupsService.findOneBy([
      { id, authorId: req.user.userId },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    return await this.meetingGroupsService.update(id, updateMeetingGroupDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const found = await this.meetingGroupsService.findOneBy([
      { id, authorId: req.user.userId },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    return await this.meetingGroupsService.remove(id);
  }
}
