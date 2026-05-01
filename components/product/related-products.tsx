import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/marketplace/product-card";

export function RelatedProducts({ products }: { products: ProductCardData[] }) {
  if (!products.length) return null;
  return (
    <section className="border-t border-white/[0.08] bg-white/[0.035] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-chalk-dim">
              You may also like
            </p>
            <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight tracking-tight md:text-[32px]">
              More premium products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-night px-4 py-2 text-[13px] font-medium text-chalk transition-colors hover:border-lime/40 md:inline-flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
