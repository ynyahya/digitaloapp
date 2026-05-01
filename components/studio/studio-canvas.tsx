"use client";

import { Plus, Command, Sparkles } from "lucide-react";
import { StudioMiniMap } from "./studio-minimap";

interface StudioCanvasProps {
  children: React.ReactNode;
}

export function StudioCanvas({ children }: StudioCanvasProps) {
  return (
    <main className="min-h-screen bg-night pt-40 pb-40 relative">
      {/* Mini Map Navigation */}
      <StudioMiniMap />

      <div className="mx-auto w-full max-w-[1360px] px-3 sm:px-5 md:px-8 2xl:pl-64">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">{children}</div>

        <div className="pt-10 flex flex-col items-center gap-5">
          <button className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-lime/30 transition-all w-full bg-white/[0.025] hover:bg-lime/10">
            <Plus className="h-5 w-5 text-ink-subtle group-hover:text-ink transition-colors" />
            <span className="text-[13px] font-bold text-ink-muted group-hover:text-ink transition-colors">
              Add Block
            </span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-xl bg-white/[0.035] border border-white/[0.08] text-[11px] font-bold text-chalk-muted">
            <span className="inline-flex items-center gap-2">
              <Command className="h-3.5 w-3.5" />
              Press
              <kbd className="font-mono bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.1] text-chalk-muted">
                K
              </kbd>
              for Command Palette
            </span>
            <span className="text-white/20">·</span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Press
              <kbd className="font-mono bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.1] text-chalk-muted">
                /
              </kbd>
              for AI Assist
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function StudioSection({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="col-span-12 pt-4 pb-1">
      <div className="flex items-baseline justify-between gap-6 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-lime uppercase tracking-[0.2em]">
            {eyebrow}
          </p>
          <h2 className="text-[18px] font-bold text-chalk tracking-tight">{title}</h2>
        </div>
        {description && (
          <p className="text-[12.5px] text-chalk-muted max-w-md text-right hidden md:block">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
