import Link from "next/link";
import { Heart } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { productHref } from "@/lib/routes/public";

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
  type?: string;
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
        href={productHref(product.slug)}
        className="flex flex-col overflow-hidden rounded-[32px] border border-white/[0.08] bg-night transition-all duration-500 hover:border-lime/30 hover:shadow-2xl"
      >
        {/* Visual Preview */}
        <div className="relative overflow-hidden">
          <MonoMockup
            label={product.title}
            ratio={size === "compact" ? "aspect-[5/4]" : "aspect-[4/3]"}
            className="rounded-none border-none shadow-none"
          />
          
          {/* Wishlist Button */}
          <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-night/60 text-chalk-muted backdrop-blur-md transition-all hover:bg-night hover:text-red-500 shadow-sm">
            <Heart className="h-5 w-5" />
          </button>

          {product.bestSeller && (
            <Badge variant="ink" className="absolute left-4 top-4 h-7 rounded-full px-3 font-bold uppercase tracking-widest text-[9px]">
              Bestseller
            </Badge>
          )}
          {product.type === "BUNDLE" && (
            <Badge variant="ink" className="absolute left-4 top-14 h-7 rounded-full px-3 font-bold uppercase tracking-widest text-[9px]">
              Bundle
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="truncate text-[16px] font-bold tracking-tight text-chalk">
              {product.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {product.compareAtCents && (
                <span className="text-[12px] font-medium text-chalk-dim line-through opacity-60">
                  {formatCurrency(product.compareAtCents)}
                </span>
              )}
              <span className="text-[17px] font-black tracking-tight text-chalk">
                {formatCurrency(product.priceCents)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-6 w-6 border border-white/[0.08]">
                <AvatarImage src={product.creatorImage || undefined} />
                <AvatarFallback className="bg-lime text-[10px] font-bold text-night">
                  {product.creatorHandle.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="leading-none">
                <p className="text-[13px] font-bold text-chalk">{product.creatorHandle}</p>
                <p className="mt-0.5 text-[11px] text-chalk-muted">{product.type === "BUNDLE" ? "Bundle" : "Digital product"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 rounded-full bg-white/[0.035] px-2 py-1 text-[11px] font-bold text-chalk-muted">
              <StarRating value={product.ratingAvg} size={11} />
              <span>{product.ratingAvg.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
