import { Module } from '@nestjs/common';
import { AvailabilityPreferencesService } from './availability-preferences.service';
import { AvailabilityPreferencesController } from './availability-preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityPreference } from './entities/availability-preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityPreference])],
  controllers: [AvailabilityPreferencesController],
  providers: [AvailabilityPreferencesService],
  exports: [AvailabilityPreferencesService],
})
export class AvailabilityPreferencesModule {}
