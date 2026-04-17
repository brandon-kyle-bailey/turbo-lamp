import { IEvent } from '@nestjs/cqrs';
import { MeetingParticipant } from '../entities/meeting-participant.entity';

export class MeetingParticipantAuthorizedEvent implements IEvent {
  constructor(public readonly entity: MeetingParticipant) {}
}
