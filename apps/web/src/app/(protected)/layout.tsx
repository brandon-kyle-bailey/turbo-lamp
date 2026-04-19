import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProfileContext from "@/lib/context/profile-context";
import { ReactNode } from "react";

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
        <SidebarInset className="p-4">{children}</SidebarInset>
      </SidebarProvider>
    </ProfileContext>
  );
}
