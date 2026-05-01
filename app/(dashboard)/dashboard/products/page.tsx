import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Box,
  CheckCircle2,
  Clock3,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileArchive,
  Filter,
  Globe2,
  Layers3,
  PackageCheck,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  UploadCloud,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductActions } from "@/components/dashboard/product-actions";
import { requireCreator } from "@/lib/auth/session";
import { getProducts } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";

const PRODUCT_WORKFLOW = [
  { label: "Shape offer", detail: "Promise, audience, demo", icon: Sparkles },
  { label: "Package assets", detail: "Files, licenses, delivery", icon: UploadCloud },
  { label: "Price & proof", detail: "Tiers, FAQ, trust", icon: ShieldCheck },
  { label: "Launch page", detail: "SEO, preview, publish", icon: Rocket },
];

export default async function ProductsPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const products = await getProducts(creator.id);
  const liveProducts = products.filter((product) => product.status === "PUBLISHED");
  const draftProducts = products.filter((product) => product.status === "DRAFT");
  const totalRevenueCents = products.reduce((sum, product) => sum + product.priceCents * product.salesCount, 0);
  const totalViews = products.reduce((sum, product) => sum + product.viewsCount, 0);
  const totalAssets = products.reduce((sum, product) => sum + product.fileCount, 0);
  const averageReadiness = products.length
    ? Math.round(products.reduce((sum, product) => sum + getProductReadiness(product).score, 0) / products.length)
    : 0;
  const nextProduct = [...products].sort((a, b) => getProductReadiness(b).score - getProductReadiness(a).score)[0];

  return (
    <div className="space-y-8 pb-16">
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-night/80 p-6 shadow-2xl shadow-black/30 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(180,243,0,0.16),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(124,92,255,0.16),transparent_34%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_420px]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                <Zap className="h-3.5 w-3.5" /> Digital product OS
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-medium text-chalk-muted">
                {products.length} offers · {liveProducts.length} live · {draftProducts.length} drafts
              </span>
            </div>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-display-sm font-extrabold tracking-tight text-chalk">
                Build products like a pro launch room.
              </h1>
              <p className="max-w-2xl text-[15px] leading-7 text-chalk-muted">
                Kelola digital products dari ide sampai delivery: positioning, pricing, asset files, license tiers, proof, SEO, dan publish checklist dalam satu control center.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-2xl bg-lime px-5 text-[13px] font-bold text-night hover:bg-lime/90 lime-shadow">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" /> Create product
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-2xl border-white/[0.08] bg-white/[0.035] px-5 text-[13px] font-bold text-chalk hover:bg-white/[0.06]">
                <Link href={nextProduct ? `/dashboard/products/${nextProduct.slug}/builder` : "/dashboard/create"}>
                  <Rocket className="mr-2 h-4 w-4" /> Open launch center
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-dim">Portfolio readiness</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tight text-chalk">{averageReadiness}%</span>
                  <span className="pb-2 text-[12px] font-medium text-chalk-muted">avg launch score</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-night lime-shadow">
                <PackageCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-lime" style={{ width: `${averageReadiness}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricTile label="Revenue proxy" value={formatMoney(totalRevenueCents)} icon={DollarSign} />
              <MetricTile label="Views" value={totalViews.toLocaleString()} icon={Eye} />
              <MetricTile label="Assets" value={totalAssets.toLocaleString()} icon={FileArchive} />
              <MetricTile label="Published" value={liveProducts.length.toString()} icon={Globe2} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PRODUCT_WORKFLOW.map((item, index) => (
          <div key={item.label} className="group rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-5 transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:bg-white/[0.05]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-night text-lime">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-black text-chalk-dim">0{index + 1}</span>
            </div>
            <h3 className="text-[15px] font-bold text-chalk">{item.label}</h3>
            <p className="mt-1 text-[12px] leading-5 text-chalk-muted">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-white/[0.08] bg-night/70 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-chalk">Product pipeline</h2>
              <p className="mt-1 text-[12px] text-chalk-muted">Prioritize products by launch readiness, delivery setup, and conversion assets.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-dim" />
                <Input className="h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] pl-9 text-[13px] text-chalk placeholder:text-chalk-dim" placeholder="Search products..." />
              </div>
              <Button variant="outline" className="h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] text-[12px] font-bold text-chalk">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          {products.length === 0 ? (
            <ProductEmptyState />
          ) : (
            <div className="divide-y divide-white/[0.08]">
              {products.map((product) => {
                const readiness = getProductReadiness(product);
                return (
                  <div key={product.id} className="group grid gap-5 p-5 transition-colors hover:bg-white/[0.025] xl:grid-cols-[minmax(0,1fr)_220px_180px] xl:items-center">
                    <Link href={`/dashboard/products/${product.slug}/builder`} className="flex min-w-0 gap-4">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                        {product.coverImage ? (
                          <img src={product.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(180,243,0,0.18),transparent_65%)]">
                            <Box className="h-7 w-7 text-lime" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-[15px] font-bold text-chalk group-hover:text-lime">{product.title}</h3>
                          <StatusPill status={product.status} />
                        </div>
                        <p className="mt-1 line-clamp-2 max-w-2xl text-[12px] leading-5 text-chalk-muted">
                          {product.tagline || product.description || "No positioning copy yet. Add a promise, audience, and offer story."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-chalk-muted">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2 py-1"><Tag className="h-3 w-3" /> {product.category}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2 py-1"><Download className="h-3 w-3" /> {product.fileCount} files</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2 py-1"><Layers3 className="h-3 w-3" /> {product.licenseCount || 1} tiers</span>
                        </div>
                      </div>
                    </Link>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-chalk-muted">Launch score</span>
                        <span className={cn("font-black", readiness.score >= 80 ? "text-lime" : readiness.score >= 50 ? "text-amber-300" : "text-rose-300")}>{readiness.score}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                        <div className={cn("h-full rounded-full", readiness.score >= 80 ? "bg-lime" : readiness.score >= 50 ? "bg-amber-400" : "bg-rose-400")} style={{ width: `${readiness.score}%` }} />
                      </div>
                      <p className="text-[11px] text-chalk-dim">Next: {readiness.next}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 xl:justify-end">
                      <div className="text-left xl:text-right">
                        <p className="text-[15px] font-black text-chalk">{formatMoney(product.priceCents, product.currency)}</p>
                        <p className="mt-1 text-[11px] text-chalk-muted">{product.salesCount} sales · {product.viewsCount} views</p>
                      </div>
                      <ProductActions product={product} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Next best action</p>
                <h3 className="mt-2 text-[17px] font-bold text-chalk">Ship the closest-to-live offer</h3>
              </div>
              <TrendingUp className="h-5 w-5 text-lime" />
            </div>
            {nextProduct ? (
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-night p-4">
                <p className="text-[13px] font-bold text-chalk">{nextProduct.title}</p>
                <p className="mt-1 text-[12px] text-chalk-muted">{getProductReadiness(nextProduct).score}% ready · {getProductReadiness(nextProduct).next}</p>
                <Button asChild className="mt-4 h-9 w-full rounded-xl bg-lime text-[12px] font-bold text-night hover:bg-lime/90">
                  <Link href={`/dashboard/products/${nextProduct.slug}/builder`}>Continue build <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-[12px] leading-5 text-chalk-muted">Create your first product and TESKEL will turn it into a launchable storefront.</p>
            )}
          </div>

          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
            <h3 className="text-[15px] font-bold text-chalk">Pro product standard</h3>
            <div className="mt-4 space-y-3">
              {[
                "One sharp promise above the fold",
                "At least one delivery file or fulfillment path",
                "License/pricing tier that removes buying friction",
                "FAQ, proof, and SEO before publishing",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-night/60 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  <p className="text-[12px] leading-5 text-chalk-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-lime/20 bg-lime/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-night">
                <Copy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-chalk">Repeatable templates</h3>
                <p className="text-[12px] text-chalk-muted">Use the same OS for templates, kits, files, and bundles.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function MetricTile({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-night/70 p-3">
      <Icon className="mb-2 h-4 w-4 text-lime" />
      <p className="text-[16px] font-black text-chalk">{value}</p>
      <p className="text-[10px] font-medium text-chalk-dim">{label}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em]",
        status === "PUBLISHED" && "border-lime/25 bg-lime/10 text-lime",
        status === "DRAFT" && "border-white/[0.08] bg-white/[0.035] text-chalk-muted",
        status === "ARCHIVED" && "border-rose-400/20 bg-rose-500/10 text-rose-200",
      )}
    >
      {status === "PUBLISHED" ? "Live" : status.toLowerCase()}
    </span>
  );
}

function ProductEmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-lime/20 bg-lime/10 text-lime">
        <Box className="h-9 w-9" />
      </div>
      <h3 className="mt-6 text-[22px] font-black text-chalk">Create your first digital product</h3>
      <p className="mt-2 max-w-md text-[14px] leading-6 text-chalk-muted">
        Start with a draft, package your assets, set pricing, then publish a premium storefront.
      </p>
      <Button asChild className="mt-6 rounded-2xl bg-lime text-night hover:bg-lime/90 lime-shadow">
        <Link href="/dashboard/create"><Plus className="mr-2 h-4 w-4" /> New product</Link>
      </Button>
    </div>
  );
}

function getProductReadiness(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const checks = [
    Boolean(product.title && product.title.length > 2),
    Boolean(product.tagline && product.tagline.length > 8),
    Boolean(product.description && product.description.length > 40),
    product.priceCents > 0 || product.licenseCount > 0,
    Boolean(product.coverImage),
    product.fileCount > 0,
    product.tagCount > 0,
  ];
  const labels = ["title", "tagline", "description", "pricing", "cover", "delivery file", "tags"];
  const missingIndex = checks.findIndex((item) => !item);
  return {
    score: Math.round((checks.filter(Boolean).length / checks.length) * 100),
    next: missingIndex === -1 ? "Ready for launch review" : `Add ${labels[missingIndex]}`,
  };
}

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
