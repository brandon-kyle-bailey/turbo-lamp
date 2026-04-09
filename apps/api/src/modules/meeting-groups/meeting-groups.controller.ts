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
import { MeetingGroupsService } from './meeting-groups.service';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-groups', version: '1' })
export class MeetingGroupsController {
  constructor(private readonly meetingGroupsService: MeetingGroupsService) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingGroupDto: CreateMeetingGroupDto,
  ) {
    return await this.meetingGroupsService.create({
      ...createMeetingGroupDto,
      creatorId: req.user.user.id,
    });
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
