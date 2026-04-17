import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VerificationValue } from '../../../lib/constants';
import { TokenService } from '../../auth/token.service';
import { InvitationCreatedEvent } from '../../verifications/events/invitation-created.event';
import { NotificationsService } from '../notifications.service';
import { invitationEmail } from '../templates/invitation';

@EventsHandler(InvitationCreatedEvent)
export class InvitationCreatedHandler implements IEventHandler<InvitationCreatedEvent> {
  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async handle(event: InvitationCreatedEvent) {
    const { entity } = event;

    const payload: VerificationValue = await this.tokenService.verify(
      entity.value,
    );

    const expiresAt = entity.expiresAt;
    const url = `http://localhost:3000/onboarding/auth?token=${encodeURIComponent(entity.identifier)}`;
    await this.notificationsService.sendEmail({
      to: payload.to,
      subject: invitationEmail.subject,
      text: invitationEmail.text({ url, expiresAt: expiresAt.toString() }),
      html: invitationEmail.html({ url, expiresAt: expiresAt.toString() }),
    });
    return;
  }
}
