"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";

type Plan = {
  id: "starter" | "pro" | "business";
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  features: string[];
  fee: string;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For new creators getting their first sale.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    ctaHref: "/register?plan=starter",
    fee: "5% transaction fee",
    features: [
      "Storefront on teskel.com",
      "Unlimited products",
      "Stripe checkout",
      "Basic analytics",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For creators ready to scale to 6 figures.",
    monthly: 29,
    yearly: 24,
    cta: "Start 14-day trial",
    ctaHref: "/register?plan=pro",
    fee: "0% transaction fee",
    highlight: true,
    features: [
      "Everything in Starter",
      "Custom domain & branding",
      "Course cohorts & certificates",
      "Email automations",
      "Affiliate program",
      "Priority support",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For teams running an entire creator business.",
    monthly: 99,
    yearly: 79,
    cta: "Talk to us",
    ctaHref: "/contact?plan=business",
    fee: "0% transaction fee",
    features: [
      "Everything in Pro",
      "Team seats & roles",
      "Advanced analytics & cohorts",
      "Multi-currency & VAT",
      "API & webhooks",
      "Dedicated success manager",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = React.useState(true);

  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-lime-fade opacity-50" />
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime">
            <span className="h-1 w-1 rounded-full bg-lime" />
            Pricing
          </span>
          <h2 className="mt-5 text-balance text-[36px] font-black leading-[1.05] tracking-[-0.035em] text-chalk md:text-[56px]">
            Pricing built to make you{" "}
            <span className="gradient-text-lime">money.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-chalk-muted md:text-[16.5px]">
            Start free, upgrade when you scale. No hidden fees, no surprises.
          </p>

          {/* toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
            <button
              onClick={() => setYearly(false)}
              className={[
                "rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition",
                !yearly ? "bg-white/[0.08] text-chalk" : "text-chalk-muted",
              ].join(" ")}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition",
                yearly ? "bg-lime text-night" : "text-chalk-muted",
              ].join(" ")}
            >
              Yearly
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider",
                  yearly ? "bg-night/20 text-night" : "bg-lime/15 text-lime",
                ].join(" ")}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <div
                key={p.id}
                className={[
                  "relative flex flex-col overflow-hidden rounded-3xl p-6 md:p-7",
                  p.highlight
                    ? "border border-lime/30 bg-gradient-to-b from-lime/[0.07] via-night-raised to-night-raised lg:scale-[1.02]"
                    : "surface-night-soft",
                ].join(" ")}
              >
                {p.highlight && (
                  <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-night">
                    <Sparkles className="h-2.5 w-2.5" /> Most popular
                  </span>
                )}

                <h3 className="text-[15px] font-bold text-chalk">{p.name}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-chalk-muted">
                  {p.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-[44px] font-black tracking-[-0.04em] text-chalk md:text-[52px]">
                    ${price}
                  </span>
                  <span className="text-[12px] text-chalk-muted">
                    {price === 0 ? "forever" : "/ month"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-lime">
                  {p.fee}
                </p>

                <Link
                  href={p.ctaHref}
                  className={[
                    "group mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold transition",
                    p.highlight
                      ? "bg-lime text-night lime-shadow hover:bg-lime-bright"
                      : "border border-white/10 bg-white/[0.03] text-chalk hover:border-white/25 hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  {p.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <div className="mt-7 border-t border-white/[0.06] pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-chalk-dim">
                    {p.id === "starter" ? "Includes" : `Everything in ${p.id === "pro" ? "Starter" : "Pro"}, plus`}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[13px] text-chalk-muted"
                      >
                        <Check
                          className={[
                            "mt-0.5 h-3.5 w-3.5 flex-shrink-0",
                            p.highlight ? "text-lime" : "text-chalk-muted",
                          ].join(" ")}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[12px] text-chalk-dim">
          All plans include 14-day money back guarantee · Cancel anytime
        </p>
      </div>
    </section>
  );
}
