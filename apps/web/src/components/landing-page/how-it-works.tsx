import { Card } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Connect your calendars",
    description:
      "Link your Google Calendar, Outlook, or any other calendar service in just a few clicks.",
  },
  {
    step: "02",
    title: "Add participants",
    description:
      "Enter the email addresses of everyone who needs to attend. Syncal handles the rest.",
  },
  {
    step: "03",
    title: "AI finds the perfect time",
    description:
      "Our AI analyzes all calendars and suggests optimal times based on availability and preferences.",
  },
  {
    step: "04",
    title: "Meeting scheduled",
    description:
      "With one click, the meeting is booked and everyone receives calendar invites automatically.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/50 bg-secondary/20 py-20 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            How Syncal works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Four simple steps to schedule any meeting with ease.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={step.step}
              className="relative border-border/50 bg-card/50 p-6"
            >
              <div className="mb-4 text-5xl font-bold text-accent/20">
                {step.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-border lg:block" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
