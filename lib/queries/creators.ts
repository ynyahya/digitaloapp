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
