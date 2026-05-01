import type { ReadinessCheck } from "./types";

type ChapterLike = { lessons?: unknown[] };

export type CourseReadinessData = {
  title?: string | null;
  subtitle?: string | null;
  audience?: string | null;
  outcomes?: string | null;
  priceCents?: number | null;
  pricingModel?: string | null;
  coverImage?: string | null;
  trailerUrl?: string | null;
  faqJson?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  chapters?: ChapterLike[];
};

const hasText = (value?: string | null, min = 1) => Boolean(value && value.trim().length >= min);

export function getCourseReadiness(course: CourseReadinessData): ReadinessCheck[] {
  const lessons = course.chapters?.flatMap((chapter) => chapter.lessons ?? []) ?? [];
  return [
    { id: "title", label: "Course title", description: "Give the course a clear promise.", severity: "required", done: hasText(course.title, 3) && hasText(course.subtitle, 8), actionLabel: "Edit overview", targetSection: "overview" },
    { id: "audience", label: "Target audience", description: "Clarify who should enroll.", severity: "required", done: hasText(course.audience, 20), actionLabel: "Define audience", targetSection: "overview" },
    { id: "outcomes", label: "Learning outcomes", description: "List what students will be able to do.", severity: "required", done: hasText(course.outcomes, 30), actionLabel: "Add outcomes", targetSection: "overview" },
    { id: "module", label: "At least one module", description: "Create a module structure for the curriculum.", severity: "required", done: Boolean(course.chapters?.length), actionLabel: "Add module", targetSection: "curriculum" },
    { id: "lessons", label: "At least three lessons", description: "Add enough lessons to make the course credible.", severity: "required", done: lessons.length >= 3, actionLabel: "Add lessons", targetSection: "curriculum" },
    { id: "pricing", label: "Pricing", description: "Set the course pricing model.", severity: "required", done: course.pricingModel === "FREE" || Number(course.priceCents ?? 0) > 0, actionLabel: "Set pricing", targetSection: "pricing" },
    { id: "cover", label: "Course cover", description: "A strong cover improves conversion.", severity: "recommended", done: hasText(course.coverImage), actionLabel: "Add cover", targetSection: "design" },
    { id: "trailer", label: "Trailer", description: "A preview video helps students decide.", severity: "recommended", done: hasText(course.trailerUrl), actionLabel: "Add trailer", targetSection: "design" },
    { id: "seo", label: "SEO metadata", description: "Improve search and social previews.", severity: "optional", done: hasText(course.metaTitle) && hasText(course.metaDescription), actionLabel: "Add SEO", targetSection: "settings" },
  ];
}
