import Link from "next/link";
import { db } from "@/lib/db";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews · Digitalo Admin" };

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      product: { select: { title: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Reviews
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Latest customer reviews
        </h1>
      </div>

      <div className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {reviews.length === 0 && (
          <p className="px-5 py-10 text-center text-[13px] text-ink-muted">
            No reviews yet.
          </p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                <span className="font-semibold text-ink">
                  {r.user?.name ?? r.user?.email.split("@")[0] ?? "Anonymous"}
                </span>
                <span>·</span>
                <Link
                  href={`/p/${r.product.slug}`}
                  target="_blank"
                  className="font-medium text-ink hover:underline"
                >
                  {r.product.title}
                </Link>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                <span className="font-semibold text-ink">
                  {"★".repeat(r.rating)}
                  <span className="text-ink-subtle">
                    {"★".repeat(Math.max(0, 5 - r.rating))}
                  </span>
                </span>
                <span>{formatRelativeTime(r.createdAt)}</span>
              </div>
            </div>
            {r.title && (
              <p className="mt-2 text-[14px] font-semibold text-ink">
                {r.title}
              </p>
            )}
            {r.body && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                {r.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
