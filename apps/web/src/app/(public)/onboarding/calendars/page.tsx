"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { IconCalendar } from "@tabler/icons-react";

interface Calendar {
  calendarId: string;
  providerId: string;
  name?: string;
  description?: string;
  timezone?: string;
  primary?: boolean;
  accessRole?: string;
}

export default function CalendarSelectionCard() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/core/v1/calendars/external",
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          setCalendars([]);
          return;
        }

        const data = await res.json();
        setCalendars(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex justify-center items-center align-middle text-center h-screen">
      <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <IconCalendar className="h-6 w-6 text-background" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-balance">
            Connect your calendars
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Select the calendars you want to sync
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Select calendars to authorize</legend>

              {loading ? (
                <div className="text-sm text-muted-foreground">Loading</div>
              ) : (
                calendars.map((calendar) => (
                  <label
                    key={calendar.calendarId}
                    className={cn(
                      "flex items-center gap-4 w-full p-4 rounded-lg border transition-all cursor-pointer",
                      "hover:bg-secondary/50 has-checked:border-foreground/20 has-checked:bg-secondary/30",
                      "has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
                    )}
                  >
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-sm">{calendar.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {calendar.timezone}
                      </p>
                    </div>
                    <Checkbox
                      name="calendars"
                      value={calendar.calendarId}
                      className="shrink-0"
                    />
                  </label>
                ))
              )}
            </fieldset>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium"
              >
                Submit
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6 text-pretty">
            We only read calendar events to help you manage your schedule
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
