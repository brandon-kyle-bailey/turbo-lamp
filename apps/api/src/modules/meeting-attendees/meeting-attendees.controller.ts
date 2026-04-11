import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MeetingAttendeesService } from './meeting-attendees.service';
import { CreateMeetingAttendeeDto } from './dto/create-meeting-attendee.dto';
import { UpdateMeetingAttendeeDto } from './dto/update-meeting-attendee.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MeetingParticipantsService } from '../meeting-participants/meeting-participants.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-attendees', version: '1' })
export class MeetingAttendeesController {
  constructor(
    private readonly participantService: MeetingParticipantsService,
    private readonly attendeeService: MeetingAttendeesService,
  ) {}

  @Post()
  async create(@Body() createMeetingAttendeeDto: CreateMeetingAttendeeDto) {
    const participant = await this.participantService.findOneBy({
      email: createMeetingAttendeeDto.email,
    });
    return await this.attendeeService.create(createMeetingAttendeeDto);
  }

  @Get()
  async findAll() {
    return await this.attendeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.attendeeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingAttendeeDto: UpdateMeetingAttendeeDto,
  ) {
    return await this.attendeeService.update(id, updateMeetingAttendeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.attendeeService.remove(id);
  }
}
