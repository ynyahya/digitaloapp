import Link from "next/link";
import { ArrowRight, Star, BadgeCheck } from "lucide-react";

type Creator = {
  id: string;
  handle: string;
  displayName: string;
  tagline: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  verified: boolean;
  metrics?: {
    customers: number;
    totalSalesCents: number;
    avgRating: number;
  } | null;
};

function fmtRevenue(cents: number) {
  if (!cents) return "—";
  const usd = cents / 100;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${usd.toFixed(0)}`;
}

const FALLBACK: Creator[] = [
  {
    id: "1",
    handle: "stellar",
    displayName: "Stellar Studio",
    tagline: "Design systems for SaaS founders",
    avatarUrl: null,
    coverUrl: null,
    verified: true,
    metrics: { customers: 8421, totalSalesCents: 124_000_00, avgRating: 4.9 },
  },
  {
    id: "2",
    handle: "obsidian",
    displayName: "Obsidian Co.",
    tagline: "Templates that ship in a day",
    avatarUrl: null,
    coverUrl: null,
    verified: true,
    metrics: { customers: 3210, totalSalesCents: 84_500_00, avgRating: 4.8 },
  },
  {
    id: "3",
    handle: "lattice",
    displayName: "Lattice Cohort",
    tagline: "The build-in-public masterclass",
    avatarUrl: null,
    coverUrl: null,
    verified: true,
    metrics: { customers: 1820, totalSalesCents: 64_200_00, avgRating: 5 },
  },
  {
    id: "4",
    handle: "fjord",
    displayName: "Fjord & Co.",
    tagline: "Premium icon libraries",
    avatarUrl: null,
    coverUrl: null,
    verified: true,
    metrics: { customers: 6430, totalSalesCents: 42_700_00, avgRating: 4.9 },
  },
  {
    id: "5",
    handle: "meridian",
    displayName: "Meridian",
    tagline: "Notion OS for indie founders",
    avatarUrl: null,
    coverUrl: null,
    verified: false,
    metrics: { customers: 2210, totalSalesCents: 28_900_00, avgRating: 4.7 },
  },
  {
    id: "6",
    handle: "axiom",
    displayName: "Axiom Labs",
    tagline: "Cohorts on building AI products",
    avatarUrl: null,
    coverUrl: null,
    verified: true,
    metrics: { customers: 1140, totalSalesCents: 22_500_00, avgRating: 4.8 },
  },
];

const PALETTES = [
  ["#B4F300", "#7FB300"],
  ["#7C5CFF", "#4F3EC7"],
  ["#22D3EE", "#0891B2"],
  ["#FF5C28", "#DC2626"],
  ["#F59E0B", "#B45309"],
  ["#EC4899", "#9D174D"],
];

export function CreatorShowcase({ creators }: { creators?: Creator[] }) {
  const list = (creators?.length ? creators : FALLBACK).slice(0, 6);
  // pad if less than 6
  while (list.length < 6) list.push(FALLBACK[list.length]);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-lime">
              <span className="h-1 w-1 rounded-full bg-lime" />
              Built on TESKEL
            </span>
            <h2 className="mt-5 text-balance text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-chalk md:text-[52px]">
              Real creators.{" "}
              <span className="text-chalk-muted">Real revenue.</span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-chalk-muted md:text-[16px]">
              Some of the fastest-growing digital businesses run on TESKEL.
              Here's a peek.
            </p>
          </div>

          <Link
            href="/creators"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-[13px] font-semibold text-chalk transition hover:border-white/25 hover:bg-white/[0.05]"
          >
            Browse all creators
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => {
            const palette = PALETTES[i % PALETTES.length];
            const initials = c.displayName
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("");
            return (
              <Link
                key={c.id + i}
                href={`/c/${c.handle}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition hover:border-lime/30 hover:bg-white/[0.04]"
              >
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 grain-overlay opacity-50" />
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span
                      className="text-[44px] font-black tracking-tighter text-night/70"
                      style={{ textShadow: "0 1px 0 rgba(255,255,255,0.2)" }}
                    >
                      {initials}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-night/40 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-chalk">{c.displayName}</h3>
                    {c.verified && (
                      <BadgeCheck className="h-3.5 w-3.5 fill-lime text-night" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-[12.5px] text-chalk-muted">
                    {c.tagline ?? "Digital products on TESKEL"}
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-3 text-[11px]">
                    <div>
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-chalk-dim">Revenue</p>
                      <p className="font-mono text-[13px] font-bold text-lime">
                        {fmtRevenue(c.metrics?.totalSalesCents ?? 0)}
                      </p>
                    </div>
                    <div className="h-7 w-px bg-white/[0.06]" />
                    <div>
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-chalk-dim">Customers</p>
                      <p className="font-mono text-[13px] font-bold text-chalk">
                        {(c.metrics?.customers ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-auto inline-flex items-center gap-1 text-chalk">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-mono text-[12px] font-bold">
                        {(c.metrics?.avgRating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
