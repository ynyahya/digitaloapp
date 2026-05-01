"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  CheckCircle2,
  Eye,
  Package,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { trackEvent } from "@/lib/analytics/track";
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
      ? Math.round(((product.compareAtCents - product.priceCents) / product.compareAtCents) * 100)
      : 0;
  const isSparse = !product.tagline && !product.coverImage && product.priceCents === 0 && product.salesCount === 0;
  const headline = product.title?.trim() || "Premium digital product";
  const subline = product.tagline ||
    `A polished creator offer by ${creator.displayName}. This preview uses TESKEL's launch-room layout so even early drafts feel premium before the full copy is complete.`;
  const priceLabel = product.priceCents === 0 ? "Free preview" : formatCurrency(product.priceCents, product.currency);

  const scrollToPurchase = () => {
    if (typeof document === "undefined") return;
    trackEvent("cta_click", {
      surface: "product_hero",
      label: "Buy now",
      action: "scroll_to_purchase",
    });
    const el = document.getElementById("purchase-rail");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const scrollToDemo = () => {
    if (typeof document === "undefined") return;
    trackEvent("cta_click", {
      surface: "product_hero",
      label: "Live preview",
      action: "scroll_to_demo",
    });
    const el = document.getElementById("demo");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="overview" className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-night" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1050px] grid-dark mask-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[980px] bg-lime-glow" />
      <div className="pointer-events-none absolute -left-40 top-32 -z-10 h-[460px] w-[460px] rounded-full bg-lime/[0.08] blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-36 top-12 -z-10 h-[460px] w-[460px] rounded-full bg-violet/[0.16] blur-3xl animate-drift [animation-delay:-2s]" />

      <div className="mx-auto grid w-full max-w-[1360px] gap-12 px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24 lg:grid-cols-[1fr_520px] lg:px-10">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 text-[12px] text-chalk-muted backdrop-blur-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[10.5px] font-black uppercase tracking-wider text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(180,243,0,0.8)] animate-pulse-soft" />
                Product preview
              </span>
              <span className="font-medium">Launch-room public page</span>
            </span>
            {product.bestSeller && <Badge variant="ink">Bestseller</Badge>}
            {product.category && <Badge variant="soft" className="capitalize">{product.category.name}</Badge>}
            {discount > 0 && <Badge variant="soft" className="border-lime/30 bg-lime/10 text-lime">{discount}% off</Badge>}
            {isSparse && <Badge variant="soft" className="border-violet/30 bg-violet/10 text-chalk">Draft copy</Badge>}
          </div>

          <h1 className="mt-8 max-w-[840px] text-balance text-[46px] font-black leading-[1.01] tracking-[-0.055em] text-chalk md:text-[82px]">
            {headline} <span className="gradient-text-lime lime-text-glow">built to sell.</span>
          </h1>
          <p className="mt-6 max-w-[680px] text-[16px] leading-relaxed text-chalk-muted md:text-[19px]">
            {subline}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-chalk-muted">
            <Link href={`/c/${creator.handle}`} className="inline-flex items-center gap-2 font-black text-chalk transition hover:text-lime">
              by {creator.displayName}
              {creator.verified && <BadgeCheck className="h-4 w-4 text-lime" />}
            </Link>
            {product.ratingAvg > 0 ? (
              <span className="flex items-center gap-1.5">
                <StarRating value={product.ratingAvg} size={14} />
                <span className="font-black text-chalk tabular-nums">{product.ratingAvg.toFixed(1)}</span>
                <span>({formatCompactNumber(product.ratingCount)})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-lime" /> New launch</span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              {product.salesCount > 0 ? `${formatCompactNumber(product.salesCount)} sold` : "Ready for first customers"}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {(techStack && techStack.length > 0 ? techStack.slice(0, 6) : [
              { label: "Instant checkout" },
              { label: "Secure delivery" },
              { label: "Creator-owned" },
            ]).map((chip) => (
              <span key={chip.label} className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11.5px] font-bold text-chalk-muted backdrop-blur-xl">
                {chip.label}
              </span>
            ))}
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-[auto_auto_1fr] sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-chalk-dim">Starting at</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="text-[50px] font-black leading-none tracking-[-0.07em] text-chalk md:text-[64px]">{priceLabel}</span>
                {product.compareAtCents && product.compareAtCents > product.priceCents && (
                  <span className="text-[18px] text-chalk-dim line-through tabular-nums">{formatCurrency(product.compareAtCents, product.currency)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={scrollToPurchase} className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-black text-night lime-shadow transition hover:bg-lime-bright active:scale-[0.98]">
              Get this product
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {hasDemo ? (
              <button type="button" onClick={scrollToDemo} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-5 text-[14px] font-bold text-chalk shadow-soft backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.05] active:scale-[0.98]">
                <PlayCircle className="h-4 w-4" />
                Live preview
              </button>
            ) : (
              <Link href="#purchase-rail" className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-5 text-[14px] font-bold text-chalk shadow-soft backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.05]">
                View checkout
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-9 grid gap-3 border-t border-white/[0.08] pt-6 sm:grid-cols-3">
            <TrustPill icon={Zap} label={product.instantDelivery ? "Instant delivery" : "Creator delivery"} />
            <TrustPill icon={RefreshCw} label={product.lifetimeUpdates ? "Lifetime updates" : "Updated product"} />
            <TrustPill icon={ShieldCheck} label={product.refundPolicy === "NO_REFUND" ? "Secure checkout" : product.refundPolicy === "7_DAY" ? "7-day refund" : product.refundPolicy === "14_DAY" ? "14-day refund" : "30-day refund"} />
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[540px] overflow-hidden rounded-[36px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.22),transparent_62%)]" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-night-well">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-lime" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-chalk-dim">TESKEL preview</span>
              </div>
              {product.coverImage ? (
                <div className={cn("relative aspect-[5/4] w-full overflow-hidden")}>
                  <Image src={product.coverImage} alt={product.title} fill priority className="object-cover" sizes="(min-width: 1024px) 520px, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
                </div>
              ) : (
                <MonoMockup label={product.title} ratio="aspect-[5/4]" className="rounded-none border-none shadow-none" />
              )}
              <div className="grid gap-px bg-white/[0.08] sm:grid-cols-3">
                <PreviewMetric icon={Eye} label="Viewers" value={formatCompactNumber(viewersNow)} />
                <PreviewMetric icon={Box} label="Delivery" value="Instant" />
                <PreviewMetric icon={CheckCircle2} label="Status" value="Ready" />
              </div>
            </div>
            <div className="relative mt-4 rounded-2xl border border-lime/20 bg-lime/10 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-lime">Launch signal</p>
              <p className="mt-2 text-[13px] leading-relaxed text-chalk-muted">
                This page is structured to stay premium even before the creator adds full gallery, copy, reviews, or FAQ content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustPill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-[12px] font-bold text-chalk-muted backdrop-blur-xl">
      <Icon className="h-3.5 w-3.5 text-lime" />
      {label}
    </span>
  );
}

function PreviewMetric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-night p-4">
      <Icon className="h-3.5 w-3.5 text-lime" />
      <p className="mt-3 text-[17px] font-black tracking-[-0.03em] text-chalk">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-chalk-dim">{label}</p>
    </div>
  );
}
