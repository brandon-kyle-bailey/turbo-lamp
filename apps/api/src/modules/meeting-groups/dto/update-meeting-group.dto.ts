import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingGroupDto } from './create-meeting-group.dto';

export class UpdateMeetingGroupDto extends PartialType(CreateMeetingGroupDto) {}
