"use client";

import * as React from "react";
import type { Availability } from "@/lib/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 48; // px per hour

type Actions = {
  create: (data: Partial<Availability>) => Promise<Availability>;
  update: (id: string, data: Partial<Availability>) => Promise<Availability>;
  remove: (id: string) => Promise<void>;
  list: () => Promise<Availability[]>;
};

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function AvailabilityCalendar({
  initialData,
  actions,
}: {
  initialData: Availability[];
  actions: Actions;
}) {
  const [data, setData] = React.useState<Availability[]>(
    Array.isArray(initialData) ? initialData : [],
  );

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Availability | null>(null);

  const [form, setForm] = React.useState({
    dayOfWeek: new Date().getDay(),
    startTime: "",
    endTime: "",
    isEnabled: true,
  });

  async function refresh() {
    const res = await actions.list();
    setData(Array.isArray(res) ? res : []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = { ...form };

    if (editing) {
      await actions.update(editing.id, payload);
    } else {
      await actions.create(payload);
    }

    setOpen(false);
    setEditing(null);
    await refresh();
  }

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Availability</CardTitle>

        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              dayOfWeek: new Date().getDay(),
              startTime: "",
              endTime: "",
              isEnabled: true,
            });
            setOpen(true);
          }}
        >
          New
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border rounded-xl overflow-hidden">
          {/* Time column */}
          <div className="relative border-r bg-muted/30">
            {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
              const hour = START_HOUR + i;
              return (
                <div
                  key={hour}
                  className="text-xs text-muted-foreground h-[48px] flex items-start justify-end pr-2 pt-1"
                >
                  {hour}:00
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {DAYS.map((day, dayIndex) => {
            const items = data.filter((d) => d.dayOfWeek === dayIndex);

            return (
              <div
                key={dayIndex}
                className="relative border-l"
                style={{ height: totalHeight }}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background border-b text-xs font-medium p-2 text-center">
                  {day}
                </div>

                {/* Hour grid lines */}
                {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t"
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}

                {/* Blocks */}
                {items.map((item) => {
                  const start =
                    (timeToMinutes(item.startTime) - START_HOUR * 60) / 60;
                  const end =
                    (timeToMinutes(item.endTime) - START_HOUR * 60) / 60;

                  const top = start * HOUR_HEIGHT;
                  const height = (end - start) * HOUR_HEIGHT;

                  return (
                    <div
                      key={item.id}
                      className={`absolute left-1 right-1 rounded-lg border px-2 py-1 text-xs group cursor-pointer
                        ${
                          item.isEnabled
                            ? "bg-primary/10 border-primary/30"
                            : "bg-muted opacity-50"
                        }`}
                      style={{
                        top,
                        height,
                      }}
                      onClick={() => {
                        setEditing(item);
                        setForm(item);
                        setOpen(true);
                      }}
                    >
                      <div className="font-mono">
                        {item.startTime}–{item.endTime}
                      </div>

                      <div className="hidden group-hover:flex justify-between items-center mt-1">
                        <Switch
                          checked={item.isEnabled}
                          onCheckedChange={async (v) => {
                            await actions.update(item.id, {
                              isEnabled: v,
                            });
                            await refresh();
                          }}
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await actions.remove(item.id);
                            await refresh();
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Create"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d, i) => (
                <Button
                  key={i}
                  type="button"
                  variant={form.dayOfWeek === i ? "default" : "outline"}
                  className="h-8 text-xs"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      dayOfWeek: i,
                    }))
                  }
                >
                  {d}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    startTime: e.target.value,
                  }))
                }
                required
              />

              <Input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    endTime: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Enabled</span>
              <Switch
                checked={form.isEnabled}
                onCheckedChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    isEnabled: v,
                  }))
                }
              />
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
