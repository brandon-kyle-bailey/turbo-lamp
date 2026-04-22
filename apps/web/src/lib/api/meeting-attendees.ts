import { api } from "./client";
import type { MeetingAttendee } from "@/lib/types";

export const meetingAttendeesApi = {
  list: () => api.get<MeetingAttendee[]>("/meeting-attendees"),

  create: (data: Partial<MeetingAttendee>) =>
    api.post<MeetingAttendee>("/meeting-attendees", data),

  update: (id: string, data: Partial<MeetingAttendee>) =>
    api.put<MeetingAttendee>(`/meeting-attendees/${id}`, data),

  delete: (id: string) => api.del<void>(`/meeting-attendees/${id}`),
};
