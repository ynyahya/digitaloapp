"use client";

import { ShoppingCart, UserPlus, Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIVITIES = [
  {
    id: 1,
    type: "SALE",
    title: "New sale recorded",
    description: "SaaS Starter Kit purchased by Alex",
    time: "2 minutes ago",
    icon: ShoppingCart,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    type: "CUSTOMER",
    title: "New customer joined",
    description: "Sarah joined your customer list",
    time: "45 minutes ago",
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    type: "REVIEW",
    title: "New review received",
    description: "5 stars on Vibe Coding Masterclass",
    time: "2 hours ago",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {ACTIVITIES.map((activity) => {
        const Icon = activity.icon;
        return (
          <div 
            key={activity.id} 
            className="flex items-start gap-4 p-4 rounded-2xl border border-line bg-paper hover:bg-paper-soft transition-all group cursor-pointer"
          >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", activity.bg, activity.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-ink">{activity.title}</p>
                <span className="text-[10px] text-ink-subtle">{activity.time}</span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 truncate">{activity.description}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-4 w-4 text-ink-subtle" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
