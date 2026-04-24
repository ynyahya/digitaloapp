"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Zap,
  Layout,
  CreditCard,
  Box,
  MessageSquare,
  Info,
  Settings2,
  Plus,
  Layers,
  Star,
  PlusCircle,
  Trash2,
  UploadCloud,
  ListChecks,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/hooks/use-studio-state";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { BlockWrapper } from "./block-wrapper";
import { SEOBlock } from "./seo-block";
import { DiscountBlock } from "./discount-block";
import { StudioSection } from "./studio-canvas";

const INPUT_BASE =
  "w-full bg-paper border border-line rounded-xl px-4 py-3 text-[13px] text-ink placeholder:text-ink-subtle outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all";
const LABEL_BASE =
  "text-[11px] font-bold text-ink-subtle uppercase tracking-wider";
const COUNTER_BASE = "text-[10px] text-ink-muted tabular-nums";

export function HeroBlock() {
  const { product, setField } = useStudio();

  return (
    <BlockWrapper
      icon={Layout}
      label="Basic Information"
      description="Name, tagline, and primary description"
      className="col-span-12 lg:col-span-7"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className={LABEL_BASE}>Product Name</label>
          <input
            type="text"
            value={product.title}
            onChange={(e) => setField("title", e.target.value)}
            className="w-full bg-paper border border-line rounded-xl px-4 py-3 text-[16px] font-bold text-ink placeholder:text-ink-subtle outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all"
            placeholder="e.g. Masterclass Course"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={LABEL_BASE}>Tagline / Category</label>
            <span className={COUNTER_BASE}>{product.tagline?.length || 0}/120</span>
          </div>
          <input
            type="text"
            value={product.tagline || ""}
            onChange={(e) => setField("tagline", e.target.value)}
            maxLength={120}
            className={INPUT_BASE}
            placeholder="e.g. Launch your SaaS in days"
          />
        </div>

        <div className="space-y-2">
          <label className={`${LABEL_BASE} block`}>Short Description</label>
          <RichTextEditor
            value={product.description || ""}
            onChange={(val) => setField("description", val)}
            placeholder="Write a compelling description of your product..."
          />
        </div>
      </div>
    </BlockWrapper>
  );
}

export function ProductCoverBlock() {
  const { product, setField } = useStudio();

  return (
    <BlockWrapper
      icon={ImageIcon}
      label="Product Cover"
      description="Hero image shown on the storefront"
      className="col-span-12 lg:col-span-5"
    >
      <div className="space-y-4">
        <div className="aspect-[21/9] rounded-2xl bg-paper-muted border border-line overflow-hidden relative group/cover cursor-pointer">
          {product.coverImage ? (
            <img
              src={product.coverImage}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105"
              alt="Cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted gap-1.5">
              <UploadCloud className="h-7 w-7 opacity-50" />
              <span className="text-[12px] font-bold">Upload Cover Image</span>
              <span className="text-[10.5px] text-ink-subtle">1200 × 630 recommended</span>
            </div>
          )}

          <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center transition-all">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 rounded-xl bg-paper text-ink font-bold shadow-float"
              onClick={() =>
                setField(
                  "coverImage",
                  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop"
                )
              }
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Replace (Demo)
            </Button>
          </div>
        </div>
        <p className="text-[11px] text-ink-subtle leading-relaxed">
          PNG, JPG, or WebP. Keep the focal point near the center — it will be cropped on smaller screens.
        </p>
      </div>
    </BlockWrapper>
  );
}

