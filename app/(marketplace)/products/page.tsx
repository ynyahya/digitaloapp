import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Filter,
  Flame,
  Layers,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/landing/reveal";
import { Tilt } from "@/components/landing/tilt";
import { cn, formatCompactNumber } from "@/lib/utils";
import { getDemoCreators } from "@/lib/demo-creators";
import {
  getMarketplaceProducts,
  getStaffPicks,
  getNewArrivals,
  getMarketplaceCategories,
  getMarketplaceStats,
} from "@/lib/queries/products";
import { getFeaturedCreators } from "@/lib/queries/creators";

export const metadata = {
  title: "Marketplace — Discover digital products built by top creators",
  description:
    "The engine for digital product. Browse premium templates, SaaS boilerplates, UI kits, and more — all built for performance.",
};

export const revalidate = 60;

type SearchParams = Promise<{
  category?: string;
  sort?: "trending" | "new" | "top-rated" | "price-asc" | "price-desc";
  q?: string;
}>;

const SORTS = [
  { key: "trending", label: "Trending" },
  { key: "new", label: "Newest" },
  { key: "top-rated", label: "Top rated" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
] as const;

const DEMO_DROPS = [
  { title: "Creator Command Center", creator: "Obsidian Co.", metric: "$84.5K", tag: "Ops" },
  { title: "SaaS Launch System", creator: "Stellar Studio", metric: "8.4K", tag: "SaaS" },
  { title: "Indie Founder OS", creator: "Meridian", metric: "4.7★", tag: "Notion" },
];

export default async function MarketplacePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const activeCategory = sp.category;
  const activeSort = sp.sort ?? "trending";
  const activeQuery = sp.q?.trim();

  const [products, staff, fresh, categories, stats, topCreators] = await Promise.all([
    getMarketplaceProducts({
      categorySlug: activeCategory,
      sort: activeSort,
      query: activeQuery,
      limit: 24,
    }),
    getStaffPicks(4),
    getNewArrivals(4),
    getMarketplaceCategories(),
    getMarketplaceStats(),
    getFeaturedCreators(5),
  ]);

  const staffPicks = staff.length ? staff : products.slice(0, 4);
  const newArrivals = fresh.length ? fresh : products.slice(0, 4);
  const creatorCards = topCreators.length ? topCreators : getDemoCreators().slice(0, 5);

  return (
    <>
      <MarketplaceHero categories={categories} activeCategory={activeCategory} activeQuery={activeQuery} />
      <StatsDock stats={stats} />
      <Reveal>
        <CuratedDrops productsCount={products.length} />
      </Reveal>
      <Reveal>
        <ProductRail eyebrow="Staff picks" title="Hand-curated launch assets" description="Premium-quality products with strong positioning, polished delivery, and real utility." products={staffPicks} />
      </Reveal>
      <BrowseSection products={products} categories={categories} activeCategory={activeCategory} activeQuery={activeQuery} activeSort={activeSort} />
      <Reveal>
        <ProductRail eyebrow="New arrivals" title="Fresh drops from the creator floor" description="New templates, bundles, and launch systems added to the marketplace." products={newArrivals} actionHref="/products?sort=new" />
      </Reveal>
      <Reveal>
        <CreatorConstellation creators={creatorCards} />
      </Reveal>
      <FinalMarketplaceCta />
    </>
  );
}

