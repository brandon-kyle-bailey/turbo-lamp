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
import { Logger } from '@nestjs/common';

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
    const result = await this.meetingGroupsService.create({
      ...createMeetingGroupDto,
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
    this.logger.debug(req.user.userId);
    const result = await this.meetingGroupsService.findAllBy(
      [
        { authorId: req.user.userId },
        { participants: { userId: req.user.userId } },
      ],
      {
        participants: { user: true },
      },
    );
    this.logger.debug(result);
    return result;
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    this.logger.debug(req.user.userId, id);
    const result = await this.meetingGroupsService.findOneBy(
      { id },
      {
        participants: { user: true },
      },
    );
    console.log(result);
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
