import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { MonoMockup } from "@/components/shared/mono-mockup";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics · Digitalo" };

const RANGE_DAYS = 30;

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/analytics");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) redirect("/dashboard");

  const since = new Date(Date.now() - RANGE_DAYS * 24 * 60 * 60 * 1000);

  const [orders, totalOrders, products] = await Promise.all([
    db.order.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: since },
        items: { some: { product: { creatorId: creator.id } } },
      },
      select: { totalCents: true, createdAt: true, currency: true },
    }),
    db.order.count({
      where: {
        status: "PAID",
        items: { some: { product: { creatorId: creator.id } } },
      },
    }),
    db.product.findMany({
      where: { creatorId: creator.id },
      select: {
        id: true,
        title: true,
        salesCount: true,
        viewsCount: true,
        ratingAvg: true,
        ratingCount: true,
      },
      orderBy: { salesCount: "desc" },
      take: 10,
    }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Analytics
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Signal over vanity metrics
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          Rolling {RANGE_DAYS}-day window. Paid orders only.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="Revenue" value={formatCurrency(revenue)} />
        <KpiCard label="Orders" value={orders.length.toLocaleString()} />
        <KpiCard label="Avg order value" value={formatCurrency(avgOrder)} />
        <KpiCard label="Lifetime orders" value={totalOrders.toLocaleString()} />
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Revenue trend
            </p>
            <p className="mt-1 text-[22px] font-semibold tracking-tight">
              {formatCurrency(revenue)}
            </p>
          </div>
          <p className="text-[12px] text-ink-muted">Last {RANGE_DAYS} days</p>
        </div>
        <div className="mt-5">
          <MonoMockup label="Revenue" ratio="aspect-[16/5]" />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Product performance
          </p>
          <p className="text-[11.5px] text-ink-muted">By lifetime sales</p>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-5 py-3 text-left font-semibold">Product</th>
              <th className="px-5 py-3 text-right font-semibold">Views</th>
              <th className="px-5 py-3 text-right font-semibold">Sales</th>
              <th className="px-5 py-3 text-right font-semibold">Conv. %</th>
              <th className="px-5 py-3 text-right font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-[13px] text-ink-muted"
                >
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => {
              const conv =
                p.viewsCount > 0 ? (p.salesCount / p.viewsCount) * 100 : 0;
              return (
                <tr key={p.id} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-5 py-3 text-right text-ink-muted">
                    {p.viewsCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {p.salesCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-ink-muted">
                    {conv > 0 ? `${conv.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-ink-muted">
                    {p.ratingCount > 0 ? (
                      <>★ {p.ratingAvg.toFixed(1)}</>
                    ) : (
                      "—"
                    )}
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

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {label}
      </p>
      <p className="mt-2 text-[26px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}
