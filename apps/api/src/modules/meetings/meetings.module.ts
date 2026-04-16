import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingAttendeesModule } from '../meeting-attendees/meeting-attendees.module';
import { CalendarsModule } from '../calendars/calendars.module';
import { MeetingGroupsModule } from '../meeting-groups/meeting-groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    MeetingGroupsModule,
    MeetingAttendeesModule,
    CalendarsModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
