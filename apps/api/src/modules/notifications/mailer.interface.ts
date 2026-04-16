export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export interface Mailer {
  sendEmail(params: SendEmailParams): Promise<void>;
}

export const MAILER = Symbol('MAILER');
