import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProductEditor } from "@/components/studio/product-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "New product · Digitalo" };

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/products/new");
  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) redirect("/dashboard");

  return (
    <ProductEditor
      mode="create"
      initial={{
        title: "",
        slug: "",
        tagline: "",
        description: "",
        type: "ONE_TIME",
        priceCents: 4900,
        compareAtCents: null,
        currency: "USD",
        bestSeller: false,
        instantDelivery: true,
        lifetimeUpdates: true,
        status: "DRAFT",
        licenses: [],
        included: [],
      }}
    />
  );
}
