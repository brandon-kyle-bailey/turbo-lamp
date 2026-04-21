"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfile } from "@/lib/providers/profile-provider";
import {
  Calendar,
  Clock,
  FolderOpen,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
} from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";

const schema = z.object({
  calendarId: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional(),
  after: z.iso.date(),
  before: z.iso.date(),
  duration: z.number().min(15).multipleOf(15),
  participants: z.array(z.email()).min(1),
});

function ParticipantsInput({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<z.infer<typeof schema>, "participants">;
  fieldState: ControllerFieldState;
}) {
  const [input, setInput] = useState("");
  const value = field.value ?? [];

  const add = (raw: string) => {
    const e = raw.trim().toLowerCase();
    if (!e) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return;
    if (!value.includes(e)) field.onChange([...value, e]);
  };

  const remove = (email: string) => {
    field.onChange(value.filter((v) => v !== email));
  };

  return (
    <>
      <FieldLabel htmlFor="participants">Participants</FieldLabel>

      <div
        className={`flex flex-wrap gap-2 rounded-md border p-2 ${
          fieldState.invalid ? "border-destructive" : ""
        }`}
      >
        {value.map((email) => (
          <span
            key={email}
            className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-sm"
          >
            {email}
            <button type="button" onClick={() => remove(email)}>
              ×
            </button>
          </span>
        ))}

        <input
          id="participants"
          type="text"
          placeholder="Type an email address and hit Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (["Enter", ",", "Tab"].includes(e.key)) {
              e.preventDefault();
              add(input);
              setInput("");
            }
          }}
          onBlur={() => {
            add(input);
            setInput("");
          }}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </>
  );
}

function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [calendars, setCalendars] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:3001/api/core/v1/calendars", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setCalendars(data);
    };

    load();
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      calendarId: "",
      summary: "",
      description: "",
      location: "",
      after: "",
      before: "",
      duration: 15,
      participants: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const payload = {
      calendarId: data.calendarId,
      summary: data.summary,
      description: data.description,
      duration: data.duration,
      after: data.after,
      before: data.before,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: "open",
    };

    const createMeetingGroup = async () => {
      const res = await fetch(
        "http://localhost:3001/api/core/v1/meeting-groups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        toast.error("Failed to create meeting group");
        return;
      }

      return await res.json();
    };

    const createMeetingGroupParticipant = async (
      meetingGroupId: string,
      participant: string,
    ) => {
      console.log(meetingGroupId, participant);
      const res = await fetch(
        "http://localhost:3001/api/core/v1/meeting-participants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            meetingGroupId: meetingGroupId,
            email: participant,
          }),
        },
      );

      if (!res.ok) {
        toast.error("Failed to create meeting group");
        return;
      }
    };

    const { id } = await createMeetingGroup();
    await Promise.all(
      data.participants.map((participant) =>
        createMeetingGroupParticipant(id, participant),
      ),
    );
    toast.success("Meeting Group Created");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col w-fit">
        <DialogHeader>
          <DialogTitle>Create a new Meeting Group</DialogTitle>
          <DialogDescription>
            Define an after and before date, as well as duration and invite
            participants.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="calendarId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Calendar</FieldLabel>

                  <select
                    className="w-full rounded-md border bg-secondary/50 p-2"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">Select calendar</option>
                    {calendars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="summary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="summary">Summary</FieldLabel>
                  <Input
                    {...field}
                    id="summary"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    {...field}
                    id="description"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="after"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="after">After</FieldLabel>
                  <Input {...field} id="after" type="date" className="w-full" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="before"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="before">Before</FieldLabel>
                  <Input
                    {...field}
                    id="before"
                    type="date"
                    className="w-full"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="duration">Duration</FieldLabel>
                  <Input
                    {...field}
                    id="duration"
                    type="number"
                    step={15}
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="participants"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <ParticipantsInput field={field} fieldState={fieldState} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Meeting Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MeetingGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const profile = useProfile();

  const filteredGroups = searchQuery
    ? profile.user.meetingGroups.filter(
        (g) =>
          g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : profile.user.meetingGroups;

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
              Meeting Groups
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize and manage recurring meeting series
            </p>
          </div>
        </div>
        <CreateGroupDialog />
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">No meeting groups found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create a group to organize recurring meetings
            </p>

            <CreateGroupDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="group transition-colors hover:bg-muted/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{group.summary}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {group.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit group</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {formatDate(String(group.after))}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />1 meeting
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {group.participants &&
                        group.participants.slice(0, 4).map((p) => (
                          <Avatar
                            key={p.id}
                            className="size-7 border-2 border-background"
                          >
                            <AvatarImage
                              src={p.user && p.user.image}
                              alt={p.user && p.user.name}
                            />
                            <AvatarFallback className="text-xs">
                              {p.user &&
                                p.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                    {group.participants && group.participants.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{group.participants.length - 4}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant={
                      group.status === "completed"
                        ? "secondary"
                        : group.status === "cancelled"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {group.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
