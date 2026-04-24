import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink p-10 text-paper md:p-16">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-3 py-1.5 text-[12px] font-medium text-paper/80">
                <Zap className="h-3.5 w-3.5" />
                Free to start. Upgrade anytime.
              </span>
              <h2 className="mt-5 text-balance text-[32px] font-semibold leading-[1.05] tracking-tight md:text-[48px]">
                Launch your digital store today.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] text-paper/70 md:text-[16px]">
                Join thousands of creators selling premium digital products on
                Digitalo. No credit card required.
              </p>

              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-paper/70">
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

            <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
              <Button
                size="lg"
                asChild
                className="rounded-full bg-paper text-ink hover:bg-paper/90"
              >
                <Link href="/register">
                  Start Selling
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full border-paper/25 bg-transparent text-paper hover:border-paper/50 hover:bg-paper/5"
              >
                <Link href="/products">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
