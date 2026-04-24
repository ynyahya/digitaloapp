"use client";

import {
  ChevronLeft,
  Share2,
  MoreVertical,
  Undo2,
  Redo2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/hooks/use-studio-state";

interface StudioHeaderProps {
  activeMode: "build" | "preview" | "launch";
  onModeChange: (mode: "build" | "preview" | "launch") => void;
  onPublish?: () => void;
}

const STATUS_BADGES: Record<
  string,
  { label: string; bg: string; border: string; dot: string; text: string }
> = {
  DRAFT: {
    label: "Draft",
    bg: "bg-paper-muted",
    border: "border-line",
    dot: "bg-amber-500",
    text: "text-ink-subtle",
  },
  PUBLISHED: {
    label: "Live",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
  },
};

export function StudioHeader({
  activeMode,
  onModeChange,
  onPublish,
}: StudioHeaderProps) {
  const { product, saveStatus, canUndo, canRedo, undo, redo } = useStudio();
  const badge = STATUS_BADGES[product.status] || STATUS_BADGES.DRAFT;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-line bg-paper/85 backdrop-blur-xl z-50 pl-4 pr-6 grid grid-cols-[1fr_auto_1fr] items-center">
      {/* Left — Navigation & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-paper-muted shrink-0"
          asChild
        >
          <Link href="/dashboard/products" aria-label="Back to products">
            <ChevronLeft className="h-4 w-4 text-ink-muted" />
          </Link>
        </Button>
        <div className="h-5 w-px bg-line shrink-0" />
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-[14px] font-bold text-ink truncate max-w-[260px]">
            {product.title}
          </h1>
          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-full border shrink-0",
              badge.bg,
              badge.border
            )}
          >
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                badge.dot,
                product.status === "DRAFT" && "animate-pulse"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.15em]",
                badge.text
              )}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Center — Mode Tabs */}
      <nav className="flex items-center gap-1 p-1 bg-paper-muted rounded-xl border border-line shadow-soft">
        {(["build", "preview", "launch"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={cn(
              "px-5 py-1.5 text-[12.5px] font-bold capitalize rounded-lg transition-all",
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
      <div className="flex items-center gap-2 justify-end">
        {/* Save Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px]">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 text-ink-muted animate-spin" />
              <span className="text-ink-muted">Saving…</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-ink-muted">Saved</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-red-600 font-medium">Save failed</span>
            </>
          )}
          {saveStatus === "idle" && (
            <span className="text-ink-subtle">All caught up</span>
          )}
        </div>

        <div className="h-5 w-px bg-line mx-1" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
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

        <div className="h-5 w-px bg-line mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className="h-9 rounded-xl px-3 text-[12.5px] font-bold text-ink-muted hover:text-ink hidden sm:inline-flex"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Button
          onClick={onPublish}
          className={cn(
            "h-9 rounded-xl px-4 text-[12.5px] font-bold shadow-soft transition-all group inline-flex items-center",
            product.status === "PUBLISHED"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-ink text-paper hover:opacity-90"
          )}
        >
          <Rocket
            className={cn(
              "h-3.5 w-3.5 mr-2 transition-transform",
              product.status !== "PUBLISHED" &&
                "group-hover:-rotate-12 group-hover:-translate-y-0.5"
            )}
          />
          {product.status === "PUBLISHED" ? "Published" : "Publish"}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border border-line hover:bg-paper-muted"
        >
          <MoreVertical className="h-4 w-4 text-ink-muted" />
        </Button>
      </div>
    </header>
  );
}
