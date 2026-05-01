import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { HeroWindow } from "@/components/landing/hero-window";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-night" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px] grid-dark mask-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1200px] bg-lime-glow" />
      {/* drifting orbs */}
      <div className="pointer-events-none absolute -left-32 top-40 -z-10 h-[460px] w-[460px] rounded-full bg-lime/[0.08] blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-32 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-violet/[0.18] blur-3xl animate-drift [animation-delay:-2s]" />

      <div className="mx-auto w-full max-w-[1360px] px-5 pb-24 pt-16 md:px-8 md:pt-24 md:pb-32 lg:px-10">
        {/* announcement pill */}
        <div className="flex justify-center animate-fade-blur-up">
          <Link
            href="/changelog"
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 text-[12px] text-chalk-muted backdrop-blur-xl transition hover:border-white/[0.15] hover:text-chalk"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              New
            </span>
            <span className="font-medium">v2.0 · Cohorts, certificates &amp; affiliates</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-chalk-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* heading */}
        <h1
          className="mx-auto mt-8 max-w-[1080px] text-center font-sans text-[44px] font-black leading-[1.02] tracking-[-0.045em] text-chalk md:text-[80px] lg:text-[96px] animate-fade-blur-up [animation-delay:80ms]"
        >
          The operating system
          <br className="hidden md:block" />{" "}
          for{" "}
          <span className="relative inline-block">
            <span className="gradient-text-lime lime-text-glow">digital creators.</span>
          </span>
        </h1>

        {/* sub */}
        <p className="mx-auto mt-6 max-w-[640px] text-center text-[16px] leading-relaxed text-chalk-muted md:text-[19px] animate-fade-blur-up [animation-delay:160ms]">
          Sell products, run cohorts, grow your audience — without duct-taping
          ten tools together. One platform, your entire creator business.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-blur-up [animation-delay:240ms]">
          <Link
            href="/register?ref=hero_primary"
            className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-bold text-night lime-shadow transition hover:bg-lime-bright"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#tour"
            className="group inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-5 text-[14px] font-semibold text-chalk backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.05]"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.08]">
              <Play className="h-3 w-3 fill-chalk text-chalk" />
            </span>
            Watch 2-min demo
          </Link>
        </div>

        {/* trust line */}
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-chalk-muted animate-fade-blur-up [animation-delay:300ms]">
          {[
            "No credit card",
            "Launch in 5 minutes",
            "Keep 95% of revenue",
          ].map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)]" />
              {item}
            </li>
          ))}
        </ul>

        {/* hero window */}
        <div className="relative mx-auto mt-20 w-full max-w-[1180px] animate-fade-blur-up [animation-delay:380ms] md:mt-24">
          {/* under-glow */}
          <div className="pointer-events-none absolute -inset-x-20 -bottom-20 -top-20 -z-10 bg-lime-glow blur-2xl" />
          <HeroWindow />
        </div>
      </div>
    </section>
  );
}
