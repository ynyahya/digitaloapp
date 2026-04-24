import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mission control · Digitalo Admin" };

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async function AdminOverviewPage() {
  const since = new Date(Date.now() - THIRTY_DAYS_MS);

  const [
    creatorCount,
    verifiedCreators,
    productCount,
    publishedProducts,
    totalOrders,
    paidAgg,
    refundedAgg,
    orders30dCount,
    reviewCount,
    recentOrders,
  ] = await Promise.all([
    db.creator.count(),
    db.creator.count({ where: { verified: true } }),
    db.product.count(),
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.order.count(),
    db.order.aggregate({
      where: { status: "PAID" },
      _sum: { totalCents: true },
      _count: true,
    }),
    db.order.aggregate({
      where: { status: "REFUNDED" },
      _sum: { totalCents: true },
      _count: true,
    }),
    db.order.count({ where: { createdAt: { gte: since } } }),
    db.review.count(),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        items: {
          include: {
            product: {
              select: { title: true, creator: { select: { handle: true } } },
            },
          },
        },
        user: { select: { email: true, name: true } },
      },
    }),
  ]);

  const gross = paidAgg._sum.totalCents ?? 0;
  const refunded = refundedAgg._sum.totalCents ?? 0;
  // Refund rate denominator is all *originally paid* orders — currently PAID +
  // REFUNDED (the refunded ones are no longer in PAID status). Using PAID alone
  // inflates the rate (10 refunded of 100 originally paid would read 11.1%
  // instead of 10%).
  const paidCount = paidAgg._count ?? 0;
  const refundedCount = refundedAgg._count ?? 0;
  const originallyPaid = paidCount + refundedCount;
  const refundRate = originallyPaid > 0 ? (refundedCount / originallyPaid) * 100 : 0;
  const avgOrderValue = paidCount > 0 ? Math.round(gross / paidCount) : 0;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Mission control
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Platform health, at a glance
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          All metrics are live. Refunds, AOV, and 30-day velocity update as webhooks
          land.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Gross volume"
          value={formatCurrency(gross)}
          hint={`${(paidAgg._count ?? 0).toLocaleString()} paid orders`}
        />
        <KpiCard
          label="Refunds"
          value={formatCurrency(refunded)}
          hint={`${refundRate.toFixed(1)}% refund rate`}
        />
        <KpiCard
          label="Avg order value"
          value={formatCurrency(avgOrderValue)}
          hint="Paid orders only"
        />
        <KpiCard
          label="Orders (30d)"
          value={orders30dCount.toLocaleString()}
          hint="Rolling window"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="Creators"
          value={creatorCount}
          hint={`${verifiedCreators} verified`}
          href="/admin/creators"
        />
        <MiniStat
          label="Products"
          value={productCount}
          hint={`${publishedProducts} published`}
          href="/admin/products"
        />
        <MiniStat
          label="Orders"
          value={totalOrders}
          hint="All time"
          href="/admin/orders"
        />
        <MiniStat
          label="Reviews"
          value={reviewCount}
          hint="All time"
          href="/admin/reviews"
        />
      </div>

      <section className="rounded-2xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Latest orders
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-5 py-3 text-left font-semibold">Order</th>
              <th className="px-5 py-3 text-left font-semibold">Customer</th>
              <th className="px-5 py-3 text-left font-semibold">Product</th>
              <th className="px-5 py-3 text-left font-semibold">Creator</th>
              <th className="px-5 py-3 text-right font-semibold">Total</th>
              <th className="px-5 py-3 text-right font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">When</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[13px] text-ink-muted"
                >
                  No orders yet.
                </td>
              </tr>
            )}
            {recentOrders.map((o) => {
              const first = o.items[0];
              return (
                <tr key={o.id} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-3 font-mono text-[12px]">
                    #{o.id.slice(-8)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">
                      {o.user?.name ?? o.email.split("@")[0]}
                    </p>
                    <p className="text-[11.5px] text-ink-subtle">{o.email}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">
                    {first?.product?.title ?? "—"}
                    {o.items.length > 1 && ` +${o.items.length - 1}`}
                  </td>
                  <td className="px-5 py-3 text-ink-muted">
                    {first?.product?.creator?.handle
                      ? `@${first.product.creator.handle}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {formatCurrency(o.totalCents, o.currency)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-right text-ink-muted">
                    {formatRelativeTime(o.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {label}
      </p>
      <p className="mt-2 text-[26px] font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-ink-muted">{hint}</p>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: number;
  hint?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-line bg-paper px-5 py-4 transition-colors hover:border-ink/30"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          {label}
        </p>
        <p className="mt-1 text-[22px] font-semibold tracking-tight">
          {value.toLocaleString()}
        </p>
        {hint && <p className="text-[11.5px] text-ink-subtle">{hint}</p>}
      </div>
      <ArrowUpRight className="h-4 w-4 text-ink-subtle transition-colors group-hover:text-ink" />
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-ink text-paper",
    PENDING: "bg-paper-soft text-ink-muted ring-1 ring-line",
    FAILED: "bg-paper-muted text-ink-subtle",
    REFUNDED: "bg-paper-muted text-ink-subtle",
  };
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide ${styles[status] ?? ""}`}
    >
      {status}
    </span>
  );
}
