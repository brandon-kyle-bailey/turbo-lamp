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
} from '@nestjs/common';
import { MeetingParticipantsService } from './meeting-participants.service';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Account } from '../accounts/entities/account.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-participants', version: '1' })
export class MeetingParticipantsController {
  constructor(
    private readonly meetingParticipantsService: MeetingParticipantsService,
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
    return await this.meetingParticipantsService.update(
      id,
      updateMeetingParticipantDto,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingParticipantsService.remove(id);
  }
}
