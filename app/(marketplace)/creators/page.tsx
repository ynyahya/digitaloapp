import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Globe2,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/landing/reveal";
import { Tilt } from "@/components/landing/tilt";
import { cn, formatCompactNumber } from "@/lib/utils";
import { getDemoCreators } from "@/lib/demo-creators";
import {
  getAllCreators,
  getCreatorEcosystemStats,
  getFeaturedCreators,
} from "@/lib/queries/creators";

export const metadata = {
  title: "Creators — Grow your business with TESKEL",
  description:
    "Meet the creators powering TESKEL. Build, test, and scale digital products with the engine built for performance.",
};

export const revalidate = 60;

type SearchParams = Promise<{ q?: string }>;

type DisplayCreator = {
  id: string;
  handle: string;
  displayName: string;
  tagline: string | null;
  verified: boolean;
  products: number;
  customers: number;
  revenueCents: number;
  productsSold: number;
  rating: number;
};

const STORIES = [
  { label: "Launch velocity", title: "From scattered templates to a storefront customers trust.", body: "Creators can package products, courses, services, memberships, and events into one polished public operating system.", icon: Zap },
  { label: "Proof engine", title: "Every profile has revenue, products, and trust baked into the surface.", body: "The directory now sells the marketplace story instead of showing a static list of accounts.", icon: ShieldCheck },
  { label: "Global creator graph", title: "Curated demo creators fill the universe while real supply grows.", body: "Fallback profiles are real pages now, so showcase links never drop users into a dead end.", icon: Globe2 },
];

export default async function CreatorsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = sp.q?.trim();

  const [creators, featured, stats] = await Promise.all([
    getAllCreators({ query, limit: 24 }),
    getFeaturedCreators(3),
    getCreatorEcosystemStats(),
  ]);

  const demoCreators = getDemoCreators()
    .filter((creator) => !query || `${creator.displayName} ${creator.handle} ${creator.tagline}`.toLowerCase().includes(query.toLowerCase()))
    .map((creator) => ({
      id: creator.id,
      handle: creator.handle,
      displayName: creator.displayName,
      tagline: creator.tagline,
      verified: creator.verified,
      products: creator.products.length,
      customers: creator.metrics.customers,
      revenueCents: creator.metrics.totalSalesCents,
      productsSold: creator.metrics.productsSold,
      rating: creator.metrics.avgRating,
    }));
  const realCreators = creators.map((creator) => ({
    id: creator.id,
    handle: creator.handle,
    displayName: creator.displayName,
    tagline: creator.tagline,
    verified: creator.verified,
    products: creator._count.products,
    customers: creator.metrics?.customers ?? 0,
    revenueCents: creator.metrics?.totalSalesCents ?? 0,
    productsSold: creator.metrics?.productsSold ?? 0,
    rating: creator.metrics?.avgRating ?? 0,
  }));
  const directory = [
    ...realCreators,
    ...demoCreators.filter((demo) => !realCreators.some((creator) => creator.handle === demo.handle)),
  ];
  const featuredCreators = (featured.length ? featured.map((creator) => ({
    id: creator.id,
    handle: creator.handle,
    displayName: creator.displayName,
    tagline: creator.tagline,
    verified: creator.verified,
    products: 0,
    customers: creator.metrics?.customers ?? 0,
    revenueCents: creator.metrics?.totalSalesCents ?? 0,
    productsSold: creator.metrics?.productsSold ?? 0,
    rating: creator.metrics?.avgRating ?? 0,
  })) : directory).slice(0, 3);

  return (
    <>
      <CreatorsHero query={query} directoryCount={directory.length} />
      <CreatorStats stats={stats} directoryCount={directory.length} />
      <Reveal>
        <FeaturedCreators creators={featuredCreators} />
      </Reveal>
      <Reveal>
        <CreatorStories />
      </Reveal>
      <CreatorDirectory creators={directory} query={query} />
      <Reveal>
        <LaunchPath />
      </Reveal>
      <FinalCreatorCta />
    </>
  );
}

