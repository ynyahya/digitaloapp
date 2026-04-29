import { Check, Minus, ExternalLink } from "lucide-react";

type Chip = { label: string; href?: string | null };
type Compat = { label: string; supported: boolean };

interface ProductTechStackProps {
  techStack: Chip[];
  compatibility: Compat[];
}

export function ProductTechStack({
  techStack,
  compatibility,
}: ProductTechStackProps) {
  if (techStack.length === 0 && compatibility.length === 0) return null;

  return (
    <section id="tech" className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Tech &amp; compatibility
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
          Built with a modern stack
        </h2>
      </div>

      {techStack.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Stack
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {techStack.map((chip) => {
              const content = (
                <>
                  <span className="font-semibold text-ink">{chip.label}</span>
                  {chip.href && <ExternalLink className="h-3 w-3 text-ink-subtle" />}
                </>
              );
              return chip.href ? (
                <a
                  key={chip.label}
                  href={chip.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] transition-colors hover:border-ink/30"
                >
                  {content}
                </a>
              ) : (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px]"
                >
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {compatibility.length > 0 && (
        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Compatibility
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {compatibility.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3"
              >
                <span
                  className={
                    item.supported
                      ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper"
                      : "inline-flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper-muted text-ink-subtle"
                  }
                >
                  {item.supported ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="text-[13px] font-medium text-ink">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
