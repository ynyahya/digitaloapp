import Link from "next/link";
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  Users,
  PackageCheck,
  Globe2,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCompactNumber } from "@/lib/utils";
import {
  getAllCreators,
  getCreatorEcosystemStats,
  getFeaturedCreators,
} from "@/lib/queries/creators";

export const metadata = {
  title: "Creators — Grow your business as a digital creator",
  description:
    "Meet the creators powering Digitalo. Build, sell and scale digital products with the platform built for the creator economy.",
};

export const revalidate = 60;

type SearchParams = Promise<{ q?: string }>;

export default async function CreatorsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = sp.q?.trim();

  const [creators, featured, stats] = await Promise.all([
    getAllCreators({ query, limit: 24 }),
    getFeaturedCreators(3),
    getCreatorEcosystemStats(),
  ]);

  return (
    <>
      <CreatorsHero query={query} />

      <section className="border-y border-line bg-paper-soft py-10 md:py-12">
        <Container size="wide">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                icon: Users,
                label: "Creators on Digitalo",
                value: formatCompactNumber(stats.creatorCount),
              },
              {
                icon: ShieldCheck,
                label: "Verified creators",
                value: formatCompactNumber(stats.verifiedCount),
              },
              {
                icon: PackageCheck,
                label: "Products live",
                value: formatCompactNumber(stats.productCount),
              },
              {
                icon: Wallet,
                label: "Paid out to creators",
                value: `$${formatCompactNumber(stats.totalSalesCents / 100)}`,
              },
            ].map(({ icon: Icon, label, value }) => (
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

      {featured.length > 0 && (
        <section className="py-14 md:py-20">
          <Container size="wide">
            <SectionHeading
              eyebrow="Featured creators"
              title="The creators leading the platform"
              description="Verified creators with consistent revenue and craft."
            />
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {featured.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/c/${c.handle}`}
                    className="group flex h-full flex-col rounded-3xl border border-line bg-paper p-7 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-[16px] font-semibold text-paper">
                        {c.displayName.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                          <span className="truncate">{c.displayName}</span>
                          {c.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-ink" />
                          )}
                        </p>
                        <p className="text-[12.5px] text-ink-muted">@{c.handle}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                    </div>
                    {c.tagline && (
                      <p className="mt-5 line-clamp-3 text-[13.5px] leading-relaxed text-ink-muted">
                        {c.tagline}
                      </p>
                    )}
                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-[12px]">
                      <Stat
                        label="Sales"
                        value={formatCompactNumber(c.metrics?.productsSold ?? 0)}
                      />
                      <Stat
                        label="Revenue"
                        value={`$${formatCompactNumber((c.metrics?.totalSalesCents ?? 0) / 100)}`}
                      />
                      <Stat
                        label="Rating"
                        value={(c.metrics?.avgRating ?? 0).toFixed(1)}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="border-t border-line bg-paper-soft/40 py-14 md:py-20">
        <Container size="wide">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="All creators"
              title={query ? `Results for "${query}"` : "Browse the full creator directory"}
              description={`${creators.length} creator${creators.length === 1 ? "" : "s"} matching your search.`}
            />
          </div>

          {creators.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {creators.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/c/${c.handle}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-paper">
                        {c.displayName.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                          <span className="truncate">{c.displayName}</span>
                          {c.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-ink" />
                          )}
                        </p>
                        <p className="text-[12px] text-ink-muted">@{c.handle}</p>
                      </div>
                    </div>
                    {c.tagline && (
                      <p className="mt-4 line-clamp-2 text-[12.5px] text-ink-muted">{c.tagline}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-[11.5px] text-ink-muted">
                      <span>
                        <span className="font-semibold text-ink">
                          {formatCompactNumber(c._count.products)}
                        </span>{" "}
                        products
                      </span>
                      <span>
                        <span className="font-semibold text-ink">
                          ${formatCompactNumber((c.metrics?.totalSalesCents ?? 0) / 100)}
                        </span>{" "}
                        revenue
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            align="center"
            eyebrow="The creator OS"
            title="Everything you need to grow as a creator"
            description="Storefronts, payouts, analytics, automation — all in one platform."
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Rocket,
                title: "Launch in minutes",
                desc: "Pre-built storefronts, instant checkout, and license keys ready out of the box.",
              },
              {
                icon: TrendingUp,
                title: "Real analytics",
                desc: "Per-product revenue, top customers, conversion. Not vanity charts — real signal.",
              },
              {
                icon: Wallet,
                title: "Creator-first economics",
                desc: "Down to 0% transaction fee on Business. Keep what you earn.",
              },
              {
                icon: Globe2,
                title: "Built to scale",
                desc: "From your first $1 to $1M+ in payouts on the same platform.",
              },
              {
                icon: ShieldCheck,
                title: "Compliance handled",
                desc: "Tax, VAT, refunds, and license enforcement managed across 120+ countries.",
              },
              {
                icon: Sparkles,
                title: "Studio you can ship from",
                desc: "Block-based product pages, live preview, launch checklist — design like a pro.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 transition-all hover:border-ink/20 hover:shadow-soft"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted text-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line bg-paper-soft/40 py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            align="center"
            eyebrow="From idea to first sale"
            title="Get up and selling in three steps"
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up free in seconds. Set your handle, branding, and storefront.",
              },
              {
                step: "02",
                title: "Build your product",
                desc: "Use Studio to compose product pages, pricing, files, and licenses.",
              },
              {
                step: "03",
                title: "Launch and earn",
                desc: "Hit publish and start selling. Get paid out automatically.",
              },
            ].map((s) => (
              <li key={s.step} className="flex flex-col bg-paper p-8">
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                  Step {s.step}
                </span>
                <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <div className="overflow-hidden rounded-3xl border border-line bg-ink p-10 text-paper md:p-16">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-paper/70">
                  <Sparkles className="h-3.5 w-3.5" />
                  Become a creator
                </span>
                <h2 className="mt-5 text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[44px]">
                  Start selling on Digitalo today.
                </h2>
                <p className="mt-3 text-[15px] text-paper/70">
                  Free forever to start. Upgrade when your store grows.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <Button asChild size="lg" className="rounded-full bg-paper text-ink hover:bg-paper/90">
                  <Link href="/register">
                    Become a creator
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-paper/25 bg-transparent text-paper hover:border-paper/50 hover:bg-paper/5"
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function CreatorsHero({ query }: { query?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pt-14 pb-12 md:pt-20 md:pb-16">
      <div className="absolute inset-x-0 top-0 h-[460px] bg-mono-radial" />
      <Container size="wide" className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
            <Users className="h-3.5 w-3.5" />
            The Digitalo creator ecosystem
          </span>
          <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
            Grow your business
            <br /> as a creator.
          </h1>
          <p className="mt-5 text-pretty text-[15px] leading-relaxed text-ink-muted md:text-[16.5px]">
            Discover the makers, designers, and operators selling on Digitalo — and join them.
          </p>
        </div>

        <form
          action="/creators"
          method="get"
          className="mx-auto mt-10 flex w-full max-w-2xl items-center gap-2 rounded-full border border-line bg-paper p-1.5 shadow-soft"
        >
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 text-ink-muted" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search creators by name, handle, or niche…"
              className="h-10 border-0 bg-transparent px-0 text-[14px] shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="h-10 rounded-full px-5">
            Search
          </Button>
        </form>
      </Container>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-ink-subtle">{label}</p>
      <p className="text-[13.5px] font-semibold text-ink">{value}</p>
    </div>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-muted">
        <Search className="h-5 w-5 text-ink-muted" />
      </span>
      <h3 className="mt-5 text-[16px] font-semibold text-ink">No creators match your search</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] text-ink-muted">
        {query ? `We couldn't find anyone matching "${query}".` : "Try a different name or handle."}
      </p>
      <Button asChild variant="secondary" className="mt-6 rounded-full">
        <Link href="/creators">View all creators</Link>
      </Button>
    </div>
  );
}
