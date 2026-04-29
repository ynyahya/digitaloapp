"use client";

import { useState } from "react";
import { Headphones, Upload, Link2, Play, Pause, Download, Music, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 180; // 3 min stub

  const url = (() => {
    try {
      const d = JSON.parse(content || "{}");
      return d.url || content || "";
    } catch {
      return content || "";
    }
  })();

  const persist = (updates: Record<string, any>) => {
    try {
      const existing = JSON.parse(content || "{}");
      onChange(JSON.stringify({ ...existing, ...updates }));
    } catch {
      onChange(JSON.stringify(updates));
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 p-0.5 bg-paper-soft border border-line rounded-lg w-fit">
        <button
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
            mode === "upload" ? "bg-paper text-ink shadow-sm" : "text-ink-muted hover:text-ink"
          }`}
        >
          <Upload className="h-3 w-3" /> Upload
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
            mode === "url" ? "bg-paper text-ink shadow-sm" : "text-ink-muted hover:text-ink"
          }`}
        >
          <Link2 className="h-3 w-3" /> URL
        </button>
      </div>

      {mode === "upload" && !url ? (
        <div className="h-36 bg-paper-soft rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center gap-3 hover:border-indigo-300 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-paper border border-line flex items-center justify-center">
            <Music className="h-7 w-7 text-violet-500" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-ink">Upload audio file</p>
            <p className="text-[11px] text-ink-muted mt-1">MP3, WAV, FLAC • Up to 200MB</p>
          </div>
          <Button size="sm" className="h-8 rounded-lg text-[11px] bg-violet-600 hover:bg-violet-700 text-white">
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Select Audio
          </Button>
        </div>
      ) : mode === "url" && !url ? (
        /* URL Input */
        <div className="bg-paper-soft rounded-xl border border-line p-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Paste audio URL or embed link…"
              value={url}
              onChange={(e) => persist({ url: e.target.value })}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-line bg-paper text-[13px] text-ink placeholder:text-ink-muted focus:border-indigo-400 outline-none"
            />
          </div>
        </div>
      ) : (
        /* Audio Player */
        <div className="bg-paper-soft rounded-xl border border-line p-5 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </button>
            <div className="flex-1 space-y-3">
              {/* Waveform Visualization */}
              <div className="flex items-end gap-[2px] h-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-violet-200"
                    style={{
                      height: `${Math.random() * 80 + 10}%`,
                      opacity: i <= (currentTime / duration) * 40 ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              {/* Progress Bar */}
              <div className="relative">
                <div className="h-1 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-200"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-ink-muted">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Mic className="h-3 w-3" /> Podcast
              </span>
              <span>{formatTime(duration)}</span>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-paper text-ink-muted transition-colors">
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
