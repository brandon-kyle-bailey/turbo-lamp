import {
  Body,
  Controller,
  Delete,
  Get,
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
    return await this.attendeeService.create({
      ...createMeetingAttendeeDto,
      createdBy: req.user.userId,
    });
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.attendeeService.findAllBy([
      { createdBy: req.user.userId },
      { userId: req.user.userId },
      { meeting: { meetingGroup: { authorId: req.user.userId } } },
    ]);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.attendeeService.findOneBy([
      { id, createdBy: req.user.userId },
      { id, userId: req.user.userId },
      { id, meeting: { meetingGroup: { authorId: req.user.userId } } },
    ]);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingAttendeeDto: UpdateMeetingAttendeeDto,
  ) {
    const found = await this.attendeeService.findOneBy([
      { id, createdBy: req.user.userId },
      { id, meeting: { meetingGroup: { authorId: req.user.userId } } },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    return await this.attendeeService.update(id, updateMeetingAttendeeDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const found = await this.attendeeService.findOneBy([
      { id, createdBy: req.user.userId },
      { id, meeting: { meetingGroup: { authorId: req.user.userId } } },
    ]);
    if (!found) {
      throw new NotFoundException();
    }
    return await this.attendeeService.remove(id);
  }
}
