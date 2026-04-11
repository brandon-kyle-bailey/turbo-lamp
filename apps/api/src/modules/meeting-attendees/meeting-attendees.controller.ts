import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { CreateMeetingAttendeeDto } from './dto/create-meeting-attendee.dto';
import { UpdateMeetingAttendeeDto } from './dto/update-meeting-attendee.dto';
import { MeetingAttendeesService } from './meeting-attendees.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-attendees', version: '1' })
export class MeetingAttendeesController {
  constructor(private readonly attendeeService: MeetingAttendeesService) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingAttendeeDto: CreateMeetingAttendeeDto,
  ) {
    return await this.attendeeService.create(createMeetingAttendeeDto);
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    console.log(req.user);
    return await this.attendeeService.findAll();
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.attendeeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingAttendeeDto: UpdateMeetingAttendeeDto,
  ) {
    return await this.attendeeService.update(id, updateMeetingAttendeeDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.attendeeService.remove(id);
  }
}
