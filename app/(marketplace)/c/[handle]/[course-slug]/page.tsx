import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getPublicCourseBySlug, getRelatedCourses } from "@/lib/queries/courses";
import { CourseSubnav } from "./_components/course-subnav";
import { CourseHero } from "./_components/course-hero";
import { CourseOutcomes } from "./_components/course-outcomes";
import { CourseAudience } from "./_components/course-audience";
import { CourseCurriculum } from "./_components/course-curriculum";
import { CourseAbout } from "./_components/course-about";
import { CourseInstructor } from "./_components/course-instructor";
import { CourseReviews } from "./_components/course-reviews";
import { CourseFaq } from "./_components/course-faq";
import { CoursePricingFinal } from "./_components/course-pricing-final";
import { CourseRelated } from "./_components/course-related";
import { parseList, parseFaq } from "./_components/course-helpers";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { handle: string; "course-slug": string };
}): Promise<Metadata> {
  const course = await getPublicCourseBySlug(params.handle, params["course-slug"]);
  if (!course) return {};
  return {
    title: course.metaTitle || course.title,
    description:
      course.metaDescription ||
      course.subtitle ||
      course.description?.slice(0, 160) ||
      undefined,
    openGraph:
      course.coverImage || course.thumbnailUrl
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

  // Derived stats
  const totalLessons = course.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
  const totalMinutes = course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.reduce((s, l) => s + (l.durationMin || 0), 0),
    0,
  );
  const ratingAvg =
    course.courseReviews.length > 0
      ? course.courseReviews.reduce((s, r) => s + r.rating, 0) / course.courseReviews.length
      : 0;
  const reviewCount = course.courseReviews.length;
  const enrollmentCount = course._count.enrollments;

  // Related & instructor extras (parallel)
  const [relatedCourses, instructorCourseCount] = await Promise.all([
    getRelatedCourses(course.creator.id, course.id, 3),
    db.course.count({ where: { creatorId: course.creator.id, status: "PUBLISHED" } }),
  ]);

  // Determine which sections have content (for sub-nav)
  const outcomesItems = parseList(course.whatYouLearn);
  const audienceItems = parseList(course.audience);
  const faqItems = parseFaq(course.faqJson);
  const hasCurriculum = totalLessons > 0;
  const hasReviews = course.courseReviews.length > 0;

  const availableSectionIds = [
    "overview",
    ...(hasCurriculum ? ["curriculum"] : []),
    "instructor",
    ...(hasReviews ? ["reviews"] : []),
    ...(faqItems.length > 0 ? ["faq"] : []),
  ];

  return (
    <div className="min-h-screen bg-paper">
      <CourseSubnav
        courseId={course.id}
        title={course.title}
        priceCents={course.priceCents}
        currency={course.currency}
        availableSectionIds={availableSectionIds}
      />

      <CourseHero
        course={course}
        totalLessons={totalLessons}
        totalMinutes={totalMinutes}
        ratingAvg={ratingAvg}
        reviewCount={reviewCount}
        enrollmentCount={enrollmentCount}
      />

      {outcomesItems.length > 0 && <CourseOutcomes whatYouLearn={course.whatYouLearn} />}

      {audienceItems.length > 0 && <CourseAudience audience={course.audience} />}

      <CourseCurriculum
        chapters={course.chapters}
        courseId={course.id}
        priceCents={course.priceCents}
        currency={course.currency}
        totalLessons={totalLessons}
        totalMinutes={totalMinutes}
      />

      <CourseAbout description={course.description} requirements={course.requirements} />

      <CourseInstructor
        creator={course.creator}
        enrollmentCount={enrollmentCount}
        courseCount={instructorCourseCount}
      />

      {hasReviews && (
        <CourseReviews reviews={course.courseReviews} ratingAvg={ratingAvg} />
      )}

      {faqItems.length > 0 && <CourseFaq faqJson={course.faqJson} />}

      <CoursePricingFinal
        courseId={course.id}
        priceCents={course.priceCents}
        compareAtCents={course.compareAtCents}
        currency={course.currency}
        pricingModel={course.pricingModel}
        guarantees={course.guarantees}
        totalLessons={totalLessons}
      />

      <CourseRelated courses={relatedCourses} creatorName={course.creator.displayName} />
    </div>
  );
}
