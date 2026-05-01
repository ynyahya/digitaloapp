import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BuilderSectionCard({ id, eyebrow, title, description, complete, children, className }: { id?: string; eyebrow?: string; title: string; description?: string; complete?: boolean; children: ReactNode; className?: string }) {
  return (
    <section id={id} data-builder-section={id} className={cn("overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20", className)}>
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] bg-white/[0.035] px-5 py-4">
        <div>
          {eyebrow ? <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">{eyebrow}</p> : null}
          <h2 className="mt-1 text-[17px] font-bold tracking-[-0.02em] text-chalk">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-chalk-muted">{description}</p> : null}
        </div>
        {complete ? <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lime"><CheckCircle2 className="h-3 w-3" /> Complete</span> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
