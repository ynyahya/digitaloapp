import type { ReactNode } from "react";

export function BuilderPreviewRail({ title = "Live preview", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="sticky top-20 space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">{title}</p>
        <p className="mt-1 text-[12px] text-chalk-muted">Preview what customers will see.</p>
      </div>
      {children}
    </div>
  );
}
