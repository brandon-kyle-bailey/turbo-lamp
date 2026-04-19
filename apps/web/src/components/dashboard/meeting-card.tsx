"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MeetingGroup } from "@/lib/providers/profile-provider";
import { Clock, Users, Video } from "lucide-react";

interface MeetingCardProps {
  meeting: MeetingGroup;
  variant?: "today" | "upcoming";
}

export function MeetingCard({ meeting, variant = "today" }: MeetingCardProps) {
  const startTime = new Date(meeting.after);
  const endTime = new Date(meeting.before);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    switch (meeting.status) {
      case "in-progress":
        return (
          <Badge variant="default" className="bg-chart-2 text-foreground">
            In Progress
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const visibleParticipants = meeting.participants.slice(0, 3);
  const remainingCount = meeting.participants.length - 3;

  return (
    <Card className="group transition-all hover:border-foreground/20 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate text-balance">
                {meeting.summary}
              </h3>
              {meeting.description && (
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {meeting.description}
                </p>
              )}
            </div>
            {getStatusBadge()}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span suppressHydrationWarning>
                {variant === "upcoming" && `${formatDate(startTime)} · `}
                {formatTime(startTime)} - {formatTime(endTime)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{meeting.participants.length} participants</span>
            </div>
            {meeting.meeting?.location && (
              <div className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" />
                <span>Video call</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex -space-x-2">
              {visibleParticipants.map((participant) => (
                <Avatar
                  key={participant.id}
                  className="h-7 w-7 border-2 border-card ring-0"
                >
                  <AvatarImage
                    src={participant.user.image}
                    alt={participant.user.name}
                  />
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                    {getInitials(participant.user.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingCount > 0 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                  +{remainingCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
