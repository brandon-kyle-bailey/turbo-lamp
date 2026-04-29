import { meetingAttendeesApi } from "@/lib/api/meeting-attendees";
import { AttendeesClient } from "./attendees-client";

export default async function Page() {
  const attendees = await meetingAttendeesApi.list();

  return <AttendeesClient initialAttendees={attendees} />;
}