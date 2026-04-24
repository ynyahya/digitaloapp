import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ProductAdminActions } from "@/components/admin/product-admin-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products · Digitalo Admin" };

const STATUSES = ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const active = (searchParams?.status ?? "ALL").toUpperCase();
  const statusFilter = STATUSES.includes(active as (typeof STATUSES)[number])
    ? active
    : "ALL";

  const products = await db.product.findMany({
    where: statusFilter !== "ALL" ? { status: statusFilter } : {},
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: {
      creator: { select: { handle: true, displayName: true } },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Products
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Every product in the catalog
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/products" : `/admin/products?status=${s}`}
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
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Creator</th>
              <th className="px-4 py-3 text-right font-semibold">Price</th>
              <th className="px-4 py-3 text-right font-semibold">Sales</th>
              <th className="px-4 py-3 text-right font-semibold">Rating</th>
              <th className="px-4 py-3 text-right font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-[13px] text-ink-muted"
                >
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/p/${p.slug}`}
                    target="_blank"
                    className="font-medium text-ink hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-[11.5px] text-ink-subtle">/{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  <Link
                    href={`/c/${p.creator.handle}`}
                    target="_blank"
                    className="hover:text-ink"
                  >
                    @{p.creator.handle}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(p.priceCents, p.currency)}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {p.salesCount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {p.ratingCount > 0 ? `★ ${p.ratingAvg.toFixed(1)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {formatRelativeTime(p.updatedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ProductAdminActions
                    productId={p.id}
                    slug={p.slug}
                    status={p.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"}
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

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-ink text-paper",
    DRAFT: "bg-paper-soft text-ink-muted ring-1 ring-line",
    ARCHIVED: "bg-paper-muted text-ink-subtle",
  };
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide ${styles[status] ?? ""}`}
    >
      {status}
    </span>
  );
}
