import { ProfileProvider } from "@/lib/providers/profile-provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authApi } from "../api/auth";

interface LayoutProps {
  children: ReactNode;
}

export async function withProfile() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");
  return await authApi.profile(token);
}

export default async function ProfileContext({ children }: LayoutProps) {
  const profile = await withProfile();
  return <ProfileProvider profile={profile}>{children}</ProfileProvider>;
}
