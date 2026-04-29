import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireCreator } from "@/lib/auth/session";
import { CourseStudioWrapper } from "./_components/course-studio-wrapper";

export default async function CourseBuilderLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const creator = await requireCreator();
  if (!creator) return redirect("/login");

  const course = await db.course.findFirst({
    where: { slug: params.slug, creatorId: creator.id },
    include: { creator: { select: { handle: true } } },
  });

  if (!course) return redirect("/dashboard/courses");

  const courseWithHandle = { ...course, creatorHandle: course.creator.handle };

  const chapters = await db.chapter.findMany({
    where: { courseId: course.id },
    orderBy: { position: "asc" },
    include: {
      lessons: {
        orderBy: { position: "asc" },
      },
    },
  });

  return (
    <CourseStudioWrapper course={courseWithHandle as any} chapters={chapters as any}>
      {children}
    </CourseStudioWrapper>
  );
}
