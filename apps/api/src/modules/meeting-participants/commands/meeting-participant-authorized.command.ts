import { Command } from '@nestjs/cqrs';
import { MeetingParticipant } from '../entities/meeting-participant.entity';

export class MeetingParticipantAuthorizedCommand extends Command<{
  actionId: string;
}> {
  constructor(public readonly entity: MeetingParticipant) {
    super();
  }
}
