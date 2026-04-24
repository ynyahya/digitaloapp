import { MonoMockup } from "@/components/shared/mono-mockup";

export function AboutEditorial({
  displayName,
  bio,
  tools,
  featuredClients,
}: {
  displayName: string;
  bio: string | null;
  tools: string[];
  featuredClients: string[];
}) {
  return (
    <section className="bg-paper-muted py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              About
            </p>
            <h2 className="mt-3 text-balance text-[32px] font-semibold leading-tight tracking-tight md:text-[42px]">
              Meet {displayName}
            </h2>
            {bio && (
              <p className="mt-5 max-w-lg text-pretty text-[15.5px] leading-relaxed text-ink-muted">
                {bio}
              </p>
            )}

            {tools.length > 0 && (
              <div className="mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Tools I use
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {featuredClients.length > 0 && (
              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Featured in & trusted by
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {featuredClients.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted"
                    >
                      <span className="inline-block h-3 w-3 rounded-sm bg-ink/80" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <MonoMockup label={`${displayName}'s Workspace`} ratio="aspect-[4/5]" />
        </div>
      </div>
    </section>
  );
}
