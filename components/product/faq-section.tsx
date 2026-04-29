import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Frequently asked
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
          Questions? Answered.
        </h2>
      </div>
      <Accordion
        type="single"
        collapsible
        className="mt-6 rounded-2xl border border-line bg-paper px-6"
      >
        {items.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
