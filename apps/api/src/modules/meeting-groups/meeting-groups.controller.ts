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
import { MeetingGroupsService } from './meeting-groups.service';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-groups', version: '1' })
export class MeetingGroupsController {
  constructor(private readonly meetingGroupsService: MeetingGroupsService) {}

  @Post()
  async create(@Body() createMeetingGroupDto: CreateMeetingGroupDto) {
    return await this.meetingGroupsService.create(createMeetingGroupDto);
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
