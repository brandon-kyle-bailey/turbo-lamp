"use client";

import { redirect } from "next/navigation";
import { createContext, useContext } from "react";
import { Profile } from "@/lib/types";

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
