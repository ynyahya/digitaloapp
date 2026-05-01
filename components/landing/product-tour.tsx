"use client";

import * as React from "react";
import {
  ShoppingBag,
  GraduationCap,
  BarChart3,
  Users,
  ArrowRight,
} from "lucide-react";
import { SellPanel } from "@/components/landing/product-tour-panels/sell-panel";
import { TeachPanel } from "@/components/landing/product-tour-panels/teach-panel";
import { ScalePanel } from "@/components/landing/product-tour-panels/scale-panel";
import { OwnPanel } from "@/components/landing/product-tour-panels/own-panel";

type TabId = "sell" | "teach" | "scale" | "own";

const TABS: {
  id: TabId;
  label: string;
  Icon: typeof ShoppingBag;
  title: string;
  desc: string;
  bullets: string[];
}[] = [
  {
    id: "sell",
    label: "Sell",
    Icon: ShoppingBag,
    title: "A storefront that sells while you sleep.",
    desc: "Drag-drop pages, license keys, bundles, upsells — everything you need to monetize digital products on day one.",
    bullets: [
      "Custom domain & branded checkout",
      "License keys, downloads, bundles",
      "Order bumps & post-purchase upsells",
    ],
  },
  {
    id: "teach",
    label: "Teach",
    Icon: GraduationCap,
    title: "Run cohorts the world signs up for.",
    desc: "Drip lessons, live cohorts, certificates, quizzes — a full LMS without leaving your stack.",
    bullets: [
      "Drip content & cohort schedules",
      "Auto-issued completion certificates",
      "Built-in video player & captions",
    ],
  },
  {
    id: "scale",
    label: "Scale",
    Icon: BarChart3,
    title: "Analytics & automations that compound.",
    desc: "Real-time funnels, affiliate program, email automations, and 40+ integrations to plug into the rest of your stack.",
    bullets: [
      "Funnel & cohort analytics",
      "Affiliates with auto payouts",
      "Stripe, Resend, Notion, Zapier",
    ],
  },
  {
    id: "own",
    label: "Own",
    Icon: Users,
    title: "Your audience. Your data. Your brand.",
    desc: "Export anytime, full CRM, member-only spaces. Never rent your audience from a marketplace algorithm again.",
    bullets: [
      "Member CRM with tags & segments",
      "Private spaces & community",
      "Full data export, no lock-in",
    ],
  },
];

