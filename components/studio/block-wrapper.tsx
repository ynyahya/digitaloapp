"use client";

import { useState } from "react";
import {
  GripVertical,
  MoreHorizontal,
  Sparkles,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BlockWrapperProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  children: React.ReactNode;
  isAi?: boolean;
  advancedControls?: React.ReactNode;
  className?: string;
  blockId?: string;
}

export function BlockWrapper({
  icon: Icon,
  label,
  description,
  children,
  isAi,
  advancedControls,
  className,
  blockId,
}: BlockWrapperProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <section
      id={blockId}
      data-block={blockId}
      className={cn(
        "group relative bg-white/[0.025] rounded-3xl border border-white/[0.08]",
        "hover:border-lime/20 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300",
        "flex flex-col",
        className,
        "max-lg:!col-span-1"
      )}
    >
      <header className="flex items-center justify-between gap-4 px-4 pt-5 pb-4 border-b border-white/[0.08] sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              isAi
                ? "bg-lime text-night"
                : "bg-white/[0.06] text-chalk-muted group-hover:bg-lime group-hover:text-night"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-chalk truncate">{label}</h3>
              {isAi && <Sparkles className="h-3 w-3 text-lime animate-pulse shrink-0" />}
            </div>
            {description && (
              <p className="text-[11.5px] text-chalk-muted truncate">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {advancedControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "h-8 px-2.5 text-[11px] font-bold gap-1.5 rounded-lg transition-colors",
                showAdvanced
                  ? "bg-lime/10 text-lime"
                  : "text-chalk-muted hover:text-chalk"
              )}
            >
              <Settings2 className="h-3.5 w-3.5" />
              Advanced
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-chalk-muted hover:text-chalk opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-chalk-muted hover:text-chalk"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-5 flex-1 sm:px-6 sm:py-6">
        {children}
        {showAdvanced && advancedControls && (
          <div className="mt-6 pt-6 border-t border-white/[0.08] animate-in fade-in slide-in-from-top-2 duration-300">
            {advancedControls}
          </div>
        )}
      </div>
    </section>
  );
}
