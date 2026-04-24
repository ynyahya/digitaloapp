"use client";

import { Plus, Command, Sparkles } from "lucide-react";

interface StudioCanvasProps {
  children: React.ReactNode;
}

export function StudioCanvas({ children }: StudioCanvasProps) {
  return (
    <main className="min-h-screen bg-paper-soft pt-24 pb-40">
      <div className="mx-auto w-full max-w-[1360px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6">{children}</div>

        <div className="pt-10 flex flex-col items-center gap-5">
          <button className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-line hover:border-ink/20 transition-all w-full bg-transparent hover:bg-paper">
            <Plus className="h-5 w-5 text-ink-subtle group-hover:text-ink transition-colors" />
            <span className="text-[13px] font-bold text-ink-muted group-hover:text-ink transition-colors">
              Add Block
            </span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-xl bg-paper border border-line text-[11px] font-bold text-ink-subtle">
            <span className="inline-flex items-center gap-2">
              <Command className="h-3.5 w-3.5" />
              Press
              <kbd className="font-mono bg-paper-muted px-1.5 py-0.5 rounded border border-line-strong text-ink-muted">
                K
              </kbd>
              for Command Palette
            </span>
            <span className="text-line">·</span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Press
              <kbd className="font-mono bg-paper-muted px-1.5 py-0.5 rounded border border-line-strong text-ink-muted">
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
      <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-[0.2em]">
            {eyebrow}
          </p>
          <h2 className="text-[18px] font-bold text-ink tracking-tight">{title}</h2>
        </div>
        {description && (
          <p className="text-[12.5px] text-ink-muted max-w-md text-right hidden md:block">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