function MarketplaceHero({
  categories,
  activeCategory,
  activeQuery,
}: {
  categories: Awaited<ReturnType<typeof getMarketplaceCategories>>;
  activeCategory?: string;
  activeQuery?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-night" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[980px] grid-dark mask-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[920px] bg-lime-glow" />
      <div className="pointer-events-none absolute -left-40 top-28 -z-10 h-[460px] w-[460px] rounded-full bg-lime/[0.08] blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-36 top-10 -z-10 h-[440px] w-[440px] rounded-full bg-violet/[0.16] blur-3xl animate-drift [animation-delay:-2s]" />

      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-5 pb-18 pt-16 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-[1fr_470px] lg:px-10">
        <div>
          <Link href="/creators" className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 text-[12px] text-chalk-muted backdrop-blur-xl transition hover:border-white/[0.15] hover:text-chalk">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              Marketplace
            </span>
            <span className="font-medium">Curated drops for serious creators</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-chalk-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-8 max-w-[820px] text-balance text-[46px] font-black leading-[1.01] tracking-[-0.055em] text-chalk md:text-[78px]">
            Digital products that feel like a <span className="gradient-text-lime lime-text-glow">launch advantage.</span>
          </h1>
          <p className="mt-6 max-w-[660px] text-[16px] leading-relaxed text-chalk-muted md:text-[19px]">
            Browse premium systems, templates, bundles, and playbooks from creators building real businesses on TESKEL.
          </p>

          <form action="/products" method="get" className="mt-9 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1.5 shadow-soft backdrop-blur-xl">
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 text-chalk-muted" />
              <Input name="q" defaultValue={activeQuery} placeholder="Search templates, kits, bundles..." className="h-11 border-0 bg-transparent px-0 text-[14px] shadow-none focus-visible:ring-0" />
            </div>
            <Button type="submit" className="h-11 rounded-xl px-5">
              Search
            </Button>
          </form>

          <ul className="mt-7 flex max-w-3xl flex-wrap items-center gap-2">
            <CategoryChip href="/products" active={!activeCategory} label="All" />
            {categories.map((category) => (
              <CategoryChip key={category.id} href={`/products?category=${category.slug}`} active={activeCategory === category.slug} label={category.name} count={category._count.products} />
            ))}
          </ul>
        </div>

        <Tilt max={4} scale={1.01} glow className="group hidden rounded-[32px] lg:block">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.22),transparent_62%)]" />
            <div className="relative rounded-[24px] border border-white/[0.08] bg-night-well p-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime">Live drops</p>
                  <p className="mt-1 text-[18px] font-black tracking-[-0.03em] text-chalk">Marketplace radar</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime text-night">
                  <Play className="h-4 w-4 fill-night" />
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {DEMO_DROPS.map((drop, index) => (
                  <div key={drop.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-bold text-chalk">{drop.title}</p>
                        <p className="mt-1 text-[12px] text-chalk-muted">{drop.creator}</p>
                      </div>
                      <span className="rounded-full bg-lime/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-lime">{drop.tag}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-lime" style={{ width: `${82 - index * 14}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-chalk-muted">{drop.metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function CategoryChip({ href, label, active, count }: { href: string; label: string; active?: boolean; count?: number }) {
  return (
    <li>
      <Link href={href} className={cn("inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition-colors", active ? "border-lime/30 bg-lime text-night" : "border-white/[0.08] bg-white/[0.02] text-chalk-muted hover:border-lime/40 hover:text-chalk")}>
        {label}
        {typeof count === "number" && <span className={cn("rounded-full px-1.5 text-[10.5px] font-black", active ? "bg-night/15 text-night" : "bg-white/[0.06] text-chalk-dim")}>{count}</span>}
      </Link>
    </li>
  );
}

function StatsDock({ stats }: { stats: Awaited<ReturnType<typeof getMarketplaceStats>> }) {
  const items = [
    { icon: Layers, value: formatCompactNumber(stats.products), label: "Live products" },
    { icon: Star, value: formatCompactNumber(stats.creators), label: "Creators" },
    { icon: Flame, value: formatCompactNumber(stats.productsSold), label: "Sold" },
    { icon: BarChart3, value: `$${formatCompactNumber(stats.totalSalesCents / 100)}`, label: "Creator revenue" },
  ];
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-8">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map(({ icon: Icon, value, label }) => (
            <li key={label} className="rounded-2xl border border-white/[0.08] bg-night/70 p-5 backdrop-blur-xl">
              <Icon className="h-4 w-4 text-lime" />
              <p className="mt-4 text-[24px] font-black tracking-[-0.04em] text-chalk">{value}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-chalk-dim">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CuratedDrops({ productsCount }: { productsCount: number }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-6">
          <Bento className="lg:col-span-3 lg:row-span-2" label="Curated quality" title="Every page should sell before the checkout opens." body="The marketplace now behaves like a launch floor: tighter hierarchy, cinematic product moments, and proof-driven sections instead of static catalogue blocks." icon={ShieldCheck} />
          <Bento className="lg:col-span-3" label="Fast discovery" title="Search, sort, and category filters stay in the hero." body={`${productsCount} live product${productsCount === 1 ? "" : "s"} are currently available, with empty states designed to keep the experience premium.`} icon={Search} />
          <Bento className="lg:col-span-2" label="Revenue signal" title="Staff picks surface traction, not noise." body="Cards highlight creator trust, ratings, bundles, and seller identity." icon={Zap} />
          <Bento className="lg:col-span-2" label="Creator graph" title="Marketplace links into storefronts." body="Creator pages now support curated demo profiles instead of dead showcase links." icon={Layers} />
          <Bento className="lg:col-span-2" label="Global polish" title="The visual system matches the home page." body="Grid, glow, glass, black canvas, lime energy, and sharper typography." icon={Sparkles} />
        </div>
      </div>
    </section>
  );
}

function ProductRail({ eyebrow, title, description, products, actionHref }: { eyebrow: string; title: string; description: string; products: Awaited<ReturnType<typeof getMarketplaceProducts>>; actionHref?: string }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime">
              <span className="h-1 w-1 rounded-full bg-lime" />
              {eyebrow}
            </span>
            <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">{title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-chalk-muted md:text-[16px]">{description}</p>
          </div>
          {actionHref && (
            <Link href={actionHref} className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-[13px] font-bold text-chalk transition hover:border-white/25 hover:bg-white/[0.05]">
              See all new
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        {products.length ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

function BrowseSection({ products, categories, activeCategory, activeQuery, activeSort }: { products: Awaited<ReturnType<typeof getMarketplaceProducts>>; categories: Awaited<ReturnType<typeof getMarketplaceCategories>>; activeCategory?: string; activeQuery?: string; activeSort: string }) {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.08] bg-white/[0.025] py-16 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.12),transparent_58%)]" />
      <div className="relative mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-violet">
              <Filter className="h-3.5 w-3.5" />
              Browse all
            </span>
            <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[52px]">
              {activeCategory ? categories.find((category) => category.slug === activeCategory)?.name ?? "Category" : activeQuery ? `Results for “${activeQuery}”` : "The full marketplace"}
            </h2>
            <p className="mt-3 text-[14px] text-chalk-muted">{products.length} {products.length === 1 ? "product" : "products"} matching your filters.</p>
          </div>
          <SortBar active={activeSort} category={activeCategory} query={activeQuery} />
        </div>
        {products.length ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState query={activeQuery} />
        )}
      </div>
    </section>
  );
}

function SortBar({ active, category, query }: { active: string; category?: string; query?: string }) {
  const buildHref = (sortKey: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    if (sortKey !== "trending") params.set("sort", sortKey);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };
  return (
    <ul className="flex flex-wrap items-center gap-1 rounded-full border border-white/[0.08] bg-night/80 p-1 text-[12.5px] font-bold backdrop-blur-xl">
      {SORTS.map((sort) => (
        <li key={sort.key}>
          <Link href={buildHref(sort.key)} className={cn("inline-flex h-8 items-center rounded-full px-3 transition-colors", active === sort.key ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk")}>{sort.label}</Link>
        </li>
      ))}
    </ul>
  );
}

function CreatorConstellation({ creators }: { creators: Awaited<ReturnType<typeof getFeaturedCreators>> | ReturnType<typeof getDemoCreators> }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime">
              <span className="h-1 w-1 rounded-full bg-lime" />
              Creator graph
            </span>
            <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">Storefronts that feel alive.</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-chalk-muted md:text-[16px]">Top creator cards now route to real or curated storefronts with a complete premium experience.</p>
          </div>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/creators">Browse creators <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {creators.map((creator) => (
            <li key={creator.id}>
              <Link href={`/c/${creator.handle}`} className="group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all hover:-translate-y-1 hover:border-lime/30 hover:bg-white/[0.04]">
                <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.16),transparent_62%)] opacity-70" />
                <div className="relative flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-[14px] font-black text-night">{creator.displayName.slice(0, 2).toUpperCase()}</span>
                  <ArrowUpRight className="h-4 w-4 text-chalk-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
                </div>
                <div className="relative mt-auto">
                  <p className="text-[17px] font-black tracking-[-0.03em] text-chalk">{creator.displayName}</p>
                  <p className="mt-1 text-[12px] text-chalk-muted">@{creator.handle}</p>
                  {creator.tagline && <p className="mt-4 line-clamp-3 text-[12.5px] leading-relaxed text-chalk-muted">{creator.tagline}</p>}
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim">
                    <span>{formatCompactNumber(creator.metrics?.productsSold ?? 0)} sold</span>
                    <span>{(creator.metrics?.avgRating ?? 0).toFixed(1)}★</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalMarketplaceCta() {
  return (
    <section className="px-5 pb-20 md:px-8 md:pb-28 lg:px-10">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[36px] border border-lime/20 bg-lime p-8 text-night shadow-[0_0_80px_rgba(180,243,0,0.18)] md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-night/60">Sell on TESKEL</p>
            <h2 className="mt-4 text-balance text-[36px] font-black leading-[1.02] tracking-[-0.05em] md:text-[58px]">Launch a product that looks world-class on day one.</h2>
          </div>
          <Link href="/register" className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-night px-6 text-[14px] font-black text-chalk transition hover:bg-night/90">
            Start selling free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Bento({ className, label, title, body, icon: Icon }: { className?: string; label: string; title: string; body: string; icon: typeof ShieldCheck }) {
  return (
    <Tilt max={3.5} scale={1.01} glow className={cn("group rounded-3xl", className)}>
      <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors group-hover:border-lime/30 md:p-7">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_30%_0%,rgba(180,243,0,0.14),transparent_62%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-chalk-muted">
            <Icon className="h-3 w-3 text-lime" />
            {label}
          </span>
          <h3 className="mt-5 text-[22px] font-black leading-tight tracking-[-0.035em] text-chalk md:text-[28px]">{title}</h3>
          <p className="mt-3 text-[13.5px] leading-relaxed text-chalk-muted">{body}</p>
        </div>
      </div>
    </Tilt>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.025] p-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
        <Search className="h-5 w-5 text-lime" />
      </span>
      <h3 className="mt-5 text-[18px] font-black tracking-[-0.02em] text-chalk">No products match this view yet</h3>
      <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-chalk-muted">
        {query ? `We couldn't find anything for “${query}”.` : "Try a different category or return to the full marketplace."}
      </p>
      <Button asChild variant="secondary" className="mt-6 rounded-xl">
        <Link href="/products">Reset filters</Link>
      </Button>
    </div>
  );
}
