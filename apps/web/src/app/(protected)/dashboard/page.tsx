/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import { meetingsApi } from "@/lib/api/meetings";
import { meetingParticipantsApi } from "@/lib/api/meeting-participants";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

export default async function Page() {
  const [meetingGroups, meetings, participants] = await Promise.all([
    meetingGroupsApi.list(),
    meetingsApi.list(),
    meetingParticipantsApi.list(),
  ]);

  const now = new Date();

  const activeGroups = meetingGroups.filter((g) => g.status !== "open").length;

  const upcomingMeetings = meetings.filter(
    (m) => new Date(m.start) > now,
  ).length;

  const pendingInvitations = participants.filter(
    (p) => p.invitationState === "pending",
  ).length;

  const scheduledMeetings = meetingGroups.filter(
    (g) => g.status === "finalized",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of scheduling activity</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Active Groups" value={activeGroups} icon={Users} />
        <MetricCard
          title="Upcoming Meetings"
          value={upcomingMeetings}
          icon={Calendar}
        />
        <MetricCard
          title="Pending Invitations"
          value={pendingInvitations}
          icon={Clock}
        />
        <MetricCard
          title="Scheduled"
          value={scheduledMeetings}
          icon={CheckCircle}
        />
      </div>

      {/* Recent Meeting Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Meeting Groups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetingGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No meeting groups yet
            </p>
          ) : (
            meetingGroups.slice(0, 5).map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div>
                  <p className="text-sm font-medium">{group.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(group.after).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {group.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No meetings scheduled
            </p>
          ) : (
            meetings
              .filter((m) => new Date(m.start) > now)
              .slice(0, 5)
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {meeting.meetingGroup?.summary}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(meeting.start).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
