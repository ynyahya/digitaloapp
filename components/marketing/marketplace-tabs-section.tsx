"use client";

import { useState } from "react";
import { Container } from "@/components/shared/container";
import { ProductCard, type ProductCardData } from "@/components/marketplace/product-card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Tab = "featured" | "trending" | "recent";

export function MarketplaceTabsSection({
  featured,
  trending,
  recent,
}: {
  featured: (ProductCardData & { id: string })[];
  trending: (ProductCardData & { id: string })[];
  recent: (ProductCardData & { id: string })[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("featured");

  const products = {
    featured,
    trending,
    recent,
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "featured", label: "Featured" },
    { id: "trending", label: "Trending" },
    { id: "recent", label: "Recent" },
  ];

  return (
    <section className="bg-paper py-20 md:py-32">
      <Container size="wide">
        <div className="flex flex-col items-center">
          {/* UI8 Style Pill Switcher */}
          <div className="relative flex items-center rounded-full border border-line bg-paper-soft/50 p-1.5 shadow-sm backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative z-10 px-6 py-2.5 text-[14px] font-bold transition-all duration-300 rounded-full",
                  activeTab === tab.id 
                    ? "text-paper bg-ink shadow-lg shadow-ink/20 scale-[1.02]" 
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-12 flex w-full items-center justify-between">
            <div>
              <h2 className="text-[28px] font-black tracking-tight text-ink md:text-[40px]">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Products
              </h2>
              <p className="mt-2 text-[15px] text-ink-muted md:text-[17px]">
                Curated selection of the best {activeTab} assets.
              </p>
            </div>
            <Link
              href="/products"
              className="group hidden items-center gap-2 text-[14px] font-bold text-ink-muted transition-colors hover:text-ink md:flex"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="mt-12 w-full">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products[activeTab].map((p) => (
                <div 
                  key={p.id} 
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 flex justify-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-ink"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
