import type { MeetingSlot } from "@/lib/types";
import { serverRequest } from "./client";

export const meetingSlotsApi = {
  list: async () => {
    return await serverRequest<MeetingSlot[]>(`/meeting-slots`, "GET");
  },

  get: async (id: string) =>
    await serverRequest<MeetingSlot>(`/meeting-slots/${id}`, "GET"),

  calculate: async (meetingGroupId: string) =>
    await serverRequest<MeetingSlot[]>(
      `/meeting-slots/${meetingGroupId}/calculate`,
      "GET",
    ),

  getByGroup: async (meetingGroupId: string) =>
    await serverRequest<MeetingSlot[]>(
      `/meeting-slots?meetingGroupId=${meetingGroupId}`,
      "GET",
    ),
};

