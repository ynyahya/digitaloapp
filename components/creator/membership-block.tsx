import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Supporter",
    price: "$5/mo",
    tagline: "Early access and monthly updates.",
    perks: ["Early access drops", "Discord community", "Monthly newsletter"],
  },
  {
    name: "Insider",
    price: "$19/mo",
    tagline: "Source files, templates & playbooks.",
    perks: ["Everything in Supporter", "Monthly templates", "Source files access"],
    popular: true,
  },
  {
    name: "Pro",
    price: "$49/mo",
    tagline: "Consulting office hours + full catalog.",
    perks: ["Everything in Insider", "Office hours", "Full catalog access"],
  },
];

export function MembershipBlock({ creatorName }: { creatorName: string }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="rounded-3xl border border-line bg-paper-muted p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Membership
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[36px]">
                Join the {creatorName} community
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">
                Monthly drops, early access, source files and a private Discord.
              </p>
            </div>
            <Button size="lg" variant="secondary">
              Learn more
            </Button>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={
                  "relative flex flex-col rounded-2xl border bg-paper p-5 " +
                  (t.popular ? "border-ink shadow-card" : "border-line")
                }
              >
                {t.popular && (
                  <span className="absolute -top-3 right-5 inline-flex h-6 items-center rounded-full bg-ink px-3 text-[10px] font-semibold uppercase tracking-wide text-paper">
                    Popular
                  </span>
                )}
                <p className="text-[14px] font-semibold">{t.name}</p>
                <p className="mt-1 text-[22px] font-semibold tracking-tight">{t.price}</p>
                <p className="mt-1 text-[12.5px] text-ink-muted">{t.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2 text-[12.5px]">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-ink-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 text-ink" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant={t.popular ? "primary" : "secondary"}
                  className="mt-6 w-full justify-center"
                >
                  Become a {t.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