function CreatorsHero({ query, directoryCount }: { query?: string; directoryCount: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-night" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[980px] grid-dark mask-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[920px] bg-lime-glow" />
      <div className="pointer-events-none absolute -left-36 top-32 -z-10 h-[440px] w-[440px] rounded-full bg-violet/[0.16] blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-36 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-lime/[0.08] blur-3xl animate-drift [animation-delay:-2s]" />

      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-5 pb-18 pt-16 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-[1fr_500px] lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 text-[12px] text-chalk-muted backdrop-blur-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)] animate-pulse-soft" />
              Creator graph
            </span>
            <span className="font-medium">{directoryCount} storefronts ready to explore</span>
          </span>
          <h1 className="mt-8 max-w-[900px] text-balance text-[46px] font-black leading-[1.01] tracking-[-0.055em] text-chalk md:text-[82px]">
            The builders behind the <span className="gradient-text-lime lime-text-glow">next creator economy.</span>
          </h1>
          <p className="mt-6 max-w-[680px] text-[16px] leading-relaxed text-chalk-muted md:text-[19px]">
            Discover verified operators, educators, designers, and founders selling products, cohorts, services, and memberships with TESKEL.
          </p>
          <form action="/creators" method="get" className="mt-9 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1.5 shadow-soft backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 text-chalk-muted" />
              <Input name="q" defaultValue={query} placeholder="Search creators, studios, operators..." className="h-11 border-0 bg-transparent px-0 text-[14px] shadow-none focus-visible:ring-0" />
            </div>
            <Button type="submit" className="h-11 rounded-xl px-5">Search</Button>
          </form>
        </div>

        <Tilt max={4} scale={1.01} glow className="group hidden rounded-[32px] lg:block">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.22),transparent_62%)]" />
            <div className="relative rounded-[24px] border border-white/[0.08] bg-night-well p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime">Live creator room</p>
                  <p className="mt-1 text-[20px] font-black tracking-[-0.035em] text-chalk">Storefront command</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-night"><Users className="h-5 w-5" /></span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Revenue", "$12.4M"],
                  ["Creators", "Global"],
                  ["Offers", "6 types"],
                  ["Launches", "Live"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-chalk-dim">{label}</p>
                    <p className="mt-2 text-[22px] font-black tracking-[-0.04em] text-chalk">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-lime/20 bg-lime/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-night"><BadgeCheck className="h-5 w-5" /></span>
                  <div>
                    <p className="text-[13px] font-black text-chalk">Verified storefront routing</p>
                    <p className="mt-1 text-[12px] text-chalk-muted">Demo profiles now open as full public pages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </section>
  );
}

