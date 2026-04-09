import { Module } from '@nestjs/common';
import { MeetingGroupsService } from './meeting-groups.service';
import { MeetingGroupsController } from './meeting-groups.controller';
import { MeetingGroup } from './entities/meeting-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingGroup])],
  controllers: [MeetingGroupsController],
  providers: [MeetingGroupsService],
  exports: [MeetingGroupsService],
})
export class MeetingGroupsModule {}
