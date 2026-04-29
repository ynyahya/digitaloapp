import { Hero } from "@/components/marketing/hero";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { MarketplaceHighlights } from "@/components/marketing/marketplace-highlights";
import { CategoryBrowseSection } from "@/components/marketing/category-browse-section";
import { UseCases } from "@/components/marketing/use-cases";
import { WhyTESKEL } from "@/components/marketing/why-teskel";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ForCreatorsSection } from "@/components/marketing/for-creators-section";
import { BundleBanner } from "@/components/marketing/bundle-banner";
import { CreatorShowcase } from "@/components/marketing/creator-showcase";
import { Integrations } from "@/components/marketing/integrations";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingHighlights } from "@/components/marketing/pricing-highlights";
import { FinalCta } from "@/components/marketing/final-cta";
import { CourseHighlights } from "@/components/marketing/course-highlights";
import { getFeaturedProducts } from "@/lib/queries/products";
import { getFeaturedCreators } from "@/lib/queries/creators";
import { getFeaturedCourses } from "@/lib/queries/courses";

export const revalidate = 60;

export default async function LandingPage() {
  const [featured, creators, courses] = await Promise.all([
    getFeaturedProducts(8),
    getFeaturedCreators(5),
    getFeaturedCourses(4),
  ]);

  return (
    <>
      <Hero />
      <StatsStrip />
      <CourseHighlights courses={courses} />
      <MarketplaceHighlights products={featured} />
      <CategoryBrowseSection />
      <HowItWorks />
      <UseCases />
      <ForCreatorsSection />
      <WhyTESKEL />
      <Integrations />
      <BundleBanner />
      <CreatorShowcase creators={creators} />
      <Testimonials />
      <PricingHighlights />
      <FinalCta />
    </>
  );
}
