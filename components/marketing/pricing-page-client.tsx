"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calculator,
  Check,
  CreditCard,
  Globe2,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/landing/reveal";
import { Tilt } from "@/components/landing/tilt";
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
    tagline: "For solo creators validating the first offer.",
    cta: "Get started",
    ctaHref: "/register",
    ctaVariant: "secondary",
    fee: "3% transaction fee",
    features: ["Up to 5 products", "Unlimited customers", "Basic analytics", "Storefront on TESKEL", "Community support"],
  },
  {
    name: "Pro",
    price: 19,
    monthlyPrice: 19,
    tagline: "For creators shipping consistently.",
    cta: "Start Pro trial",
    ctaHref: "/register",
    ctaVariant: "secondary",
    fee: "1% transaction fee",
    features: ["Unlimited products", "Advanced analytics", "Custom checkout", "License keys & delivery", "Priority support"],
  },
  {
    name: "Business",
    price: 49,
    monthlyPrice: 49,
    tagline: "For serious creators and agencies scaling revenue.",
    highlight: true,
    cta: "Start Business trial",
    ctaHref: "/register",
    ctaVariant: "primary",
    fee: "0% transaction fee",
    features: ["Everything in Pro", "Custom domain", "Advanced automation", "Affiliate program", "Bundles & upsells", "Live chat support"],
  },
  {
    name: "Enterprise",
    price: "custom",
    monthlyPrice: 0,
    tagline: "For teams, schools, agencies, and large storefronts.",
    cta: "Contact sales",
    ctaHref: "mailto:hello@teskel.app",
    ctaVariant: "outline",
    fee: "Custom contract",
    features: ["Everything in Business", "Dedicated account manager", "Custom integrations", "SAML SSO + audit log", "Custom SLA", "Migration support"],
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
    group: "Analytics",
    rows: [
      { label: "Per-product revenue", values: [true, true, true, true] },
      { label: "Customer cohorts", values: [false, true, true, true] },
      { label: "Conversion tracking", values: [false, true, true, true] },
      { label: "Custom exports", values: [false, false, true, true] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Community support", values: [true, true, true, true] },
      { label: "Priority email", values: [false, true, true, true] },
      { label: "Live chat", values: [false, false, true, true] },
      { label: "Dedicated CSM", values: [false, false, false, true] },
    ],
  },
];

const TRUST_LOGOS = ["Vercel", "Framer", "Lindy", "Polar", "Dub"];

export function PricingPageClient() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      <PricingHero yearly={yearly} setYearly={setYearly} />
      <Reveal>
        <PlanMatrix yearly={yearly} />
      </Reveal>
      <Reveal>
        <PricingBento />
      </Reveal>
      <RevenueConsole yearly={yearly} />
      <Reveal>
        <CompareSection />
      </Reveal>
      <NoHiddenFees />
    </>
  );
}

