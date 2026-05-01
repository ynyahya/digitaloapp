"use client";

import { useEffect, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/lib/actions/commerce";
import { trackEvent } from "@/lib/analytics/track";

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
      setShow(window.scrollY > 260);
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
    trackEvent("section_nav_click", {
      surface: "course_subnav",
      section: id,
    });
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "sticky top-[71px] z-40 border-b border-white/[0.08] bg-night/92 backdrop-blur-xl transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        {/* Title on the far left when visible */}
        <div className="flex min-w-0 items-center gap-6">
          <p className="hidden truncate text-[13px] font-semibold text-chalk md:block max-w-[240px]">
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
                    "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
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

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="hidden text-[12.5px] font-bold text-chalk sm:block">
            {priceCents === 0 ? "Free" : formatCurrency(priceCents, currency)}
          </span>
          <form
            action={enrollInCourse.bind(null, courseId)}
            onSubmit={() =>
              trackEvent("cta_click", {
                surface: "course_subnav",
                label: "Enroll now",
              })
            }
          >
            <Button
              type="submit"
              className="h-9 rounded-full bg-lime px-4 text-[12.5px] font-semibold text-night hover:bg-lime/90 md:px-5"
            >
              Enroll now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
