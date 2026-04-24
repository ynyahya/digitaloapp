"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard, type ProductCardData } from "@/components/marketplace/product-card";

type Bucket = "featured" | "templates" | "bundles" | "best-sellers" | "new";

const TABS: { value: Bucket; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "templates", label: "Templates" },
  { value: "bundles", label: "Bundles" },
  { value: "best-sellers", label: "Best Sellers" },
  { value: "new", label: "New" },
];

export function StorefrontTabs({
  buckets,
}: {
  buckets: Record<Bucket, ProductCardData[]>;
}) {
  const [value, setValue] = useState<Bucket>("featured");

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Products
            </p>
            <h2 className="mt-2 text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[34px]">
              Premium products by this creator
            </h2>
          </div>
          <Tabs value={value} onValueChange={(v) => setValue(v as Bucket)}>
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={value} />
          </Tabs>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {buckets[value].length > 0 ? (
            buckets[value].map((p) => <ProductCard key={p.slug} product={p} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-line bg-paper-soft p-10 text-center text-[13px] text-ink-muted">
              No products in this section yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
