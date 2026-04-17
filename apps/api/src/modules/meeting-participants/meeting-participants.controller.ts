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
import { Account } from '../accounts/entities/account.entity';
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
  ) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingParticipantDto: CreateMeetingParticipantDto,
  ) {
    return await this.meetingParticipantsService.create({
      ...createMeetingParticipantDto,
      createdBy: req.user.userId,
    });
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.meetingParticipantsService.findAllBy([
      { userId: req.user.userId },
      { email: req.user.user.email },
      { createdBy: req.user.userId },
    ]);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingParticipantsService.findOneBy([
      { id, userId: req.user.userId },
      { id, email: req.user.user.email },
      { id, createdBy: req.user.userId },
    ]);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingParticipantDto: UpdateMeetingParticipantDto,
  ) {
    const found = await this.meetingParticipantsService.findOneBy([
      { id, userId: req.user.userId },
      { id, email: req.user.user.email },
      { id, createdBy: req.user.userId },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    const result = await this.meetingParticipantsService.update(
      id,
      updateMeetingParticipantDto,
    );
    return result;
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const found = await this.meetingParticipantsService.findOneBy([
      { id, userId: req.user.userId },
      { id, email: req.user.user.email },
      { id, createdBy: req.user.userId },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    return await this.meetingParticipantsService.remove(id);
  }
}
