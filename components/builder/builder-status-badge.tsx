import { CheckCircle2, Circle, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type BuilderStatusTone = "success" | "warning" | "danger" | "neutral" | "saving";

const toneClasses: Record<BuilderStatusTone, string> = {
  success: "border-lime/20 bg-lime/10 text-lime",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  danger: "border-red-400/20 bg-red-400/10 text-red-200",
  neutral: "border-white/[0.1] bg-white/[0.04] text-chalk-muted",
  saving: "border-white/[0.1] bg-white/[0.04] text-chalk-muted",
};

export function BuilderStatusBadge({ label, tone = "neutral", className }: { label: string; tone?: BuilderStatusTone; className?: string }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? AlertTriangle : tone === "saving" ? Loader2 : Circle;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]", toneClasses[tone], className)}>
      <Icon className={cn("h-3 w-3", tone === "saving" && "animate-spin")} />
      {label}
    </span>
  );
}
