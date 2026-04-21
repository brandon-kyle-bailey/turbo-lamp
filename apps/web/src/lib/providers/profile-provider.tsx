"use client";

import { redirect } from "next/navigation";
import { createContext, useContext } from "react";

export interface AvailabilityOverride {
  id: string;
}

export interface Availability {
  id: string;
}

export interface Calendar {
  id: string;
  providerId: string;
  enabled: boolean;
  timezone: string;
  name: string;
  userId: string;
  externalId: string;
}

export interface MeetingParticipant {
  id: string;
  creatorId: string;
  meetingGroupId: string;
  meetingGroup: MeetingGroup;
  createdAt: Date;
  userId: string;
  user: User;
  email: string;
  required: boolean;
  oauth_connected: boolean;
}

export interface Session {
  id: string;
}

export interface MeetingAttendee {
  id: string;
  userId: string;
  user: User;
}

export interface Meeting {
  id: string;
  location: string;
  status: string;
  start: Date;
  end: Date;
  attendees: MeetingAttendee[];
  meetingGroup: MeetingGroup;
}

export interface MeetingSlot {
  id: string;
}

export interface MeetingGroup {
  id: string;
  creatorId: string;
  creator: User;
  calendarId: string;
  calendar: Calendar;
  summary: string;
  description: string;
  duration: number;
  after: Date;
  before: Date;
  tmezone: string;
  status: string;
  meeting: Meeting;
  slots: MeetingSlot[];
  participants: MeetingParticipant[];
}

export interface Attendance {
  id: string;
  meeting: Meeting;
}

export interface MeetingGroupSlot {
  id: string;
  meetingGroupId: string;
  start: Date;
  end: Date;
  rank: number;
}

export interface User {
  id: string;
  meetings: Meeting[];
  availabilityOverrides: AvailabilityOverride[];
  availabilities: Availability[];
  calendars: Calendar[];
  participations: MeetingParticipant[];
  sessions: Session[];
  meetingGroups: MeetingGroup[];
  attendances: Attendance[];
  slots: MeetingGroupSlot[];
  name: string;
  email: string;
  emailVerified: string;
  image?: string;
}

export interface Profile {
  id: string;
  userId: string;
  user: User;
  accountId: string;
  providerId: string;
}

const ProfileContext = createContext<Profile | null>(null);

export function ProfileProvider({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) redirect("/login");
  return ctx;
}
