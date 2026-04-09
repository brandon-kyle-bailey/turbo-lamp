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
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meetings', version: '1' })
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingsService.create(createMeetingDto);
  }

  @Get()
  async findAll() {
    return await this.meetingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    return await this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingsService.remove(id);
  }
}
