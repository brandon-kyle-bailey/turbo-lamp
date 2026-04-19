"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Profile } from "@/lib/providers/profile-provider";
import { Calendar, Plus } from "lucide-react";

interface HeaderProps {
  user: Profile;
  onViewCalendar: () => void;
  onScheduleMeeting: () => void;
}

export function Header({
  user,
  onViewCalendar,
  onScheduleMeeting,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Welcome back, {user.user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }) || "\u00A0"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onViewCalendar} className="gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">View Calendar</span>
          <span className="sm:hidden">Calendar</span>
        </Button>
        <Button onClick={onScheduleMeeting} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Schedule Meeting</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  );
}
