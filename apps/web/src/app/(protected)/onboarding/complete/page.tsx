"use client";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (id && type) {
    fetch("http://localhost:3001/api/core/v1/meeting-attendee", {
      credentials: "include",
      method: "POST",
      body: {},
    });
  }
  return (
    <div>
      <h1>Onboarding Complete</h1>
    </div>
  );
}
