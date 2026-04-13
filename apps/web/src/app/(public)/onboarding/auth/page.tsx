"use client";

import { useSearchParams } from "next/navigation";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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

export default function Page() {
  return (
    <div className="h-screen flex justify-center align-middle items-center text-center">
      <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <span className="text-xl font-bold text-background">A</span>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-balance">
            Welcome
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={useOAuthRedirect("google")}
              variant="outline"
              size="lg"
              className="w-full h-12 text-base font-medium gap-3 hover:bg-secondary transition-colors"
            >
              <IconBrandGithub className="h-5 w-5" />
              Access with Google
            </Button>
            <Button
              onClick={useOAuthRedirect("github")}
              variant="outline"
              size="lg"
              className="w-full h-12 text-base font-medium gap-3 hover:bg-secondary transition-colors"
            >
              <IconBrandGoogle className="h-5 w-5" />
              Access with GitHub
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 text-pretty">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
