import { parseList } from "./course-helpers";
import { SectionHeading } from "./course-outcomes";
import { Sparkles } from "lucide-react";

export function CourseAudience({ audience }: { audience: string | null }) {
  const items = parseList(audience);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-line bg-paper-soft">
      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-24">
        <SectionHeading
          eyebrow="Who this is for"
          title="Is this course right for you?"
          description="Built for creators and learners who want to go deeper — not surface-level tutorials."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-line bg-paper p-7 transition-all hover:shadow-card"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper-soft text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[16px] font-semibold leading-relaxed text-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
