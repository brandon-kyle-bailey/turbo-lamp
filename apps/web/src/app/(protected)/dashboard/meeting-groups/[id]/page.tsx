"use server";
import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import { meetingParticipantsApi } from "@/lib/api/meeting-participants";
import { MeetingGroupDetail } from "@/components/meeting-groups/meeting-group-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [group, allParticipants] = await Promise.all([
    meetingGroupsApi.get(id),
    meetingParticipantsApi.list(),
  ]);

  const participants = allParticipants.filter((p) => p.meetingGroupId === id);

  return (
    <MeetingGroupDetail group={group} initialParticipants={participants} />
  );
}
