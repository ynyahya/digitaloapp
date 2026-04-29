import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

import { LogoCloud } from "@/components/marketing/logo-cloud";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pt-16 pb-24 md:pt-28 md:pb-32">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[800px] bg-mono-radial opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[800px] glow-mesh opacity-10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[800px] grid-lines opacity-[0.4] [mask-image:radial-gradient(50%_50%_at_50%_50%,#000,transparent_90%)]" />

      <Container size="wide" className="relative flex flex-col items-center text-center">
        {/* Badge */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000 fill-mode-both">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-3 py-1.5 text-[12px] font-bold text-ink-muted shadow-soft backdrop-blur transition-all hover:border-ink/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            The engine for digital product
            <span className="ml-1 inline-flex h-4 items-center gap-1 rounded-full bg-ink px-1.5 text-[9px] font-black tracking-widest text-paper">
              V2.0
            </span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-8 max-w-[1000px] animate-in fade-in slide-in-from-top-6 text-balance text-[56px] font-black leading-[0.9] tracking-[-0.05em] text-ink duration-1000 fill-mode-both md:text-[108px]">
          The operating system
          <br />
          <span className="relative inline-block text-ink-soft">
            for creators.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-10 max-w-[680px] animate-in fade-in slide-in-from-top-8 text-pretty text-[18px] leading-relaxed text-ink-muted duration-1000 fill-mode-both md:text-[22px]">
          Everything you need to ship, sell, and scale your digital products in a single, 
          beautifully crafted platform. No setup fees, just pure growth.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex animate-in fade-in slide-in-from-top-10 flex-wrap items-center justify-center gap-4 duration-1000 fill-mode-both">
          <Button size="lg" asChild className="group h-13 rounded-2xl px-8 text-[15px] font-bold shadow-float transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/register">
              Start selling free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="h-13 rounded-2xl border-line bg-paper/50 px-8 text-[15px] font-bold backdrop-blur-sm transition-all hover:bg-paper-muted hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/products" className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
              Start with AI
            </Link>
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex animate-in fade-in duration-1000 fill-mode-both flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 w-9 rounded-full border-4 border-paper bg-ink-muted ring-1 ring-line shadow-sm"
              />
            ))}
          </div>
          <div className="flex items-center gap-3 text-[14px] font-medium text-ink-muted">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-amber-400">★</span>
              ))}
            </div>
            <span className="text-ink">4.9/5</span> from 10k+ creators
          </div>
        </div>

        {/* Visual Mockup Container */}
        <div className="perspective-2000 mt-20 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
          <div className="relative mx-auto max-w-[1000px] overflow-visible transition-transform duration-700 [transform:rotateX(15deg)_translateZ(0)] hover:[transform:rotateX(5deg)_translateZ(50px)]">
            <HeroMockup />
            
            {/* Ambient glow behind mockup */}
            <div className="pointer-events-none absolute -inset-20 -z-10 rounded-[4rem] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.08),transparent_70%)] blur-3xl" />
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-24 w-full md:mt-32">
          <LogoCloud />
        </div>
      </Container>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full rounded-[24px] border border-line bg-paper/80 shadow-2xl backdrop-blur-md">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-line bg-paper-soft/50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/20 border border-red-400/40" />
          <span className="h-3 w-3 rounded-full bg-amber-400/20 border border-amber-400/40" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/20 border border-emerald-400/40" />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-paper/50 px-4 py-1 text-[11px] font-bold tracking-tight text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          studio.teskel.app
        </div>
        <div className="w-12" />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px]">
        <div className="p-8">
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-paper shadow-lg">
                <Zap className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[15px] font-bold text-ink">Store Analytics</p>
                <p className="text-[11px] text-ink-muted">Real-time performance</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-paper-soft/40 p-6 shadow-sm">
            <div className="flex items-center justify-between">
               <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-subtle">Gross Revenue</p>
               <span className="inline-flex h-6 items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 text-[11px] font-bold text-emerald-600">
                +24.5%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[40px] font-black tracking-[-0.04em] text-ink">$128,775</span>
            </div>
            <div className="mt-6 h-32 w-full">
              {/* Simplified high-fidelity chart mockup */}
              <svg viewBox="0 0 400 100" className="h-full w-full text-ink">
                <path
                  d="M0 80 Q 50 70 100 40 T 200 60 T 300 20 T 400 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-in fade-in duration-1000"
                />
                <path
                  d="M0 80 Q 50 70 100 40 T 200 60 T 300 20 T 400 40 L 400 100 L 0 100 Z"
                  fill="currentColor"
                  fillOpacity="0.05"
                />
              </svg>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-subtle">Active Subs</p>
              <p className="mt-1 text-[20px] font-black text-ink">1,429</p>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-subtle">Churn Rate</p>
              <p className="mt-1 text-[20px] font-black text-ink">1.2%</p>
            </div>
          </div>
        </div>

        {/* Sidebar activity */}
        <div className="border-l border-line bg-paper-soft/30 p-8 hidden lg:block">
           <h4 className="text-[12px] font-black uppercase tracking-widest text-ink-subtle mb-6">Recent Activity</h4>
           <div className="space-y-6">
              {[
                { user: "MS", action: "Purchased", item: "SaaS Kit", price: "$49" },
                { user: "JD", action: "Unlocked", item: "Design Ops", price: "$120" },
                { user: "AL", action: "Subscribed", item: "Masterclass", price: "$29" },
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-ink text-[10px] font-black text-paper flex items-center justify-center">
                    {act.user}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-ink truncate">{act.action} {act.item}</p>
                    <p className="text-[10px] text-ink-muted">{act.price}</p>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="mt-12 rounded-2xl bg-ink p-5 text-paper">
              <p className="text-[11px] font-bold opacity-60">Ready to launch?</p>
              <p className="mt-1 text-[13px] font-black">Ship your product in minutes.</p>
              <div className="mt-4 h-1 w-full rounded-full bg-paper/20">
                <div className="h-full w-2/3 rounded-full bg-paper" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


