import { api } from "./client";
import type { Calendar, ExternalCalendar } from "@/lib/types";

export const calendarsApi = {
  list: () => api.get<Calendar[]>("/calendars"),

  get: (id: string) => api.get<Calendar>(`/calendars/${id}`),

  create: (data: Partial<Calendar>) => api.post<Calendar>("/calendars", data),
  upsert: (data: Partial<Calendar>) =>
    api.post<Calendar>("/calendars/upsert", data),
  batchCreate: (data: Calendar[]) =>
    api.post<Calendar[]>("/calendars/batch", data),

  batchUpsert: (data: Calendar[]) =>
    api.post<Calendar[]>("/calendars/batch/upsert", data),

  update: (id: string, data: Partial<Calendar>) =>
    api.put<Calendar>(`/calendars/${id}`, data),

  delete: (id: string) => api.del<void>(`/calendars/${id}`),

  getExternal: () => api.get<ExternalCalendar[]>("/calendars/external"),
};
