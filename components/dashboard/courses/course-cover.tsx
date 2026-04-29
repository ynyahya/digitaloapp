import Image from "next/image";
import { cn } from "@/lib/utils";

const PALETTES: Record<string, string> = {
  graphite: "from-neutral-900 via-neutral-700 to-neutral-500",
  ivory: "from-neutral-100 via-neutral-200 to-neutral-300",
  slate: "from-slate-900 via-slate-700 to-slate-500",
  emerald: "from-emerald-700 via-emerald-500 to-emerald-300",
  charcoal: "from-zinc-900 via-zinc-700 to-zinc-400",
  paper: "from-paper-muted via-paper-soft to-paper",
};

function pickPalette(seed: string) {
  const keys = Object.keys(PALETTES);
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[keys[h % keys.length]];
}

export function CourseCover({
  src,
  title,
  paletteSeed,
  aspect = "video",
  className,
}: {
  src?: string | null;
  title: string;
  paletteSeed?: string | null;
  aspect?: "video" | "square" | "wide";
  className?: string;
}) {
  const palette = pickPalette(paletteSeed || title);
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
      ? "aspect-[21/9]"
      : "aspect-video";

  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-muted", aspectClass, className)}>
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  const initials = title
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br text-paper",
        palette,
        aspectClass,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(0,0,0,0.18),transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[42px] font-bold tracking-tight leading-none mix-blend-overlay opacity-80">
            {initials || "T"}
          </p>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
          TESKEL · COURSE
        </span>
        <span className="text-[10px] font-medium opacity-60">teskel.app</span>
      </div>
    </div>
  );
}
