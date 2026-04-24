import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Flag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wand2,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  dailyBrief,
  pricingInsight,
  rewriteTagline,
  scoreListing,
  type DailyBriefItem,
} from "@/lib/copilot";

export const dynamic = "force-dynamic";
export const metadata = { title: "AI Copilot · Digitalo" };

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function CopilotPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/copilot");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) redirect("/dashboard");

  const now = Date.now();
  const since7d = new Date(now - 7 * DAY_MS);
  const sincePrev7d = new Date(now - 14 * DAY_MS);

  const [
    products,
    peerMedian,
    paid7d,
    paidPrev7d,
    topProductSales,
    creatorMetrics,
    newFollowers7d,
    draftCount,
    reviewCount,
  ] = await Promise.all([
    db.product.findMany({
      where: { creatorId: creator.id },
      include: { licenses: true },
      orderBy: { updatedAt: "desc" },
    }),
    // Cheap "peer median": use average of published products platform-wide as
    // a stand-in until we have real category cohorts.
    db.product.aggregate({
      where: { status: "PUBLISHED" },
      _avg: { priceCents: true },
    }),
    db.order.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: since7d },
        items: { some: { product: { creatorId: creator.id } } },
      },
      _sum: { totalCents: true },
    }),
    db.order.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: sincePrev7d, lt: since7d },
        items: { some: { product: { creatorId: creator.id } } },
      },
      _sum: { totalCents: true },
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: { status: "PAID", createdAt: { gte: since7d } },
        product: { creatorId: creator.id },
      },
      _sum: { priceCents: true },
      orderBy: { _sum: { priceCents: "desc" } },
      take: 1,
    }),
    db.creatorMetrics.findUnique({ where: { creatorId: creator.id } }),
    db.follow.count({
      where: { creatorId: creator.id, createdAt: { gte: since7d } },
    }),
    db.product.count({
      where: { creatorId: creator.id, status: "DRAFT" },
    }),
    // Actual review count — not productsSold. The brief's rating-trend
    // signals ("Rating slipping", "Rating steady") need the count of
    // reviews left on the creator's products, which is what avgRating is
    // averaged over. Using productsSold here would fire false "0.0★"
    // warnings for any creator with sales but no reviews.
    db.review.count({
      where: { product: { creatorId: creator.id } },
    }),
  ]);

  const peerMedianCents = Math.round(peerMedian._avg.priceCents ?? 4900);
  const topProductId = topProductSales[0]?.productId;
  const topProduct = topProductId
    ? products.find((p) => p.id === topProductId)
    : null;

  const brief = dailyBrief({
    revenue7d: paid7d._sum.totalCents ?? 0,
    revenuePrev7d: paidPrev7d._sum.totalCents ?? 0,
    topProductTitle: topProduct?.title ?? null,
    topProductRevenue: topProductSales[0]?._sum.priceCents ?? 0,
    avgRating: creatorMetrics?.avgRating ?? 0,
    reviewCount,
    newFollowers7d,
    draftCount,
  });

  const scored = products.map((p) => {
    const score = scoreListing({
      title: p.title,
      tagline: p.tagline,
      description: p.description,
      coverImage: p.coverImage,
      gallery: p.gallery,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      included: p.included,
      faq: p.faq,
      licenses: p.licenses.map((l) => ({ name: l.name, perks: l.perks })),
      ratingCount: p.ratingCount,
      ratingAvg: p.ratingAvg,
    });
    const pricing = pricingInsight({
      currentCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      peerMedianCents,
      ratingAvg: p.ratingAvg,
      ratingCount: p.ratingCount,
      salesCount: p.salesCount,
      viewsCount: p.viewsCount,
    });
    const suggestedTagline = rewriteTagline(p.title, p.tagline);
    return { product: p, score, pricing, suggestedTagline };
  });

  const sorted = [...scored].sort((a, b) => a.score.score - b.score.score);
  const worst = sorted[0];
  const best = sorted[sorted.length - 1];

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          <Sparkles className="h-3.5 w-3.5" />
          AI Copilot · Intelligence dashboard
        </div>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Your shop, read by a senior operator
        </h1>
        <p className="max-w-2xl text-[13.5px] text-ink-muted">
          Signals, pricing, and listing quality — derived from your real orders and reviews. Suggestions refresh every time you load this page; no data leaves the platform.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Listings scored"
          value={products.length.toString()}
          sub={
            products.length > 0
              ? `${sorted.filter((x) => x.score.grade === "A").length} at grade A`
              : "Publish a product to score it"
          }
        />
        <KpiCard
          label="Best listing"
          value={best?.score.grade ?? "—"}
          sub={best ? `${best.product.title} · ${best.score.score}/100` : "—"}
        />
        <KpiCard
          label="Needs work"
          value={worst && worst !== best ? worst.score.grade : "—"}
          sub={
            worst && worst !== best
              ? `${worst.product.title} · ${worst.score.score}/100`
              : "—"
          }
          danger={worst && worst !== best && worst.score.grade === "D"}
        />
        <KpiCard
          label="Peer median price"
          value={formatCurrency(peerMedianCents)}
          sub="Across published catalog"
        />
      </div>

      <section className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Daily brief
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
              What a good operator would tell you this week
            </h2>
          </div>
          <span className="hidden rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink-muted md:inline-block">
            Updated just now
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {brief.map((item, i) => (
            <BriefCard key={i} item={item} />
          ))}
          {brief.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-line p-5 text-[13px] text-ink-muted">
              Publish a product or ship an order to start generating signals.
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Per-product analysis
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
              Listing score & pricing insight
            </h2>
          </div>
          <Link
            href="/dashboard/products"
            className="hidden items-center gap-1 text-[12.5px] font-medium text-ink-muted hover:text-ink md:inline-flex"
          >
            Manage products <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {scored.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-paper p-8 text-center text-[13.5px] text-ink-muted">
            No products yet. Create your first product to unlock Copilot.
          </div>
        )}
        <div className="flex flex-col gap-4">
          {scored.map(({ product, score, pricing, suggestedTagline }) => (
            <div
              key={product.id}
              className="rounded-2xl border border-line bg-paper p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-line px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {product.status}
                    </span>
                    <span className="truncate text-[11.5px] text-ink-subtle">
                      /p/{product.slug}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="mt-2 block truncate text-[18px] font-semibold tracking-tight text-ink hover:underline"
                  >
                    {product.title}
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <GradeBadge grade={score.grade} value={score.score} />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    Listing score
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-muted">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <ul className="mt-4 flex flex-col gap-2">
                    {score.issues.slice(0, 4).map((issue, i) => (
                      <li key={i} className="flex gap-3 text-[12.5px]">
                        <span
                          className={
                            "mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full " +
                            (issue.severity === "high"
                              ? "bg-ink"
                              : issue.severity === "medium"
                                ? "bg-ink/50"
                                : "bg-ink/25")
                          }
                        />
                        <div>
                          <p className="font-medium text-ink">{issue.title}</p>
                          <p className="text-ink-muted">{issue.detail}</p>
                        </div>
                      </li>
                    ))}
                    {score.issues.length === 0 && (
                      <li className="text-[12.5px] text-ink-muted">
                        Nothing obvious to fix — ship more shots and ask for reviews.
                      </li>
                    )}
                  </ul>
                  {score.wins.length > 0 && (
                    <p className="mt-4 text-[11.5px] text-ink-subtle">
                      Wins: {score.wins.join(" · ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-line p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                      Pricing insight
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-[18px] font-semibold tracking-tight">
                        {pricing.headline}
                      </p>
                    </div>
                    <p className="mt-2 text-[12.5px] text-ink-muted">
                      {pricing.reasoning}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
                      <span className="rounded-md border border-line px-2 py-1 text-ink">
                        Current {formatCurrency(pricing.currentCents)}
                      </span>
                      {pricing.targetCents !== pricing.currentCents && (
                        <span className="rounded-md border border-ink bg-ink px-2 py-1 text-paper">
                          Suggested {formatCurrency(pricing.targetCents)}
                        </span>
                      )}
                      <span className="text-ink-subtle">
                        Confidence {Math.round(pricing.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-line p-4">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-ink" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                        Copy rewriter
                      </p>
                    </div>
                    <div className="mt-3 flex flex-col gap-3 text-[12.5px]">
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">
                          Current tagline
                        </p>
                        <p className="text-ink-muted">
                          {product.tagline?.trim() || "— none —"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">
                          Suggested
                        </p>
                        <p className="text-ink">{suggestedTagline}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[10.5px] text-ink-subtle">
                      Heuristic draft — wire an LLM key to upgrade to generative
                      rewrites without changing the UI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  danger,
}: {
  label: string;
  value: string;
  sub: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {label}
      </p>
      <p
        className={
          "mt-2 text-[26px] font-semibold tracking-tight " +
          (danger ? "text-ink" : "text-ink")
        }
      >
        {value}
      </p>
      <p className="mt-1 text-[12px] text-ink-muted">{sub}</p>
    </div>
  );
}

function BriefCard({ item }: { item: DailyBriefItem }) {
  const Icon =
    item.icon === "trending-up"
      ? TrendingUp
      : item.icon === "trending-down"
        ? TrendingDown
        : item.icon === "sparkles"
          ? Sparkles
          : item.icon === "users"
            ? Users
            : Flag;
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-paper-soft p-4">
      <span
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border " +
          (item.kind === "warning"
            ? "border-ink bg-ink text-paper"
            : "border-line bg-paper text-ink")
        }
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
        <p className="text-[12.5px] text-ink-muted">{item.body}</p>
      </div>
    </div>
  );
}

function GradeBadge({ grade, value }: { grade: string; value: number }) {
  return (
    <div
      className={
        "flex flex-col items-end rounded-xl border px-3 py-2 " +
        (grade === "A"
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink")
      }
    >
      <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">
        Grade
      </span>
      <span className="text-[22px] font-semibold leading-none">
        {grade} <span className="text-[13px] opacity-70">{value}</span>
      </span>
    </div>
  );
}
