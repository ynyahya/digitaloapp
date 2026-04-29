import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries/products";
import { CheckoutContent } from "@/components/checkout/checkout-content";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { product?: string; license?: string };
}) {
  let initialProduct = null;

  if (searchParams.product) {
    const product = await getProductBySlug(searchParams.product);
    if (!product) notFound();

    const selectedLicense = product.licenses.find(l => l.id === searchParams.license) || product.licenses[0];
    
    initialProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      priceCents: selectedLicense ? selectedLicense.priceCents : product.priceCents,
      coverImage: product.coverImage || null,
      licenseId: selectedLicense?.id || "",
      licenseName: selectedLicense?.name || "Standard License",
      creatorId: product.creatorId,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
      bestSeller: product.bestSeller,
    };
  }

  return <CheckoutContent initialProduct={initialProduct || undefined} />;
}
