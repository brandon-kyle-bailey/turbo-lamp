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
import { MeetingSlotsService } from './meeting-slots.service';
import { CreateMeetingSlotDto } from './dto/create-meeting-slot.dto';
import { UpdateMeetingSlotDto } from './dto/update-meeting-slot.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-slots', version: '1' })
export class MeetingSlotsController {
  constructor(private readonly meetingSlotsService: MeetingSlotsService) {}

  @Post()
  async create(@Body() createMeetingSlotDto: CreateMeetingSlotDto) {
    return await this.meetingSlotsService.create(createMeetingSlotDto);
  }

  @Get()
  async findAll() {
    return await this.meetingSlotsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingSlotsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingSlotDto: UpdateMeetingSlotDto,
  ) {
    return await this.meetingSlotsService.update(id, updateMeetingSlotDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingSlotsService.remove(id);
  }
}
