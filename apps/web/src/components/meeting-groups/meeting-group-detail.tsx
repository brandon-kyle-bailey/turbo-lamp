"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { meetingAttendeesApi } from "@/lib/api/meeting-attendees";
import { meetingSlotsApi } from "@/lib/api/meeting-slots";
import { meetingsApi } from "@/lib/api/meetings";
import { MeetingGroup, MeetingParticipant, MeetingSlot } from "@/lib/types";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface MeetingGroupDetailProps {
  group: MeetingGroup;
  initialParticipants: MeetingParticipant[];
}

type InvitationState = "pending" | "accepted" | "declined";

const invitationColors: Record<InvitationState, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-red-50 text-red-700 border-red-200",
};

const statusConfig: Record<
  MeetingGroup["status"],
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border" },
  scheduling: {
    label: "Scheduling",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

export function MeetingGroupDetail({
  group,
  initialParticipants,
}: MeetingGroupDetailProps) {
  const router = useRouter();
  const [participants, setParticipants] = useState(initialParticipants);
  const [slots, setSlots] = useState<MeetingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<MeetingSlot | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const requestIdRef = useRef(0);

  const statusConf = statusConfig[group.status];

  const activeParticipants = useMemo(
    () => participants.filter((p) => p.invitation_state !== "declined"),
    [participants],
  );

  const canSchedule = useMemo(() => {
    return activeParticipants.length > 0;
  }, [activeParticipants]);

  async function loadSlots() {
    const requestId = ++requestIdRef.current;

    setSlotsLoading(true);
    setSlotsError(null);

    try {
      const result = await meetingSlotsApi.calculate(group.id);

      if (requestId !== requestIdRef.current) return;

      setSlots(result);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setSlotsError(getErrorMessage(err));
    } finally {
      if (requestId === requestIdRef.current) {
        setSlotsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (group.status !== "scheduled") {
      loadSlots();
    }
  }, [group.id, group.status]);

  function handleSelectSlot(slot: MeetingSlot) {
    if (!canSchedule) {
      toast.error("Participants must be accepted before scheduling");
      return;
    }
    setSelectedSlot(slot);
    setConfirmOpen(true);
  }

  async function handleConfirmSlot() {
    if (!selectedSlot) return;

    setIsScheduling(true);

    try {
      const meeting = await meetingsApi.create({
        meeting_group_id: group.id,
        start_datetime: selectedSlot.start_datetime,
        end_datetime: selectedSlot.end_datetime,
        summary: group.summary,
        description: group.description,
        location: group.location,
        calendar_id: group.calendar_id,
      });

      await Promise.all(
        activeParticipants.map((p) =>
          meetingAttendeesApi.create({
            meeting_id: meeting.id,
            name: p.attendee?.name || "",
            email: p.attendee?.email || "",
            status: "invited",
          }),
        ),
      );

      toast.success("Meeting scheduled successfully");
      setConfirmOpen(false);
      router.push(`/meetings/${meeting.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsScheduling(false);
    }
  }

  const slotsByDay = useMemo(() => {
    return slots.reduce<Record<string, MeetingSlot[]>>((acc, slot) => {
      const day = format(parseISO(slot.start_datetime), "yyyy-MM-dd");
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    }, {});
  }, [slots]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {group.summary}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConf.className}`}
            >
              {statusConf.label}
            </span>
          </div>
          {group.description && (
            <p className="text-muted-foreground">{group.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{group.duration_minutes} minutes</span>
              </div>

              <div className="flex items-start gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 mt-0.5" />
                <div>
                  <div>
                    {format(
                      parseISO(group.after_datetime),
                      "MMM d, yyyy h:mm a",
                    )}
                  </div>
                  <div className="text-xs">
                    to{" "}
                    {format(
                      parseISO(group.before_datetime),
                      "MMM d, yyyy h:mm a",
                    )}
                  </div>
                </div>
              </div>

              {group.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{group.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {(p.attendee?.name || "?")[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {p.attendee?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.attendee?.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs border ${
                      invitationColors[
                        (p.invitation_state as InvitationState) || "pending"
                      ]
                    }`}
                  >
                    {p.invitation_state}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Available Slots</CardTitle>
                <CardDescription>
                  Derived from participant availability
                </CardDescription>
              </div>

              {group.status !== "scheduled" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSlots}
                  disabled={slotsLoading}
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 mr-1.5 ${
                      slotsLoading ? "animate-spin" : ""
                    }`}
                  />
                  Recalculate
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {group.status === "scheduled" ? (
                <div className="text-center py-10">
                  <CheckCircle className="h-10 w-10 mx-auto text-green-500 mb-3" />
                  <p className="font-medium">Scheduled</p>
                </div>
              ) : slotsLoading ? (
                <div className="space-y-4">
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-muted animate-pulse rounded" />
                    <div className="h-16 bg-muted animate-pulse rounded" />
                    <div className="h-16 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ) : slotsError ? (
                <div className="text-center py-10">
                  <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-3" />
                  <p>{slotsError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSlots}
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </div>
              ) : Object.keys(slotsByDay).length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p>No slots available</p>
                </div>
              ) : (
                Object.entries(slotsByDay).map(([day, daySlots]) => (
                  <div key={day} className="mb-6">
                    <div className="text-xs font-semibold mb-2">
                      {format(parseISO(day), "EEEE, MMM d")}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {daySlots.map((slot) => (
                        <SlotCard
                          key={`${slot.start_datetime}-${slot.end_datetime}`}
                          slot={slot}
                          onSelect={() => handleSelectSlot(slot)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Slot</DialogTitle>
            <DialogDescription>
              This will create a meeting and invite participants.
            </DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="text-sm space-y-2 border rounded p-3 bg-muted/30">
              <div>
                {format(parseISO(selectedSlot.start_datetime), "PPP p")}
              </div>
              <div>{format(parseISO(selectedSlot.end_datetime), "p")}</div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isScheduling}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSlot} disabled={isScheduling}>
              {isScheduling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SlotCard({
  slot,
  onSelect,
}: {
  slot: MeetingSlot;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="border rounded p-3 text-left hover:border-primary hover:bg-primary/5"
    >
      <div className="text-sm font-medium">
        {format(parseISO(slot.start_datetime), "h:mm a")}
      </div>
      <div className="text-xs text-muted-foreground">
        {format(parseISO(slot.end_datetime), "h:mm a")}
      </div>
    </button>
  );
}
