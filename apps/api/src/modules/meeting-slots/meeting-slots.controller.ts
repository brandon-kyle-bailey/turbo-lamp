import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { MeetingSlotsService } from './meeting-slots.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-slots', version: '1' })
export class MeetingSlotsController {
  constructor(private readonly meetingSlotsService: MeetingSlotsService) {}

  @Get(':meetingGroupId')
  async findSlots(
    @Req() req: Request & { user: Account },
    @Param('meetingGroupId') meetingGroupId: string,
  ) {
    return await this.meetingSlotsService.findAllBy([
      {
        meetingGroup: {
          id: meetingGroupId,
          authorId: req.user.userId,
        },
      },
    ]);
  }

  @Get(':meetingGroupId/calculate')
  async calculate(
    @Req() req: Request & { user: Account },
    @Param('meetingGroupId') meetingGroupId: string,
  ) {
    return await this.meetingSlotsService.calculate(
      meetingGroupId,
      req.user.userId,
    );
  }
}
