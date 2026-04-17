import { Command } from '@nestjs/cqrs';
import { Verification } from '../entities/verification.entity';

export class InvitationCreatedCommand extends Command<{ actionId: string }> {
  constructor(public readonly entity: Verification) {
    super();
  }
}