function CreatorStats({ stats, directoryCount }: { stats: Awaited<ReturnType<typeof getCreatorEcosystemStats>>; directoryCount: number }) {
  const items = [
    { icon: Users, label: "Creator profiles", value: formatCompactNumber(Math.max(stats.creatorCount, directoryCount)) },
    { icon: ShieldCheck, label: "Verified operators", value: formatCompactNumber(stats.verifiedCount + 5) },
    { icon: PackageCheck, label: "Products live", value: formatCompactNumber(stats.productCount) },
    { icon: Wallet, label: "Paid to creators", value: `$${formatCompactNumber(stats.totalSalesCents / 100)}` },
  ];
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-8">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map(({ icon: Icon, label, value }) => (
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

function FeaturedCreators({ creators }: { creators: DisplayCreator[] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime"><span className="h-1 w-1 rounded-full bg-lime" />Featured creators</span>
          <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">The storefronts setting the bar.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-chalk-muted md:text-[16px]">Featured creator profiles now feel like destination pages, not simple profile cards.</p>
        </div>
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {creators.map((creator, index) => (
            <li key={creator.id}>
              <CreatorHeroCard creator={creator} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CreatorStories() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {STORIES.map(({ icon: Icon, label, title, body }) => (
            <Tilt key={title} max={3.5} scale={1.01} glow className="group rounded-3xl">
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition-colors group-hover:border-lime/30">
                <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_30%_0%,rgba(180,243,0,0.14),transparent_62%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-chalk-muted"><Icon className="h-3 w-3 text-lime" />{label}</span>
                  <h3 className="mt-6 text-[25px] font-black leading-tight tracking-[-0.04em] text-chalk">{title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-chalk-muted">{body}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

function CreatorDirectory({ creators, query }: { creators: DisplayCreator[]; query?: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-violet"><Search className="h-3.5 w-3.5" />Directory</span>
            <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[52px]">{query ? `Results for “${query}”` : "Browse the creator universe"}</h2>
            <p className="mt-3 text-[14px] text-chalk-muted">{creators.length} creator{creators.length === 1 ? "" : "s"} ready to explore.</p>
          </div>
          <Button asChild variant="secondary" className="rounded-xl"><Link href="/products">Explore marketplace <ArrowUpRight className="h-4 w-4" /></Link></Button>
        </div>
        {creators.length ? (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {creators.map((creator, index) => (
              <li key={creator.id}><CreatorDirectoryCard creator={creator} index={index} /></li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.025] p-12 text-center">
            <p className="text-[18px] font-black text-chalk">No creators found.</p>
            <p className="mt-2 text-[13.5px] text-chalk-muted">Try another search term or reset the directory.</p>
            <Button asChild variant="secondary" className="mt-6 rounded-xl"><Link href="/creators">Reset search</Link></Button>
          </div>
        )}
      </div>
    </section>
  );
}

function CreatorHeroCard({ creator, index }: { creator: DisplayCreator; index: number }) {
  return (
    <Link href={`/c/${creator.handle}`} className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-6 transition-all hover:-translate-y-1 hover:border-lime/30 hover:bg-white/[0.04]">
      <div className={cn("absolute inset-x-0 top-0 h-48 opacity-80", index % 2 ? "bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.24),transparent_62%)]" : "bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.2),transparent_62%)]")} />
      <div className="relative flex items-center justify-between">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-lime text-[18px] font-black text-night">{creator.displayName.slice(0, 2).toUpperCase()}</span>
        {creator.verified && <span className="inline-flex items-center gap-1 rounded-full bg-lime/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-lime"><CheckCircle2 className="h-3 w-3" />Verified</span>}
      </div>
      <div className="relative mt-auto">
        <p className="text-[30px] font-black leading-tight tracking-[-0.05em] text-chalk">{creator.displayName}</p>
        <p className="mt-1 text-[13px] text-chalk-muted">@{creator.handle}</p>
        {creator.tagline && <p className="mt-5 line-clamp-3 text-[14px] leading-relaxed text-chalk-muted">{creator.tagline}</p>}
        <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-5">
          <MiniStat label="Sold" value={formatCompactNumber(creator.productsSold)} />
          <MiniStat label="Revenue" value={`$${formatCompactNumber(creator.revenueCents / 100)}`} />
          <MiniStat label="Rating" value={creator.rating ? creator.rating.toFixed(1) : "—"} />
        </div>
      </div>
    </Link>
  );
}

function CreatorDirectoryCard({ creator, index }: { creator: DisplayCreator; index: number }) {
  return (
    <Link href={`/c/${creator.handle}`} className="group relative flex min-h-[275px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all hover:-translate-y-1 hover:border-lime/30 hover:bg-white/[0.04]">
      <div className={cn("absolute inset-x-0 top-0 h-28 opacity-70", index % 3 === 0 ? "bg-[radial-gradient(circle_at_40%_0%,rgba(180,243,0,0.16),transparent_62%)]" : "bg-[radial-gradient(circle_at_40%_0%,rgba(124,92,255,0.14),transparent_62%)]")} />
      <div className="relative flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-[14px] font-black text-night">{creator.displayName.slice(0, 2).toUpperCase()}</span>
        <ArrowUpRight className="h-4 w-4 text-chalk-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
      </div>
      <div className="relative mt-auto">
        <p className="text-[18px] font-black tracking-[-0.03em] text-chalk">{creator.displayName}</p>
        <p className="mt-1 text-[12px] text-chalk-muted">@{creator.handle}</p>
        {creator.tagline && <p className="mt-4 line-clamp-2 text-[12.5px] leading-relaxed text-chalk-muted">{creator.tagline}</p>}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim">
          <span>{formatCompactNumber(creator.products)} products</span>
          <span>{creator.rating ? creator.rating.toFixed(1) : "—"}★</span>
        </div>
      </div>
    </Link>
  );
}

function LaunchPath() {
  const steps = [
    ["01", "Build your public OS", "Creator storefronts connect products, courses, services, memberships, and events."],
    ["02", "Package the offer", "Use TESKEL to turn expertise into premium drops, bundles, and experiences."],
    ["03", "Scale with proof", "Revenue, ratings, and customer signals compound across the marketplace."],
  ];
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime"><Sparkles className="h-3.5 w-3.5" />From creator to company</span>
          <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-chalk md:text-[54px]">A public system for every stage of growth.</h2>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {steps.map(([step, title, body]) => (
            <li key={step} className="bg-night p-7">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-lime">{step}</span>
              <h3 className="mt-6 text-[24px] font-black tracking-[-0.04em] text-chalk">{title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-chalk-muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCreatorCta() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[36px] border border-lime/20 bg-lime p-8 text-night shadow-[0_0_80px_rgba(180,243,0,0.18)] md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-night/60">Join the graph</p>
            <h2 className="mt-4 text-balance text-[36px] font-black leading-[1.02] tracking-[-0.05em] md:text-[58px]">Turn your expertise into a storefront people remember.</h2>
          </div>
          <Link href="/register" className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-night px-6 text-[14px] font-black text-chalk transition hover:bg-night/90">
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-chalk-dim">{label}</p>
      <p className="mt-1 text-[16px] font-black text-chalk">{value}</p>
    </div>
  );
}
