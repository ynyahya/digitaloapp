"use client";

import { useCourseStudio } from "@/hooks/use-course-studio";
import { CurriculumSidebar } from "./_components/curriculum-sidebar";
import { LessonCanvas } from "./_components/lesson-canvas";
import { ContextPanel } from "./_components/context-panel";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/lib/actions/courses";

export default function CourseBuilderPage() {
  const { state, course } = useCourseStudio();
  const router = useRouter();

  const handleDeleteCourse = async () => {
    if (!confirm(`Permanently delete "${course.title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(course.id);
      router.push("/dashboard/courses");
    } catch (e) {
      console.error(e);
    }
  };

  const showBuilder = state.activeTab === "curriculum";

  return (
    <div className="flex h-full w-full bg-[#fbfbfc] text-ink overflow-hidden">
      <CurriculumSidebar />
      <LessonCanvas />
      <ContextPanel />
    </div>
  );
}
