"use client";

import { redirect } from "next/navigation";
import { createContext, useContext } from "react";

export interface AvailabilityOverride {
  id: string;
}

export interface Calendar {
  id: string;
}

export interface Participation {
  id: string;
}

export interface Session {
  id: string;
}

export interface MeetingGroup {
  id: string;
}

export interface Attendance {
  id: string;
}

export interface User {
  id: string;
  availabilityOverrides: AvailabilityOverride[];
  calendars: Calendar[];
  participations: Participation[];
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
