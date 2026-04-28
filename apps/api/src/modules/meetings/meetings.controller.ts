import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { IdempotencyInterceptor } from '../../interceptors/idempotency.interceptor';
import { Account } from '../accounts/entities/account.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingsService } from './meetings.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meetings', version: '1' })
export class MeetingsController {
  constructor(
    @Inject(MeetingsService)
    private readonly meetingsService: MeetingsService,
  ) {}

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.meetingsService.findAllBy({
      meetingGroup: { participants: { userId: req.user.userId } },
    });
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const result = await this.meetingsService.findOneBy({
      id,
      meetingGroup: { participants: { userId: req.user.userId } },
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  async create(
    @Req() req: Request & { user: Account },
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return await this.meetingsService.create(createMeetingDto);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    const found = await this.meetingsService.findOneBy({
      id,
      meetingGroup: { authorId: req.user.userId },
    });
    if (!found) throw new NotFoundException();
    return await this.meetingsService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const found = await this.meetingsService.findOneBy({
      id,
      meetingGroup: { authorId: req.user.userId },
    });
    if (!found) throw new NotFoundException();
    return await this.meetingsService.remove(id);
  }
}
