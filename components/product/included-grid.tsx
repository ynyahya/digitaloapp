import { Check } from "lucide-react";

type Item = { icon: string; title: string; description: string };

export function IncludedGrid({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            What&apos;s Included
          </p>
          <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[36px]">
            Everything you need to build and ship
          </h2>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map((i) => (
            <div
              key={i.title}
              className="flex items-start gap-4 rounded-2xl border border-line bg-paper p-5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper-muted text-ink">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{i.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                  {i.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
