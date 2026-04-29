import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getEnrolledCourseBySlug } from "@/lib/queries/courses";

export default async function StudentCourseRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await getEnrolledCourseBySlug(user.id, params.slug);
  if (!course) redirect("/dashboard");

  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter?.lessons[0];

  if (firstLesson) {
    redirect(`/learn/${course.slug}/lesson/${firstLesson.id}`);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-xl font-bold text-white/80 mb-2">No lessons available</h2>
      <p className="text-white/40 text-sm">This course doesn&apos;t have any published lessons yet.</p>
    </div>
  );
}
