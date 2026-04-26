"use client";

import { Availability } from "@/lib/types";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { DAYS, TIMES } from "@/lib/constants";

type Actions = {
  update: (data: Availability) => Promise<Availability>;
};

export default function AvailabilityClient({
  initialData,
  actions,
}: {
  initialData: Availability[];
  actions: Actions;
}) {
  console.log(initialData, actions);

  const [availability, setAvailability] = useState<Availability[]>(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  const updateAvailability = (
    id: string,
    field: keyof Availability,
    value: string | boolean,
  ) => {
    setAvailability((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    await Promise.all(availability.map((a) => actions.update(a)));
    setHasChanges(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
        <Save className="size-4" />
        Save Changes
      </Button>

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
                day.isAvailable ? "bg-background" : "bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 sm:w-40">
                <Switch
                  id={`day-${day.dayOfWeek}`}
                  checked={day.isAvailable}
                  onCheckedChange={(checked) =>
                    updateAvailability(
                      day.id,
                      "isAvailable",
                      checked as boolean,
                    )
                  }
                />
                <Label
                  htmlFor={`day-${day.dayOfWeek}`}
                  className={`font-medium ${!day.isAvailable ? "text-muted-foreground" : ""}`}
                >
                  {DAYS[day.dayOfWeek]}
                </Label>
              </div>

              {day.isAvailable ? (
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <Select
                      value={day.startTime}
                      onValueChange={(value) =>
                        updateAvailability(day.id, "startTime", value)
                      }
                    >
                      <SelectTrigger className="w-32.5">
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
                      updateAvailability(day.id, "endTime", value)
                    }
                  >
                    <SelectTrigger className="w-32.5">
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
