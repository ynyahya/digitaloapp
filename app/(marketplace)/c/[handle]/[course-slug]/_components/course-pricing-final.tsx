import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { enrollInCourse } from "@/lib/actions/commerce";
import { parseList, DEFAULT_GUARANTEES } from "./course-helpers";

interface CoursePricingFinalProps {
  courseId: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  pricingModel: string;
  guarantees: string | null;
  totalLessons: number;
}

export function CoursePricingFinal({
  courseId,
  priceCents,
  compareAtCents,
  currency,
  pricingModel,
  guarantees,
  totalLessons,
}: CoursePricingFinalProps) {
  const items = parseList(guarantees);
  const list = items.length > 0 ? items : DEFAULT_GUARANTEES;
  const priceIsFree = priceCents === 0;

  return (
    <section className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-[1100px] px-6 py-24 lg:py-28">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-paper/60">
            Ready when you are
          </p>
          <h2 className="mt-4 text-[36px] font-extrabold leading-tight tracking-[-0.01em] text-paper lg:text-[48px]">
            Start learning today
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-paper/70">
            Join the students already enrolled. Lifetime access, no subscription, no surprises.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-[520px] overflow-hidden rounded-3xl border border-paper/10 bg-paper text-ink shadow-2xl shadow-black/30">
          <div className="p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
              {pricingModel === "SUBSCRIPTION"
                ? "Subscription"
                : priceIsFree
                  ? "Free"
                  : "One-time payment"}
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-[52px] font-extrabold leading-none text-ink">
                {priceIsFree ? "Free" : formatCurrency(priceCents, currency)}
              </span>
              {!priceIsFree && compareAtCents && compareAtCents > priceCents && (
                <span className="text-[18px] text-ink-muted line-through tabular-nums">
                  {formatCurrency(compareAtCents, currency)}
                </span>
              )}
            </div>

            <form action={enrollInCourse.bind(null, courseId)} className="mt-7">
              <Button
                type="submit"
                className="h-14 w-full rounded-2xl bg-ink text-[15px] font-bold text-paper transition-all hover:bg-ink-soft active:scale-[0.99]"
              >
                {priceIsFree
                  ? "Enroll now — start free"
                  : `Enroll now — ${formatCurrency(priceCents, currency)}`}
              </Button>
            </form>

            {totalLessons > 0 && (
              <p className="mt-3 text-center text-[11.5px] font-medium text-ink-muted">
                {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"} · Instant access · No card needed to preview
              </p>
            )}

            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {list.map((g, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink">
                    <Check className="h-3 w-3 text-paper" />
                  </div>
                  <span className="text-[13.5px] font-medium leading-relaxed text-ink">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
