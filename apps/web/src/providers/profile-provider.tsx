"use client";

import { redirect } from "next/navigation";
import { createContext, useContext } from "react";

export interface Profile {
  providerId: string;
  accountId: string;
  userId: string;
  email: string;
  name: string;
  image?: string;
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
