import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublicCourseBySlug } from "@/lib/queries/courses";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/lib/actions/commerce";
import {
  Play,
  FileText,
  CheckCircle2,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  Users,
  ArrowLeft,
  Globe,
  Award,
  BarChart3,
  Infinity,
  ChevronDown,
  ChevronRight,
  Video,
  Headphones,
  ImageIcon,
  File,
  HelpCircle,
  Monitor,
} from "lucide-react";
import Image from "next/image";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { handle: string; "course-slug": string };
}): Promise<Metadata> {
  const course = await getPublicCourseBySlug(params.handle, params["course-slug"]);
  if (!course) return {};
  return {
    title: course.title,
    description: course.subtitle ?? course.description?.slice(0, 160) ?? undefined,
    openGraph: course.coverImage || course.thumbnailUrl
      ? { images: [course.coverImage || course.thumbnailUrl!] }
      : undefined,
  };
}

export default async function CourseStorefrontPage({
  params,
}: {
  params: { handle: string; "course-slug": string };
}) {
  const course = await getPublicCourseBySlug(params.handle, params["course-slug"]);
  if (!course) notFound();

  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const totalMinutes = course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.reduce((s, l) => s + (l.durationMin || 0), 0),
    0,
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const totalRemainingMins = totalMinutes % 60;
  const durationString =
    totalHours > 0 && totalRemainingMins > 0
      ? `${totalHours}h ${totalRemainingMins}m`
      : totalHours > 0
        ? `${totalHours}h`
        : `${totalRemainingMins}m`;

  const freeLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.filter((l) => l.isFree).length, 0);
  const ratingAvg = course.courseReviews.length > 0
    ? course.courseReviews.reduce((s, r) => s + r.rating, 0) / course.courseReviews.length
    : 0;
  const reviewCount = course.courseReviews.length;
  const enrollmentCount = course._count.enrollments;

  const contentTypeIcons: Record<string, any> = {
    VIDEO: Video,
    AUDIO: Headphones,
    IMAGE: ImageIcon,
    FILE: File,
    QUIZ: HelpCircle,
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 h-16 border-b border-line bg-paper/80 backdrop-blur-xl flex items-center">
        <div className="max-w-[1280px] mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/courses" className="text-[13px] font-medium text-ink-muted hover:text-ink flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Explore Courses
            </Link>
            <div className="w-px h-5 bg-line hidden sm:block" />
            <Link href={`/c/${course.creator.handle}`} className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-ink-muted hover:text-ink transition-colors">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600 overflow-hidden">
                {course.creator.avatarUrl ? (
                  <Image src={course.creator.avatarUrl} alt="" width={24} height={24} className="w-full h-full object-cover" />
                ) : (
                  course.creator.displayName[0]
                )}
              </div>
              {course.creator.displayName}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {course.priceCents > 0 && (
              <span className="text-[15px] font-bold text-ink hidden sm:block">
                {formatCurrency(course.priceCents, course.currency)}
              </span>
            )}
            <form action={enrollInCourse.bind(null, course.id)}>
              <Button type="submit" className="rounded-xl h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold shadow-sm">
                Enroll Now
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-b from-[#f8f9ff] to-paper border-b border-line">
        <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[13px] font-medium text-ink-muted">
                <Link href={`/c/${course.creator.handle}`} className="hover:text-indigo-600 transition-colors">
                  {course.creator.displayName}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                  Course
                </span>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-[40px] lg:text-[56px] font-extrabold text-ink leading-[1.05] tracking-[-0.02em]">
                  {course.title}
                </h1>

                {course.subtitle && (
                  <p className="text-[18px] lg:text-[20px] text-ink-muted leading-relaxed max-w-2xl">
                    {course.subtitle}
                  </p>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 text-[14px] font-medium text-ink-muted">
                {ratingAvg > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= Math.round(ratingAvg)
                              ? "text-amber-500 fill-amber-500"
                              : "text-line"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-ink font-bold">{ratingAvg.toFixed(1)}</span>
                    <span className="text-ink-subtle">({reviewCount} reviews)</span>
                  </div>
                )}
                {enrollmentCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-bold text-ink">{enrollmentCount.toLocaleString()}</span>
                    <span>students</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-bold text-ink">{durationString}</span>
                  <span>content</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-bold text-ink">{totalLessons}</span>
                  <span>lessons</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-xl text-[12px] font-bold border uppercase tracking-wider ${
                    course.level === "BEGINNER"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : course.level === "INTERMEDIATE"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}
                >
                  {course.level}
                </span>
                {course.category && (
                  <span className="px-4 py-1.5 rounded-xl text-[12px] font-bold border border-line bg-paper text-ink-muted uppercase tracking-wider">
                    {course.category}
                  </span>
                )}
                <span className="px-4 py-1.5 rounded-xl text-[12px] font-bold border border-line bg-paper text-ink-muted uppercase tracking-wider">
                  {course.language === "en" ? "English" : course.language}
                </span>
              </div>
            </div>

            {/* Right: Sticky Checkout Card */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-paper border border-line rounded-3xl overflow-hidden shadow-card">
                {/* Preview Image */}
                <div className="aspect-video bg-paper-soft relative overflow-hidden border-b border-line">
                  {course.trailerUrl ? (
                    <iframe
                      src={course.trailerUrl.replace("watch?v=", "embed/").split("&")[0]}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Course trailer"
                    />
                  ) : course.coverImage || course.thumbnailUrl ? (
                    <Image
                      src={course.coverImage || course.thumbnailUrl || ""}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center">
                      <Play className="h-14 w-14 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="p-6 space-y-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                        {course.pricingModel === "FREE" ? "Free Course" : course.pricingModel === "SUBSCRIPTION" ? "Subscription" : "One-time payment"}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[36px] font-extrabold text-ink leading-none">
                          {course.priceCents === 0 ? "Free" : formatCurrency(course.priceCents, course.currency)}
                        </span>
                        {course.compareAtCents && course.compareAtCents > course.priceCents && (
                          <span className="text-[16px] text-ink-muted line-through font-medium">
                            {formatCurrency(course.compareAtCents, course.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                    {course.compareAtCents && course.compareAtCents > course.priceCents && (
                      <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                        {Math.round(((course.compareAtCents - course.priceCents) / course.compareAtCents) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <form action={enrollInCourse.bind(null, course.id)}>
                    <Button type="submit" className="w-full h-14 rounded-2xl text-[16px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                      Enroll Now — {course.priceCents === 0 ? "Start Free" : formatCurrency(course.priceCents, course.currency)}
                    </Button>
                  </form>

                  <p className="text-[11px] text-center text-ink-muted font-medium">
                    30-day money-back guarantee
                  </p>

                  {/* What's Included */}
                  <div className="pt-5 border-t border-line space-y-3">
                    <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">This course includes:</p>
                    <ul className="space-y-2.5">
                      <IncludedItem icon={BookOpen} label={`${totalLessons} lessons`} />
                      {totalMinutes > 0 && (
                        <IncludedItem icon={Clock} label={`${durationString} of content`} />
                      )}
                      <IncludedItem icon={Infinity} label="Lifetime access" />
                      <IncludedItem icon={Monitor} label="Access on all devices" />
                      {freeLessons > 0 && (
                        <IncludedItem icon={Play} label={`${freeLessons} free preview lessons`} />
                      )}
                      <IncludedItem icon={Award} label="Certificate of completion" />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 lg:gap-24">
          {/* Left: Content */}
          <div className="space-y-20">
            {/* About */}
            {course.description && (
              <section id="about">
                <h2 className="text-[28px] font-extrabold text-ink mb-6 flex items-center gap-3">
                  About this course
                  <div className="flex-1 h-px bg-line" />
                </h2>
                <div className="prose prose-neutral max-w-none prose-p:text-[16px] prose-p:leading-[1.8] prose-p:text-ink-muted prose-headings:font-bold prose-headings:text-ink">
                  {course.description.split("\n").map((para, i) =>
                    para.trim() ? <p key={i}>{para}</p> : null,
                  )}
                </div>
              </section>
            )}

            {/* What You'll Learn */}
            {course.whatYouLearn && (
              <section id="outcomes">
                <h2 className="text-[28px] font-extrabold text-ink mb-8 flex items-center gap-3">
                  What you&apos;ll learn
                  <div className="flex-1 h-px bg-line" />
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.whatYouLearn
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((outcome, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-paper-soft border border-line hover:border-emerald-200 transition-colors group"
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[14px] font-medium text-ink-muted group-hover:text-ink transition-colors">
                          {outcome}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            <section id="curriculum">
              <h2 className="text-[28px] font-extrabold text-ink mb-2 flex items-center gap-3">
                Course Curriculum
                <div className="flex-1 h-px bg-line" />
              </h2>
              <p className="text-[14px] text-ink-muted mb-8">
                {course.chapters.length} modules • {totalLessons} lessons • {durationString} total length
              </p>

              <div className="space-y-4">
                {course.chapters.map((chapter, idx) => {
                  const chapterLessons = chapter.lessons.length;
                  const chapterDuration = chapter.lessons.reduce((s, l) => s + (l.durationMin || 0), 0);
                  const chapterHours = Math.floor(chapterDuration / 60);
                  const chapterMins = chapterDuration % 60;

                  return (
                    <details key={chapter.id} className="group/chapter" open={idx === 0}>
                      <summary className="flex items-center justify-between p-5 rounded-2xl border border-line bg-paper cursor-pointer hover:border-indigo-200 hover:bg-paper-soft transition-all list-none">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <span className="text-[13px] font-extrabold text-indigo-600">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-[16px] font-bold text-ink">{chapter.title}</h3>
                            <p className="text-[12px] text-ink-muted mt-0.5">
                              {chapterLessons} lessons
                              {chapterDuration > 0 &&
                                ` • ${chapterHours > 0 ? `${chapterHours}h ` : ""}${chapterMins > 0 ? `${chapterMins}m` : ""}`}
                            </p>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-ink-muted transition-transform group-open/chapter:rotate-180 shrink-0" />
                      </summary>

                      <div className="mt-2 ml-4 pl-8 border-l-2 border-line space-y-0.5">
                        {chapter.lessons.map((lesson, lIdx) => {
                          const ContentIcon = contentTypeIcons[lesson.contentType] || FileText;
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-paper-soft transition-colors group/lesson"
                            >
                              <div className="flex items-center gap-3">
                                <ContentIcon className="h-4 w-4 text-ink-muted group-hover/lesson:text-indigo-500 transition-colors shrink-0" />
                                <span className="text-[14px] font-medium text-ink-muted group-hover/lesson:text-ink transition-colors">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {lesson.isFree && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                    Free
                                  </span>
                                )}
                                {lesson.durationMin && (
                                  <span className="text-[12px] text-ink-muted font-medium tabular-nums">
                                    {lesson.durationMin >= 60
                                      ? `${Math.floor(lesson.durationMin / 60)}h ${lesson.durationMin % 60 > 0 ? `${lesson.durationMin % 60}m` : ""}`
                                      : `${lesson.durationMin}m`}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>

            {/* Reviews */}
            {course.courseReviews.length > 0 && (
              <section id="reviews">
                <h2 className="text-[28px] font-extrabold text-ink mb-8 flex items-center gap-3">
                  Student Reviews
                  <div className="flex-1 h-px bg-line" />
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.courseReviews.map((review) => (
                    <div key={review.id} className="p-6 rounded-2xl border border-line bg-paper space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[12px] font-bold text-indigo-600">
                          {review.user.name?.[0] || "S"}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-ink">{review.user.name || "Student"}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${s <= review.rating ? "text-amber-500 fill-amber-500" : "text-line"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.title && (
                        <p className="text-[14px] font-semibold text-ink">{review.title}</p>
                      )}
                      {review.body && (
                        <p className="text-[13px] text-ink-muted leading-relaxed">{review.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Creator Card */}
            <div className="p-6 rounded-3xl border border-line bg-paper space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-[15px] font-bold text-indigo-600 overflow-hidden">
                  {course.creator.avatarUrl ? (
                    <Image src={course.creator.avatarUrl} alt="" width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    course.creator.displayName[0]
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink">{course.creator.displayName}</p>
                  {course.creator.tagline && (
                    <p className="text-[12px] text-ink-muted">{course.creator.tagline}</p>
                  )}
                </div>
              </div>
              {course.creator.bio && (
                <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-3">{course.creator.bio}</p>
              )}
              <Link
                href={`/c/${course.creator.handle}`}
                className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors inline-block"
              >
                View creator profile →
              </Link>
            </div>

            {/* Requirements */}
            <div className="p-6 rounded-3xl border border-line bg-paper space-y-4">
              <h4 className="text-[14px] font-extrabold text-ink uppercase tracking-wider">Requirements</h4>
              {course.requirements ? (
                <ul className="space-y-2.5">
                  {course.requirements
                    .split("\n")
                    .filter((r) => r.trim())
                    .map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-[13px] text-ink-muted">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                        {req}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-[13px] text-ink-muted italic">
                  No prerequisites required. This course is open to all skill levels.
                </p>
              )}
            </div>

            {/* Course Stats */}
            <div className="p-6 rounded-3xl border border-line bg-paper space-y-4">
              <h4 className="text-[14px] font-extrabold text-ink uppercase tracking-wider">Course Details</h4>
              <div className="space-y-3">
                <StatRow label="Level" value={course.level} />
                <StatRow label="Language" value={course.language === "en" ? "English" : course.language} />
                <StatRow label="Format" value={course.format.replace("_", " ")} />
                <StatRow label="Lessons" value={String(totalLessons)} />
                {totalMinutes > 0 && <StatRow label="Duration" value={durationString} />}
                {enrollmentCount > 0 && (
                  <StatRow label="Students" value={enrollmentCount.toLocaleString()} />
                )}
                <StatRow label="Access" value="Lifetime" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-line bg-gradient-to-b from-[#f8f9ff] to-paper">
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center space-y-8">
          <h2 className="text-[36px] font-extrabold text-ink">
            Ready to start learning?
          </h2>
          <p className="text-[16px] text-ink-muted max-w-lg mx-auto">
            Join {enrollmentCount > 0 ? enrollmentCount.toLocaleString() + " students" : "students"} and start mastering {course.title} today.
          </p>
          <div className="flex items-center justify-center gap-4">
            <form action={enrollInCourse.bind(null, course.id)}>
              <Button type="submit" className="rounded-2xl h-14 px-10 text-[16px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                Enroll Now — {course.priceCents === 0 ? "Free" : formatCurrency(course.priceCents, course.currency)}
              </Button>
            </form>
          </div>
          <p className="text-[12px] text-ink-muted">30-day money-back guarantee • Lifetime access</p>
        </div>
      </section>
    </div>
  );
}

function IncludedItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <li className="flex items-center gap-3 text-[13px] font-medium text-ink">
      <div className="w-7 h-7 rounded-lg bg-paper-soft border border-line flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-indigo-500" />
      </div>
      {label}
    </li>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold text-ink capitalize">{value}</span>
    </div>
  );
}
