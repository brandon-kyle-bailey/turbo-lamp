import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailOptions, Resend } from 'resend';
import { EnvironmentVariables } from '../../../lib/constants';
import { Mailer, SendEmailParams } from '../mailer.interface';

@Injectable()
export class ResendMailer implements Mailer {
  private readonly from: string;
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(
      EnvironmentVariables.RESEND_API_KEY,
    )!;
    if (!apiKey) throw new Error('Missing RESEND_API_KEY');

    this.resend = new Resend(apiKey);

    const from = this.configService.get<string>(
      EnvironmentVariables.RESEND_FROM_EMAIL,
    );
    if (!from) throw new Error('Missing RESEND_FROM_EMAIL');

    this.from = from;
  }

  async sendEmail(params: SendEmailParams) {
    const result = await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    } as CreateEmailOptions);

    if (result.error) {
      throw new Error(result.error.message);
    }
  }
}
