import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { ProductCard, type ProductCardData } from "@/components/marketplace/product-card";

export function FeaturedProductsSection({ products }: { products: ProductCardData[] }) {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          eyebrow="Featured"
          title="Featured Marketplace Products"
          description="Hand-picked templates, starter kits and creator assets — curated weekly."
          action={
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink/30"
            >
              View all products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
