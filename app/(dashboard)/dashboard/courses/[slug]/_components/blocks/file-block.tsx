"use client";

import { FileText, Download, Upload, ExternalLink, File, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const files = (() => {
    try {
      const d = JSON.parse(content || "{}");
      return d.files || [];
    } catch {
      return [];
    }
  })();

  const persist = (f: any[]) => {
    onChange(JSON.stringify({ files: f }));
  };

  const removeFile = (idx: number) => {
    persist(files.filter((_: any, i: number) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-white/[0.035] rounded-xl border border-white/[0.08] group/file hover:border-lime/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-night border border-white/[0.08] flex items-center justify-center">
                  <File className="h-4 w-4 text-lime" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-chalk">{file.name || "Untitled File"}</p>
                  <p className="text-[10px] text-chalk-muted">{file.size || "Unknown size"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity">
                <a
                  href={file.url || "#"}
                  target="_blank"
                  className="p-1.5 rounded-lg hover:bg-night text-chalk-muted transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={file.url || "#"}
                  download
                  className="p-1.5 rounded-lg hover:bg-night text-chalk-muted transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-chalk-muted hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-32 bg-white/[0.035] rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-3 hover:border-lime/50 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-night border border-white/[0.08] flex items-center justify-center">
            <FileText className="h-7 w-7 text-lime" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-chalk">Upload downloadable file</p>
            <p className="text-[11px] text-chalk-muted mt-1">PDF, ZIP, DOCX, XLS • Up to 100MB</p>
          </div>
          <Button size="sm" className="h-8 rounded-lg text-[11px] bg-lime hover:bg-lime/90 text-white">
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Select File
          </Button>
        </div>
      )}
    </div>
  );
}
