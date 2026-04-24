import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-paper-muted p-10 md:p-16">
          <div className="absolute inset-0 bg-mono-radial opacity-80" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[44px]">
                Launch your digital store today
              </h2>
              <p className="mt-3 text-[15px] text-ink-muted">
                Join 10k+ creators earning a living online with Digitalo.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Selling Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
