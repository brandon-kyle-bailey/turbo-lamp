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

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-attendees', version: '1' })
export class MeetingAttendeesController {
  constructor(
    private readonly meetingAttendeesService: MeetingAttendeesService,
  ) {}

  @Post()
  async create(@Body() createMeetingAttendeeDto: CreateMeetingAttendeeDto) {
    return await this.meetingAttendeesService.create(createMeetingAttendeeDto);
  }

  @Get()
  async findAll() {
    return await this.meetingAttendeesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingAttendeesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingAttendeeDto: UpdateMeetingAttendeeDto,
  ) {
    return await this.meetingAttendeesService.update(
      id,
      updateMeetingAttendeeDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingAttendeesService.remove(id);
  }
}
