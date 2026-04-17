import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { ResendMailer } from './adapters/resend.adapter';
import { SmtpMailer } from './adapters/smtp.adapter';
import { MAILER } from './mailer.interface';
import { EnvironmentVariables } from '../../lib/constants';
import { InvitationCreatedHandler } from './handlers/invitation-created.handler';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [
    {
      provide: MAILER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>(EnvironmentVariables.NODE_ENV)!;

        return nodeEnv === 'production'
          ? new ResendMailer(config)
          : new SmtpMailer(config);
      },
    },
    NotificationsService,
    InvitationCreatedHandler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
