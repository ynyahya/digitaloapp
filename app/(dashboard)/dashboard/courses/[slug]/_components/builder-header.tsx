"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Check,
  Loader2,
  Undo,
  Redo,
  Eye,
  Sparkles,
  Globe,
  Clock,
  Save,
  Layout,
  Settings,
  Info,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourseStudio } from "@/hooks/use-course-studio";

export function BuilderHeader() {
  const {
    course,
    saveStatus,
    forceSave,
    state,
    setActiveTab,
    setCourseField,
    toggleStatus,
    chapters,
  } = useCourseStudio();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [courseName, setCourseName] = useState(course.title);

  useEffect(() => {
    setCourseName(course.title);
  }, [course.title]);

  const handleRename = () => {
    if (courseName.trim() && courseName !== course.title) {
      setCourseField("title", courseName);
    }
    setIsEditingTitle(false);
  };

  const totalLessons = chapters.reduce((s, ch) => s + ch.lessons.length, 0);
  const publishedLessons = chapters.reduce(
    (s, ch) => s + ch.lessons.filter((l) => l.isPublished).length,
    0
  );
  const readinessScore = totalLessons === 0 ? 0 : Math.round((publishedLessons / totalLessons) * 100);

  return (
    <header className="h-12 border-b border-line bg-paper flex items-center justify-between px-3 shrink-0 select-none">
      {/* Left: Breadcrumb + Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/courses"
          className="flex items-center gap-1.5 text-[12px] font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Courses
        </Link>
        <div className="w-px h-4 bg-line" />
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              autoFocus
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="text-[13px] font-semibold text-ink bg-transparent border-b border-indigo-500 outline-none max-w-[220px]"
            />
          ) : (
            <span
              className="text-[13px] font-semibold text-ink max-w-[220px] truncate cursor-text hover:text-indigo-600 transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {course.title}
            </span>
          )}
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              course.status === "PUBLISHED"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-paper-soft text-ink-muted border-line"
            }`}
          >
            {course.status === "PUBLISHED" ? "LIVE" : "DRAFT"}
          </span>
        </div>
      </div>

      {/* Center: Tab Switcher */}
      <div className="flex items-center gap-0.5 p-0.5 bg-paper-soft border border-line rounded-lg">
        <TabButton
          active={state.activeTab === "curriculum"}
          onClick={() => setActiveTab("curriculum")}
        >
          <Layout className="h-3 w-3" />
          Builder
        </TabButton>
        <TabButton
          active={state.activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        >
          <Info className="h-3 w-3" />
          Settings
        </TabButton>
        <a
          href={`/c/${course.creatorHandle || "creator"}/${course.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-[11px] font-medium text-ink-muted hover:text-ink transition-colors flex items-center gap-1"
        >
          <Eye className="h-3 w-3" />
          Live preview
        </a>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Save Status */}
        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mr-1 min-w-[100px] justify-end">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-indigo-500" /> Saving…
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3 text-emerald-500" /> All saved
            </>
          )}
          {saveStatus === "idle" && (
            <>
              <Check className="h-3 w-3 text-ink-subtle" /> Ready
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertCircle className="h-3 w-3 text-rose-500" /> Error
            </>
          )}
        </div>

        {/* Course Health */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-line bg-paper-soft text-[11px] font-medium text-ink-muted">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              readinessScore >= 80
                ? "bg-emerald-500"
                : readinessScore >= 50
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
          />
          {readinessScore}% ready
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center border border-line rounded-md bg-paper overflow-hidden">
          <button className="p-1.5 text-ink-muted hover:bg-paper-soft transition-colors border-r border-line">
            <Undo className="h-3 w-3" />
          </button>
          <button className="p-1.5 text-ink-muted hover:bg-paper-soft transition-colors">
            <Redo className="h-3 w-3" />
          </button>
        </div>

        {/* Save */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 rounded-lg border-line text-[11px] px-3 font-medium"
          onClick={forceSave}
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>

        {/* AI */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-lg text-[11px] px-3 font-medium text-indigo-600 hover:bg-indigo-50"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI
        </Button>

        {/* Publish / Unpublish */}
        <Button
          onClick={toggleStatus}
          className={`h-7 rounded-lg text-white text-[11px] font-medium px-3 ${
            course.status === "PUBLISHED"
              ? "bg-rose-500 hover:bg-rose-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <Globe className="h-3 w-3 mr-1" />
          {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-md transition-all ${
        active
          ? "font-semibold bg-paper text-ink shadow-sm border border-line/50"
          : "font-medium text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
