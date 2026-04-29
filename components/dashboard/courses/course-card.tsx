import Link from "next/link";
import { Star, Users, Clock, BookOpen, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseCover } from "./course-cover";
import { CourseCardActions } from "./course-card-actions";
import type { CourseListItem } from "@/lib/queries/courses";



const STATUS_DOT: Record<string, string> = {
  PUBLISHED: "bg-emerald-500 animate-pulse",
  DRAFT: "bg-ink-subtle",
  SCHEDULED: "bg-amber-500",
  ARCHIVED: "bg-red-400",
};

export function CourseCard({ course }: { course: CourseListItem }) {
  return (
    <article className="group relative rounded-2xl border border-line bg-paper shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 overflow-hidden">
      <Link
        href={`/dashboard/courses/${course.slug}`}
        className="block"
        aria-label={`Open ${course.title}`}
      >
        <div className="relative">
          <CourseCover
            src={course.coverImage || course.thumbnailUrl}
            paletteSeed={course.thumbnailColor || course.slug}
            title={course.title}
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-paper/95 backdrop-blur-sm border border-line shadow-soft">
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[course.status] || STATUS_DOT.DRAFT)} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
              {course.status}
            </span>
          </div>
          {course.hasFreePreview && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-ink/95 text-paper text-[10px] font-bold uppercase tracking-[0.14em]">
              Free preview
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 space-y-4">
        <div>
          <Link href={`/dashboard/courses/${course.slug}`}>
            <h3 className="text-[15px] font-bold text-ink leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-ink/30">
              {course.title}
            </h3>
          </Link>
          {course.subtitle && (
            <p className="mt-1 text-[12px] text-ink-muted line-clamp-2 leading-relaxed">
              {course.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-ink-muted">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.totalHours}h
          </span>
          <span className="capitalize">{course.level.toLowerCase()}</span>
          <span className="capitalize">
            {course.format.replace("_", "-").toLowerCase()}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] text-ink">
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-3 w-3 text-ink-muted" />
            {course.totalStudents.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Star className="h-3 w-3 text-ink-muted" />
            {course.ratingAvg > 0 ? course.ratingAvg.toFixed(1) : "—"}
            <span className="text-ink-subtle">
              ({course.ratingCount})
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Eye className="h-3 w-3 text-ink-muted" />
            {course.completionRate > 0 ? `${Math.round(course.completionRate)}%` : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-line">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
              Price
            </p>
            <p className="text-[15px] font-bold text-ink leading-none mt-0.5">
              {course.priceDisplay}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
              Updated
            </p>
            <p className="text-[12px] font-medium text-ink leading-none mt-1">
              {course.updatedAgo}
            </p>
          </div>
          <CourseCardActions course={course} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
              Readiness
            </p>
            <p className="text-[10.5px] font-bold tracking-wide text-ink">
              {course.readinessPercent}%
            </p>
          </div>
          <div className="h-1.5 rounded-full bg-paper-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                course.readinessPercent >= 80
                  ? "bg-emerald-500"
                  : course.readinessPercent >= 40
                  ? "bg-ink"
                  : "bg-amber-500",
              )}
              style={{ width: `${Math.max(course.readinessPercent, 4)}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
