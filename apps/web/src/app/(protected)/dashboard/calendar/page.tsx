"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MeetingGroup, useProfile } from "@/lib/providers/profile-provider";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getMeetingsForDate(date: Date, meetings: MeetingGroup[]) {
  return meetings.filter((m) => {
    const meetingDate = new Date(m.after);
    return (
      meetingDate.getFullYear() === date.getFullYear() &&
      meetingDate.getMonth() === date.getMonth() &&
      meetingDate.getDate() === date.getDate()
    );
  });
}

export default function CalendarPage() {
  const profile = useProfile();
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(() => today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const selectedDateMeetings = selectedDate
    ? getMeetingsForDate(selectedDate, profile.user.meetingGroups)
    : [];

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

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
              Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              View and manage your meetings
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Schedule Meeting
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg font-medium">
                {MONTHS[month]} {year}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px rounded-lg border bg-muted overflow-hidden">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="bg-background p-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="bg-background p-2 min-h-20"
                    />
                  );
                }

                const date = new Date(year, month, day);
                const isToday =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
                const isSelected =
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear();
                const dayMeetings = getMeetingsForDate(
                  date,
                  profile.user.meetingGroups,
                );

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`bg-background p-2 min-h-20 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset ${
                      isSelected ? "ring-2 ring-ring ring-inset" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex size-7 items-center justify-center rounded-full text-sm ${
                        isToday
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayMeetings.slice(0, 2).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="truncate rounded bg-primary/10 px-1 py-0.5 text-xs text-primary"
                        >
                          {meeting.summary}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayMeetings.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No meetings scheduled
                </p>
              ) : (
                selectedDateMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm">
                          {meeting.summary}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(meeting.after).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(meeting.before).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={
                          meeting.status === "completed"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {meeting.participants.length} participant
                      {meeting.participants.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
