"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CourseInsight } from "@/lib/queries/courses";

const TONE_STYLES: Record<CourseInsight["tone"], { dot: string; chip: string }> = {
  neutral: {
    dot: "bg-ink",
    chip: "bg-paper-muted text-ink-muted border-line",
  },
  warning: {
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-100",
  },
  positive: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
};

export function CourseInsightBanner({ insights }: { insights: CourseInsight[] }) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = insights.filter((i) => !dismissed.has(i.id));
  if (visible.length === 0) return null;

  const current = visible[index % visible.length];
  const tone = TONE_STYLES[current.tone];

  const next = () => setIndex((i) => (i + 1) % visible.length);
  const prev = () => setIndex((i) => (i - 1 + visible.length) % visible.length);

  return (
    <div className="p-1 rounded-[20px] bg-gradient-to-r from-ink/5 via-paper-muted to-ink/5 border border-line">
      <div className="bg-paper rounded-[16px] px-5 py-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-ink text-paper flex items-center justify-center shrink-0">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
            <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
              TESKEL AI · Suggestion
            </p>
            <span className="text-[10.5px] text-ink-subtle">
              {index + 1} / {visible.length}
            </span>
          </div>
          <p className="text-[13.5px] font-bold text-ink leading-snug truncate">
            {current.title}
          </p>
          <p className="text-[12px] text-ink-muted leading-relaxed mt-0.5 line-clamp-2">
            {current.body}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {visible.length > 1 && (
            <>
              <button
                onClick={prev}
                className="h-8 w-8 rounded-lg border border-line bg-paper hover:bg-paper-soft text-ink-muted hover:text-ink transition-colors flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={next}
                className="h-8 w-8 rounded-lg border border-line bg-paper hover:bg-paper-soft text-ink-muted hover:text-ink transition-colors flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <Button asChild size="sm" className="h-8 rounded-lg px-3 text-[12px] font-bold">
            <Link href={current.actionHref}>
              {current.actionLabel}
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Link>
          </Button>
          <button
            onClick={() => {
              setDismissed((prev) => new Set([...prev, current.id]));
              setIndex(0);
            }}
            className="h-8 w-8 rounded-lg text-ink-subtle hover:text-ink hover:bg-paper-soft transition-colors flex items-center justify-center"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
