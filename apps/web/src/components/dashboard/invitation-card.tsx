"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MeetingParticipant } from "@/lib/providers/profile-provider";
import { Calendar, Check, X } from "lucide-react";

interface InvitationCardProps {
  invitation: MeetingParticipant;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export function InvitationCard({
  invitation,
  onAccept,
  onDecline,
}: InvitationCardProps) {
  const startTime = new Date(invitation.meetingGroup.after);

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="transition-all hover:border-foreground/20 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage
                src={invitation.meetingGroup.creator.image}
                alt={invitation.meetingGroup.creator.name}
              />
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {getInitials(invitation.meetingGroup.creator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-foreground">
                  {invitation.meetingGroup.creator.name}
                </span>{" "}
                <span className="text-muted-foreground">invited you to</span>
              </p>
              <h3 className="font-medium text-foreground truncate">
                {invitation.meetingGroup.summary}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateTime(startTime)}</span>
            <span className="text-border">·</span>
            <span>{timeAgo(invitation.createdAt.toISOString())}</span>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => onAccept(invitation.id)}
              className="flex-1 gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDecline(invitation.id)}
              className="flex-1 gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
