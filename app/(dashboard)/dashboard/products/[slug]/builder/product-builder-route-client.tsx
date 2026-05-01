"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Box,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Eye,
  FileArchive,
  Globe2,
  Image as ImageIcon,
  Layers3,
  Loader2,
  PackageCheck,
  Rocket,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Undo2,
  Redo2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { StudioProvider, type StudioProduct } from "@/hooks/use-studio-state";
import { useStudio } from "@/hooks/use-studio-state";
import {
  AssetBlock,
  AutomationBlock,
  BundleBuilderBlock,
  ChangelogBlock,
  FAQBlock,
  HeroBlock,
  HighlightsBlock,
  MediaGalleryBlock,
  PricingBlock,
  ProductCoverBlock,
  TagBlock,
  TechStackBlock,
  TestimonialBlock,
  TrustBlock,
  AnalyticsBlock,
} from "@/components/studio/studio-blocks";
import { SEOBlock } from "@/components/studio/seo-block";
import { DiscountBlock } from "@/components/studio/discount-block";
import { PreviewMode } from "@/components/studio/preview-mode";
import { LaunchCenter } from "@/components/studio/launch-center";
import { Button } from "@/components/ui/button";
import { getProductReadiness } from "@/lib/builder/readiness/product";
import { getNextReadinessAction, summarizeReadiness } from "@/lib/builder/readiness/score";
import { publishProduct } from "@/lib/actions/studio";
import { cn } from "@/lib/utils";

const JSON_STRING_FIELDS = [
  "gallery",
  "included",
  "highlights",
  "faq",
  "comparison",
  "blockOrder",
  "bonuses",
  "discountCodes",
  "techStack",
  "compatibility",
  "changelog",
  "trustBadges",
] as const;

type ProductStage = "offer" | "delivery" | "commerce" | "trust" | "advanced";
type ProductMode = "build" | "preview" | "launch";

const PRODUCT_STAGES: Array<{
  id: ProductStage;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  requiredIds: string[];
}> = [
  {
    id: "offer",
    label: "Offer",
    shortLabel: "01",
    description: "Name, promise, cover, and the first impression buyers understand in seconds.",
    icon: Sparkles,
    requiredIds: ["title", "tagline", "description", "cover"],
  },
  {
    id: "delivery",
    label: "Delivery",
    shortLabel: "02",
    description: "Upload the files, explain what is included, and make the product feel tangible.",
    icon: FileArchive,
    requiredIds: ["asset"],
  },
  {
    id: "commerce",
    label: "Commerce",
    shortLabel: "03",
    description: "Set pricing, licenses, bundles, and optional promos without overwhelming the buyer.",
    icon: CreditCard,
    requiredIds: ["pricing"],
  },
  {
    id: "trust",
    label: "Trust & Discovery",
    shortLabel: "04",
    description: "FAQ, SEO, tags, proof, and trust signals for conversion and distribution.",
    icon: ShieldCheck,
    requiredIds: ["seo", "faq", "tags"],
  },
  {
    id: "advanced",
    label: "Advanced",
    shortLabel: "05",
    description: "Maintenance signals, automations, analytics, and power-user configuration.",
    icon: Zap,
    requiredIds: [],
  },
];

const TARGET_TO_STAGE: Record<string, ProductStage> = {
  title: "offer",
  tagline: "offer",
  description: "offer",
  hero: "offer",
  cover: "offer",
  gallery: "offer",
  highlights: "delivery",
  included: "delivery",
  asset: "delivery",
  assets: "delivery",
  pricing: "commerce",
  bundle: "commerce",
  discounts: "commerce",
  seo: "trust",
  tags: "trust",
  faq: "trust",
  reviews: "trust",
  techStack: "advanced",
  changelog: "advanced",
  analytics: "advanced",
  automations: "advanced",
};

