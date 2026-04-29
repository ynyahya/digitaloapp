"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/lib/actions/commerce";
import { Lock, Clock } from "lucide-react";
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
      <DialogContent className="max-w-[860px] overflow-hidden border-line bg-paper p-0">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
              Free preview
            </p>
            <DialogTitle className="mt-0.5 truncate text-[15px] font-bold text-ink">
              {lesson?.title || (loading ? "Loading preview…" : "Lesson preview")}
            </DialogTitle>
          </div>
          {lesson?.durationMin ? (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper-soft px-3 py-1 text-[11px] font-semibold text-ink-muted">
              <Clock className="h-3 w-3" />
              {formatLessonDuration(lesson.durationMin)}
            </span>
          ) : null}
        </div>

        <div className="relative aspect-video w-full bg-ink">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper/20 border-t-paper">
                <span className="sr-only">Loading…</span>
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-paper/70">
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
              <p className="text-[13px] text-paper/60">Text-only preview — see below</p>
            </div>
          )}
        </div>

        {/* Text content */}
        {lesson?.contentJson && (
          <div className="max-h-[240px] overflow-y-auto border-b border-line px-6 py-5">
            <div
              className="prose prose-neutral max-w-none prose-p:text-[14px] prose-p:leading-[1.75] prose-p:text-ink-muted"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.contentJson) }}
            />
          </div>
        )}

        {lesson?.description && !lesson?.contentJson && (
          <div className="border-b border-line px-6 py-5">
            <p className="text-[13.5px] leading-relaxed text-ink-muted">{lesson.description}</p>
          </div>
        )}

        {/* Paywall CTA */}
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-ink">Like what you see?</p>
            <p className="text-[11.5px] text-ink-muted">
              Enroll to unlock the full course.
            </p>
          </div>
          <form action={enrollInCourse.bind(null, courseId)}>
            <Button
              type="submit"
              className="h-10 rounded-xl bg-ink px-5 text-[12.5px] font-semibold text-paper hover:bg-ink-soft"
            >
              {priceCents === 0 ? "Enroll free" : `Enroll — ${formatCurrency(priceCents, currency)}`}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
