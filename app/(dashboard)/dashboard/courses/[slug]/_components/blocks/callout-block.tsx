"use client";

import { Info, AlertTriangle, Lightbulb, Quote, Star } from "lucide-react";

const CALLOUT_TYPES = [
  { key: "info", icon: Info, label: "Info", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { key: "warning", icon: AlertTriangle, label: "Warning", color: "bg-amber-500/10 border-amber-400/25 text-amber-200" },
  { key: "tip", icon: Lightbulb, label: "Tip", color: "bg-emerald-500/10 border-emerald-400/25 text-emerald-200" },
  { key: "quote", icon: Quote, label: "Quote", color: "bg-violet-50 border-violet-200 text-violet-700" },
  { key: "important", icon: Star, label: "Important", color: "bg-rose-500/10 border-rose-400/25 text-rose-200" },
];

export function CalloutBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const data = (() => {
    try {
      const d = JSON.parse(content || "{}");
      return { type: d.type || "info", text: d.text || "" };
    } catch {
      return { type: "info", text: content || "" };
    }
  })();

  const persist = (updates: any) => {
    onChange(JSON.stringify({ ...data, ...updates }));
  };

  const currentType = CALLOUT_TYPES.find((t) => t.key === data.type) || CALLOUT_TYPES[0];

  return (
    <div className="space-y-3">
      {/* Type Selector */}
      <div className="flex items-center gap-1">
        {CALLOUT_TYPES.map((ct) => (
          <button
            key={ct.key}
            onClick={() => persist({ type: ct.key })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
              data.type === ct.key
                ? "bg-lime/10 text-lime border border-lime/25"
                : "text-chalk-muted border border-transparent hover:border-white/[0.08]"
            }`}
          >
            <ct.icon className="h-3 w-3" /> {ct.label}
          </button>
        ))}
      </div>

      {/* Callout */}
      <div className={`rounded-xl border p-4 ${currentType.color}`}>
        <div className="flex gap-3">
          <currentType.icon className="h-5 w-5 shrink-0 mt-0.5" />
          <textarea
            value={data.text}
            onChange={(e) => persist({ text: e.target.value })}
            placeholder="Write your callout message…"
            className="flex-1 bg-transparent text-[14px] resize-none focus:outline-none placeholder:text-current/40 min-h-[60px]"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
