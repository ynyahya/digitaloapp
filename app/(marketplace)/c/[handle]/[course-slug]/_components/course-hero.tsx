import Image from "next/image";
import Link from "next/link";
import { Play, Star, Users, Clock, BookOpen, ArrowLeft, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { enrollInCourse } from "@/lib/actions/commerce";
import { formatDuration, getEmbedUrl } from "./course-helpers";

interface CourseHeroProps {
  course: {
    id: string;
    title: string;
    subtitle: string | null;
    level: string;
    language: string;
    format: string;
    category: string | null;
    priceCents: number;
    compareAtCents: number | null;
    currency: string;
    pricingModel: string;
    coverImage: string | null;
    thumbnailUrl: string | null;
    trailerUrl: string | null;
    trailerPoster: string | null;
    creator: {
      handle: string;
      displayName: string;
      avatarUrl: string | null;
      verified: boolean;
      tagline: string | null;
    };
  };
  totalLessons: number;
  totalMinutes: number;
  ratingAvg: number;
  reviewCount: number;
  enrollmentCount: number;
}

export function CourseHero({
  course,
  totalLessons,
  totalMinutes,
  ratingAvg,
  reviewCount,
  enrollmentCount,
}: CourseHeroProps) {
  const durationString = formatDuration(totalMinutes);
  const embedUrl = getEmbedUrl(course.trailerUrl);
  const posterSrc = course.trailerPoster || course.coverImage || course.thumbnailUrl;
  const levelLabel = course.level.charAt(0) + course.level.slice(1).toLowerCase();
  const formatLabel =
    course.format === "SELF_PACED" ? "Self-paced" : course.format === "COHORT" ? "Cohort" : course.format;

  const priceIsFree = course.priceCents === 0;
  const discount = course.compareAtCents && course.compareAtCents > course.priceCents
    ? Math.round(((course.compareAtCents - course.priceCents) / course.compareAtCents) * 100)
    : 0;

  return (
    <section id="overview" className="relative border-b border-white/[0.08] bg-night">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mono-radial" />
      <div className="relative mx-auto max-w-[1100px] px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Back + Creator breadcrumb */}
        <div className="mb-10 flex items-center gap-3 text-[13px]">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 font-medium text-chalk-muted transition-colors hover:text-chalk"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Explore courses
          </Link>
          <span className="text-chalk-dim">/</span>
          <Link
            href={`/c/${course.creator.handle}`}
            className="flex items-center gap-2 font-medium text-chalk-muted transition-colors hover:text-chalk"
          >
            <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white/[0.06] text-[9px] font-bold text-chalk">
              {course.creator.avatarUrl ? (
                <Image
                  src={course.creator.avatarUrl}
                  alt=""
                  width={20}
                  height={20}
                  className="h-full w-full object-cover"
                />
              ) : (
                course.creator.displayName[0]
              )}
            </span>
            {course.creator.displayName}
            {course.creator.verified && <BadgeCheck className="h-3.5 w-3.5 text-chalk" />}
          </Link>
          <span className="text-chalk-dim">/</span>
          <span className="rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-night">
            Course
          </span>
        </div>

        {/* Title block */}
        <div className="max-w-[780px] space-y-6">
          <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em] text-chalk sm:text-[56px] lg:text-[64px]">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="max-w-[640px] text-[18px] leading-relaxed text-chalk-muted lg:text-[20px]">
              {course.subtitle}
            </p>
          )}

          {/* Meta stats */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[13px] font-medium text-chalk-muted">
            {ratingAvg > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= Math.round(ratingAvg) ? "fill-lime text-chalk" : "text-chalk-dim"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-chalk tabular-nums">{ratingAvg.toFixed(1)}</span>
                <span className="text-chalk-dim">({reviewCount})</span>
              </div>
            )}
            {enrollmentCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="font-bold text-chalk tabular-nums">
                  {enrollmentCount.toLocaleString()}
                </span>
                <span>enrolled</span>
              </div>
            )}
            {totalLessons > 0 && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-bold text-chalk tabular-nums">{totalLessons}</span>
                <span>{totalLessons === 1 ? "lesson" : "lessons"}</span>
              </div>
            )}
            {durationString && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-bold text-chalk">{durationString}</span>
                <span>of content</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-chalk">
              {levelLabel}
            </span>
            {course.category && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-chalk-muted">
                {course.category}
              </span>
            )}
            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-chalk-muted">
              {course.language === "en" ? "English" : course.language.toUpperCase()}
            </span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-chalk-muted">
              {formatLabel}
            </span>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <form action={enrollInCourse.bind(null, course.id)}>
              <Button
                type="submit"
                className="h-12 rounded-2xl bg-lime px-7 text-[14px] font-semibold text-night shadow-soft transition-all hover:bg-lime/90 active:scale-[0.98]"
              >
                {priceIsFree ? "Enroll — Start free" : `Enroll — ${formatCurrency(course.priceCents, course.currency)}`}
              </Button>
            </form>
            <div className="flex items-baseline gap-2">
              {!priceIsFree && course.compareAtCents && course.compareAtCents > course.priceCents && (
                <>
                  <span className="text-[14px] text-chalk-dim line-through tabular-nums">
                    {formatCurrency(course.compareAtCents, course.currency)}
                  </span>
                  <span className="rounded-md bg-lime px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-night">
                    {discount}% off
                  </span>
                </>
              )}
              <span className="text-[12px] text-chalk-muted">
                {course.pricingModel === "SUBSCRIPTION" ? "per month" : priceIsFree ? "Free forever" : "One-time payment"}
              </span>
            </div>
          </div>
        </div>

        {/* Trailer / poster — full-width below */}
        <div className="relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] shadow-card">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${course.title} trailer`}
            />
          ) : posterSrc ? (
            <Image src={posterSrc} alt={course.title} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper-muted via-paper-sunken to-paper-soft">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/10">
                <Play className="h-6 w-6 text-chalk" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
