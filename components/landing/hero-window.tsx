"use client";

import * as React from "react";
import {
  TrendingUp,
  ShoppingBag,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Lock,
  ArrowUpRight,
  Play,
} from "lucide-react";

type View = "store" | "course" | "analytics" | "checkout";

const VIEWS: { id: View; label: string }[] = [
  { id: "store", label: "Storefront" },
  { id: "course", label: "Course" },
  { id: "analytics", label: "Analytics" },
  { id: "checkout", label: "Checkout" },
];

export function HeroWindow() {
  const [active, setActive] = React.useState<View>("store");
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const order: View[] = ["store", "course", "analytics", "checkout"];
    const id = setInterval(() => {
      setActive((prev) => {
        const i = order.indexOf(prev);
        return order[(i + 1) % order.length];
      });
    }, 4500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full"
    >
      {/* tab pills */}
      <div className="absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-paper/80 p-1 shadow-soft backdrop-blur-xl md:inline-flex">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            className={[
              "relative rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition",
              active === v.id
                ? "bg-lime text-night shadow-[0_0_24px_-4px_rgba(180,243,0,0.7)]"
                : "text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* window chrome */}
      <div className="surface-night relative overflow-hidden rounded-[24px]">
        <div className="flex items-center justify-between border-b border-line bg-paper-soft/60 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-line-strong" />
            <span className="h-3 w-3 rounded-full bg-line-strong" />
            <span className="h-3 w-3 rounded-full bg-line-strong" />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-paper/60 px-3 py-1 text-[10.5px] font-mono font-medium text-ink-muted">
            <Lock className="h-3 w-3 text-ink-subtle" />
            studio.teskel.com/{active}
          </div>
          <div className="w-12" />
        </div>

        {/* mobile tab pills */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line bg-paper-soft/60 px-3 py-2 md:hidden scrollbar-none">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              className={[
                "flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition",
                active === v.id
                  ? "bg-lime text-night"
                  : "text-ink-muted",
              ].join(" ")}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* viewport */}
        <div className="relative aspect-[16/10] w-full">
          {VIEWS.map((v) => (
            <div
              key={v.id}
              className={[
                "absolute inset-0 transition-all duration-700",
                active === v.id
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 translate-y-4",
              ].join(" ")}
            >
              {v.id === "store" && <StoreView />}
              {v.id === "course" && <CourseView />}
              {v.id === "analytics" && <AnalyticsView />}
              {v.id === "checkout" && <CheckoutView />}
            </div>
          ))}
        </div>
      </div>

      {/* progress indicator */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            aria-label={`View ${v.label}`}
            className={[
              "h-1 rounded-full transition-all",
              active === v.id
                ? "w-8 bg-lime"
                : "w-3 bg-line-strong hover:bg-line",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────── Mock views ───────── */

function StoreView() {
  return (
    <div className="grid h-full grid-cols-[180px_1fr] bg-paper">
      <aside className="hidden border-r border-line bg-paper-soft/70 p-4 lg:block">
        <div className="space-y-1">
          {["Storefront", "Products", "Orders", "Customers", "Analytics", "Settings"].map((label, i) => (
            <div
              key={label}
              className={[
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium",
                i === 0 ? "bg-lime/10 text-lime" : "text-ink-muted",
              ].join(" ")}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              {label}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-line bg-paper p-3 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">This month</p>
          <p className="mt-1 text-[18px] font-black text-ink">$42,180</p>
          <p className="mt-1 text-[10px] text-emerald-400">↑ 24% vs last</p>
        </div>
      </aside>

      <div className="overflow-hidden p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">Storefront</p>
            <p className="mt-0.5 text-[15px] font-bold text-ink">Your products</p>
          </div>
          <button className="rounded-lg bg-lime px-3 py-1.5 text-[11px] font-bold text-night">
            + New product
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { title: "SaaS Starter Kit", price: "$129", tag: "Hot" },
            { title: "Design System Pro", price: "$79", tag: "New" },
            { title: "Notion OS Bundle", price: "$49", tag: "Popular" },
            { title: "Cohort: Build in Public", price: "$299", tag: "Live" },
            { title: "Icon Library 2K", price: "$39", tag: "" },
            { title: "Founder Templates", price: "$59", tag: "" },
          ].map((p, i) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-xl border border-line bg-paper-soft p-3 shadow-soft transition hover:border-lime/40"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-accent-soft to-paper">
                <div className="grid h-full place-items-center">
                  <div
                    className="h-10 w-10 rounded-lg"
                    style={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg,#B4F300 0%,#7FB300 100%)"
                          : "linear-gradient(135deg,#7C5CFF 0%,#4f3ec7 100%)",
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="truncate text-[11px] font-semibold text-ink">{p.title}</p>
                <p className="ml-2 text-[11px] font-bold text-lime">{p.price}</p>
              </div>
              {p.tag && (
                <span className="absolute right-2 top-2 rounded-full bg-paper/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lime">
                  {p.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseView() {
  return (
    <div className="grid h-full grid-cols-[1fr_240px] bg-paper">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/20 via-paper to-paper-muted" />
        <div className="relative flex h-full flex-col justify-end p-6">
          <div className="grid h-full place-items-center">
            <button className="grid h-16 w-16 place-items-center rounded-full bg-paper-soft/80 shadow-float backdrop-blur-xl ring-1 ring-line transition hover:scale-110">
              <Play className="h-6 w-6 fill-ink text-ink" />
            </button>
          </div>
          <div className="mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
              Module 03 · Lesson 04
            </p>
            <h3 className="mt-1 text-[18px] font-bold leading-tight text-ink md:text-[20px]">
              Designing checkout flows that convert
            </h3>
            <div className="mt-3 flex items-center gap-3 text-[10.5px] text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> 24 min
              </span>
              <span>·</span>
              <span>1,240 students enrolled</span>
            </div>

            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full w-[42%] rounded-full bg-lime shadow-[0_0_12px_rgba(180,243,0,0.6)]" />
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden flex-col border-l border-line bg-paper-soft/70 p-4 md:flex">
        <p className="text-eyebrow uppercase text-ink-subtle">Curriculum</p>
        <div className="mt-3 space-y-1.5">
          {[
            { t: "Foundations", done: true },
            { t: "Designing the offer", done: true },
            { t: "Checkout that converts", done: false, active: true },
            { t: "Email sequences", done: false },
            { t: "Launch playbook", done: false },
          ].map((l) => (
            <div
              key={l.t}
              className={[
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium",
                l.active
                  ? "bg-lime/10 text-lime"
                  : l.done
                    ? "text-ink-muted"
                    : "text-ink-subtle",
              ].join(" ")}
            >
              {l.done ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              ) : (
                <span className="h-3 w-3 rounded-full border border-current opacity-50" />
              )}
              {l.t}
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-xl border border-line bg-paper p-3 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">Cohort live in</p>
          <p className="mt-1 font-mono text-[16px] font-bold text-ink">02d 14h 22m</p>
        </div>
      </aside>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="h-full overflow-hidden bg-paper p-5 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">Revenue · 30d</p>
          <p className="mt-1 text-[28px] font-black tracking-[-0.03em] text-ink md:text-[34px]">
            $128,775
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +24.5%
            </span>
            <span className="text-ink-muted">vs prev period</span>
          </div>
        </div>

        <div className="hidden gap-1 md:flex">
          {["7d", "30d", "90d", "All"].map((t, i) => (
            <button
              key={t}
              className={[
                "rounded-md border px-2.5 py-1 text-[10.5px] font-semibold",
                i === 1
                  ? "border-lime/40 bg-lime/10 text-lime"
                  : "border-line bg-paper-soft text-ink-muted",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5 h-[44%] w-full">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#B4F300" stopOpacity="0.45" />
              <stop offset="1" stopColor="#B4F300" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rev2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#7C5CFF" stopOpacity="0.3" />
              <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 150 L40 140 L80 145 L120 120 L160 130 L200 100 L240 110 L280 80 L320 95 L360 70 L400 85 L440 60 L480 75 L520 50 L560 65 L600 40 L640 55 L680 30 L720 45 L760 25 L800 35 L800 200 L0 200 Z"
            fill="url(#rev)"
          />
          <path
            d="M0 150 L40 140 L80 145 L120 120 L160 130 L200 100 L240 110 L280 80 L320 95 L360 70 L400 85 L440 60 L480 75 L520 50 L560 65 L600 40 L640 55 L680 30 L720 45 L760 25 L800 35"
            fill="none"
            stroke="#B4F300"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 175 L40 170 L80 168 L120 160 L160 165 L200 145 L240 150 L280 130 L320 140 L360 120 L400 130 L440 110 L480 120 L520 105 L560 115 L600 95 L640 105 L680 85 L720 95 L760 75 L800 85"
            fill="none"
            stroke="#7C5CFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 4"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Active subs", value: "1,429", delta: "+128" },
          { label: "Avg order", value: "$87", delta: "+$6" },
          { label: "Conversion", value: "4.8%", delta: "+0.6%" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-paper-soft p-3 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">{s.label}</p>
            <p className="mt-1 text-[18px] font-black tracking-tight text-ink">{s.value}</p>
            <p className="mt-0.5 text-[10.5px] font-semibold text-emerald-400">{s.delta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutView() {
  return (
    <div className="grid h-full grid-cols-[1fr_280px] bg-paper">
      <div className="overflow-hidden p-5 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">Secure checkout</p>
        <h3 className="mt-1 text-[18px] font-bold leading-tight text-ink">
          Complete your order
        </h3>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-[10.5px] font-semibold text-ink-muted">Email</label>
            <div className="mt-1 rounded-lg border border-line bg-paper-soft px-3 py-2 text-[12px] text-ink">
              maya@studio.com
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-semibold text-ink-muted">Card details</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-lime/40 bg-accent-soft px-3 py-2 ring-1 ring-lime/20">
              <CreditCard className="h-3.5 w-3.5 text-lime" />
              <span className="font-mono text-[12px] text-ink">4242 4242 4242 4242</span>
              <span className="ml-auto font-mono text-[11px] text-ink-muted">12/29</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-line bg-paper-soft px-3 py-2 text-[11px] text-ink-muted">Country</div>
            <div className="rounded-lg border border-line bg-paper-soft px-3 py-2 text-[11px] text-ink-muted">ZIP</div>
          </div>

          <button className="mt-2 w-full rounded-xl bg-lime py-2.5 text-[12.5px] font-bold text-night lime-shadow">
            Pay $129.00
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-subtle">
            <Lock className="h-2.5 w-2.5" /> Encrypted · Powered by TESKEL
          </div>
        </div>
      </div>

      <aside className="hidden flex-col border-l border-line bg-paper-soft/70 p-5 md:flex">
        <p className="text-eyebrow uppercase text-ink-subtle">Order</p>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-paper p-3 shadow-soft">
          <div
            className="h-10 w-10 flex-shrink-0 rounded-lg"
            style={{ background: "linear-gradient(135deg,#B4F300 0%,#7FB300 100%)" }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-ink">SaaS Starter Kit</p>
            <p className="text-[10.5px] text-ink-muted">Lifetime · Pro tier</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-[11.5px]">
          <div className="flex justify-between text-ink-muted">
            <span>Subtotal</span>
            <span className="text-ink">$129.00</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>VAT</span>
            <span className="text-ink">$0.00</span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span>WELCOME10</span>
            <span>−$12.90</span>
          </div>
          <div className="border-t border-line pt-2 flex justify-between font-bold text-ink">
            <span>Total</span>
            <span>$116.10</span>
          </div>
        </div>

        <div className="mt-auto rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
            <Sparkles className="h-3 w-3" /> 12,400 happy buyers
          </div>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-muted">
            14-day money-back guarantee · No questions asked
          </p>
        </div>
      </aside>
    </div>
  );
}

/* unused-friendly exports to avoid TS warnings */
export const _icons = { Users, ArrowUpRight, ShoppingBag };
