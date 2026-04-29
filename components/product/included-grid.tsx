import { Check } from "lucide-react";

type Item = { icon: string; title: string; description: string };

export function IncludedGrid({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          What&apos;s included
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
          Everything you need to build and ship
        </h2>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.title}
            className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper-muted text-ink">
              <Check className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-ink">{i.title}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">
                {i.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
