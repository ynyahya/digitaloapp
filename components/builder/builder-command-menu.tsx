"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Box, Briefcase, Command, GraduationCap, LayoutDashboard, MessageSquare, Plus, Search, Settings, Sparkles, Ticket, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { label: "Create new offering", href: "/dashboard/create", icon: Plus, group: "Launch" },
  { label: "Create product", href: "/dashboard/create", icon: Box, group: "Launch" },
  { label: "Create course", href: "/dashboard/courses/new", icon: GraduationCap, group: "Launch" },
  { label: "Create event", href: "/dashboard/events/new", icon: Ticket, group: "Launch" },
  { label: "Create service", href: "/dashboard/services/new", icon: Briefcase, group: "Launch" },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigate" },
  { label: "Products", href: "/dashboard/products", icon: Box, group: "Navigate" },
  { label: "Courses", href: "/dashboard/courses", icon: GraduationCap, group: "Navigate" },
  { label: "Events", href: "/dashboard/events", icon: Ticket, group: "Navigate" },
  { label: "Services", href: "/dashboard/services", icon: Briefcase, group: "Navigate" },
  { label: "Service inquiries", href: "/dashboard/services/inquiries", icon: MessageSquare, group: "Navigate" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, group: "Navigate" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Navigate" },
];

export function BuilderCommandMenu({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const actions = useMemo(() => ACTIONS.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()) || action.group.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("group relative h-10 w-full max-w-md rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-12 text-left text-[13px] text-chalk-dim transition-all hover:border-lime/30 hover:text-chalk", triggerClassName)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-dim transition-colors group-hover:text-lime" />
        Search everything...
        <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/[0.08] bg-night px-1.5 py-0.5 text-[10px] font-medium text-chalk-dim"><Command className="h-2.5 w-2.5" />K</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] bg-black/60 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
          <div className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.1] bg-night-raised shadow-2xl shadow-black/40" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
              <Sparkles className="h-4 w-4 text-lime" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} autoFocus placeholder="Type a command or destination..." className="h-10 flex-1 bg-transparent text-[15px] text-chalk outline-none placeholder:text-chalk-dim" />
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl p-2 text-chalk-muted hover:bg-white/[0.05] hover:text-chalk"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={`${action.group}-${action.label}`} href={action.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-lime/10">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-lime"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[13px] font-bold text-chalk">{action.label}</span><span className="block text-[11px] text-chalk-muted">{action.group}</span></span>
                  </Link>
                );
              })}
              {actions.length === 0 ? <div className="p-8 text-center text-[13px] text-chalk-muted">No command found.</div> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
