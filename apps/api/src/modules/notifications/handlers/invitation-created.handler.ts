import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerificationValue } from '../../../lib/constants';
import { TokenService } from '../../auth/token.service';
import { InvitationCreatedCommand } from '../../verifications/commands/invitation-created.command';
import { NotificationsService } from '../notifications.service';
import { invitationEmail } from '../templates/invitation';

@CommandHandler(InvitationCreatedCommand)
export class InvitationCreatedHandler implements ICommandHandler<InvitationCreatedCommand> {
  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: InvitationCreatedCommand) {
    const { entity } = command;
    const actionId = crypto.randomUUID();

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
    return {
      actionId,
    };
  }
}
