import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto w-full max-w-[1360px] px-5 pb-12 pt-7 md:px-8 md:pb-16 lg:px-10">
        <div className="relative isolate min-h-[490px] overflow-hidden rounded-[24px] border border-line bg-night-raised px-7 py-16 shadow-2xl shadow-black/10 dark:shadow-black/40 grain-overlay md:px-20 md:py-24 lg:px-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-28 -top-28 h-[380px] w-[380px] rounded-full bg-violet/45 blur-3xl" />
            <div className="absolute -bottom-36 -right-16 h-[520px] w-[520px] rounded-full bg-lime/35 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_72%,rgba(180,243,0,0.18),transparent_34%),linear-gradient(90deg,rgba(124,92,255,0.18),transparent_34%)]" />
            <div className="absolute inset-0 grid-dark-fine opacity-30" />
          </div>

          <div className="relative max-w-[560px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-lime backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              Ready when you are
            </span>

            <h2 className="mt-6 text-balance text-[64px] font-black leading-[0.94] tracking-[-0.055em] text-chalk md:text-[86px] lg:text-[88px]">
              Ready to <span className="gradient-text-lime">ship?</span>
            </h2>

            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-chalk-muted">
              Join 47,000+ creators running their digital business on TESKEL.
              Free forever for starters. No credit card.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register?ref=final_cta"
                className="group inline-flex h-11 items-center gap-2 rounded-2xl bg-lime px-6 text-[13px] font-bold text-night lime-shadow transition hover:bg-lime-bright"
              >
                Start free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact?ref=final_cta"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-line bg-paper-soft/80 px-5 text-[13px] font-semibold text-chalk shadow-soft backdrop-blur-xl transition hover:border-line-strong hover:bg-paper-soft dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/30 dark:hover:bg-white/[0.08]"
              >
                Talk to sales
              </Link>
            </div>

            <p className="mt-6 text-[11px] text-chalk-dim">
              ✓ Setup in 5 minutes &nbsp;·&nbsp; ✓ Keep 95%+ of revenue
              &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
