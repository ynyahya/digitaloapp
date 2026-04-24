import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProductEditor } from "@/components/studio/product-editor";
import { parseJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const p = await db.product.findUnique({
    where: { id: params.id },
    select: { title: true },
  });
  return { title: p ? `${p.title} · Studio` : "Edit product · Digitalo" };
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id)
    redirect(`/login?callbackUrl=/dashboard/products/${params.id}`);

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) redirect("/dashboard");

  const product = await db.product.findFirst({
    where: { id: params.id, creatorId: creator.id },
    include: { licenses: { orderBy: { priceCents: "asc" } } },
  });
  if (!product) notFound();

  return (
    <ProductEditor
      mode="edit"
      initial={{
        id: product.id,
        title: product.title,
        slug: product.slug,
        tagline: product.tagline ?? "",
        description: product.description ?? "",
        type: product.type as "ONE_TIME" | "SUBSCRIPTION" | "BUNDLE",
        priceCents: product.priceCents,
        compareAtCents: product.compareAtCents,
        currency: product.currency,
        bestSeller: product.bestSeller,
        instantDelivery: product.instantDelivery,
        lifetimeUpdates: product.lifetimeUpdates,
        status: product.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        licenses: product.licenses.map((l) => ({
          id: l.id,
          name: l.name,
          priceCents: l.priceCents,
          description: l.description ?? "",
          perks: parseJson<string[]>(l.perks, []),
        })),
        included: parseJson<{ title: string; description: string }[]>(
          product.included,
          [],
        ).map((i) => ({ title: i.title, description: i.description ?? "" })),
      }}
    />
  );
}
