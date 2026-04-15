"use client";

import { useParams, useRouter } from "next/navigation";
import { useProfile } from "@/providers/profile-provider";
import { useEffect, useRef } from "react";

export default function Page() {
  const { slug } = useParams();
  const profile = useProfile();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (!slug || !profile) return;

    // ran.current = true;

    fetch(`http://localhost:3001/api/core/v1/meeting-participants/${slug}`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: profile.userId,
        email: profile.email,
        oauth_connected: profile.providerId !== "credentials",
      }),
    }).then(() => {
      // router.replace("/dashboard");
    });
  }, [slug, profile, router]);

  return null;
}
