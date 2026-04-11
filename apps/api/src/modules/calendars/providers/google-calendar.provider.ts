import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  Calendar,
  CalendarEvent,
  CalendarProvider,
  CreateEventParams,
  DeleteEventParams,
  GetEventParams,
  ListCalendarsParams,
  ListEventsParams,
  UpdateEventParams,
} from '../external-calendar.service';
import { GoogleAuthManager } from '../../auth/managers/google-auth.manager';

type GoogleCalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

type GoogleCalendarListItem = {
  id: string;
  summary?: string;
  description?: string;
  timeZone?: string;
  accessRole?: string;
  primary?: boolean;
};

type GoogleCalendarListResponse = {
  items: GoogleCalendarListItem[];
};

@Injectable()
export class GoogleCalendarProvider implements CalendarProvider {
  private readonly baseUrl = 'https://www.googleapis.com/calendar/v3';

  constructor(
    private readonly http: HttpService,
    private readonly auth: GoogleAuthManager,
  ) {}

  async listCalendars(params: ListCalendarsParams): Promise<Calendar[]> {
    const accessToken = await this.auth.getValidAccessToken(params.account);

    const { data } = await firstValueFrom<{ data: GoogleCalendarListResponse }>(
      this.http.get(`${this.baseUrl}/users/me/calendarList`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return (data.items ?? []).map((c) => ({
      id: c.id,
      summary: c.summary,
      description: c.description,
      timeZone: c.timeZone,
      accessRole: c.accessRole,
      primary: c.primary || false,
    }));
  }

  async listEvents(params: ListEventsParams): Promise<CalendarEvent[]> {
    const accessToken = await this.auth.getValidAccessToken(params.account);

    const { timeMin, timeMax, calendarId = 'primary' } = params;

    const { data } = await firstValueFrom<{
      data: { items: GoogleCalendarEvent[] };
    }>(
      this.http.get(`${this.baseUrl}/calendars/${calendarId}/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        },
      }),
    );

    return (data.items ?? []).map((e) => ({
      id: e.id,
      summary: e.summary,
      description: e.description,
      start: {
        dateTime: e.start?.dateTime ?? '',
      },
      end: {
        dateTime: e.end?.dateTime ?? '',
      },
    }));
  }

  async getEvent(params: GetEventParams): Promise<CalendarEvent> {
    const accessToken = await this.auth.getValidAccessToken(params.account);

    const { eventId, calendarId = 'primary' } = params;

    const { data } = await firstValueFrom<{ data: GoogleCalendarEvent }>(
      this.http.get(
        `${this.baseUrl}/calendars/${calendarId}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return {
      id: data.id,
      summary: data.summary,
      description: data.description,
      start: { dateTime: data.start?.dateTime ?? '' },
      end: { dateTime: data.end?.dateTime ?? '' },
    };
  }

  async createEvent(params: CreateEventParams): Promise<CalendarEvent> {
    const accessToken = await this.auth.getValidAccessToken(params.account);

    const { calendarId = 'primary', event } = params;

    const { data } = await firstValueFrom<{ data: GoogleCalendarEvent }>(
      this.http.post(`${this.baseUrl}/calendars/${calendarId}/events`, event, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    return {
      id: data.id,
      summary: data.summary,
      description: data.description,
      start: { dateTime: data.start?.dateTime ?? '' },
      end: { dateTime: data.end?.dateTime ?? '' },
    };
  }

  async updateEvent(params: UpdateEventParams): Promise<CalendarEvent> {
    const accessToken = await this.auth.getValidAccessToken(params.account);

    const { eventId, calendarId = 'primary', patch } = params;

    const { data } = await firstValueFrom<{ data: GoogleCalendarEvent }>(
      this.http.patch(
        `${this.baseUrl}/calendars/${calendarId}/events/${eventId}`,
        patch,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return {
      id: data.id,
      summary: data.summary,
      description: data.description,
      start: { dateTime: data.start?.dateTime ?? '' },
      end: { dateTime: data.end?.dateTime ?? '' },
    };
  }

  async deleteEvent(params: DeleteEventParams): Promise<{ success: true }> {
    const accessToken = await this.auth.getValidAccessToken(params.account);

    const { eventId, calendarId = 'primary' } = params;

    await firstValueFrom(
      this.http.delete(
        `${this.baseUrl}/calendars/${calendarId}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return { success: true };
  }
}
