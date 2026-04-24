import { MonoMockup } from "@/components/shared/mono-mockup";

type Panel = { eyebrow: string; title: string; body: string };

export function StorytellingPanels({ panels }: { panels: Panel[] }) {
  if (!panels.length) return null;
  return (
    <section className="bg-paper-muted py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-14 px-5 md:gap-20 md:px-8">
        {panels.map((p, i) => (
          <div
            key={p.title}
            className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                {p.eyebrow}
              </p>
              <h3 className="mt-3 text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[36px]">
                {p.title}
              </h3>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-muted">
                {p.body}
              </p>
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : undefined}>
              <MonoMockup label={p.title} ratio="aspect-[5/4]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
