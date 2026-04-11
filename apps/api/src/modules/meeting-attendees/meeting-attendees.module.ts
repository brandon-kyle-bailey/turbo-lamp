import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingAttendee } from './entities/meeting-attendee.entity';
import { MeetingAttendeesController } from './meeting-attendees.controller';
import { MeetingAttendeesService } from './meeting-attendees.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingAttendee])],
  controllers: [MeetingAttendeesController],
  providers: [MeetingAttendeesService],
  exports: [MeetingAttendeesService],
})
export class MeetingAttendeesModule {}
