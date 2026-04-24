import { Hero } from "@/components/marketing/hero";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { FeaturedProductsSection } from "@/components/marketing/featured-products-section";
import { UseCases } from "@/components/marketing/use-cases";
import { WhyDigitalo } from "@/components/marketing/why-digitalo";
import { ForCreatorsSection } from "@/components/marketing/for-creators-section";
import { BundleBanner } from "@/components/marketing/bundle-banner";
import { CreatorShowcase } from "@/components/marketing/creator-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { getFeaturedProducts } from "@/lib/queries/products";
import { getFeaturedCreators } from "@/lib/queries/creators";

export const revalidate = 60;

export default async function LandingPage() {
  const [products, creators] = await Promise.all([
    getFeaturedProducts(5),
    getFeaturedCreators(5),
  ]);

  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedProductsSection products={products} />
      <UseCases />
      <ForCreatorsSection />
      <WhyDigitalo />
      <BundleBanner />
      <CreatorShowcase creators={creators} />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCta />
    </>
  );
}
