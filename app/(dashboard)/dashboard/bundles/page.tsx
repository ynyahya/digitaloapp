import { ArrowRight, BadgePercent, CheckCircle2, Layers, Package, Plus, Search, ShoppingCart, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { CommandHero, EmptyCommandState, MetricTile, PlaybookCard, StatusBadge, WorkflowRail } from "../_components/command-center";

async function getBundles(creatorId: string) {
  return db.product.findMany({
    where: { creatorId, type: "BUNDLE" },
    include: { bundleItems: { include: { product: true } }, _count: { select: { orderItems: true, files: true, licenses: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

type BundleItem = Awaited<ReturnType<typeof getBundles>>[number];

export default async function BundlesPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;
  const bundles = await getBundles(creator.id);

  const live = bundles.filter((bundle) => bundle.status === "PUBLISHED").length;
  const drafts = bundles.filter((bundle) => bundle.status === "DRAFT").length;
  const totalItems = bundles.reduce((sum, bundle) => sum + bundle.bundleItems.length, 0);
  const totalOrders = bundles.reduce((sum, bundle) => sum + bundle._count.orderItems, 0);
  const averageReadiness = bundles.length ? Math.round(bundles.reduce((sum, bundle) => sum + getBundleReadiness(bundle).score, 0) / bundles.length) : 0;

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="BundleOS Command Center"
        title="Rancang bundle sebagai value stack strategis untuk menaikkan AOV dan perceived value."
        description="Gabungkan produk yang saling menguatkan, jelaskan urutan konsumsi, tampilkan savings, dan launch sebagai offer premium yang mudah dibeli."
        primaryHref="/dashboard/bundles/new"
        primaryLabel="Create bundle"
        secondaryHref="/dashboard/products"
        secondaryLabel="Review products"
        icon={Layers}
        accent="from-amber-400/20 via-lime/10 to-transparent"
      >
        <WorkflowRail
          title="Bundle launch path"
          items={[
            { label: "Theme", description: "One outcome tying all products together", done: bundles.some((bundle) => Boolean(bundle.tagline || bundle.description)) },
            { label: "Stack", description: "At least two products that compound value", done: bundles.some((bundle) => bundle.bundleItems.length >= 2) },
            { label: "Pricing", description: "Bundle price and discount logic", done: bundles.some((bundle) => bundle.priceCents > 0) },
            { label: "Delivery", description: "Licenses/files are prepared", done: bundles.some((bundle) => bundle._count.files > 0 || bundle._count.licenses > 0) },
            { label: "Launch", description: "Publish and promote the bundle", done: live > 0 },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={Layers} label="Live bundles" value={live} helper={`${drafts} bundle draft${drafts === 1 ? "" : "s"}`} tone="amber" />
        <MetricTile icon={Package} label="Products bundled" value={totalItems} helper="Included products across bundles" tone="blue" />
        <MetricTile icon={ShoppingCart} label="Bundle orders" value={totalOrders} helper="Sales through bundle products" tone="emerald" />
        <MetricTile icon={Sparkles} label="Readiness" value={`${averageReadiness}%`} helper="Average bundle launch health" tone="lime" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-chalk">Bundle portfolio</h2>
              <p className="text-[13px] text-chalk-muted">{bundles.length} bundle total · stack clarity, value, and launch readiness</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-chalk-muted" />
              <Input className="h-10 rounded-xl border-white/[0.08] pl-9 text-[13px]" placeholder="Search bundles..." />
            </div>
          </div>

          {bundles.length === 0 ? (
            <EmptyCommandState icon={Layers} title="Create your first strategic bundle" description="Pick products that solve a bigger job together, add a clear bundle promise, and price it to increase average order value." href="/dashboard/bundles/new" label="Create first bundle" />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {bundles.map((bundle) => <BundleCard key={bundle.id} bundle={bundle} />)}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardContent className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-chalk-dim">Bundle intelligence</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><div className="flex items-center justify-between"><p className="text-[13px] font-bold text-chalk">Average stack size</p><p className="text-[18px] font-bold text-chalk">{bundles.length ? (totalItems / bundles.length).toFixed(1) : "0"}</p></div><p className="mt-1 text-[12px] text-chalk-muted">Best bundles feel curated, not random collections.</p></div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><div className="flex items-center justify-between"><p className="text-[13px] font-bold text-chalk">Published bundles</p><p className="text-[18px] font-bold text-chalk">{live}/{bundles.length || 0}</p></div><p className="mt-1 text-[12px] text-chalk-muted">Launch one strong bundle before making multiple variants.</p></div>
                <Button asChild className="h-10 w-full rounded-2xl bg-lime text-night"><Link href="/dashboard/bundles/new">Build a value stack<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </CardContent>
          </Card>

          <PlaybookCard icon={TrendingUp} title="AOV growth playbook" description="Bundle yang bagus menjual outcome lebih besar, bukan sekadar diskon." steps={["Anchor around one buyer job", "Show what each item contributes", "Make savings visible but not cheap", "Add order and implementation guidance"]} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Package, title: "Starter Pack", description: "Best entry point for new buyers", steps: ["Core product", "Template", "Guide"] },
          { icon: Sparkles, title: "Transformation Stack", description: "Full outcome in one purchase", steps: ["Foundation", "Execution", "Support"] },
          { icon: BadgePercent, title: "Seasonal Deal", description: "Campaign bundle with urgency", steps: ["Theme", "Discount", "Deadline"] },
          { icon: Layers, title: "Pro Library", description: "Premium all-access collection", steps: ["Catalog", "License", "Updates"] },
        ].map((template) => <PlaybookCard key={template.title} icon={template.icon} title={template.title} description={template.description} steps={template.steps} />)}
      </div>
    </div>
  );
}

function BundleCard({ bundle }: { bundle: BundleItem }) {
  const readiness = getBundleReadiness(bundle);
  const originalCents = bundle.bundleItems.reduce((sum, item) => sum + item.product.priceCents, 0);
  const savings = originalCents > bundle.priceCents && originalCents > 0 ? Math.round((1 - bundle.priceCents / originalCents) * 100) : 0;

  return (
    <Link href={`/dashboard/products/${bundle.slug}/builder`}>
      <Card className="group h-full rounded-3xl border-white/[0.08] bg-night/70 shadow-soft transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:shadow-card">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]"><Layers className="h-5 w-5 text-amber-300" /></div>
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-bold text-chalk group-hover:text-lime">{bundle.title}</h3>
                <p className="mt-1 text-[12px] text-chalk-muted">{bundle.currency} {(bundle.priceCents / 100).toLocaleString()}</p>
              </div>
            </div>
            <StatusBadge status={bundle.status} />
          </div>
          <p className="line-clamp-2 min-h-[40px] text-[13px] leading-5 text-chalk-muted">{bundle.tagline || bundle.description || "Add a strong value-stack promise so buyers understand why these products belong together."}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat icon={Package} value={String(bundle.bundleItems.length)} label="Items" />
            <MiniStat icon={BadgePercent} value={savings ? `${savings}%` : "—"} label="Savings" />
            <MiniStat icon={CheckCircle2} value={`${readiness.score}%`} label="Ready" />
          </div>
          <div className="flex flex-wrap gap-2">
            {bundle.bundleItems.slice(0, 3).map((item) => <span key={item.productId} className="rounded-full bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium text-chalk-muted">{item.product.title}</span>)}
            {bundle.bundleItems.length > 3 ? <span className="rounded-full bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium text-chalk-muted">+{bundle.bundleItems.length - 3} more</span> : null}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim"><span>Bundle readiness</span><span>{readiness.score}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full", readiness.score >= 80 ? "bg-emerald-500" : readiness.score >= 50 ? "bg-amber-500" : "bg-lime")} style={{ width: `${readiness.score}%` }} /></div>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-4"><p className="text-[12px] text-chalk-muted">{readiness.nextAction}</p><ArrowRight className="h-4 w-4 text-chalk-dim transition-transform group-hover:translate-x-1 group-hover:text-chalk" /></div>
        </CardContent>
      </Card>
    </Link>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-chalk-dim" />
      <p className="truncate text-[11px] font-bold text-chalk">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-chalk-dim">{label}</p>
    </div>
  );
}

function getBundleReadiness(bundle: BundleItem) {
  const checks = [
    { done: Boolean(bundle.title && (bundle.tagline || bundle.description)), next: "Add a clear value-stack promise." },
    { done: bundle.bundleItems.length >= 2, next: "Include at least two complementary products." },
    { done: bundle.priceCents > 0, next: "Set bundle pricing and savings logic." },
    { done: bundle._count.files > 0 || bundle._count.licenses > 0 || bundle.instantDelivery, next: "Confirm delivery and license setup." },
    { done: bundle.status === "PUBLISHED", next: "Publish the bundle and promote it." },
  ];
  const score = Math.round((checks.filter((check) => check.done).length / checks.length) * 100);
  return { score, nextAction: checks.find((check) => !check.done)?.next ?? "Bundle is live. Test offer positioning next." };
}
