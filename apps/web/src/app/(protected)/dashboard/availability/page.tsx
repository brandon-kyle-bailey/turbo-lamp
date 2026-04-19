"use client";

import { useState } from "react";
import { Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { weeklyAvailability as initialAvailability } from "@/lib/mock-data";
import type { WeeklyAvailability } from "@/lib/types";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const TIMES = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const ampm = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute}`,
    label: `${displayHour}:${minute} ${ampm}`,
  };
});

export default function AvailabilityPage() {
  const [availability, setAvailability] =
    useState<WeeklyAvailability[]>(initialAvailability);
  const [hasChanges, setHasChanges] = useState(false);

  const updateAvailability = (
    dayOfWeek: number,
    field: keyof WeeklyAvailability,
    value: string | boolean,
  ) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a,
      ),
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
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
              My Availability
            </h1>
            <p className="text-sm text-muted-foreground">
              Set your weekly availability for meetings
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Schedule</CardTitle>
          <CardDescription>
            Define the hours you&apos;re available for meetings each day of the
            week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availability.map((day) => (
            <div
              key={day.id}
              className={`flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center ${
                day.isEnabled ? "bg-background" : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 sm:w-40">
                <Switch
                  id={`day-${day.dayOfWeek}`}
                  checked={day.isEnabled}
                  onCheckedChange={(checked) =>
                    updateAvailability(day.dayOfWeek, "isEnabled", checked)
                  }
                />
                <Label
                  htmlFor={`day-${day.dayOfWeek}`}
                  className={`font-medium ${!day.isEnabled ? "text-muted-foreground" : ""}`}
                >
                  {DAYS[day.dayOfWeek]}
                </Label>
              </div>

              {day.isEnabled ? (
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <Select
                      value={day.startTime}
                      onValueChange={(value) =>
                        updateAvailability(day.dayOfWeek, "startTime", value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMES.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <Select
                    value={day.endTime}
                    onValueChange={(value) =>
                      updateAvailability(day.dayOfWeek, "endTime", value)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMES.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Unavailable
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timezone</CardTitle>
          <CardDescription>
            All times are displayed in your selected timezone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="America/New_York">
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">
                Eastern Time (ET)
              </SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">
                Pacific Time (PT)
              </SelectItem>
              <SelectItem value="Europe/London">
                Greenwich Mean Time (GMT)
              </SelectItem>
              <SelectItem value="Europe/Paris">
                Central European Time (CET)
              </SelectItem>
              <SelectItem value="Asia/Tokyo">
                Japan Standard Time (JST)
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
