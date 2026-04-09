import { Module } from '@nestjs/common';
import { MeetingAttendeesService } from './meeting-attendees.service';
import { MeetingAttendeesController } from './meeting-attendees.controller';
import { MeetingAttendee } from './entities/meeting-attendee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingAttendee])],
  controllers: [MeetingAttendeesController],
  providers: [MeetingAttendeesService],
  exports: [MeetingAttendeesService],
})
export class MeetingAttendeesModule {}
