import { redirect } from "next/navigation";

export default function LegacyProductStudioPage({
  searchParams,
}: {
  searchParams: { slug?: string; new?: string };
}) {
  if (searchParams.slug) redirect(`/dashboard/products/${searchParams.slug}/builder`);
  if (searchParams.new === "1") redirect("/dashboard/create");
  redirect("/dashboard/products");
}
