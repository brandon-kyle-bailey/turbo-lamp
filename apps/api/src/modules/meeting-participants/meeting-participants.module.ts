import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { VerificationsModule } from '../verifications/verifications.module';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { MeetingParticipantsController } from './meeting-participants.controller';
import { MeetingParticipantsService } from './meeting-participants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingParticipant]),
    VerificationsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [MeetingParticipantsController],
  providers: [MeetingParticipantsService],
  exports: [MeetingParticipantsService],
})
export class MeetingParticipantsModule {}
