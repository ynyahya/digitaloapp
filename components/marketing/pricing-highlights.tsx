"use client";

import Link from "next/link";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HIGHLIGHT_PLANS = [
  {
    name: "Free",
    price: 0,
    tagline: "For solo creators getting started.",
    cta: "Get started",
    ctaHref: "/register",
    ctaVariant: "secondary" as const,
    fee: "3% transaction fee",
    features: [
      "Up to 5 products",
      "Unlimited customers",
      "Basic analytics",
      "Community support",
    ],
  },
  {
    name: "Business",
    price: 49,
    tagline: "For serious creators and agencies.",
    highlight: true,
    cta: "Start Business trial",
    ctaHref: "/register",
    ctaVariant: "primary" as const,
    fee: "0% transaction fee",
    features: [
      "Unlimited products",
      "Custom domain",
      "Advanced automation",
      "Affiliate program",
      "Live chat support",
    ],
  },
];

export function PricingHighlights() {
  return (
    <section className="py-20 md:py-32 bg-paper-soft/30">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Simple, transparent economics."
          description="Mulai gratis, tingkatkan saat bisnis Anda tumbuh. Tidak ada biaya tersembunyi."
        />

        <div className="mt-16 flex flex-col items-center justify-center gap-8 lg:flex-row">
          {HIGHLIGHT_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex w-full max-w-sm flex-col rounded-[32px] border bg-paper p-8 transition-all duration-500",
                plan.highlight
                  ? "border-ink shadow-2xl scale-[1.02] z-10"
                  : "border-line hover:border-ink/20"
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 right-8 inline-flex h-6 items-center rounded-full bg-ink px-3 text-[10px] font-semibold uppercase tracking-wide text-paper">
                  Recommended for scale
                </span>
              )}
              
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-bold tracking-tight text-ink">{plan.name}</p>
                {plan.highlight && <Sparkles className="h-3.5 w-3.5 text-ink" />}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{plan.tagline}</p>

              <div className="mt-8 flex items-baseline gap-1.5">
                <span className="text-[48px] font-black tracking-tight text-ink">${plan.price}</span>
                <span className="text-[14px] font-medium text-ink-muted">/month</span>
              </div>
              
              <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-paper-soft px-3 py-1 text-[11px] font-bold text-ink-muted">
                {plan.fee}
              </div>

              <ul className="mt-8 flex-1 space-y-4 text-[14px]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-ink-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.ctaVariant}
                size="lg"
                className="mt-10 w-full rounded-full"
              >
                <Link href={plan.ctaHref}>
                  {plan.cta}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-[14px] font-medium text-ink-muted">
            Looking for more features or custom enterprise plans?
          </p>
          <Button variant="ghost" size="lg" className="rounded-full font-bold" asChild>
            <Link href="/pricing">
              View all plans & comparison
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
