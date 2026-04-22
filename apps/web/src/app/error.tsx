"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold">Application error</h1>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button onClick={reset} className="text-sm underline">
              Retry
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
