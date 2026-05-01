"use client";

import { useState, useCallback } from "react";
import { useCourseStudio, StudioLesson } from "@/hooks/use-course-studio";
import {
  Plus,
  GripVertical,
  FolderOpen,
  Folder,
  FileText,
  FileVideo,
  MoreHorizontal,
  Trash2,
  Copy,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Upload,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createChapter, createLesson, duplicateCourse } from "@/lib/actions/courses";
import { deleteChapter as apiDeleteChapter, deleteLesson as apiDeleteLesson } from "@/lib/actions/courses";

export function CurriculumSidebar() {
  const {
    chapters,
    course,
    state,
    setActiveLesson,
    addChapter,
    addLesson,
    renameChapter,
    renameLesson,
    removeChapter,
    removeLesson,
    moveChapterAction,
    moveLessonAction,
    toggleChapterExpand,
    expandedChapters,
    duplicateLessonAction,
    duplicateChapterAction,
  } = useCourseStudio();

  const [addingModule, setAddingModule] = useState(false);
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [dragOverChapter, setDragOverChapter] = useState<string | null>(null);

  const handleAddModule = async () => {
    setAddingModule(true);
    try {
      const newCh = await createChapter(course.id, `Module ${chapters.length + 1}`);
      addChapter({ ...(newCh as any), lessons: [] });
      setEditingId(newCh.id);
      setEditTitle(newCh.title);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingModule(false);
    }
  };

  const handleAddLesson = async (chapterId: string, count: number) => {
    setAddingLessonTo(chapterId);
    try {
      const newLes = await createLesson(chapterId, `Lesson ${count + 1}`);
      addLesson(newLes as any);
      setEditingId(newLes.id);
      setEditTitle(newLes.title);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingLessonTo(null);
    }
  };

  const handleRename = async () => {
    if (!editingId) return;
    const isCh = chapters.some((ch) => ch.id === editingId);
    if (isCh) await renameChapter(editingId, editTitle);
    else await renameLesson(editingId, editTitle);
    setEditingId(null);
  };

  const handleDuplicateLesson = async (lessonId: string, chapterId: string) => {
    try {
      // Create a duplicate in the DB
      for (const ch of chapters) {
        const l = ch.lessons.find((x) => x.id === lessonId);
        if (l) {
          const newLes = await createLesson(chapterId, `${l.title} (copy)`);
          duplicateLessonAction(lessonId, chapterId, newLes as any);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicateChapter = async (chapterId: string) => {
    try {
      const ch = chapters.find((c) => c.id === chapterId);
      if (ch) {
        const newCh = await createChapter(course.id, `${ch.title} (copy)`);
        // Copy lessons
        for (const l of ch.lessons) {
          const newLes = await createLesson(newCh.id, l.title);
        }
        // Fetch full chapter
        duplicateChapterAction(chapterId, { ...(newCh as any), lessons: [] });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalLessons = chapters.reduce((s, ch) => s + ch.lessons.length, 0);
  const publishedLessons = chapters.reduce((s, ch) => s + ch.lessons.filter((l) => l.isPublished).length, 0);

  return (
    <div className="w-[280px] border-r border-white/[0.08] bg-night flex flex-col shrink-0 h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-chalk-muted" />
          <h2 className="text-[13px] font-semibold text-chalk">Curriculum</h2>
          <span className="text-[10px] text-chalk-muted bg-white/[0.035] px-1.5 py-0.5 rounded">
            {publishedLessons}/{totalLessons}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg hover:bg-white/[0.035]"
          onClick={handleAddModule}
          disabled={addingModule}
        >
          {addingModule ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Quick actions */}
      <div className="px-3 py-2 border-b border-white/[0.08] flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-lg text-[10px] px-2 font-medium text-chalk-muted hover:text-chalk hover:bg-white/[0.035] flex-1"
          onClick={handleAddModule}
          disabled={addingModule}
        >
          <Plus className="h-3 w-3 mr-1" /> Module
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-lg text-[10px] px-2 font-medium text-lime hover:bg-lime/10"
        >
          <Sparkles className="h-3 w-3 mr-1" /> AI Outline
        </Button>
      </div>

      {/* Modules Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chapters.length === 0 ? (
          <div className="text-center py-16 text-chalk-muted space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.035] border border-white/[0.08] flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-chalk-dim" />
            </div>
            <p className="text-[12px] font-medium">No modules yet</p>
            <p className="text-[10px]">Create your first module to start building</p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-lg border-dashed border-white/[0.08] text-[11px]"
              onClick={handleAddModule}
            >
              <Plus className="h-3 w-3 mr-1" /> New Module
            </Button>
          </div>
        ) : (
          chapters.map((ch, idx) => {
            const isExpanded = expandedChapters.has(ch.id);
            const allPublished = ch.lessons.length > 0 && ch.lessons.every((l) => l.isPublished);

            return (
              <div key={ch.id} className="group/chapter">
                {/* Module Row */}
                <div
                  className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    dragOverChapter === ch.id ? "bg-lime/10 border border-lime/25" : "hover:bg-white/[0.035]"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverChapter(ch.id);
                  }}
                  onDragLeave={() => setDragOverChapter(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverChapter(null);
                    // Handle lesson drop here
                  }}
                >
                  <button
                    onClick={() => toggleChapterExpand(ch.id)}
                    className="p-0.5 rounded hover:bg-white/[0.06] transition-colors"
                  >
                    <ChevronRight
                      className={`h-3 w-3 text-chalk-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>

                  <div
                    className="flex-1 min-w-0 flex items-center gap-2"
                    onClick={() => toggleChapterExpand(ch.id)}
                  >
                    {isExpanded ? (
                      <FolderOpen className="h-3.5 w-3.5 shrink-0 text-lime" />
                    ) : (
                      <Folder className="h-3.5 w-3.5 shrink-0 text-lime/80" />
                    )}

                    {editingId === ch.id ? (
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        className="w-full bg-night border border-lime/60 rounded px-1.5 py-0.5 text-[12px] font-medium outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-[12px] font-medium text-chalk truncate">{ch.title}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover/chapter:opacity-100 transition-opacity shrink-0">
                    <button
                      className="p-1 rounded hover:bg-white/[0.06] text-chalk-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddLesson(ch.id, ch.lessons.length);
                      }}
                      disabled={addingLessonTo === ch.id}
                    >
                      {addingLessonTo === ch.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      className="p-1 rounded hover:bg-white/[0.06] text-chalk-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateChapter(ch.id);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-rose-500/10 text-chalk-muted hover:text-rose-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete module "${ch.title}" and all its lessons?`))
                          removeChapter(ch.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {isExpanded && (
                  <div className="ml-4 pl-3 border-l border-white/[0.08] space-y-0.5 mt-0.5">
                    {ch.lessons.length === 0 && (
                      <div className="text-[10px] text-chalk-muted py-2 text-center">
                        No lessons yet
                      </div>
                    )}
                    {ch.lessons.map((lesson) => (
                      <LessonRow
                        key={lesson.id}
                        lesson={lesson}
                        isActive={state.activeLessonId === lesson.id}
                        isEditing={editingId === lesson.id}
                        editTitle={editTitle}
                        onEditTitleChange={setEditTitle}
                        onRename={handleRename}
                        onClick={() => {
                          if (state.activeLessonId === lesson.id) {
                            setEditingId(lesson.id);
                            setEditTitle(lesson.title);
                          } else {
                            setActiveLesson(lesson.id);
                          }
                        }}
                        onDuplicate={() => handleDuplicateLesson(lesson.id, ch.id)}
                        onDelete={() => {
                          if (confirm(`Delete lesson "${lesson.title}"?`))
                            removeLesson(lesson.id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-2 border-t border-white/[0.08]">
        <Button
          variant="ghost"
          className="w-full justify-start h-8 rounded-lg text-[11px] font-medium text-chalk-muted hover:text-chalk"
        >
          <Upload className="h-3.5 w-3.5 mr-2" />
          Import Content
        </Button>
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  isActive,
  isEditing,
  editTitle,
  onEditTitleChange,
  onRename,
  onClick,
  onDuplicate,
  onDelete,
}: {
  lesson: StudioLesson;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  onEditTitleChange: (v: string) => void;
  onRename: () => void;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const Icon = lesson.contentType === "VIDEO" ? FileVideo : FileText;

  return (
    <div
      onClick={onClick}
      className={`group/lesson flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-lime/10 border border-lime/25"
          : "hover:bg-white/[0.035] border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon
          className={`h-3 w-3 shrink-0 ${isActive ? "text-lime" : "text-chalk-muted"}`}
        />
        {isEditing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            onBlur={onRename}
            onKeyDown={(e) => e.key === "Enter" && onRename()}
            className="w-full bg-night border border-lime/60 rounded px-1 py-0.5 text-[11px] outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={`text-[11px] truncate ${
              isActive ? "font-semibold text-lime" : "text-chalk"
            }`}
          >
            {lesson.title}
          </span>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover/lesson:opacity-100 transition-opacity shrink-0">
        {lesson.isPublished ? (
          <Eye className="h-2.5 w-2.5 text-emerald-500" />
        ) : (
          <EyeOff className="h-2.5 w-2.5 text-chalk-dim" />
        )}
        <button
          className="p-0.5 rounded hover:bg-white/[0.06] text-chalk-muted"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="h-2.5 w-2.5" />
        </button>
        <button
          className="p-0.5 rounded hover:bg-rose-500/10 text-chalk-muted hover:text-rose-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}
