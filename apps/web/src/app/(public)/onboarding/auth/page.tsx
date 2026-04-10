"use client";

import { useSearchParams } from "next/navigation";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

function useOAuthRedirect(provider: "github" | "google") {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return () => {
    const url = `http://localhost:3001/api/core/v1/auth/oauth/${provider}?token=${encodeURIComponent(
      token ?? "",
    )}`;

    window.location.href = url;
  };
}

export function LoginWithGithubForm() {
  const redirect = useOAuthRedirect("github");

  return (
    <Button variant="outline" className="w-full" onClick={redirect}>
      <IconBrandGithub />
      Login with GitHub
    </Button>
  );
}

export function LoginWithGoogleForm() {
  const redirect = useOAuthRedirect("google");

  return (
    <Button variant="outline" className="w-full" onClick={redirect}>
      <IconBrandGoogle />
      Login with Google
    </Button>
  );
}

export default function Page() {
  return (
    <div>
      <h1>Onboarding Auth</h1>
      <div className="w-full flex flex-col gap-4">
        {/* <LoginWithGithubForm /> */}
        <LoginWithGoogleForm />
      </div>
    </div>
  );
}
