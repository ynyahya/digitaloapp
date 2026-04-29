"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, PlayCircle, ShieldCheck, Zap, RefreshCw, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { formatCompactNumber, formatCurrency, cn } from "@/lib/utils";

type CreatorMini = { handle: string; displayName: string; verified: boolean };
type Chip = { label: string; href?: string | null };

export function HeroShowcase({
  product,
  creator,
  techStack,
  hasDemo,
  viewersNow = 124,
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
    priceCents: number;
    compareAtCents: number | null;
    currency: string;
    instantDelivery: boolean;
    lifetimeUpdates: boolean;
    refundPolicy: string;
  };
  creator: CreatorMini;
  techStack?: Chip[];
  hasDemo?: boolean;
  viewersNow?: number;
}) {
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round(
          ((product.compareAtCents - product.priceCents) /
            product.compareAtCents) *
            100,
        )
      : 0;

  const scrollToPurchase = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById("purchase-rail");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const scrollToDemo = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById("demo");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="overview" className="relative overflow-hidden border-b border-line bg-paper">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mono-radial" />
      <div className="relative mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            {product.bestSeller && <Badge variant="ink">Bestseller</Badge>}
            {product.category && (
              <Badge variant="soft" className="capitalize">
                {product.category.name}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="soft" className="border-ink/15 bg-ink/5 text-ink">
                {discount}% off
              </Badge>
            )}
          </div>

          <h1 className="mt-5 text-balance text-[36px] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink md:text-[52px] lg:text-[56px]">
            {product.title}
          </h1>
          {product.tagline && (
            <p className="mt-4 max-w-xl text-pretty text-[16px] leading-relaxed text-ink-muted md:text-[18px]">
              {product.tagline}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-ink-muted">
            <Link
              href={`/c/${creator.handle}`}
              className="inline-flex items-center gap-2 font-semibold text-ink hover:opacity-80"
            >
              by {creator.displayName}
              {creator.verified && (
                <BadgeCheck className="h-4 w-4 text-ink" />
              )}
            </Link>
            {product.ratingAvg > 0 && (
              <span className="flex items-center gap-1.5">
                <StarRating value={product.ratingAvg} size={14} />
                <span className="font-semibold text-ink tabular-nums">
                  {product.ratingAvg.toFixed(1)}
                </span>
                <span>({formatCompactNumber(product.ratingCount)})</span>
              </span>
            )}
            {product.salesCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                {formatCompactNumber(product.salesCount)} sold
              </span>
            )}
          </div>

          {techStack && techStack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {techStack.slice(0, 6).map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center rounded-full border border-line bg-paper-soft px-2.5 py-1 text-[11.5px] font-semibold text-ink-muted"
                >
                  {chip.label}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span className="text-[38px] font-extrabold tracking-tight text-ink">
              {formatCurrency(product.priceCents, product.currency)}
            </span>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <span className="text-[18px] text-ink-subtle line-through tabular-nums">
                {formatCurrency(product.compareAtCents, product.currency)}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToPurchase}
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-6 text-[14px] font-bold text-paper shadow-float transition-all hover:bg-ink-soft active:scale-[0.98]"
            >
              Buy now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {hasDemo && (
              <button
                type="button"
                onClick={scrollToDemo}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-line bg-paper px-5 text-[14px] font-semibold text-ink shadow-soft transition-all hover:border-ink/30 active:scale-[0.98]"
              >
                <PlayCircle className="h-4 w-4" />
                Live preview
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 border-t border-line pt-6 text-[12px] text-ink-muted">
            {product.instantDelivery && (
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-ink" />
                Instant delivery
              </span>
            )}
            {product.lifetimeUpdates && (
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-ink" />
                Lifetime updates
              </span>
            )}
            {product.refundPolicy !== "NO_REFUND" && (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-ink" />
                {product.refundPolicy === "7_DAY"
                  ? "7-day refund"
                  : product.refundPolicy === "14_DAY"
                    ? "14-day refund"
                    : "30-day refund"}
              </span>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          {product.coverImage ? (
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-[28px] border border-line shadow-2xl aspect-[5/4]",
              )}
            >
              <Image
                src={product.coverImage}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ) : (
            <MonoMockup
              label={product.title}
              ratio="aspect-[5/4]"
              className="w-full shadow-2xl"
            />
          )}
          {viewersNow > 0 && (
            <div className="absolute -bottom-5 left-5 hidden items-center gap-2.5 rounded-2xl border border-line bg-paper px-4 py-2.5 shadow-float md:flex">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11.5px] font-medium text-ink-muted">
                {viewersNow} viewing now
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
