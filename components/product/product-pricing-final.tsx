import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Badge = { label: string; icon?: string | null };

interface ProductPricingFinalProps {
  title: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  checkoutHref: string;
  trustBadges: Badge[];
  refundPolicy: string;
  instantDelivery: boolean;
  lifetimeUpdates: boolean;
}

function refundLabel(policy: string): string {
  if (policy === "30_DAY") return "30-day money-back guarantee";
  if (policy === "14_DAY") return "14-day money-back guarantee";
  if (policy === "7_DAY") return "7-day money-back guarantee";
  if (policy === "NO_REFUND") return "Final sale — no refunds";
  return "Money-back guarantee";
}

export function ProductPricingFinal({
  title,
  priceCents,
  compareAtCents,
  currency,
  checkoutHref,
  trustBadges,
  refundPolicy,
  instantDelivery,
  lifetimeUpdates,
}: ProductPricingFinalProps) {
  const defaults: string[] = [];
  if (instantDelivery) defaults.push("Instant download after checkout");
  if (lifetimeUpdates) defaults.push("Lifetime updates at no extra cost");
  if (refundPolicy !== "NO_REFUND") defaults.push(refundLabel(refundPolicy));
  defaults.push("Secure checkout powered by Stripe");

  const badgeLines =
    trustBadges.length > 0 ? trustBadges.map((b) => b.label) : defaults;

  return (
    <section className="border-t border-white/[0.08] bg-lime text-night">
      <div className="mx-auto max-w-[1100px] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-chalk-dim">
            Ready to ship?
          </p>
          <h2 className="mt-4 text-balance text-[34px] font-extrabold leading-tight tracking-[-0.01em] text-night md:text-[46px]">
            Get {title} today
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-chalk-muted">
            One purchase, forever yours. Download immediately and start building.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-[520px] overflow-hidden rounded-3xl border border-white/[0.08]/10 bg-night text-chalk shadow-2xl shadow-black/30">
          <div className="p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-muted">
              One-time payment
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-[52px] font-extrabold leading-none text-chalk">
                {formatCurrency(priceCents, currency)}
              </span>
              {compareAtCents && compareAtCents > priceCents && (
                <span className="text-[18px] text-chalk-muted line-through tabular-nums">
                  {formatCurrency(compareAtCents, currency)}
                </span>
              )}
            </div>

            <Link
              href={checkoutHref.includes("?") ? `${checkoutHref}&ref=product_pricing_final` : `${checkoutHref}?ref=product_pricing_final`}
              className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-lime text-[15px] font-bold text-night transition-all hover:bg-lime/90 active:scale-[0.99]"
            >
              Buy now — {formatCurrency(priceCents, currency)}
            </Link>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11.5px] font-medium text-chalk-muted">
              <ShieldCheck className="h-3.5 w-3.5" />
              {refundLabel(refundPolicy)}
            </p>

            <ul className="mt-8 space-y-3 border-t border-white/[0.08] pt-6">
              {badgeLines.map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime">
                    <Check className="h-3 w-3 text-night" />
                  </div>
                  <span className="text-[13.5px] font-medium leading-relaxed text-chalk">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
