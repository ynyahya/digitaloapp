"use client";

import { ListChecks, FileText, Clock, Upload, Link2 } from "lucide-react";

export function AssignmentBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const data = (() => {
    try {
      return JSON.parse(content || "{}");
    } catch {
      return { brief: content || "", dueDate: "", points: "", resources: "" };
    }
  })();

  const persist = (updates: any) => {
    onChange(JSON.stringify({ ...data, ...updates }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/25 flex items-center justify-center">
          <ListChecks className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-chalk">Assignment</p>
          <p className="text-[10px] text-chalk-muted">Exercise for students to complete</p>
        </div>
      </div>

      {/* Brief */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-chalk-muted uppercase tracking-wider">
          Assignment Brief
        </label>
        <textarea
          value={data.brief}
          onChange={(e) => persist({ brief: e.target.value })}
          placeholder="Describe what students need to do…"
          className="w-full min-h-[120px] p-3 rounded-xl border border-white/[0.08] bg-white/[0.035] text-[13px] text-chalk placeholder:text-chalk-muted resize-none focus:border-lime/60 focus:ring-1 focus:ring-lime/20 outline-none transition-all"
          rows={4}
        />
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-chalk-muted uppercase">Due Date</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-chalk-muted" />
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => persist({ dueDate: e.target.value })}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-white/[0.08] bg-night text-[12px] text-chalk focus:border-lime/60 outline-none"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-chalk-muted uppercase">Max Points</label>
          <input
            type="number"
            value={data.points}
            onChange={(e) => persist({ points: e.target.value })}
            placeholder="100"
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-night text-[12px] text-chalk focus:border-lime/60 outline-none"
          />
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-chalk-muted uppercase">Supplemental Resources</label>
        <textarea
          value={data.resources}
          onChange={(e) => persist({ resources: e.target.value })}
          placeholder="Links, files, or references…"
          className="w-full min-h-[80px] p-3 rounded-xl border border-white/[0.08] bg-white/[0.035] text-[13px] text-chalk placeholder:text-chalk-muted resize-none focus:border-lime/60 focus:ring-1 focus:ring-lime/20 outline-none transition-all"
          rows={3}
        />
      </div>

      {/* Upload File */}
      <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-4 flex items-center justify-center gap-2 text-[12px] text-chalk-muted hover:border-lime/50 transition-colors cursor-pointer">
        <Upload className="h-3.5 w-3.5" />
        Attach starter files (optional)
      </div>
    </div>
  );
}
