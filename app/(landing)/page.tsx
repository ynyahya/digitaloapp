import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { ProductTour } from "@/components/landing/product-tour";
import { FeatureBento } from "@/components/landing/feature-bento";
import { CreatorShowcase } from "@/components/landing/creator-showcase";
import { Pricing } from "@/components/landing/pricing";
import { TestimonialsFaq } from "@/components/landing/testimonials-faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import { getFeaturedCreators } from "@/lib/queries/creators";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function LandingPage() {
  const creators = await getFeaturedCreators(6).catch(() => []);

  return (
    <>
      <Hero />
      <Reveal><SocialProof /></Reveal>
      {/* ProductTour + TestimonialsFaq use position:sticky,
          which breaks when wrapped in a transformed ancestor. */}
      <ProductTour />
      <Reveal><FeatureBento /></Reveal>
      <Reveal><CreatorShowcase creators={creators as any} /></Reveal>
      <Reveal><Pricing /></Reveal>
      <TestimonialsFaq />
      <Reveal><FinalCta /></Reveal>
    </>
  );
}
