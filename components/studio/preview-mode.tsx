"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet, ExternalLink, ShieldCheck, Gauge, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/hooks/use-studio-state";
import { HeroShowcase } from "@/components/product/hero-showcase";
import { PurchaseRail } from "@/components/product/purchase-rail";
import { CheckoutOverlay } from "@/components/product/checkout-overlay";

export function PreviewMode() {
  const { product } = useStudio();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutLicenseId, setCheckoutLicenseId] = useState<string | null>(null);

  const seoScore = (product.metaTitle ? 50 : 0) + (product.metaDescription ? 50 : 0);
  const trustScore = (product.reviews?.length ? 50 : 0) + (product.refundPolicy ? 50 : 0);

  const handleCheckout = (licenseId?: string) => {
    setCheckoutLicenseId(licenseId || product.licenses?.[0]?.id || null);
    setIsCheckoutOpen(true);
  };

  // Normalize product data for the presentation components
  const normalizedProduct = {
    title: product.title || "Untitled Product",
    tagline: product.tagline,
    category: product.category,
    ratingAvg: product.reviews?.length ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length : 0,
    ratingCount: product.reviews?.length || 0,
    salesCount: 0,
    bestSeller: product.bestSeller,
    slug: product.slug,
    priceCents: product.priceCents,
    compareAtCents: product.compareAtCents,
    instantDelivery: product.instantDelivery,
    lifetimeUpdates: product.lifetimeUpdates,
  };

  const creator = product.creator || { handle: "creator", displayName: "Creator", verified: false };
  const licenses = product.licenses || [];

  return (
    <div className="fixed inset-0 top-16 bg-paper-sunken z-40 flex overflow-hidden">
      {/* Device Sidebar / Control Panel */}
      <aside className="w-[320px] bg-paper border-r border-line overflow-y-auto custom-scrollbar hidden lg:flex flex-col">
        <div className="px-7 py-7 border-b border-line">
          <div className="h-9 w-9 rounded-xl bg-paper-muted border border-line flex items-center justify-center mb-4">
            <Monitor className="h-4 w-4 text-ink" />
          </div>
          <h2 className="text-[16px] font-bold text-ink tracking-tight">Preview Inspector</h2>
          <p className="text-[12.5px] text-ink-muted leading-relaxed mt-1">
            Review the live buyer journey across every viewport before you publish.
          </p>
        </div>

        <div className="px-7 py-6 space-y-7 flex-1">
          <div className="space-y-3">
            <label className="text-[10.5px] font-bold text-ink-subtle uppercase tracking-[0.2em]">
              Device Viewport
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-paper-muted rounded-xl border border-line">
              {(
                [
                  { key: "desktop", icon: Monitor, label: "Desktop" },
                  { key: "tablet", icon: Tablet, label: "Tablet" },
                  { key: "mobile", icon: Smartphone, label: "Mobile" },
                ] as const
              ).map(({ key, icon: DIcon, label }) => (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg transition-all",
                    device === key
                      ? "bg-paper text-ink shadow-soft border border-line"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  <DIcon className="h-4 w-4" />
                  <span className="text-[10px] font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10.5px] font-bold text-ink-subtle uppercase tracking-[0.2em]">
              Conversion Insights
            </label>
            <div className="space-y-3">
              <ScoreItem
                icon={ShieldCheck}
                label="Trust Signals"
                score={trustScore}
              />
              <ScoreItem
                icon={Search}
                label="SEO Readiness"
                score={seoScore}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-paper-soft border border-line space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-ink-subtle" />
              <span className="text-[11px] font-bold text-ink uppercase tracking-[0.15em]">
                Staging URL
              </span>
            </div>
            <p className="text-[11.5px] text-ink-muted truncate font-mono">
              digitalo.app/p/{product.customSlug || product.slug}/preview
            </p>
            <Button
              variant="outline"
              className="w-full h-8 rounded-lg text-[11px] font-bold border-line bg-paper"
              asChild
            >
              <a
                href={`/p/${product.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </aside>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-8">
        <div className={cn(
          "bg-paper shadow-2xl transition-all duration-700 border border-line overflow-hidden relative",
          device === "desktop" && "w-full max-w-[1200px] h-[85vh] rounded-2xl",
          device === "tablet" && "w-[768px] h-[85vh] rounded-[40px] border-[12px] border-ink shadow-2xl",
          device === "mobile" && "w-[375px] h-[750px] rounded-[60px] border-[12px] border-ink shadow-2xl"
        )}>
          {/* Real Page Rendering */}
          <div className="w-full h-full bg-paper overflow-y-auto custom-scrollbar relative">
             <div className="pointer-events-none pb-24">
               {/* Navbar mockup */}
               <div className="h-14 border-b border-line px-8 flex items-center justify-between bg-paper">
                  <span className="font-bold text-[14px]">Digitalo</span>
                  <div className="h-8 w-8 rounded-full bg-paper-muted overflow-hidden">
                     {creator?.avatarUrl ? <img src={creator.avatarUrl} className="w-full h-full object-cover" /> : null}
                  </div>
               </div>
               
               {/* Sticky Action Header (UI8 style) */}
               <div className="sticky top-0 z-20 bg-paper/80 backdrop-blur-md border-b border-line px-8 py-3 flex items-center justify-between opacity-0 animate-in fade-in slide-in-from-top-4 duration-500 delay-1000 fill-mode-forwards">
                  <div className="flex items-center gap-3">
                     <span className="font-bold text-[14px] text-ink">{normalizedProduct.title}</span>
                     <span className="px-2 py-0.5 rounded-full bg-ink text-paper text-[10px] font-bold">New</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="font-bold text-[14px]">${(normalizedProduct.priceCents / 100).toFixed(2)}</span>
                     <Button onClick={() => handleCheckout()} className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-[12px]">Add to cart</Button>
                  </div>
               </div>

               {/* Main Product View */}
               <div>
                 <HeroShowcase product={normalizedProduct} creator={creator} viewersNow={12} onCheckout={() => handleCheckout()} />
                 
                 {/* UI8 Prominent Gallery Grid */}
                 {(() => {
                    let gallery: string[] = [];
                    try { gallery = product.gallery ? JSON.parse(product.gallery) : []; } catch {}
                    if (gallery.length === 0) return null;
                    return (
                      <div className="mx-auto w-full max-w-[1200px] px-5 pt-8 md:px-8">
                         <div className="grid grid-cols-2 gap-4 md:gap-6">
                           {gallery.map((img, i) => (
                             <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden border border-line shadow-soft">
                               <img src={img} className="w-full h-full object-cover" alt={`Preview ${i+1}`} />
                             </div>
                           ))}
                         </div>
                      </div>
                    );
                 })()}

                 <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1fr_380px] lg:gap-20">
                   {/* Left Column: Overview Description */}
                   <div className="space-y-8">
                     <h2 className="text-[24px] font-bold text-ink">Overview</h2>
                     {product.description ? (
                       <div 
                         className="prose prose-sm prose-p:text-ink-muted prose-headings:text-ink prose-a:text-blue-500 max-w-none"
                         dangerouslySetInnerHTML={{ __html: product.description }}
                       />
                     ) : (
                       <p className="text-ink-muted text-[14px]">No description provided yet.</p>
                     )}
                   </div>

                   {/* Right Column: Highlights & Purchase Rail */}
                   <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
                     {/* Highlights Block */}
                     {(() => {
                        let highlights: string[] = [];
                        try { highlights = product.included ? JSON.parse(product.included) : []; } catch {}
                        if (highlights.length === 0) return null;
                        return (
                          <div className="space-y-4">
                            <h3 className="text-[16px] font-bold text-ink">Highlights</h3>
                            <ul className="space-y-3">
                              {highlights.map((h, i) => (
                                <li key={i} className="flex items-center gap-3 text-[13px] text-ink-muted">
                                  <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                     })()}

                     {/* Format Info (UI8 Style) */}
                     <div className="space-y-4 pt-4 border-t border-line">
                       <h3 className="text-[16px] font-bold text-ink">Format</h3>
                       <div className="flex gap-2">
                         <div className="px-3 py-1 rounded-md bg-paper-muted border border-line text-[12px] font-medium text-ink-muted">PDF</div>
                         <div className="px-3 py-1 rounded-md bg-paper-muted border border-line text-[12px] font-medium text-ink-muted">Figma</div>
                       </div>
                       <p className="text-[12px] text-ink-muted flex items-center gap-2 pt-2">
                         <Globe className="h-4 w-4" /> Secure instant download
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
      {/* Checkout Overlay Modal */}
      <CheckoutOverlay 
        product={normalizedProduct} 
        licenses={licenses}
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}

function ScoreItem({
  icon: Icon,
  label,
  score,
}: {
  icon: any;
  label: string;
  score: number;
}) {
  const tone =
    score >= 100
      ? "text-emerald-600"
      : score >= 50
      ? "text-amber-600"
      : "text-red-500";
  const barTone =
    score >= 100
      ? "bg-emerald-500"
      : score >= 50
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="h-3.5 w-3.5 text-ink-subtle" />
          <span className="text-[12.5px] font-bold text-ink">{label}</span>
        </div>
        <span className={cn("text-[12.5px] font-bold tabular-nums", tone)}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-paper-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barTone)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
