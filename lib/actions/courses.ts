"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireCreator } from "@/lib/auth/session";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function makeUniqueSlug(base: string) {
  return `${base || "course"}-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(-4)}`;
}

const COURSE_META_FIELDS = [
  "title", "subtitle", "description", "level", "category",
  "language", "format", "visibility", "pricingModel",
  "priceCents", "compareAtCents", "currency",
  "coverImage", "thumbnailUrl", "thumbnailColor", "trailerUrl", "trailerPoster",
  "whatYouLearn", "outcomes", "requirements",
  "audience", "faqJson", "guarantees",
  "metaTitle", "metaDescription",
] as const;

type AllowedMeta = (typeof COURSE_META_FIELDS)[number];

function pickMeta(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of COURSE_META_FIELDS) {
    if (key in input) {
      const k = key as AllowedMeta;
      const v = input[k];
      if (v !== undefined) out[k] = v;
    }
  }
  return out;
}

// ────────────────────────────────────────────────────────────
// Quickstart create (3-step wizard)
// ────────────────────────────────────────────────────────────

export async function createCourseQuickstart(data: {
  title: string;
  audience?: string | null;
  subtitle?: string | null;
  outcomes?: string | null;
  level?: string;
  language?: string;
  format?: string;
  pricingModel?: string;
  priceCents?: number;
  currency?: string;
  outline?: { title: string; lessons: { title: string; contentType?: string }[] }[];
  coverImage?: string | null;
  thumbnailColor?: string | null;
  category?: string | null;
  visibility?: string;
}) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  if (!data.title.trim()) throw new Error("Title required");

  const baseSlug = slugify(data.title);
  const slug = makeUniqueSlug(baseSlug);

  const course = await db.course.create({
    data: {
      creatorId: creator.id,
      slug,
      title: data.title.trim(),
      subtitle: data.subtitle || null,
      level: data.level || "BEGINNER",
      language: data.language || "en",
      format: data.format || "SELF_PACED",
      visibility: data.visibility || "PUBLIC",
      pricingModel: data.pricingModel || "ONE_TIME",
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      coverImage: data.coverImage || null,
      thumbnailColor: data.thumbnailColor || null,
      category: data.category || null,
      audience: data.audience || null,
      outcomes: data.outcomes || null,
      pipelineStage: "OUTLINING",
    },
  });

  if (data.outline && data.outline.length > 0) {
    let chapterPos = 0;
    for (const chapter of data.outline) {
      const created = await db.chapter.create({
        data: {
          courseId: course.id,
          title: chapter.title || `Chapter ${chapterPos + 1}`,
          position: chapterPos,
        },
      });
      let lessonPos = 0;
      for (const lesson of chapter.lessons || []) {
        await db.lesson.create({
          data: {
            chapterId: created.id,
            title: lesson.title || `Lesson ${lessonPos + 1}`,
            contentType: lesson.contentType || "TEXT",
            position: lessonPos,
            isPublished: false,
          },
        });
        lessonPos += 1;
      }
      chapterPos += 1;
    }
    const totalLessons = data.outline.reduce((s, ch) => s + (ch.lessons?.length || 0), 0);
    await db.course.update({
      where: { id: course.id },
      data: { totalLessons },
    });
  }

  revalidatePath("/dashboard/courses");
  return course;
}

// ────────────────────────────────────────────────────────────
// Meta update — full schema, used by overview/settings/marketing
// ────────────────────────────────────────────────────────────

export async function updateCourseMeta(
  courseId: string,
  data: Record<string, unknown>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const existing = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
    select: { id: true, slug: true },
  });
  if (!existing) throw new Error("Course not found");

  const sanitized = pickMeta(data);

  const updated = await db.course.update({
    where: { id: courseId },
    data: sanitized,
  });

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${updated.slug}`);
  return updated;
}

// ────────────────────────────────────────────────────────────
// Pipeline stage (kanban)
// ────────────────────────────────────────────────────────────

export async function setPipelineStage(courseId: string, stage: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const allowed = ["IDEA", "OUTLINING", "RECORDING", "EDITING", "READY", "LIVE", "ARCHIVED"];
  if (!allowed.includes(stage)) throw new Error("Invalid stage");

  await db.course.updateMany({
    where: { id: courseId, creatorId: creator.id },
    data: { pipelineStage: stage },
  });

  revalidatePath("/dashboard/courses");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Publish / Schedule / Archive
// ────────────────────────────────────────────────────────────

export async function publishCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.update({
    where: { id: courseId },
    data: {
      status: "PUBLISHED",
      pipelineStage: "LIVE",
      publishedAt: new Date(),
      scheduledFor: null,
    },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${course.slug}`);
  return course;
}

