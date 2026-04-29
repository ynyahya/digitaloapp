import { BookOpen, Users, DollarSign, Sparkles, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Spark } from "./spark";
import type { CourseKpi } from "@/lib/queries/courses";
import { cn } from "@/lib/utils";

type StatItemProps = {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  sparkline?: number[];
  caption?: string;
};

function StatItem({ label, value, delta, icon: Icon, sparkline, caption }: StatItemProps) {
  const isPositive = delta.startsWith("+") && !delta.includes("0%");
  const isNegative = delta.startsWith("-");
  return (
    <Card className="rounded-2xl border-line shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="h-9 w-9 rounded-xl bg-paper-muted flex items-center justify-center text-ink">
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              isPositive && "bg-emerald-50 text-emerald-700",
              isNegative && "bg-red-50 text-red-700",
              !isPositive && !isNegative && "bg-paper-muted text-ink-muted",
            )}
          >
            {delta}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
            {label}
          </p>
          <p className="mt-1 text-[26px] font-bold tracking-tight text-ink leading-none">
            {value}
          </p>
          {caption && (
            <p className="mt-1 text-[11px] text-ink-muted">{caption}</p>
          )}
        </div>
        {sparkline && sparkline.length > 0 && (
          <div className="mt-4">
            <Spark data={sparkline} width={220} height={32} className="text-ink/80 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CourseStatStrip({ kpi }: { kpi: CourseKpi }) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
      <StatItem
        label="Active Courses"
        value={kpi.activeCourses.value.toString()}
        delta={kpi.activeCourses.delta}
        icon={BookOpen}
        sparkline={kpi.activeCourses.sparkline}
      />
      <StatItem
        label="Enrolled (30d)"
        value={kpi.enrolledStudents.value.toLocaleString()}
        delta={kpi.enrolledStudents.delta}
        icon={Users}
        sparkline={kpi.enrolledStudents.sparkline}
      />
      <StatItem
        label="Course Revenue MTD"
        value={kpi.revenueMtd.display}
        delta={kpi.revenueMtd.delta}
        icon={DollarSign}
        sparkline={kpi.revenueMtd.sparkline}
      />
      <StatItem
        label="Avg Completion"
        value={`${kpi.avgCompletion.value}%`}
        delta={kpi.avgCompletion.delta}
        icon={Sparkles}
        caption="across all courses"
      />
      <StatItem
        label="Avg Rating"
        value={kpi.avgRating.value > 0 ? kpi.avgRating.value.toFixed(2) : "—"}
        delta={kpi.avgRating.delta}
        icon={Star}
        caption={`${kpi.avgRating.count} review${kpi.avgRating.count === 1 ? "" : "s"}`}
      />
    </div>
  );
}
