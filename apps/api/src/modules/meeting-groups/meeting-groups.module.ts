import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarsModule } from '../calendars/calendars.module';
import { MeetingAttendeesModule } from '../meeting-attendees/meeting-attendees.module';
import { MeetingParticipantsModule } from '../meeting-participants/meeting-participants.module';
import { MeetingGroup } from './entities/meeting-group.entity';
import { MeetingCreatedHandler } from './handlers/meeting-created.handler';
import { MeetingGroupsController } from './meeting-groups.controller';
import { MeetingGroupsService } from './meeting-groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingGroup]),
    MeetingParticipantsModule,
    MeetingAttendeesModule,
    CalendarsModule,
  ],
  controllers: [MeetingGroupsController],
  providers: [MeetingGroupsService, MeetingCreatedHandler],
  exports: [MeetingGroupsService],
})
export class MeetingGroupsModule {}
