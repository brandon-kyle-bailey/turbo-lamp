"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { CalendarDemo } from "@/components/landing-page/calendar-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              AI-Powered Scheduling
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Schedule meetings without the back-and-forth
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Syncal uses AI to analyze everyone&apos;s calendars and instantly
            find the perfect time. No more endless email chains. Just smarter
            scheduling.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">
                10M+
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Meetings scheduled
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">
                50K+
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Active teams</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">
                98%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Time saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">
                4.9/5
              </p>
              <p className="mt-1 text-sm text-muted-foreground">User rating</p>
            </div>
          </div>

          {/* Calendar Preview */}
          <div className="mt-20 w-full max-w-4xl">
            <CalendarDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
