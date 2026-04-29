import Link from "next/link";
import { UserPlus, Star, Rocket, Trophy, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseActivityItem } from "@/lib/queries/courses";

const ICON: Record<CourseActivityItem["type"], { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  ENROLLED: { icon: UserPlus, color: "bg-emerald-50 text-emerald-700" },
  REVIEW: { icon: Star, color: "bg-amber-50 text-amber-700" },
  PUBLISHED: { icon: Rocket, color: "bg-paper-muted text-ink" },
  COMPLETED: { icon: Trophy, color: "bg-paper-muted text-ink" },
};

export function CourseActivityFeed({ items }: { items: CourseActivityItem[] }) {
  return (
    <section className="rounded-2xl border border-line bg-paper shadow-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-ink-muted" />
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
          Live activity
        </p>
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <ul className="divide-y divide-line">
        {items.length === 0 && (
          <li className="px-5 py-6 text-[12.5px] text-ink-muted italic text-center">
            Activity will appear here as students engage with your courses.
          </li>
        )}
        {items.map((item) => {
          const Icon = ICON[item.type].icon;
          const inner = (
            <li className="px-5 py-3 flex items-center gap-3 hover:bg-paper-soft transition-colors">
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", ICON[item.type].color)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium text-ink leading-snug truncate">
                  {item.message}
                </p>
                <p className="text-[10.5px] text-ink-subtle">{item.timeAgo}</p>
              </div>
            </li>
          );
          return item.courseSlug ? (
            <Link key={item.id} href={`/dashboard/courses/${item.courseSlug}`}>
              {inner}
            </Link>
          ) : (
            <div key={item.id}>{inner}</div>
          );
        })}
      </ul>
    </section>
  );
}
