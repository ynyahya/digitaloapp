import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function BuilderEmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/[0.12] bg-white/[0.025] p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/10 text-lime"><Sparkles className="h-5 w-5" /></div>
      <h3 className="mt-4 text-[17px] font-bold text-chalk">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-chalk-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
