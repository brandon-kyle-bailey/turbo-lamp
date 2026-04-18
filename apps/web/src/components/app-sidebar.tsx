"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CalendarIcon,
  ChevronRight,
  FolderIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";

import { usePathname } from "next/navigation";

const menuItems = [
  { text: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { text: "Meetings", url: "/dashboard/meetings", icon: CalendarIcon },
  { text: "Directory", url: "/dashboard/directory", icon: FolderIcon },
  { text: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader>
        <h1 className="group-data-[state=collapsed]:hidden">
          Meeting Scheduler
        </h1>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((item) => {
          return (
            <SidebarGroup key={item.text}>
              <SidebarGroupLabel>{item.text}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem key={item.text}>
                    <SidebarMenuButton
                      tooltip={item.text}
                      isActive={item.url === pathname}
                    >
                      <a
                        href={item.url}
                        className="flex text-center items-center gap-2"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.text}</span>
                      </a>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
