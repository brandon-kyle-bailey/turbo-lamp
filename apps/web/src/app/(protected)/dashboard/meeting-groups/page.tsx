import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import { calendarsApi } from "@/lib/api/calendars";
import {
  createMeetingGroupAction,
  createMeetingGroupParticipantAction,
  deleteMeetingGroupAction,
  updateMeetingGroupAction,
} from "./actions";
import MeetingGroupsClient from "./meeting-groups-client";

export default async function Page() {
  const [initialData, calendars] = await Promise.all([
    meetingGroupsApi.list(),
    calendarsApi.list(),
  ]);

  return (
    <MeetingGroupsClient
      initialData={initialData}
      calendars={calendars}
      actions={{
        createMeetingGroupAction: createMeetingGroupAction,
        updateMeetingGroupAction: updateMeetingGroupAction,
        deleteMeetingGroupAction: deleteMeetingGroupAction,
        createMeetingGroupParticipantAction:
          createMeetingGroupParticipantAction,
      }}
    />
  );
}
