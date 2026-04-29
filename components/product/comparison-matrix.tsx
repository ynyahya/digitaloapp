import { Check, Minus } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

type Comparison = {
  tiers: { name: string; priceCents: number; popular?: boolean }[];
  features: { label: string; values: (boolean | string)[] }[];
};

export function ComparisonMatrix({
  comparison,
}: {
  comparison: Comparison | null;
}) {
  if (!comparison) return null;
  return (
    <section className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Editions
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
          Pick the right fit for your project
        </h2>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className="w-1/3 px-4 py-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Features
              </th>
              {comparison.tiers.map((t) => (
                <th
                  key={t.name}
                  className={cn(
                    "px-4 py-4 text-left align-bottom",
                    t.popular && "bg-ink text-paper",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10.5px] font-semibold uppercase tracking-[0.12em]",
                      t.popular ? "text-paper/70" : "text-ink-subtle",
                    )}
                  >
                    {t.name}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[18px] font-semibold tracking-tight tabular-nums",
                      t.popular ? "text-paper" : "text-ink",
                    )}
                  >
                    {formatCurrency(t.priceCents)}
                  </p>
                  {t.popular && (
                    <span className="mt-2 inline-flex h-5 items-center rounded-full bg-paper/15 px-2 text-[10px] font-semibold uppercase tracking-wide">
                      Most popular
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.features.map((f) => (
              <tr
                key={f.label}
                className="border-b border-line last:border-b-0"
              >
                <td className="px-4 py-3 text-ink-muted">{f.label}</td>
                {f.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn(
                      "px-4 py-3",
                      comparison.tiers[i]?.popular && "bg-ink/[0.02]",
                    )}
                  >
                    {typeof v === "boolean" ? (
                      v ? (
                        <Check className="h-4 w-4 text-ink" />
                      ) : (
                        <Minus className="h-4 w-4 text-ink-subtle" />
                      )
                    ) : (
                      <span className="text-ink">{v}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
