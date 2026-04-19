"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProfile } from "@/lib/providers/profile-provider";
import {
  Calendar,
  Clock,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MeetingGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const profile = useProfile();

  const filteredGroups = searchQuery
    ? profile.user.meetingGroups.filter(
        (g) =>
          g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : profile.user.meetingGroups;

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
              Meeting Groups
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize and manage recurring meeting series
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Group
        </Button>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">No meeting groups found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create a group to organize recurring meetings
            </p>
            <Button className="mt-4 gap-2">
              <Plus className="size-4" />
              Create Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="group transition-colors hover:bg-muted/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{group.summary}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {group.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit group</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {formatDate(group.after.toISOString())}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />1 meeting
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {group.participants.slice(0, 4).map((p) => (
                        <Avatar
                          key={p.id}
                          className="size-7 border-2 border-background"
                        >
                          <AvatarImage src={p.user.image} alt={p.user.name} />
                          <AvatarFallback className="text-xs">
                            {p.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    {group.participants.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{group.participants.length - 4}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant={
                      group.status === "completed"
                        ? "secondary"
                        : group.status === "cancelled"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {group.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
