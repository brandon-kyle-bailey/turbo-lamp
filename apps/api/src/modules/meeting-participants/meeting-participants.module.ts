import { Module } from '@nestjs/common';
import { MeetingParticipantsService } from './meeting-participants.service';
import { MeetingParticipantsController } from './meeting-participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { VerificationsModule } from '../verifications/verifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingParticipant]),
    VerificationsModule,
  ],
  controllers: [MeetingParticipantsController],
  providers: [MeetingParticipantsService],
  exports: [MeetingParticipantsService],
})
export class MeetingParticipantsModule {}