export function MediaGalleryBlock() {
  const { product, setField } = useStudio();
  let gallery: string[] = [];
  try {
    gallery = product.gallery ? JSON.parse(product.gallery) : [];
  } catch {
    gallery = [];
  }

  const addDemoImage = () => {
    const demos = [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
    ];
    const newGallery = [...gallery, demos[gallery.length % demos.length]];
    setField("gallery", JSON.stringify(newGallery));
  };

  const removeImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setField("gallery", JSON.stringify(newGallery));
  };

  return (
    <BlockWrapper
      icon={ImageIcon}
      label="Media Gallery"
      description="Screenshots shown beneath the hero on the product page"
      className="col-span-12"
    >
      <div className="space-y-4">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-xl border border-line overflow-hidden group/media bg-paper-muted"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt={`Gallery ${idx + 1}`}
                />
                <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => removeImage(idx)}
                    className="h-8 w-8 rounded-lg shadow-card bg-paper text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 rounded-2xl border border-dashed border-line bg-paper-soft">
            <ImageIcon className="h-8 w-8 text-ink-subtle opacity-60 mb-2" />
            <p className="text-[12.5px] font-bold text-ink">No images yet</p>
            <p className="text-[11.5px] text-ink-muted max-w-xs mt-1">
              Add screenshots or preview images — they will appear below the product description.
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={addDemoImage}
          className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Gallery Image (Demo)
        </Button>
      </div>
    </BlockWrapper>
  );
}

export function HighlightsBlock() {
  const { product, setField } = useStudio();
  let highlights: string[] = [];
  try {
    highlights = product.included ? JSON.parse(product.included) : [];
  } catch {
    highlights = [];
  }

  const [newItem, setNewItem] = useState("");

  const addHighlight = () => {
    if (!newItem.trim()) return;
    const newHighlights = [...highlights, newItem.trim()];
    setField("included", JSON.stringify(newHighlights));
    setNewItem("");
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setField("included", JSON.stringify(newHighlights));
  };

  return (
    <BlockWrapper
      icon={ListChecks}
      label="Highlights & Formats"
      description="Key features, deliverables, or formats included"
      className="col-span-12 lg:col-span-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {highlights.length > 0 ? (
            highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft group/item"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-[13px] text-ink truncate">{item}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHighlight(idx)}
                  className="h-8 w-8 text-ink-subtle opacity-0 group-hover/item:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={ListChecks}
              title="No highlights added yet"
              description="Add key features buyers will see next to the description."
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHighlight()}
            placeholder="e.g. 25 Fully Customizable Slides"
            className="flex-1 bg-paper border border-line rounded-xl px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all"
          />
          <Button
            onClick={addHighlight}
            disabled={!newItem.trim()}
            className="h-10 px-4 rounded-xl bg-ink text-paper font-bold text-[13px] disabled:opacity-40"
          >
            Add
          </Button>
        </div>
      </div>
    </BlockWrapper>
  );
}

