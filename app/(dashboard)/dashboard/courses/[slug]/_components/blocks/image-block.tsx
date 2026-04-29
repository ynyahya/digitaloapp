"use client";

import { useState } from "react";
import { ImageIcon, Upload, Link2, Trash2, Grid, Columns, Move, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [layout, setLayout] = useState<"single" | "grid" | "gallery">("single");
  const [images, setImages] = useState<string[]>(() => {
    try {
      const d = JSON.parse(content || "{}");
      return d.images || (d.url ? [d.url] : []);
    } catch {
      return content ? [content] : [];
    }
  });
  const [urlInput, setUrlInput] = useState("");
  const [alt, setAlt] = useState("");
  const [uploadZone, setUploadZone] = useState(false);

  const persist = (imgs: string[]) => {
    setImages(imgs);
    onChange(JSON.stringify({ images: imgs, layout, alt }));
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    persist([...images, urlInput.trim()]);
    setUrlInput("");
  };

  const removeImage = (idx: number) => {
    persist(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
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

      {/* Layout Switcher */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-semibold text-ink-muted uppercase mr-1">Layout:</span>
        {[
          { key: "single", icon: Move, label: "Single" },
          { key: "grid", icon: Grid, label: "Grid" },
          { key: "gallery", icon: Columns, label: "Gallery" },
        ].map((l) => (
          <button
            key={l.key}
            onClick={() => setLayout(l.key as any)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
              layout === l.key
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "text-ink-muted border border-transparent hover:border-line"
            }`}
          >
            <l.icon className="h-3 w-3" /> {l.label}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        /* Upload Zone */
        <div
          className="aspect-video bg-paper-soft rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center gap-3 hover:border-indigo-300 transition-colors cursor-pointer group"
          onClick={() => setUploadZone(true)}
        >
          <div className="w-14 h-14 rounded-2xl bg-paper border border-line flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
            <ImageIcon className="h-7 w-7 text-indigo-500" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-ink">Drop images or click to browse</p>
            <p className="text-[11px] text-ink-muted mt-1">PNG, JPG, GIF, WebP • Up to 10MB each</p>
          </div>
          <Button size="sm" className="h-8 rounded-lg text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white">
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Select Images
          </Button>
        </div>
      ) : (
        /* URL input */
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <input
                type="text"
                placeholder="Paste image URL…"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addUrl()}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-line bg-paper text-[13px] text-ink placeholder:text-ink-muted focus:border-indigo-400 outline-none"
              />
            </div>
            <Button
              size="sm"
              className="h-9 rounded-lg text-[11px]"
              onClick={addUrl}
              disabled={!urlInput.trim()}
            >
              Add
            </Button>
          </div>
          <div className="space-y-1.5">
            <input
              type="text"
              placeholder="Alt text (for accessibility)"
              value={alt}
              onChange={(e) => {
                setAlt(e.target.value);
                onChange(JSON.stringify({ images, layout, alt: e.target.value }));
              }}
              className="w-full h-9 px-3 rounded-lg border border-line bg-paper text-[13px] text-ink placeholder:text-ink-muted focus:border-indigo-400 outline-none"
            />
          </div>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div
          className={`grid gap-2 ${
            layout === "single"
              ? "grid-cols-1"
              : layout === "grid"
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative group/img rounded-xl overflow-hidden border border-line bg-paper-soft ${
                layout === "single" ? "aspect-video" : "aspect-square"
              }`}
            >
              <img
                src={img}
                alt={alt || `Image ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button className="p-1.5 rounded-lg bg-paper/90 text-ink hover:bg-paper transition-colors">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  className="p-1.5 rounded-lg bg-paper/90 text-rose-500 hover:bg-rose-50 transition-colors"
                  onClick={() => removeImage(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
