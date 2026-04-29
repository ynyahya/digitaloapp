import { MonoMockup } from "@/components/shared/mono-mockup";

type Panel = { eyebrow: string; title: string; body: string };

export function StorytellingPanels({ panels }: { panels: Panel[] }) {
  if (!panels.length) return null;
  return (
    <section className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Built with intent
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
          Why {panels.length === 1 ? "it" : "people"} love{" "}
          {panels.length === 1 ? "it" : "this"}
        </h2>
      </div>
      <div className="mt-6 space-y-8">
        {panels.map((p, i) => (
          <div
            key={p.title}
            className="grid items-center gap-6 md:grid-cols-[1fr_1fr] md:gap-10"
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                {p.eyebrow}
              </p>
              <h3 className="mt-2 text-balance text-[19px] font-semibold leading-tight tracking-tight text-ink md:text-[22px]">
                {p.title}
              </h3>
              <p className="mt-2 text-pretty text-[13.5px] leading-relaxed text-ink-muted">
                {p.body}
              </p>
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : undefined}>
              <MonoMockup label={p.title} ratio="aspect-[4/3]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
