import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ProductRowActions } from "@/components/studio/product-row-actions";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products · Digitalo" };

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/products");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) redirect("/dashboard");

  const products = await db.product.findMany({
    where: { creatorId: creator.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      priceCents: true,
      salesCount: true,
      ratingAvg: true,
      ratingCount: true,
      updatedAt: true,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Products
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
              Your catalog
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              {products.length} product{products.length === 1 ? "" : "s"} — manage pricing,
              licenses, and publishing.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4" /> New product
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Price</th>
              <th className="px-4 py-3 text-right font-semibold">Sales</th>
              <th className="px-4 py-3 text-right font-semibold">Rating</th>
              <th className="px-4 py-3 text-right font-semibold">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-[13px] text-ink-muted"
                >
                  <p className="text-[15px] font-semibold text-ink">No products yet</p>
                  <p className="mt-1 text-ink-muted">
                    Create your first product to list it on your storefront.
                  </p>
                  <Button asChild className="mt-5">
                    <Link href="/dashboard/products/new">
                      <Plus className="h-4 w-4" /> New product
                    </Link>
                  </Button>
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-ink transition-colors hover:opacity-80"
                  >
                    {p.title}
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-subtle" />
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-subtle">
                    /p/{p.slug}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(p.priceCents)}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {p.salesCount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {p.ratingCount > 0 ? (
                    <>★ {p.ratingAvg.toFixed(1)} · {p.ratingCount}</>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {formatRelativeTime(p.updatedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ProductRowActions
                    id={p.id}
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
