"use client";

import * as React from "react";
import type { AvailabilityOverride } from "@/lib/types";

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

import { format } from "date-fns";

type Actions = {
  create: (data: Partial<AvailabilityOverride>) => Promise<any>;
  update: (id: string, data: Partial<AvailabilityOverride>) => Promise<any>;
  remove: (id: string) => Promise<any>;
  refresh: () => Promise<AvailabilityOverride[]>;
};

export default function AvailabilityOverridesClient({
  initialData,
  actions,
}: {
  initialData: AvailabilityOverride[];
  actions: Actions;
}) {
  const [data, setData] = React.useState(initialData);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AvailabilityOverride | null>(
    null,
  );

  const [form, setForm] = React.useState({
    date: "",
    startTime: "",
    endTime: "",
    isAvailable: true,
  });

  function syncForm(override?: AvailabilityOverride | null) {
    if (!override) {
      setForm({
        date: "",
        startTime: "",
        endTime: "",
        isAvailable: true,
      });
      return;
    }

    setForm({
      date: override.date.slice(0, 10),
      startTime: override.startTime,
      endTime: override.endTime,
      isAvailable: override.isAvailable,
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
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      isAvailable: form.isAvailable,
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
        <CardTitle>Availability Overrides</CardTitle>

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
                {editing ? "Edit Override" : "Create Override"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                required
              />

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
                <span>Available</span>
                <Switch
                  checked={form.isAvailable}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isAvailable: v }))
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
              <TableHead>Date</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{format(new Date(item.date), "PPP")}</TableCell>
                <TableCell>{item.startTime}</TableCell>
                <TableCell>{item.endTime}</TableCell>
                <TableCell>
                  {item.isAvailable ? "Available" : "Unavailable"}
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
                  No overrides configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
