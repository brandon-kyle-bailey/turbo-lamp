import { Injectable, Inject } from '@nestjs/common';
import { MAILER, type Mailer, type SendEmailParams } from './mailer.interface';

@Injectable()
export class NotificationsService {
  constructor(@Inject(MAILER) private readonly mailer: Mailer) {}

  sendEmail(params: SendEmailParams) {
    return this.mailer.sendEmail(params);
  }
}
