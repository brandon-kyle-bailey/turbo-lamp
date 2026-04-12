import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { ExternalCalendarService } from './external-calendar.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'calendars', version: '1' })
export class CalendarsController {
  constructor(
    private readonly calendarService: CalendarsService,
    private readonly externalCalendarService: ExternalCalendarService,
  ) {}

  @Get('external')
  async findAllExternal(@Req() req: Request & { user: Account }) {
    const { providerId } = req.user;
    return await this.externalCalendarService.listCalendars(
      providerId as 'google',
      {
        account: req.user,
      },
    );
  }

  @Get(':id/events')
  async events(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Query('after') after: Date,
    @Query('before') before: Date,
  ) {
    const calendar = await this.calendarService.findOneBy({ id });
    if (!calendar) throw new NotFoundException();
    return await this.externalCalendarService.listEvents(
      req.user.providerId as 'google',
      {
        account: req.user,
        calendarId: calendar.calendarId,
        timeMin: after.toString(),
        timeMax: before.toString(),
      },
    );
  }

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createCalendarDto: CreateCalendarDto,
  ) {
    return await this.calendarService.create({
      ...createCalendarDto,
      userId: req.user.userId,
    });
  }

  @Post('batch')
  async createBatch(
    @Req() req: Request & { user: Account },
    @Body() createCalendarDto: CreateCalendarDto[],
  ) {
    const promises = createCalendarDto.map((dto) =>
      this.calendarService.create({
        ...dto,
        userId: req.user.userId,
      }),
    );
    return await Promise.all(promises);
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    console.log(req.user);
    return await this.calendarService.findAll();
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.calendarService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ) {
    const calendar = await this.calendarService.findOneBy({ id });
    if (!calendar) throw new NotFoundException();
    return await this.calendarService.update(id, {
      ...updateCalendarDto,
      userId: req.user.userId,
    });
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const calendar = await this.calendarService.findOneBy({ id });
    if (!calendar) throw new NotFoundException();
    return await this.calendarService.remove(id);
  }
}
