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
import { AvailabilityPreferencesService } from './availability-preferences.service';
import { CreateAvailabilityPreferenceDto } from './dto/create-availability-preference.dto';
import { UpdateAvailabilityPreferenceDto } from './dto/update-availability-preference.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'availability-preferences', version: '1' })
export class AvailabilityPreferencesController {
  constructor(
    private readonly availabilityPreferencesService: AvailabilityPreferencesService,
  ) {}

  @Post()
  create(
    @Req() req: Request & { user: Account },
    @Body() createAvailabilityPreferenceDto: CreateAvailabilityPreferenceDto,
  ) {
    return this.availabilityPreferencesService.create({
      ...createAvailabilityPreferenceDto,
      createdBy: req.user.userId,
    });
  }

  @Get()
  findAll(@Req() req: Request & { user: Account }) {
    return this.availabilityPreferencesService.findAllBy({
      userId: req.user.userId,
    });
  }

  @Get(':id')
  findOne(@Req() req: Request & { user: Account }, @Param('id') id: string) {
    return this.availabilityPreferencesService.findOneBy({
      id,
      userId: req.user.userId,
    });
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateAvailabilityPreferenceDto: UpdateAvailabilityPreferenceDto,
  ) {
    return this.availabilityPreferencesService.update(
      id,
      updateAvailabilityPreferenceDto,
    );
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: Account }, @Param('id') id: string) {
    return this.availabilityPreferencesService.remove(id);
  }
}
