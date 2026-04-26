"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{pathname}</h1>
      <p className="text-muted-foreground">Overview of scheduling activity</p>
    </div>
  );
}
