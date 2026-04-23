"use client";

import * as React from "react";
import type { Availability } from "@/lib/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Actions = {
  create: (data: Partial<Availability>) => Promise<any>;
  update: (id: string, data: Partial<Availability>) => Promise<any>;
  remove: (id: string) => Promise<any>;
  refresh: () => Promise<Availability[]>;
};

export default function AvailabilitiesClient({
  initialData,
  actions,
}: {
  initialData: Availability[];
  actions: Actions;
}) {
  const [data, setData] = React.useState(initialData);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Availability | null>(null);

  const [form, setForm] = React.useState({
    dayOfWeek: 1,
    startTime: "",
    endTime: "",
    isEnabled: true,
  });

  function syncForm(a?: Availability | null) {
    if (!a) {
      setForm({
        dayOfWeek: 1,
        startTime: "",
        endTime: "",
        isEnabled: true,
      });
      return;
    }

    setForm({
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime,
      isEnabled: a.isEnabled,
    });
  }

  async function refresh() {
    const res = await actions.refresh();
    setData(res);
  }

  async function handleDelete(id: string) {
    await actions.remove(id);
    await refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      isEnabled: form.isEnabled,
    };

    if (editing) {
      await actions.update(editing.id, payload);
    } else {
      await actions.create(payload);
    }

    setOpen(false);
    setEditing(null);
    syncForm(null);
    await refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly Availability</CardTitle>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditing(null);
              syncForm(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                syncForm(null);
              }}
            >
              Create
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Availability" : "Create Availability"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                className="w-full border rounded-md h-10 px-3"
                value={form.dayOfWeek}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    dayOfWeek: Number(e.target.value),
                  }))
                }
              >
                {DAYS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>

              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
                required
              />

              <Input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
                required
              />

              <div className="flex items-center justify-between">
                <span>Enabled</span>
                <Switch
                  checked={form.isEnabled}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isEnabled: v }))
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{DAYS[item.dayOfWeek]}</TableCell>
                  <TableCell>{item.startTime}</TableCell>
                  <TableCell>{item.endTime}</TableCell>
                  <TableCell>
                    {item.isEnabled ? "Enabled" : "Disabled"}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(item);
                        syncForm(item);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No availability configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
