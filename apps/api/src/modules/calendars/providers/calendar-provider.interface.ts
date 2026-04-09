export interface ICalendarProvider {
  fetchEvents(
    userId: string,
    windowStart: Date,
    windowEnd: Date,
  ): Promise<CalendarEvent[]>;
  createEvent(userId: string, event: CalendarEventInput): Promise<string>; // returns external_event_id
  refreshToken(userId: string): Promise<void>;
}
