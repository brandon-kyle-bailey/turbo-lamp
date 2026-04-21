"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Attendance,
  Meeting,
  useProfile,
} from "@/lib/providers/profile-provider";
import {
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MeetingRow({ meeting }: { meeting: Meeting }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">
            {meeting.meetingGroup.summary}
          </h3>
          <Badge
            variant={
              meeting.status === "completed"
                ? "secondary"
                : meeting.status === "cancelled"
                  ? "destructive"
                  : "default"
            }
          >
            {meeting.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {meeting.meetingGroup.description}
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {formatDate(meeting.start.toISOString())}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatTime(meeting.start.toISOString())} -{" "}
            {formatTime(meeting.end.toISOString())}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {meeting.attendees.length}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {meeting.attendees.slice(0, 3).map((p) => (
            <Avatar key={p.id} className="size-8 border-2 border-background">
              <AvatarImage src={p.user.image} alt={p.user.name} />
              <AvatarFallback className="text-xs">
                {p.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}
          {meeting.attendees.length > 3 && (
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
              +{meeting.attendees.length - 3}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit meeting</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Cancel meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function CreateMeetingDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Availability Override</DialogTitle>
          <DialogDescription>
            Block off a date or set custom hours for a specific day.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value=""
              onChange={() => {
                console.log("change");
              }}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button>Add Meeting Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const profile = useProfile();

  const scheduled = profile.user.attendances.filter(
    (m) => m.meeting.status === "scheduled",
  );
  const completed = profile.user.attendances.filter(
    (m) => m.meeting.status === "completed",
  );
  const cancelled = profile.user.attendances.filter(
    (m) => m.meeting.status === "cancelled",
  );

  const filterMeetings = (meetings: Attendance[]) => {
    if (!searchQuery) return meetings;
    return meetings.filter(
      (m) =>
        m.meeting.meetingGroup.summary
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        m.meeting.meetingGroup.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Meetings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all your scheduled meetings
            </p>
          </div>
        </div>
        <CreateMeetingDialog />
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="scheduled" className="flex-1">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="mt-4 space-y-3">
          {filterMeetings(scheduled).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="size-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg">No scheduled meetings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a new meeting to get started
                </p>
                <CreateMeetingDialog />
              </CardContent>
            </Card>
          ) : (
            filterMeetings(scheduled).map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting.meeting} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {filterMeetings(completed).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="size-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg">No completed meetings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Completed meetings will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            filterMeetings(completed).map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting.meeting} />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4 space-y-3">
          {filterMeetings(cancelled).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="size-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg">No cancelled meetings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cancelled meetings will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            filterMeetings(cancelled).map((meeting) => (
              <MeetingRow key={meeting.id} meeting={meeting.meeting} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
