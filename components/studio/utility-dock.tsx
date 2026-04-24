"use client";

import { BarChart3, Zap, Bot, MessageSquare, Sparkles, Command, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/hooks/use-studio-state";

export function UtilityDock() {
  const { product, toggleCopilot } = useStudio();
  const completeness = calculateCompleteness(product);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 bg-ink rounded-[24px] shadow-float border border-white/10 backdrop-blur-md">
        <DockItem icon={BarChart3} label="Analytics (Coming Soon)" />
        <DockItem icon={Zap} label="Automations" />
        <DockItem icon={HelpCircle} label="Help & Tutorials" />
        <div className="w-px h-6 bg-white/10 mx-2" />
        
        <div className="flex items-center gap-3 px-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Readiness</span>
              <span className={cn("text-[13px] font-bold", completeness >= 80 ? "text-emerald-400" : "text-white")}>{completeness}%</span>
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center relative">
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                 <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" 
                    strokeDasharray="100.53" strokeDashoffset={100.53 - (100.53 * completeness) / 100} 
                    className={cn("transition-all duration-1000", completeness >= 80 ? "text-emerald-400" : "text-white")} />
              </svg>
              <span className="text-[10px] font-bold text-white">🚀</span>
           </div>
        </div>

        <div className="w-px h-6 bg-white/10 mx-2" />
        <button 
          onClick={() => toggleCopilot()}
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white text-ink shadow-soft hover:bg-white/90 transition-all group"
        >
          <Bot className="h-4 w-4" />
          <span className="text-[13px] font-bold">Ask AI Copilot</span>
          <div className="flex items-center gap-1 ml-2 opacity-40 group-hover:opacity-60 transition-opacity">
            <Command className="h-3 w-3" />
            <span className="text-[10px] font-bold">J</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function DockItem({ icon: Icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all group relative">
       <Icon className="h-5 w-5" />
       <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-ink border border-white/10 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          {label}
       </span>
    </button>
  );
}

function calculateCompleteness(product: any) {
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
