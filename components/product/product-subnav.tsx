"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "inside", label: "What's inside" },
  { id: "tech", label: "Tech" },
  { id: "demo", label: "Demo" },
  { id: "changelog", label: "Changelog" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

interface ProductSubnavProps {
  title: string;
  priceCents: number;
  currency: string;
  checkoutHref: string;
  availableSectionIds: string[];
}

export function ProductSubnav({
  title,
  priceCents,
  currency,
  checkoutHref,
  availableSectionIds,
}: ProductSubnavProps) {
  const sections = useMemo(
    () => SECTIONS.filter((s) => availableSectionIds.includes(s.id)),
    [availableSectionIds],
  );
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "overview");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.15, 0.35, 0.55] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "sticky top-[71px] z-40 border-b border-white/[0.08] bg-night/92 backdrop-blur-xl transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <p className="hidden max-w-[220px] truncate text-[13px] font-semibold text-chalk md:block">
            {title}
          </p>
          <nav className="flex max-w-[65vw] items-center gap-1 overflow-x-auto pr-1 md:max-w-none [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                    isActive
                      ? "bg-lime text-night shadow-soft"
                      : "text-chalk-muted hover:bg-white/[0.035] hover:text-chalk",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-[13px] font-bold tabular-nums text-chalk sm:block">
            {priceCents === 0 ? "Free" : formatCurrency(priceCents, currency)}
          </span>
          <Link
            href={checkoutHref}
            onClick={() =>
              trackEvent("cta_click", {
                surface: "product_subnav",
                label: "Buy now",
                href: checkoutHref,
              })
            }
            className="inline-flex h-9 items-center rounded-full bg-lime px-4 text-[12.5px] font-semibold text-night hover:bg-lime/90"
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}
