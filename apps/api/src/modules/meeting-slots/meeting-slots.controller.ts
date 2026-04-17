import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { CreateMeetingSlotDto } from './dto/create-meeting-slot.dto';
import { MeetingSlotsService } from './meeting-slots.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-slots', version: '1' })
export class MeetingSlotsController {
  constructor(private readonly meetingSlotsService: MeetingSlotsService) {}

  @Get(':id/calculate')
  async calculate(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingSlotsService.calculate(id, req.user.userId);
  }

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingSlotDto: CreateMeetingSlotDto,
  ) {
    return await this.meetingSlotsService.create({
      ...createMeetingSlotDto,
      createdBy: req.user.userId,
    });
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.meetingSlotsService.findAllBy([
      {
        meetingGroup: {
          participants: { userId: req.user.userId },
        },
      },
      {
        meetingGroup: {
          participants: { email: req.user.user.email },
        },
      },
    ]);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.meetingSlotsService.findOneBy([
      {
        id,

        meetingGroup: {
          participants: { userId: req.user.userId },
        },
      },
      {
        id,
        meetingGroup: {
          participants: { email: req.user.user.email },
        },
      },
    ]);
  }
}