function PricingHero({ yearly, setYearly }: { yearly: boolean; setYearly: (value: boolean) => void }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-night" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[980px] grid-dark mask-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[920px] bg-lime-glow" />
      <div className="pointer-events-none absolute -left-36 top-32 -z-10 h-[440px] w-[440px] rounded-full bg-lime/[0.08] blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-36 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-violet/[0.16] blur-3xl animate-drift [animation-delay:-2s]" />

      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-5 pb-18 pt-16 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-[1fr_470px] lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 text-[12px] text-chalk-muted backdrop-blur-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              Pricing
            </span>
            <span className="font-medium">Start free · scale to 0% platform fee</span>
          </span>
          <h1 className="mt-8 max-w-[820px] text-balance text-[46px] font-black leading-[1.01] tracking-[-0.055em] text-chalk md:text-[82px]">
            Pricing that compounds with your <span className="gradient-text-lime lime-text-glow">creator revenue.</span>
          </h1>
          <p className="mt-6 max-w-[660px] text-[16px] leading-relaxed text-chalk-muted md:text-[19px]">
            No setup tax. No confusing tiers. Start with a storefront, then unlock deeper analytics, automation, affiliates, and zero TESKEL transaction fee as you scale.
          </p>
          <div className="mt-9 inline-flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1 text-[13px] font-bold shadow-soft backdrop-blur-xl">
            <button type="button" onClick={() => setYearly(false)} className={cn("h-11 rounded-xl px-5 transition-colors", !yearly ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk")}>Monthly</button>
            <button type="button" onClick={() => setYearly(true)} className={cn("inline-flex h-11 items-center gap-2 rounded-xl px-5 transition-colors", yearly ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk")}>Yearly <span className={cn("rounded-full px-1.5 text-[10px] font-black", yearly ? "bg-night/15 text-night" : "bg-white/[0.06] text-chalk-dim")}>Save 20%</span></button>
          </div>
        </div>

        <Tilt max={4} scale={1.01} glow className="group hidden rounded-[32px] lg:block">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.22),transparent_62%)]" />
            <div className="relative rounded-[24px] border border-white/[0.08] bg-night-well p-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime">Business plan</p>
                  <p className="mt-1 text-[20px] font-black tracking-[-0.035em] text-chalk">Revenue unlocked</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-night"><CreditCard className="h-5 w-5" /></span>
              </div>
              <div className="mt-5 rounded-3xl border border-lime/20 bg-lime/10 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-lime">Platform fee</p>
                <p className="mt-2 text-[72px] font-black leading-none tracking-[-0.08em] text-chalk">0%</p>
                <p className="mt-3 text-[13px] leading-relaxed text-chalk-muted">Keep more of every sale when the business is ready to scale.</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {["Custom domain", "Affiliates", "Automations", "Live support"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-[12px] font-bold text-chalk-muted">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function PlanMatrix({ yearly }: { yearly: boolean }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => <PlanCard key={plan.name} plan={plan} yearly={yearly} />)}
        </div>
        <p className="mx-auto mt-7 max-w-xl text-center text-[12.5px] leading-relaxed text-chalk-dim">Prices in USD. Cancel anytime. 14-day money-back guarantee on every paid plan.</p>
      </div>
    </section>
  );
}

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const discountedMonthly = Math.round(plan.monthlyPrice * 0.8);
  const shownPrice = plan.price === "custom" ? "Custom" : yearly ? `$${discountedMonthly}` : `$${plan.monthlyPrice}`;
  const billed = plan.price === "custom" ? "Talk to sales" : plan.monthlyPrice === 0 ? "Free forever" : yearly ? `Billed yearly · $${discountedMonthly * 12}/yr` : "Billed monthly";

  return (
    <Tilt max={3.5} scale={1.01} glow className="group rounded-[32px]">
      <div className={cn("relative flex h-full flex-col overflow-hidden rounded-[32px] border p-6 transition-colors md:p-7", plan.highlight ? "border-lime/35 bg-lime/[0.06] shadow-[0_0_80px_rgba(180,243,0,0.12)]" : "border-white/[0.08] bg-white/[0.025] group-hover:border-lime/30")}>
        <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.14),transparent_62%)]" />
        {plan.highlight && <span className="absolute right-6 top-5 rounded-full bg-lime px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-night">Most popular</span>}
        <div className="relative flex flex-1 flex-col">
          <p className="text-[16px] font-black tracking-[-0.02em] text-chalk">{plan.name}</p>
          <p className="mt-2 min-h-[40px] text-[13px] leading-relaxed text-chalk-muted">{plan.tagline}</p>
          <div className="mt-7 flex items-end gap-1.5">
            <span className="text-[52px] font-black leading-none tracking-[-0.07em] text-chalk">{shownPrice}</span>
            {plan.price !== "custom" && <span className="pb-1.5 text-[12.5px] text-chalk-muted">/mo</span>}
          </div>
          <p className="mt-2 text-[11.5px] text-chalk-dim">{billed}</p>
          <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold text-chalk-muted"><ShieldCheck className="h-3 w-3 text-lime" />{plan.fee}</span>
          <ul className="mt-7 flex-1 space-y-3 text-[13px]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-chalk-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /><span>{feature}</span></li>
            ))}
          </ul>
          <Button asChild variant={plan.ctaVariant} className="mt-8 w-full rounded-xl"><Link href={plan.ctaHref}>{plan.cta}<ArrowUpRight className="h-4 w-4" /></Link></Button>
        </div>
      </div>
    </Tilt>
  );
}

