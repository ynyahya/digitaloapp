"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/lib/actions/commerce";
import { trackEvent } from "@/lib/analytics/track";
import { CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";
import { formatCurrency, sanitizeHtml } from "@/lib/utils";
import { formatLessonDuration, getEmbedUrl } from "./course-helpers";

interface PreviewLesson {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  contentJson: string | null;
  videoUrl: string | null;
  videoProvider: string | null;
  embedUrl: string | null;
  durationMin: number | null;
}

interface LessonPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string | null;
  courseId: string;
  priceCents: number;
  currency: string;
}

export function LessonPreviewModal({
  open,
  onOpenChange,
  lessonId,
  courseId,
  priceCents,
  currency,
}: LessonPreviewModalProps) {
  const [lesson, setLesson] = useState<PreviewLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && lessonId) {
      trackEvent("lesson_preview_modal_open", {
        surface: "lesson_preview_modal",
        lesson_id: lessonId,
      });
    }

    if (!open || !lessonId) {
      setLesson(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/courses/preview-lesson?id=${encodeURIComponent(lessonId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Preview unavailable");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setLesson(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message || "Preview unavailable");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, lessonId]);

  const embedUrl = getEmbedUrl(lesson?.videoUrl || lesson?.embedUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[860px] overflow-hidden border-white/[0.08] bg-night p-0">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-chalk-muted">
              Free preview
            </p>
            <DialogTitle className="mt-0.5 truncate text-[15px] font-bold text-chalk">
              {lesson?.title || (loading ? "Loading preview…" : "Lesson preview")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview a free lesson and enroll to unlock full curriculum.
            </DialogDescription>
          </div>
          {lesson?.durationMin ? (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold text-chalk-muted">
              <Clock className="h-3 w-3" />
              {formatLessonDuration(lesson.durationMin)}
            </span>
          ) : null}
        </div>

        <div className="relative aspect-video w-full bg-lime">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-white/[0.08]/20 border-t-paper">
                <span className="sr-only">Loading…</span>
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-chalk-muted">
              <Lock className="h-6 w-6" />
              <p className="text-[13px] font-medium">{error}</p>
            </div>
          )}
          {!loading && !error && embedUrl && (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson?.title || "Preview"}
            />
          )}
          {!loading && !error && !embedUrl && lesson && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-soft to-ink">
              <p className="text-[13px] text-chalk-dim">Text-only preview available below</p>
            </div>
          )}
        </div>

        {/* Text content */}
        {lesson?.contentJson && (
          <div className="max-h-[240px] overflow-y-auto border-b border-white/[0.08] px-6 py-5">
            <div
              className="prose prose-invert max-w-none prose-p:text-[14px] prose-p:leading-[1.75] prose-p:text-chalk-muted"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.contentJson) }}
            />
          </div>
        )}

        {lesson?.description && !lesson?.contentJson && (
          <div className="border-b border-white/[0.08] px-6 py-5">
            <p className="text-[13.5px] leading-relaxed text-chalk-muted">{lesson.description}</p>
          </div>
        )}

        {/* Paywall CTA */}
        <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-chalk">
              <PlayCircle className="h-3.5 w-3.5 text-accent" />
              Like what you see?
            </p>
            <p className="mt-1 text-[11.5px] text-chalk-muted">
              Enroll to unlock the full course curriculum and all future updates.
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-chalk-muted">
              {[
                "Full lesson access",
                "Progress tracking",
                "Creator support",
              ].map((item) => (
                <li key={item} className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <form
            action={enrollInCourse.bind(null, courseId)}
            onSubmit={() =>
              trackEvent("cta_click", {
                surface: "lesson_preview_modal",
                label: "Enroll",
                lesson_id: lessonId,
              })
            }
          >
            <Button
              type="submit"
              className="h-10 rounded-xl bg-lime px-5 text-[12.5px] font-semibold text-night hover:bg-lime/90"
            >
              {priceCents === 0 ? "Enroll free" : `Enroll — ${formatCurrency(priceCents, currency)}`}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
