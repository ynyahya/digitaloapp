import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  GraduationCap,
  Clock,
  Users,
  Star,
  BookOpen,
  ArrowRight,
  Search,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export const metadata = {
  title: "Explore Courses — Learn from world-class creators",
  description: "Discover courses taught by industry experts. From design to code to business.",
};

export const revalidate = 120;

export default async function CoursesLandingPage() {
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED", visibility: "PUBLIC" },
    orderBy: [{ ratingAvg: "desc" }, { totalStudents: "desc" }],
    take: 24,
    include: {
      creator: {
        select: {
          id: true,
          handle: true,
          displayName: true,
          avatarUrl: true,
          verified: true,
        },
      },
      chapters: {
        include: {
          lessons: {
            where: { isPublished: true },
            select: { id: true, durationMin: true, contentType: true, isFree: true },
          },
        },
      },
      _count: { select: { enrollments: true, courseReviews: true } },
    },
  });

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);
  const totalLessons = courses.reduce((s, c) => s + c.chapters.reduce((ss, ch) => ss + ch.lessons.length, 0), 0);

  return (
    <div className="min-h-screen bg-paper">
      {/* ── Hero ── */}
      <section className="relative border-b border-line overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-violet-50/20" />
        <div className="max-w-[1280px] mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[12px] font-semibold text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" /> Learn from the best
            </div>
            <h1 className="text-[48px] lg:text-[64px] font-extrabold text-ink leading-[1.05] tracking-[-0.02em]">
              Expand your skills with expert-led courses
            </h1>
            <p className="text-[18px] lg:text-[20px] text-ink-muted leading-relaxed max-w-xl">
              Master new skills with courses taught by industry experts. From design to engineering, business to creativity.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 text-[14px] text-ink-muted">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                <span className="font-bold text-ink">{courses.length}</span> courses
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span className="font-bold text-ink">{totalStudents.toLocaleString()}</span> students
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span className="font-bold text-ink">{totalLessons}</span> lessons
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Course Grid ── */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-[28px] font-extrabold text-ink">
              {courses.length > 0 ? "Featured Courses" : "Coming Soon"}
            </h2>
            <p className="text-[14px] text-ink-muted mt-1">
              {courses.length > 0
                ? "Discover courses created by the best instructors on TESKEL"
                : "Our creators are building amazing courses. Check back soon."}
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-paper-soft border border-line flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-indigo-300" />
            </div>
            <h3 className="text-[20px] font-bold text-ink mb-2">No courses published yet</h3>
            <p className="text-[14px] text-ink-muted max-w-sm mx-auto">
              Creators are crafting courses right now. Be the first to know when they launch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => {
              const allLessons = course.chapters.flatMap((ch) => ch.lessons);
              const totalMins = allLessons.reduce((s, l) => s + (l.durationMin || 0), 0);
              const totalH = Math.floor(totalMins / 60);
              const totalM = totalMins % 60;
              const durationStr = totalH > 0 ? `${totalH}h ${totalM > 0 ? `${totalM}m` : ""}` : `${totalM}m`;
              const ratingAvg = course.ratingAvg || (course._count.courseReviews > 0 ? 4.5 : 0);
              const freeLessons = allLessons.filter((l) => l.isFree).length;

              return (
                <Link
                  key={course.id}
                  href={`/c/${course.creator.handle}/${course.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-paper hover:border-indigo-200 hover:shadow-card transition-all overflow-hidden"
                >
                  {/* Cover */}
                  <div className="relative h-48 bg-paper-soft overflow-hidden">
                    {course.coverImage || course.thumbnailUrl ? (
                      <Image
                        src={course.coverImage || course.thumbnailUrl || ""}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: course.thumbnailColor || "#4f46e5" }}
                      >
                        <GraduationCap className="h-10 w-10 text-white/30" />
                      </div>
                    )}

                    {/* Price */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1.5 rounded-xl bg-paper/90 backdrop-blur-sm border border-line text-[14px] font-extrabold text-ink shadow-sm">
                        {course.priceCents === 0 ? "Free" : formatCurrency(course.priceCents, course.currency)}
                      </span>
                    </div>

                    {/* Free Preview Badge */}
                    {freeLessons > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-[10px] font-bold text-white">
                          Free preview
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Level */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                          course.level === "BEGINNER"
                            ? "bg-emerald-50 text-emerald-700"
                            : course.level === "INTERMEDIATE"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {course.level}
                      </span>
                      {course.category && (
                        <span className="text-[10px] font-medium text-ink-muted">{course.category}</span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-bold text-ink line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                      {course.title}
                    </h3>

                    {course.subtitle && (
                      <p className="text-[12px] text-ink-muted line-clamp-2 mt-1.5">{course.subtitle}</p>
                    )}

                    <div className="mt-auto pt-4 space-y-3">
                      {/* Creator */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden shrink-0">
                          {course.creator.avatarUrl ? (
                            <Image
                              src={course.creator.avatarUrl}
                              alt=""
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] font-bold text-indigo-600">
                              {course.creator.displayName[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] font-medium text-ink-muted truncate">
                          {course.creator.displayName}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-[11px] text-ink-muted pt-2 border-t border-line">
                        {ratingAvg > 0 && (
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="h-3 w-3 fill-amber-500" /> {ratingAvg.toFixed(1)}
                            <span className="text-ink-muted font-normal">({course._count.courseReviews})</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {durationStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {allLessons.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="max-w-[1280px] mx-auto px-6 pb-24">
        <div className="bg-ink rounded-[2.5rem] p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10" />
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold text-white/70">
              <Award className="h-3.5 w-3.5" /> Become a creator
            </div>
            <h2 className="text-[36px] font-extrabold text-paper leading-tight">
              Ready to create your own course?
            </h2>
            <p className="text-[16px] text-paper/60 leading-relaxed">
              Join thousands of creators building and selling courses on TESKEL. Start free, earn from day one.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/dashboard/courses/new">
                <Button className="rounded-2xl h-12 px-8 bg-paper text-ink hover:bg-paper-soft font-bold text-[14px] shadow-2xl">
                  Start Building <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