function PricingBento() {
  const cards = [
    { icon: Lock, label: "No lock-in", title: "Start with Free and keep every customer path intact.", body: "Upgrade only when advanced revenue tools create more value than they cost." },
    { icon: Zap, label: "Scale mechanics", title: "Business turns TESKEL into an operating layer, not a marketplace tax.", body: "Affiliates, upsells, automations, and analytics are packaged for creators who are already selling." },
    { icon: Globe2, label: "Global default", title: "Built for international storefronts from day one.", body: "Multiple currencies, taxes, delivery, customer records, and checkout surfaces live in the same system." },
  ];
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map(({ icon: Icon, label, title, body }) => (
            <Tilt key={title} max={3.5} scale={1.01} glow className="group rounded-3xl">
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition-colors group-hover:border-lime/30">
                <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_30%_0%,rgba(180,243,0,0.14),transparent_62%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-chalk-muted"><Icon className="h-3 w-3 text-lime" />{label}</span>
                  <h3 className="mt-6 text-[25px] font-black leading-tight tracking-[-0.04em] text-chalk">{title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-chalk-muted">{body}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevenueConsole({ yearly }: { yearly: boolean }) {
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
    <section className="py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 md:px-8 lg:grid-cols-[1fr_520px] lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime"><Calculator className="h-3.5 w-3.5" />Revenue console</span>
          <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">See how much more you keep before you upgrade.</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-chalk-muted md:text-[16px]">Estimate monthly take-home across plans. The interface is designed as a financial command room, not a buried pricing footnote.</p>
          <div className="mt-8 grid max-w-2xl gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="sales" className="text-[12px] font-bold text-chalk">Sales per month</Label>
              <Input id="sales" type="number" min={0} value={salesPerMonth} onChange={(event) => setSalesPerMonth(Math.max(0, Number(event.target.value) || 0))} className="mt-2 h-12 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="price" className="text-[12px] font-bold text-chalk">Average price USD</Label>
              <Input id="price" type="number" min={0} value={avgPrice} onChange={(event) => setAvgPrice(Math.max(0, Number(event.target.value) || 0))} className="mt-2 h-12 rounded-xl" />
            </div>
          </div>
        </div>
        <Tilt max={3.5} scale={1.01} glow className="group rounded-[32px]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.18),transparent_62%)]" />
            <div className="relative">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-chalk-dim">Estimated monthly take-home</p>
              <ul className="mt-5 space-y-3">
                {[
                  { name: "Free", value: numbers.free, fee: "after 3% fee" },
                  { name: "Pro", value: numbers.pro, fee: `after 1% fee + $${proFee}/mo` },
                  { name: "Business", value: numbers.business, fee: `after $${bizFee}/mo, 0% fee`, highlight: true },
                ].map((row) => (
                  <li key={row.name} className={cn("flex items-center justify-between rounded-2xl border bg-night/80 p-4", row.highlight ? "border-lime/30 shadow-soft" : "border-white/[0.08]")}>
                    <div>
                      <p className="text-[13px] font-black text-chalk">{row.name}</p>
                      <p className="mt-1 text-[11.5px] text-chalk-dim">{row.fee}</p>
                    </div>
                    <p className="text-[26px] font-black tracking-[-0.05em] text-chalk">${Math.max(0, Math.round(row.value)).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11.5px] text-chalk-dim">Gross monthly revenue: ${monthlyRevenue.toLocaleString()}. Estimates exclude processor fees, taxes, and refunds.</p>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function CompareSection() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-violet"><BarChart3 className="h-3.5 w-3.5" />Command matrix</span>
            <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">Every stage, side by side.</h2>
          </div>
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[13px] font-bold text-chalk-muted">
            {TRUST_LOGOS.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
        <div className="mt-12 overflow-x-auto rounded-[32px] border border-white/[0.08] bg-night">
          <CompareTable />
        </div>
      </div>
    </section>
  );
}

function CompareTable() {
  const headers = ["Free", "Pro", "Business", "Enterprise"];
  return (
    <table className="w-full min-w-[760px] text-left text-[13.5px]">
      <thead>
        <tr className="border-b border-white/[0.08] bg-white/[0.035]">
          <th className="px-6 py-5 text-[12px] font-black uppercase tracking-[0.14em] text-chalk-dim">Features</th>
          {headers.map((header) => <th key={header} className="px-6 py-5 text-[13px] font-black tracking-tight text-chalk">{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {COMPARE.map((group) => <RowGroup key={group.group} group={group.group} rows={group.rows} />)}
      </tbody>
    </table>
  );
}

function RowGroup({ group, rows }: { group: string; rows: { label: string; values: [CompareValue, CompareValue, CompareValue, CompareValue] }[] }) {
  return (
    <>
      <tr className="border-y border-white/[0.08] bg-white/[0.025]"><td colSpan={5} className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-lime">{group}</td></tr>
      {rows.map((row) => (
        <tr key={row.label} className="border-b border-white/[0.06] last:border-b-0">
          <td className="px-6 py-4 font-bold text-chalk">{row.label}</td>
          {row.values.map((value, index) => <td key={`${row.label}-${index}`} className="px-6 py-4 text-chalk-muted"><CompareCell value={value} /></td>)}
        </tr>
      ))}
    </>
  );
}

function CompareCell({ value }: { value: CompareValue }) {
  if (typeof value === "string") return <span>{value}</span>;
  return value ? <Check className="h-4 w-4 text-lime" /> : <X className="h-4 w-4 text-chalk-dim" />;
}

function NoHiddenFees() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[36px] border border-lime/20 bg-lime p-8 text-night shadow-[0_0_80px_rgba(180,243,0,0.18)] md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-night/60">No hidden fees</p>
            <h2 className="mt-4 text-balance text-[36px] font-black leading-[1.02] tracking-[-0.05em] md:text-[58px]">Launch free, then upgrade when the math is obvious.</h2>
          </div>
          <Link href="/register" className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-night px-6 text-[14px] font-black text-chalk transition hover:bg-night/90">
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
