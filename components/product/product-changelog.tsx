import { formatRelativeDate } from "./product-helpers";

type ChangelogEntry = { version: string; date: string; notes: string };

interface ProductChangelogProps {
  entries: ChangelogEntry[];
}

export function ProductChangelog({ entries }: ProductChangelogProps) {
  if (entries.length === 0) return null;
  // sort newest first (defensive)
  const sorted = [...entries].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return Number.isNaN(db - da) ? 0 : db - da;
  });
  const latest = sorted[0];

  return (
    <section id="changelog" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Changelog
          </p>
          <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
            Always up to date
          </h2>
        </div>
        <div className="hidden text-right text-[11px] text-ink-muted sm:block">
          Latest{" "}
          <span className="font-mono font-semibold text-ink">
            v{latest.version}
          </span>{" "}
          · {formatRelativeDate(latest.date)}
        </div>
      </div>

      <ol className="mt-6 space-y-4">
        {sorted.map((entry, idx) => (
          <li
            key={`${entry.version}-${idx}`}
            className="relative rounded-2xl border border-line bg-paper p-5"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="inline-flex items-center rounded-full border border-line bg-paper-soft px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-ink">
                v{entry.version}
              </span>
              <span className="text-[11.5px] text-ink-muted">
                {formatRelativeDate(entry.date)}
              </span>
              {idx === 0 && (
                <span className="inline-flex items-center rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">
                  Latest
                </span>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink">
              {entry.notes}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
