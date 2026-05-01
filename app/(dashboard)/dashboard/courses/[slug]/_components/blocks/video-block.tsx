"use client";

import { useState } from "react";
import {
  FileVideo,
  Upload,
  Link2,
  Play,
  Image as ImageIcon,
  Clock,
  Type,
  Trash2,
  ExternalLink,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "embed">("upload");
  const [provider, setProvider] = useState<string>("YOUTUBE");
  const [url, setUrl] = useState<string>(() => {
    try {
      const d = JSON.parse(content || "{}");
      return d.url || d.videoUrl || "";
    } catch {
      return content || "";
    }
  });
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const persist = (updates: Record<string, any>) => {
    try {
      const existing = JSON.parse(content || "{}");
      onChange(JSON.stringify({ ...existing, ...updates }));
    } catch {
      onChange(JSON.stringify(updates));
    }
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    persist({ url: val, provider });
  };

  const handleProviderChange = (p: string) => {
    setProvider(p);
    persist({ provider: p, url });
  };

  const handleFileUpload = () => {
    setUploadState("uploading");
    setFileName("lesson-video.mp4");
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("done");
          persist({ type: "upload", fileName, url: "/uploads/video.mp4" });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-white/[0.035] border border-white/[0.08] rounded-lg w-fit">
        <button
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
            mode === "upload" ? "bg-night text-chalk shadow-sm" : "text-chalk-muted hover:text-chalk"
          }`}
        >
          <Upload className="h-3 w-3" /> Upload
        </button>
        <button
          onClick={() => setMode("embed")}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
            mode === "embed" ? "bg-night text-chalk shadow-sm" : "text-chalk-muted hover:text-chalk"
          }`}
        >
          <Link2 className="h-3 w-3" /> Embed
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-4">
          {/* Upload Zone / Preview */}
          {uploadState === "idle" && !url ? (
            <div className="aspect-video bg-white/[0.035] rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-3 hover:border-lime/50 transition-colors cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-night border border-white/[0.08] flex items-center justify-center group-hover:border-lime/30 group-hover:bg-lime/10 transition-all">
                <FileVideo className="h-7 w-7 text-lime" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-chalk">Drop video here or click to browse</p>
                <p className="text-[11px] text-chalk-muted mt-1">MP4, WebM, MOV • Up to 2GB</p>
              </div>
              <Button
                size="sm"
                className="h-8 rounded-lg text-[11px] bg-lime hover:bg-lime/90 text-white"
                onClick={handleFileUpload}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" /> Select File
              </Button>
            </div>
          ) : uploadState === "uploading" ? (
            <div className="aspect-video bg-white/[0.035] rounded-xl border-2 border-white/[0.08] flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 text-lime animate-spin" />
              <div className="text-center">
                <p className="text-[13px] font-semibold text-chalk">Uploading {fileName}</p>
                <p className="text-[11px] text-chalk-muted mt-0.5">{progress}% complete</p>
              </div>
              <div className="w-[300px] h-1.5 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="aspect-video bg-white/[0.035] rounded-xl border border-white/[0.08] flex items-center justify-center relative group overflow-hidden">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-lime/90 flex items-center justify-center mx-auto">
                    <Play className="h-7 w-7 text-white ml-1" />
                  </div>
                  <p className="text-[11px] font-medium text-chalk-muted">Video ready to play</p>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg bg-night border border-white/[0.08] hover:bg-white/[0.035] transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-night/90 border border-white/[0.08] text-[10px] font-medium text-chalk backdrop-blur-sm">
                  <Check className="h-3 w-3 inline mr-1 text-emerald-500" />
                  Ready
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-chalk-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 12:34
                </span>
                <span>MP4</span>
                <span>128MB</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Embed URL */}
          <div className="bg-white/[0.035] rounded-xl border border-white/[0.08] p-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-chalk-muted uppercase tracking-wider">
                Video Provider
              </label>
              <div className="flex gap-1.5">
                {["YOUTUBE", "VIMEO", "LOOM", "WISTIA"].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      provider === p
                        ? "bg-lime/10 text-lime border border-lime/25"
                        : "text-chalk-muted border border-transparent hover:border-white/[0.08]"
                    }`}
                  >
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-chalk-muted uppercase tracking-wider">
                Video URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-chalk-muted" />
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=…"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-white/[0.08] bg-night text-[13px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 focus:ring-1 focus:ring-lime/20 outline-none transition-all"
                  />
                </div>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    className="p-2 rounded-lg border border-white/[0.08] bg-night hover:bg-white/[0.035] transition-colors text-chalk-muted"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail & Chapters (when video is set) */}
      {url && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.08]">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-chalk-muted uppercase">Thumbnail</label>
            <div className="h-20 bg-white/[0.035] rounded-lg border border-white/[0.08] flex items-center justify-center text-[11px] text-chalk-muted cursor-pointer hover:border-lime/30 transition-colors">
              <ImageIcon className="h-4 w-4 mr-1.5" /> Set custom thumbnail
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-chalk-muted uppercase">Captions</label>
            <div className="h-20 bg-white/[0.035] rounded-lg border border-white/[0.08] flex items-center justify-center text-[11px] text-chalk-muted cursor-pointer hover:border-lime/30 transition-colors">
              <Type className="h-4 w-4 mr-1.5" /> Upload .srt / .vtt
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
