import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Compass,
  Globe2,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { Tilt } from "@/components/landing/tilt";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Mission — Why we built TESKEL",
  description:
    "We believe the next generation of businesses will be built by independent creators. TESKEL is the operating system to help them ship.",
};

const PRINCIPLES = [
  {
    icon: HeartHandshake,
    label: "Creator first",
    title: "The creator keeps the relationship, the margin, and the leverage.",
    desc: "Every product decision starts with whether it helps independent builders ship sharper offers and keep more of what they earn.",
  },
  {
    icon: Wallet,
    label: "Clear economics",
    title: "No surprise fees. No hidden cliffs. No confusing platform tax.",
    desc: "The business model should be as legible as the product. Start free, scale into better economics when revenue proves it.",
  },
  {
    icon: Globe2,
    label: "Global by default",
    title: "Creators are global before their tooling catches up.",
    desc: "Checkout, currencies, taxes, customers, and delivery should work across markets without duct-taped operations.",
  },
  {
    icon: ShieldCheck,
    label: "Trust surface",
    title: "Reliability is not backend plumbing. It is brand experience.",
    desc: "Refunds, delivery, permissions, analytics, and public pages all shape whether customers trust the creator.",
  },
  {
    icon: Compass,
    label: "Craft matters",
    title: "Creator tools should feel as premium as the products they sell.",
    desc: "We sweat type, density, motion, hierarchy, and copy because every surface helps creators sell.",
  },
  {
    icon: Rocket,
    label: "Ship to learn",
    title: "Real launched offers beat perfect plans and private drafts.",
    desc: "TESKEL is built around velocity: compose the offer, publish the page, learn from customers, and iterate.",
  },
];

const TIMELINE = [
  { year: "2024", title: "Creator commerce starts fragmented", desc: "Products, courses, checkout, analytics, and communities live across too many tools." },
  { year: "2025", title: "Studio + Marketplace converge", desc: "TESKEL brings building, selling, delivery, and public discovery into one operating layer." },
  { year: "Now", title: "The creator command center", desc: "Storefronts, dashboards, analytics, services, events, memberships, and bundles become one system." },
  { year: "Next", title: "$1B paid to creators", desc: "We are building toward a global economy where independent expertise becomes durable business." },
];

const METRICS = [
  ["10×", "fewer tools stitched together"],
  ["0%", "platform fee on Business"],
  ["6", "offer types in one OS"],
  ["120+", "countries as product ambition"],
];

export default function MissionPage() {
  return (
    <>
      <MissionHero />
      <Reveal>
        <Manifesto />
      </Reveal>
      <Reveal>
        <Principles />
      </Reveal>
      <Reveal>
        <Timeline />
      </Reveal>
      <Reveal>
        <BeliefSystem />
      </Reveal>
      <FinalMissionCta />
    </>
  );
}

function MissionHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-night" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[980px] grid-dark mask-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[920px] bg-lime-glow" />
      <div className="pointer-events-none absolute -left-36 top-32 -z-10 h-[440px] w-[440px] rounded-full bg-lime/[0.08] blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-36 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-violet/[0.16] blur-3xl animate-drift [animation-delay:-2s]" />

      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-5 pb-18 pt-16 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-[1fr_500px] lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 text-[12px] text-chalk-muted backdrop-blur-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              Mission
            </span>
            <span className="font-medium">Build the operating system for independent creators</span>
          </span>
          <h1 className="mt-8 max-w-[900px] text-balance text-[46px] font-black leading-[1.01] tracking-[-0.055em] text-chalk md:text-[86px]">
            We are building the company layer for the <span className="gradient-text-lime lime-text-glow">creator economy.</span>
          </h1>
          <p className="mt-6 max-w-[700px] text-[16px] leading-relaxed text-chalk-muted md:text-[19px]">
            TESKEL exists because independent expertise deserves software that feels like infrastructure, storefront, command center, and launch team in one coherent system.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register" className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-black text-night lime-shadow transition hover:bg-lime-bright">
              Join the platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/products" className="group inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-5 text-[14px] font-bold text-chalk backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.05]">
              Explore marketplace
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <Tilt max={4} scale={1.01} glow className="group hidden rounded-[32px] lg:block">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.22),transparent_62%)]" />
            <div className="relative rounded-[24px] border border-white/[0.08] bg-night-well p-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime">Creator economy</p>
                  <p className="mt-1 text-[20px] font-black tracking-[-0.035em] text-chalk">Operating thesis</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-night"><Target className="h-5 w-5" /></span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {METRICS.map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <p className="text-[28px] font-black tracking-[-0.06em] text-chalk">{value}</p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-lime/20 bg-lime/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-night"><BadgeCheck className="h-5 w-5" /></span>
                  <p className="text-[13px] leading-relaxed text-chalk-muted"><span className="font-black text-chalk">The mission:</span> give creators the leverage of a software company without forcing them to become one.</p>
                </div>
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime"><Sparkles className="h-3.5 w-3.5" />Manifesto</span>
          <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">Creators should not need ten tools to run one serious business.</h2>
        </div>
        <div className="space-y-5 text-[16px] leading-relaxed text-chalk-muted md:text-[18px]">
          <p>For the first time, anyone with specialized knowledge can build a global business from a laptop. But the tools still force creators to stitch checkout, file delivery, courses, events, memberships, analytics, taxes, and customer support across a messy stack.</p>
          <p>TESKEL collapses that chaos into one intentional operating system. Not a marketplace tax. Not a no-code toy. A premium commerce layer built with the same care as the products our creators ship.</p>
          <p>We believe creator businesses should be small teams with software-company leverage: beautiful public surfaces, reliable delivery, sharp analytics, and economics that get better as revenue grows.</p>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime"><span className="h-1 w-1 rounded-full bg-lime" />Operating principles</span>
          <h2 className="mt-5 text-balance text-[36px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[56px]">What we refuse to compromise.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-chalk-muted md:text-[16px]">Six principles guide how we design product, commerce, and public creator surfaces.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, label, title, desc }, index) => (
            <Tilt key={title} max={3.5} scale={1.01} glow className="group rounded-3xl">
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition-colors group-hover:border-lime/30">
                <div className={cn("absolute inset-x-0 top-0 h-32", index % 2 ? "bg-[radial-gradient(circle_at_30%_0%,rgba(124,92,255,0.14),transparent_62%)]" : "bg-[radial-gradient(circle_at_30%_0%,rgba(180,243,0,0.14),transparent_62%)]")} />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-chalk-muted"><Icon className="h-3 w-3 text-lime" />{label}</span>
                  <h3 className="mt-6 text-[24px] font-black leading-tight tracking-[-0.04em] text-chalk">{title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-chalk-muted">{desc}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-violet"><Compass className="h-3.5 w-3.5" />Trajectory</span>
          <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">Where the platform is going.</h2>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
          {TIMELINE.map((item) => (
            <li key={item.year} className="bg-night p-7">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-lime">{item.year}</span>
              <h3 className="mt-8 text-[24px] font-black leading-tight tracking-[-0.04em] text-chalk">{item.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-chalk-muted">{item.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BeliefSystem() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
        <Tilt max={3.5} scale={1.01} glow className="group rounded-[32px]">
          <div className="relative h-full overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-8 transition-colors group-hover:border-lime/30">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.16),transparent_62%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-chalk-muted"><Zap className="h-3 w-3 text-lime" />Product belief</span>
              <h3 className="mt-8 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.05em] text-chalk md:text-[48px]">Software should make a one-person business feel like a composed company.</h3>
            </div>
          </div>
        </Tilt>
        <Tilt max={3.5} scale={1.01} glow className="group rounded-[32px]">
          <div className="relative h-full overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-8 transition-colors group-hover:border-lime/30">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.16),transparent_62%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-chalk-muted"><Rocket className="h-3 w-3 text-lime" />Market belief</span>
              <h3 className="mt-8 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.05em] text-chalk md:text-[48px]">The next generation of global brands will start as independent creator storefronts.</h3>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function FinalMissionCta() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[36px] border border-lime/20 bg-lime p-8 text-night shadow-[0_0_80px_rgba(180,243,0,0.18)] md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-night/60">Build with us</p>
            <h2 className="mt-4 text-balance text-[36px] font-black leading-[1.02] tracking-[-0.05em] md:text-[58px]">If you are building a creator business, TESKEL should feel like home base.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-night px-6 text-[14px] font-black text-chalk transition hover:bg-night/90">Start free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <Button asChild variant="secondary" className="h-12 rounded-2xl border-night/10 bg-night/10 text-night hover:bg-night/15"><Link href="/creators">See creators</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
