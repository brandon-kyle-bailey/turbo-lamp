import { Injectable } from '@nestjs/common';
import { ICalendarProvider } from './calendar-provider.interface';

@Injectable()
export class GoogleCalendarProvider implements ICalendarProvider {
  constructor() {}

  fetchEvents() {
    return 'method not implemented';
  }

  createEvent() {
    return 'method not implemented';
  }

  refreshToken() {
    return 'method not implemented';
  }
}
