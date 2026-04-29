import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HeroShowcase } from "@/components/product/hero-showcase";
import { PurchaseRail } from "@/components/product/purchase-rail";
import { IncludedGrid } from "@/components/product/included-grid";
import { StorytellingPanels } from "@/components/product/storytelling-panels";
import { ComparisonMatrix } from "@/components/product/comparison-matrix";
import { ReviewsSection } from "@/components/product/reviews-section";
import { CreatorMiniCard } from "@/components/product/creator-card";
import { FaqSection } from "@/components/product/faq-section";
import { RelatedProducts } from "@/components/product/related-products";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { sanitizeHtml } from "@/lib/utils";
import { db } from "@/lib/db";

export const revalidate = 120;

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.tagline ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.creatorId, 4);

  const bundleCta = product.bundleItems.length === 0
    ? await (async () => {
        const bundle = await db.product.findFirst({
          where: {
            status: "PUBLISHED",
            type: "BUNDLE",
            creatorId: product.creatorId,
            bundleItems: { some: { productId: product.id } },
          },
        });
        return bundle
          ? { title: bundle.title, priceCents: bundle.priceCents, slug: bundle.slug }
          : undefined;
      })()
    : undefined;

  return (
    <>
      <HeroShowcase
        product={{
          title: product.title,
          tagline: product.tagline,
          category: product.category,
          ratingAvg: product.ratingAvg,
          ratingCount: product.ratingCount,
          salesCount: product.salesCount,
          bestSeller: product.bestSeller,
        }}
        creator={{
          handle: product.creator.handle,
          displayName: product.creator.displayName,
          verified: product.creator.verified,
        }}
      />

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            {product.description && (
              <div className="prose-mono">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  Overview
                </p>
                <div
                  className="mt-4 prose prose-neutral prose-p:text-[17px] prose-p:leading-[1.7] prose-p:text-ink prose-headings:text-ink prose-headings:font-bold prose-strong:text-ink prose-em:text-ink-muted prose-li:text-ink prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-a:text-ink prose-a:underline prose-a:underline-offset-4 prose-a:font-semibold max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>
            )}
          </div>
          <div id="purchase-rail" className="lg:sticky lg:top-24 lg:self-start">
            <PurchaseRail
              product={{
                id: product.id,
                slug: product.slug,
                title: product.title,
                priceCents: product.priceCents,
                compareAtCents: product.compareAtCents,
                instantDelivery: product.instantDelivery,
                lifetimeUpdates: product.lifetimeUpdates,
                coverImage: product.coverImage,
                creatorId: product.creatorId,
              }}
              licenses={product.licenses.map((l) => ({
                id: l.id,
                name: l.name,
                priceCents: l.priceCents,
                description: l.description,
                perks: l.perks,
              }))}
              bundleCta={bundleCta}
            />
          </div>
        </div>
      </section>

      <IncludedGrid items={product.included} />
      <StorytellingPanels panels={product.highlights} />
      <ComparisonMatrix comparison={product.comparison} />
      <ReviewsSection
        ratingAvg={product.ratingAvg}
        ratingCount={product.ratingCount}
        reviews={product.reviews}
      />
      <CreatorMiniCard
        creator={{
          handle: product.creator.handle,
          displayName: product.creator.displayName,
          tagline: product.creator.tagline,
          verified: product.creator.verified,
          metrics: product.creator.metrics,
        }}
      />
      <FaqSection items={product.faq} />
      <RelatedProducts products={related} />
    </>
  );
}
