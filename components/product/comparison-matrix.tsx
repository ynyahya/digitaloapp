import { Check, Minus } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

type Comparison = {
  tiers: { name: string; priceCents: number; popular?: boolean }[];
  features: { label: string; values: (boolean | string)[] }[];
};

export function ComparisonMatrix({ comparison }: { comparison: Comparison | null }) {
  if (!comparison) return null;
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Compare Editions
          </p>
          <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[36px]">
            Pick the right fit for your project
          </h2>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-line">
                <th className="w-1/3 px-6 py-5 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Features
                </th>
                {comparison.tiers.map((t) => (
                  <th
                    key={t.name}
                    className={cn(
                      "px-6 py-5 text-left align-bottom",
                      t.popular && "bg-ink text-paper",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-[0.12em]",
                        t.popular ? "text-paper/70" : "text-ink-subtle",
                      )}
                    >
                      {t.name}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[22px] font-semibold tracking-tight",
                        t.popular ? "text-paper" : "text-ink",
                      )}
                    >
                      {formatCurrency(t.priceCents)}
                    </p>
                    {t.popular && (
                      <span className="mt-2 inline-flex h-5 items-center rounded-full bg-paper/15 px-2 text-[10px] font-semibold uppercase tracking-wide">
                        Most Popular
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.features.map((f) => (
                <tr key={f.label} className="border-b border-line last:border-b-0">
                  <td className="px-6 py-4 text-ink-muted">{f.label}</td>
                  {f.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-6 py-4",
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
      </div>
    </section>
  );
}
