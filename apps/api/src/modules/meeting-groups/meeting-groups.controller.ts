import {
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
} from '../../lib/constants';
import { Account } from '../accounts/entities/account.entity';
import { MeetingParticipantsService } from '../meeting-participants/meeting-participants.service';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { MeetingGroupsService } from './meeting-groups.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-groups', version: '1' })
export class MeetingGroupsController {
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
    const result = await this.meetingGroupsService.create({
      ...createMeetingGroupDto,
      creatorId: req.user.userId,
      createdBy: req.user.userId,
    });

    await this.meetingParticipantService.create({
      createdBy: req.user.userId,
      meetingGroupId: result.id,
      email: req.user.user.email,
      userId: req.user.userId,
      required: true,
      auth_state: ParticipantAuthState.UNAUTHORIZED,
      invitation_state: ParticipantInvitationState.PENDING,
    });

    return result;
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.meetingGroupsService.findAllBy(
      [
        { creatorId: req.user.userId },
        { participants: { userId: req.user.userId } },
        { participants: { email: req.user.user.email } },
      ],
      {
        participants: { user: true },
      },
    );
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingGroupsService.findOneBy(
      [
        { id, creatorId: req.user.userId },
        { id, participants: { userId: req.user.userId } },
        { id, participants: { email: req.user.user.email } },
      ],
      {
        participants: true,
      },
    );
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingGroupDto: UpdateMeetingGroupDto,
  ) {
    const found = await this.meetingGroupsService.findOneBy([
      { id, creatorId: req.user.userId },
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
      { id, creatorId: req.user.userId },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    return await this.meetingGroupsService.remove(id);
  }
}
