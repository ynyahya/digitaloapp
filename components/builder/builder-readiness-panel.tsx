import { AlertTriangle, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { summarizeReadiness, getNextReadinessAction } from "@/lib/builder/readiness/score";
import type { ReadinessCheck } from "@/lib/builder/readiness/types";
import { cn } from "@/lib/utils";

export function BuilderReadinessPanel({ checks, onSelect }: { checks: ReadinessCheck[]; onSelect: (section: string) => void }) {
  const summary = summarizeReadiness(checks);
  const next = getNextReadinessAction(checks);
  return (
    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Launch center</p>
          <h3 className="mt-1 text-[18px] font-black tracking-[-0.03em] text-chalk">{summary.score}% ready</h3>
          <p className="mt-1 text-[12px] text-chalk-muted">{summary.requiredDone}/{summary.requiredTotal} required complete</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><Sparkles className="h-5 w-5" /></div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-lime" style={{ width: `${summary.score}%` }} /></div>
      {next ? <Button className="mt-4 w-full rounded-2xl" size="sm" onClick={() => onSelect(next.targetSection)}>{next.actionLabel}</Button> : null}
      <div className="mt-4 space-y-2">
        {checks.map((check) => {
          const Icon = check.done ? CheckCircle2 : check.severity === "required" ? AlertTriangle : Circle;
          return (
            <button key={check.id} type="button" onClick={() => onSelect(check.targetSection)} className="flex w-full gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:bg-white/[0.05]">
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", check.done ? "text-lime" : check.severity === "required" ? "text-amber-300" : "text-chalk-dim")} />
              <span>
                <span className="block text-[12px] font-bold text-chalk">{check.label}</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-chalk-muted">{check.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
