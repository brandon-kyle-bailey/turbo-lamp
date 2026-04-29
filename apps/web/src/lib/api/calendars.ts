import { createCalendarSchema } from "@/lib/schemas";
import type { Calendar, ExternalCalendar } from "@/lib/types";
import { serverRequest } from "./client";

export const calendarsApi = {
  list: async () => {
    return await serverRequest<Calendar[]>(`/calendars`, "GET");
  },

  get: async (id: string) =>
    await serverRequest<Calendar>(`/calendars/${id}`, "GET"),

  create: async (data: Partial<Calendar>) => {
    const payload = createCalendarSchema.parse(data);
    return await serverRequest<Calendar>("/calendars", "POST", payload);
  },

  batchUpsert: async (data: Partial<Calendar>[]) => {
    const payload = data.map((c) => createCalendarSchema.parse(c));
    return await serverRequest<Calendar[]>(
      "/calendars/batch/upsert",
      "POST",
      payload,
    );
  },

  upsert: async (data: Partial<Calendar>) => {
    const payload = createCalendarSchema.parse(data);
    return await serverRequest<Calendar>("/calendars/upsert", "POST", payload);
  },

  update: async (id: string, data: Partial<Calendar>) => {
    return await serverRequest<Calendar>(`/calendars/${id}`, "PATCH", data);
  },

  delete: async (id: string) =>
    await serverRequest<void>(`/calendars/${id}`, "DELETE"),

  listExternal: async () =>
    await serverRequest<ExternalCalendar[]>("/calendars/external", "GET"),
};
