import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Profile, ProfileProvider } from "@/providers/profile-provider";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/");

  const res = await fetch("http://localhost:3001/api/core/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status !== 200) {
    redirect("/");
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

  return (
    <ProfileProvider profile={profile}>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col h-full w-full">
            <SidebarTrigger />
            <AppHeader />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
}
