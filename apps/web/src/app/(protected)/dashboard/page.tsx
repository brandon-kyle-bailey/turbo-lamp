"use client";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Header } from "@/components/dashboard/header";
import { InvitationCard } from "@/components/dashboard/invitation-card";
import { MeetingCard } from "@/components/dashboard/meeting-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  MeetingParticipant,
  useProfile,
} from "@/lib/providers/profile-provider";
import { CalendarDays, CalendarRange, Clock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const profile = useProfile();
  const router = useRouter();
  const [invitations, setInvitations] = useState<MeetingParticipant[]>(
    profile.user.participations,
  );

  const today = new Date();
  const todaysMeetingGroups = profile.user.meetingGroups.filter((mg) => mg);
  const upcomingMeetingGroups = profile.user.meetingGroups.filter((mg) => mg);

  const handleViewCalendar = () => {
    router.push("/dashboard/calendar");
  };

  const handleScheduleMeeting = () => {
    // Open schedule meeting modal/page would go here
  };

  const handleAcceptInvitation = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleDeclineInvitation = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="space-y-8">
          {/* Header */}
          <Header
            user={profile}
            onViewCalendar={handleViewCalendar}
            onScheduleMeeting={handleScheduleMeeting}
          />

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {todaysMeetingGroups.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                  <CalendarRange className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {upcomingMeetingGroups.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                  <Mail className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {invitations.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                  <Clock className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {
                      todaysMeetingGroups.filter(
                        (m) => m.status === "completed",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Today's Meetings */}
            <div className="space-y-4 lg:col-span-2">
              <SectionHeader
                title="Today's Schedule"
                count={todaysMeetingGroups.length}
                icon={<CalendarDays className="h-5 w-5" />}
              />
              {todaysMeetingGroups.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {todaysMeetingGroups.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      variant="today"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CalendarDays className="h-10 w-10" />}
                  title="No meetings today"
                  description="Your schedule is clear for today. Time to be productive!"
                />
              )}

              {/* Upcoming Meetings */}
              <div className="pt-4">
                <SectionHeader
                  title="Upcoming"
                  count={upcomingMeetingGroups.length}
                  icon={<CalendarRange className="h-5 w-5" />}
                />
              </div>
              {upcomingMeetingGroups.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {upcomingMeetingGroups.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      variant="upcoming"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CalendarRange className="h-10 w-10" />}
                  title="No upcoming meetings"
                  description="Schedule a new meeting to get started."
                />
              )}
            </div>

            {/* Right Column - Pending Invitations */}
            <div className="space-y-4">
              <SectionHeader
                title="Pending Invitations"
                count={invitations.length}
                icon={<Mail className="h-5 w-5" />}
              />
              {invitations.length > 0 ? (
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={invitation}
                      onAccept={handleAcceptInvitation}
                      onDecline={handleDeclineInvitation}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Mail className="h-10 w-10" />}
                  title="No pending invitations"
                  description="You're all caught up on invitations."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
