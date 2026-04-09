import { Module } from '@nestjs/common';
import { CalendarsService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarConnection } from './entities/calendar-connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarConnection])],
  providers: [CalendarsService],
})
export class CalendarModule {}
