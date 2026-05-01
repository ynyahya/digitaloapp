import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BuilderShell({ header, sidebar, children, inspector, className }: { header: ReactNode; sidebar: ReactNode; children: ReactNode; inspector?: ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen bg-night text-chalk", className)}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute inset-0 grid-dark-fine opacity-25 mask-radial-fade" />
      </div>
      <div className="relative z-10">
        {header}
        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <aside className="min-w-0 border-b border-white/[0.08] bg-night/65 backdrop-blur-xl lg:border-b-0 lg:border-r lg:border-white/[0.08]">{sidebar}</aside>
          <main className="min-w-0 px-3 py-5 sm:px-4 md:px-6 lg:px-7">{children}</main>
          {inspector ? <aside className="hidden min-w-0 border-l border-white/[0.08] bg-night/55 p-4 backdrop-blur-xl 2xl:block">{inspector}</aside> : null}
        </div>
      </div>
    </div>
  );
}
