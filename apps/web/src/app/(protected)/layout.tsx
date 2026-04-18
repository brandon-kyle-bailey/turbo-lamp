import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileContext from "@/contexts/profile-context";
import { ReactNode } from "react";
import { ModeToggle } from "../../components/mode-toggle";

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
        <SidebarInset className="p-2">
          <header className="flex justify-between">
            <SidebarTrigger />
            <ModeToggle />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProfileContext>
  );
}
