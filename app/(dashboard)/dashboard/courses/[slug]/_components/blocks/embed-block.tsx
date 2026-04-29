"use client";

import { LayoutGrid, Link2, Code2, FileText, Music } from "lucide-react";

const EMBED_TYPES = [
  { key: "website", icon: LayoutGrid, label: "Website", placeholder: "https://…" },
  { key: "codepen", icon: Code2, label: "CodePen", placeholder: "https://codepen.io/…" },
  { key: "figma", icon: LayoutGrid, label: "Figma", placeholder: "https://figma.com/…" },
  { key: "notion", icon: FileText, label: "Notion", placeholder: "https://notion.so/…" },
  { key: "spotify", icon: Music, label: "Spotify", placeholder: "https://open.spotify.com/…" },
  { key: "other", icon: Link2, label: "Other", placeholder: "Paste embed URL…" },
];

export function EmbedBlock({
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
      return { type: "website", url: content || "" };
    }
  })();

  const persist = (updates: any) => {
    onChange(JSON.stringify({ ...data, ...updates }));
  };

  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div className="flex items-center gap-1 flex-wrap">
        {EMBED_TYPES.map((et) => (
          <button
            key={et.key}
            onClick={() => persist({ type: et.key })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
              data.type === et.key
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "text-ink-muted border border-transparent hover:border-line"
            }`}
          >
            <et.icon className="h-3 w-3" /> {et.label}
          </button>
        ))}
      </div>

      {/* URL Input */}
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
        <input
          type="text"
          placeholder={EMBED_TYPES.find((et) => et.key === data.type)?.placeholder || "Paste URL…"}
          value={data.url || ""}
          onChange={(e) => persist({ url: e.target.value })}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-paper text-[13px] text-ink placeholder:text-ink-muted focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-all"
        />
      </div>

      {/* Preview */}
      {data.url && (
        <div className="aspect-video bg-paper-soft rounded-xl border border-line flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-paper border border-line flex items-center justify-center mx-auto">
              <LayoutGrid className="h-5 w-5 text-ink-muted" />
            </div>
            <p className="text-[12px] text-ink-muted font-medium">Embed preview will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}