export async function unpublishCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.update({
    where: { id: courseId },
    data: { status: "DRAFT", pipelineStage: "READY" },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${course.slug}`);
  return course;
}

export async function scheduleCourse(courseId: string, when: Date) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.update({
    where: { id: courseId },
    data: {
      status: "SCHEDULED",
      pipelineStage: "READY",
      scheduledFor: when,
    },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${course.slug}`);
  return course;
}

export async function archiveCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.update({
    where: { id: courseId },
    data: { status: "ARCHIVED", pipelineStage: "ARCHIVED" },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${course.slug}`);
  return course;
}

export async function unarchiveCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.update({
    where: { id: courseId },
    data: { status: "DRAFT", pipelineStage: "READY" },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${course.slug}`);
  return course;
}

export async function deleteCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  await db.course.deleteMany({
    where: { id: courseId, creatorId: creator.id },
  });

  revalidatePath("/dashboard/courses");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Duplicate
// ────────────────────────────────────────────────────────────

export async function duplicateCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const source = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
    include: { chapters: { include: { lessons: true } } },
  });
  if (!source) throw new Error("Course not found");

  const baseSlug = slugify(`${source.title}-copy`);
  const slug = makeUniqueSlug(baseSlug);

  const created = await db.course.create({
    data: {
      creatorId: creator.id,
      slug,
      title: `${source.title} (Copy)`,
      subtitle: source.subtitle,
      description: source.description,
      level: source.level,
      category: source.category,
      language: source.language,
      format: source.format,
      visibility: "PRIVATE",
      pricingModel: source.pricingModel,
      priceCents: source.priceCents,
      compareAtCents: source.compareAtCents,
      currency: source.currency,
      status: "DRAFT",
      pipelineStage: "OUTLINING",
      coverImage: source.coverImage,
      thumbnailUrl: source.thumbnailUrl,
      thumbnailColor: source.thumbnailColor,
      trailerUrl: source.trailerUrl,
      whatYouLearn: source.whatYouLearn,
      outcomes: source.outcomes,
      requirements: source.requirements,
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      totalLessons: source.totalLessons,
      totalHours: source.totalHours,
    },
  });

  for (const chapter of source.chapters) {
    const newChapter = await db.chapter.create({
      data: {
        courseId: created.id,
        title: chapter.title,
        position: chapter.position,
      },
    });
    for (const lesson of chapter.lessons) {
      await db.lesson.create({
        data: {
          chapterId: newChapter.id,
          title: lesson.title,
          description: lesson.description,
          contentType: lesson.contentType,
          contentJson: lesson.contentJson,
          videoUrl: lesson.videoUrl,
          videoProvider: lesson.videoProvider,
          documentUrl: lesson.documentUrl,
          quizJson: lesson.quizJson,
          codeConfig: lesson.codeConfig,
          embedUrl: lesson.embedUrl,
          assignmentBrief: lesson.assignmentBrief,
          attachments: lesson.attachments,
          transcript: lesson.transcript,
          prerequisiteIds: lesson.prerequisiteIds,
          position: lesson.position,
          durationMin: lesson.durationMin,
          dripDays: lesson.dripDays,
          isFree: lesson.isFree,
          isPublished: false,
        },
      });
    }
  }

  revalidatePath("/dashboard/courses");
  return created;
}

// ────────────────────────────────────────────────────────────
// Reorder chapter / lesson via dnd-kit
// ────────────────────────────────────────────────────────────

