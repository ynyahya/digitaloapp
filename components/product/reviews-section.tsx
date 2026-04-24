import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { formatCompactNumber } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  body: string | null;
  title: string | null;
  role: string | null;
  user: { name: string | null };
};

export function ReviewsSection({
  ratingAvg,
  ratingCount,
  reviews,
}: {
  ratingAvg: number;
  ratingCount: number;
  reviews: Review[];
}) {
  return (
    <section className="bg-paper-muted py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Reviews
            </p>
            <h2 className="mt-3 text-balance text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
              Loved by {formatCompactNumber(ratingCount)}+ customers
            </h2>
            <div className="mt-5 flex items-center gap-3">
              <StarRating value={ratingAvg} size={18} />
              <span className="text-[18px] font-semibold">{ratingAvg.toFixed(1)}</span>
              <span className="text-[13px] text-ink-muted">
                ({formatCompactNumber(ratingCount)} reviews)
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.slice(0, 4).map((r) => {
              const title = r.title ?? r.user.name ?? "Customer";
              const initials = title
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2);
              return (
                <blockquote
                  key={r.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5"
                >
                  <StarRating value={r.rating} size={14} />
                  {r.body && <p className="text-[13.5px] leading-relaxed text-ink">{r.body}</p>}
                  <div className="mt-auto flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[12.5px] font-semibold">{title}</p>
                      {r.role && <p className="text-[11px] text-ink-muted">{r.role}</p>}
                    </div>
                  </div>
                </blockquote>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
