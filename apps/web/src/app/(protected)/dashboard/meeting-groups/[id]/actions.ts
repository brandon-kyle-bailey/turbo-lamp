"use server";

import { meetingSlotsApi } from "@/lib/api/meeting-slots";
import { meetingsApi } from "@/lib/api/meetings";
import { createMeetingSchema } from "@/lib/schemas";
import { MeetingSlot } from "@/lib/types";

export async function listSlotsAction(id: string) {
  return await meetingSlotsApi.list(id);
}

export async function calculateSlotsAction(id: string) {
  return await meetingSlotsApi.calculate(id);
}

export async function createMeetingAction(data: Partial<MeetingSlot>) {
  const payload = createMeetingSchema.parse({
    meetingGroupId: data.meetingGroupId!,
    start: data.start!,
    end: data.end!,
    status: "scheduled",
  });
  return await meetingsApi.create(payload);
}
