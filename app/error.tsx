"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="flex flex-1 items-center justify-center py-24">
        <Container size="wide">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <AlertTriangle className="h-3.5 w-3.5" />
              Something went wrong
            </span>
            <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[52px]">
              We hit an unexpected snag
            </h1>
            <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-ink-muted">
              The page failed to load. Try again — if the problem keeps
              happening, please contact support.
            </p>
            {error.digest && (
              <p className="mt-3 font-mono text-[11px] text-ink-subtle">
                Reference: {error.digest}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={reset}>
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
