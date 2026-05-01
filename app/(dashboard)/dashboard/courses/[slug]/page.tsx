import { redirect } from "next/navigation";

export default function CourseCanonicalPage({ params }: { params: { slug: string } }) {
  redirect(`/dashboard/courses/${params.slug}/builder`);
}
