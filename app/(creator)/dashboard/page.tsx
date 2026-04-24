import Link from "next/link";
import {
  ArrowUpRight,
  DollarSign,
  Eye,
  ShoppingBag,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    include: {
      metrics: true,
      products: {
        where: { status: "PUBLISHED" },
        orderBy: { salesCount: "desc" },
        take: 5,
        select: {
          id: true,
          slug: true,
          title: true,
          priceCents: true,
          salesCount: true,
          ratingAvg: true,
        },
      },
    },
  });
  if (!creator) return null;

  const totalRevenueCents = creator.metrics?.totalSalesCents ?? 0;
  const customers = creator.metrics?.customers ?? 0;
  const productsSold = creator.metrics?.productsSold ?? 0;

  // Real 30-day-over-30-day deltas — we used to hardcode "+24.5%" etc. which
  // actively misled creators looking at their dashboard. Now the KPI cards
  // show the honest number (including down or flat), or no delta at all when
  // there's no comparable period to measure against.
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const since30d = new Date(now - 30 * DAY_MS);
  const sincePrev30d = new Date(now - 60 * DAY_MS);

  const [revCurr, revPrev, paidCurr, paidPrev, recentOrders] = await Promise.all([
    db.order.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: since30d },
        items: { some: { product: { creatorId: creator.id } } },
      },
      _sum: { totalCents: true },
      _count: true,
    }),
    db.order.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: sincePrev30d, lt: since30d },
        items: { some: { product: { creatorId: creator.id } } },
      },
      _sum: { totalCents: true },
      _count: true,
    }),
    db.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: since30d },
        items: { some: { product: { creatorId: creator.id } } },
      },
      select: { email: true, userId: true },
    }),
    db.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: sincePrev30d, lt: since30d },
        items: { some: { product: { creatorId: creator.id } } },
      },
      select: { email: true, userId: true },
    }),
    db.order.findMany({
      where: { items: { some: { product: { creatorId: creator.id } } } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: { include: { product: true } } },
    }),
  ]);

  const revenueDelta = deltaPct(
    revCurr._sum.totalCents ?? 0,
    revPrev._sum.totalCents ?? 0,
  );
  const soldDelta = deltaPct(revCurr._count ?? 0, revPrev._count ?? 0);
  const uniq = (rows: Array<{ email: string; userId: string | null }>) =>
    new Set(rows.map((r) => r.userId ?? r.email)).size;
  const customersDelta = deltaPct(uniq(paidCurr), uniq(paidPrev));

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Dashboard
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
            Welcome back, {creator.displayName.split(" ")[0]}
          </h1>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/c/${creator.handle}`}>View storefront</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/products/new">New product</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total revenue"
          value={formatCurrency(totalRevenueCents)}
          delta={revenueDelta}
          icon={DollarSign}
        />
        <KpiCard
          label="Customers"
          value={formatCompactNumber(customers)}
          delta={customersDelta}
          icon={Users}
        />
        <KpiCard
          label="Products sold"
          value={formatCompactNumber(productsSold)}
          delta={soldDelta}
          icon={ShoppingBag}
        />
        {/* Store-visit analytics aren't wired up yet — rather than hardcode
            a fake number, we show a clear "coming soon" placeholder. */}
        <KpiCard label="Store visits" value="—" delta={null} icon={Eye} comingSoon />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                Revenue · last 30 days
              </p>
              <p className="mt-1 text-[22px] font-semibold tracking-tight">
                {formatCurrency(revCurr._sum.totalCents ?? 0)}
              </p>
            </div>
            <div className="flex gap-1 rounded-full border border-line bg-paper-soft p-1 text-[11px]">
              {["7D", "30D", "90D", "1Y"].map((t, i) => (
                <span
                  key={t}
                  className={
                    i === 1
                      ? "rounded-full bg-ink px-2.5 py-0.5 font-medium text-paper"
                      : "px-2.5 py-0.5 font-medium text-ink-muted"
                  }
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <MonoMockup label="Revenue chart" ratio="aspect-[16/7]" className="mt-6" />
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Top products
          </p>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {creator.products.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link
                    href={`/p/${p.slug}`}
                    className="truncate text-[13.5px] font-semibold text-ink transition-colors hover:opacity-80"
                  >
                    {p.title}
                  </Link>
                  <p className="text-[11.5px] text-ink-muted">
                    {formatCompactNumber(p.salesCount)} sales · ★ {p.ratingAvg.toFixed(1)}
                  </p>
                </div>
                <span className="whitespace-nowrap text-[13px] font-semibold">
                  {formatCurrency(p.priceCents * p.salesCount)}
                </span>
              </li>
            ))}
            {creator.products.length === 0 && (
              <li className="py-6 text-center text-[12.5px] text-ink-muted">
                No products yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Recent orders
          </p>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-line">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-line bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
                <th className="px-4 py-2.5 text-left font-semibold">Order</th>
                <th className="px-4 py-2.5 text-left font-semibold">Customer</th>
                <th className="px-4 py-2.5 text-left font-semibold">Product</th>
                <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                <th className="px-4 py-2.5 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-[12.5px] text-ink-muted"
                  >
                    No orders yet. Share your storefront to get your first sale.
                  </td>
                </tr>
              )}
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-mono text-[11.5px] text-ink-muted">
                    #{o.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-ink">{o.email}</td>
                  <td className="px-4 py-3 text-ink">
                    {o.items[0]?.product?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(o.totalCents)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Format a signed percentage delta, or return null if there's no prior-period
// baseline to compare against (so the KPI card can hide the line entirely
// instead of showing misleading numbers).
function deltaPct(curr: number, prev: number): string | null {
  if (prev <= 0) {
    if (curr > 0) return "New";
    return null;
  }
  const pct = ((curr - prev) / prev) * 100;
  const rounded = Math.round(pct * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}%`;
}

function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  comingSoon,
}: {
  label: string;
  value: string;
  delta: string | null;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-center justify-between text-ink-muted">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">{label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[26px] font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-[11.5px] font-medium text-ink-muted">
        {comingSoon ? (
          <span className="text-ink-subtle">Analytics coming soon</span>
        ) : delta ? (
          <>
            <span className="text-ink">{delta}</span> vs. prior 30 days
          </>
        ) : (
          <span className="text-ink-subtle">No data for prior period</span>
        )}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-ink text-paper",
    PENDING: "bg-paper-muted text-ink-muted",
    FAILED: "bg-paper-muted text-ink-muted line-through",
    REFUNDED: "bg-paper-muted text-ink-muted",
  };
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? "bg-paper-muted text-ink-muted"}`}
    >
      {status}
    </span>
  );
}
