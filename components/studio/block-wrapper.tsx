"use client";

import { useState } from "react";
import { GripVertical, MoreHorizontal, Sparkles, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BlockWrapperProps {
  icon: any;
  label: string;
  children: React.ReactNode;
  isAi?: boolean;
  advancedControls?: React.ReactNode;
  className?: string;
}

export function BlockWrapper({ icon: Icon, label, children, isAi, advancedControls, className }: BlockWrapperProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={cn(
      "group relative bg-paper rounded-[24px] border border-line hover:border-line-strong hover:shadow-card transition-all duration-300 overflow-hidden",
      className
    )}>
      <div className="absolute left-3 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab active:cursor-grabbing hover:bg-paper-muted">
          <GripVertical className="h-4 w-4 text-ink-subtle" />
        </Button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6 pl-8">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
              isAi ? "bg-ink text-paper" : "bg-paper-muted text-ink-subtle group-hover:bg-ink group-hover:text-paper"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">{label}</span>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-ink">{isAi ? "AI Optimized Content" : label}</h3>
                {isAi && <Sparkles className="h-3 w-3 text-ink animate-pulse" />}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {advancedControls && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn("h-8 px-2 text-[11px] font-bold gap-2 rounded-lg", showAdvanced ? "bg-paper-muted text-ink" : "text-ink-muted")}
              >
                <Settings2 className="h-3.5 w-3.5" />
                Advanced
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <MoreHorizontal className="h-4 w-4 text-ink-subtle" />
            </Button>
          </div>
        </div>

        <div className="pl-11 pr-4">
          {children}
          {showAdvanced && advancedControls && (
            <div className="mt-8 pt-6 border-t border-line animate-in fade-in slide-in-from-top-2 duration-300">
               {advancedControls}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
