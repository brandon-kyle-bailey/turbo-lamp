"use client";

import { useProfile } from "../../../providers/profile-provider";

export default function DashboardContent() {
  const profile = useProfile();
  return (
    <main className="flex flex-col h-full w-full">
      <div className="w-full">Hello {profile.user.name}</div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted" />
          <div className="aspect-video rounded-xl bg-muted" />
          <div className="aspect-video rounded-xl bg-muted" />
        </div>
        <div className="min-h-screen flex-1 rounded-xl bg-muted md:min-h-min" />
      </div>
    </main>
  );
}
