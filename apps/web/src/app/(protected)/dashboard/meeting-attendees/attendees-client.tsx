"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, User, Mail } from "lucide-react";
import { useState } from "react";
import type { MeetingAttendee } from "@/lib/types";

export function AttendeesClient({
  initialAttendees,
}: {
  initialAttendees: MeetingAttendee[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAttendees = searchQuery
    ? initialAttendees.filter(
        (a) =>
          a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : initialAttendees;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Attendees</h1>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {initialAttendees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">No attendees yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Attendees will appear when meetings are scheduled
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              All Attendees ({filteredAttendees.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-9">
                    <AvatarImage src={attendee.user?.image} />
                    <AvatarFallback>
                      {attendee.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attendee.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="size-3" />
                      {attendee.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}