import { CheckCircle2 } from "lucide-react";
import { parseList } from "./course-helpers";
import { SectionHeading } from "./course-outcomes";

interface CourseAboutProps {
  description: string | null;
  requirements: string | null;
}

export function CourseAbout({ description, requirements }: CourseAboutProps) {
  const reqs = parseList(requirements);
  const hasDesc = !!description && description.trim().length > 0;
  if (!hasDesc && reqs.length === 0) return null;

  return (
    <section className="border-b border-line bg-paper-soft">
      <div className="mx-auto grid max-w-[1100px] gap-16 px-6 py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-24 lg:py-24">
        {/* About */}
        <div>
          <SectionHeading eyebrow="About" title="About this course" />
          {hasDesc ? (
            <div className="prose prose-neutral mt-8 max-w-none prose-p:text-[16px] prose-p:leading-[1.85] prose-p:text-ink-muted prose-headings:font-bold prose-headings:text-ink">
              {description!.split("\n").map((p, i) => (p.trim() ? <p key={i}>{p}</p> : null))}
            </div>
          ) : (
            <p className="mt-8 text-[14.5px] text-ink-muted">
              The instructor hasn't added a full description yet.
            </p>
          )}
        </div>

        {/* Requirements */}
        <aside className="lg:pl-8 lg:border-l lg:border-line">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            Requirements
          </p>
          <h3 className="mt-2 text-[20px] font-bold text-ink">What you'll need</h3>
          {reqs.length > 0 ? (
            <ul className="mt-6 space-y-3.5">
              {reqs.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                  <span className="text-[13.5px] leading-relaxed text-ink-muted">{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-[13.5px] leading-relaxed text-ink-muted">
              No prerequisites — this course is open to all levels.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
