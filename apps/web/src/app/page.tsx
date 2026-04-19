import { Header } from "@/components/landing-page/header";
import { Hero } from "@/components/landing-page/hero";
import { LogoCloud } from "@/components/landing-page/logo-cloud";
import { Features } from "@/components/landing-page/features";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Testimonials } from "@/components/landing-page/testimonials";
import { CTA } from "@/components/landing-page/cta";
import { Footer } from "@/components/landing-page/footer";
import { PricingSection } from "@/components/landing-page/pricing-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <CTA />
      <Footer />
    </main>
  );
}
