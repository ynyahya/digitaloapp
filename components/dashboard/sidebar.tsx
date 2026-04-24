"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  PenTool,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  Zap,
  FileText,
  Settings,
  PlusCircle,
  Plus,
  Upload,
  Eye,
  Bot,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Box },
  { label: "Product Studio", href: "/dashboard/studio", icon: PenTool },
  { label: "Bundles", href: "/dashboard/bundles", icon: Layers },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag, count: 248 },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Automations", href: "/dashboard/automations", icon: Zap },
  { label: "Content", href: "/dashboard/content", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const SHORTCUTS = [
  { label: "Create Product", icon: Plus, href: "/dashboard/studio" },
  { label: "Upload Assets", icon: Upload, href: "/dashboard/studio?tab=assets" },
  { label: "View Storefront", icon: Eye, href: "/storefront" },
  { label: "AI Assistant", icon: Bot, href: "#", shortcut: "⌘ J" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-paper">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 gap-2.5">
        <div className="h-6 w-6 text-ink">
          <LogoMark className="h-6 w-6" />
        </div>
        <span className="font-sans text-[17px] font-semibold tracking-tight text-ink">
          CreatorOS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8">
        {/* User Profile Card */}
        <div className="px-3">
          <div className="flex items-center gap-3 p-2 rounded-2xl border border-line bg-paper-soft shadow-soft">
            <div className="h-10 w-10 rounded-xl bg-ink text-[12px] font-bold text-paper flex items-center justify-center">
              AM
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[13px] font-bold text-ink">Alex Morgan</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-ink-muted">Creator Plan</span>
                <ChevronDown className="h-3 w-3 text-ink-subtle" />
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
                    ? "bg-paper-muted text-ink"
                    : "text-ink-muted hover:bg-paper-soft hover:text-ink"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-ink" : "text-ink-subtle group-hover:text-ink"
                    )}
                  />
                  {item.label}
                </div>
                {item.count && (
                  <span className="text-[10px] font-bold text-ink-subtle px-1.5 py-0.5 rounded-md bg-paper-muted group-hover:bg-paper-soft">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Shortcuts */}
        <div className="space-y-2 px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-subtle px-1">Quick Shortcuts</p>
          <div className="space-y-0.5">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center justify-between p-2 rounded-xl text-[12.5px] font-medium text-ink-muted hover:bg-paper-soft hover:text-ink transition-all group"
              >
                <div className="flex items-center gap-3">
                  <s.icon className="h-3.5 w-3.5 text-ink-subtle group-hover:text-ink" />
                  {s.label}
                </div>
                {s.shortcut ? (
                  <span className="text-[9px] font-bold text-ink-subtle opacity-40">{s.shortcut}</span>
                ) : (
                  <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Usage & Plan */}
        <div className="px-3 space-y-6 pt-4 border-t border-line">
           <div className="space-y-4">
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                   <span>Storage Used</span>
                   <span className="text-ink">34.2 GB / 100 GB</span>
                 </div>
                 <div className="h-1 w-full bg-paper-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ink w-[34%]" />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                   <span>Bandwidth</span>
                   <span className="text-ink">120 GB / 500 GB</span>
                 </div>
                 <div className="h-1 w-full bg-paper-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ink w-[24%]" />
                 </div>
              </div>
           </div>

           <div className="p-4 rounded-2xl bg-paper-soft border border-line space-y-3">
              <p className="text-[13px] font-bold text-ink">CreatorOS Pro</p>
              <p className="text-[11px] text-ink-muted leading-relaxed">Unlock advanced features, custom domains, and memberships.</p>
              <Button size="sm" className="w-full h-8 rounded-lg text-[11px] bg-ink text-paper border-none">
                Upgrade Plan
              </Button>
           </div>
        </div>
      </div>
    </aside>
  );
}
