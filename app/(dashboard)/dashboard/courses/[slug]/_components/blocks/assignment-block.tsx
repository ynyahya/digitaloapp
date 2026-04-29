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
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
          <ListChecks className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-ink">Assignment</p>
          <p className="text-[10px] text-ink-muted">Exercise for students to complete</p>
        </div>
      </div>

      {/* Brief */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
          Assignment Brief
        </label>
        <textarea
          value={data.brief}
          onChange={(e) => persist({ brief: e.target.value })}
          placeholder="Describe what students need to do…"
          className="w-full min-h-[120px] p-3 rounded-xl border border-line bg-paper-soft text-[13px] text-ink placeholder:text-ink-muted resize-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-all"
          rows={4}
        />
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-ink-muted uppercase">Due Date</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => persist({ dueDate: e.target.value })}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-line bg-paper text-[12px] text-ink focus:border-indigo-400 outline-none"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-ink-muted uppercase">Max Points</label>
          <input
            type="number"
            value={data.points}
            onChange={(e) => persist({ points: e.target.value })}
            placeholder="100"
            className="w-full h-9 px-3 rounded-lg border border-line bg-paper text-[12px] text-ink focus:border-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-ink-muted uppercase">Supplemental Resources</label>
        <textarea
          value={data.resources}
          onChange={(e) => persist({ resources: e.target.value })}
          placeholder="Links, files, or references…"
          className="w-full min-h-[80px] p-3 rounded-xl border border-line bg-paper-soft text-[13px] text-ink placeholder:text-ink-muted resize-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-all"
          rows={3}
        />
      </div>

      {/* Upload File */}
      <div className="border-2 border-dashed border-line rounded-xl p-4 flex items-center justify-center gap-2 text-[12px] text-ink-muted hover:border-indigo-300 transition-colors cursor-pointer">
        <Upload className="h-3.5 w-3.5" />
        Attach starter files (optional)
      </div>
    </div>
  );
}
