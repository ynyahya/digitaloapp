import Link from "next/link";
import { Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseCardActions } from "./course-card-actions";
import type { CourseListItem } from "@/lib/queries/courses";

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-paper-muted text-ink-muted",
  SCHEDULED: "bg-amber-50 text-amber-700",
  ARCHIVED: "bg-red-50 text-red-700",
};

export function CourseTable({ courses }: { courses: CourseListItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-soft">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-line bg-paper-muted/30">
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Course</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Status</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Format</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Students</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Rating</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Completion</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Readiness</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Price</th>
            <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {courses.map((c) => (
            <tr key={c.id} className="group hover:bg-paper-soft transition-colors">
              <td className="px-5 py-3.5">
                <Link href={`/dashboard/courses/${c.slug}`} className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border border-line bg-gradient-to-br from-neutral-900 to-neutral-700 text-paper flex items-center justify-center shrink-0"
                  >
                    <span className="text-[11px] font-bold tracking-tight">
                      {c.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-ink truncate group-hover:underline underline-offset-4 decoration-ink/30">
                      {c.title}
                    </p>
                    <p className="text-[11px] text-ink-muted truncate">
                      {c.totalLessons} lessons · {c.totalHours}h · {c.level.toLowerCase()}
                    </p>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
                    STATUS_BADGE[c.status] || STATUS_BADGE.DRAFT,
                  )}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-[12.5px] font-medium text-ink capitalize">
                {c.format.replace("_", "-").toLowerCase()}
              </td>
              <td className="px-5 py-3.5 text-[13px] font-medium text-ink">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-ink-subtle" />
                  {c.totalStudents.toLocaleString()}
                </span>
              </td>
              <td className="px-5 py-3.5 text-[13px] font-medium text-ink">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-ink-subtle" />
                  {c.ratingAvg > 0 ? c.ratingAvg.toFixed(1) : "—"}
                  <span className="text-ink-subtle">({c.ratingCount})</span>
                </span>
              </td>
              <td className="px-5 py-3.5 text-[13px] font-medium text-ink">
                {c.completionRate > 0 ? `${Math.round(c.completionRate)}%` : "—"}
              </td>
              <td className="px-5 py-3.5 w-[140px]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-paper-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        c.readinessPercent >= 80
                          ? "bg-emerald-500"
                          : c.readinessPercent >= 40
                          ? "bg-ink"
                          : "bg-amber-500",
                      )}
                      style={{ width: `${Math.max(c.readinessPercent, 4)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-ink tabular-nums w-7 text-right">
                    {c.readinessPercent}%
                  </span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] font-bold text-ink">
                {c.priceDisplay}
              </td>
              <td className="px-5 py-3.5 text-right">
                <CourseCardActions course={c} />
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan={9} className="px-5 py-8 text-center text-[13px] text-ink-muted italic">
                No courses match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
