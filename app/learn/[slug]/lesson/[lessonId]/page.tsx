import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getEnrolledCourseBySlug, getLessonWithContent } from "@/lib/queries/courses";
import { sanitizeHtml } from "@/lib/utils";
import { markLessonComplete } from "@/lib/actions/commerce";
import {
  Play, FileText, CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Clock, Video, Headphones, ImageIcon, File, HelpCircle, ArrowLeft,
  Maximize2, PanelLeftClose, PanelLeft, Download, BookOpen,
  MessageSquare, StickyNote, Sparkles, Trophy, Zap, ListChecks,
  ChevronUp, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const course = await getEnrolledCourseBySlug(user.id, params.slug);
  if (!course) notFound();
  const lesson = await getLessonWithContent(params.lessonId, user.id);
  if (!lesson) notFound();

  const isCompleted = lesson.completions.length > 0;

  const allLessons = course.chapters.flatMap((ch) =>
    ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title, chapterId: ch.id, isCompleted: l.completions.length > 0 })),
  );
  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const completedCount = allLessons.filter((l) => l.isCompleted).length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isFullyComplete = completedCount === totalCount && totalCount > 0;

  const contentTypeIcons: Record<string, any> = {
    VIDEO: Video, AUDIO: Headphones, IMAGE: ImageIcon, FILE: File, QUIZ: HelpCircle,
  };

  // Calculate chapter progress
  const chapterMap = new Map<string, { title: string; completed: number; total: number }>();
  course.chapters.forEach(ch => {
    const total = ch.lessons.length;
    const completed = ch.lessons.filter(l => l.completions.length > 0).length;
    chapterMap.set(ch.id, { title: ch.title, completed, total });
  });

  return (
    <div className="fixed inset-0 z-[100] bg-[#fbfbfc] flex overflow-hidden font-sans">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-[300px] shrink-0 border-r border-line/60 bg-white flex flex-col h-full overflow-hidden">
        {/* Course Header */}
        <div className="p-5 border-b border-line/60 space-y-4 shrink-0 bg-gradient-to-b from-white to-[#fbfbfc]">
          <Link href="/dashboard" className="text-[12px] font-medium text-ink-muted hover:text-ink flex items-center gap-1.5 w-fit transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> My Courses
          </Link>
          <h2 className="text-[15px] font-bold text-ink leading-snug">{course.title}</h2>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-ink-muted">Your progress</span>
              <span className="font-bold text-ink tabular-nums">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-paper-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-[11px] text-ink-muted">{completedCount} of {totalCount} lessons completed</p>
          </div>
        </div>

        {/* Curriculum Tree */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-4">
          {course.chapters.map((chapter) => {
            const chData = chapterMap.get(chapter.id);
            const chComplete = chData && chData.completed === chData.total;
            const isCurrentChapter = chapter.lessons.some(l => l.id === lesson.id);

            return (
              <div key={chapter.id} className="space-y-0.5">
                {/* Module Header */}
                <div className={cn(
                  "flex items-center gap-2 px-2 py-2 rounded-lg transition-colors",
                  isCurrentChapter ? "bg-indigo-50/50" : ""
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold",
                    chComplete ? "bg-emerald-100 text-emerald-600" : "bg-paper-muted text-ink-muted"
                  )}>
                    {chComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : chData?.completed || 0}
                  </div>
                  <span className="text-[12px] font-bold text-ink-muted uppercase tracking-wide truncate">{chapter.title}</span>
                  <span className="ml-auto text-[10px] text-ink-subtle shrink-0">{chData?.completed}/{chData?.total}</span>
                </div>

                {/* Lessons */}
                <div className="ml-4 pl-3 border-l-2 border-line/60 space-y-0.5">
                  {chapter.lessons.map((l) => {
                    const active = l.id === lesson.id;
                    const lComplete = l.completions.length > 0;
                    const ContentIcon = contentTypeIcons[l.contentType] || FileText;

                    return (
                      <Link
                        key={l.id}
                        href={`/learn/${course.slug}/lesson/${l.id}`}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group",
                          active
                            ? "bg-indigo-50 border border-indigo-100 shadow-sm"
                            : "hover:bg-paper-soft border border-transparent",
                        )}
                      >
                        {/* Status Icon */}
                        <div className="shrink-0">
                          {lComplete ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            </div>
                          ) : active ? (
                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Play className="h-2.5 w-2.5 text-indigo-600 ml-0.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-line flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-ink-subtle" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-[12.5px] truncate leading-snug transition-colors",
                            active ? "font-semibold text-indigo-700" : lComplete ? "text-ink-muted" : "text-ink",
                          )}>
                            {l.title}
                          </p>
                        </div>

                        {l.durationMin && (
                          <span className="text-[10px] font-medium text-ink-subtle tabular-nums shrink-0">
                            {l.durationMin >= 60 ? `${Math.floor(l.durationMin/60)}h` : `${l.durationMin}m`}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Completion */}
        {isFullyComplete && (
          <div className="p-4 border-t border-line/60 bg-gradient-to-r from-amber-50 to-yellow-50 mx-3 mb-3 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-[13px] font-bold text-amber-800">Course Complete!</p>
                <p className="text-[11px] text-amber-700">Congratulations on finishing!</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#fbfbfc]">
        {/* Top Bar */}
        <header className="h-14 shrink-0 border-b border-line/60 bg-white flex items-center justify-between px-5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-bold text-ink-muted bg-paper-muted px-2 py-0.5 rounded-md tabular-nums">
              {currentIdx + 1}/{totalCount}
            </span>
            <h1 className="text-[14px] font-semibold text-ink truncate">{lesson.title}</h1>
            {lesson.durationMin && (
              <span className="flex items-center gap-1 text-[11px] text-ink-muted shrink-0">
                <Clock className="h-3 w-3" />
                {lesson.durationMin >= 60 ? `${Math.floor(lesson.durationMin/60)}h ${lesson.durationMin%60}m` : `${lesson.durationMin}m`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[12px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed
              </span>
            ) : (
              <form action={markLessonComplete.bind(null, lesson.id)}>
                <Button type="submit" className="h-8 rounded-lg text-[12px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Mark Complete
                </Button>
              </form>
            )}

            {/* Auto-continue hint */}
            {isCompleted && nextLesson && (
              <Link href={`/learn/${course.slug}/lesson/${nextLesson.id}`}>
                <Button variant="outline" className="h-8 rounded-lg text-[12px] font-semibold border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3">
                  Next Lesson <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[860px] mx-auto px-6 py-8 space-y-8 pb-24">
            
            {/* ── VIDEO PLAYER ── */}
            {lesson.contentType === "VIDEO" && lesson.videoUrl && (
              <div className="aspect-video w-full bg-[#0d0d14] rounded-2xl border border-line/60 overflow-hidden relative shadow-lg shadow-black/5">
                {lesson.videoUrl.includes("youtube") || lesson.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={(() => {
                      const match = lesson.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                      return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : lesson.videoUrl;
                    })()}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                  />
                ) : lesson.videoUrl.includes("vimeo") ? (
                  <iframe src={lesson.videoUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={lesson.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto hover:scale-110 transition-transform cursor-pointer">
                        <Play className="h-7 w-7 text-white ml-0.5" />
                      </div>
                      <p className="text-white/40 text-[13px] font-medium">Video will play here</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── AUDIO PLAYER ── */}
            {lesson.contentType === "AUDIO" && (lesson.videoUrl || lesson.contentJson) && (
              <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <button className="w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-sm">
                    <Play className="h-6 w-6 ml-0.5" />
                  </button>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-ink mb-2">{lesson.title}</p>
                    <div className="flex items-end gap-[2px] h-8">
                      {Array.from({ length: 60 }).map((_, i) => (
                        <div key={i} className="flex-1 rounded-full bg-indigo-200" style={{ height: `${Math.sin(i*0.2)*40+40}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>0:00</span>
                  <span>{lesson.durationMin ? `${lesson.durationMin}:00` : "0:00"}</span>
                </div>
              </div>
            )}

            {/* ── LESSON TITLE & DESC ── */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                <ListChecks className="h-3 w-3" />
                {allLessons[currentIdx]?.chapterTitle || ""}
              </div>
              <h2 className="text-[28px] font-extrabold text-ink leading-tight">{lesson.title}</h2>
              {lesson.description && (
                <p className="text-[15px] text-ink-muted leading-relaxed max-w-2xl">{lesson.description}</p>
              )}
            </div>

            {/* ── CONTENT BODY ── */}
            {lesson.contentJson && (
              <div className="bg-white rounded-2xl border border-line/60 p-8 shadow-sm">
                <div className="prose max-w-none
                  prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-ink-muted prose-p:mb-5
                  prose-headings:text-ink prose-headings:font-bold
                  prose-h2:text-[22px] prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-line/60
                  prose-h3:text-[18px] prose-h3:mt-8 prose-h3:mb-3
                  prose-a:text-indigo-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-ink prose-strong:font-semibold
                  prose-code:text-rose-600 prose-code:bg-rose-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[13px] prose-code:font-normal
                  prose-pre:bg-[#1e1e2e] prose-pre:text-[#cdd6f4] prose-pre:border prose-pre:border-[#313244] prose-pre:rounded-xl prose-pre:shadow-sm
                  prose-ul:text-ink-muted prose-ol:text-ink-muted
                  prose-li:my-1 prose-li:text-[15px]
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:text-ink-muted prose-blockquote:not-italic
                  prose-img:rounded-xl prose-img:border prose-img:border-line/60 prose-img:shadow-sm
                  prose-hr:border-line/60
                ">
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.contentJson) }} />
                </div>
              </div>
            )}

            {/* ── EMPTY STATE ── */}
            {!lesson.videoUrl && !lesson.contentJson && (
              <div className="bg-white rounded-2xl border border-line/60 p-16 text-center flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-paper-soft border border-line/60 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-ink-subtle" />
                </div>
                <h3 className="text-[16px] font-bold text-ink">No content yet</h3>
                <p className="text-[13px] text-ink-muted max-w-sm">The creator hasn&apos;t added content to this lesson yet.</p>
              </div>
            )}

            {/* ── RESOURCES SECTION ── */}
            {lesson.attachments && (
              <div className="bg-white rounded-2xl border border-line/60 p-6 shadow-sm space-y-3">
                <h4 className="text-[14px] font-bold text-ink flex items-center gap-2">
                  <Download className="h-4 w-4 text-indigo-500" /> Resources
                </h4>
                <div className="flex items-center justify-between p-3 rounded-xl bg-paper-soft border border-line/60 hover:border-indigo-200 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-[13px] font-semibold text-ink group-hover:text-indigo-600 transition-colors">Download Resource</p>
                      <p className="text-[10px] text-ink-muted">PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-ink-muted group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            )}

            {/* ── COMPLETION / CONTINUE ── */}
            <div className="flex items-center justify-between pt-6 border-t border-line/60">
              <div>
                {prevLesson ? (
                  <Link href={`/learn/${course.slug}/lesson/${prevLesson.id}`} className="flex items-center gap-2 text-[13px] font-medium text-ink-muted hover:text-ink transition-colors group">
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    <div>
                      <p className="text-[10px] text-ink-subtle uppercase tracking-wider">Previous</p>
                      <p className="truncate max-w-[180px]">{prevLesson.title}</p>
                    </div>
                  </Link>
                ) : <div />}
              </div>

              {!isCompleted ? (
                <form action={markLessonComplete.bind(null, lesson.id)}>
                  <Button type="submit" className="rounded-xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-bold shadow-sm">
                    Complete & Continue <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </form>
              ) : nextLesson ? (
                <Link href={`/learn/${course.slug}/lesson/${nextLesson.id}`}>
                  <Button className="rounded-xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-bold shadow-sm">
                    Next Lesson <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              ) : isFullyComplete ? (
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="text-[14px] font-bold text-amber-800">Course Complete! 🎉</span>
                </div>
              ) : (
                <div />
              )}

              <div>
                {nextLesson ? (
                  <Link href={`/learn/${course.slug}/lesson/${nextLesson.id}`} className="flex items-center gap-2 text-[13px] font-medium text-ink-muted hover:text-ink transition-colors group">
                    <div className="text-right">
                      <p className="text-[10px] text-ink-subtle uppercase tracking-wider">Next</p>
                      <p className="truncate max-w-[180px]">{nextLesson.title}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : <div />}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="h-1 w-full bg-paper-muted shrink-0">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
