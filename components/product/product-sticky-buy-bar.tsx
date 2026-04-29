"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";

interface ProductStickyBuyBarProps {
  title: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  checkoutHref: string;
}

export function ProductStickyBuyBar({
  title,
  priceCents,
  compareAtCents,
  currency,
  checkoutHref,
}: ProductStickyBuyBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-ink-muted">
            {title}
          </p>
          <p className="flex items-baseline gap-2">
            <span className="text-[17px] font-bold tabular-nums text-ink">
              {formatCurrency(priceCents, currency)}
            </span>
            {compareAtCents && compareAtCents > priceCents && (
              <span className="text-[12px] text-ink-subtle line-through tabular-nums">
                {formatCurrency(compareAtCents, currency)}
              </span>
            )}
          </p>
        </div>
        <Link
          href={checkoutHref}
          className="inline-flex h-11 shrink-0 items-center rounded-xl bg-ink px-5 text-[13px] font-semibold text-paper"
        >
          Buy now
        </Link>
      </div>
    </div>
  );
}
