"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireCreator } from "@/lib/auth/session";

// ────────────────────────────────────────────────────────────
// Chapters
// ────────────────────────────────────────────────────────────

export async function createChapter(courseId: string, data: { title: string; position?: number }) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
  });
  if (!course) throw new Error("Course not found");

  const maxPosition = await db.chapter.aggregate({
    where: { courseId },
    _max: { position: true },
  });
  const nextPos = data.position ?? (maxPosition._max.position ?? -1) + 1;

  const chapter = await db.chapter.create({
    data: {
      courseId,
      title: data.title,
      position: nextPos,
    },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return chapter;
}

export async function updateChapter(chapterId: string, data: { title?: string; position?: number }) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({ where: { id: chapterId }, include: { course: true } });
  if (!chapter || chapter.course.creatorId !== creator.id) throw new Error("Chapter not found");

  const updated = await db.chapter.update({
    where: { id: chapterId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.position !== undefined && { position: data.position }),
    },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return updated;
}

export async function deleteChapter(chapterId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({ where: { id: chapterId }, include: { course: true } });
  if (!chapter || chapter.course.creatorId !== creator.id) throw new Error("Chapter not found");

  await db.chapter.delete({ where: { id: chapterId } });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return { success: true };
}

export async function reorderChapters(courseId: string, orderedIds: string[]) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
  });
  if (!course) throw new Error("Course not found");

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.chapter.updateMany({
        where: { id, courseId },
        data: { position: index },
      })
    )
  );

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Lessons
// ────────────────────────────────────────────────────────────

export async function createLesson(
  chapterId: string,
  data: {
    title: string;
    description?: string | null;
    contentType?: string;
    position?: number;
    isFree?: boolean;
    durationMin?: number | null;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter || chapter.course.creatorId !== creator.id) throw new Error("Chapter not found");

  const maxPosition = await db.lesson.aggregate({
    where: { chapterId },
    _max: { position: true },
  });
  const nextPos = data.position ?? (maxPosition._max.position ?? -1) + 1;

  const lesson = await db.lesson.create({
    data: {
      chapterId,
      title: data.title,
      description: data.description || null,
      contentType: data.contentType || "TEXT",
      position: nextPos,
      isFree: data.isFree ?? false,
      durationMin: data.durationMin ?? null,
    },
  });

  // Update course totalLessons count
  await db.course.update({
    where: { id: chapter.courseId },
    data: { totalLessons: { increment: 1 } },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return lesson;
}

export async function updateLesson(lessonId: string, data: Record<string, string | number | boolean | null>) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });
  if (!lesson || lesson.chapter.course.creatorId !== creator.id) throw new Error("Lesson not found");

  const allowed = [
    "title", "description", "contentType", "contentJson",
    "videoUrl", "documentUrl", "quizJson", "codeConfig",
    "position", "durationMin", "isFree",
  ];
  const sanitized: Record<string, string | number | boolean | null> = {};
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const updated = await db.lesson.update({
    where: { id: lessonId },
    data: sanitized,
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return updated;
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

  // Update course totalLessons count
  await db.course.update({
    where: { id: lesson.chapter.courseId },
    data: { totalLessons: { decrement: 1 } },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return { success: true };
}

export async function reorderLessons(chapterId: string, orderedIds: string[]) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });
  if (!chapter || chapter.course.creatorId !== creator.id) throw new Error("Chapter not found");

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.lesson.updateMany({
        where: { id, chapterId },
        data: { position: index },
      })
    )
  );

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return { success: true };
}

export async function updateLessonContent(
  lessonId: string,
  data: {
    contentJson?: string | null;
    videoUrl?: string | null;
    documentUrl?: string | null;
    quizJson?: string | null;
    codeConfig?: string | null;
    durationMin?: number | null;
    description?: string | null;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });
  if (!lesson || lesson.chapter.course.creatorId !== creator.id) throw new Error("Lesson not found");

  const updated = await db.lesson.update({
    where: { id: lessonId },
    data: {
      ...(data.contentJson !== undefined && { contentJson: data.contentJson }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.documentUrl !== undefined && { documentUrl: data.documentUrl }),
      ...(data.quizJson !== undefined && { quizJson: data.quizJson }),
      ...(data.codeConfig !== undefined && { codeConfig: data.codeConfig }),
      ...(data.durationMin !== undefined && { durationMin: data.durationMin }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/courses/builder");
  return updated;
}
