"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { parseFaq } from "./course-helpers";
import { SectionHeading } from "./course-outcomes";

export function CourseFaq({ faqJson }: { faqJson: string | null }) {
  const items = parseFaq(faqJson);
  if (items.length === 0) return null;

  return (
    <section id="faq" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[820px] px-6 py-20 lg:py-24">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked"
          description="Can't find what you're looking for? Reach out to the instructor."
        />
        <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-paper">
          <Accordion type="single" collapsible className="px-6">
            {items.map((item, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger className="text-[15px] font-bold text-ink">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed text-ink-muted">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
