import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type BuilderNavItem = {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  complete?: boolean;
  warning?: boolean;
};

export function BuilderSidebar({ items, activeId, readinessScore, onSelect }: { items: BuilderNavItem[]; activeId: string; readinessScore?: number; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3 p-3 lg:sticky lg:top-16 lg:space-y-5 lg:p-4">
      <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.035] p-3 lg:rounded-[22px] lg:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Launch readiness</p>
        <div className="mt-2 flex items-end justify-between lg:mt-3">
          <span className="text-[26px] font-black tracking-[-0.05em] text-chalk lg:text-[34px]">{readinessScore ?? 0}%</span>
          <span className="mb-1 text-[11px] text-chalk-muted">ready</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06] lg:mt-3">
          <div className="h-full rounded-full bg-lime shadow-[0_0_18px_rgba(180,243,0,0.65)]" style={{ width: `${readinessScore ?? 0}%` }} />
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const Icon = item.icon;
          const StateIcon = item.complete ? CheckCircle2 : item.warning ? AlertTriangle : Circle;
          const active = activeId === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={cn("group flex min-w-[180px] items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition lg:min-w-0 lg:w-full lg:gap-3 lg:py-3", active ? "border-lime/25 bg-lime/10 text-chalk" : "border-white/[0.04] text-chalk-muted hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-chalk")}>
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl lg:h-9 lg:w-9", active ? "bg-lime text-night" : "bg-white/[0.05] text-chalk-muted group-hover:text-chalk")}>{Icon ? <Icon className="h-4 w-4" /> : <StateIcon className="h-4 w-4" />}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold">{item.label}</span>
                {item.description ? <span className="hidden truncate text-[11px] text-chalk-muted sm:block">{item.description}</span> : null}
              </span>
              <StateIcon className={cn("h-4 w-4 shrink-0", item.complete ? "text-lime" : item.warning ? "text-amber-300" : "text-chalk-dim")} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
