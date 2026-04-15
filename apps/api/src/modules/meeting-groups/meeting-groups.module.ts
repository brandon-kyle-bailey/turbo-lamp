import { Module } from '@nestjs/common';
import { MeetingGroupsService } from './meeting-groups.service';
import { MeetingGroupsController } from './meeting-groups.controller';
import { MeetingGroup } from './entities/meeting-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingParticipantsModule } from '../meeting-participants/meeting-participants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingGroup]),
    MeetingParticipantsModule,
  ],
  controllers: [MeetingGroupsController],
  providers: [MeetingGroupsService],
  exports: [MeetingGroupsService],
})
export class MeetingGroupsModule {}
