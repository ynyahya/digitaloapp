"use client";

import { useEffect, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/lib/actions/commerce";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "instructor", label: "Instructor" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

interface CourseSubnavProps {
  courseId: string;
  title: string;
  priceCents: number;
  currency: string;
  availableSectionIds: string[];
}

export function CourseSubnav({
  courseId,
  title,
  priceCents,
  currency,
  availableSectionIds,
}: CourseSubnavProps) {
  const [activeId, setActiveId] = useState<string>(availableSectionIds[0] ?? "overview");
  const [show, setShow] = useState(false);

  const sections = SECTIONS.filter((s) => availableSectionIds.includes(s.id));

  useEffect(() => {
    // Show sub-nav only after scrolling past the hero
    const onScroll = () => {
      setShow(window.scrollY > 480);
    };
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
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio));
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
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
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "sticky top-16 z-40 border-b border-line bg-paper/90 backdrop-blur-xl transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-6 px-6">
        {/* Title on the far left when visible */}
        <div className="flex min-w-0 items-center gap-6">
          <p className="hidden truncate text-[13px] font-semibold text-ink md:block max-w-[240px]">
            {title}
          </p>
          <nav className="flex items-center gap-1">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
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
          <span className="hidden text-[13px] font-bold text-ink sm:block">
            {priceCents === 0 ? "Free" : formatCurrency(priceCents, currency)}
          </span>
          <form action={enrollInCourse.bind(null, courseId)}>
            <Button
              type="submit"
              className="h-9 rounded-full bg-ink px-5 text-[12.5px] font-semibold text-paper hover:bg-ink-soft"
            >
              Enroll now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