export function AssetBlock() {
  const { product } = useStudio();
  const files = product.files || [];

  return (
    <BlockWrapper
      icon={Box}
      label="Digital Assets"
      description="Files delivered to buyers after checkout"
      className="col-span-12 lg:col-span-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {files.length > 0 ? (
            files.map((asset, i) => (
              <div
                key={asset.id || i}
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft hover:bg-paper-muted transition-colors cursor-pointer group/asset"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-paper border border-line flex items-center justify-center group-hover/asset:bg-ink group-hover/asset:text-paper group-hover/asset:border-ink transition-colors shrink-0">
                    <Box className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-[12.5px] font-bold text-ink truncate">
                        {asset.filename}
                      </p>
                      <span className="px-1.5 py-0.5 rounded-md bg-paper border border-line text-[9.5px] font-bold text-ink-subtle shrink-0">
                        v{asset.version}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-ink-muted">
                      {((asset.sizeBytes || 0) / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/asset:opacity-100 transition-opacity shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={UploadCloud}
              title="No assets uploaded yet"
              description="Drag files here or use the button below. Buyers get instant access after checkout."
            />
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Upload Digital Asset
        </Button>
      </div>
    </BlockWrapper>
  );
}

export function PricingBlock() {
  const { product } = useStudio();
  const licenses = product.licenses || [];

  return (
    <BlockWrapper
      icon={CreditCard}
      label="Pricing & Licensing"
      description="Define one-time tiers and commercial licenses"
      className="col-span-12 lg:col-span-7"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenses.map((tier, i) => {
            let perksArr: string[] = [];
            if (tier.perks) {
              try {
                perksArr = JSON.parse(tier.perks);
              } catch {
                perksArr =
                  typeof tier.perks === "string"
                    ? tier.perks.split(",").map((s: string) => s.trim())
                    : [];
              }
            }
            return (
              <div
                key={tier.id || i}
                className="p-5 rounded-2xl border border-line bg-paper hover:border-ink/20 hover:shadow-card transition-all cursor-pointer group/tier relative"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="space-y-1">
                    <span className="text-[10.5px] font-bold text-ink-subtle uppercase tracking-[0.15em]">
                      {tier.name}
                    </span>
                    <p className="text-[22px] font-bold text-ink tracking-tight tabular-nums">
                      ${(tier.priceCents / 100).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover/tier:opacity-100 transition-opacity"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2.5 mb-5 min-h-[60px]">
                  {perksArr.map((f: string, j: number) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-[11.5px] text-ink-muted"
                    >
                      <Zap className="h-3 w-3 text-ink-subtle fill-ink-subtle mt-0.5 shrink-0" />
                      <span className="leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full h-9 rounded-xl text-[12px] font-bold border-line group-hover/tier:bg-ink group-hover/tier:text-paper group-hover/tier:border-ink transition-all"
                >
                  Edit Tier
                </Button>
              </div>
            );
          })}
          {licenses.length === 0 && (
            <div className="col-span-2">
              <EmptyState
                icon={CreditCard}
                title="No pricing tiers yet"
                description="Add at least one tier so buyers can purchase this product."
                action={
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl text-[12px] font-bold border-line"
                  >
                    + Add Pricing Tier
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

export function TagBlock() {
  const { product } = useStudio();
  const tags = product.tags?.map((t) => t.tag.name) || [];

  return (
    <BlockWrapper
      icon={Layers}
      label="Tags & Categories"
      description="Help buyers discover this product in the marketplace"
      className="col-span-12 lg:col-span-5"
    >
      <div className="space-y-4">
        <label className={LABEL_BASE}>Selected Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="pl-3 pr-1.5 py-1 rounded-lg bg-paper-muted border border-line flex items-center gap-1.5"
            >
              <span className="text-[12px] font-medium text-ink">{tag}</span>
              <button className="h-5 w-5 rounded-md text-ink-subtle hover:text-ink hover:bg-paper transition-colors flex items-center justify-center">
                <Plus className="h-3 w-3 rotate-45" />
              </button>
            </div>
          ))}
          {tags.length === 0 && (
            <span className="text-[12px] text-ink-muted">No tags added yet.</span>
          )}
        </div>
        <button className="px-3 py-1.5 rounded-lg border border-dashed border-line text-[12px] font-bold text-ink-muted hover:border-ink/20 hover:text-ink transition-all">
          + Add Tag
        </button>
      </div>
    </BlockWrapper>
  );
}

export function FAQBlock() {
  const { product } = useStudio();
  let faq: any[] = [];
  try {
    faq = product.faq ? JSON.parse(product.faq) : [];
  } catch {
    faq = [];
  }

  return (
    <BlockWrapper
      icon={Info}
      label="Frequently Asked Questions"
      description="Answer common buyer questions to reduce hesitation"
      className="col-span-12 lg:col-span-6"
    >
      <div className="space-y-3">
        {faq.length > 0 ? (
          faq.map((item: any, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-line bg-paper-soft space-y-2 group/faq"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-bold text-ink leading-snug">
                  {item.q}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover/faq:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-[12px] text-ink-muted leading-relaxed">
                {item.a}
              </p>
            </div>
          ))
        ) : (
          <EmptyState
            icon={Info}
            title="No FAQs defined yet"
            description="Add 3–5 common questions to boost conversion."
          />
        )}
        <Button
          variant="ghost"
          className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Question
        </Button>
      </div>
    </BlockWrapper>
  );
}

export function TestimonialBlock() {
  const { product } = useStudio();
  const reviews = product.reviews || [];

  return (
    <BlockWrapper
      icon={MessageSquare}
      label="Social Proof & Testimonials"
      description="Customer reviews displayed on the product page"
      className="col-span-12 lg:col-span-6"
    >
      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-line bg-paper-soft space-y-3"
            >
              <div className="flex items-center gap-3">
                {t.user.image ? (
                  <img
                    src={t.user.image}
                    className="h-9 w-9 rounded-full object-cover"
                    alt={t.user.name || "User"}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-paper-muted flex items-center justify-center font-bold text-[12px] text-ink">
                    {(t.user.name || "A")[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold text-ink truncate">
                    {t.user.name || "Anonymous"}
                  </p>
                  <p className="text-[10px] text-ink-muted uppercase font-bold tracking-[0.12em]">
                    {t.role || "Verified Buyer"}
                  </p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-3 w-3",
                        s <= t.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-ink-subtle"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[12.5px] text-ink-muted leading-relaxed">
                "{t.body}"
              </p>
            </div>
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Buyer reviews appear here after your first sales."
          />
        )}
      </div>
    </BlockWrapper>
  );
}

export function AutomationBlock() {
  return (
    <BlockWrapper
      icon={Zap}
      label="Delivery Automations"
      description="Email flows and webhooks triggered on purchase"
      className="col-span-12"
    >
      <div className="space-y-3">
        <div className="p-4 rounded-2xl border border-line bg-paper-soft space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-ink" />
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold text-ink">
                  Welcome Email Flow
                </p>
                <p className="text-[10.5px] text-ink-muted">
                  Sent immediately after successful checkout
                </p>
              </div>
            </div>
            <div className="h-5 w-9 rounded-full bg-ink p-0.5 cursor-pointer shrink-0 flex items-center">
              <div className="h-4 w-4 rounded-full bg-paper ml-auto shadow-soft" />
            </div>
          </div>
          <div className="pt-3 border-t border-line flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-lg text-[10.5px] font-bold border-line px-3"
            >
              Edit Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-lg text-[10.5px] font-bold border-line px-3"
            >
              Test Flow
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Automation
        </Button>
      </div>
    </BlockWrapper>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 rounded-2xl border border-dashed border-line bg-paper-soft">
      <div className="h-9 w-9 rounded-xl bg-paper border border-line flex items-center justify-center mb-3">
        <Icon className="h-4 w-4 text-ink-subtle" />
      </div>
      <p className="text-[12.5px] font-bold text-ink">{title}</p>
      {description && (
        <p className="text-[11.5px] text-ink-muted max-w-xs mt-1 px-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function StudioBuildBlocks() {
  return (
    <>
      <StudioSection
        eyebrow="Step 01"
        title="Essentials"
        description="Name, cover, and the assets buyers receive."
      />
      <HeroBlock />
      <ProductCoverBlock />
      <MediaGalleryBlock />
      <HighlightsBlock />
      <AssetBlock />

      <StudioSection
        eyebrow="Step 02"
        title="Commerce"
        description="Pricing, licensing tiers, and promotional offers."
      />
      <PricingBlock />
      <DiscountBlock className="col-span-12 lg:col-span-5" />

      <StudioSection
        eyebrow="Step 03"
        title="Trust & Discovery"
        description="Help buyers find and trust your product."
      />
      <SEOBlock className="col-span-12 lg:col-span-7" />
      <TagBlock />
      <FAQBlock />
      <TestimonialBlock />

      <StudioSection
        eyebrow="Step 04"
        title="Advanced"
        description="Post-purchase delivery flows and integrations."
      />
      <AutomationBlock />
    </>
  );
}
