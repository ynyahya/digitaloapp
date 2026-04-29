"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
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
  const [filter, setFilter] = useState<number | "all">("all");
  const [limit, setLimit] = useState(6);

  const distribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 star
    for (const r of reviews) {
      const idx = Math.max(0, Math.min(4, Math.round(r.rating) - 1));
      buckets[idx] += 1;
    }
    return buckets;
  }, [reviews]);

  const filtered = useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter((r) => Math.round(r.rating) === filter);
  }, [filter, reviews]);

  if (reviews.length === 0) return null;

  const totalForBar = reviews.length;

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="grid gap-10 md:grid-cols-[280px_1fr] md:gap-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Reviews
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[44px] font-extrabold leading-none text-ink tabular-nums">
              {ratingAvg.toFixed(1)}
            </span>
            <span className="text-[15px] text-ink-muted">/ 5</span>
          </div>
          <StarRating value={ratingAvg} size={16} />
          <p className="mt-1 text-[12.5px] text-ink-muted">
            Based on {formatCompactNumber(ratingCount)}{" "}
            {ratingCount === 1 ? "review" : "reviews"}
          </p>

          <div className="mt-6 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1];
              const pct = totalForBar ? (count / totalForBar) * 100 : 0;
              const isActive = filter === star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFilter(isActive ? "all" : star)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors",
                    isActive ? "bg-paper-soft" : "hover:bg-paper-soft",
                  )}
                >
                  <span className="w-10 text-[12px] font-semibold tabular-nums text-ink">
                    {star}★
                  </span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-paper-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-ink"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11.5px] tabular-nums text-ink-muted">
                    {count}
                  </span>
                </button>
              );
            })}
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-2 text-[11.5px] font-semibold text-ink-muted underline-offset-2 hover:text-ink hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-paper p-8 text-center text-[13px] text-ink-muted">
              No {filter}-star reviews yet.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.slice(0, limit).map((r) => {
                const name = r.title ?? r.user.name ?? "Customer";
                const initials = name
                  .split(" ")
                  .map((p) => p[0])
                  .filter(Boolean)
                  .join("")
                  .slice(0, 2);
                return (
                  <blockquote
                    key={r.id}
                    className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5"
                  >
                    <StarRating value={r.rating} size={14} />
                    {r.body && (
                      <p className="text-[13.5px] leading-relaxed text-ink">
                        {r.body}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials || "C"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[12.5px] font-semibold text-ink">
                          {name}
                        </p>
                        {r.role && (
                          <p className="text-[11px] text-ink-muted">{r.role}</p>
                        )}
                      </div>
                    </div>
                  </blockquote>
                );
              })}
            </div>
          )}
          {filtered.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((l) => l + 6)}
              className="mt-6 inline-flex h-10 items-center rounded-full border border-line bg-paper px-5 text-[12.5px] font-semibold text-ink transition-colors hover:border-ink/30"
            >
              Show more reviews
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
