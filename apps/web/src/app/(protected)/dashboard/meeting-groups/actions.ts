"use server";

import { revalidatePath } from "next/cache";
import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import {
  createMeetingGroupSchema,
  createMeetingParticipantSchema,
} from "@/lib/schemas";
import { MeetingGroup, MeetingParticipant } from "@/lib/types";
import { meetingParticipantsApi } from "../../../../lib/api/meeting-participants";

export async function createMeetingGroupAction(data: Partial<MeetingGroup>) {
  console.log(data);
  const payload = createMeetingGroupSchema.parse(data);
  const result = await meetingGroupsApi.create(payload);
  revalidatePath("/dashboard/meeting-groups");
  return result;
}

export async function updateMeetingGroupAction(
  id: string,
  data: Partial<MeetingGroup>,
) {
  const payload = createMeetingGroupSchema.parse(data);
  const result = await meetingGroupsApi.update(id, payload);
  revalidatePath("/dashboard/meeting-groups");
  return result;
}

export async function deleteMeetingGroupAction(id: string) {
  const result = await meetingGroupsApi.delete(id);
  revalidatePath("/dashboard/meeting-groups");
  return result;
}

export async function createMeetingGroupParticipantAction(
  data: Partial<MeetingParticipant>,
) {
  const payload = createMeetingParticipantSchema.parse(data);
  return await meetingParticipantsApi.create({
    ...payload,
    userId: payload.userId ?? undefined,
  });
}
