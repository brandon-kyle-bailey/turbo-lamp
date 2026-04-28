import { AppSidebar } from "@/components/dashboard/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProfileProvider } from "@/lib/providers/profile-provider";
import { ReactNode } from "react";
import { Header } from "@/components/dashboard/header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authApi } from "@/lib/api/auth";

interface ProtectedLayoutProps {
  children: ReactNode;
}

async function validateSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      redirect("/login");
    }

    const profile = await authApi.profile();
    return profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    redirect("/login");
  }
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const profile = await validateSession();

  return (
    <ProfileProvider profile={profile}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SidebarInset className="p-6 space-y-6">
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
