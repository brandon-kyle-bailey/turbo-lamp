import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Mailer } from './mailer.interface';

@Injectable()
export class SmtpMailer implements Mailer {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  private readonly transport = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
  });

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.transport.sendMail({
      ...params,
      from: 'noreply@mailhog.com',
    });
  }
}
