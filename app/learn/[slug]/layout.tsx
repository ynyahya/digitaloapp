import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getEnrolledCourseBySlug } from "@/lib/queries/courses";

export default async function StudentCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await getEnrolledCourseBySlug(user.id, params.slug);
  if (!course) notFound();

  return <div className="landing-theme min-h-screen bg-paper text-ink">{children}</div>;
}
