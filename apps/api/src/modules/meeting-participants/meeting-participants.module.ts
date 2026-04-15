import { Module } from '@nestjs/common';
import { MeetingParticipantsService } from './meeting-participants.service';
import { MeetingParticipantsController } from './meeting-participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { VerificationsModule } from '../verifications/verifications.module';
import { EmailModule } from '../email/email.module';
import { TokenService } from '../auth/token.service';
import { JwtService } from '@nestjs/jwt';
import { MeetingSlotsModule } from '../meeting-slots/meeting-slots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingParticipant]),
    VerificationsModule,
    EmailModule,
    MeetingSlotsModule,
  ],
  controllers: [MeetingParticipantsController],
  providers: [JwtService, TokenService, MeetingParticipantsService],
  exports: [MeetingParticipantsService],
})
export class MeetingParticipantsModule {}
