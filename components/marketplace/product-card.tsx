import Link from "next/link";
import { Heart } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ProductCardData {
  slug: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  creatorImage?: string | null;
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
    <div className="group relative">
      <Link
        href={`/p/${product.slug}`}
        className="flex flex-col overflow-hidden rounded-[32px] border border-line bg-paper transition-all duration-500 hover:border-ink/20 hover:shadow-2xl"
      >
        {/* Visual Preview */}
        <div className="relative overflow-hidden">
          <MonoMockup
            label={product.title}
            ratio={size === "compact" ? "aspect-[5/4]" : "aspect-[4/3]"}
            className="rounded-none border-none shadow-none"
          />
          
          {/* Wishlist Button */}
          <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/60 text-ink-muted backdrop-blur-md transition-all hover:bg-paper hover:text-red-500 shadow-sm">
            <Heart className="h-5 w-5" />
          </button>

          {product.bestSeller && (
            <Badge variant="ink" className="absolute left-4 top-4 h-7 rounded-full px-3 font-bold uppercase tracking-widest text-[9px]">
              Bestseller
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="truncate text-[16px] font-bold tracking-tight text-ink">
              {product.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {product.compareAtCents && (
                <span className="text-[12px] font-medium text-ink-subtle line-through opacity-60">
                  {formatCurrency(product.compareAtCents)}
                </span>
              )}
              <span className="text-[17px] font-black tracking-tight text-ink">
                {formatCurrency(product.priceCents)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-4">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-6 w-6 border border-line">
                <AvatarImage src={product.creatorImage || undefined} />
                <AvatarFallback className="bg-ink text-[10px] font-bold text-paper">
                  {product.creatorHandle.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="leading-none">
                <p className="text-[13px] font-bold text-ink">{product.creatorHandle}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">UI Kits</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 rounded-full bg-paper-soft px-2 py-1 text-[11px] font-bold text-ink-muted">
              <StarRating value={product.ratingAvg} size={11} />
              <span>{product.ratingAvg.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
