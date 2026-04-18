import { Module } from '@nestjs/common';
import { AvailabilityOverridesService } from './availability-overrides.service';
import { AvailabilityOverridesController } from './availability-overrides.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityOverride } from './entities/availability-override.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityOverride])],
  controllers: [AvailabilityOverridesController],
  providers: [AvailabilityOverridesService],
  exports: [AvailabilityOverridesService],
})
export class AvailabilityOverridesModule {}
