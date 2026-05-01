"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Plus,
  Upload,
  Eye,
  ChevronDown,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Ticket,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Box },
  { label: "Courses", href: "/dashboard/courses", icon: GraduationCap },
  { label: "Services", href: "/dashboard/services", icon: Briefcase },
  { label: "Events", href: "/dashboard/events", icon: Ticket },
  { label: "Memberships", href: "/dashboard/memberships", icon: Award },
  { label: "Bundles", href: "/dashboard/bundles", icon: Layers },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const SHORTCUTS = [
  { label: "Create Offering", icon: Plus, href: "/dashboard/create" },
  { label: "Create Service", icon: Upload, href: "/dashboard/services/new" },
  { label: "Create Event", icon: Eye, href: "/dashboard/events/new" },
];

interface SidebarProps {
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  planName?: string;
}

export function Sidebar({
  userName,
  userEmail,
  userImage,
  planName = "Creator",
}: SidebarProps) {
  const pathname = usePathname();

  const displayName = userName ?? userEmail ?? "Account";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.08] bg-night/85 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-night lime-shadow">
          <LogoMark className="h-5 w-5" />
        </div>
        <span className="font-sans text-[17px] font-bold tracking-tight text-chalk">
          TESKEL
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8">
        {/* User Profile Card */}
        <div className="px-3">
          <div className="flex items-center gap-3 p-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/20">
            <div className="h-10 w-10 rounded-xl bg-lime text-[12px] font-bold text-night flex items-center justify-center overflow-hidden">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[13px] font-bold text-chalk">
                {displayName}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-chalk-muted">
                  {planName} Plan
                </span>
                <ChevronDown className="h-3 w-3 text-chalk-dim" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2 text-[13.5px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-lime text-night lime-shadow"
                    : "text-chalk-muted hover:bg-white/[0.05] hover:text-chalk"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-night" : "text-chalk-dim group-hover:text-chalk"
                    )}
                  />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Shortcuts */}
        <div className="space-y-2 px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-chalk-dim px-1">
            Quick Shortcuts
          </p>
          <div className="space-y-0.5">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center justify-between p-2 rounded-xl text-[12.5px] font-medium text-chalk-muted hover:bg-white/[0.05] hover:text-chalk transition-all group"
              >
                <div className="flex items-center gap-3">
                  <s.icon className="h-3.5 w-3.5 text-chalk-dim group-hover:text-chalk" />
                  {s.label}
                </div>
                <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Setup Guide Checklist */}
        <div className="px-3 space-y-3 pt-2">
           <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-chalk-dim">
              Setup Guide
            </p>
            <span className="text-[10px] font-bold text-lime bg-lime/10 px-1.5 py-0.5 rounded-md">33%</span>
          </div>
          <div className="p-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] space-y-4 relative overflow-hidden">
            <div className="absolute left-[20px] top-[40px] bottom-[40px] w-[1px] bg-white/10 z-0" />

            <div className="flex items-start gap-3 w-full relative z-10">
               <div className="h-4 w-4 rounded-full bg-lime flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-2.5 w-2.5 text-night" />
               </div>
               <div className="flex-1">
                  <p className="text-[12px] font-bold text-chalk opacity-40 line-through">Create Account</p>
               </div>
            </div>

            <Link href="/dashboard/settings" className="flex items-start gap-3 w-full group relative z-10">
               <div className="h-4 w-4 rounded-full border border-white/15 bg-night flex items-center justify-center shrink-0 mt-0.5 group-hover:border-lime/50 group-hover:bg-lime/10 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-lime transition-colors" />
               </div>
               <div className="flex-1">
                  <p className="text-[12px] font-bold text-chalk group-hover:text-lime transition-colors">Connect Stripe</p>
                  <p className="text-[10px] text-chalk-muted mt-0.5">Required to receive payouts</p>
               </div>
            </Link>

            <Link href="/dashboard/create" className="flex items-start gap-3 w-full group relative z-10">
               <div className="h-4 w-4 rounded-full border border-white/15 bg-night flex items-center justify-center shrink-0 mt-0.5 group-hover:border-lime/50 group-hover:bg-lime/10 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-lime transition-colors" />
               </div>
               <div className="flex-1">
                  <p className="text-[12px] font-bold text-chalk group-hover:text-lime transition-colors">First Product</p>
                  <p className="text-[10px] text-chalk-muted mt-0.5">Upload and launch assets</p>
               </div>
            </Link>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="px-3 space-y-6 pt-4 border-t border-white/[0.08]">
          <div className="p-4 rounded-2xl bg-lime/10 border border-lime/20 space-y-3">
            <p className="text-[13px] font-bold text-chalk">TESKEL Pro</p>
            <p className="text-[11px] text-chalk-muted leading-relaxed">
              Unlock advanced features, custom domains, and memberships.
            </p>
            <Button
              size="sm"
              className="w-full h-8 rounded-lg text-[11px] bg-lime text-night border-none lime-shadow"
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
