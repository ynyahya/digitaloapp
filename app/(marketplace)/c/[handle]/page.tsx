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
import { PublicGlassCard } from "@/components/public-offering/public-offering";
import { db } from "@/lib/db";
import { getDemoCreatorByHandle } from "@/lib/demo-creators";
import { courseHref, eventHref, membershipHref, productHref, serviceHref } from "@/lib/routes/public";
import {
  getCreatorByHandle,
  getCollectionsWithProducts,
} from "@/lib/queries/creators";
import { getProductsByCreator } from "@/lib/queries/products";
export const dynamic = "force-dynamic";
export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const creator = await getCreatorByHandle(params.handle);
  if (!creator) {
    const demoCreator = getDemoCreatorByHandle(params.handle);
    if (!demoCreator) return {};
    return {
      title: `${demoCreator.displayName} — Storefront`,
      description: demoCreator.tagline,
    };
  }
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
  if (!creator) {
    const demoCreator = getDemoCreatorByHandle(params.handle);
    if (!demoCreator) notFound();
    return <DemoCreatorStorefront creator={demoCreator} />;
  }

  const [featured, templates, bundles, bestSellers, newest, collections] =
    await Promise.all([
      getProductsByCreator(creator.id, { filter: "featured", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "templates", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "bundles", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "best-sellers", limit: 8 }),
      getProductsByCreator(creator.id, { filter: "new", limit: 8 }),
      getCollectionsWithProducts(creator.id),
    ]);

  const [courses, services, events, memberships] = await Promise.all([
    db.course.findMany({ where: { creatorId: creator.id, status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 6 }),
    db.service.findMany({ where: { creatorId: creator.id, status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 6 }),
    db.event.findMany({ where: { creatorId: creator.id, status: "PUBLISHED" }, orderBy: { startDate: "asc" }, take: 6 }),
    db.membership.findMany({ where: { creatorId: creator.id, status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 6 }),
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
      <OfferingEcosystem
        offerings={[
          ...featured.slice(0, 4).map((item) => ({ kind: item.type === "BUNDLE" ? "Bundle" : "Product", title: item.title, href: productHref(item.slug), description: item.creatorName })),
          ...courses.map((item) => ({ kind: "Course", title: item.title, href: courseHref(creator.handle, item.slug), description: item.subtitle || `${item.totalLessons} lessons` })),
          ...services.map((item) => ({ kind: "Service", title: item.title, href: serviceHref(item.slug), description: item.promise || item.category || "Premium service" })),
          ...events.map((item) => ({ kind: "Event", title: item.title, href: eventHref(item.slug), description: item.startDate ? item.startDate.toLocaleDateString() : "Date TBD" })),
          ...memberships.map((item) => ({ kind: "Membership", title: item.title, href: membershipHref(item.slug), description: `${item.billingCycle.toLowerCase()} membership` })),
        ]}
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

function DemoCreatorStorefront({
  creator,
}: {
  creator: NonNullable<ReturnType<typeof getDemoCreatorByHandle>>;
}) {
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
      <DemoStorefrontProducts creator={creator} />
      <OfferingEcosystem offerings={creator.offers} />
      <BundleBanner />
      <AboutEditorial
        displayName={creator.displayName}
        bio={creator.bio}
        tools={creator.tools}
        featuredClients={creator.featuredClients}
      />
      <MembershipBlock creatorName={creator.displayName} />
      <Testimonials />
      <FinalCta />
    </>
  );
}

function DemoStorefrontProducts({
  creator,
}: {
  creator: NonNullable<ReturnType<typeof getDemoCreatorByHandle>>;
}) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-eyebrow uppercase text-lime">Demo storefront</p>
            <h2 className="mt-3 text-[34px] font-black tracking-[-0.045em] text-chalk">
              Premium products by {creator.displayName}
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-chalk-muted">
              This curated creator profile is available as a polished demo while the marketplace catalogue is being expanded.
            </p>
          </div>
          <a
            href="/products"
            className="inline-flex rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-[13px] font-bold text-chalk transition hover:border-lime/30 hover:bg-white/[0.05]"
          >
            Browse live marketplace
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {creator.products.map((product, index) => (
            <a key={product.slug} href="/products" className="group">
              <PublicGlassCard className="relative h-full overflow-hidden transition-all group-hover:-translate-y-1 group-hover:border-lime/30">
                <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_30%_0%,rgba(180,243,0,0.18),transparent_55%)]" />
                <div className="relative">
                  <span className="inline-flex rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-lime">
                    {product.type === "BUNDLE" ? "Bundle" : `Drop 0${index + 1}`}
                  </span>
                  <h3 className="mt-8 min-h-[58px] text-[21px] font-black leading-tight tracking-[-0.035em] text-chalk">
                    {product.title}
                  </h3>
                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-chalk-dim">Rating</p>
                      <p className="mt-1 text-[17px] font-black text-chalk">{product.ratingAvg.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-chalk-dim">Sales</p>
                      <p className="mt-1 text-[17px] font-black text-chalk">{product.salesCount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </PublicGlassCard>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferingEcosystem({ offerings }: { offerings: { kind: string; title: string; href: string; description: string | null }[] }) {
  if (offerings.length === 0) return null;
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-eyebrow uppercase text-lime">Creator ecosystem</p>
          <h2 className="mt-3 text-[34px] font-black tracking-[-0.045em] text-chalk">All active offers in one place</h2>
          <p className="mt-3 text-[14px] leading-6 text-chalk-muted">Products, courses, services, events, bundles, and memberships are routed to their canonical public pages.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offer) => (
            <a key={`${offer.kind}-${offer.href}`} href={offer.href} className="group">
              <PublicGlassCard className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-lime/25">
                <span className="rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lime">{offer.kind}</span>
                <h3 className="mt-4 line-clamp-2 text-[17px] font-bold text-chalk group-hover:text-lime">{offer.title}</h3>
                {offer.description ? <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-chalk-muted">{offer.description}</p> : null}
              </PublicGlassCard>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
