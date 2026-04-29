import Link from "next/link";
import { Sparkles, LayoutTemplate, FilePlus, ArrowRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const PATHS = [
  {
    id: "ai",
    icon: Sparkles,
    title: "AI Quickstart",
    blurb: "Describe your course in one line — TESKEL drafts a 5-chapter outline you can edit.",
    cta: "Start with AI",
    href: "/dashboard/courses/new?mode=ai",
    accent: "bg-ink text-paper border-ink",
    chip: "Recommended · 60 sec",
  },
  {
    id: "template",
    icon: LayoutTemplate,
    title: "Start from a template",
    blurb: "Pick from 12 curated curriculums — Notion Mastery, Web3 101, Photo Bootcamp & more.",
    cta: "Browse templates",
    href: "/dashboard/courses/new?mode=template",
    accent: "bg-paper text-ink border-line",
    chip: "12 templates",
  },
  {
    id: "blank",
    icon: FilePlus,
    title: "Blank canvas",
    blurb: "Build from scratch with the full curriculum editor — chapters, lessons, quizzes, drips.",
    cta: "Create blank",
    href: "/dashboard/courses/new?mode=blank",
    accent: "bg-paper text-ink border-line",
    chip: "Full control",
  },
];

const STEPS = [
  { n: "01", title: "Draft outline", body: "Plan chapters, lessons, drip schedule." },
  { n: "02", title: "Compose content", body: "Notion-style blocks, video, quizzes, code labs." },
  { n: "03", title: "Launch & sell", body: "Publish, set pricing, share with students." },
];

export function CourseEmptyState() {
  return (
    <section className="rounded-3xl border border-line bg-paper shadow-soft overflow-hidden">
      <div className="px-8 pt-12 pb-10 max-w-3xl mx-auto text-center space-y-5">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-ink text-paper items-center justify-center mx-auto">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink-subtle">
            Course Operating System
          </p>
          <h2 className="text-[34px] font-bold tracking-tight text-ink leading-tight">
            Ship a world-class course
            <br />
            <span className="text-ink-muted font-medium">without juggling 7 tools.</span>
          </h2>
          <p className="text-[13.5px] text-ink-muted max-w-xl mx-auto leading-relaxed">
            From idea to live curriculum in hours, not weeks. Outline with AI, record once, sell forever — all under your TESKEL storefront.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 px-8 pb-10">
        {PATHS.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            className={cn(
              "group flex flex-col rounded-2xl border p-6 transition-all duration-300",
              p.accent,
              p.id === "ai"
                ? "hover:shadow-float hover:-translate-y-1"
                : "hover:border-ink/40 hover:shadow-soft",
            )}
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  p.id === "ai" ? "bg-paper/10" : "bg-paper-muted",
                )}
              >
                <p.icon
                  className={cn(
                    "h-5 w-5",
                    p.id === "ai" ? "text-paper" : "text-ink",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full",
                  p.id === "ai" ? "bg-paper/10 text-paper" : "bg-paper-muted text-ink-muted",
                )}
              >
                {p.chip}
              </span>
            </div>
            <h3
              className={cn(
                "mt-5 text-[18px] font-bold tracking-tight",
                p.id === "ai" ? "text-paper" : "text-ink",
              )}
            >
              {p.title}
            </h3>
            <p
              className={cn(
                "mt-1.5 text-[12.5px] leading-relaxed flex-1",
                p.id === "ai" ? "text-paper/70" : "text-ink-muted",
              )}
            >
              {p.blurb}
            </p>
            <div
              className={cn(
                "mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold",
                p.id === "ai" ? "text-paper" : "text-ink",
              )}
            >
              {p.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="border-t border-line bg-paper-soft px-8 py-8">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink-subtle text-center">
          How TESKEL Courses works
        </p>
        <div className="mt-5 grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="text-[18px] font-bold tracking-tight text-ink-subtle">
                {s.n}
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{s.title}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted leading-relaxed">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
