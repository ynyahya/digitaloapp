import Link from "next/link";
import { Search, Sparkles, ArrowUpRight, Filter, Flame, Star, Clock, Layers } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getMarketplaceProducts,
  getStaffPicks,
  getNewArrivals,
  getMarketplaceCategories,
  getMarketplaceStats,
} from "@/lib/queries/products";
import { getFeaturedCreators } from "@/lib/queries/creators";
import { formatCompactNumber } from "@/lib/utils";

export const metadata = {
  title: "Marketplace — Discover digital products built by top creators",
  description:
    "Browse premium digital products: templates, SaaS boilerplates, UI kits, plugins and more — all crafted by world-class creators.",
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

  return (
    <>
      <MarketplaceHero
        categories={categories}
        activeCategory={activeCategory}
        activeQuery={activeQuery}
      />

      <StatsBar stats={stats} />

      <section className="py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            eyebrow="Staff picks"
            title="Hand-curated by the Digitalo team"
            description="Premium-quality products that consistently delight creators."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper-soft/40 py-14 md:py-20">
        <Container size="wide">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
                <Filter className="h-3.5 w-3.5" />
                Browse all
              </span>
              <h2 className="mt-4 text-balance text-[28px] font-semibold leading-tight tracking-tight text-ink md:text-[34px]">
                {activeCategory
                  ? `${categories.find((c) => c.slug === activeCategory)?.name ?? "Category"}`
                  : activeQuery
                    ? `Results for "${activeQuery}"`
                    : "The full marketplace"}
              </h2>
              <p className="mt-2 text-[14px] text-ink-muted">
                {products.length} {products.length === 1 ? "product" : "products"} matching your filters.
              </p>
            </div>
            <SortBar active={activeSort} category={activeCategory} query={activeQuery} />
          </div>

          {products.length === 0 ? (
            <EmptyState query={activeQuery} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            eyebrow="New arrivals"
            title="Fresh on Digitalo this week"
            description="The newest products from creators on the platform."
            action={
              <Link
                href="/products?sort=new"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-ink-soft"
              >
                See all new
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fresh.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper-soft/40 py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            eyebrow="Top creators"
            title="The creators leading the platform"
            description="Verified creators with the highest sales on Digitalo."
            action={
              <Link
                href="/creators"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-ink-soft"
              >
                See all creators
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {topCreators.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/c/${c.handle}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-paper">
                      {c.displayName.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{c.displayName}</p>
                      <p className="text-[12px] text-ink-muted">@{c.handle}</p>
                    </div>
                  </div>
                  {c.tagline && (
                    <p className="mt-4 line-clamp-2 text-[13px] text-ink-muted">{c.tagline}</p>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[12px]">
                    <div>
                      <p className="text-ink-subtle">Sales</p>
                      <p className="text-[13.5px] font-semibold text-ink">
                        {formatCompactNumber(c.metrics?.productsSold ?? 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-ink-subtle">Revenue</p>
                      <p className="text-[13.5px] font-semibold text-ink">
                        ${formatCompactNumber((c.metrics?.totalSalesCents ?? 0) / 100)}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <div className="overflow-hidden rounded-3xl border border-line bg-ink p-10 text-paper md:p-14">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-paper/70">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sell on Digitalo
                </span>
                <h2 className="mt-5 text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[40px]">
                  Launch your own digital product.
                </h2>
                <p className="mt-3 text-[15px] text-paper/70">
                  Join thousands of creators earning a living from premium digital products.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full bg-paper text-ink hover:bg-paper/90">
                <Link href="/register">
                  Start selling free
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
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
    <section className="relative overflow-hidden border-b border-line bg-paper pt-14 pb-12 md:pt-20 md:pb-16">
      <div className="absolute inset-x-0 top-0 h-[460px] bg-mono-radial" />
      <Container size="wide" className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
            <Flame className="h-3.5 w-3.5" />
            The Digitalo Marketplace
          </span>
          <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
            Discover digital products
            <br /> built by top creators.
          </h1>
          <p className="mt-5 text-pretty text-[15px] leading-relaxed text-ink-muted md:text-[16.5px]">
            Browse premium templates, SaaS boilerplates, UI kits, ebooks, plugins, and creator
            assets — beautifully curated.
          </p>
        </div>

        <form
          action="/products"
          method="get"
          className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-full border border-line bg-paper p-1.5 shadow-soft"
        >
          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 text-ink-muted" />
            <Input
              name="q"
              defaultValue={activeQuery}
              placeholder="Search templates, kits, plugins…"
              className="h-10 border-0 bg-transparent px-0 text-[14px] shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="h-10 rounded-full px-5">
            Search
          </Button>
        </form>

        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          <CategoryChip
            href="/products"
            active={!activeCategory}
            label="All"
          />
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              href={`/products?category=${c.slug}`}
              active={activeCategory === c.slug}
              label={c.name}
              count={c._count.products}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}

function CategoryChip({
  href,
  label,
  active,
  count,
}: {
  href: string;
  label: string;
  active?: boolean;
  count?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
          active
            ? "border-ink bg-ink text-paper"
            : "border-line bg-paper text-ink-muted hover:border-ink/30 hover:text-ink",
        )}
      >
        {label}
        {typeof count === "number" && (
          <span
            className={cn(
              "rounded-full px-1.5 text-[10.5px] font-semibold",
              active ? "bg-paper/15 text-paper" : "bg-paper-muted text-ink-subtle",
            )}
          >
            {count}
          </span>
        )}
      </Link>
    </li>
  );
}

function StatsBar({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getMarketplaceStats>>;
}) {
  const items = [
    { icon: Layers, value: formatCompactNumber(stats.products), label: "Products" },
    { icon: Star, value: formatCompactNumber(stats.creators), label: "Creators" },
    { icon: Flame, value: formatCompactNumber(stats.productsSold), label: "Products sold" },
    {
      icon: Clock,
      value: `$${formatCompactNumber(stats.totalSalesCents / 100)}`,
      label: "Earned by creators",
    },
  ];
  return (
    <section className="border-y border-line bg-paper-soft py-8">
      <Container size="wide">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map(({ icon: Icon, value, label }) => (
            <li key={label} className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-ink">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[18px] font-semibold tracking-tight text-ink md:text-[20px]">
                  {value}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                  {label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function SortBar({
  active,
  category,
  query,
}: {
  active: string;
  category?: string;
  query?: string;
}) {
  const buildHref = (sortKey: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    if (sortKey !== "trending") params.set("sort", sortKey);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };
  return (
    <ul className="flex flex-wrap items-center gap-1 rounded-full border border-line bg-paper p-1 text-[12.5px] font-medium">
      {SORTS.map((s) => (
        <li key={s.key}>
          <Link
            href={buildHref(s.key)}
            className={cn(
              "inline-flex h-8 items-center rounded-full px-3 transition-colors",
              active === s.key ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
            )}
          >
            {s.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-muted">
        <Search className="h-5 w-5 text-ink-muted" />
      </span>
      <h3 className="mt-5 text-[16px] font-semibold text-ink">No products match your filters</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] text-ink-muted">
        {query ? `We couldn't find anything for "${query}".` : "Try a different category or sort."}
      </p>
      <Button asChild variant="secondary" className="mt-6 rounded-full">
        <Link href="/products">Reset filters</Link>
      </Button>
    </div>
  );
}
