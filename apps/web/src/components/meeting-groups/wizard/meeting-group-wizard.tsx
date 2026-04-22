"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { meetingAttendeesApi } from "@/lib/api/meeting-attendees";
import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import { meetingParticipantsApi } from "@/lib/api/meeting-participants";
import { Calendar, MeetingAttendee } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ── Schema ─────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  location: z.string().optional(),
});

const step2Schema = z
  .object({
    duration_minutes: z.coerce
      .number()
      .min(5, "Minimum 5 minutes")
      .max(480, "Maximum 8 hours"),
    after_datetime: z.string().min(1, "Start date is required"),
    before_datetime: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.after_datetime < data.before_datetime, {
    message: "End date must be after start date",
    path: ["before_datetime"],
  });

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

// ── Steps config ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Basic Info", icon: FileText },
  { id: 2, label: "Time", icon: Clock },
  { id: 3, label: "Calendar", icon: CalendarDays },
  { id: 4, label: "Participants", icon: Users },
  { id: 5, label: "Review", icon: ClipboardCheck },
];

// ── Props ──────────────────────────────────────────────────────────────────

interface MeetingGroupWizardProps {
  calendars: Calendar[];
  attendees: MeetingAttendee[];
}

// ── Component ──────────────────────────────────────────────────────────────

