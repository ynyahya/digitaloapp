"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: number | "custom";
  monthlyPrice: number;
  tagline: string;
  highlight?: boolean;
  cta: string;
  ctaVariant: "primary" | "secondary" | "outline";
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: 0,
    monthlyPrice: 0,
    tagline: "Perfect for getting started.",
    cta: "Get Started",
    ctaVariant: "secondary",
    features: [
      "Up to 5 products",
      "3% transaction fee",
      "Basic analytics",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: 19,
    monthlyPrice: 19,
    tagline: "For growing creators.",
    cta: "Start Pro Trial",
    ctaVariant: "secondary",
    features: [
      "Unlimited products",
      "1% transaction fee",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Business",
    price: 49,
    monthlyPrice: 49,
    tagline: "For serious creators.",
    highlight: true,
    cta: "Start Business Trial",
    ctaVariant: "primary",
    features: [
      "Everything in Pro",
      "0% transaction fee",
      "Custom domain",
      "Advanced automation",
    ],
  },
  {
    name: "Enterprise",
    price: "custom",
    monthlyPrice: 0,
    tagline: "For teams & enterprises.",
    cta: "Contact Sales",
    ctaVariant: "outline",
    features: [
      "Everything in Business",
      "Custom integrations",
      "Dedicated support",
      "SLA & security",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start free. Upgrade as you grow."
        />
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-paper p-1 text-[13px] font-medium">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "h-8 rounded-full px-4 transition-colors",
                !yearly ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "h-8 rounded-full px-4 transition-colors",
                yearly ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              Yearly (20% off)
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => {
            const shownPrice =
              p.price === "custom"
                ? "Custom"
                : yearly
                  ? `$${Math.round((p.monthlyPrice * 12 * 0.8) / 12)}`
                  : `$${p.monthlyPrice}`;
            return (
              <div
                key={p.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-paper p-6 transition-all",
                  p.highlight
                    ? "border-ink shadow-card"
                    : "border-line hover:border-ink/20 hover:shadow-soft",
                )}
              >
                {p.highlight && (
                  <span className="absolute -top-3 right-6 inline-flex h-6 items-center rounded-full bg-ink px-3 text-[10px] font-semibold uppercase tracking-wide text-paper">
                    Popular
                  </span>
                )}
                <p className="text-[14px] font-semibold text-ink">{p.name}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[34px] font-semibold tracking-tight">{shownPrice}</span>
                  {p.price !== "custom" && (
                    <span className="text-[12px] text-ink-muted">/month</span>
                  )}
                </div>
                <p className="mt-2 text-[13px] text-ink-muted">{p.tagline}</p>

                <ul className="mt-6 flex-1 space-y-3 text-[13px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={p.ctaVariant}
                  className="mt-8 w-full justify-center"
                >
                  <Link href={p.price === "custom" ? "/contact" : "/register"}>{p.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
