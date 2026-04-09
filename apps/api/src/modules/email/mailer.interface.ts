export interface Mailer {
  sendEmail(params: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
  }): Promise<any>;
}
export const MAILER = Symbol('MAILER');