export function MeetingGroupWizard({
  calendars,
  attendees,
}: MeetingGroupWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 state
  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { summary: "", description: "", location: "" },
  });

  // Step 2 state
  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      duration_minutes: 60,
      after_datetime: "",
      before_datetime: "",
    },
  });

  // Step 3 state
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(
    calendars[0]?.id || null,
  );

  // Step 4 state
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<Set<string>>(
    new Set(),
  );
  const [newAttendeeName, setNewAttendeeName] = useState("");
  const [newAttendeeEmail, setNewAttendeeEmail] = useState("");
  const [isAddingAttendee, setIsAddingAttendee] = useState(false);
  const [localAttendees, setLocalAttendees] = useState(attendees);

  function toggleAttendee(id: string) {
    setSelectedAttendeeIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleAddAttendee() {
    if (!newAttendeeName.trim() || !newAttendeeEmail.trim()) return;
    setIsAddingAttendee(true);
    try {
      const created = await meetingAttendeesApi.create({
        name: newAttendeeName.trim(),
        email: newAttendeeEmail.trim(),
      });
      setLocalAttendees((prev) => [...prev, created]);
      setSelectedAttendeeIds((prev) => new Set([...prev, created.id]));
      setNewAttendeeName("");
      setNewAttendeeEmail("");
      toast.success("Attendee added");
    } catch {
      toast.error("Failed to add attendee");
    } finally {
      setIsAddingAttendee(false);
    }
  }

  // ── Final submit ─────────────────────────────────────────────────────────

  async function handleSubmit() {
    const step1Values = step1Form.getValues();
    const step2Values = step2Form.getValues();

    setIsSubmitting(true);
    try {
      const group = await meetingGroupsApi.create({
        summary: step1Values.summary,
        description: step1Values.description,
        location: step1Values.location,
        duration_minutes: step2Values.duration_minutes,
        after_datetime: step2Values.after_datetime,
        before_datetime: step2Values.before_datetime,
        calendar_id: selectedCalendarId || undefined,
      });

      // Add participants
      await Promise.all(
        Array.from(selectedAttendeeIds).map((attendeeId) =>
          meetingParticipantsApi.create({
            meeting_group_id: group.id,
            attendee_id: attendeeId,
          }),
        ),
      );

      toast.success("Meeting group created!");
      router.push(`/meeting-groups/${group.id}`);
    } catch {
      toast.error("Failed to create meeting group");
      setIsSubmitting(false);
    }
  }

  // ── Step navigation ──────────────────────────────────────────────────────

  async function handleNext() {
    if (currentStep === 1) {
      const valid = await step1Form.trigger();
      if (!valid) return;
    }
    if (currentStep === 2) {
      const valid = await step2Form.trigger();
      if (!valid) return;
    }
    if (currentStep < 5) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  // ── Render values for review ─────────────────────────────────────────────

  const step1Values = step1Form.watch();
  const step2Values = step2Form.watch();
  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);
  const selectedAttendees = localAttendees.filter((a) =>
    selectedAttendeeIds.has(a.id),
  );

  return (
    <div className="max-w-2xl">
      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={!isCompleted}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all
                    ${isCompleted ? "bg-primary border-primary text-primary-foreground cursor-pointer" : ""}
                    ${isCurrent ? "border-primary text-primary bg-primary/10" : ""}
                    ${!isCompleted && !isCurrent ? "border-muted-foreground/30 text-muted-foreground/50" : ""}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </button>
                <span
                  className={`mt-1 text-xs font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 mx-1 mb-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Form {...step1Form}>
              <form className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Describe your meeting group
                  </p>
                </div>
                <FormField
                  control={step1Form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Summary <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Q2 Planning Session"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={step1Form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Optional details about this meeting..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={step1Form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder="Conference room, Zoom link, etc."
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {/* Step 2: Time Constraints */}
          {currentStep === 2 && (
            <Form {...step2Form}>
              <form className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Time Constraints</h2>
                  <p className="text-sm text-muted-foreground">
                    Set the meeting duration and scheduling window
                  </p>
                </div>
                <FormField
                  control={step2Form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Duration (minutes){" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={5}
                          max={480}
                          step={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How long should the meeting be?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={step2Form.control}
                    name="after_datetime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Earliest date{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step2Form.control}
                    name="before_datetime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Latest date{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}

          {/* Step 3: Calendar Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Calendar</h2>
                <p className="text-sm text-muted-foreground">
                  Choose which calendar to use for this meeting
                </p>
              </div>
              {calendars.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No calendars connected
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => router.push("/calendars")}
                  >
                    Connect a calendar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCalendarId === null
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCalendarId(null)}
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                      {selectedCalendarId === null && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      No calendar (skip)
                    </span>
                  </div>
                  {calendars.map((cal) => (
                    <div
                      key={cal.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCalendarId === cal.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedCalendarId(cal.id)}
                    >
                      <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                        {selectedCalendarId === cal.id && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      {cal.color && (
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cal.color }}
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium">{cal.name}</p>
                        {cal.description && (
                          <p className="text-xs text-muted-foreground">
                            {cal.description}
                          </p>
                        )}
                      </div>
                      {cal.is_primary && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Participants */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Participants</h2>
                <p className="text-sm text-muted-foreground">
                  Select who should attend this meeting
                </p>
              </div>

              {/* Add new attendee inline */}
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Add new attendee
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={newAttendeeName}
                    onChange={(e) => setNewAttendeeName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newAttendeeEmail}
                    onChange={(e) => setNewAttendeeEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddAttendee()}
                  />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddAttendee}
                  disabled={
                    isAddingAttendee || !newAttendeeName || !newAttendeeEmail
                  }
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {isAddingAttendee ? "Adding..." : "Add"}
                </Button>
              </div>

              {/* Existing attendees list */}
              {localAttendees.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No attendees yet — add one above
                </div>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {localAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => toggleAttendee(attendee.id)}
                    >
                      <Checkbox
                        checked={selectedAttendeeIds.has(attendee.id)}
                        onCheckedChange={() => toggleAttendee(attendee.id)}
                        id={`attendee-${attendee.id}`}
                      />
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{attendee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedAttendeeIds.size > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedAttendeeIds.size} participant
                  {selectedAttendeeIds.size !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Review & Create</h2>
                <p className="text-sm text-muted-foreground">
                  Confirm your meeting group details
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <ReviewSection label="Basic Info">
                  <ReviewRow label="Summary" value={step1Values.summary} />
                  {step1Values.description && (
                    <ReviewRow
                      label="Description"
                      value={step1Values.description}
                    />
                  )}
                  {step1Values.location && (
                    <ReviewRow label="Location" value={step1Values.location} />
                  )}
                </ReviewSection>

                <ReviewSection label="Time">
                  <ReviewRow
                    label="Duration"
                    value={`${step2Values.duration_minutes} minutes`}
                  />
                  <ReviewRow
                    label="Window"
                    value={
                      step2Values.after_datetime && step2Values.before_datetime
                        ? `${format(new Date(step2Values.after_datetime), "MMM d, yyyy h:mm a")} – ${format(new Date(step2Values.before_datetime), "MMM d, yyyy h:mm a")}`
                        : "—"
                    }
                  />
                </ReviewSection>

                <ReviewSection label="Calendar">
                  <ReviewRow
                    label="Calendar"
                    value={selectedCalendar?.name || "None selected"}
                  />
                </ReviewSection>

                <ReviewSection label="Participants">
                  {selectedAttendees.length === 0 ? (
                    <p className="text-muted-foreground italic">
                      No participants selected
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAttendees.map((a) => (
                        <Badge key={a.id} variant="secondary">
                          {a.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </ReviewSection>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        {currentStep < 5 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Meeting Group"}
            <Check className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────

function ReviewSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
