"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  title: string;
  count?: number;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  count,
  icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="font-normal">
            {count}
          </Badge>
        )}
      </div>
      {action}
    </div>
  );
}
