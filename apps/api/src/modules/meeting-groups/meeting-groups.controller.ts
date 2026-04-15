import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { MeetingGroupsService } from './meeting-groups.service';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MeetingParticipantsService } from '../meeting-participants/meeting-participants.service';
import { AccountProvider } from '../../lib/constants';

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
      creatorId: req.user.user.id,
    });

    await this.meetingParticipantService.create({
      meetingGroupId: result.id,
      email: req.user.user.email,
      userId: req.user.userId,
      required: true,
      oauth_connected: req.user.providerId !== AccountProvider.CREDENTIALS,
    });

    return result;
  }

  @Get()
  async findAll() {
    return await this.meetingGroupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingGroupsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingGroupDto: UpdateMeetingGroupDto,
  ) {
    return await this.meetingGroupsService.update(id, updateMeetingGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingGroupsService.remove(id);
  }
}
