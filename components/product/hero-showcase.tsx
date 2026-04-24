import Link from "next/link";
import { Check, Eye, ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { formatCompactNumber } from "@/lib/utils";

type CreatorMini = { handle: string; displayName: string; verified: boolean };

export function HeroShowcase({
  product,
  creator,
  viewersNow = 124,
  onCheckout,
}: {
  product: {
    title: string;
    tagline: string | null;
    category: { name: string; slug: string } | null;
    ratingAvg: number;
    ratingCount: number;
    salesCount: number;
    bestSeller: boolean;
    coverImage?: string | null;
  };
  creator: CreatorMini;
  viewersNow?: number;
  onCheckout?: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-mono-radial" />
      <div className="relative mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            {product.bestSeller && <Badge variant="ink">Bestseller</Badge>}
            {product.category && (
              <Badge variant="soft" className="capitalize">
                {product.category.name}
              </Badge>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-muted">
              <Eye className="h-3.5 w-3.5" />
              {viewersNow} people viewing now
            </span>
          </div>

          <h1 className="mt-5 text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[52px]">
            {product.title}
          </h1>
          {product.tagline && (
            <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-muted md:text-[16.5px]">
              {product.tagline}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-ink-muted">
            <Link
              href={`/c/${creator.handle}`}
              className="inline-flex items-center gap-2 font-medium text-ink hover:opacity-80"
            >
              by {creator.displayName}
              {creator.verified && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-ink text-paper">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
            </Link>
            <span className="flex items-center gap-1.5">
              <StarRating value={product.ratingAvg} size={14} />
              <span className="font-medium text-ink">{product.ratingAvg.toFixed(1)}</span>
              <span>({formatCompactNumber(product.ratingCount)} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              {formatCompactNumber(product.salesCount)} sales
            </span>
          </div>

          <div className="mt-8 flex items-center gap-3">
             <button className="h-12 px-6 rounded-xl border border-line bg-paper hover:bg-paper-muted font-bold text-[14px] transition-colors shadow-soft">
                Live Preview
             </button>
             <button 
                onClick={onCheckout}
                className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[14px] shadow-card transition-colors flex items-center gap-2"
             >
                Add to cart — ${(product.priceCents / 100).toFixed(2)}
             </button>
          </div>

        </div>

        <div className="relative flex items-center justify-center">
          {product.coverImage ? (
             <div className="w-full aspect-[5/4] rounded-[32px] overflow-hidden border border-line shadow-card relative">
                <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
             </div>
          ) : (
             <MonoMockup label={product.title} ratio="aspect-[5/4]" className="shadow-float w-full" />
          )}
          <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-line bg-paper px-4 py-3 shadow-card md:flex md:items-center md:gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
              JD
            </span>
            <div>
              <p className="text-[12px] font-semibold">John D. purchased 2m ago</p>
              <p className="text-[11px] text-ink-muted">{product.title} · Personal License</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="flex items-center justify-between text-ink-muted">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em]">{label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-1 text-[22px] font-semibold tracking-tight text-ink">{value}</p>
    </div>
  );
}
