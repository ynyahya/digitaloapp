import { redirect } from "next/navigation";

export default function LegacyServiceBuilderRoute({ params }: { params: { slug: string } }) {
  redirect(`/dashboard/services/${encodeURIComponent(params.slug)}/builder`);
}
