import { Check, Circle, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CourseReadiness } from "@/lib/queries/courses";

type Props = {
  readiness: CourseReadiness;
  variant?: "card" | "inline";
  slug?: string;
};

export function CourseReadinessScore({ readiness, variant = "card", slug }: Props) {
  const { percent, checks } = readiness;
  const tone =
    percent >= 80 ? "emerald" : percent >= 40 ? "ink" : "amber";
  const ringColor =
    tone === "emerald"
      ? "stroke-emerald-500"
      : tone === "amber"
      ? "stroke-amber-500"
      : "stroke-ink";

  const r = 38;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 shrink-0">
          <svg viewBox="0 0 100 100" className="h-9 w-9 -rotate-90">
            <circle cx="50" cy="50" r={r} className="stroke-paper-muted" strokeWidth="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              r={r}
              className={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[9.5px] font-bold text-ink">
            {percent}%
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
            Readiness
          </p>
          <p className="text-[12.5px] font-medium text-ink truncate">
            {checks.filter((c) => c.done).length} of {checks.length} ready
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-paper shadow-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-ink-muted" />
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
          Launch readiness
        </p>
        <span className="ml-auto text-[10.5px] font-bold text-ink">
          {checks.filter((x) => x.done).length} / {checks.length}
        </span>
      </div>

      <div className="px-5 py-5 flex items-center gap-5 border-b border-line">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r={r} className="stroke-paper-muted" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r={r}
              className={cn(ringColor, "transition-all duration-700")}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[26px] font-bold tracking-tight text-ink leading-none">
              {percent}
              <span className="text-[14px] text-ink-muted font-medium">%</span>
            </p>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle mt-0.5">
              ready
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-ink leading-snug">
            {percent === 100
              ? "Course is launch-ready"
              : percent >= 80
              ? "Almost there — finish the last details"
              : percent >= 40
              ? "Solid progress — keep building"
              : "Let's get the basics in place"}
          </p>
          <p className="text-[12px] text-ink-muted mt-1 leading-relaxed">
            {percent === 100
              ? "All foundational checks passed. Hit publish whenever you're ready."
              : "Complete the checklist below to unlock the highest conversion rates on the marketplace."}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-line">
        {checks.map((check) => {
          const inner = (
            <div
              className={cn(
                "px-5 py-2.5 flex items-center gap-3 transition-colors",
                check.done
                  ? "text-ink"
                  : "text-ink-muted hover:bg-paper-soft cursor-pointer",
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border flex items-center justify-center shrink-0",
                  check.done
                    ? "bg-emerald-500 border-emerald-500 text-paper"
                    : "border-line bg-paper",
                )}
              >
                {check.done ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <Circle className="h-2 w-2 fill-current" />
                )}
              </div>
              <span
                className={cn(
                  "text-[12.5px] font-medium",
                  check.done && "line-through opacity-70",
                )}
              >
                {check.label}
              </span>
            </div>
          );
          if (!check.done && slug) {
            const href = check.href ?? `/dashboard/courses/${slug}`;
            return (
              <li key={check.id}>
                <Link href={href}>{inner}</Link>
              </li>
            );
          }
          return <li key={check.id}>{inner}</li>;
        })}
      </ul>
    </section>
  );
}
