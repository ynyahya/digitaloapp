import {
  Plus,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Clock,
  BookOpen,
  Users,
  BarChart3,
  Globe,
  Eye,
  FileText,
  Video,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Copy,
  Pencil,
  ExternalLink,
  Layers,
  Play,
  Star,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseInsights, getCourseActivity, type CourseInsight, type CourseActivityItem } from "@/lib/queries/courses";

export const metadata = {
  title: "Courses",
  description: "Build and manage your online courses.",
};

export default async function CoursesDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const creator = await db.creator.findUnique({ where: { userId: user.id } });
  if (!creator) return null;

  const courses = await db.course.findMany({
    where: { creatorId: creator.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { chapters: true, enrollments: true, courseReviews: true } },
      chapters: {
        include: { lessons: { select: { id: true, isPublished: true, durationMin: true, contentType: true } } },
      },
    },
  });

  const [insights, activity] = await Promise.all([
    getCourseInsights(creator.id),
    getCourseActivity(creator.id, 5),
  ]);

  const published = courses.filter((c) => c.status === "PUBLISHED").length;
  const drafts = courses.filter((c) => c.status === "DRAFT").length;
  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);
  const totalLessons = courses.reduce((s, c) => s + c.chapters.reduce((ss, ch) => ss + ch.lessons.length, 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Course Studio</h1>
          <p className="text-[14px] text-ink-muted mt-1">
            Build, publish, and scale your learning products.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/courses/new">
            <Button className="rounded-xl h-10 px-5 bg-ink text-paper shadow-float hover:bg-ink/90 font-medium text-[13px]">
              <Plus className="mr-2 h-4 w-4" /> New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Globe}
          label="Published"
          value={published.toString()}
          color="emerald"
        />
        <KpiCard
          icon={Pencil}
          label="Drafts"
          value={drafts.toString()}
          color="amber"
        />
        <KpiCard
          icon={Users}
          label="Enrolled"
          value={totalStudents.toString()}
          color="indigo"
        />
        <KpiCard
          icon={BookOpen}
          label="Lessons"
          value={totalLessons.toString()}
          color="violet"
        />
      </div>

      {/* ── Course Grid ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-ink">Your Courses</h2>
            <p className="text-[13px] text-ink-muted">
              {courses.length === 0
                ? "No courses yet. Create your first one."
                : `${courses.length} course${courses.length > 1 ? "s" : ""} total`}
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((course) => {
              const allLessons = course.chapters.flatMap((ch) => ch.lessons);
              const totalMins = allLessons.reduce((s, l) => s + (l.durationMin || 0), 0);
              const hours = Math.floor(totalMins / 60);
              const mins = totalMins % 60;
              const publishedLessons = allLessons.filter((l) => l.isPublished).length;
              const readinessPercent =
                allLessons.length === 0 ? 0 : Math.round((publishedLessons / allLessons.length) * 100);

              return (
                <Link key={course.id} href={`/dashboard/courses/${course.slug}`}>
                  <Card className="group rounded-2xl border-line shadow-none bg-paper overflow-hidden hover:shadow-soft hover:border-indigo-200 transition-all cursor-pointer h-full flex flex-col">
                    {/* Cover */}
                    <div className="relative h-40 bg-paper-soft border-b border-line overflow-hidden">
                      {course.coverImage || course.thumbnailUrl ? (
                        <img
                          src={course.coverImage || course.thumbnailUrl || ""}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: course.thumbnailColor || "#f1f5f9" }}
                        >
                          <GraduationCap className="h-10 w-10 text-white/60" />
                        </div>
                      )}
                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                            course.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {course.status === "PUBLISHED" ? "Live" : "Draft"}
                        </span>
                      </div>
                      {/* Readiness bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-line">
                        <div
                          className={`h-full transition-all ${
                            readinessPercent >= 80
                              ? "bg-emerald-500"
                              : readinessPercent >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${readinessPercent}%` }}
                        />
                      </div>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-[15px] font-bold text-ink line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {course.title}
                        </h3>
                        {course.subtitle && (
                          <p className="text-[12px] text-ink-muted line-clamp-2">{course.subtitle}</p>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" /> {course._count.chapters} mod
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {allLessons.length} less
                          </span>
                          {totalMins > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {hours}h {mins}m
                            </span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Insights + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Insights */}
        <Card className="rounded-2xl border-line shadow-none bg-paper">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-ink">AI Insights</h3>
              <Sparkles className="h-4 w-4 text-indigo-500" />
            </div>
            {insights.length === 0 ? (
              <p className="text-[12px] text-ink-muted">Publish a course to see insights.</p>
            ) : (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="rounded-2xl border-line shadow-none bg-paper">
          <CardContent className="p-6">
            <h3 className="text-[15px] font-bold text-ink mb-4">Recent Activity</h3>
            {activity.length === 0 ? (
              <p className="text-[12px] text-ink-muted">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Sub-components ──

function KpiCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <Card className="rounded-2xl border-line shadow-none bg-paper">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || "bg-paper-soft"}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-ink leading-none">{value}</p>
            <p className="text-[11px] text-ink-muted font-medium">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="rounded-3xl border-line shadow-none bg-paper overflow-hidden">
      <CardContent className="p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-paper-soft border border-line flex items-center justify-center mb-6">
          <GraduationCap className="h-10 w-10 text-indigo-500" />
        </div>
        <h3 className="text-[20px] font-bold text-ink mb-2">Create your first course</h3>
        <p className="text-[14px] text-ink-muted max-w-[420px] leading-relaxed mb-6">
          Build a world-class learning experience with our professional course authoring studio.
          Use AI to scaffold your curriculum in seconds.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/courses/new">
            <Button className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md">
              <Plus className="mr-2 h-4 w-4" /> New Course
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl h-11 px-5 border-line font-medium">
            <Sparkles className="mr-2 h-4 w-4 text-indigo-500" /> AI Quickstart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }: { insight: CourseInsight }) {
  const colorMap = {
    positive: "from-emerald-500/5 to-emerald-500/10 border-emerald-200",
    warning: "from-amber-500/5 to-amber-500/10 border-amber-200",
    neutral: "from-blue-500/5 to-blue-500/10 border-blue-200",
  };

  const iconMap = {
    positive: TrendingUp,
    warning: AlertCircle,
    neutral: Sparkles,
  };

  const Icon = iconMap[insight.tone];

  return (
    <Link href={insight.actionHref}>
      <div className={`bg-gradient-to-br ${colorMap[insight.tone]} border rounded-xl p-4 hover:shadow-sm transition-all`}>
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              insight.tone === "positive"
                ? "bg-emerald-100 text-emerald-600"
                : insight.tone === "warning"
                ? "bg-amber-100 text-amber-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-ink">{insight.title}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">{insight.body}</p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-ink-muted shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ item }: { item: CourseActivityItem }) {
  const iconMap: Record<string, { icon: any; color: string }> = {
    ENROLLED: { icon: Users, color: "bg-blue-50 text-blue-600" },
    REVIEW: { icon: Star, color: "bg-amber-50 text-amber-600" },
    PUBLISHED: { icon: Globe, color: "bg-emerald-50 text-emerald-600" },
    COMPLETED: { icon: CheckCircle2, color: "bg-violet-50 text-violet-600" },
  };

  const matched = iconMap[item.type] || iconMap.PUBLISHED;
  const { icon: Icon, color } = matched;

  return (
    <div className="flex items-start gap-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-ink line-clamp-1">{item.message}</p>
        <p className="text-[10px] text-ink-muted mt-0.5">{item.timeAgo}</p>
      </div>
    </div>
  );
}
