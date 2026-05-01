"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  Eye,
  Globe,
  GraduationCap,
  Info,
  Layout,
  Loader2,
  Palette,
  Rocket,
  Save,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourseStudio } from "@/hooks/use-course-studio";
import { getCourseReadiness } from "@/lib/builder/readiness/course";
import { getNextReadinessAction, summarizeReadiness } from "@/lib/builder/readiness/score";
import { cn } from "@/lib/utils";

export function BuilderHeader() {
  const { course, saveStatus, forceSave, state, setActiveTab, setCourseField, toggleStatus, chapters } = useCourseStudio();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [courseName, setCourseName] = useState(course.title);
  const checks = useMemo(() => getCourseReadiness({ ...course, chapters }), [course, chapters]);
  const summary = useMemo(() => summarizeReadiness(checks), [checks]);
  const nextAction = useMemo(() => getNextReadinessAction(checks), [checks]);

  useEffect(() => {
    setCourseName(course.title);
  }, [course.title]);

  const handleRename = () => {
    if (courseName.trim() && courseName !== course.title) setCourseField("title", courseName);
    setIsEditingTitle(false);
  };

  const stages = [
    { id: "overview", label: "Outcome", detail: "promise + audience", icon: Target, done: checks.find((check) => check.id === "title")?.done && checks.find((check) => check.id === "audience")?.done, tab: "overview" as const },
    { id: "curriculum", label: "Curriculum", detail: "modules + lessons", icon: Layout, done: checks.find((check) => check.id === "module")?.done && checks.find((check) => check.id === "lessons")?.done, tab: "curriculum" as const },
    { id: "design", label: "Experience", detail: "cover + trailer", icon: Palette, done: checks.find((check) => check.id === "cover")?.done && checks.find((check) => check.id === "trailer")?.done, tab: "design" as const },
    { id: "settings", label: "Commerce", detail: "price + access", icon: Settings, done: checks.find((check) => check.id === "pricing")?.done, tab: "settings" as const },
    { id: "launch", label: "Launch", detail: "SEO + publish", icon: Rocket, done: checks.find((check) => check.id === "seo")?.done && summary.canPublish, tab: "settings" as const },
  ];

  return (
    <header className="shrink-0 border-b border-white/[0.08] bg-night/95 backdrop-blur-2xl">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-chalk-muted hover:bg-white/[0.06] hover:text-chalk">
            <Link href="/dashboard/courses" aria-label="Back to courses"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  autoFocus
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  className="w-[260px] border-b border-lime bg-transparent text-[14px] font-black text-chalk outline-none"
                />
              ) : (
                <button type="button" onClick={() => setIsEditingTitle(true)} className="truncate text-left text-[14px] font-black text-chalk hover:text-lime">
                  {course.title}
                </button>
              )}
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em]", course.status === "PUBLISHED" ? "border-lime/25 bg-lime/10 text-lime" : "border-white/[0.08] bg-white/[0.035] text-chalk-muted")}>{course.status === "PUBLISHED" ? "Live" : "Draft"}</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-chalk-dim">Course Builder OS · {nextAction ? `Next: ${nextAction.label}` : "Ready for launch review"}</p>
          </div>
        </div>

        <div className="hidden items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1 2xl:flex">
          {["overview", "curriculum", "design", "settings"].map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab as any)} className={cn("rounded-xl px-4 py-2 text-[12px] font-black capitalize transition", state.activeTab === tab ? "bg-lime text-night lime-shadow" : "text-chalk-muted hover:bg-white/[0.05] hover:text-chalk")}>{tab === "overview" ? "Plan" : tab}</button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 lg:flex">
            {saveStatus === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin text-lime" /> : <Check className="h-3.5 w-3.5 text-lime" />}
            <span className="text-[11px] font-bold text-chalk-muted">{saveStatus === "saving" ? "Saving" : saveStatus === "error" ? "Save error" : "Saved"}</span>
          </div>
          <div className="hidden items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 lg:flex">
            <GraduationCap className="h-3.5 w-3.5 text-lime" />
            <span className="text-[11px] font-black text-chalk">{summary.score}% ready</span>
          </div>
          <Button variant="outline" className="hidden h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] text-[12px] font-bold text-chalk hover:bg-white/[0.06] md:inline-flex" onClick={forceSave}><Save className="h-4 w-4" /> Save</Button>
          <Button asChild variant="outline" className="hidden h-10 rounded-2xl border-white/[0.08] bg-white/[0.035] text-[12px] font-bold text-chalk hover:bg-white/[0.06] xl:inline-flex">
            <a href={`/c/${course.creatorHandle || "creator"}/${course.slug}?preview=1`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /> Preview</a>
          </Button>
          <Button variant="outline" className="hidden h-10 rounded-2xl border-lime/20 bg-lime/10 text-[12px] font-bold text-lime hover:bg-lime/15 xl:inline-flex">
            <Sparkles className="h-4 w-4" /> AI outline
          </Button>
          <Button onClick={toggleStatus} disabled={!summary.canPublish && course.status !== "PUBLISHED"} className={cn("h-10 rounded-2xl px-4 text-[12px] font-black", course.status === "PUBLISHED" ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-lime text-night hover:bg-lime/90")}>
            <Globe className="h-4 w-4" /> {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-2 lg:px-6">
        <div className="grid gap-2 md:grid-cols-5">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const active = state.activeTab === stage.tab;
            return (
              <button key={stage.id} type="button" onClick={() => setActiveTab(stage.tab)} className={cn("group flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition", active ? "border-lime/30 bg-lime/10" : "border-white/[0.06] bg-white/[0.025] hover:border-lime/25 hover:bg-lime/10")}>
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-black", stage.done ? "bg-lime text-night" : active ? "bg-white/[0.12] text-lime" : "bg-white/[0.06] text-chalk-muted")}>{stage.done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-black text-chalk">{index + 1}. {stage.label}</span><span className="block truncate text-[10px] text-chalk-dim">{stage.detail}</span></span>
                {active ? <ArrowRight className="h-3.5 w-3.5 text-lime" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
