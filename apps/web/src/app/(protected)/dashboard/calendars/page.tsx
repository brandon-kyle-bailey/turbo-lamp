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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarLogo, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/lib/providers/profile-provider";

/**
 * External providers (NOT the same shape as connected calendars)
 */
type ExternalCalendar = {
  providerId: Calendar["providerId"];
  name: string;
  calendarId: string;
  timezone: string;
};

function getProviderIcon(provider: Calendar["providerId"]) {
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
    default:
      return null;
  }
}

function getProviderName(provider: Calendar["providerId"]) {
  switch (provider) {
    case "google":
      return "Google Calendar";
    default:
      return provider;
  }
}

export default function ConnectedCalendarsPage() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [externalCalendars, setExternalCalendars] = useState<
    ExternalCalendar[]
  >([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  /**
   * Fetch connected calendars
   */
  const getCalendars = async () => {
    const response = await fetch(
      "http://localhost:3001/api/core/v1/calendars",
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      toast.error("error getting calendars");
      return [];
    }

    return response.json();
  };

  useEffect(() => {
    getCalendars().then(setCalendars);
  }, []);

  /**
   * Fetch external providers
   */
  const getExternalCalendars = async () => {
    const response = await fetch(
      "http://localhost:3001/api/core/v1/calendars/external",
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      toast.error("error getting external calendars");
      return [];
    }

    return response.json();
  };

  useEffect(() => {
    if (!isConnectDialogOpen) return;

    (async () => {
      setLoadingExternal(true);
      try {
        const data = await getExternalCalendars();
        setExternalCalendars(data);
        console.log(data);
      } catch {
        toast.error("failed to load providers");
      } finally {
        setLoadingExternal(false);
      }
    })();
  }, [isConnectDialogOpen]);

  /**
   * Mutations (still local except connect)
   */
  const toggleCalendar = (id: string) => {
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  };

  const removeCalendar = (id: string) => {
    setCalendars((prev) => prev.filter((c) => c.id !== id));
  };

  const connectCalendar = async (provider: ExternalCalendar) => {
    const res = await fetch("http://localhost:3001/api/core/v1/calendars", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: provider.calendarId,
        name: provider.name,
        timezone: provider.timezone,
        providerId: provider.providerId,
        enabled: true,
      }),
    });

    if (!res.ok) {
      toast.error("failed to connect calendar");
      return;
    }

    const created = await res.json();
    setCalendars((prev) => [...prev, created]);
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
                Choose a calendar provider to connect
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4">
              {loadingExternal && (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}

              {!loadingExternal && externalCalendars.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No providers available
                </p>
              )}

              {externalCalendars.map((provider) => (
                <Button
                  key={provider.calendarId}
                  variant="outline"
                  className="justify-start gap-3 h-14"
                  onClick={() => connectCalendar(provider)}
                >
                  {getProviderIcon(provider.providerId)}
                  <div className="text-left">
                    <p className="font-medium">
                      {getProviderName(provider.providerId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {provider.name}
                    </p>
                  </div>
                </Button>
              ))}
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
              <CalendarLogo className="size-10 text-muted-foreground/50 mb-3" />
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
                    !calendar.enabled ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex size-10 items-center justify-center rounded-lg">
                      {getProviderIcon(calendar.providerId)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{calendar.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Switch
                      checked={calendar.enabled}
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
    </div>
  );
}
