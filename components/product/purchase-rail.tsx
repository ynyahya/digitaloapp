"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Download, Heart, Lock, RefreshCw, ShieldCheck, ShoppingCart, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

type LicenseOption = {
  id: string;
  name: string;
  priceCents: number;
  description: string | null;
  perks: string[];
};

export function PurchaseRail({
  product,
  licenses,
  bundleCta,
  onCheckout,
}: {
  product: {
    id: string;
    slug: string;
    title: string;
    priceCents: number;
    compareAtCents: number | null;
    instantDelivery: boolean;
    lifetimeUpdates: boolean;
    coverImage?: string | null;
    creatorId: string;
  };
  licenses: LicenseOption[];
  bundleCta?: { title: string; priceCents: number; slug: string };
  onCheckout?: (licenseId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(licenses[0]?.id ?? "");
  const selected = licenses.find((license) => license.id === selectedId);
  const priceCents = selected?.priceCents ?? product.priceCents;
  const checkoutHref = selectedId
    ? `/checkout?product=${product.slug}&license=${selectedId}&ref=purchase_rail`
    : `/checkout?product=${product.slug}&ref=purchase_rail`;

  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selected && licenses.length > 0) return;

    trackEvent("cta_click", {
      surface: "purchase_rail",
      label: "Add to Cart",
      product_slug: product.slug,
      license_id: selected?.id,
    });

    addItem({
      productId: product.id,
      licenseId: selected?.id ?? "default",
      slug: product.slug,
      title: product.title,
      priceCents,
      coverImage: product.coverImage ?? null,
      licenseName: selected?.name ?? "Standard access",
      creatorId: product.creatorId,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <aside className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.18),transparent_62%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-lime">
              <Sparkles className="h-3 w-3" />
              Checkout console
            </span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-chalk-dim">
              Secure
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-white/[0.08] bg-night/80 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-chalk-dim">Starting price</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="text-[46px] font-black leading-none tracking-[-0.07em] text-chalk">
                {priceCents === 0 ? "Free" : formatCurrency(priceCents)}
              </span>
              {product.compareAtCents && product.compareAtCents > priceCents && (
                <span className="text-[15px] text-chalk-dim line-through">
                  {formatCurrency(product.compareAtCents)}
                </span>
              )}
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-chalk-muted">
              One-time purchase · instant product access · creator-owned delivery.
            </p>
          </div>

          {licenses.length > 1 ? (
            <div className="mt-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-chalk-dim">License type</p>
              <div className="mt-3 space-y-2">
                {licenses.map((license) => (
                  <button
                    type="button"
                    key={license.id}
                    onClick={() => setSelectedId(license.id)}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                      selectedId === license.id
                        ? "border-lime/35 bg-lime/10 shadow-soft"
                        : "border-white/[0.08] bg-white/[0.025] hover:border-lime/30 hover:bg-white/[0.04]",
                    )}
                  >
                    <div>
                      <p className="text-[13.5px] font-black text-chalk">{license.name.replace("Standart", "Standard")}</p>
                      {license.description && <p className="mt-1 text-[11.5px] text-chalk-muted">{license.description}</p>}
                    </div>
                    <span className="whitespace-nowrap text-[13.5px] font-black text-chalk">{formatCurrency(license.priceCents)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-2.5 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 text-[12.5px] text-chalk-muted">
            {(selected?.perks?.length ? selected.perks : [
              "Instant access after checkout",
              "Secure customer record",
              "Creator support and updates",
            ]).map((perk) => (
              <div key={perk} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {onCheckout ? (
              <Button
                size="lg"
                className="w-full rounded-2xl"
                onClick={() => {
                  trackEvent("cta_click", {
                    surface: "purchase_rail",
                    label: "Buy Now",
                    product_slug: product.slug,
                    license_id: selectedId,
                  });
                  onCheckout(selectedId);
                }}
              >
                Get access — {priceCents === 0 ? "Free" : formatCurrency(priceCents)}
              </Button>
            ) : (
              <Button size="lg" className="w-full rounded-2xl" asChild>
                <Link
                  href={checkoutHref}
                  onClick={() =>
                    trackEvent("cta_click", {
                      surface: "purchase_rail",
                      label: "Buy Now",
                      product_slug: product.slug,
                      license_id: selectedId,
                    })
                  }
                >
                  Get access — {priceCents === 0 ? "Free" : formatCurrency(priceCents)}
                </Link>
              </Button>
            )}
            <Button size="lg" variant="secondary" className="w-full rounded-2xl" onClick={handleAddToCart} disabled={isAdded}>
              {isAdded ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" /> Add to cart
                </>
              )}
            </Button>
            <button type="button" className="mt-1 inline-flex h-9 items-center justify-center gap-1.5 self-center text-[12px] font-bold text-chalk-muted transition-colors hover:text-chalk">
              <Heart className="h-3.5 w-3.5" /> Save for later
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-5 text-[11.5px]">
            <Trust icon={Download} label={product.instantDelivery ? "Instant download" : "Creator delivery"} />
            <Trust icon={RefreshCw} label={product.lifetimeUpdates ? "Lifetime updates" : "Product updates"} />
            <Trust icon={ShieldCheck} label="Checkout protected" />
            <Trust icon={Lock} label="Secure payment" />
          </div>
        </div>
      </div>

      {bundleCta && (
        <Link href={`/p/${bundleCta.slug}`} className="group overflow-hidden rounded-[28px] border border-lime/30 bg-lime p-5 text-night shadow-[0_0_60px_rgba(180,243,0,0.16)] transition hover:-translate-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-night/60">Complete bundle upgrade</p>
          <p className="mt-2 text-[18px] font-black tracking-[-0.03em]">{bundleCta.title}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[28px] font-black tracking-[-0.06em]">{formatCurrency(bundleCta.priceCents)}</span>
            <span className="rounded-full bg-night/10 px-3 py-1 text-[11px] font-black">Save 40%</span>
          </div>
        </Link>
      )}
    </aside>
  );
}

function Trust({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-chalk-muted">
      <Icon className="h-3.5 w-3.5 text-lime" />
      <span>{label}</span>
    </div>
  );
}
