import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="flex flex-1 items-center justify-center py-24">
        <Container size="wide">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <Compass className="h-3.5 w-3.5" />
              Error 404
            </span>
            <h1 className="mt-6 text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
              We couldn&apos;t find that page
            </h1>
            <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-ink-muted">
              The link may be broken, the page may have been moved, or it never
              existed. Try heading back home or exploring the marketplace.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">Browse marketplace</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
