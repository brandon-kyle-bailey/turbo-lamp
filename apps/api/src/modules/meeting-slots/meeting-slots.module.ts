import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingGroupsModule } from '../meeting-groups/meeting-groups.module';
import { MeetingSlot } from './entities/meeting-slot.entity';
import { MeetingSlotsController } from './meeting-slots.controller';
import { MeetingSlotsService } from './meeting-slots.service';
import { CalendarsModule } from '../calendars/calendars.module';
import { MeetingParticipantAuthorizedHandler } from './handlers/meeting-participant-authorized.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingSlot]),
    forwardRef(() => MeetingGroupsModule),
    CalendarsModule,
  ],
  controllers: [MeetingSlotsController],
  providers: [MeetingSlotsService, MeetingParticipantAuthorizedHandler],
  exports: [MeetingSlotsService],
})
export class MeetingSlotsModule {}
