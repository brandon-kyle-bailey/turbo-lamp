import { Injectable, Inject } from '@nestjs/common';
import { MAILER, type Mailer } from './mailer.interface';

@Injectable()
export class EmailService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  constructor(@Inject(MAILER) private readonly mailer: Mailer) {}

  async sendEmail(params: Parameters<Mailer['sendEmail']>[0]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.mailer.sendEmail(params);
  }
}
