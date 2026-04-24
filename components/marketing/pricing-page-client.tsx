"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Calculator,
  ArrowUpRight,
  Lock,
  Globe2,
  Headphones,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: number | "custom";
  monthlyPrice: number;
  tagline: string;
  highlight?: boolean;
  cta: string;
  ctaHref: string;
  ctaVariant: "primary" | "secondary" | "outline";
  fee: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: 0,
    monthlyPrice: 0,
    tagline: "For solo creators getting started.",
    cta: "Get started",
    ctaHref: "/register",
    ctaVariant: "secondary",
    fee: "3% transaction fee",
    features: [
      "Up to 5 products",
      "Unlimited customers",
      "Basic analytics",
      "Storefront on digitalo.app",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: 19,
    monthlyPrice: 19,
    tagline: "For growing creators with momentum.",
    cta: "Start Pro trial",
    ctaHref: "/register",
    ctaVariant: "secondary",
    fee: "1% transaction fee",
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Custom checkout",
      "License keys & delivery",
      "Priority email support",
    ],
  },
  {
    name: "Business",
    price: 49,
    monthlyPrice: 49,
    tagline: "For serious creators and agencies.",
    highlight: true,
    cta: "Start Business trial",
    ctaHref: "/register",
    ctaVariant: "primary",
    fee: "0% transaction fee",
    features: [
      "Everything in Pro",
      "Custom domain",
      "Advanced automation",
      "Affiliate program",
      "Bundles & upsells",
      "Live chat support",
    ],
  },
  {
    name: "Enterprise",
    price: "custom",
    monthlyPrice: 0,
    tagline: "For teams, agencies, and large stores.",
    cta: "Contact sales",
    ctaHref: "mailto:hello@digitalo.app",
    ctaVariant: "outline",
    fee: "Custom contract",
    features: [
      "Everything in Business",
      "Dedicated account manager",
      "Custom integrations",
      "SAML SSO + audit log",
      "Custom SLA & security review",
      "Onboarding & migration",
    ],
  },
];

type CompareValue = boolean | string;
const COMPARE: { group: string; rows: { label: string; values: [CompareValue, CompareValue, CompareValue, CompareValue] }[] }[] = [
  {
    group: "Selling",
    rows: [
      { label: "Products", values: ["5", "Unlimited", "Unlimited", "Unlimited"] },
      { label: "Transaction fee", values: ["3%", "1%", "0%", "Custom"] },
      { label: "Custom domain", values: [false, false, true, true] },
      { label: "Affiliate program", values: [false, false, true, true] },
      { label: "Bundles & upsells", values: [false, false, true, true] },
    ],
  },
  {
    group: "Analytics & insights",
    rows: [
      { label: "Per-product revenue", values: [true, true, true, true] },
      { label: "Customer cohorts", values: [false, true, true, true] },
      { label: "Conversion tracking", values: [false, true, true, true] },
      { label: "Custom reports & exports", values: [false, false, true, true] },
    ],
  },
  {
    group: "Support & ops",
    rows: [
      { label: "Community support", values: [true, true, true, true] },
      { label: "Priority email", values: [false, true, true, true] },
      { label: "Live chat", values: [false, false, true, true] },
      { label: "Dedicated CSM", values: [false, false, false, true] },
      { label: "SAML SSO + audit log", values: [false, false, false, true] },
    ],
  },
];

const TRUST_LOGOS = ["Vercel", "Framer", "Lindy", "Polar", "Dub"];

export function PricingPageClient() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      <PricingHero yearly={yearly} setYearly={setYearly} />

      <section className="pb-14 md:pb-20">
        <Container size="wide">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <PlanCard key={p.name} plan={p} yearly={yearly} />
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-[12.5px] text-ink-subtle">
            Prices in USD. Cancel anytime. 14-day money-back guarantee on every paid plan.
          </p>
        </Container>
      </section>

      <TrustStrip />

      <RoiCalculator yearly={yearly} />

      <section className="border-t border-line bg-paper-soft/40 py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            align="center"
            eyebrow="Compare plans"
            title="Pick the plan that fits your stage."
            description="Every feature, side by side."
          />
          <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-paper">
            <CompareTable />
          </div>
        </Container>
      </section>

      <NoHiddenFees />
    </>
  );
}

