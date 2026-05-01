import type { ReactNode } from "react";

export function BuilderInspector({ title = "Inspector", description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <div className="sticky top-20 space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">{title}</p>
        {description ? <p className="mt-1 text-[12px] text-chalk-muted">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
