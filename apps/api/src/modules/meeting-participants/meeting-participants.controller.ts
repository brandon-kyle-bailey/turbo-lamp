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
import { Account } from '../accounts/entities/account.entity';
import { MeetingSlotsService } from '../meeting-slots/meeting-slots.service';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { MeetingParticipantsService } from './meeting-participants.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-participants', version: '1' })
export class MeetingParticipantsController {
  constructor(
    @Inject(MeetingParticipantsService)
    private readonly meetingParticipantsService: MeetingParticipantsService,
    @Inject(MeetingSlotsService)
    private readonly meetingSlotsService: MeetingSlotsService,
  ) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingParticipantDto: CreateMeetingParticipantDto,
  ) {
    return await this.meetingParticipantsService.create(
      createMeetingParticipantDto,
    );
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    console.log(req.user);
    return await this.meetingParticipantsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingParticipantsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingParticipantDto: UpdateMeetingParticipantDto,
  ) {
    const result = await this.meetingParticipantsService.update(
      id,
      updateMeetingParticipantDto,
    );

    await this.meetingSlotsService.calculate(result.meetingGroupId);

    return result;
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingParticipantsService.remove(id);
  }
}
