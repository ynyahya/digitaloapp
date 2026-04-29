"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, LayoutGrid, List, Columns3, ArrowDownUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { CourseListItem } from "@/lib/queries/courses";

const STATUS_TABS = [
  { id: "ALL", label: "All" },
  { id: "PUBLISHED", label: "Live" },
  { id: "DRAFT", label: "Draft" },
  { id: "SCHEDULED", label: "Scheduled" },
  { id: "ARCHIVED", label: "Archived" },
] as const;

const SORT_OPTIONS = [
  { id: "recent", label: "Recently updated" },
  { id: "students", label: "Most students" },
  { id: "rating", label: "Highest rated" },
  { id: "completion", label: "Highest completion" },
  { id: "price", label: "Highest price" },
] as const;

const VIEWS = [
  { id: "grid", icon: LayoutGrid, label: "Grid" },
  { id: "list", icon: List, label: "List" },
] as const;

export type CourseFilters = {
  query: string;
  status: string;
  level: string;
  format: string;
  sort: (typeof SORT_OPTIONS)[number]["id"];
  view: (typeof VIEWS)[number]["id"];
};

const DEFAULT_FILTERS: CourseFilters = {
  query: "",
  status: "ALL",
  level: "ALL",
  format: "ALL",
  sort: "recent",
  view: "grid",
};

export function applyFilters(
  courses: CourseListItem[],
  f: CourseFilters,
): CourseListItem[] {
  let out = [...courses];
  if (f.status !== "ALL") out = out.filter((c) => c.status === f.status);
  if (f.level !== "ALL") out = out.filter((c) => c.level === f.level);
  if (f.format !== "ALL") out = out.filter((c) => c.format === f.format);
  if (f.query.trim()) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle ?? "").toLowerCase().includes(q) ||
        (c.category ?? "").toLowerCase().includes(q),
    );
  }
  switch (f.sort) {
    case "students":
      out.sort((a, b) => b.totalStudents - a.totalStudents);
      break;
    case "rating":
      out.sort((a, b) => b.ratingAvg - a.ratingAvg);
      break;
    case "completion":
      out.sort((a, b) => b.completionRate - a.completionRate);
      break;
    case "price":
      out.sort((a, b) => b.priceCents - a.priceCents);
      break;
    default:
      out.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return out;
}

export function useCourseFilters(initial: CourseListItem[]) {
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_FILTERS);
  const filtered = useMemo(() => applyFilters(initial, filters), [initial, filters]);
  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: initial.length };
    initial.forEach((c) => {
      map[c.status] = (map[c.status] ?? 0) + 1;
    });
    return map;
  }, [initial]);
  return { filters, setFilters, filtered, counts };
}

type Props = {
  filters: CourseFilters;
  onChange: (f: CourseFilters) => void;
  counts: Record<string, number>;
};

export function CourseToolbar({ filters, onChange, counts }: Props) {
  const [draftQuery, setDraftQuery] = useState(filters.query);

  useEffect(() => {
    const t = setTimeout(() => onChange({ ...filters, query: draftQuery }), 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftQuery]);

  const sortLabel = SORT_OPTIONS.find((o) => o.id === filters.sort)?.label ?? "Sort";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle group-focus-within:text-ink transition-colors" />
          <Input
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            className="h-10 pl-9 rounded-xl border-line text-[13px] bg-paper"
            placeholder="Search courses, categories…"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-3 rounded-xl border border-line bg-paper hover:bg-paper-soft text-[12.5px] font-bold flex items-center gap-1.5">
                <span className="text-ink-subtle font-medium">Level:</span>
                <span className="capitalize">{filters.level === "ALL" ? "Any" : filters.level.toLowerCase()}</span>
                <ChevronDown className="h-3 w-3 text-ink-subtle" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 rounded-xl border-line bg-paper shadow-float p-1.5">
              {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => (
                <DropdownMenuItem
                  key={l}
                  onClick={() => onChange({ ...filters, level: l })}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium cursor-pointer capitalize",
                    filters.level === l && "bg-paper-muted text-ink",
                  )}
                >
                  {l === "ALL" ? "Any level" : l.toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-3 rounded-xl border border-line bg-paper hover:bg-paper-soft text-[12.5px] font-bold flex items-center gap-1.5">
                <span className="text-ink-subtle font-medium">Format:</span>
                <span className="capitalize">
                  {filters.format === "ALL" ? "Any" : filters.format.replace("_", "-").toLowerCase()}
                </span>
                <ChevronDown className="h-3 w-3 text-ink-subtle" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 rounded-xl border-line bg-paper shadow-float p-1.5">
              {["ALL", "SELF_PACED", "COHORT", "DRIP"].map((l) => (
                <DropdownMenuItem
                  key={l}
                  onClick={() => onChange({ ...filters, format: l })}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium cursor-pointer capitalize",
                    filters.format === l && "bg-paper-muted text-ink",
                  )}
                >
                  {l === "ALL" ? "Any format" : l.replace("_", "-").toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-3 rounded-xl border border-line bg-paper hover:bg-paper-soft text-[12.5px] font-bold flex items-center gap-1.5">
                <ArrowDownUp className="h-3 w-3 text-ink-subtle" />
                {sortLabel}
                <ChevronDown className="h-3 w-3 text-ink-subtle" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 rounded-xl border-line bg-paper shadow-float p-1.5">
              <DropdownMenuLabel className="px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map((o) => (
                <DropdownMenuItem
                  key={o.id}
                  onClick={() => onChange({ ...filters, sort: o.id })}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium cursor-pointer",
                    filters.sort === o.id && "bg-paper-muted text-ink",
                  )}
                >
                  {o.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-10 ml-1 inline-flex items-center rounded-xl border border-line bg-paper p-1">
            {VIEWS.map((v) => {
              const Icon = v.icon;
              const active = filters.view === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => onChange({ ...filters, view: v.id })}
                  className={cn(
                    "h-8 px-2.5 rounded-lg text-[11.5px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors",
                    active
                      ? "bg-ink text-paper"
                      : "text-ink-muted hover:text-ink",
                  )}
                  aria-label={v.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1">
        {STATUS_TABS.map((t) => {
          const active = filters.status === t.id;
          const count = counts[t.id] ?? 0;
          return (
            <button
              key={t.id}
              onClick={() => onChange({ ...filters, status: t.id })}
              className={cn(
                "h-8 px-3 rounded-full text-[12px] font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors shrink-0",
                active
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:bg-paper-soft border border-line bg-paper",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full text-[10px] px-1.5 min-w-[18px] inline-flex items-center justify-center",
                  active ? "bg-paper/15" : "bg-paper-muted text-ink-subtle",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Columns3 };
