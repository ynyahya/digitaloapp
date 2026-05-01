import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function BuilderField({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-[12px] font-bold text-chalk">{label}</span>
      {children}
      {hint ? <span className="block text-[11px] leading-relaxed text-chalk-muted">{hint}</span> : null}
    </label>
  );
}

export function BuilderInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-3.5 text-[14px] text-chalk outline-none transition placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15", className)} {...props} />;
}

export function BuilderTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-32 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-3.5 py-3 text-[14px] leading-relaxed text-chalk outline-none transition placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15", className)} {...props} />;
}
