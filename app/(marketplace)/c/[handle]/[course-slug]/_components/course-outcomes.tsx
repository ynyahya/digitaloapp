import { CheckCircle2 } from "lucide-react";
import { parseList } from "./course-helpers";

export function CourseOutcomes({ whatYouLearn }: { whatYouLearn: string | null }) {
  const items = parseList(whatYouLearn);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-white/[0.08] bg-night">
      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-24">
        <SectionHeading
          eyebrow="Outcomes"
          title="What you'll learn"
          description="Concrete skills and results you'll walk away with."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 transition-colors hover:border-white/[0.16] hover:bg-night"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime">
                <CheckCircle2 className="h-3.5 w-3.5 text-night" />
              </div>
              <p className="text-[14.5px] font-medium leading-relaxed text-chalk">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-[680px] space-y-3">
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-muted">{eyebrow}</p>
      )}
      <h2 className="text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-chalk lg:text-[40px]">
        {title}
      </h2>
      {description && (
        <p className="text-[15.5px] leading-relaxed text-chalk-muted lg:text-[16px]">{description}</p>
      )}
    </div>
  );
}
