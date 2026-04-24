import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers · Digitalo" };

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/customers");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) redirect("/dashboard");

  // Aggregate orders per customer for this creator.
  const orders = await db.order.findMany({
    where: {
      status: "PAID",
      items: { some: { product: { creatorId: creator.id } } },
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
      items: { include: { product: { select: { creatorId: true, priceCents: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const byCustomer = new Map<
    string,
    {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      joinedAt: Date;
      totalCents: number;
      orderCount: number;
      lastOrderAt: Date;
    }
  >();
  for (const o of orders) {
    const creatorItems = o.items.filter(
      (i) => i.product?.creatorId === creator.id,
    );
    const creatorTotal = creatorItems.reduce(
      (sum, i) => sum + (i.priceCents ?? 0) * (i.qty ?? 1),
      0,
    );
    const id = o.user?.id ?? o.email;
    const existing = byCustomer.get(id);
    if (existing) {
      existing.totalCents += creatorTotal;
      existing.orderCount += 1;
      if (o.createdAt > existing.lastOrderAt) existing.lastOrderAt = o.createdAt;
    } else {
      byCustomer.set(id, {
        id,
        name: o.user?.name ?? null,
        email: o.user?.email ?? o.email,
        image: o.user?.image ?? null,
        joinedAt: o.user?.createdAt ?? o.createdAt,
        totalCents: creatorTotal,
        orderCount: 1,
        lastOrderAt: o.createdAt,
      });
    }
  }
  const customers = Array.from(byCustomer.values()).sort(
    (a, b) => b.totalCents - a.totalCents,
  );

  const totalLifetime = customers.reduce((sum, c) => sum + c.totalCents, 0);
  const avgLifetime = customers.length
    ? Math.round(totalLifetime / customers.length)
    : 0;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Customers
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          People who bought from you
        </h1>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard label="Customers" value={customers.length.toLocaleString()} />
        <KpiCard label="Lifetime revenue" value={formatCurrency(totalLifetime)} />
        <KpiCard label="Average LTV" value={formatCurrency(avgLifetime)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-right font-semibold">Orders</th>
              <th className="px-4 py-3 text-right font-semibold">Lifetime value</th>
              <th className="px-4 py-3 text-right font-semibold">Last order</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-[13px] text-ink-muted"
                >
                  <p className="text-[15px] font-semibold text-ink">
                    No customers yet
                  </p>
                  <p className="mt-1">
                    Every paid checkout will roll up into this list.
                  </p>
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">
                    {c.name ?? c.email.split("@")[0]}
                  </p>
                  <p className="text-[11.5px] text-ink-subtle">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {c.orderCount}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(c.totalCents)}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {formatRelativeTime(c.lastOrderAt)}
                </td>
              </tr>
            ))}
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
