import { Star } from "lucide-react";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils";
import { SectionHeading } from "./course-outcomes";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export function CourseReviews({
  reviews,
  ratingAvg,
}: {
  reviews: Review[];
  ratingAvg: number;
}) {
  if (reviews.length === 0) return null;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length;

  return (
    <section id="reviews" className="border-b border-line bg-paper-soft">
      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-24">
        <SectionHeading
          eyebrow="Social proof"
          title="What students are saying"
          description={`${total} ${total === 1 ? "review" : "reviews"} from verified students.`}
        />

        {/* Summary bar */}
        <div className="mt-10 grid gap-10 rounded-3xl border border-line bg-paper p-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-16 md:p-10">
          <div className="border-r-0 md:border-r md:border-line md:pr-10">
            <p className="text-[56px] font-extrabold leading-none text-ink tabular-nums">
              {ratingAvg.toFixed(1)}
            </p>
            <div className="mt-2 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${
                    s <= Math.round(ratingAvg) ? "fill-ink text-ink" : "text-line-strong"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-[12px] font-medium text-ink-muted">
              Based on {total} {total === 1 ? "review" : "reviews"}
            </p>
          </div>
          <div className="space-y-2.5">
            {distribution.map((d) => {
              const pct = total === 0 ? 0 : (d.count / total) * 100;
              return (
                <div key={d.star} className="flex items-center gap-4">
                  <span className="w-3 shrink-0 text-[12px] font-bold text-ink tabular-nums">
                    {d.star}
                  </span>
                  <Star className="h-3 w-3 shrink-0 fill-ink text-ink" />
                  <div className="flex-1 overflow-hidden rounded-full bg-paper-muted">
                    <div
                      className="h-2 bg-ink transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-[12px] font-semibold text-ink-muted tabular-nums">
                    {d.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-3xl border border-line bg-paper p-6 transition-colors hover:border-line-strong"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-muted text-[13px] font-bold text-ink">
                  {r.user.image ? (
                    <Image src={r.user.image} alt="" fill sizes="40px" className="object-cover" />
                  ) : (
                    (r.user.name || "S")[0]
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-ink">
                    {r.user.name || "Student"}
                  </p>
                  <p className="text-[11px] text-ink-muted">{formatRelativeTime(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        s <= r.rating ? "fill-ink text-ink" : "text-line-strong"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {r.title && (
                <p className="mt-5 text-[14.5px] font-bold text-ink leading-snug">{r.title}</p>
              )}
              {r.body && (
                <p className="mt-2 text-[13.5px] leading-[1.75] text-ink-muted">{r.body}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
