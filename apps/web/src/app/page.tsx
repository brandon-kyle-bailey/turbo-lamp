"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  const startOAuth = (provider: "google" | "github") => {
    window.location.href = `http://localhost:3001/api/core/v1/auth/oauth/${provider}`;
  };

  const handleSignIn = (provider: "google" | "github") => {
    startOAuth(provider);
  };

  return (
    <>
      <Button onClick={() => handleSignIn("google")}>Login with Google</Button>
      <Button onClick={() => handleSignIn("github")}>Login with GitHub</Button>
    </>
  );
}