export function ProductTour() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0); // 0..1 across whole section
  const sectionRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mql.matches || reduced) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Section has extra height; sticky pin lasts (total - vh).
        // Progress = how far past top of section the viewport top has scrolled,
        // normalized by (total - vh).
        const total = el.offsetHeight;
        const pinLen = total - vh;
        const scrolled = Math.min(Math.max(-rect.top, 0), pinLen);
        const p = pinLen > 0 ? scrolled / pinLen : 0;
        setProgress(p);
        // map progress → tab index (4 tabs)
        const idx = Math.min(
          TABS.length - 1,
          Math.max(0, Math.floor(p * TABS.length - 0.0001)),
        );
        setActiveIdx((prev) => (prev === idx ? prev : idx));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const setActiveFromClick = (idx: number) => {
    const el = sectionRef.current;
    if (!el) {
      setActiveIdx(idx);
      return;
    }
    const mql = window.matchMedia("(min-width: 1024px)");
    if (!mql.matches) {
      setActiveIdx(idx);
      return;
    }
    const total = el.offsetHeight;
    const pinLen = total - window.innerHeight;
    const target =
      el.offsetTop +
      (idx / TABS.length) * pinLen +
      pinLen / (TABS.length * 2);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const current = TABS[activeIdx];

  return (
    <section
      id="tour"
      ref={sectionRef}
      className="relative lg:h-[360vh]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto w-full max-w-[1360px] px-5 py-24 md:px-8 md:py-28 lg:px-10 lg:py-0">
          {/* eyebrow + headline */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime">
              <span className="h-1 w-1 rounded-full bg-lime" />
              Product tour
            </span>
            <h2 className="mt-5 text-balance text-[32px] font-black leading-[1.05] tracking-[-0.035em] text-chalk md:text-[48px] lg:text-[52px]">
              Four products. One platform.{" "}
              <span className="text-chalk-muted">Zero duct tape.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-chalk-muted md:text-[15.5px]">
              Scroll to tour — or click a tab to jump.
            </p>
          </div>

          {/* scroll progress (desktop only) */}
          <div className="mx-auto mt-6 hidden h-[2px] w-56 overflow-hidden rounded-full bg-white/[0.06] lg:block">
            <div
              className="h-full rounded-full bg-lime shadow-[0_0_12px_rgba(180,243,0,0.7)] transition-[width] duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          {/* tabs + panel */}
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[360px_1fr] lg:gap-10">
            {/* tab list */}
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible scrollbar-none">
              {TABS.map((t, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveFromClick(i)}
                    className={[
                      "group relative flex-shrink-0 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all lg:px-5 lg:py-4",
                      isActive
                        ? "border-lime/30 bg-white/[0.03]"
                        : "border-white/[0.06] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.025]",
                    ].join(" ")}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-lime shadow-[0_0_12px_rgba(180,243,0,0.7)]" />
                    )}
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border transition",
                          isActive
                            ? "border-lime/30 bg-lime/10 text-lime"
                            : "border-white/[0.06] bg-white/[0.02] text-chalk-muted",
                        ].join(" ")}
                      >
                        <t.Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-chalk">
                          {t.label}
                        </p>
                        <p className="truncate text-[11.5px] text-chalk-muted lg:hidden">
                          {t.title.split(".")[0]}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 hidden text-[12.5px] leading-relaxed text-chalk-muted lg:block">
                      {t.title}
                    </p>
                  </button>
                );
              })}

              <div className="mt-2 hidden lg:block">
                <a
                  href="/products"
                  className="group inline-flex items-center gap-1.5 px-2 py-1 text-[12.5px] font-semibold text-lime"
                >
                  Explore the platform
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* panel */}
            <div className="surface-night relative overflow-hidden rounded-[24px]">
              <div className="grid h-full gap-0 md:grid-cols-[1fr_1.4fr]">
                {/* copy */}
                <div className="border-b border-white/[0.06] p-6 md:border-b-0 md:border-r md:p-7">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/20 bg-lime/[0.06] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime">
                    <current.Icon className="h-3 w-3" /> {current.label}
                  </span>
                  <h3
                    key={current.id + "-title"}
                    className="mt-4 text-[22px] font-black leading-tight tracking-[-0.025em] text-chalk md:text-[26px] animate-fade-blur-up"
                  >
                    {current.title}
                  </h3>
                  <p
                    key={current.id + "-desc"}
                    className="mt-3 text-[13px] leading-relaxed text-chalk-muted md:text-[14px] animate-fade-blur-up [animation-delay:80ms]"
                  >
                    {current.desc}
                  </p>
                  <ul
                    key={current.id + "-bullets"}
                    className="mt-4 space-y-2 animate-fade-blur-up [animation-delay:160ms]"
                  >
                    {current.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-[13px] text-chalk"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.7)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* visual */}
                <div className="relative min-h-[320px] bg-night-well lg:min-h-[420px]">
                  {TABS.map((t, i) => (
                    <div
                      key={t.id}
                      className={[
                        "absolute inset-0 transition-all duration-700",
                        i === activeIdx
                          ? "opacity-100 translate-y-0"
                          : "pointer-events-none opacity-0 translate-y-4",
                      ].join(" ")}
                    >
                      {t.id === "sell" && <SellPanel />}
                      {t.id === "teach" && <TeachPanel />}
                      {t.id === "scale" && <ScalePanel />}
                      {t.id === "own" && <OwnPanel />}
                    </div>
                  ))}
                </div>
              </div>

              {/* dot indicator */}
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveFromClick(i)}
                    aria-label={t.label}
                    className={[
                      "h-1 rounded-full transition-all",
                      i === activeIdx
                        ? "w-8 bg-lime"
                        : "w-3 bg-white/15 hover:bg-white/30",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
