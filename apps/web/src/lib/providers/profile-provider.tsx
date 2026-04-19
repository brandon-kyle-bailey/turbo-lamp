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
}

export interface MeetingParticipant {
  id: string;
  user: User;
  userId: string;
  email: string;
  required: boolean;
  oauth_connected: boolean;
}

export interface Session {
  id: string;
}

export interface Meeting {
  id: string;
  location: string;
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
}

export interface User {
  id: string;
  availabilityOverrides: AvailabilityOverride[];
  availabilities: Availability[];
  calendars: Calendar[];
  participations: MeetingParticipant[];
  sessions: Session[];
  meetingGroups: MeetingGroup[];
  attendances: Attendance[];
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
