import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-ink bg-ink p-10 text-paper md:p-16">
          {/* Ambient lights */}
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-paper/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-paper/[0.04] blur-3xl" />

          {/* Grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(60% 50% at 50% 50%, #000, transparent 75%)",
            }}
          />

          <div className="relative flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-3 py-1.5 text-[12px] font-medium text-paper/85 backdrop-blur">
                <Zap className="h-3.5 w-3.5" />
                Free to start. Upgrade anytime.
              </span>
              <h2 className="mt-5 text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[52px]">
                Ship your first digital product
                <br /> by the end of the day.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] text-paper/70 md:text-[16.5px]">
                Join 10,000+ creators selling premium digital products on TESKEL.
                No credit card required, cancel anytime.
              </p>

              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-paper/75">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-paper" />
                  No credit card required
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-paper" />
                  Cancel anytime
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-paper" />
                  Setup in under 5 minutes
                </li>
              </ul>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:flex-row md:items-center">
              <Button
                size="lg"
                asChild
                className="group rounded-full bg-paper text-ink hover:bg-paper/90"
              >
                <Link href="/register">
                  Start selling free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full border-paper/25 bg-transparent text-paper hover:border-paper/50 hover:bg-paper/5"
              >
                <Link href="/products">Explore the marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
