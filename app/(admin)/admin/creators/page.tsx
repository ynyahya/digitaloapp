import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { CreatorRowActions } from "@/components/admin/creator-row-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creators · Digitalo Admin" };

export default async function AdminCreatorsPage() {
  const creators = await db.creator.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      _count: { select: { products: true } },
      metrics: true,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Creators
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Every seller on Digitalo
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          Verify, inspect, or investigate. Ordered by most recent sign-up.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-4 py-3 text-left font-semibold">Creator</th>
              <th className="px-4 py-3 text-right font-semibold">Products</th>
              <th className="px-4 py-3 text-right font-semibold">Lifetime sales</th>
              <th className="px-4 py-3 text-right font-semibold">Rating</th>
              <th className="px-4 py-3 text-right font-semibold">Joined</th>
              <th className="px-4 py-3 text-right font-semibold">Verified</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {creators.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[13px] text-ink-muted"
                >
                  No creators yet.
                </td>
              </tr>
            )}
            {creators.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/c/${c.handle}`}
                    className="font-medium text-ink hover:underline"
                    target="_blank"
                  >
                    {c.displayName}
                  </Link>
                  <p className="text-[11.5px] text-ink-subtle">
                    @{c.handle} · {c.user.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {c._count.products}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(c.metrics?.totalSalesCents ?? 0)}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {c.metrics?.avgRating && c.metrics.avgRating > 0
                    ? `★ ${c.metrics.avgRating.toFixed(1)}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {formatRelativeTime(c.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <VerifiedPill verified={c.verified} />
                </td>
                <td className="px-4 py-3 text-right">
                  <CreatorRowActions
                    creatorId={c.id}
                    verified={c.verified}
                    handle={c.handle}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VerifiedPill({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide ${
        verified
          ? "bg-ink text-paper"
          : "bg-paper-muted text-ink-subtle ring-1 ring-line"
      }`}
    >
      {verified ? "Verified" : "Pending"}
    </span>
  );
}
