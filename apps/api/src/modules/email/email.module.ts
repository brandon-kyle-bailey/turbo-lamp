import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { ResendMailer } from './resend-mailer';
import { SmtpMailer } from './smtp-mailer';
import { MAILER } from './mailer.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MAILER,
      useClass:
        process.env.NODE_ENV === 'production' ? ResendMailer : SmtpMailer,
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
