import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityIntervalsController } from './availability-intervals.controller';
import { AvailabilityIntervalsService } from './availability-intervals.service';
import { AvailabilityInterval } from './entities/availability-interval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityInterval])],
  controllers: [AvailabilityIntervalsController],
  providers: [AvailabilityIntervalsService],
  exports: [AvailabilityIntervalsService],
})
export class AvailabilityIntervalsModule {}
