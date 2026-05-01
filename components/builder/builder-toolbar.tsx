import type { ReactNode } from "react";

export function BuilderToolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-white/[0.08] bg-white/[0.025] p-2">{children}</div>;
}
