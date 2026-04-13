import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import ProfileContext from "../../contexts/profile-context";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <ProfileContext>
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
    </ProfileContext>
  );
}
