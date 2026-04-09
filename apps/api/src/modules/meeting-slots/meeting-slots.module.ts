import { Module } from '@nestjs/common';
import { MeetingSlotsService } from './meeting-slots.service';
import { MeetingSlotsController } from './meeting-slots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingSlot } from './entities/meeting-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingSlot])],
  controllers: [MeetingSlotsController],
  providers: [MeetingSlotsService],
  exports: [MeetingSlotsService],
})
export class MeetingSlotsModule {}
