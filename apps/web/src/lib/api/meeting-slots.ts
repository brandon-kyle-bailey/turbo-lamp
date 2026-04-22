import { api } from "./client";
import type { MeetingSlot } from "@/lib/types";

export const meetingSlotsApi = {
  list: () => api.get<MeetingSlot[]>("/meeting-slots"),

  calculate: (meetingGroupId: string) =>
    api.get<MeetingSlot[]>(`/meeting-slots/${meetingGroupId}/calculate`),

  getByGroup: (meetingGroupId: string) =>
    api.get<MeetingSlot[]>(`/meeting-slots?meetingGroupId=${meetingGroupId}`),
};
