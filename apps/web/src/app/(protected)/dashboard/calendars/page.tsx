"use client";

import { useState } from "react";
import { Plus, RefreshCw, Trash2, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { connectedCalendars as initialCalendars } from "@/lib/mock-data";
import type { ConnectedCalendar } from "@/lib/types";

function getProviderIcon(provider: ConnectedCalendar["provider"]) {
  switch (provider) {
    case "google":
      return (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      );
    case "outlook":
      return (
        <svg className="size-5" viewBox="0 0 24 24" fill="#0078D4">
          <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.229c.102.086.227.13.373.13.147 0 .27-.044.373-.13l6.78-5.198v-.356H14.635V5.33h8.547c.228 0 .422.076.58.228.158.152.238.344.238.576v1.253z" />
          <path d="M14.635 18.67V7.387l-1.6 1.23-.08.061-4.32 3.314V6.586l-.08-.061-1.6-1.23v13.375h7.68z" />
          <path d="M0 5.33v13.34c0 .23.08.424.238.576.158.152.352.228.58.228h6.137V4.526H.818c-.228 0-.422.076-.58.228C.08 4.906 0 5.1 0 5.33z" />
        </svg>
      );
    case "apple":
      return (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      );
  }
}

function getProviderName(provider: ConnectedCalendar["provider"]) {
  switch (provider) {
    case "google":
      return "Google Calendar";
    case "outlook":
      return "Microsoft Outlook";
    case "apple":
      return "Apple Calendar";
  }
}

function formatLastSynced(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function ConnectedCalendarsPage() {
  const [calendars, setCalendars] =
    useState<ConnectedCalendar[]>(initialCalendars);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const toggleCalendar = (id: string) => {
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c)),
    );
  };

  const syncCalendar = async (id: string) => {
    setSyncingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCalendars((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, lastSynced: new Date().toISOString() } : c,
      ),
    );
    setSyncingId(null);
  };

  const removeCalendar = (id: string) => {
    setCalendars((prev) => prev.filter((c) => c.id !== id));
  };

  const connectCalendar = (provider: ConnectedCalendar["provider"]) => {
    const newCalendar: ConnectedCalendar = {
      id: `cc${Date.now()}`,
      provider,
      email: `user@${provider === "google" ? "gmail" : provider === "outlook" ? "outlook" : "icloud"}.com`,
      name: `${getProviderName(provider)} Account`,
      color:
        provider === "google"
          ? "#4285F4"
          : provider === "outlook"
            ? "#0078D4"
            : "#000000",
      isEnabled: true,
      lastSynced: new Date().toISOString(),
    };
    setCalendars((prev) => [...prev, newCalendar]);
    setIsConnectDialogOpen(false);
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
              Connected Calendars
            </h1>
            <p className="text-sm text-muted-foreground">
              Sync your external calendars to check for conflicts
            </p>
          </div>
        </div>
        <Dialog
          open={isConnectDialogOpen}
          onOpenChange={setIsConnectDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Connect Calendar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect a Calendar</DialogTitle>
              <DialogDescription>
                Choose a calendar provider to connect with MeetSync
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <Button
                variant="outline"
                className="justify-start gap-3 h-14"
                onClick={() => connectCalendar("google")}
              >
                {getProviderIcon("google")}
                <div className="text-left">
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-xs text-muted-foreground">
                    Connect your Google account
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-3 h-14"
                onClick={() => connectCalendar("outlook")}
              >
                {getProviderIcon("outlook")}
                <div className="text-left">
                  <p className="font-medium">Microsoft Outlook</p>
                  <p className="text-xs text-muted-foreground">
                    Connect your Outlook account
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-3 h-14"
                onClick={() => connectCalendar("apple")}
              >
                {getProviderIcon("apple")}
                <div className="text-left">
                  <p className="font-medium">Apple Calendar</p>
                  <p className="text-xs text-muted-foreground">
                    Connect your iCloud account
                  </p>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Calendars</CardTitle>
          <CardDescription>
            Connected calendars are used to check for scheduling conflicts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calendars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="size-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No calendars connected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect a calendar to sync your events
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {calendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className={`flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center ${
                    !calendar.isEnabled ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="flex size-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${calendar.color}15` }}
                    >
                      {getProviderIcon(calendar.provider)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{calendar.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {calendar.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      <Check className="size-3 mr-1" />
                      Synced {formatLastSynced(calendar.lastSynced)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => syncCalendar(calendar.id)}
                      disabled={syncingId === calendar.id}
                    >
                      <RefreshCw
                        className={`size-4 ${syncingId === calendar.id ? "animate-spin" : ""}`}
                      />
                    </Button>
                    <Switch
                      checked={calendar.isEnabled}
                      onCheckedChange={() => toggleCalendar(calendar.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCalendar(calendar.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sync Settings</CardTitle>
          <CardDescription>
            Configure how your calendars sync with MeetSync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-sync</p>
              <p className="text-sm text-muted-foreground">
                Automatically sync calendars every 15 minutes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show busy times</p>
              <p className="text-sm text-muted-foreground">
                Block time slots that conflict with calendar events
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-way sync</p>
              <p className="text-sm text-muted-foreground">
                Add MeetSync meetings to your connected calendars
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
