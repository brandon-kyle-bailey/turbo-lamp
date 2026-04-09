"use client";

import {
  Calendar,
  Home,
  Settings,
  Users,
  Clock,
  Link2,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Meetings", href: "/dashboard/meetings", icon: Calendar },
  { name: "Availability", href: "/dashboard/availability", icon: Clock },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const secondaryNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-card/30 lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Calendar className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Syncal</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="my-4 h-px bg-border/50" />

          <div className="flex flex-col gap-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Upgrade banner */}
        <div className="m-4 rounded-xl bg-accent/10 p-4">
          <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Get unlimited meetings and AI scheduling.
          </p>
          <Link href="/pricing">
            <button className="mt-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
              Upgrade now
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
