export function LogoCloud() {
  const companies = ["Stripe", "Notion", "Linear", "Vercel", "Figma", "Slack"];

  return (
    <section className="border-y border-border/50 bg-secondary/20 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Trusted by teams at the world&apos;s most innovative companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <span
              key={company}
              className="text-xl font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
