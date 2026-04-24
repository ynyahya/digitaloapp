import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { FAQ } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = {
  title: "Pricing — Simple, transparent pricing for every creator",
  description:
    "Start selling free. Upgrade as you grow. Down to 0% transaction fee on Business. No hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      <PricingPageClient />
      <FAQ />
      <FinalCta />
    </>
  );
}
