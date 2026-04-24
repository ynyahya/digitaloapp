"use client";

import { ChevronLeft, ChevronRight, Share2, MoreVertical, Undo2, Redo2, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/hooks/use-studio-state";

interface StudioHeaderProps {
  activeMode: "build" | "preview" | "launch";
  onModeChange: (mode: "build" | "preview" | "launch") => void;
  onPublish?: () => void;
}

const STATUS_BADGES: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "Draft", color: "bg-paper-muted border-line", dot: "bg-amber-500" },
  PUBLISHED: { label: "Live", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  ARCHIVED: { label: "Archived", color: "bg-red-50 border-red-200", dot: "bg-red-500" },
};

export function StudioHeader({ activeMode, onModeChange, onPublish }: StudioHeaderProps) {
  const { product, saveStatus, canUndo, canRedo, undo, redo } = useStudio();
  const badge = STATUS_BADGES[product.status] || STATUS_BADGES.DRAFT;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-line bg-paper/95 backdrop-blur-md z-50 px-6 flex items-center justify-between">
      {/* Left — Navigation & Title */}
      <div className="flex items-center gap-4 min-w-0">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-paper-muted shrink-0" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="h-4 w-4 text-ink-muted" />
          </Link>
        </Button>
        <div className="h-4 w-px bg-line shrink-0" />
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-[14px] font-bold text-ink truncate max-w-[200px]">{product.title}</h1>
          <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border shrink-0", badge.color)}>
            <div className={cn("h-1.5 w-1.5 rounded-full", badge.dot, product.status === "DRAFT" && "animate-pulse")} />
            <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">{badge.label}</span>
          </div>
        </div>
      </div>

      {/* Center — Mode Tabs */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 bg-paper-muted rounded-xl border border-line shadow-soft">
        {(["build", "preview", "launch"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={cn(
              "px-6 py-1.5 text-[12.5px] font-bold capitalize rounded-lg transition-all",
              activeMode === mode
                ? "bg-paper text-ink shadow-soft border border-line"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {mode}
          </button>
        ))}
      </nav>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 mr-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg" 
            disabled={!canUndo}
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg" 
            disabled={!canRedo}
            onClick={redo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-4 w-px bg-line" />

        {/* Save Status */}
        <div className="flex items-center gap-1.5 px-2 text-[11px] min-w-[120px]">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 text-ink-muted animate-spin" />
              <span className="text-ink-muted">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-ink-muted">All changes saved</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-red-600 font-medium">Save failed</span>
            </>
          )}
          {saveStatus === "idle" && (
            <>
              <Clock className="h-3 w-3 text-ink-subtle" />
              <span className="text-ink-subtle italic">Ready</span>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-line" />

        <Button variant="ghost" size="sm" className="h-9 rounded-xl px-4 text-[12.5px] font-bold text-ink-muted hover:text-ink">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button 
          onClick={onPublish}
          className={cn(
            "h-9 rounded-xl px-5 text-[12.5px] font-bold shadow-float transition-all group",
            product.status === "PUBLISHED"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-ink text-paper hover:opacity-90"
          )}
        >
          {product.status === "PUBLISHED" ? "Published ✓" : "Publish Product"}
          {product.status !== "PUBLISHED" && (
            <ChevronRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-line hover:bg-paper-muted">
          <MoreVertical className="h-4 w-4 text-ink-muted" />
        </Button>
      </div>
    </header>
  );
}
