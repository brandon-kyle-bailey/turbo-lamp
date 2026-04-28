"use client";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "../../../../components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    router.push("/login");
  }
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Button
        variant="default"
        className="h-11"
        onClick={() => {
          window.location.href = `http://localhost:3001/api/core/v1/auth/oauth/google?token=${token}`;
        }}
      >
        <IconBrandGoogle />
        Google
      </Button>
    </div>
  );
}
