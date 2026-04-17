import { IEvent } from '@nestjs/cqrs';
import { Verification } from '../entities/verification.entity';

export class InvitationCreatedEvent implements IEvent {
  constructor(public readonly entity: Verification) {}
}
