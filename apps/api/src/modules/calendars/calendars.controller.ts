import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { CalendarsService } from './calendars.service';
import { AccountsService } from '../accounts/accounts.service';
import { ExternalCalendarService } from './external-calendar.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'calendars', version: '1' })
export class CalendarsController {
  constructor(
    private readonly calendarService: CalendarsService,
    private readonly externalCalendarService: ExternalCalendarService,
    @Inject(AccountsService)
    private readonly accountService: AccountsService,
  ) {}

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
    return await this.calendarService.remove(id);
  }
}
