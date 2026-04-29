import { Plus, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { db } from "@/lib/db";

async function getBundles(creatorId: string) {
  // Query for bundle products - products with type "BUNDLE"
  const bundles = await db.product.findMany({
    where: {
      creatorId,
      type: "BUNDLE",
    },
    include: {
      bundleItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return bundles;
}

export default async function BundlesPage() {
  const creator = await requireCreator();
  const bundles = await getBundles(creator.id);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Bundles</h1>
          <p className="text-[14px] text-ink-muted">
            Combine products to increase your average order value.
          </p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6 bg-ink text-paper" asChild>
          <Link href="/dashboard/bundles/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Bundle
          </Link>
        </Button>
      </div>

      {bundles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <Card className="rounded-3xl border-line bg-paper shadow-soft max-w-[480px] w-full">
            <CardContent className="p-12 text-center space-y-6">
              <div className="h-16 w-16 rounded-3xl bg-paper-muted flex items-center justify-center mx-auto">
                <Layers className="h-8 w-8 text-ink-subtle" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold">No Bundles Yet</h3>
                <p className="text-[14px] text-ink-muted max-w-[320px] mx-auto">
                  Create product bundles to offer discounts when customers buy multiple items together.
                </p>
              </div>
              <Button className="h-11 px-6 rounded-xl bg-ink text-paper font-bold shadow-float">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Bundle
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}

      <Card className="rounded-3xl border-ink bg-ink p-8 text-paper shadow-float">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-paper" />
              <h3 className="text-[18px] font-bold">Bundle Intelligence</h3>
            </div>
            <p className="text-[14px] opacity-80 max-w-[500px]">
              Create strategic product bundles to increase your average order value and provide more value to your customers.
            </p>
          </div>
          <Button
            variant="secondary"
            className="h-11 px-6 rounded-xl bg-paper text-ink border-none hover:bg-paper-soft font-bold"
          >
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
}

function BundleCard({ bundle }: { bundle: { id: string; title: string; priceCents: number; bundleItems?: { productId: string }[] } }) {
  const productCount = bundle.bundleItems?.length ?? 0;
  const price = (bundle.priceCents / 100).toFixed(2);

  return (
    <Card className="group relative rounded-3xl border-line bg-paper shadow-soft transition-all hover:shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-2xl bg-paper-muted border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors shadow-soft">
            <Layers className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-[18px] font-bold text-ink">{bundle.title}</h3>
          <p className="text-[13px] text-ink-muted">{productCount} products included</p>
        </div>
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-[20px] font-bold text-ink">${price}</p>
        </div>
      </div>
    </Card>
  );
}
