"use client";

import * as React from "react";
import { Plus, Minus, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Switched from Gumroad + Kajabi + Mailchimp to TESKEL. My MRR doubled in 90 days because I finally have one funnel I can actually optimize.",
    name: "Maya Lin",
    role: "Founder, Stellar Studio",
    color: "#B4F300",
    revenue: "$420K/yr",
  },
  {
    quote:
      "The cohort tooling alone is worth it. Drip lessons, certificates, and Stripe payouts — done. I shipped my first cohort in two days.",
    name: "Tomás Rivera",
    role: "Build in Public coach",
    color: "#7C5CFF",
    revenue: "$180K/yr",
  },
  {
    quote:
      "I run a 3-person studio. TESKEL replaced six tools, saved us $1,400/month, and our customers say checkout feels like Apple.",
    name: "Aisha Khalil",
    role: "Creative Director, Obsidian",
    color: "#22D3EE",
    revenue: "$1.2M/yr",
  },
  {
    quote:
      "Affiliate program took 5 minutes to set up. Affiliates brought in 38% of last month's revenue. Insane leverage.",
    name: "Jordan Park",
    role: "Indie founder",
    color: "#FF5C28",
    revenue: "$96K/yr",
  },
  {
    quote:
      "Coming from Teachable, the analytics are night and day. I can see where revenue leaks and fix it the same hour. Game changer.",
    name: "Riya Mehta",
    role: "Course creator, Founder Club",
    color: "#F59E0B",
    revenue: "$340K/yr",
  },
];

const FAQS = [
  {
    q: "How is TESKEL different from Gumroad, Kajabi, or Teachable?",
    a: "Gumroad is a marketplace with a basic checkout. Kajabi/Teachable are course-only LMS. TESKEL is the only platform that combines storefront, courses, cohorts, email, affiliates, and CRM in one — with a checkout that converts and zero transaction fees on Pro+.",
  },
  {
    q: "Can I migrate from another platform?",
    a: "Yes. We offer a guided migration for paid plans — bring your products, courses, customers, and email lists. White-glove migration is included on Business.",
  },
  {
    q: "What payment methods are supported?",
    a: "Stripe, Apple Pay, Google Pay, and major credit cards. We support 135+ currencies, automatic VAT/tax handling, and instant payouts.",
  },
  {
    q: "Do you take a cut of my revenue?",
    a: "Starter has a 5% transaction fee. Pro and Business have 0% — you keep 100% (minus standard Stripe processing fees).",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes — Pro and Business plans include free custom domain hosting with SSL.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your data is yours. Export everything (products, customers, courses) anytime as CSV/JSON. Cancel from settings — no phone calls required.",
  },
  {
    q: "Is there a free trial?",
    a: "Starter is free forever. Pro includes a 14-day full-feature trial — no credit card needed.",
  },
];

export function TestimonialsFaq() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* testimonials */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime">
              <span className="h-1 w-1 rounded-full bg-lime" />
              Loved by creators
            </span>
            <h2 className="mt-5 text-balance text-[32px] font-black leading-[1.05] tracking-[-0.035em] text-chalk md:text-[44px]">
              Don't take our word.{" "}
              <span className="text-chalk-muted">Take theirs.</span>
            </h2>

            <div className="mt-8 columns-1 gap-4 sm:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.035]"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-[14px] leading-relaxed text-chalk">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold text-night"
                      style={{ background: t.color }}
                    >
                      {t.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-chalk">{t.name}</p>
                      <p className="truncate text-[11px] text-chalk-muted">
                        {t.role}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-lime">
                      {t.revenue}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-violet">
              <span className="h-1 w-1 rounded-full bg-violet" />
              FAQ
            </span>
            <h2 className="mt-5 text-balance text-[32px] font-black leading-[1.05] tracking-[-0.035em] text-chalk md:text-[44px]">
              Questions, answered.
            </h2>
            <div className="mt-8 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {FAQS.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.015]"
      >
        <span className="text-[13.5px] font-semibold text-chalk">{q}</span>
        <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-chalk-muted">
          {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </span>
      </button>
      <div
        className={[
          "grid overflow-hidden transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0">
          <p className="px-5 pb-4 text-[13px] leading-relaxed text-chalk-muted">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
