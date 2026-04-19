"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Clock, Users, Sparkles } from "lucide-react";

export function CalendarDemo() {
  const timeSlots = [
    { time: "9:00 AM", available: false },
    { time: "10:00 AM", available: false },
    { time: "11:00 AM", available: true, optimal: true },
    { time: "12:00 PM", available: false },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: false },
    { time: "4:00 PM", available: true },
  ];

  const participants = [
    { name: "Sarah K.", initials: "SK", color: "bg-accent" },
    { name: "Mike R.", initials: "MR", color: "bg-chart-2" },
    { name: "Lisa T.", initials: "LT", color: "bg-chart-3" },
  ];

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Q4 Planning Meeting
              </h3>
              <p className="text-sm text-muted-foreground">
                Finding the best time for everyone
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            60 min
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Participants</span>
          <div className="ml-2 flex -space-x-2">
            {participants.map((p) => (
              <Avatar key={p.initials} className="h-7 w-7 border-2 border-card">
                <AvatarFallback
                  className={`${p.color} text-xs text-foreground`}
                >
                  {p.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              className={`relative rounded-lg border p-3 text-center transition-all ${
                slot.optimal
                  ? "border-accent bg-accent/10 ring-2 ring-accent"
                  : slot.available
                    ? "border-border bg-secondary/50 hover:border-muted-foreground"
                    : "border-border/50 bg-muted/30 opacity-50"
              }`}
              disabled={!slot.available}
            >
              <span
                className={`text-xs font-medium ${slot.optimal ? "text-accent" : slot.available ? "text-foreground" : "text-muted-foreground"}`}
              >
                {slot.time}
              </span>
              {slot.optimal && (
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                  <Check className="h-2.5 w-2.5 text-accent-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-accent/5 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                AI Recommendation
              </p>
              <p className="text-xs text-muted-foreground">
                Tuesday at 11:00 AM works best for all
              </p>
            </div>
          </div>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
            Schedule
          </button>
        </div>
      </div>
    </Card>
  );
}
