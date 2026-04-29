import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HeroShowcase } from "@/components/product/hero-showcase";
import { PurchaseRail } from "@/components/product/purchase-rail";
import { ProductSubnav } from "@/components/product/product-subnav";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductOverview } from "@/components/product/product-overview";
import { ProductInventory } from "@/components/product/product-inventory";
import { ProductTechStack } from "@/components/product/product-tech-stack";
import { ProductDemoEmbed } from "@/components/product/product-demo-embed";
import { ProductChangelog } from "@/components/product/product-changelog";
import { ProductPricingFinal } from "@/components/product/product-pricing-final";
import { ProductStickyBuyBar } from "@/components/product/product-sticky-buy-bar";
import { IncludedGrid } from "@/components/product/included-grid";
import { StorytellingPanels } from "@/components/product/storytelling-panels";
import { ComparisonMatrix } from "@/components/product/comparison-matrix";
import { ReviewsSection } from "@/components/product/reviews-section";
import { CreatorMiniCard } from "@/components/product/creator-card";
import { FaqSection } from "@/components/product/faq-section";
import { RelatedProducts } from "@/components/product/related-products";
import { getEmbedUrl, isSafeDemoUrl } from "@/components/product/product-helpers";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
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
    title: product.metaTitle ?? product.title,
    description: product.metaDescription ?? product.tagline ?? undefined,
    openGraph: product.ogImageUrl ? { images: [product.ogImageUrl] } : undefined,
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

  const firstLicenseId = product.licenses[0]?.id;
  const checkoutHref = firstLicenseId
    ? `/checkout?product=${product.slug}&license=${firstLicenseId}`
    : `/checkout?product=${product.slug}`;

  const hasVideo = Boolean(getEmbedUrl(product.videoUrl));
  const hasDemo = Boolean(isSafeDemoUrl(product.demoUrl));
  const hasDemoSection = hasVideo || hasDemo;

  const availableSectionIds: string[] = ["overview"];
  if (product.files.length > 0) availableSectionIds.push("inside");
  if (product.techStack.length > 0 || product.compatibility.length > 0)
    availableSectionIds.push("tech");
  if (hasDemoSection) availableSectionIds.push("demo");
  if (product.changelog.length > 0) availableSectionIds.push("changelog");
  if (product.reviews.length > 0) availableSectionIds.push("reviews");
  if (product.faq.length > 0) availableSectionIds.push("faq");

  const galleryImages = product.gallery.length
    ? product.gallery
    : product.coverImage
      ? [product.coverImage]
      : [];

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
          coverImage: product.coverImage,
          priceCents: product.priceCents,
          compareAtCents: product.compareAtCents,
          currency: product.currency,
          instantDelivery: product.instantDelivery,
          lifetimeUpdates: product.lifetimeUpdates,
          refundPolicy: product.refundPolicy,
        }}
        creator={{
          handle: product.creator.handle,
          displayName: product.creator.displayName,
          verified: product.creator.verified,
        }}
        techStack={product.techStack}
        hasDemo={hasDemoSection}
      />

      {galleryImages.length > 1 && (
        <ProductGallery images={galleryImages} title={product.title} />
      )}

      <ProductSubnav
        title={product.title}
        priceCents={product.priceCents}
        currency={product.currency}
        checkoutHref={checkoutHref}
        availableSectionIds={availableSectionIds}
      />

      <section className="bg-paper">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-14 md:px-8 md:py-16 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="space-y-14 min-w-0">
            <ProductOverview description={product.description} />
            <IncludedGrid items={product.included} />
            <ProductInventory
              files={product.files.map((f) => ({
                id: f.id,
                filename: f.filename,
                sizeBytes: f.sizeBytes,
                version: f.version,
              }))}
            />
            <StorytellingPanels panels={product.highlights} />
            <ProductTechStack
              techStack={product.techStack}
              compatibility={product.compatibility}
            />
            <ProductDemoEmbed
              demoUrl={product.demoUrl}
              videoUrl={product.videoUrl}
              title={product.title}
            />
            <ComparisonMatrix comparison={product.comparison} />
            <ProductChangelog entries={product.changelog} />
            <ReviewsSection
              ratingAvg={product.ratingAvg}
              ratingCount={product.ratingCount}
              reviews={product.reviews}
            />
            <FaqSection items={product.faq} />
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

      <CreatorMiniCard
        creator={{
          handle: product.creator.handle,
          displayName: product.creator.displayName,
          tagline: product.creator.tagline,
          verified: product.creator.verified,
          metrics: product.creator.metrics,
        }}
      />

      <ProductPricingFinal
        title={product.title}
        priceCents={product.priceCents}
        compareAtCents={product.compareAtCents}
        currency={product.currency}
        checkoutHref={checkoutHref}
        trustBadges={product.trustBadges}
        refundPolicy={product.refundPolicy}
        instantDelivery={product.instantDelivery}
        lifetimeUpdates={product.lifetimeUpdates}
      />

      <RelatedProducts products={related} />

      <ProductStickyBuyBar
        title={product.title}
        priceCents={product.priceCents}
        compareAtCents={product.compareAtCents}
        currency={product.currency}
        checkoutHref={checkoutHref}
      />
    </>
  );
}
