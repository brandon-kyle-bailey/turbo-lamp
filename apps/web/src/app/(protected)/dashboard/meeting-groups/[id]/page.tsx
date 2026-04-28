"use server";
import { MeetingGroupDetail } from "@/components/meeting-groups/meeting-group-detail";
import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import { meetingSlotsApi } from "../../../../../lib/api/meeting-slots";
import { calculateSlotsAction, createMeetingAction } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [group, slots] = await Promise.all([
    meetingGroupsApi.get(id),
    meetingSlotsApi.list(id),
  ]);

  return (
    <MeetingGroupDetail
      group={group}
      initialSlots={slots}
      initialParticipants={group.participants}
      actions={{
        calculateSlotsAction: calculateSlotsAction,
        createMeetingAction: createMeetingAction,
      }}
    />
  );
}
