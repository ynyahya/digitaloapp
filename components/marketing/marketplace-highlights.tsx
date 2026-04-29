"use client";

import { Container } from "@/components/shared/container";
import { ProductCard, type ProductCardData } from "@/components/marketplace/product-card";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketplaceHighlights({
  products,
}: {
  products: (ProductCardData & { id: string })[];
}) {
  return (
    <section className="bg-paper py-20 md:py-32">
      <Container size="wide">
        <div className="flex flex-col">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <Sparkles className="h-3.5 w-3.5" />
              Curated assets
            </span>
            <div className="mt-6 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
              <div className="max-w-2xl">
                <h2 className="text-[32px] font-black leading-tight tracking-tight text-ink md:text-[48px]">
                  Trending on the marketplace.
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-muted md:text-[18px]">
                  Hand-picked templates, UI kits, and digital assets to help you ship faster. 
                  Beautifully crafted by independent creators.
                </p>
              </div>
              <Button variant="outline" size="lg" className="hidden rounded-full md:inline-flex" asChild>
                <Link href="/products">
                  Explore all products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <Button variant="outline" size="lg" className="w-full rounded-full" asChild>
              <Link href="/products">
                Explore all products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
