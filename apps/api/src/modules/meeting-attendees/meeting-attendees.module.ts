import { Module } from '@nestjs/common';
import { MeetingAttendeesService } from './meeting-attendees.service';
import { MeetingAttendeesController } from './meeting-attendees.controller';
import { MeetingAttendee } from './entities/meeting-attendee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingParticipantsModule } from '../meeting-participants/meeting-participants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingAttendee]),
    MeetingParticipantsModule,
  ],
  controllers: [MeetingAttendeesController],
  providers: [MeetingAttendeesService],
  exports: [MeetingAttendeesService],
})
export class MeetingAttendeesModule {}
