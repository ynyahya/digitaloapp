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
import { PublicGlassCard, PublicSection } from "@/components/public-offering/public-offering";
import { Layers3, PackageCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 120;

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

      <section className="bg-night">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-14 md:px-8 md:py-16 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="space-y-14 min-w-0">
            {product.type === "BUNDLE" && product.bundleItems.length > 0 ? (
              <BundleValueStack
                title={product.title}
                priceCents={product.priceCents}
                currency={product.currency}
                items={product.bundleItems.map((item) => ({
                  id: item.productId,
                  title: item.product.title,
                  tagline: item.product.tagline,
                  priceCents: item.product.priceCents,
                  slug: item.product.slug,
                }))}
              />
            ) : null}
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

function BundleValueStack({
  title,
  priceCents,
  currency,
  items,
}: {
  title: string;
  priceCents: number;
  currency: string;
  items: { id: string; title: string; tagline: string | null; priceCents: number; slug: string }[];
}) {
  const total = items.reduce((sum, item) => sum + item.priceCents, 0);
  const savings = total > priceCents ? Math.round((1 - priceCents / total) * 100) : 0;

  return (
    <PublicSection
      eyebrow="Bundle value stack"
      title={`Everything inside ${title}`}
      description="Bundles on TESKEL are designed as a curated implementation stack, not a random discount pile."
      className="px-0 py-0"
    >
      <PublicGlassCard>
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-chalk-dim">Included</p>
            <p className="mt-2 text-2xl font-black text-chalk">{items.length}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-chalk-dim">Total value</p>
            <p className="mt-2 text-2xl font-black text-chalk">{currency} {(total / 100).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-lime/20 bg-lime/10 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-lime">Savings</p>
            <p className="mt-2 text-2xl font-black text-lime">{savings ? `${savings}%` : "Curated"}</p>
          </div>
        </div>
        <div className="grid gap-3">
          {items.map((item, index) => (
            <a key={item.id} href={`/p/${item.slug}`} className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-night/70 p-4 transition-all hover:border-lime/25">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime/10 text-lime">
                {index === 0 ? <PackageCheck className="h-5 w-5" /> : <Layers3 className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-chalk group-hover:text-lime">{item.title}</p>
                <p className="line-clamp-1 text-[12px] text-chalk-muted">{item.tagline || "Included product"}</p>
              </div>
              <p className="text-[13px] font-bold text-chalk">{currency} {(item.priceCents / 100).toLocaleString()}</p>
            </a>
          ))}
        </div>
      </PublicGlassCard>
    </PublicSection>
  );
}
