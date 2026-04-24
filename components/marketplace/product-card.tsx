import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export interface ProductCardData {
  slug: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  priceCents: number;
  compareAtCents?: number | null;
  ratingAvg: number;
  salesCount: number;
  bestSeller?: boolean;
  instantDelivery?: boolean;
}

export function ProductCard({
  product,
  size = "default",
}: {
  product: ProductCardData;
  size?: "default" | "compact";
}) {
  return (
    <Link
      href={`/p/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
    >
      <MonoMockup
        label={product.title}
        ratio={size === "compact" ? "aspect-[5/4]" : "aspect-[4/3]"}
        className="rounded-b-none"
      />
      {product.bestSeller && (
        <Badge variant="ink" className="absolute left-4 top-4">
          Bestseller
        </Badge>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-tight text-ink">
            {product.title}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-semibold text-ink">
              {formatCurrency(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <span className="text-[11px] text-ink-subtle line-through">
                {formatCurrency(product.compareAtCents)}
              </span>
            )}
          </div>
        </div>
        <p className="text-[12.5px] text-ink-muted">
          by {product.creatorName}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] text-ink-muted">
            <StarRating value={product.ratingAvg} size={12} />
            <span className="text-ink">{product.ratingAvg.toFixed(1)}</span>
          </div>
          <span className="text-[12px] text-ink-muted">
            {formatCompactNumber(product.salesCount)} sales
          </span>
        </div>
      </div>
    </Link>
  );
}
