import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";

export async function getFeaturedCreators(limit = 5) {
  return db.creator.findMany({
    where: { verified: true },
    include: { metrics: true },
    orderBy: { metrics: { totalSalesCents: "desc" } },
    take: limit,
  });
}

export async function getCreatorByHandle(handle: string) {
  const creator = await db.creator.findUnique({
    where: { handle },
    include: {
      metrics: true,
      collections: {
        include: {
          items: {
            include: { collection: true },
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
  if (!creator) return null;
  return {
    ...creator,
    socials: parseJson<Record<string, string>>(creator.socials, {}),
    tools: parseJson<string[]>(creator.tools, []),
    featuredClients: parseJson<string[]>(creator.featuredClients, []),
  };
}

export async function getAllCreators(options?: {
  query?: string;
  limit?: number;
}) {
  const { query, limit = 24 } = options ?? {};
  const where: Prisma.CreatorWhereInput = {};
  if (query) {
    where.OR = [
      { displayName: { contains: query } },
      { handle: { contains: query } },
      { tagline: { contains: query } },
    ];
  }
  return db.creator.findMany({
    where,
    include: {
      metrics: true,
      _count: { select: { products: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: [{ verified: "desc" }, { metrics: { totalSalesCents: "desc" } }],
    take: limit,
  });
}

export async function getCreatorEcosystemStats() {
  const [creatorCount, verifiedCount, productCount, salesAgg] = await Promise.all([
    db.creator.count(),
    db.creator.count({ where: { verified: true } }),
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.creatorMetrics.aggregate({ _sum: { totalSalesCents: true } }),
  ]);
  return {
    creatorCount,
    verifiedCount,
    productCount,
    totalSalesCents: salesAgg._sum.totalSalesCents ?? 0,
  };
}

export async function getCollectionsWithProducts(creatorId: string) {
  const collections = await db.collection.findMany({
    where: { creatorId },
    include: {
      items: {
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  // Hydrate product mini-info per collection
  return Promise.all(
    collections.map(async (c) => {
      const products = await db.product.findMany({
        where: { id: { in: c.items.map((i) => i.productId) } },
      });
      return { ...c, products };
    }),
  );
}
