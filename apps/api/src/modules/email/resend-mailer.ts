import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailOptions, Resend } from 'resend';
import { EnvironmentVariables } from '../../lib/constants';
import { Mailer } from './mailer.interface';

@Injectable()
export class ResendMailer implements Mailer {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>(EnvironmentVariables.RESEND_API_KEY);
    if (!apiKey) throw new Error('Missing RESEND_API_KEY');

    this.resend = new Resend(apiKey);
    this.from = this.config.get<string>(
      EnvironmentVariables.RESEND_FROM_EMAIL,
    )!;
  }

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
  }) {
    const { data, error } = await this.resend.emails.send({
      from: this.from,
      ...params,
    } as CreateEmailOptions);
    if (error) throw new Error(`Resend error: ${error.message}`);
    return data;
  }
}
