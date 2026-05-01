import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { ProductTour } from "@/components/landing/product-tour";
import { FeatureBento } from "@/components/landing/feature-bento";
import { CreatorShowcase } from "@/components/landing/creator-showcase";
import { Pricing } from "@/components/landing/pricing";
import { TestimonialsFaq } from "@/components/landing/testimonials-faq";
import { FinalCta } from "@/components/landing/final-cta";
import { getFeaturedCreators } from "@/lib/queries/creators";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function LandingPage() {
  const creators = await getFeaturedCreators(6).catch(() => []);

  return (
    <>
      <Hero />
      <SocialProof />
      <ProductTour />
      <FeatureBento />
      <CreatorShowcase creators={creators as any} />
      <Pricing />
      <TestimonialsFaq />
      <FinalCta />
    </>
  );
}
