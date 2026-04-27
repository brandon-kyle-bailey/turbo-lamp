"use server";

import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import {
  createMeetingGroupSchema,
  createMeetingParticipantSchema,
} from "@/lib/schemas";
import { MeetingGroup, MeetingParticipant } from "@/lib/types";
import { meetingParticipantsApi } from "../../../../lib/api/meeting-participants";

export async function createMeetingGroupAction(data: Partial<MeetingGroup>) {
  const payload = createMeetingGroupSchema.parse(data);
  return await meetingGroupsApi.create(payload);
}

export async function updateMeetingGroupAction(
  id: string,
  data: Partial<MeetingGroup>,
) {
  const payload = createMeetingGroupSchema.parse(data);
  return await meetingGroupsApi.update(id, payload);
}

export async function deleteMeetingGroupAction(id: string) {
  return await meetingGroupsApi.delete(id);
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
