import { Injectable } from '@nestjs/common';
import { ICalendarProvider } from './calendar-provider.interface';
import { AccountsService } from '../../accounts/accounts.service';
import { AccountProvider } from '../../../lib/constants';

@Injectable()
export class GoogleCalendarProvider implements ICalendarProvider {
  constructor(private readonly accountService: AccountsService) {}

  async fetchEvents(userId: string, windowStart: Date, windowEnd: Date) {
    const tokens = await this.accountService.getTokens(
      userId,
      AccountProvider.GOOGLE,
    );
    const client = await this.buildGoogleClient(tokens);
    const events = await client.events.list({
      calendarId: 'primary',
      timeMin: windowStart.toISOString(),
      timeMax: windowEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    return events.data.items.map((e) => ({
      start: new Date(e.start.dateTime || e.start.date),
      end: new Date(e.end.dateTime || e.end.date),
      id: e.id,
    }));
  }

  async createEvent(userId: string, event: CalendarEventInput) {
    const tokens = await this.accountService.getTokens(
      userId,
      AccountProvider.GOOGLE,
    );
    const client = await this.buildGoogleClient(tokens);
    const created = await client.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return created.data.id;
  }

  async refreshToken(userId: string) {
    /* refresh logic */
  }
}
