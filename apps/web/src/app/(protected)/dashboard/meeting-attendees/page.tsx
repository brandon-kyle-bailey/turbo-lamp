import { meetingAttendeesApi } from "@/lib/api/meeting-attendees";
import { AttendeesClient } from "./attendees-client";

export default async function Page() {
  const paginated = await meetingAttendeesApi.list({ page: 1, perPage: 100 });
  const attendees = paginated.data;

  return <AttendeesClient initialAttendees={attendees} />;
}