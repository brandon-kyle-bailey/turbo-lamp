import { AppSidebar } from "@/components/dashboard/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileContext from "@/lib/context/profile-context";
import { ReactNode } from "react";
import { Header } from "@/components/dashboard/header";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <ProfileContext>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SidebarInset className="p-6 space-y-6">
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProfileContext>
  );
}
