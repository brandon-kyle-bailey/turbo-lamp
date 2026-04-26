/* eslint-disable @typescript-eslint/no-explicit-any */
import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import { meetingParticipantsApi } from "@/lib/api/meeting-participants";
import { meetingsApi } from "@/lib/api/meetings";
import DashboardClient from "./dashboard-client";

export default async function Page() {
  const [meetingGroups, meetings, participations] = await Promise.all([
    meetingGroupsApi.list(),
    meetingsApi.list(),
    meetingParticipantsApi.list(),
  ]);

  return (
    <DashboardClient
      initialData={{
        meetingGroups,
        meetings,
        participations,
      }}
    />
  );
}
