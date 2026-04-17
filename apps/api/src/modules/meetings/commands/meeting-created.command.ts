import { Command } from '@nestjs/cqrs';
import { Meeting } from '../entities/meeting.entity';

export class MeetingCreatedCommand extends Command<{ actionId: string }> {
  constructor(public readonly entity: Meeting) {
    super();
  }
}
