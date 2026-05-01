import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1360px] px-5 py-24 md:px-8 md:py-32 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-white/[0.06] bg-night-raised p-8 md:p-16 lg:p-24 grain-overlay">
          {/* background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -bottom-32 -right-32 h-[520px] w-[520px] rounded-full bg-lime/30 blur-3xl" />
            <div className="absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-violet/35 blur-3xl" />
            <div className="absolute inset-0 grid-dark-fine mask-radial-fade opacity-40" />
          </div>

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-eyebrow uppercase text-lime backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              Ready when you are
            </span>

            <h2 className="mt-6 text-balance text-[44px] font-black leading-[0.98] tracking-[-0.045em] text-chalk md:text-[88px] lg:text-[104px]">
              Ready to <span className="gradient-text-lime">ship?</span>
            </h2>

            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-chalk-muted md:text-[18px]">
              Join 47,000+ creators running their digital business on TESKEL.
              Free forever for starters. No credit card.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register?ref=final_cta"
                className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-bold text-night lime-shadow transition hover:bg-lime-bright"
              >
                Start free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact?ref=final_cta"
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-[14px] font-semibold text-chalk backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.08]"
              >
                Talk to sales
              </Link>
            </div>

            <p className="mt-6 text-[12px] text-chalk-dim">
              ✓ Setup in 5 minutes &nbsp;·&nbsp; ✓ Keep 95%+ of revenue
              &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
