"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  File,
  HelpCircle,
  Play,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatLessonDuration } from "./course-helpers";
import { SectionHeading } from "./course-outcomes";
import { LessonPreviewModal } from "./lesson-preview-modal";

type LessonLite = {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  durationMin: number | null;
  isFree: boolean;
};

type ChapterLite = {
  id: string;
  title: string;
  lessons: LessonLite[];
};

interface CourseCurriculumProps {
  chapters: ChapterLite[];
  courseId: string;
  priceCents: number;
  currency: string;
  totalLessons: number;
  totalMinutes: number;
}

const CONTENT_ICONS: Record<string, typeof FileText> = {
  VIDEO: Video,
  AUDIO: Headphones,
  IMAGE: ImageIcon,
  FILE: File,
  QUIZ: HelpCircle,
  TEXT: FileText,
};

export function CourseCurriculum({
  chapters,
  courseId,
  priceCents,
  currency,
  totalLessons,
  totalMinutes,
}: CourseCurriculumProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    chapters.length > 0 ? { [chapters[0].id]: true } : {},
  );
  const [previewId, setPreviewId] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));
  const expandAll = () =>
    setExpanded(Object.fromEntries(chapters.map((c) => [c.id, true])));
  const collapseAll = () =>
    setExpanded(Object.fromEntries(chapters.map((c) => [c.id, false])));

  const hasContent = totalLessons > 0;
  const freeLessonCount = chapters.reduce(
    (s, ch) => s + ch.lessons.filter((l) => l.isFree).length,
    0,
  );

  return (
    <section id="curriculum" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Curriculum"
            title="What's inside"
            description={
              hasContent
                ? `${chapters.length} ${chapters.length === 1 ? "module" : "modules"} · ${totalLessons} lessons${totalMinutes > 0 ? ` · ${formatDuration(totalMinutes)}` : ""}${freeLessonCount > 0 ? ` · ${freeLessonCount} free to preview` : ""}`
                : "The instructor is still structuring this course."
            }
          />

          {hasContent && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="rounded-full border border-line bg-paper-soft px-3.5 py-1.5 text-[12px] font-semibold text-ink-muted transition-colors hover:border-line-strong hover:bg-paper hover:text-ink"
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="rounded-full border border-line bg-paper-soft px-3.5 py-1.5 text-[12px] font-semibold text-ink-muted transition-colors hover:border-line-strong hover:bg-paper hover:text-ink"
              >
                Collapse all
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          {!hasContent ? (
            <CurriculumEmpty />
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter, idx) => {
                const isOpen = !!expanded[chapter.id];
                const chapterMinutes = chapter.lessons.reduce(
                  (s, l) => s + (l.durationMin || 0),
                  0,
                );
                return (
                  <div
                    key={chapter.id}
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-paper transition-colors",
                      isOpen ? "border-line-strong" : "border-line",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(chapter.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-paper-soft"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-muted text-[12px] font-extrabold tabular-nums text-ink">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[15.5px] font-bold text-ink">
                            {chapter.title}
                          </p>
                          <p className="mt-0.5 text-[12px] text-ink-muted">
                            {chapter.lessons.length}{" "}
                            {chapter.lessons.length === 1 ? "lesson" : "lessons"}
                            {chapterMinutes > 0 && ` · ${formatDuration(chapterMinutes)}`}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-ink-muted transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-line bg-paper-soft">
                        {chapter.lessons.length === 0 ? (
                          <p className="px-6 py-5 text-[13px] text-ink-muted">
                            No lessons published yet.
                          </p>
                        ) : (
                          <ul className="divide-y divide-line">
                            {chapter.lessons.map((lesson) => {
                              const Icon = CONTENT_ICONS[lesson.contentType] || FileText;
                              const isClickable = lesson.isFree;
                              const Row = isClickable ? "button" : "div";
                              return (
                                <li key={lesson.id}>
                                  <Row
                                    {...(isClickable
                                      ? {
                                          type: "button" as const,
                                          onClick: () => setPreviewId(lesson.id),
                                        }
                                      : {})}
                                    className={cn(
                                      "group flex w-full items-center justify-between gap-3 px-6 py-3.5 text-left",
                                      isClickable && "cursor-pointer hover:bg-paper",
                                    )}
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      <span
                                        className={cn(
                                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                                          isClickable
                                            ? "bg-ink text-paper group-hover:bg-ink-soft"
                                            : "bg-paper-muted text-ink-muted",
                                        )}
                                      >
                                        {isClickable ? (
                                          <Play className="h-3 w-3 translate-x-[1px]" />
                                        ) : (
                                          <Icon className="h-3.5 w-3.5" />
                                        )}
                                      </span>
                                      <span className="truncate text-[13.5px] font-medium text-ink">
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2.5 text-[11.5px] text-ink-muted">
                                      {lesson.isFree && (
                                        <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                                          Preview
                                        </span>
                                      )}
                                      {!lesson.isFree && (
                                        <Lock className="h-3.5 w-3.5 text-ink-subtle" />
                                      )}
                                      {lesson.durationMin ? (
                                        <span className="tabular-nums">
                                          {formatLessonDuration(lesson.durationMin)}
                                        </span>
                                      ) : null}
                                    </div>
                                  </Row>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <LessonPreviewModal
        open={previewId !== null}
        onOpenChange={(v) => !v && setPreviewId(null)}
        lessonId={previewId}
        courseId={courseId}
        priceCents={priceCents}
        currency={currency}
      />
    </section>
  );
}

function CurriculumEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-paper-soft py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-paper">
        <BookOpen className="h-6 w-6 text-ink-muted" />
      </div>
      <p className="text-[15px] font-semibold text-ink">Curriculum coming soon</p>
      <p className="mt-1.5 max-w-sm text-[13px] text-ink-muted">
        The instructor is still building this course. Enroll now to be notified when lessons
        are published.
      </p>
    </div>
  );
}
