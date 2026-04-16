import { Module } from '@nestjs/common';
import { AvailabilityPreferencesService } from './availability-preferences.service';
import { AvailabilityPreferencesController } from './availability-preferences.controller';

@Module({
  controllers: [AvailabilityPreferencesController],
  providers: [AvailabilityPreferencesService],
})
export class AvailabilityPreferencesModule {}
