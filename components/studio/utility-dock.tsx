"use client";

import {
  BarChart3,
  Zap,
  Bot,
  HelpCircle,
  Command,
  type LucideIcon,
} from "lucide-react";
import type { StudioProduct } from "@/hooks/use-studio-state";
import { cn } from "@/lib/utils";
import { useStudio } from "@/hooks/use-studio-state";

export function UtilityDock() {
  const { product, toggleCopilot } = useStudio();
  const completeness = calculateCompleteness(product);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div className="flex items-center gap-1.5 p-1.5 bg-ink rounded-2xl shadow-float border border-white/10 backdrop-blur-md pointer-events-auto">
        <DockItem icon={BarChart3} label="Analytics" />
        <DockItem icon={Zap} label="Automations" />
        <DockItem icon={HelpCircle} label="Help & tutorials" />

        <div className="w-px h-6 bg-white/10 mx-1.5" />

        {/* Readiness */}
        <div className="flex items-center gap-2.5 pl-2 pr-3">
          <div className="relative h-8 w-8">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/15"
              />
              <circle
                cx="16"
                cy="16"
                r="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 13}
                strokeDashoffset={(2 * Math.PI * 13) * (1 - completeness / 100)}
                className={cn(
                  "transition-all duration-700",
                  completeness >= 80 ? "text-emerald-400" : "text-white"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums",
                  completeness >= 80 ? "text-emerald-400" : "text-white"
                )}
              >
                {completeness}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-white/50 uppercase tracking-[0.15em] leading-none">
              Ready
            </span>
            <span
              className={cn(
                "text-[11.5px] font-bold tabular-nums leading-tight",
                completeness >= 80 ? "text-emerald-400" : "text-white"
              )}
            >
              {completeness}%
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={() => toggleCopilot()}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white text-ink shadow-soft hover:bg-white/90 transition-all group"
        >
          <Bot className="h-4 w-4" />
          <span className="text-[12.5px] font-bold">Ask AI</span>
          <div className="flex items-center gap-0.5 ml-1 opacity-50 group-hover:opacity-70 transition-opacity">
            <Command className="h-3 w-3" />
            <span className="text-[10px] font-bold">J</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function DockItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      title={label}
      className="flex items-center justify-center h-9 w-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all group/dock relative"
    >
      <Icon className="h-4 w-4" />
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-ink border border-white/10 text-[10px] font-bold text-white opacity-0 group-hover/dock:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function calculateCompleteness(product: StudioProduct) {
  let score = 0;
  if (product.title && product.title.length > 3) score += 15;
  if (product.tagline && product.tagline.length > 10) score += 10;
  if (product.description && product.description.length > 50) score += 20;
  if (product.coverImage) score += 15;
  if (product.licenses && product.licenses.length > 0) score += 20;
  if (product.metaTitle && product.metaDescription) score += 10;
  if (product.files && product.files.length > 0) score += 10;
  return score;
}
