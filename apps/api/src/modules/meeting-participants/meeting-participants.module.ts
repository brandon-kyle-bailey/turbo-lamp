import { Module } from '@nestjs/common';
import { MeetingParticipantsService } from './meeting-participants.service';
import { MeetingParticipantsController } from './meeting-participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingParticipant } from './entities/meeting-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingParticipant])],
  controllers: [MeetingParticipantsController],
  providers: [MeetingParticipantsService],
  exports: [MeetingParticipantsService],
})
export class MeetingParticipantsModule {}
