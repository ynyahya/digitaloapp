import { cn } from "@/lib/utils";

export function MonoMockup({
  label,
  className,
  ratio = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-ink via-ink-soft to-[#1f1f1f] text-paper shadow-card",
        ratio,
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_80%,white,transparent_45%)]" />
      <div className="absolute inset-x-4 top-4 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-paper/20" />
        <span className="h-2 w-2 rounded-full bg-paper/20" />
        <span className="h-2 w-2 rounded-full bg-paper/20" />
      </div>
      <div className="absolute inset-x-6 top-10 grid grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-paper/10"
            style={{ opacity: 1 - (i % 5) * 0.12 }}
          />
        ))}
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-paper/50">
            Preview
          </p>
          <p className="mt-1 text-[13px] font-medium text-paper">{label}</p>
        </div>
        <div className="flex items-end gap-1.5">
          {[22, 34, 18, 40, 28, 46, 30, 44].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-paper/50"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
