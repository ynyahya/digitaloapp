import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-paper-muted py-16 md:py-24">
      <div className="mx-auto w-full max-w-[880px] px-5 md:px-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Frequently asked
          </p>
          <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[36px]">
            Questions? Answered.
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-line bg-paper px-6">
          {items.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
