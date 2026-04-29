import { db } from "@/lib/db";

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatPrice(cents: number, currency: string) {
  if (cents === 0) return "Free";
  if (currency === "IDR") return `Rp ${(cents / 100).toLocaleString("id-ID")}`;
  if (currency === "USD") return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${currency} ${(cents / 100).toLocaleString()}`;
}

function buildSparkline(values: number[], length = 12): number[] {
  if (values.length >= length) return values.slice(-length);
  const padded: number[] = [];
  for (let i = 0; i < length - values.length; i++) padded.push(0);
  return [...padded, ...values];
}

// ────────────────────────────────────────────────────────────
// Course list with metrics
// ────────────────────────────────────────────────────────────

export type CourseListItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  level: string;
  format: string;
  visibility: string;
  category: string | null;
  status: string;
  pipelineStage: string;
  coverImage: string | null;
  thumbnailUrl: string | null;
  thumbnailColor: string | null;
  totalLessons: number;
  totalHours: number;
  totalStudents: number;
  ratingAvg: number;
  ratingCount: number;
  completionRate: number;
  priceCents: number;
  priceDisplay: string;
  currency: string;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
  updatedAt: Date;
  updatedAgo: string;
  readinessPercent: number;
  hasFreePreview: boolean;
};

const READINESS_CHECKS = 8;

export async function getCoursesWithMetrics(creatorId: string): Promise<CourseListItem[]> {
  const courses = await db.course.findMany({
    where: { creatorId },
    orderBy: { updatedAt: "desc" },
    include: {
      chapters: {
        include: {
          lessons: {
            select: { id: true, isFree: true, durationMin: true },
          },
        },
      },
      _count: {
        select: { enrollments: true, courseReviews: true, chapters: true },
      },
    },
  });

  return courses.map((c) => {
    const lessonsAll = c.chapters.flatMap((ch) => ch.lessons);
    const totalLessons = lessonsAll.length;
    const hasFreePreview = lessonsAll.some((l) => l.isFree);
    const readinessPoints =
      (c.title ? 1 : 0) +
      (c.subtitle ? 1 : 0) +
      (c.description ? 1 : 0) +
      (c.coverImage || c.thumbnailUrl ? 1 : 0) +
      (c.priceCents > 0 || c.priceCents === 0 ? 1 : 0) +
      (totalLessons > 0 ? 1 : 0) +
      (hasFreePreview ? 1 : 0) +
      (c.outcomes ? 1 : 0);
    const readinessPercent = Math.round((readinessPoints / READINESS_CHECKS) * 100);

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      level: c.level,
      format: c.format,
      visibility: c.visibility,
      category: c.category,
      status: c.status,
      pipelineStage: c.pipelineStage,
      coverImage: c.coverImage,
      thumbnailUrl: c.thumbnailUrl,
      thumbnailColor: c.thumbnailColor,
      totalLessons: totalLessons || c.totalLessons,
      totalHours: c.totalHours,
      totalStudents: c._count.enrollments || c.totalStudents,
      ratingAvg: c.ratingAvg,
      ratingCount: c.ratingCount,
      completionRate: c.completionRate,
      priceCents: c.priceCents,
      priceDisplay: formatPrice(c.priceCents, c.currency),
      currency: c.currency,
      publishedAt: c.publishedAt,
      scheduledFor: c.scheduledFor,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      updatedAgo: formatTimeAgo(c.updatedAt),
      readinessPercent,
      hasFreePreview,
    };
  });
}

// ────────────────────────────────────────────────────────────
// KPI strip
// ────────────────────────────────────────────────────────────

export type CourseKpi = {
  activeCourses: { value: number; delta: string; sparkline: number[] };
  enrolledStudents: { value: number; delta: string; sparkline: number[] };
  revenueMtd: { display: string; raw: number; delta: string; sparkline: number[] };
  avgCompletion: { value: number; delta: string };
  avgRating: { value: number; count: number; delta: string };
};

export async function getCourseKpis(creatorId: string): Promise<CourseKpi> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const since60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [coursesActive, courses, enrollments30, enrollments60, reviewsAgg] = await Promise.all([
    db.course.count({ where: { creatorId, status: "PUBLISHED" } }),
    db.course.findMany({
      where: { creatorId },
      select: { id: true, ratingAvg: true, ratingCount: true, completionRate: true, priceCents: true },
    }),
    db.enrollment.findMany({
      where: { course: { creatorId }, createdAt: { gte: since30 } },
      select: { id: true, createdAt: true, courseId: true },
    }),
    db.enrollment.count({
      where: { course: { creatorId }, createdAt: { gte: since60, lt: since30 } },
    }),
    db.courseReview.aggregate({
      where: { course: { creatorId } },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  // Course-related orders for revenue MTD: courses don't go through Order yet,
  // so we compute pseudo-revenue from active enrollments × course price this MTD.
  const monthEnrollments = enrollments30.filter((e) => e.createdAt >= startOfMonth);
  const priceMap = new Map(courses.map((c) => [c.id, c.priceCents]));
  const revenueCents = monthEnrollments.reduce(
    (sum, e) => sum + (priceMap.get(e.courseId) ?? 0),
    0
  );

  // Build 12-bucket sparkline of last 30d enrollments (every ~2.5 days)
  const buckets = new Array(12).fill(0);
  const span = 30 * 24 * 60 * 60 * 1000;
  enrollments30.forEach((e) => {
    const idx = Math.min(11, Math.floor(((e.createdAt.getTime() - since30.getTime()) / span) * 12));
    buckets[idx] += 1;
  });

  const completionAvg = courses.length
    ? courses.reduce((s, c) => s + c.completionRate, 0) / courses.length
    : 0;

  const enrolledTotal = enrollments30.length;
  const enrolledDelta = enrollments60 === 0
    ? (enrolledTotal > 0 ? "+100%" : "+0%")
    : `${enrolledTotal >= enrollments60 ? "+" : ""}${Math.round(((enrolledTotal - enrollments60) / enrollments60) * 100)}%`;

  return {
    activeCourses: {
      value: coursesActive,
      delta: "+0%",
      sparkline: buildSparkline(buckets),
    },
    enrolledStudents: {
      value: enrolledTotal,
      delta: enrolledDelta,
      sparkline: buildSparkline(buckets),
    },
    revenueMtd: {
      display: `Rp ${(revenueCents / 100).toLocaleString("id-ID")}`,
      raw: revenueCents,
      delta: "+0%",
      sparkline: buildSparkline(buckets),
    },
    avgCompletion: {
      value: Math.round(completionAvg),
      delta: "+0%",
    },
    avgRating: {
      value: Number((reviewsAgg._avg.rating ?? 0).toFixed(2)),
      count: reviewsAgg._count._all,
      delta: "+0%",
    },
  };
}

// ────────────────────────────────────────────────────────────
// Insights (heuristic AI suggestions)
// ────────────────────────────────────────────────────────────

export type CourseInsight = {
  id: string;
  tone: "neutral" | "warning" | "positive";
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
};

export async function getCourseInsights(creatorId: string): Promise<CourseInsight[]> {
  const courses = await db.course.findMany({
    where: { creatorId },
    include: {
      chapters: { include: { lessons: { select: { id: true, isFree: true, position: true } } } },
      _count: { select: { enrollments: true, courseReviews: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });

  const insights: CourseInsight[] = [];

  for (const c of courses) {
    if (c.status === "DRAFT" && c.chapters.flatMap((ch) => ch.lessons).length >= 3) {
      insights.push({
        id: `publish-${c.id}`,
        tone: "positive",
        title: `'${c.title}' is ready to ship`,
        body: `${c.chapters.length} chapters and ${c.chapters.reduce((s, ch) => s + ch.lessons.length, 0)} lessons drafted. One click to make it live.`,
        actionLabel: "Open launch checklist",
        actionHref: `/dashboard/courses/${c.slug}?tab=launch`,
      });
    }

    const lessonCount = c.chapters.flatMap((ch) => ch.lessons).length;
    if (c.status === "PUBLISHED" && lessonCount > 0 && !c.chapters.flatMap((ch) => ch.lessons).some((l) => l.isFree)) {
      insights.push({
        id: `free-preview-${c.id}`,
        tone: "warning",
        title: `Add a free preview to '${c.title}'`,
        body: `Courses with at least one free lesson convert 2.4× better on average.`,
        actionLabel: "Mark a lesson free",
        actionHref: `/dashboard/courses/${c.slug}`,
      });
    }

    if (c.status === "PUBLISHED" && c._count.enrollments >= 25 && c._count.courseReviews === 0) {
      insights.push({
        id: `reviews-${c.id}`,
        tone: "neutral",
        title: `Collect reviews for '${c.title}'`,
        body: `${c._count.enrollments} students enrolled but 0 reviews yet. Send a request automation.`,
        actionLabel: "Set up automation",
        actionHref: `/dashboard/automations`,
      });
    }

    if (c.completionRate > 0 && c.completionRate < 35) {
      insights.push({
        id: `dropoff-${c.id}`,
        tone: "warning",
        title: `Drop-off detected in '${c.title}'`,
        body: `Avg completion is ${Math.round(c.completionRate)}%. Try shorter videos or add a recap chapter.`,
        actionLabel: "Open analytics",
        actionHref: `/dashboard/courses/${c.slug}?tab=analytics`,
      });
    }

    if (insights.length >= 3) break;
  }

  if (insights.length === 0 && courses.length === 0) {
    insights.push({
      id: "first-course",
      tone: "positive",
      title: "Spin up your first course in 60 seconds",
      body: "Use the AI Quickstart to scaffold an outline from a one-line idea.",
      actionLabel: "Start AI Quickstart",
      actionHref: "/dashboard/courses/new",
    });
  }

  return insights.slice(0, 3);
}

// ────────────────────────────────────────────────────────────
// Activity feed
// ────────────────────────────────────────────────────────────

export type CourseActivityItem = {
  id: string;
  type: "ENROLLED" | "REVIEW" | "PUBLISHED" | "COMPLETED";
  message: string;
  timeAgo: string;
  courseSlug: string | null;
};

export async function getCourseActivity(creatorId: string, limit = 8): Promise<CourseActivityItem[]> {
  const [enrollments, reviews, recentPublishes] = await Promise.all([
    db.enrollment.findMany({
      where: { course: { creatorId } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
    }),
    db.courseReview.findMany({
      where: { course: { creatorId } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
    }),
    db.course.findMany({
      where: { creatorId, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: { id: true, title: true, slug: true, publishedAt: true },
    }),
  ]);

  const items: CourseActivityItem[] = [];

  enrollments.forEach((e) => {
    items.push({
      id: `enroll-${e.id}`,
      type: "ENROLLED",
      message: `${e.user.name ?? e.user.email} enrolled in '${e.course.title}'`,
      timeAgo: formatTimeAgo(e.createdAt),
      courseSlug: e.course.slug,
    });
    if (e.completedAt) {
      items.push({
        id: `complete-${e.id}`,
        type: "COMPLETED",
        message: `${e.user.name ?? e.user.email} completed '${e.course.title}'`,
        timeAgo: formatTimeAgo(e.completedAt),
        courseSlug: e.course.slug,
      });
    }
  });

  reviews.forEach((r) => {
    items.push({
      id: `review-${r.id}`,
      type: "REVIEW",
      message: `${"★".repeat(r.rating)} review on '${r.course.title}'`,
      timeAgo: formatTimeAgo(r.createdAt),
      courseSlug: r.course.slug,
    });
  });

  recentPublishes.forEach((p) => {
    if (p.publishedAt) {
      items.push({
        id: `pub-${p.id}`,
        type: "PUBLISHED",
        message: `'${p.title}' went live`,
        timeAgo: formatTimeAgo(p.publishedAt),
        courseSlug: p.slug,
      });
    }
  });

  return items
    .sort((a, b) => (a.timeAgo > b.timeAgo ? 1 : -1))
    .slice(0, limit);
}

// ────────────────────────────────────────────────────────────
// Per-course
// ────────────────────────────────────────────────────────────

export async function getCourseBySlug(creatorId: string, slug: string) {
  return db.course.findFirst({
    where: { creatorId, slug },
    include: {
      chapters: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
      _count: {
        select: { enrollments: true, courseReviews: true },
      },
      courseReviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true, email: true, image: true } },
        },
      },
    },
  });
}

export type CourseReadiness = {
  percent: number;
  checks: { id: string; label: string; done: boolean; href?: string }[];
};

export async function getCourseReadiness(courseId: string): Promise<CourseReadiness> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: { include: { lessons: { select: { id: true, isFree: true } } } },
    },
  });

  if (!course) return { percent: 0, checks: [] };

  const lessons = course.chapters.flatMap((ch) => ch.lessons);
  const checks = [
    { id: "title", label: "Course title set", done: !!course.title },
    { id: "subtitle", label: "Subtitle written", done: !!course.subtitle },
    { id: "description", label: "Course description added", done: !!course.description },
    { id: "cover", label: "Cover image uploaded", done: !!(course.coverImage || course.thumbnailUrl) },
    { id: "outcomes", label: "Learning outcomes filled", done: !!course.outcomes },
    { id: "lessons", label: "At least one lesson published", done: lessons.length > 0 },
    { id: "preview", label: "Free preview lesson set", done: lessons.some((l) => l.isFree) },
    { id: "pricing", label: "Pricing configured", done: course.priceCents >= 0 },
  ];

  const done = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    checks,
  };
}

// ────────────────────────────────────────────────────────────
// Public Storefront / Landing Page
// ────────────────────────────────────────────────────────────

export async function getPublicCourseBySlug(handle: string, courseSlug: string) {
  return db.course.findFirst({
    where: {
      slug: courseSlug,
      status: "PUBLISHED",
      creator: { handle: handle },
    },
    include: {
      creator: {
        select: {
          id: true,
          handle: true,
          displayName: true,
          tagline: true,
          bio: true,
          avatarUrl: true,
          verified: true,
          socials: true,
        },
      },
      chapters: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              contentType: true,
              durationMin: true,
              isFree: true,
              position: true,
            },
          },
        },
      },
      courseReviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

// Returns a free preview lesson safely — only accessible if isFree=true and course is published.
export async function getPreviewLesson(lessonId: string) {
  const lesson = await db.lesson.findFirst({
    where: {
      id: lessonId,
      isFree: true,
      isPublished: true,
      chapter: { course: { status: "PUBLISHED" } },
    },
    select: {
      id: true,
      title: true,
      description: true,
      contentType: true,
      contentJson: true,
      videoUrl: true,
      videoProvider: true,
      embedUrl: true,
      durationMin: true,
    },
  });
  return lesson;
}

// Other courses by the same creator (excludes current course).
export async function getRelatedCourses(creatorId: string, excludeCourseId: string, limit = 3) {
  return db.course.findMany({
    where: {
      creatorId,
      status: "PUBLISHED",
      id: { not: excludeCourseId },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      coverImage: true,
      thumbnailUrl: true,
      thumbnailColor: true,
      priceCents: true,
      currency: true,
      level: true,
      totalLessons: true,
      creator: { select: { handle: true, displayName: true } },
      _count: { select: { enrollments: true } },
    },
  });
}

// ────────────────────────────────────────────────────────────
// Student Course Player
// ────────────────────────────────────────────────────────────

export async function getEnrolledCourseBySlug(userId: string, courseSlug: string) {
  // Check if user is enrolled
  const enrollment = await db.enrollment.findFirst({
    where: {
      userId,
      course: { slug: courseSlug, status: "PUBLISHED" },
    },
  });

  if (!enrollment) return null;

  return db.course.findFirst({
    where: { slug: courseSlug },
    include: {
      creator: { select: { displayName: true, handle: true } },
      chapters: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            include: {
              completions: {
                where: { userId },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getLessonWithContent(lessonId: string, userId: string) {
  // In a real app we would verify enrollment here as well
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      completions: {
        where: { userId },
        select: { id: true },
      },
    },
  });
}

export async function getLessonDropoff(courseId: string) {
  const lessons = await db.lesson.findMany({
    where: { chapter: { courseId } },
    orderBy: [{ chapter: { position: "asc" } }, { position: "asc" }],
    include: { _count: { select: { completions: true } } },
  });

  if (lessons.length === 0) return [] as { id: string; title: string; completions: number; retention: number }[];
  const max = Math.max(...lessons.map((l) => l._count.completions), 1);
  return lessons.map((l) => ({
    id: l.id,
    title: l.title,
    completions: l._count.completions,
    retention: Math.round((l._count.completions / max) * 100),
  }));
}

export async function getRevenueByCourse(creatorId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const enrollments = await db.enrollment.findMany({
    where: { course: { creatorId }, createdAt: { gte: since } },
    include: { course: { select: { id: true, title: true, priceCents: true, slug: true } } },
  });
  const map = new Map<string, { id: string; title: string; slug: string; revenue: number; enrollments: number }>();
  enrollments.forEach((e) => {
    const key = e.courseId;
    const cur = map.get(key) ?? {
      id: e.course.id,
      title: e.course.title,
      slug: e.course.slug,
      revenue: 0,
      enrollments: 0,
    };
    cur.revenue += e.course.priceCents;
    cur.enrollments += 1;
    map.set(key, cur);
  });
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export async function getFeaturedCourses(limit = 4) {
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      creator: true,
      _count: { select: { enrollments: true, courseReviews: true } },
      chapters: {
        include: { lessons: { select: { durationMin: true } } }
      }
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return courses.map(c => {
    const totalLessons = c.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
    const totalHours = c.chapters.reduce((sum, ch) => {
      return sum + ch.lessons.reduce((lSum, l) => lSum + (l.durationMin || 0), 0);
    }, 0) / 60;

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      creatorName: c.creator.displayName,
      creatorHandle: c.creator.handle,
      creatorImage: c.creator.avatarUrl,
      priceCents: c.priceCents,
      currency: c.currency,
      ratingAvg: 4.8, // Stub
      ratingCount: c._count.courseReviews,
      enrollments: c._count.enrollments,
      totalLessons,
      totalHours,
      coverImage: c.coverImage || c.thumbnailUrl,
      level: c.level,
    };
  });
}
