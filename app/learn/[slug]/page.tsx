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
    <div className="landing-theme fixed inset-0 z-[100] bg-night flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-xl font-bold text-chalk mb-2">No lessons available</h2>
      <p className="text-chalk-muted text-sm">This course doesn&apos;t have any published lessons yet.</p>
    </div>
  );
}