function normalizeStudioProduct(data: any): StudioProduct {
  const product = { ...data };

  for (const field of JSON_STRING_FIELDS) {
    const value = product[field];
    if (Array.isArray(value) || (value && typeof value === "object")) {
      product[field] = JSON.stringify(value);
    } else if (value === undefined) {
      product[field] = null;
    }
  }

  product.licenses = (product.licenses || []).map((license: any) => ({
    ...license,
    perks: Array.isArray(license.perks) ? JSON.stringify(license.perks) : license.perks ?? null,
  }));
  product.files = product.files || [];
  product.tags = product.tags || [];
  product.reviews = product.reviews || [];
  product.bundleItems = product.bundleItems || [];

  return product as StudioProduct;
}

function ProductStudioOSHeader({
  activeMode,
  activeStage,
  onModeChange,
  onStageChange,
  onPublish,
}: {
  activeMode: ProductMode;
  activeStage: ProductStage;
  onModeChange: (mode: ProductMode) => void;
  onStageChange: (stage: ProductStage) => void;
  onPublish: () => Promise<void>;
}) {
  const { product, saveStatus, canUndo, canRedo, undo, redo, forceSave, setField } = useStudio();
  const [publishing, setPublishing] = useState(false);
  const checks = useMemo(() => getProductReadiness(product), [product]);
  const summary = useMemo(() => summarizeReadiness(checks), [checks]);
  const nextAction = useMemo(() => getNextReadinessAction(checks), [checks]);

  const publish = async () => {
    setPublishing(true);
    try {
      await forceSave();
      await onPublish();
      setField("status", "PUBLISHED");
      onModeChange("launch");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-night/92 backdrop-blur-2xl">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-chalk-muted hover:bg-white/[0.06] hover:text-chalk">
            <Link href="/dashboard/products" aria-label="Back to products"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-[14px] font-black text-chalk">{product.title}</p>
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em]", product.status === "PUBLISHED" ? "border-lime/25 bg-lime/10 text-lime" : "border-white/[0.08] bg-white/[0.035] text-chalk-muted")}>{product.status === "PUBLISHED" ? "Live" : "Draft"}</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-chalk-dim">Digital Product OS · {nextAction ? `Next: ${nextAction.label}` : "Ready for launch review"}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1 xl:flex">
          {[
            { id: "build" as const, label: "Build" },
            { id: "preview" as const, label: "Preview" },
            { id: "launch" as const, label: "Launch" },
          ].map((mode) => (
            <button key={mode.id} type="button" onClick={() => onModeChange(mode.id)} className={cn("rounded-xl px-4 py-2 text-[12px] font-black transition", activeMode === mode.id ? "bg-lime text-night lime-shadow" : "text-chalk-muted hover:bg-white/[0.05] hover:text-chalk")}>{mode.label}</button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 lg:flex">
            {saveStatus === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin text-lime" /> : <CheckCircle2 className="h-3.5 w-3.5 text-lime" />}
            <span className="text-[11px] font-bold text-chalk-muted">{saveStatus === "saving" ? "Saving" : saveStatus === "error" ? "Save error" : "Saved"}</span>
          </div>
          <Button variant="ghost" size="icon" className="hidden h-9 w-9 rounded-xl text-chalk-muted hover:bg-white/[0.06] disabled:opacity-30 md:inline-flex" disabled={!canUndo} onClick={undo}><Undo2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="hidden h-9 w-9 rounded-xl text-chalk-muted hover:bg-white/[0.06] disabled:opacity-30 md:inline-flex" disabled={!canRedo} onClick={redo}><Redo2 className="h-4 w-4" /></Button>
          <Button variant="outline" className="hidden h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] text-[12px] font-bold text-chalk hover:bg-white/[0.06] md:inline-flex" onClick={forceSave}><Save className="h-4 w-4" /> Save</Button>
          <Button asChild variant="outline" className="hidden h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] text-[12px] font-bold text-chalk hover:bg-white/[0.06] lg:inline-flex">
            <a href={`/p/${product.slug}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" /> Live</a>
          </Button>
          <Button className="h-10 rounded-2xl bg-lime px-4 text-[12px] font-black text-night hover:bg-lime/90" disabled={publishing || (!summary.canPublish && product.status !== "PUBLISHED")} onClick={publish}>
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {product.status === "PUBLISHED" ? "Publish updates" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="hidden border-t border-white/[0.06] px-4 py-2 lg:block">
        <div className="mx-auto grid max-w-[1220px] grid-cols-5 gap-2">
          {PRODUCT_STAGES.map((stage) => {
            const Icon = stage.icon;
            const done = isStageDone(stage.id, checks);
            const active = activeStage === stage.id && activeMode === "build";
            return (
              <button key={stage.id} type="button" onClick={() => { onModeChange("build"); onStageChange(stage.id); }} className={cn("group flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition", active ? "border-lime/35 bg-lime/10" : "border-white/[0.06] bg-white/[0.025] hover:border-lime/25 hover:bg-lime/10")}>
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[11px] font-black", done ? "bg-lime text-night" : active ? "bg-white/[0.12] text-lime" : "bg-white/[0.06] text-chalk-muted")}>{done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span>
                <span className="min-w-0"><span className="block truncate text-[12px] font-black text-chalk">{stage.label}</span><span className="block truncate text-[10px] text-chalk-dim">{stage.description}</span></span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function ProductBuilderWorkspace({ activeStage, onStageChange, onModeChange }: { activeStage: ProductStage; onStageChange: (stage: ProductStage) => void; onModeChange: (mode: ProductMode) => void }) {
  const { product, setFields, forceSave } = useStudio();
  const checks = useMemo(() => getProductReadiness(product), [product]);
  const summary = useMemo(() => summarizeReadiness(checks), [checks]);
  const stage = PRODUCT_STAGES.find((item) => item.id === activeStage) || PRODUCT_STAGES[0];

  const generateStarter = () => {
    setFields({
      tagline: product.tagline || "A practical digital product built to help creators launch faster.",
      description: product.description || "Use this product to save time, reduce guesswork, and move from idea to execution with a proven structure.",
      highlights: product.highlights || JSON.stringify(["Launch-ready structure", "Easy to customize", "Built for creators"]),
      included: product.included || JSON.stringify(["Core files", "Setup guide", "Usage checklist"]),
      faq: product.faq || JSON.stringify([
        { q: "Who is this for?", a: "Creators, founders, and teams who want a faster starting point." },
        { q: "What do I get?", a: "You get the core product files and practical guidance to use them." },
      ]),
      metaTitle: product.metaTitle || product.title,
      metaDescription: product.metaDescription || product.tagline || "A premium digital product by a TESKEL creator.",
    });
  };

  const selectReadinessTarget = (section: string) => {
    onModeChange("build");
    onStageChange(TARGET_TO_STAGE[section] || "offer");
    window.setTimeout(() => document.querySelector(`[data-block='${section}']`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 140);
  };

  return (
    <main className="min-h-screen bg-night pt-[148px] pb-16">
      <div className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 lg:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_360px] lg:px-6">
        <aside className="hidden lg:block">
          <div className="sticky top-[164px] space-y-4">
            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime">Build sequence</p>
              <div className="mt-4 space-y-2">
                {PRODUCT_STAGES.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === activeStage;
                  const done = isStageDone(item.id, checks);
                  return (
                    <button key={item.id} type="button" onClick={() => onStageChange(item.id)} className={cn("w-full rounded-2xl border p-3 text-left transition", active ? "border-lime/35 bg-lime/10" : "border-white/[0.06] bg-night/60 hover:border-lime/20 hover:bg-white/[0.04]")}>
                      <div className="flex items-center gap-3">
                        <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", done ? "bg-lime text-night" : "bg-white/[0.06] text-chalk-muted")}>
                          {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-black text-chalk">{item.shortLabel}. {item.label}</p>
                          <p className="mt-0.5 truncate text-[10px] text-chalk-dim">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[24px] border border-lime/20 bg-lime/10 p-4">
              <p className="text-[12px] font-black text-chalk">Rule of thumb</p>
              <p className="mt-1 text-[11px] leading-5 text-chalk-muted">Isi dari atas ke bawah. Jangan sentuh advanced sampai offer, delivery, dan pricing jelas.</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.035] p-5 md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-lime">{stage.shortLabel}</span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-chalk-dim">Focused stage</span>
                </div>
                <h1 className="mt-4 text-[34px] font-black leading-none tracking-[-0.045em] text-chalk md:text-[46px]">{stage.label}</h1>
                <p className="mt-3 text-[14px] leading-6 text-chalk-muted">{stage.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="rounded-2xl border-white/[0.08] bg-white/[0.035] text-chalk hover:bg-white/[0.06]" onClick={generateStarter}>
                  <Sparkles className="h-4 w-4" /> Starter copy
                </Button>
                <Button type="button" variant="outline" className="rounded-2xl border-white/[0.08] bg-white/[0.035] text-chalk hover:bg-white/[0.06]" onClick={() => onModeChange("preview")}>
                  <Eye className="h-4 w-4" /> Preview
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <StageBlocks stage={activeStage} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-4">
            <Button type="button" variant="outline" className="rounded-2xl border-white/[0.08] bg-white/[0.035] text-chalk" onClick={() => onStageChange(previousStage(activeStage))} disabled={activeStage === "offer"}>
              Previous
            </Button>
            <div className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-chalk-dim">{summary.done}/{summary.total} launch checks complete</div>
            <Button type="button" className="rounded-2xl bg-lime text-night hover:bg-lime/90" onClick={() => activeStage === "advanced" ? onModeChange("launch") : onStageChange(nextStage(activeStage))}>
              {activeStage === "advanced" ? "Open launch" : "Next stage"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <aside className="hidden 2xl:block">
          <div className="sticky top-[164px] space-y-4">
            <BuilderReadinessCard checks={checks} onSelect={selectReadinessTarget} onPublish={async () => { await forceSave(); onModeChange("launch"); }} published={product.status === "PUBLISHED"} canPublish={summary.canPublish} publicHref={`/p/${product.slug}`} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function StageBlocks({ stage }: { stage: ProductStage }) {
  if (stage === "offer") {
    return (
      <>
        <HeroBlock />
        <ProductCoverBlock />
        <MediaGalleryBlock />
      </>
    );
  }
  if (stage === "delivery") {
    return (
      <>
        <AssetBlock />
        <HighlightsBlock />
      </>
    );
  }
  if (stage === "commerce") {
    return (
      <>
        <PricingBlock />
        <BundleBuilderBlock />
        <DiscountBlock className="col-span-12 lg:col-span-5" />
      </>
    );
  }
  if (stage === "trust") {
    return (
      <>
        <SEOBlock className="col-span-12 lg:col-span-7" />
        <TagBlock />
        <FAQBlock />
        <TestimonialBlock />
        <TrustBlock />
      </>
    );
  }
  return (
    <>
      <TechStackBlock />
      <ChangelogBlock />
      <AutomationBlock />
      <AnalyticsBlock />
    </>
  );
}

function BuilderReadinessCard({ checks, onSelect, onPublish, canPublish, published, publicHref }: { checks: ReturnType<typeof getProductReadiness>; onSelect: (section: string) => void; onPublish: () => void; canPublish: boolean; published: boolean; publicHref: string }) {
  const summary = summarizeReadiness(checks);
  const next = getNextReadinessAction(checks);
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime">Launch readiness</p>
            <p className="mt-2 text-[42px] font-black leading-none tracking-[-0.05em] text-chalk">{summary.score}%</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><PackageCheck className="h-6 w-6" /></div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-lime" style={{ width: `${summary.score}%` }} /></div>
        {next ? <button type="button" onClick={() => onSelect(next.targetSection)} className="mt-4 w-full rounded-2xl border border-lime/20 bg-lime/10 p-3 text-left transition hover:bg-lime/15"><p className="text-[12px] font-black text-chalk">Next: {next.label}</p><p className="mt-1 text-[11px] leading-5 text-chalk-muted">{next.description}</p></button> : null}
      </div>
      <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-4">
        <div className="space-y-2">
          {checks.map((check) => (
            <button key={check.id} type="button" onClick={() => onSelect(check.targetSection)} className="flex w-full items-start gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-white/[0.04]">
              <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", check.done ? "text-lime" : "text-chalk-dim")} />
              <span className="min-w-0"><span className="block text-[12px] font-bold text-chalk">{check.label}</span><span className="block text-[10.5px] leading-4 text-chalk-muted">{check.description}</span></span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
          <Button type="button" className="rounded-2xl bg-lime text-night hover:bg-lime/90" disabled={!canPublish} onClick={onPublish}>{published ? "Launch center" : "Review launch"}</Button>
          <Button asChild type="button" variant="outline" className="rounded-2xl border-white/[0.08] bg-white/[0.035] text-chalk"><a href={publicHref} target="_blank" rel="noreferrer"><Globe2 className="h-4 w-4" /> Live</a></Button>
        </div>
      </div>
    </div>
  );
}

function isStageDone(stage: ProductStage, checks: ReturnType<typeof getProductReadiness>) {
  const config = PRODUCT_STAGES.find((item) => item.id === stage);
  if (!config || config.requiredIds.length === 0) return false;
  return config.requiredIds.every((id) => checks.find((check) => check.id === id)?.done);
}

function nextStage(stage: ProductStage): ProductStage {
  const index = PRODUCT_STAGES.findIndex((item) => item.id === stage);
  return PRODUCT_STAGES[Math.min(index + 1, PRODUCT_STAGES.length - 1)].id;
}

function previousStage(stage: ProductStage): ProductStage {
  const index = PRODUCT_STAGES.findIndex((item) => item.id === stage);
  return PRODUCT_STAGES[Math.max(index - 1, 0)].id;
}

export function ProductBuilderRouteClient({ slug }: { slug: string }) {
  const [activeMode, setActiveMode] = useState<ProductMode>("build");
  const [activeStage, setActiveStage] = useState<ProductStage>("offer");
  const [product, setProduct] = useState<StudioProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error(`Product not found (${res.status})`);
        const data = await res.json();
        if (active) setProduct(normalizeStudioProduct(data));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [slug]);

  const handlePublish = async () => {
    if (!product) return;
    const updated = await publishProduct(product.id);
    setProduct({ ...product, status: updated.status, publishedAt: updated.publishedAt?.toISOString?.() ?? new Date().toISOString() });
  };

  if (loading) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-night"><div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/[0.12] border-t-lime" /></div>;
  if (error || !product) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-night text-chalk"><div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 text-center"><p className="text-sm font-bold">Product not found</p><p className="mt-1 text-xs text-chalk-muted">{error}</p></div></div>;

  return (
    <StudioProvider initialProduct={product}>
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-night custom-scrollbar">
        <ProductStudioOSHeader activeMode={activeMode} activeStage={activeStage} onModeChange={setActiveMode} onStageChange={setActiveStage} onPublish={handlePublish} />
        {activeMode === "build" && <ProductBuilderWorkspace activeStage={activeStage} onStageChange={setActiveStage} onModeChange={setActiveMode} />}
        {activeMode === "preview" && <PreviewMode />}
        {activeMode === "launch" && <LaunchCenter />}
      </div>
    </StudioProvider>
  );
}
