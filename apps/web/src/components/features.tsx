import { Card } from "@/components/ui/card";
import { Brain, Clock, Globe, Lock, RefreshCw, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Our AI analyzes multiple calendars simultaneously to find optimal meeting slots that work for everyone.",
  },
  {
    icon: Clock,
    title: "Smart Time Zones",
    description:
      "Automatically detects and adjusts for different time zones, suggesting times that work globally.",
  },
  {
    icon: Zap,
    title: "Instant Scheduling",
    description:
      "Skip the back-and-forth. Find and book the perfect time in seconds, not hours.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Rescheduling",
    description:
      "When conflicts arise, Syncal automatically suggests alternative times without any manual intervention.",
  },
  {
    icon: Globe,
    title: "Calendar Integrations",
    description:
      "Seamlessly connects with Google Calendar, Outlook, iCal, and all major calendar platforms.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "Your calendar data is encrypted and never shared. We only see availability, never event details.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Everything you need for effortless scheduling
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful features that eliminate scheduling friction and save hours
            every week.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card/50 p-6 transition-all hover:border-accent/50 hover:bg-card"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
