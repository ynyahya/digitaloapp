"use client";

import { Plus, Command, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioCanvasProps {
  children: React.ReactNode;
}

export function StudioCanvas({ children }: StudioCanvasProps) {
  return (
    <main className="min-h-screen bg-paper pt-32 pb-40 flex flex-col items-center">
      <div className="w-full max-w-[1280px] px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children}
        </div>
        
        <div className="pt-8 flex flex-col items-center gap-6">
          {/* Add Block Button */}
          <button className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-line hover:border-ink/20 transition-all w-full justify-center hover:bg-paper-soft">
            <Plus className="h-5 w-5 text-ink-subtle group-hover:text-ink transition-colors" />
            <span className="text-[14px] font-bold text-ink-muted group-hover:text-ink transition-colors">Add Block</span>
          </button>
          
          {/* Keyboard Shortcut Hint */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-paper-muted border border-line text-[11px] font-bold text-ink-subtle">
            <Command className="h-3.5 w-3.5" />
            <span>Press <kbd className="font-mono bg-paper px-1.5 py-0.5 rounded border border-line-strong">K</kbd> for Command Palette</span>
            <span className="mx-2 text-line">·</span>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Press <kbd className="font-mono bg-paper px-1.5 py-0.5 rounded border border-line-strong">/</kbd> for AI Assist</span>
          </div>
        </div>
      </div>
    </main>
  );
}
