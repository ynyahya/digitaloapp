import { db } from "@/lib/db";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity · Digitalo Admin" };

type Event = {
  at: Date;
  type: "signup" | "product" | "order" | "review";
  title: string;
  meta: string;
};

export default async function AdminActivityPage() {
  const [users, products, orders, reviews] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { email: true, name: true, role: true, createdAt: true },
    }),
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        creator: { select: { handle: true } },
      },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        totalCents: true,
        currency: true,
        email: true,
        createdAt: true,
      },
    }),
    db.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        rating: true,
        createdAt: true,
        product: { select: { title: true } },
        user: { select: { email: true, name: true } },
      },
    }),
  ]);

  const events: Event[] = [
    ...users.map<Event>((u) => ({
      at: u.createdAt,
      type: "signup",
      title: `${u.name ?? u.email} signed up`,
      meta: u.role,
    })),
    ...products.map<Event>((p) => ({
      at: p.createdAt,
      type: "product",
      title: `${p.title} — @${p.creator.handle}`,
      meta: p.status,
    })),
    ...orders.map<Event>((o) => ({
      at: o.createdAt,
      type: "order",
      title: `Order #${o.id.slice(-8)} — ${o.email}`,
      meta: `${o.status} · ${formatCurrency(o.totalCents, o.currency)}`,
    })),
    ...reviews.map<Event>((r) => ({
      at: r.createdAt,
      type: "review",
      title: `${r.user?.name ?? r.user?.email ?? "Anonymous"} reviewed ${r.product.title}`,
      meta: `${r.rating}/5`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 60);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Activity
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Platform feed
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          Most recent 60 events across signups, products, orders, and reviews.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {events.length === 0 && (
          <p className="px-5 py-10 text-center text-[13px] text-ink-muted">
            No activity yet.
          </p>
        )}
        {events.map((e, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex items-center gap-3 text-[13px]">
              <EventPill type={e.type} />
              <p className="text-ink">{e.title}</p>
            </div>
            <div className="flex items-center gap-3 text-[11.5px] text-ink-subtle">
              <span className="font-medium text-ink-muted">{e.meta}</span>
              <span>{formatRelativeTime(e.at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventPill({ type }: { type: Event["type"] }) {
  const label: Record<Event["type"], string> = {
    signup: "Signup",
    product: "Product",
    order: "Order",
    review: "Review",
  };
  return (
    <span className="inline-flex h-5 items-center rounded-full border border-line bg-paper-soft px-2 text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
      {label[type]}
    </span>
  );
}
