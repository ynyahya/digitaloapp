import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";

const TRUSTED = ["Vercel", "Framer", "Lindy", "Polar", "dub"];

const STATS = [
  { label: "Creators", value: "10k+" },
  { label: "Digital Sales", value: "$5M+" },
  { label: "Products Sold", value: "150k+" },
  { label: "Countries", value: "120+" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-mono-radial" />
      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <Sparkles className="h-3.5 w-3.5" />
              The operating system for digital creators
            </span>
            <h1 className="mt-6 text-balance text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-ink md:text-[64px]">
              Create, sell, and scale
              <br /> digital products.
            </h1>
            <p className="mt-5 max-w-[540px] text-pretty text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
              Launch storefronts, sell products, manage clients, and grow with one
              intelligent commerce platform built for the creator economy.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Selling
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">Explore Marketplace</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
                Trusted by creators shipping products on:
              </p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {TRUSTED.map((name) => (
                  <li
                    key={name}
                    className="text-[14px] font-semibold tracking-tight text-ink/70 transition-colors hover:text-ink"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-4 gap-5">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-[20px] font-semibold tracking-tight text-ink md:text-[22px]">
                    {s.value}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating dashboard mockup */}
          <HeroMockup />
        </div>
      </Container>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      {/* Main dashboard card */}
      <div className="relative rounded-2xl border border-line bg-paper p-5 shadow-card">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-md bg-ink" />
            <span className="text-[13px] font-semibold">Overview</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] text-paper">7D</span>
            <span className="rounded-full border border-line px-2 py-0.5 text-[10px]">30D</span>
            <span className="rounded-full border border-line px-2 py-0.5 text-[10px]">90D</span>
            <span className="rounded-full border border-line px-2 py-0.5 text-[10px]">1Y</span>
          </div>
        </div>
        <div className="rounded-xl bg-paper-muted p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
            Revenue
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[28px] font-semibold tracking-tight">$128,775</span>
            <span className="text-[11px] font-medium text-emerald-600">+24.5% vs last month</span>
          </div>
          <svg viewBox="0 0 400 80" className="mt-4 h-16 w-full text-ink">
            <path
              d="M0 55 C 40 50 60 30 100 35 S 160 60 200 50 S 280 10 320 22 S 380 30 400 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M0 55 C 40 50 60 30 100 35 S 160 60 200 50 S 280 10 320 22 S 380 30 400 18 L 400 80 L 0 80 Z"
              fill="currentColor"
              fillOpacity="0.05"
            />
          </svg>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniStat label="Sales" value="3,892" delta="+18.2%" />
          <MiniStat label="Earnings" value="$21,650" delta="+19.6%" />
        </div>
        <div className="mt-4 space-y-2">
          <TopProductRow name="Notion Finance Tracker" value="$12,448" />
          <TopProductRow name="SaaS Starter Kit" value="$8,375" />
          <TopProductRow name="Framer Portfolio Kit" value="$6,082" />
          <TopProductRow name="AI Prompts Mega Pack" value="$5,671" />
        </div>
      </div>

      {/* Floating mini product cards */}
      <div className="absolute -bottom-10 -left-10 hidden w-56 rotate-[-4deg] rounded-2xl border border-line bg-paper p-3 shadow-ring md:block">
        <div className="aspect-[5/3] rounded-lg bg-gradient-to-br from-ink to-[#2a2a2a]" />
        <div className="mt-2 px-1">
          <p className="text-[12px] font-semibold">SaaS Starter Kit</p>
          <p className="text-[10px] text-ink-muted">by MakerStack</p>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="font-semibold">$49</span>
            <span className="flex items-center gap-1 text-ink-muted">
              <StarRating value={4.9} size={10} />
              2.1k sales
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -right-8 -top-4 hidden w-56 rotate-[4deg] rounded-2xl border border-line bg-paper p-3 shadow-ring md:block">
        <div className="aspect-[5/3] rounded-lg bg-gradient-to-br from-[#1a1a1a] via-ink-soft to-[#2a2a2a]" />
        <div className="mt-2 px-1">
          <p className="text-[12px] font-semibold">Notion Second Brain</p>
          <p className="text-[10px] text-ink-muted">by Notionify</p>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="font-semibold">$29</span>
            <span className="flex items-center gap-1 text-ink-muted">
              <StarRating value={4.8} size={10} />
              1.6k sales
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className="mt-1 text-[18px] font-semibold tracking-tight">{value}</p>
      <p className="text-[10.5px] font-medium text-emerald-600">{delta}</p>
    </div>
  );
}

function TopProductRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[12.5px]">
      <span className="flex items-center gap-2">
        <span className="inline-block h-5 w-5 rounded bg-ink" />
        {name}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
