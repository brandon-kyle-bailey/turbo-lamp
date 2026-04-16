import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvailabilityPreferencesService } from './availability-preferences.service';
import { CreateAvailabilityPreferenceDto } from './dto/create-availability-preference.dto';
import { UpdateAvailabilityPreferenceDto } from './dto/update-availability-preference.dto';

@Controller('availability-preferences')
export class AvailabilityPreferencesController {
  constructor(private readonly availabilityPreferencesService: AvailabilityPreferencesService) {}

  @Post()
  create(@Body() createAvailabilityPreferenceDto: CreateAvailabilityPreferenceDto) {
    return this.availabilityPreferencesService.create(createAvailabilityPreferenceDto);
  }

  @Get()
  findAll() {
    return this.availabilityPreferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityPreferencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvailabilityPreferenceDto: UpdateAvailabilityPreferenceDto) {
    return this.availabilityPreferencesService.update(+id, updateAvailabilityPreferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityPreferencesService.remove(+id);
  }
}
