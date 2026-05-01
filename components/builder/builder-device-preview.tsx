"use client";

import { useState, type ReactNode } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function BuilderDevicePreview({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("mobile");

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1">
        <button
          type="button"
          onClick={() => setDevice("mobile")}
          className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition", device === "mobile" ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk")}
        >
          <Smartphone className="h-3.5 w-3.5" />
          Mobile
        </button>
        <button
          type="button"
          onClick={() => setDevice("desktop")}
          className={cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition", device === "desktop" ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk")}
        >
          <Monitor className="h-3.5 w-3.5" />
          Desktop
        </button>
      </div>
      <div className={cn("mx-auto transition-all", device === "mobile" ? "max-w-[320px]" : "max-w-full")}>
        {children}
      </div>
    </div>
  );
}
