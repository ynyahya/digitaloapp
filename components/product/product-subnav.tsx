"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";

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
    const onScroll = () => setShow(window.scrollY > 520);
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
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.1, 0.3, 0.6] },
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
        "sticky top-16 z-40 border-b border-line bg-paper/90 backdrop-blur-xl transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <p className="hidden max-w-[220px] truncate text-[13px] font-semibold text-ink md:block">
            {title}
          </p>
          <nav className="flex items-center gap-1 overflow-x-auto">
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
                      ? "bg-ink text-paper"
                      : "text-ink-muted hover:bg-paper-soft hover:text-ink",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-[13px] font-bold tabular-nums text-ink sm:block">
            {priceCents === 0 ? "Free" : formatCurrency(priceCents, currency)}
          </span>
          <Link
            href={checkoutHref}
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[12.5px] font-semibold text-paper hover:bg-ink-soft"
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}
