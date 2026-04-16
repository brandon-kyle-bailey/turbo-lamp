import { Injectable } from '@nestjs/common';
import { CreateAvailabilityPreferenceDto } from './dto/create-availability-preference.dto';
import { UpdateAvailabilityPreferenceDto } from './dto/update-availability-preference.dto';

@Injectable()
export class AvailabilityPreferencesService {
  create(createAvailabilityPreferenceDto: CreateAvailabilityPreferenceDto) {
    return 'This action adds a new availabilityPreference';
  }

  findAll() {
    return `This action returns all availabilityPreferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} availabilityPreference`;
  }

  update(id: number, updateAvailabilityPreferenceDto: UpdateAvailabilityPreferenceDto) {
    return `This action updates a #${id} availabilityPreference`;
  }

  remove(id: number) {
    return `This action removes a #${id} availabilityPreference`;
  }
}
