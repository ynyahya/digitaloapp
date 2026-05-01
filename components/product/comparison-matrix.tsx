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
      <div className="border-b border-white/[0.08] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-chalk-dim">
          Editions
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-chalk md:text-[26px]">
          Pick the right fit for your project
        </h2>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-night">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="w-1/3 px-4 py-4 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-chalk-dim">
                Features
              </th>
              {comparison.tiers.map((t) => (
                <th
                  key={t.name}
                  className={cn(
                    "px-4 py-4 text-left align-bottom",
                    t.popular && "bg-lime text-night",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10.5px] font-semibold uppercase tracking-[0.12em]",
                      t.popular ? "text-chalk-muted" : "text-chalk-dim",
                    )}
                  >
                    {t.name}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[18px] font-semibold tracking-tight tabular-nums",
                      t.popular ? "text-night" : "text-chalk",
                    )}
                  >
                    {formatCurrency(t.priceCents)}
                  </p>
                  {t.popular && (
                    <span className="mt-2 inline-flex h-5 items-center rounded-full bg-night/15 px-2 text-[10px] font-semibold uppercase tracking-wide">
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
                className="border-b border-white/[0.08] last:border-b-0"
              >
                <td className="px-4 py-3 text-chalk-muted">{f.label}</td>
                {f.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn(
                      "px-4 py-3",
                      comparison.tiers[i]?.popular && "bg-lime/[0.02]",
                    )}
                  >
                    {typeof v === "boolean" ? (
                      v ? (
                        <Check className="h-4 w-4 text-chalk" />
                      ) : (
                        <Minus className="h-4 w-4 text-chalk-dim" />
                      )
                    ) : (
                      <span className="text-chalk">{v}</span>
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