export async function reorderCurriculum(
  courseId: string,
  payload: {
    chapters: { id: string; position: number; lessons: { id: string; position: number; chapterId: string }[] }[];
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
    select: { id: true, slug: true },
  });
  if (!course) throw new Error("Course not found");

  await db.$transaction([
    ...payload.chapters.map((ch) =>
      db.chapter.updateMany({
        where: { id: ch.id, courseId: course.id },
        data: { position: ch.position },
      })
    ),
    ...payload.chapters.flatMap((ch) =>
      ch.lessons.map((l) =>
        db.lesson.updateMany({
          where: { id: l.id },
          data: { position: l.position, chapterId: l.chapterId },
        })
      )
    ),
  ]);

  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${course.slug}`);
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Quiz CRUD
// ────────────────────────────────────────────────────────────

export async function upsertQuiz(
  lessonId: string,
  data: {
    passingScore?: number;
    randomize?: boolean;
    allowRetake?: boolean;
    timeLimitMin?: number | null;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });
  if (!lesson || lesson.chapter.course.creatorId !== creator.id) throw new Error("Lesson not found");

  const quiz = await db.quiz.upsert({
    where: { lessonId },
    create: {
      lessonId,
      passingScore: data.passingScore ?? 70,
      randomize: data.randomize ?? false,
      allowRetake: data.allowRetake ?? true,
      timeLimitMin: data.timeLimitMin ?? null,
    },
    update: {
      passingScore: data.passingScore ?? undefined,
      randomize: data.randomize ?? undefined,
      allowRetake: data.allowRetake ?? undefined,
      timeLimitMin: data.timeLimitMin ?? undefined,
    },
  });

  revalidatePath(`/dashboard/courses/${lesson.chapter.course.slug}`);
  return quiz;
}

export async function addQuizQuestion(
  quizId: string,
  data: {
    type?: string;
    prompt: string;
    options?: string[];
    correct?: string[] | number[];
    explanation?: string | null;
    points?: number;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { lesson: { include: { chapter: { include: { course: true } } } } },
  });
  if (!quiz || quiz.lesson.chapter.course.creatorId !== creator.id) throw new Error("Quiz not found");

  const max = await db.quizQuestion.aggregate({
    where: { quizId },
    _max: { position: true },
  });

  const created = await db.quizQuestion.create({
    data: {
      quizId,
      type: data.type || "MULTIPLE_CHOICE",
      prompt: data.prompt,
      optionsJson: data.options ? JSON.stringify(data.options) : null,
      correctJson: data.correct ? JSON.stringify(data.correct) : null,
      explanation: data.explanation ?? null,
      points: data.points ?? 1,
      position: (max._max.position ?? -1) + 1,
    },
  });

  revalidatePath(`/dashboard/courses/${quiz.lesson.chapter.course.slug}`);
  return created;
}

export async function updateQuizQuestion(
  questionId: string,
  data: {
    type?: string;
    prompt?: string;
    options?: string[];
    correct?: string[] | number[];
    explanation?: string | null;
    points?: number;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const q = await db.quizQuestion.findUnique({
    where: { id: questionId },
    include: { quiz: { include: { lesson: { include: { chapter: { include: { course: true } } } } } } },
  });
  if (!q || q.quiz.lesson.chapter.course.creatorId !== creator.id) throw new Error("Question not found");

  const updated = await db.quizQuestion.update({
    where: { id: questionId },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.prompt !== undefined && { prompt: data.prompt }),
      ...(data.options !== undefined && { optionsJson: JSON.stringify(data.options) }),
      ...(data.correct !== undefined && { correctJson: JSON.stringify(data.correct) }),
      ...(data.explanation !== undefined && { explanation: data.explanation }),
      ...(data.points !== undefined && { points: data.points }),
    },
  });

  revalidatePath(`/dashboard/courses/${q.quiz.lesson.chapter.course.slug}`);
  return updated;
}

export async function deleteQuizQuestion(questionId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const q = await db.quizQuestion.findUnique({
    where: { id: questionId },
    include: { quiz: { include: { lesson: { include: { chapter: { include: { course: true } } } } } } },
  });
  if (!q || q.quiz.lesson.chapter.course.creatorId !== creator.id) throw new Error("Question not found");

  await db.quizQuestion.delete({ where: { id: questionId } });
  revalidatePath(`/dashboard/courses/${q.quiz.lesson.chapter.course.slug}`);
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Lesson advanced fields
// ────────────────────────────────────────────────────────────

const LESSON_ADVANCED_FIELDS = [
  "title", "description", "contentType",
  "contentJson", "videoUrl", "videoProvider", "documentUrl",
  "quizJson", "codeConfig", "embedUrl",
  "liveSessionUrl", "assignmentBrief",
  "attachments", "transcript", "prerequisiteIds",
  "durationMin", "dripDays",
  "isFree", "isPublished",
] as const;

export async function updateLessonAdvanced(
  lessonId: string,
  data: Record<string, unknown>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });
  if (!lesson || lesson.chapter.course.creatorId !== creator.id) throw new Error("Lesson not found");

  const sanitized: Record<string, unknown> = {};
  for (const key of LESSON_ADVANCED_FIELDS) {
    if (key in data) {
      const v = data[key];
      if (v !== undefined) sanitized[key] = v;
    }
  }
  if ("liveSessionAt" in data) {
    const v = data["liveSessionAt"];
    sanitized["liveSessionAt"] = v ? new Date(v as string | number | Date) : null;
  }

  const updated = await db.lesson.update({
    where: { id: lessonId },
    data: sanitized,
  });

  revalidatePath(`/dashboard/courses/${lesson.chapter.course.slug}`);
  return updated;
}

// ────────────────────────────────────────────────────────────
// Demo enrollment (for testing analytics; safe in dev)
// ────────────────────────────────────────────────────────────

export async function seedDemoEnrollments(courseId: string, count = 5) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");
  const course = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
  });
  if (!course) throw new Error("Course not found");

  const users = await db.user.findMany({ take: count });
  for (const u of users) {
    await db.enrollment.upsert({
      where: { userId_courseId: { userId: u.id, courseId } },
      create: {
        userId: u.id,
        courseId,
        progressPercent: Math.floor(Math.random() * 100),
      },
      update: {},
    });
  }
  await db.course.update({
    where: { id: courseId },
    data: { totalStudents: { increment: users.length } },
  });
  revalidatePath("/dashboard/courses");
  return { success: true, count: users.length };
}

// ────────────────────────────────────────────────────────────
// Create Chapter and Lesson
// ────────────────────────────────────────────────────────────

export async function createChapter(courseId: string, title: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.creatorId !== creator.id) {
    throw new Error("Course not found or unauthorized");
  }

  const maxPosition = await db.chapter.aggregate({
    where: { courseId },
    _max: { position: true },
  });

  const newPosition = (maxPosition._max.position ?? -1) + 1;

  const chapter = await db.chapter.create({
    data: {
      courseId,
      title,
      position: newPosition,
    },
    include: {
      lessons: true,
    }
  });

  revalidatePath(`/dashboard/courses/${course.slug}`);
  return chapter;
}

export async function createLesson(chapterId: string, title: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });

  if (!chapter || chapter.course.creatorId !== creator.id) {
    throw new Error("Chapter not found or unauthorized");
  }

  const maxPosition = await db.lesson.aggregate({
    where: { chapterId },
    _max: { position: true },
  });

  const newPosition = (maxPosition._max.position ?? -1) + 1;

  const lesson = await db.lesson.create({
    data: {
      chapterId,
      title,
      position: newPosition,
      isPublished: false,
    },
  });

  revalidatePath(`/dashboard/courses/${chapter.course.slug}`);
  return lesson;
}

export async function renameChapter(chapterId: string, title: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });

  if (!chapter || chapter.course.creatorId !== creator.id) {
    throw new Error("Chapter not found or unauthorized");
  }

  const updated = await db.chapter.update({
    where: { id: chapterId },
    data: { title },
  });

  revalidatePath(`/dashboard/courses/${chapter.course.slug}`);
  return updated;
}

export async function renameLesson(lessonId: string, title: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });

  if (!lesson || lesson.chapter.course.creatorId !== creator.id) {
    throw new Error("Lesson not found or unauthorized");
  }

  const updated = await db.lesson.update({
    where: { id: lessonId },
    data: { title },
  });

  revalidatePath(`/dashboard/courses/${lesson.chapter.course.slug}`);
  return updated;
}

export async function toggleCourseStatus(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.creatorId !== creator.id) {
    throw new Error("Course not found or unauthorized");
  }

  const newStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  const updated = await db.course.update({
    where: { id: courseId },
    data: { status: newStatus },
  });

  revalidatePath(`/dashboard/courses/${course.slug}`);
  return updated;
}

// ────────────────────────────────────────────────────────────
// Delete Chapter / Lesson
// ────────────────────────────────────────────────────────────

export async function deleteChapter(chapterId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter || chapter.course.creatorId !== creator.id) throw new Error("Chapter not found");

  await db.chapter.delete({ where: { id: chapterId } });
  revalidatePath(`/dashboard/courses/${chapter.course.slug}`);
  return { success: true };
}

export async function deleteLesson(lessonId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });
  if (!lesson || lesson.chapter.course.creatorId !== creator.id) throw new Error("Lesson not found");

  await db.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/dashboard/courses/${lesson.chapter.course.slug}`);
  return { success: true };
}