function PricingHero({
  yearly,
  setYearly,
}: {
  yearly: boolean;
  setYearly: (v: boolean) => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pt-14 pb-10 md:pt-20 md:pb-12">
      <div className="absolute inset-x-0 top-0 h-[460px] bg-mono-radial" />
      <Container size="wide" className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
            <Sparkles className="h-3.5 w-3.5" />
            Simple, transparent pricing
          </span>
          <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
            Start free. Scale as
            <br /> your business grows.
          </h1>
          <p className="mt-5 text-pretty text-[15px] leading-relaxed text-ink-muted md:text-[16.5px]">
            One platform for selling digital products. No setup fees. No surprises. Down to 0%
            transaction fee on Business.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-paper p-1 text-[13px] font-medium shadow-soft">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "h-9 rounded-full px-5 transition-colors",
                !yearly ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full px-5 transition-colors",
                yearly ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              Yearly
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-semibold",
                  yearly ? "bg-paper/15 text-paper" : "bg-paper-muted text-ink-subtle",
                )}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const discountedMonthly = Math.round(plan.monthlyPrice * 0.8);
  const shownPrice =
    plan.price === "custom"
      ? "Custom"
      : yearly
        ? `$${discountedMonthly}`
        : `$${plan.monthlyPrice}`;
  const billed =
    plan.price === "custom"
      ? "Talk to sales"
      : plan.monthlyPrice === 0
        ? "Free forever"
        : yearly
          ? `Billed yearly · $${discountedMonthly * 12}/yr`
          : "Billed monthly";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border bg-paper p-7 transition-all",
        plan.highlight
          ? "border-ink shadow-card"
          : "border-line hover:border-ink/20 hover:shadow-soft",
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 right-7 inline-flex h-6 items-center rounded-full bg-ink px-3 text-[10px] font-semibold uppercase tracking-wide text-paper">
          Most popular
        </span>
      )}
      <p className="text-[14px] font-semibold tracking-tight text-ink">{plan.name}</p>
      <p className="mt-1.5 text-[13px] text-ink-muted">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-[40px] font-semibold tracking-[-0.02em] text-ink">{shownPrice}</span>
        {plan.price !== "custom" && (
          <span className="text-[12.5px] text-ink-muted">/mo</span>
        )}
      </div>
      <p className="mt-1 text-[11.5px] text-ink-subtle">{billed}</p>

      <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-paper-muted px-2.5 py-1 text-[11px] font-medium text-ink-muted">
        <ShieldCheck className="h-3 w-3" />
        {plan.fee}
      </span>

      <ul className="mt-6 flex-1 space-y-3 text-[13px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-ink-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button asChild variant={plan.ctaVariant} className="mt-7 w-full rounded-full">
        <Link href={plan.ctaHref}>
          {plan.cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-line bg-paper-soft py-10">
      <Container size="wide">
        <div className="flex flex-col items-center gap-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
            Trusted by creators shipping products on
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {TRUST_LOGOS.map((name) => (
              <li
                key={name}
                className="text-[15px] font-semibold tracking-tight text-ink/70 transition-colors hover:text-ink"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function RoiCalculator({ yearly }: { yearly: boolean }) {
  const [salesPerMonth, setSalesPerMonth] = useState(120);
  const [avgPrice, setAvgPrice] = useState(49);

  const monthlyRevenue = salesPerMonth * avgPrice;
  const proFee = yearly ? Math.round(19 * 0.8) : 19;
  const bizFee = yearly ? Math.round(49 * 0.8) : 49;
  const numbers = useMemo(() => {
    const free = monthlyRevenue * 0.97;
    const pro = monthlyRevenue * 0.99 - proFee;
    const business = monthlyRevenue - bizFee;
    return { free, pro, business };
  }, [monthlyRevenue, proFee, bizFee]);

  return (
    <section className="py-14 md:py-20">
      <Container size="wide">
        <div className="grid gap-10 rounded-3xl border border-line bg-paper p-8 md:grid-cols-[1.1fr_1fr] md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-muted px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
              <Calculator className="h-3.5 w-3.5" />
              Revenue calculator
            </span>
            <h2 className="mt-4 text-balance text-[28px] font-semibold leading-tight tracking-tight text-ink md:text-[34px]">
              See how much more you keep on Digitalo.
            </h2>
            <p className="mt-3 text-[14px] text-ink-muted">
              Estimate your monthly take-home across plans. The Business plan eliminates
              transaction fees entirely — pure upside as you scale.
            </p>

            <div className="mt-8 grid gap-5">
              <div>
                <Label htmlFor="sales" className="text-[12px] font-medium text-ink">
                  Sales per month
                </Label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    id="sales"
                    type="number"
                    min={0}
                    value={salesPerMonth}
                    onChange={(e) => setSalesPerMonth(Math.max(0, Number(e.target.value) || 0))}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="price" className="text-[12px] font-medium text-ink">
                  Average product price (USD)
                </Label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(Math.max(0, Number(e.target.value) || 0))}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
              <p className="text-[12px] text-ink-subtle">
                Estimates exclude payment processor fees, taxes, and refunds.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-paper-soft/60 p-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
                Estimated monthly take-home
              </p>
              <ul className="mt-5 space-y-4">
                {[
                  { name: "Free", value: numbers.free, fee: "after 3% fee" },
                  { name: "Pro", value: numbers.pro, fee: `after 1% fee + $${proFee}/mo` },
                  {
                    name: "Business",
                    value: numbers.business,
                    fee: `after $${bizFee}/mo, 0% fee`,
                    highlight: true,
                  },
                ].map((row) => (
                  <li
                    key={row.name}
                    className={cn(
                      "flex items-center justify-between rounded-xl border bg-paper p-4",
                      row.highlight ? "border-ink shadow-soft" : "border-line",
                    )}
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-ink">{row.name}</p>
                      <p className="text-[11.5px] text-ink-subtle">{row.fee}</p>
                    </div>
                    <p className="text-[20px] font-semibold tracking-tight text-ink">
                      ${Math.max(0, Math.round(row.value)).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[11.5px] text-ink-subtle">
              Gross monthly revenue: ${monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CompareTable() {
  const headers = ["Free", "Pro", "Business", "Enterprise"];
  return (
    <table className="w-full text-left text-[13.5px]">
      <thead>
        <tr className="border-b border-line bg-paper-soft/60">
          <th className="px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Features
          </th>
          {headers.map((h) => (
            <th
              key={h}
              className="px-6 py-5 text-[13px] font-semibold tracking-tight text-ink"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {COMPARE.map((g) => (
          <RowGroup key={g.group} group={g.group} rows={g.rows} />
        ))}
      </tbody>
    </table>
  );
}

function RowGroup({
  group,
  rows,
}: {
  group: string;
  rows: { label: string; values: [CompareValue, CompareValue, CompareValue, CompareValue] }[];
}) {
  return (
    <>
      <tr className="border-y border-line bg-paper-soft/40">
        <td
          colSpan={5}
          className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle"
        >
          {group}
        </td>
      </tr>
      {rows.map((r) => (
        <tr key={r.label} className="border-b border-line last:border-b-0">
          <td className="px-6 py-3.5 text-ink">{r.label}</td>
          {r.values.map((v, idx) => (
            <td key={idx} className="px-6 py-3.5 text-ink-muted">
              <CellValue v={v} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function CellValue({ v }: { v: CompareValue }) {
  if (v === true) return <Check className="h-4 w-4 text-ink" />;
  if (v === false) return <X className="h-4 w-4 text-ink-subtle" />;
  return <span className="text-ink">{v}</span>;
}

function NoHiddenFees() {
  return (
    <section className="py-14 md:py-20">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="No hidden fees"
          title="What you see is what you get."
          description="Transparent pricing, transparent platform. We don't make money when you can't."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "14-day money-back",
              desc: "If Digitalo doesn't work for you, get a full refund within 14 days. No questions asked.",
            },
            {
              icon: Lock,
              title: "Cancel anytime",
              desc: "No annual lock-ins on monthly plans. Cancel from settings — your data stays yours.",
            },
            {
              icon: Globe2,
              title: "Global by default",
              desc: "Sell in 120+ countries with multi-currency, tax, and VAT handled for you.",
            },
            {
              icon: Headphones,
              title: "Real human support",
              desc: "Priority support included on Pro+. Live chat on Business. Dedicated CSM on Enterprise.",
            },
            {
              icon: Sparkles,
              title: "Free forever tier",
              desc: "Start at $0 with 5 products and a digitalo.app storefront. Upgrade only when you need to.",
            },
            {
              icon: Calculator,
              title: "Predictable economics",
              desc: "0% transaction fee on Business means your scale is your scale — not ours.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
