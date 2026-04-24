import { ArrowRight, Box, BarChart3, Truck, Repeat, FileText } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  {
    icon: Box,
    title: "Sell digital products instantly",
    body: "Launch your store in minutes.",
  },
  {
    icon: BarChart3,
    title: "Zero-code storefronts",
    body: "Beautiful stores, no code required.",
  },
  {
    icon: Truck,
    title: "Automated delivery",
    body: "Secure, instant downloads.",
  },
  {
    icon: Repeat,
    title: "Subscriptions",
    body: "Recurring revenue, simplified.",
  },
  {
    icon: FileText,
    title: "Licensing",
    body: "Protect your work effortlessly.",
  },
];

export function ForCreatorsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                For Creators
              </span>
              <h2 className="mt-4 text-balance text-[32px] font-semibold leading-tight tracking-tight text-ink md:text-[40px]">
                Everything you need to sell digital products
              </h2>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-muted">
                Launch your store in minutes.
              </p>
            </div>

            <ul className="mt-10 space-y-4">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-[13px] text-ink-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button className="mt-10 self-start" asChild>
              <Link href="/register">
                Start Selling Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <AnalyticsPanel />
        </div>
      </Container>
    </section>
  );
}

function AnalyticsPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink bg-ink p-6 text-paper shadow-card md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-6 rounded-md bg-paper/15" />
          <span className="text-[13px] font-semibold">Analytics Overview</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="rounded-full bg-paper/15 px-2 py-0.5">30D</span>
          <span className="rounded-full px-2 py-0.5 text-paper/60">90D</span>
          <span className="rounded-full px-2 py-0.5 text-paper/60">1Y</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <DarkStat label="Revenue" value="$128,775" delta="+24.5%" />
        <DarkStat label="Sales" value="3,892" delta="+18.2%" />
        <DarkStat label="Conversion" value="4.7%" delta="+8.1%" />
        <DarkStat label="Avg. Order" value="$33.12" delta="+12.4%" />
      </div>

      <div className="mt-8 rounded-xl border border-paper/10 bg-paper/5 p-5">
        <div className="flex items-center justify-between text-[12px] text-paper/70">
          <span>Revenue</span>
          <span>May 22 · $8,790</span>
        </div>
        <svg viewBox="0 0 500 120" className="mt-3 h-28 w-full text-paper">
          <path
            d="M0 80 C 40 70 60 60 100 65 S 160 95 200 80 S 280 30 320 40 S 380 70 420 50 S 480 30 500 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0 80 C 40 70 60 60 100 65 S 160 95 200 80 S 280 30 320 40 S 380 70 420 50 S 480 30 500 18 L 500 120 L 0 120 Z"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>
        <div className="mt-2 flex items-center justify-between text-[10.5px] text-paper/50">
          <span>May 1</span>
          <span>May 8</span>
          <span>May 15</span>
          <span>May 22</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-paper/10 bg-paper/5 p-5">
        <p className="text-[12px] font-semibold">Top Countries</p>
        <div className="mt-3 space-y-2.5 text-[12px]">
          {[
            { c: "United States", v: "42%" },
            { c: "India", v: "18%" },
            { c: "United Kingdom", v: "9%" },
            { c: "Canada", v: "6%" },
            { c: "Australia", v: "5%" },
          ].map((r) => (
            <div key={r.c} className="flex items-center justify-between text-paper/80">
              <span>{r.c}</span>
              <span className="text-paper">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DarkStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div>
      <p className="text-[11px] text-paper/60">{label}</p>
      <p className="mt-1 text-[22px] font-semibold tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-emerald-300">{delta}</p>
    </div>
  );
}
