"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Meeting } from "@/lib/providers/profile-provider";

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

function getMeetingsForDate(date: Date, meetings: Meeting[]) {
  return meetings.filter((m) => {
    const d = new Date(m.start);
    return (
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  });
}

export default function CalendarPage() {
  const today = new Date();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState<Date>(() => today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getMeetings = async () => {
    const res = await fetch("http://localhost:3001/api/core/v1/meetings", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("failed to fetch meetings");
      return [];
    }

    return res.json();
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getMeetings();
      setMeetings(data);
      setLoading(false);
    })();
  }, []);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectedDateMeetings = selectedDate
    ? getMeetingsForDate(selectedDate, meetings)
    : [];

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

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
                <Label>Date</Label>
                <Input type="date" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
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
            {loading && (
              <div className="p-3 text-sm text-muted-foreground">
                Loading meetings...
              </div>
            )}

            <div className="grid grid-cols-7 gap-px rounded-lg border bg-muted overflow-hidden">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="bg-background p-2 text-center text-xs text-muted-foreground font-medium"
                >
                  {d}
                </div>
              ))}

              {calendarDays.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="bg-background min-h-20 p-2"
                    />
                  );
                }

                const date = new Date(year, month, day);

                const isToday = date.toDateString() === today.toDateString();

                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();

                const dayMeetings = getMeetingsForDate(date, meetings);
                const key = `${year}-${month}-${day}`;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(date)}
                    className={`bg-background min-h-20 p-2 text-left hover:bg-muted/50 transition ${
                      isSelected ? "ring-2 ring-ring" : ""
                    }`}
                  >
                    <div
                      className={`size-7 flex items-center justify-center rounded-full text-sm ${
                        isToday ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {day}
                    </div>

                    <div className="mt-1 space-y-1">
                      {dayMeetings.slice(0, 2).map((m) => (
                        <div
                          key={m.id}
                          className="truncate text-xs bg-primary/10 text-primary px-1 rounded"
                        >
                          {m.meetingGroup?.summary ?? "Meeting"}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
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
              selectedDateMeetings.map((m) => (
                <div
                  key={m.id}
                  className="border rounded-lg p-3 hover:bg-muted/50"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">
                        {m.meetingGroup?.summary ?? "Meeting"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(m.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(m.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <Badge>{m.status}</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground mt-2">
                    {m.attendees?.length ?? 0} attendees
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
