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

  // Aggregate customer stats at the DB level rather than pulling every paid
  // order row into memory. Earlier version fetched ALL paid orders + joined
  // user + items + products and rolled them up in a JS Map — that OOMs for
  // creators with thousands of orders. The new shape uses:
  //   (1) groupBy(orderItem) for lifetime value + order count per buyer
  //   (2) a separate findMany to pull the user row for the top 200 customers
  // Customers are ranked by lifetime value and capped at 200, consistent with
  // the limits used on /admin/orders and other listing surfaces.
  const TOP_N = 200;

  const orderItemGroups = await db.orderItem.groupBy({
    by: ["orderId"],
    where: {
      product: { creatorId: creator.id },
      order: { status: "PAID" },
    },
    _sum: { priceCents: true },
  });
  // Each OrderItem belongs to exactly one Order, so this maps order → creator-
  // side revenue. qty is not currently a variable in the schema's price math
  // (checkout creates one OrderItem per purchase), so we keep this as a sum of
  // priceCents and document the assumption.
  const orderToCreatorCents = new Map<string, number>();
  for (const g of orderItemGroups) {
    orderToCreatorCents.set(g.orderId, g._sum.priceCents ?? 0);
  }
  const orderIds = Array.from(orderToCreatorCents.keys());

  // Pull just enough Order fields to bucket by buyer. No item/product joins.
  const orders = orderIds.length
    ? await db.order.findMany({
        where: { id: { in: orderIds } },
        select: {
          id: true,
          email: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          },
        },
      })
    : [];

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
    const creatorTotal = orderToCreatorCents.get(o.id) ?? 0;
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
  const allCustomers = Array.from(byCustomer.values()).sort(
    (a, b) => b.totalCents - a.totalCents,
  );
  const customers = allCustomers.slice(0, TOP_N);
  const truncated = allCustomers.length > TOP_N;

  const totalLifetime = allCustomers.reduce((sum, c) => sum + c.totalCents, 0);
  const avgLifetime = allCustomers.length
    ? Math.round(totalLifetime / allCustomers.length)
    : 0;
  const totalCustomerCount = allCustomers.length;

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
        <KpiCard label="Customers" value={totalCustomerCount.toLocaleString()} />
        <KpiCard label="Lifetime revenue" value={formatCurrency(totalLifetime)} />
        <KpiCard label="Average LTV" value={formatCurrency(avgLifetime)} />
      </div>
      {truncated && (
        <p className="-mt-4 text-[11.5px] text-ink-subtle">
          Showing top {customers.length.toLocaleString()} of{" "}
          {totalCustomerCount.toLocaleString()} customers by lifetime value.
        </p>
      )}

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
