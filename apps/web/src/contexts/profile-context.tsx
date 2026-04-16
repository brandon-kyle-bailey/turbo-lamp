import { Profile, ProfileProvider } from "@/providers/profile-provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export async function withProfile() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");

  const res = await fetch("http://localhost:3001/api/core/v1/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status !== 200) {
    redirect("/login");
  }
  const result = await res.json();
  const profile: Profile = {
    providerId: result.providerId,
    accountId: result.id,
    userId: result.userId,
    email: result.user.email,
    name: result.user.name,
    image: result.user.image,
  };
  return profile;
}

export default async function ProfileContext({ children }: LayoutProps) {
  const profile = await withProfile();
  return <ProfileProvider profile={profile}>{children}</ProfileProvider>;
}
