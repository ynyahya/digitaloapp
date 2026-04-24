import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StorefrontHero } from "@/components/creator/storefront-hero";
import { StorefrontTabs } from "@/components/creator/storefront-tabs";
import { AboutEditorial } from "@/components/creator/about-editorial";
import { CollectionsGrid } from "@/components/creator/collections-grid";
import { MembershipBlock } from "@/components/creator/membership-block";
import { Testimonials } from "@/components/marketing/testimonials";
import { BundleBanner } from "@/components/marketing/bundle-banner";
import { FinalCta } from "@/components/marketing/final-cta";
import {
  getCreatorByHandle,
  getCollectionsWithProducts,
} from "@/lib/queries/creators";
import { getProductsByCreator } from "@/lib/queries/products";
import { db } from "@/lib/db";

export const revalidate = 120;

export async function generateStaticParams() {
  const creators = await db.creator.findMany({ select: { handle: true } });
  return creators.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const creator = await getCreatorByHandle(params.handle);
  if (!creator) return {};
  return {
    title: `${creator.displayName} — Storefront`,
    description: creator.tagline ?? undefined,
  };
}

export default async function CreatorStorefrontPage({
  params,
}: {
  params: { handle: string };
}) {
  const creator = await getCreatorByHandle(params.handle);
  if (!creator) notFound();

  const [featured, templates, bundles, bestSellers, newest, collections] =
    await Promise.all([
      getProductsByCreator(creator.id, { filter: "featured", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "templates", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "bundles", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "best-sellers", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "new", limit: 8 }),
      getCollectionsWithProducts(creator.id),
    ]);

  return (
    <>
      <StorefrontHero
        creator={{
          handle: creator.handle,
          displayName: creator.displayName,
          tagline: creator.tagline,
          verified: creator.verified,
          socials: creator.socials,
          tools: creator.tools,
          metrics: creator.metrics,
        }}
      />
      <StorefrontTabs
        buckets={{
          featured,
          templates,
          bundles,
          "best-sellers": bestSellers,
          new: newest,
        }}
      />
      <BundleBanner />
      <AboutEditorial
        displayName={creator.displayName}
        bio={creator.bio}
        tools={creator.tools}
        featuredClients={creator.featuredClients}
      />
      <CollectionsGrid
        collections={collections.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          description: c.description,
          products: c.products.map((p) => ({ id: p.id })),
        }))}
        creatorHandle={creator.handle}
      />
      <MembershipBlock creatorName={creator.displayName} />
      <Testimonials />
      <FinalCta />
    </>
  );
}
