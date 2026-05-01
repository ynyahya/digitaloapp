"use client";

import { ReactNode, useEffect } from "react";
import { CourseStudioProvider, useCourseStudio, StudioCourse, StudioChapter } from "@/hooks/use-course-studio";
import { BuilderHeader } from "./builder-header";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function CourseStudioWrapper({
  course,
  chapters,
  children,
}: {
  course: StudioCourse;
  chapters: StudioChapter[];
  children: ReactNode;
}) {
  return (
    <CourseStudioProvider initialCourse={course} initialChapters={chapters}>
      <div className="fixed inset-0 z-50 bg-night text-chalk flex flex-col font-sans">
        <BuilderHeader />
        <div className="flex-1 overflow-hidden flex">{children}</div>
      </div>
    </CourseStudioProvider>
  );
}
