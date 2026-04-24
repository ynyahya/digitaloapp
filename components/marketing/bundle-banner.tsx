import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function BundleBanner() {
  return (
    <section className="py-10 md:py-14">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-paper-muted p-6 md:p-10">
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
                Bundle Deals
              </p>
              <h3 className="mt-2 text-balance text-[26px] font-semibold leading-tight tracking-tight md:text-[32px]">
                More value, more savings.
              </h3>
              <p className="mt-2 max-w-md text-[14px] text-ink-muted">
                Save up to 60% on premium bundles from top creators.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/bundles">
                  Explore Bundles <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative h-44 w-full max-w-sm">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-y-0 rounded-2xl border border-line bg-paper shadow-card"
                    style={{
                      left: `${i * 18}%`,
                      right: `${(2 - i) * 6}%`,
                      transform: `rotate(${(i - 1) * 4}deg)`,
                      zIndex: 3 - i,
                    }}
                  >
                    <div className="flex h-full flex-col justify-between p-3">
                      <div className="h-16 rounded-lg bg-gradient-to-br from-ink to-ink-soft" />
                      <div>
                        <div className="h-2 w-24 rounded-full bg-line" />
                        <div className="mt-2 h-2 w-16 rounded-full bg-line" />
                      </div>
                    </div>
                  </div>
                ))}
                <span className="absolute right-0 top-1/2 z-10 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper shadow-float">
                  SAVE
                  <br />
                  60%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
