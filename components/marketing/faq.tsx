import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What can I sell on Digitalo?",
    a: "Templates, SaaS boilerplates, UI kits, design systems, ebooks, plugins, code snippets, courses, and any digital asset you can deliver as a file or link. Anything that fits a premium creator catalog is welcome.",
  },
  {
    q: "How are payouts handled?",
    a: "Stripe Connect powers payments and instant payouts in 35+ countries. Funds settle to your account on a rolling schedule with full ledger transparency inside the dashboard.",
  },
  {
    q: "What are the fees?",
    a: "Free creators pay 3% per transaction. Pro is 1%, Business is 0% on the platform fee. Stripe processing fees apply on every plan.",
  },
  {
    q: "Can I bring my own domain and branding?",
    a: "Yes. Business and Enterprise plans support custom domains, full theme controls, and white-label storefronts so your brand stays at the center of the experience.",
  },
  {
    q: "Do you support digital delivery and license keys?",
    a: "Every product ships with secure file delivery, expiring download links, and license-key generation. Buyers receive instant access and you keep full control of revocation.",
  },
  {
    q: "Is there an API or webhooks?",
    a: "Yes. The Developer suite includes a documented REST API, signed webhooks for orders and customers, and Zapier-class integrations for the rest of your stack.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Frequently asked"
              title="Answers, not surprises"
              description="Everything creators ask before launching their first product on Digitalo."
            />
            <p className="mt-6 text-[14px] leading-relaxed text-ink-muted">
              Still have questions? Talk to a real human — we typically respond
              within the same business day.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink hover:gap-2.5 transition-all"
            >
              Contact our team
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-line bg-paper px-6"
            defaultValue="item-0"
          >
            {FAQS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-line"
              >
                <AccordionTrigger className="text-left text-[15px] font-semibold text-ink hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-relaxed text-ink-muted">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
