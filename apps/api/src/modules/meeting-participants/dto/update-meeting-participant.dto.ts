import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingParticipantDto } from './create-meeting-participant.dto';

export class UpdateMeetingParticipantDto extends PartialType(
  CreateMeetingParticipantDto,
) {}
