import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { OrderAdminActions } from "@/components/admin/order-admin-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders · Digitalo Admin" };

const STATUSES = ["ALL", "PAID", "PENDING", "FAILED", "REFUNDED"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const active = (searchParams?.status ?? "ALL").toUpperCase();
  const statusFilter = STATUSES.includes(active as (typeof STATUSES)[number])
    ? active
    : "ALL";

  const [orders, stats] = await Promise.all([
    db.order.findMany({
      where: statusFilter !== "ALL" ? { status: statusFilter } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
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
    db.order.groupBy({
      by: ["status"],
      _count: true,
      _sum: { totalCents: true },
    }),
  ]);
  const paid = stats.find((s) => s.status === "PAID");
  const refunded = stats.find((s) => s.status === "REFUNDED");

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Orders
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Platform ledger
        </h1>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard
          label="Paid volume"
          value={formatCurrency(paid?._sum.totalCents ?? 0)}
          hint={`${paid?._count ?? 0} orders`}
        />
        <KpiCard
          label="Refunded"
          value={formatCurrency(refunded?._sum.totalCents ?? 0)}
          hint={`${refunded?._count ?? 0} orders`}
        />
        <KpiCard
          label="Visible rows"
          value={orders.length.toLocaleString()}
          hint="Last 200"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium transition-colors ${
              statusFilter === s
                ? "bg-ink text-paper"
                : "border border-line bg-paper text-ink-muted hover:border-ink/30 hover:text-ink"
            }`}
          >
            {s[0] + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Creator</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 text-right font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">When</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-[13px] text-ink-muted"
                >
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const first = o.items[0];
              return (
                <tr key={o.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-mono text-[12px]">
                    #{o.id.slice(-8)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">
                      {o.user?.name ?? o.email.split("@")[0]}
                    </p>
                    <p className="text-[11.5px] text-ink-subtle">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {first?.product?.title ?? "—"}
                    {o.items.length > 1 && ` +${o.items.length - 1}`}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {first?.product?.creator?.handle
                      ? `@${first.product.creator.handle}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(o.totalCents, o.currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-ink-muted">
                    {formatRelativeTime(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <OrderAdminActions orderId={o.id} status={o.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
