"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot, MessageSquare, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-paper shadow-float transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {/* Copilot Panel */}
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-2xl transition-all duration-300 ease-in-out",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-line bg-paper-soft px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-paper">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-[14px] font-semibold">AI Copilot</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-ink-subtle hover:bg-paper-muted hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat / Insights Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">Insights for you</p>
            <div className="grid grid-cols-1 gap-3">
              <InsightCard
                icon={TrendingUp}
                title="Revenue Forecast"
                description="Your store is projected to grow 14% next month based on current trends."
              />
              <InsightCard
                icon={Lightbulb}
                title="Pricing Opportunity"
                description="Increasing the price of 'SaaS Starter Kit' to $59 could boost profit by 8%."
              />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex gap-3">
               <div className="h-8 w-8 rounded-full bg-paper-muted flex items-center justify-center shrink-0">
                 <Bot className="h-4 w-4 text-ink" />
               </div>
               <div className="bg-paper-soft rounded-2xl rounded-tl-none p-3 border border-line">
                 <p className="text-[13px] leading-relaxed">
                   Hello Alex! I&apos;ve analyzed your store. You have a <strong>3.2% conversion rate</strong>. Would you like me to suggest ways to improve it?
                 </p>
               </div>
             </div>

             <div className="flex flex-wrap gap-2 pt-2">
               {["Suggest bundles", "Optimize copy", "Analyze audience"].map((s) => (
                 <button key={s} className="px-3 py-1.5 rounded-full border border-line bg-paper text-[11.5px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink transition-all">
                   {s}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-line p-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Ask copilot..."
              className="h-11 w-full rounded-2xl border border-line bg-paper-soft pl-4 pr-12 text-[13px] outline-none transition-all focus:border-ink/20 focus:ring-4 focus:ring-ink/5"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-xl bg-ink text-paper opacity-80 hover:opacity-100 transition-opacity">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-ink-subtle uppercase tracking-widest font-medium">
             <MessageSquare className="h-3 w-3" />
             AI-Powered by Digitalo Brain
          </div>
        </div>
      </div>
    </>
  );
}

function InsightCard({ icon: Icon, title, description }: any) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-3.5 shadow-soft hover:shadow-card transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xl bg-paper-muted flex items-center justify-center text-ink shrink-0 group-hover:bg-ink group-hover:text-paper transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[13px] font-semibold">{title}</p>
          <p className="text-[11.5px] text-ink-muted leading-snug">{description}</p>
        </div>
      </div>
    </div>
  );
}
