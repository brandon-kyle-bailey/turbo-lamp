export interface CalendarEvent {
  [key: string]: any;
}

export interface CalendarEventInput {
  [key: string]: any;
}
export interface ICalendarProvider {
  fetchEvents(): void;
  createEvent(): void;
  refreshToken(): void;
}
