import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingSlotDto } from './create-meeting-slot.dto';

export class UpdateMeetingSlotDto extends PartialType(CreateMeetingSlotDto) {}
