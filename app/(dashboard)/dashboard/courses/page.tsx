import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Layers3,
  ListChecks,
  PlayCircle,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseInsights, getCourseActivity, type CourseInsight, type CourseActivityItem } from "@/lib/queries/courses";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Courses",
  description: "Build and manage your online courses.",
};

const COURSE_OS = [
  { label: "Outcome map", detail: "Audience, promise, learning goals", icon: Target },
  { label: "Curriculum", detail: "Modules, lessons, previews", icon: Layers3 },
  { label: "Experience", detail: "Video, files, quiz, assignments", icon: PlayCircle },
  { label: "Launch", detail: "Pricing, SEO, publish checklist", icon: Rocket },
];

const PIPELINE = ["IDEA", "OUTLINING", "RECORDING", "EDITING", "READY", "LIVE"];

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
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              isPublished: true,
              durationMin: true,
              contentType: true,
              isFree: true,
              videoUrl: true,
              documentUrl: true,
              quizJson: true,
              assignmentBrief: true,
              contentJson: true,
            },
          },
        },
      },
    },
  });

  const [insights, activity] = await Promise.all([
    getCourseInsights(creator.id),
    getCourseActivity(creator.id, 6),
  ]);

  const liveCourses = courses.filter((course) => course.status === "PUBLISHED");
  const draftCourses = courses.filter((course) => course.status === "DRAFT");
  const totalStudents = courses.reduce((sum, course) => sum + course._count.enrollments, 0);
  const totalLessons = courses.reduce((sum, course) => sum + flattenLessons(course).length, 0);
  const totalMinutes = courses.reduce((sum, course) => sum + flattenLessons(course).reduce((lessonSum, lesson) => lessonSum + (lesson.durationMin || 0), 0), 0);
  const averageReadiness = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + getCourseReadinessScore(course).score, 0) / courses.length)
    : 0;
  const focusCourse = [...courses]
    .filter((course) => course.status !== "PUBLISHED")
    .sort((a, b) => getCourseReadinessScore(b).score - getCourseReadinessScore(a).score)[0] ?? courses[0];

  return (
    <div className="space-y-8 pb-16">
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-night/80 p-6 shadow-2xl shadow-black/30 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(124,92,255,0.18),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(180,243,0,0.16),transparent_34%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_440px]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                <GraduationCap className="h-3.5 w-3.5" /> Course builder OS
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-medium text-chalk-muted">
                {courses.length} courses · {liveCourses.length} live · {draftCourses.length} drafts
              </span>
            </div>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-display-sm font-extrabold tracking-tight text-chalk">
                Design courses as complete learning products.
              </h1>
              <p className="max-w-2xl text-[15px] leading-7 text-chalk-muted">
                Rombakan workflow course builder: mulai dari outcome, struktur modul, readiness lesson, preview/free lesson, pricing, sampai launch checklist dan student analytics.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-2xl bg-lime px-5 text-[13px] font-bold text-night hover:bg-lime/90 lime-shadow">
                <Link href="/dashboard/courses/new"><Plus className="mr-2 h-4 w-4" /> New course</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-2xl border-white/[0.08] bg-white/[0.035] px-5 text-[13px] font-bold text-chalk hover:bg-white/[0.06]">
                <Link href={focusCourse ? `/dashboard/courses/${focusCourse.slug}/builder` : "/dashboard/courses/new"}>
                  <Sparkles className="mr-2 h-4 w-4" /> Continue studio
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-dim">Learning portfolio</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tight text-chalk">{averageReadiness}%</span>
                  <span className="pb-2 text-[12px] font-medium text-chalk-muted">avg readiness</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-night lime-shadow">
                <ListChecks className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-lime" style={{ width: `${averageReadiness}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricTile label="Students" value={totalStudents.toLocaleString()} icon={Users} />
              <MetricTile label="Lessons" value={totalLessons.toLocaleString()} icon={BookOpen} />
              <MetricTile label="Hours" value={Math.round(totalMinutes / 60).toString()} icon={Clock} />
              <MetricTile label="Live" value={liveCourses.length.toString()} icon={Globe2} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COURSE_OS.map((item, index) => (
          <div key={item.label} className="group rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-5 transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:bg-white/[0.05]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-night text-lime">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-black text-chalk-dim">0{index + 1}</span>
            </div>
            <h3 className="text-[15px] font-bold text-chalk">{item.label}</h3>
            <p className="mt-1 text-[12px] leading-5 text-chalk-muted">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/[0.08] bg-night/70 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-chalk">Course command center</h2>
                <p className="mt-1 text-[12px] text-chalk-muted">A professional dashboard should tell you what to build, fix, publish, and optimize next.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-dim" />
                <Input className="h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] pl-9 text-[13px] text-chalk placeholder:text-chalk-dim" placeholder="Search courses..." />
              </div>
            </div>

            {courses.length === 0 ? (
              <CourseEmptyState />
            ) : (
              <div className="grid gap-5 p-5 lg:grid-cols-2">
                {courses.map((course) => <CourseCard key={course.id} course={course} creatorHandle={creator.handle} />)}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold text-chalk">Pipeline health</h2>
                <p className="mt-1 text-[12px] text-chalk-muted">Move every course from idea to launch with visible production stages.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-lime" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {PIPELINE.map((stage) => {
                const count = courses.filter((course) => course.pipelineStage === stage || (stage === "LIVE" && course.status === "PUBLISHED")).length;
                return (
                  <div key={stage} className="rounded-2xl border border-white/[0.08] bg-night/70 p-3">
                    <p className="text-[18px] font-black text-chalk">{count}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-chalk-dim">{stage.toLowerCase()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Focus course</p>
                <h3 className="mt-2 text-[17px] font-bold text-chalk">Most ready to ship</h3>
              </div>
              <TrendingUp className="h-5 w-5 text-lime" />
            </div>
            {focusCourse ? (
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-night p-4">
                <p className="text-[13px] font-bold text-chalk">{focusCourse.title}</p>
                <p className="mt-1 text-[12px] text-chalk-muted">{getCourseReadinessScore(focusCourse).score}% ready · {getCourseReadinessScore(focusCourse).next}</p>
                <Button asChild className="mt-4 h-9 w-full rounded-xl bg-lime text-[12px] font-bold text-night hover:bg-lime/90">
                  <Link href={`/dashboard/courses/${focusCourse.slug}/builder`}>Open builder <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-[12px] leading-5 text-chalk-muted">Create a course to start the learning-product workflow.</p>
            )}
          </div>

          <Card className="rounded-[28px] border-white/[0.08] bg-white/[0.035] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-chalk">Studio insights</h3>
                <Sparkles className="h-4 w-4 text-lime" />
              </div>
              {insights.length === 0 ? (
                <p className="mt-4 text-[12px] leading-5 text-chalk-muted">Publish a course or add students to unlock actionable insights.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/[0.08] bg-white/[0.035] shadow-none">
            <CardContent className="p-5">
              <h3 className="text-[15px] font-bold text-chalk">Recent activity</h3>
              {activity.length === 0 ? (
                <p className="mt-4 text-[12px] leading-5 text-chalk-muted">No learning activity yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {activity.map((item) => <ActivityItem key={item.id} item={item} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function CourseCard({ course, creatorHandle }: { course: any; creatorHandle: string }) {
  const lessons = flattenLessons(course);
  const score = getCourseReadinessScore(course);
  const totalMinutes = lessons.reduce((sum, lesson) => sum + (lesson.durationMin || 0), 0);
  const videoLessons = lessons.filter((lesson) => lesson.contentType === "VIDEO" || lesson.videoUrl).length;
  const publishedLessons = lessons.filter((lesson) => lesson.isPublished).length;
  const freeLessons = lessons.filter((lesson) => lesson.isFree).length;

  return (
    <div className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.025] transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:bg-white/[0.045]">
      <Link href={`/dashboard/courses/${course.slug}/builder`} className="block">
        <div className="relative h-44 overflow-hidden border-b border-white/[0.08] bg-night">
          {course.coverImage || course.thumbnailUrl ? (
            <img src={course.coverImage || course.thumbnailUrl || ""} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.24),transparent_64%),radial-gradient(circle_at_80%_80%,rgba(180,243,0,0.16),transparent_55%)]" style={{ backgroundColor: course.thumbnailColor || undefined }}>
              <GraduationCap className="h-12 w-12 text-lime" />
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <StatusPill status={course.status} />
            <span className="rounded-full border border-white/[0.1] bg-night/70 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-chalk backdrop-blur-md">{course.level}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/[0.08]">
            <div className={cn("h-full", score.score >= 80 ? "bg-lime" : score.score >= 50 ? "bg-amber-400" : "bg-rose-400")} style={{ width: `${score.score}%` }} />
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/dashboard/courses/${course.slug}/builder`}>
              <h3 className="line-clamp-1 text-[16px] font-black text-chalk group-hover:text-lime">{course.title}</h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-chalk-muted">
              {course.subtitle || course.audience || "Define the promise, audience, and outcomes before launch."}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={cn("text-[18px] font-black", score.score >= 80 ? "text-lime" : "text-chalk")}>{score.score}%</p>
            <p className="text-[10px] text-chalk-dim">ready</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <MiniStat label="Modules" value={course._count.chapters} icon={Layers3} />
          <MiniStat label="Lessons" value={lessons.length} icon={BookOpen} />
          <MiniStat label="Video" value={videoLessons} icon={Video} />
          <MiniStat label="Free" value={freeLessons} icon={Zap} />
        </div>

        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-night/70 p-3">
          <div className="flex items-center justify-between gap-3 text-[12px]">
            <span className="font-medium text-chalk-muted">Lesson publish health</span>
            <span className="font-black text-chalk">{publishedLessons}/{lessons.length}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-lime" style={{ width: lessons.length ? `${Math.round((publishedLessons / lessons.length) * 100)}%` : "0%" }} />
          </div>
          <p className="mt-2 text-[11px] text-chalk-dim">Next: {score.next}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
          <div className="flex flex-wrap gap-2 text-[11px] text-chalk-muted">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2 py-1"><Users className="h-3 w-3" /> {course._count.enrollments}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2 py-1"><Clock className="h-3 w-3" /> {formatDuration(totalMinutes)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2 py-1"><Star className="h-3 w-3" /> {course.ratingAvg?.toFixed?.(1) ?? "0.0"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 rounded-xl border-white/[0.08] bg-white/[0.035] text-[11px] font-bold text-chalk">
              <Link href={`/c/${creatorHandle}/${course.slug}`} target="_blank">Preview</Link>
            </Button>
            <Button asChild size="sm" className="h-8 rounded-xl bg-lime text-[11px] font-bold text-night hover:bg-lime/90">
              <Link href={`/dashboard/courses/${course.slug}/builder`}>Build <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-night/70 p-3">
      <Icon className="mb-2 h-4 w-4 text-lime" />
      <p className="text-[16px] font-black text-chalk">{value}</p>
      <p className="text-[10px] font-medium text-chalk-dim">{label}</p>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-night/60 p-2.5">
      <Icon className="mb-1.5 h-3.5 w-3.5 text-lime" />
      <p className="text-[14px] font-black text-chalk">{value}</p>
      <p className="text-[9px] font-medium text-chalk-dim">{label}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]",
        status === "PUBLISHED" && "border-lime/25 bg-lime/10 text-lime",
        status === "DRAFT" && "border-white/[0.1] bg-night/70 text-chalk-muted",
        status === "SCHEDULED" && "border-violet/30 bg-violet/10 text-violet",
        status === "ARCHIVED" && "border-rose-400/20 bg-rose-500/10 text-rose-200",
      )}
    >
      {status === "PUBLISHED" ? "Live" : status.toLowerCase()}
    </span>
  );
}

function InsightCard({ insight }: { insight: CourseInsight }) {
  const iconMap = {
    positive: TrendingUp,
    warning: AlertCircle,
    neutral: Sparkles,
  };
  const Icon = iconMap[insight.tone];

  return (
    <Link href={insight.actionHref} className="block rounded-2xl border border-white/[0.08] bg-night/70 p-4 transition-colors hover:border-lime/25">
      <div className="flex items-start gap-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", insight.tone === "warning" ? "bg-amber-400/10 text-amber-300" : insight.tone === "positive" ? "bg-lime/10 text-lime" : "bg-violet/10 text-violet")}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-chalk">{insight.title}</p>
          <p className="mt-1 text-[11px] leading-4 text-chalk-muted">{insight.body}</p>
        </div>
        <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-chalk-dim" />
      </div>
    </Link>
  );
}

function ActivityItem({ item }: { item: CourseActivityItem }) {
  const iconMap: Record<string, any> = {
    ENROLLED: Users,
    REVIEW: Star,
    PUBLISHED: Globe2,
    COMPLETED: CheckCircle2,
  };
  const Icon = iconMap[item.type] || FileText;

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-night text-lime">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[12px] font-medium text-chalk">{item.message}</p>
        <p className="mt-0.5 text-[10px] text-chalk-dim">{item.timeAgo}</p>
      </div>
    </div>
  );
}

function CourseEmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-lime/20 bg-lime/10 text-lime">
        <GraduationCap className="h-9 w-9" />
      </div>
      <h3 className="mt-6 text-[22px] font-black text-chalk">Create your first course</h3>
      <p className="mt-2 max-w-md text-[14px] leading-6 text-chalk-muted">
        Start with a professional course brief, then build curriculum, lessons, pricing, and launch readiness from the studio.
      </p>
      <Button asChild className="mt-6 rounded-2xl bg-lime text-night hover:bg-lime/90 lime-shadow">
        <Link href="/dashboard/courses/new"><Plus className="mr-2 h-4 w-4" /> New course</Link>
      </Button>
    </div>
  );
}

function flattenLessons(course: any): any[] {
  return course.chapters.flatMap((chapter: any) => chapter.lessons);
}

function getCourseReadinessScore(course: any) {
  const lessons = flattenLessons(course);
  const hasRichLesson = lessons.some((lesson: any) => lesson.videoUrl || lesson.documentUrl || lesson.quizJson || lesson.assignmentBrief || lesson.contentJson);
  const checks = [
    Boolean(course.title && course.title.length > 2),
    Boolean(course.subtitle && course.subtitle.length > 8),
    Boolean(course.audience && course.audience.length > 15),
    Boolean(course.outcomes && course.outcomes.length > 20),
    course.chapters.length > 0,
    lessons.length >= 3,
    lessons.some((lesson: any) => lesson.isFree),
    hasRichLesson,
    course.pricingModel === "FREE" || course.priceCents > 0,
    Boolean(course.coverImage || course.thumbnailUrl),
  ];
  const labels = ["title", "subtitle", "audience", "outcomes", "module", "3 lessons", "free preview", "lesson content", "pricing", "cover"];
  const missingIndex = checks.findIndex((item) => !item);
  return {
    score: Math.round((checks.filter(Boolean).length / checks.length) * 100),
    next: missingIndex === -1 ? "Ready for launch review" : `Add ${labels[missingIndex]}`,
  };
}

function formatDuration(minutes: number) {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
}
