import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import type { ProductCardData } from "@/components/marketplace/product-card";

export async function getFeaturedProducts(limit = 5) {
  const rows = await db.product.findMany({
    where: { status: "PUBLISHED", type: { not: "BUNDLE" } },
    include: { creator: true },
    orderBy: [{ bestSeller: "desc" }, { salesCount: "desc" }],
    take: limit,
  });
  return rows.map(toCardData);
}

export async function getProductsByCreator(
  creatorId: string,
  options?: { filter?: "featured" | "templates" | "bundles" | "best-sellers" | "new"; limit?: number },
) {
  const { filter, limit = 12 } = options ?? {};

  const where: Prisma.ProductWhereInput = {
    creatorId,
    status: "PUBLISHED",
  };
  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ salesCount: "desc" }];

  if (filter === "bundles") where.type = "BUNDLE";
  else if (filter && filter !== "featured") where.type = { not: "BUNDLE" };

  if (filter === "best-sellers") orderBy = [{ salesCount: "desc" }];
  if (filter === "new") orderBy = [{ publishedAt: "desc" }];
  if (filter === "templates") where.category = { slug: "templates" };

  const rows = await db.product.findMany({
    where,
    include: { creator: true },
    orderBy,
    take: limit,
  });
  return rows.map(toCardData);
}

export async function getRelatedProducts(productId: string, creatorId: string, limit = 4) {
  const rows = await db.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: productId },
      type: { not: "BUNDLE" },
      OR: [{ creatorId }, { ratingAvg: { gte: 4.7 } }],
    },
    include: { creator: true },
    orderBy: [{ salesCount: "desc" }],
    take: limit,
  });
  return rows.map(toCardData);
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      creator: { include: { metrics: true } },
      category: true,
      licenses: { orderBy: { priceCents: "asc" } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 6 },
      bundleItems: {
        orderBy: { position: "asc" },
        include: { product: { include: { creator: true } } },
      },
    },
  });
  if (!product) return null;

  return {
    ...product,
    gallery: parseJson<string[]>(product.gallery, []),
    included: parseJson<{ icon: string; title: string; description: string }[]>(
      product.included,
      [],
    ),
    highlights: parseJson<{ eyebrow: string; title: string; body: string }[]>(
      product.highlights,
      [],
    ),
    faq: parseJson<{ q: string; a: string }[]>(product.faq, []),
    comparison: parseJson<{
      tiers: { name: string; priceCents: number; popular?: boolean }[];
      features: { label: string; values: (boolean | string)[] }[];
    } | null>(product.comparison, null),
    licenses: product.licenses.map((l) => ({
      ...l,
      perks: parseJson<string[]>(l.perks, []),
    })),
  };
}

type RawProduct = Awaited<ReturnType<typeof db.product.findMany>>[number] & {
  creator: { displayName: string; handle: string };
};

function toCardData(p: RawProduct): ProductCardData & { id: string } {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    creatorName: p.creator.displayName,
    creatorHandle: p.creator.handle,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    ratingAvg: p.ratingAvg,
    salesCount: p.salesCount,
    bestSeller: p.bestSeller,
    instantDelivery: p.instantDelivery,
  };
}
