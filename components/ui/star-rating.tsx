import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  className,
  size = 14,
}: {
  value: number;
  className?: string;
  size?: number;
}) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = rounded >= i + 1 ? 1 : rounded >= i + 0.5 ? 0.5 : 0;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-line-strong" size={size} strokeWidth={1.5} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="text-ink" size={size} fill="currentColor" strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
