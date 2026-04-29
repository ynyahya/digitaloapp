"use client";

import { Code2, Copy, Check } from "lucide-react";
import { useState } from "react";

const LANGUAGES = [
  "javascript", "typescript", "python", "html", "css", "json", "bash", "sql", "jsx", "tsx",
];

export function CodeBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const data = (() => {
    try {
      const d = JSON.parse(content || "{}");
      return { code: d.code || "", language: d.language || "javascript", caption: d.caption || "" };
    } catch {
      return { code: content || "", language: "javascript", caption: "" };
    }
  })();

  const [copied, setCopied] = useState(false);

  const persist = (updates: any) => {
    onChange(JSON.stringify({ ...data, ...updates }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Language Selector + Copy */}
      <div className="flex items-center justify-between">
        <select
          value={data.language}
          onChange={(e) => persist({ language: e.target.value })}
          className="h-7 px-2 rounded-lg border border-line bg-paper text-[11px] font-medium text-ink-muted focus:border-indigo-400 outline-none"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-ink-muted hover:bg-paper-soft transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Editor */}
      <div className="relative rounded-xl border border-line bg-[#0d1117] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-[10px] font-medium text-white/40">{data.language}</span>
        </div>
        <textarea
          value={data.code}
          onChange={(e) => persist({ code: e.target.value })}
          placeholder={`// Write your ${data.language} code here…`}
          className="w-full min-h-[200px] px-4 py-3 bg-transparent text-[13px] text-[#e6edf3] font-mono leading-relaxed resize-none focus:outline-none placeholder:text-white/20"
          spellCheck={false}
        />
      </div>

      {/* Caption */}
      <input
        type="text"
        placeholder="Code caption (optional)"
        value={data.caption}
        onChange={(e) => persist({ caption: e.target.value })}
        className="w-full h-8 px-3 rounded-lg border border-line bg-paper text-[12px] text-ink-muted placeholder:text-ink-muted focus:border-indigo-400 outline-none"
      />
    </div>
  );
}
