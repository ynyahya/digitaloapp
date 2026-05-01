import { cn } from "@/lib/utils";

export type BuilderModeTab = { id: string; label: string };

export function BuilderModeTabs({ tabs, activeId, onChange }: { tabs: BuilderModeTab[]; activeId: string; onChange: (id: string) => void }) {
  return (
    <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1">
      {tabs.map((tab) => (
        <button key={tab.id} type="button" onClick={() => onChange(tab.id)} className={cn("rounded-xl px-3 py-1.5 text-[12px] font-bold transition", activeId === tab.id ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk")}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
