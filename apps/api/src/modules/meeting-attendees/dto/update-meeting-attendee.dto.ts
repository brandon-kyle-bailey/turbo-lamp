import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingAttendeeDto } from './create-meeting-attendee.dto';

export class UpdateMeetingAttendeeDto extends PartialType(
  CreateMeetingAttendeeDto,
) {}
