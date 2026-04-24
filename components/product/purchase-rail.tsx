"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Download, Heart, Lock, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

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
    slug: string;
    title: string;
    priceCents: number;
    compareAtCents: number | null;
    instantDelivery: boolean;
    lifetimeUpdates: boolean;
  };
  licenses: LicenseOption[];
  bundleCta?: { title: string; priceCents: number; slug: string };
  onCheckout?: (licenseId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(licenses[0]?.id ?? "");
  const selected = licenses.find((l) => l.id === selectedId);
  const priceCents = selected?.priceCents ?? product.priceCents;

  return (
    <aside className="flex flex-col gap-5">
      <div className="rounded-2xl border border-line bg-paper p-6 shadow-soft">
        <div className="flex items-baseline gap-3">
          <span className="text-[38px] font-semibold tracking-tight text-ink">
            {formatCurrency(priceCents)}
          </span>
          {product.compareAtCents && product.compareAtCents > priceCents && (
            <span className="text-[15px] text-ink-subtle line-through">
              {formatCurrency(product.compareAtCents)}
            </span>
          )}
        </div>
        <p className="mt-1 text-[12.5px] text-ink-muted">One-time purchase · Lifetime updates</p>

        {licenses.length > 1 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              License type
            </p>
            <div className="mt-2 space-y-2">
              {licenses.map((l) => (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    selectedId === l.id
                      ? "border-ink bg-paper shadow-soft"
                      : "border-line bg-paper hover:border-ink/30",
                  )}
                >
                  <div>
                    <p className="text-[13.5px] font-semibold">{l.name}</p>
                    {l.description && (
                      <p className="mt-0.5 text-[11.5px] text-ink-muted">{l.description}</p>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-[13.5px] font-semibold">
                    {formatCurrency(l.priceCents)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2.5 text-[12.5px] text-ink-muted">
          {(selected?.perks ?? []).map((perk) => (
            <div key={perk} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink" />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {onCheckout ? (
            <Button size="lg" className="w-full" onClick={() => onCheckout(selectedId)}>
              Buy Now — {formatCurrency(priceCents)}
            </Button>
          ) : (
            <Button size="lg" className="w-full" asChild>
              <Link href={`/checkout?product=${product.slug}&license=${selectedId}`}>
                Buy Now — {formatCurrency(priceCents)}
              </Link>
            </Button>
          )}
          <Button size="lg" variant="secondary" className="w-full" onClick={() => onCheckout?.(selectedId)}>
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </Button>
          <button
            type="button"
            className="mt-1 inline-flex h-9 items-center justify-center gap-1.5 self-center text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <Heart className="h-3.5 w-3.5" /> Save for later
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-[11.5px]">
          <Trust icon={Download} label="Instant download" />
          <Trust icon={RefreshCw} label="Lifetime updates" />
          <Trust icon={Check} label="30-day guarantee" />
          <Trust icon={Lock} label="Secure checkout" />
        </div>
      </div>

      {bundleCta && (
        <Link
          href={`/p/${bundleCta.slug}`}
          className="group rounded-2xl border border-ink bg-ink p-5 text-paper shadow-card transition-shadow hover:shadow-float"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/60">
            Complete Bundle Upgrade
          </p>
          <p className="mt-2 text-[15px] font-semibold">{bundleCta.title}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[22px] font-semibold">{formatCurrency(bundleCta.priceCents)}</span>
            <span className="rounded-full bg-paper/10 px-3 py-1 text-[11px] font-medium">
              Save 40%
            </span>
          </div>
        </Link>
      )}
    </aside>
  );
}

function Trust({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-ink-muted">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
