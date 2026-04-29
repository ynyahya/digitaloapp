"use client";

import { createContext, useContext, useReducer, useCallback, useRef, useEffect, ReactNode } from "react";
import {
  updateCourseMeta,
  updateLessonAdvanced,
  createChapter,
  createLesson,
  renameChapter as apiRenameChapter,
  renameLesson as apiRenameLesson,
  toggleCourseStatus,
  deleteChapter as apiDeleteChapter,
  deleteLesson as apiDeleteLesson,
  reorderCurriculum,
} from "@/lib/actions/courses";

// ── Types ──────────────────────────────────────────────────

export interface StudioLesson {
  id: string;
  chapterId: string;
  title: string;
  description: string | null;
  contentType: string;
  contentJson: string | null;
  videoUrl: string | null;
  videoProvider: string | null;
  documentUrl: string | null;
  quizJson: string | null;
  codeConfig: string | null;
  embedUrl: string | null;
  liveSessionAt: Date | null;
  liveSessionUrl: string | null;
  assignmentBrief: string | null;
  attachments: string | null;
  transcript: string | null;
  prerequisiteIds: string | null;
  position: number;
  durationMin: number | null;
  dripDays: number | null;
  isFree: boolean;
  isPublished: boolean;
}

export interface StudioChapter {
  id: string;
  courseId: string;
  title: string;
  position: number;
  lessons: StudioLesson[];
}

export interface StudioCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  level: string;
  category: string | null;
  language: string;
  format: string;
  visibility: string;
  pricingModel: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  status: string;
  pipelineStage: string;
  coverImage: string | null;
  thumbnailUrl: string | null;
  thumbnailColor: string | null;
  trailerUrl: string | null;
  whatYouLearn: string | null;
  outcomes: string | null;
  requirements: string | null;
  audience: string | null;
  faqJson: string | null;
  guarantees: string | null;
  trailerPoster: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  totalLessons: number;
  totalStudents: number;
  totalHours: number;
  creatorHandle?: string;
}

export interface ContentBlock {
  id: string;
  type: "text" | "video" | "image" | "audio" | "file" | "quiz" | "callout" | "embed" | "code" | "columns" | "assignment" | "resource";
  data: Record<string, any>;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface StudioState {
  course: StudioCourse;
  chapters: StudioChapter[];
  activeLessonId: string | null;
  activeTab: "curriculum" | "overview" | "design" | "settings";
  dirtyCourseFields: Set<string>;
  dirtyLessonFields: Record<string, Set<string>>;
  saveStatus: SaveStatus;
  undoStack: any[];
  redoStack: any[];
  expandedChapters: Set<string>;
}

type StudioAction =
  | { type: "SET_COURSE_FIELD"; field: string; value: any }
  | { type: "SET_LESSON_FIELD"; lessonId: string; field: string; value: any }
  | { type: "SET_CHAPTERS"; chapters: StudioChapter[] }
  | { type: "SET_ACTIVE_LESSON"; lessonId: string | null }
  | { type: "SET_ACTIVE_TAB"; tab: StudioState["activeTab"] }
  | { type: "MARK_SAVING" }
  | { type: "MARK_SAVED" }
  | { type: "MARK_ERROR" }
  | { type: "CLEAR_DIRTY" }
  | { type: "ADD_CHAPTER"; chapter: StudioChapter }
  | { type: "ADD_LESSON"; lesson: StudioLesson }
  | { type: "RENAME_CHAPTER"; chapterId: string; title: string }
  | { type: "RENAME_LESSON"; lessonId: string; title: string }
  | { type: "REMOVE_CHAPTER"; chapterId: string }
  | { type: "REMOVE_LESSON"; lessonId: string }
  | { type: "MOVE_CHAPTER"; chapterId: string; newPosition: number }
  | { type: "MOVE_LESSON"; lessonId: string; newChapterId: string; newPosition: number }
  | { type: "TOGGLE_CHAPTER_EXPAND"; chapterId: string }
  | { type: "DUPLICATE_LESSON"; lessonId: string; newLesson: StudioLesson }
  | { type: "DUPLICATE_CHAPTER"; chapterId: string; newChapter: StudioChapter };

// ── Reducer ────────────────────────────────────────────────

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case "RENAME_CHAPTER":
      return {
        ...state,
        chapters: state.chapters.map((ch) =>
          ch.id === action.chapterId ? { ...ch, title: action.title } : ch
        ),
      };
    case "RENAME_LESSON":
      return {
        ...state,
        chapters: state.chapters.map((ch) => ({
          ...ch,
          lessons: ch.lessons.map((l) =>
            l.id === action.lessonId ? { ...l, title: action.title } : l
          ),
        })),
      };
    case "REMOVE_CHAPTER":
      return {
        ...state,
        chapters: state.chapters.filter((ch) => ch.id !== action.chapterId),
        activeLessonId:
          state.activeLessonId &&
          state.chapters
            .find((ch) => ch.id === action.chapterId)
            ?.lessons.some((l) => l.id === state.activeLessonId)
            ? null
            : state.activeLessonId,
      };
    case "REMOVE_LESSON":
      return {
        ...state,
        chapters: state.chapters.map((ch) => ({
          ...ch,
          lessons: ch.lessons.filter((l) => l.id !== action.lessonId),
        })),
        activeLessonId: state.activeLessonId === action.lessonId ? null : state.activeLessonId,
      };
    case "MOVE_CHAPTER": {
      const chs = [...state.chapters];
      const idx = chs.findIndex((c) => c.id === action.chapterId);
      if (idx === -1) return state;
      const [moved] = chs.splice(idx, 1);
      chs.splice(action.newPosition, 0, { ...moved, position: action.newPosition });
      return {
        ...state,
        chapters: chs.map((c, i) => ({ ...c, position: i })),
      };
    }
    case "MOVE_LESSON": {
      // Find the lesson to move
      let sourceChapterId = "";
      let lessonToMove: StudioLesson | null = null;

      for (const ch of state.chapters) {
        const idx = ch.lessons.findIndex((l) => l.id === action.lessonId);
        if (idx !== -1) {
          sourceChapterId = ch.id;
          lessonToMove = ch.lessons[idx];
          break;
        }
      }

      if (!lessonToMove) return state;

      // Remove from source
      const chaptersAfterMove = state.chapters.map((ch) => {
        if (ch.id !== sourceChapterId) return ch;
        return {
          ...ch,
          lessons: ch.lessons.filter((l) => l.id !== action.lessonId).map((l, i) => ({ ...l, position: i })),
        };
      });

      // Insert into target
      const finalChapters = chaptersAfterMove.map((ch) => {
        if (ch.id !== action.newChapterId) return ch;
        const updated = { ...lessonToMove!, chapterId: action.newChapterId, position: action.newPosition };
        const newLessons = [...ch.lessons];
        newLessons.splice(action.newPosition, 0, updated);
        return {
          ...ch,
          lessons: newLessons.map((l, i) => ({ ...l, position: i })),
        };
      });

      return { ...state, chapters: finalChapters };
    }
    case "TOGGLE_CHAPTER_EXPAND": {
      const next = new Set(state.expandedChapters);
      if (next.has(action.chapterId)) next.delete(action.chapterId);
      else next.add(action.chapterId);
      return { ...state, expandedChapters: next };
    }
    case "DUPLICATE_LESSON":
      return {
        ...state,
        chapters: state.chapters.map((ch) =>
          ch.id === action.newLesson.chapterId
            ? { ...ch, lessons: [...ch.lessons, action.newLesson] }
            : ch
        ),
      };
    case "DUPLICATE_CHAPTER":
      return {
        ...state,
        chapters: [...state.chapters, action.newChapter],
        expandedChapters: new Set([...state.expandedChapters, action.newChapter.id]),
      };
    case "SET_COURSE_FIELD":
      return {
        ...state,
        course: { ...state.course, [action.field]: action.value },
        dirtyCourseFields: new Set([...state.dirtyCourseFields, action.field]),
        saveStatus: "idle",
      };
    case "SET_LESSON_FIELD": {
      const newCh = state.chapters.map((ch) => {
        if (!ch.lessons.some((l) => l.id === action.lessonId)) return ch;
        return {
          ...ch,
          lessons: ch.lessons.map((l) =>
            l.id === action.lessonId ? { ...l, [action.field]: action.value } : l
          ),
        };
      });
      const prev = state.dirtyLessonFields[action.lessonId] || new Set();
      return {
        ...state,
        chapters: newCh,
        dirtyLessonFields: { ...state.dirtyLessonFields, [action.lessonId]: new Set([...prev, action.field]) },
        saveStatus: "idle",
      };
    }
    case "SET_CHAPTERS":
      return { ...state, chapters: action.chapters };
    case "ADD_CHAPTER":
      return { ...state, chapters: [...state.chapters, action.chapter], expandedChapters: new Set([...state.expandedChapters, action.chapter.id]) };
    case "ADD_LESSON":
      return {
        ...state,
        activeLessonId: action.lesson.id,
        chapters: state.chapters.map((ch) =>
          ch.id === action.lesson.chapterId
            ? { ...ch, lessons: [...ch.lessons, action.lesson] }
            : ch
        ),
        expandedChapters: new Set([...state.expandedChapters, action.lesson.chapterId]),
      };
    case "SET_ACTIVE_LESSON":
      return { ...state, activeLessonId: action.lessonId };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.tab };
    case "MARK_SAVING":
      return { ...state, saveStatus: "saving" };
    case "MARK_SAVED":
      return { ...state, saveStatus: "saved", dirtyCourseFields: new Set(), dirtyLessonFields: {} };
    case "MARK_ERROR":
      return { ...state, saveStatus: "error" };
    case "CLEAR_DIRTY":
      return { ...state, dirtyCourseFields: new Set(), dirtyLessonFields: {} };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────

interface CourseStudioContextValue {
  state: StudioState;
  course: StudioCourse;
  chapters: StudioChapter[];
  activeLesson: StudioLesson | null;
  saveStatus: SaveStatus;
  expandedChapters: Set<string>;
  setCourseField: (field: string, value: any) => void;
  setLessonField: (lessonId: string, field: string, value: any) => void;
  setChapters: (chapters: StudioChapter[]) => void;
  addChapter: (chapter: StudioChapter) => void;
  addLesson: (lesson: StudioLesson) => void;
  renameChapter: (chapterId: string, title: string) => Promise<void>;
  renameLesson: (lessonId: string, title: string) => Promise<void>;
  removeChapter: (chapterId: string) => Promise<void>;
  removeLesson: (lessonId: string) => Promise<void>;
  moveChapterAction: (chapterId: string, newPosition: number) => void;
  moveLessonAction: (lessonId: string, newChapterId: string, newPosition: number) => void;
  toggleChapterExpand: (chapterId: string) => void;
  duplicateLessonAction: (lessonId: string, chapterId: string, newLesson: StudioLesson) => void;
  duplicateChapterAction: (chapterId: string, newChapter: StudioChapter) => void;
  toggleStatus: () => Promise<void>;
  setActiveLesson: (lessonId: string | null) => void;
  setActiveTab: (tab: StudioState["activeTab"]) => void;
  forceSave: () => Promise<void>;
}

const CourseStudioContext = createContext<CourseStudioContextValue | null>(null);

export function useCourseStudio() {
  const ctx = useContext(CourseStudioContext);
  if (!ctx) throw new Error("useCourseStudio must be used within CourseStudioProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────

export function CourseStudioProvider({
  initialCourse,
  initialChapters,
  children,
}: {
  initialCourse: StudioCourse;
  initialChapters: StudioChapter[];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(studioReducer, {
    course: initialCourse,
    chapters: initialChapters,
    activeLessonId: initialChapters[0]?.lessons[0]?.id || null,
    activeTab: "curriculum",
    dirtyCourseFields: new Set<string>(),
    dirtyLessonFields: {},
    saveStatus: "idle" as SaveStatus,
    undoStack: [],
    redoStack: [],
    expandedChapters: new Set(initialChapters.map((c) => c.id)),
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const performSave = useCallback(async () => {
    const cs = stateRef.current;
    const { dirtyCourseFields, dirtyLessonFields, course, chapters } = cs;
    if (dirtyCourseFields.size === 0 && Object.keys(dirtyLessonFields).length === 0) return;
    dispatch({ type: "MARK_SAVING" });
    try {
      if (dirtyCourseFields.size > 0) {
        const courseData: Record<string, any> = {};
        for (const f of dirtyCourseFields) courseData[f] = (course as any)[f];
        await updateCourseMeta(course.id, courseData);
      }
      for (const lessonId of Object.keys(dirtyLessonFields)) {
        const fields = dirtyLessonFields[lessonId];
        if (fields.size > 0) {
          let lesson: StudioLesson | undefined;
          for (const ch of chapters) {
            const l = ch.lessons.find((x) => x.id === lessonId);
            if (l) { lesson = l; break; }
          }
          if (lesson) {
            const lessonData: Record<string, any> = {};
            for (const f of fields) lessonData[f] = (lesson as any)[f];
            await updateLessonAdvanced(lesson.id, lessonData);
          }
        }
      }
      dispatch({ type: "MARK_SAVED" });
    } catch (err) {
      console.error("Auto-save failed:", err);
      dispatch({ type: "MARK_ERROR" });
    }
  }, []);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(performSave, 2000);
  }, [performSave]);

  const setCourseField = useCallback(
    (field: string, value: any) => {
      dispatch({ type: "SET_COURSE_FIELD", field, value });
      scheduleSave();
    },
    [scheduleSave]
  );

  const setLessonField = useCallback(
    (lessonId: string, field: string, value: any) => {
      dispatch({ type: "SET_LESSON_FIELD", lessonId, field, value });
      scheduleSave();
    },
    [scheduleSave]
  );

  const moveChapterAction = useCallback((chapterId: string, newPosition: number) => {
    dispatch({ type: "MOVE_CHAPTER", chapterId, newPosition });
  }, []);

  const moveLessonAction = useCallback((lessonId: string, newChapterId: string, newPosition: number) => {
    dispatch({ type: "MOVE_LESSON", lessonId, newChapterId, newPosition });
  }, []);

  const toggleChapterExpand = useCallback((chapterId: string) => {
    dispatch({ type: "TOGGLE_CHAPTER_EXPAND", chapterId });
  }, []);

  const duplicateLessonAction = useCallback((lessonId: string, chapterId: string, newLesson: StudioLesson) => {
    dispatch({ type: "DUPLICATE_LESSON", lessonId, newLesson });
  }, []);

  const duplicateChapterAction = useCallback((chapterId: string, newChapter: StudioChapter) => {
    dispatch({ type: "DUPLICATE_CHAPTER", chapterId, newChapter });
  }, []);

  const setChapters = useCallback((chapters: StudioChapter[]) => {
    dispatch({ type: "SET_CHAPTERS", chapters });
  }, []);

  const addChapter = useCallback((chapter: StudioChapter) => {
    dispatch({ type: "ADD_CHAPTER", chapter });
  }, []);

  const addLesson = useCallback((lesson: StudioLesson) => {
    dispatch({ type: "ADD_LESSON", lesson });
  }, []);

  const renameChapter = useCallback(async (chapterId: string, title: string) => {
    dispatch({ type: "RENAME_CHAPTER", chapterId, title });
    await apiRenameChapter(chapterId, title);
  }, []);

  const renameLesson = useCallback(async (lessonId: string, title: string) => {
    dispatch({ type: "RENAME_LESSON", lessonId, title });
    await apiRenameLesson(lessonId, title);
  }, []);

  const toggleStatus = useCallback(async () => {
    const newStatus = state.course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    dispatch({ type: "SET_COURSE_FIELD", field: "status", value: newStatus });
    await toggleCourseStatus(state.course.id);
  }, [state.course.id, state.course.status]);

  const removeChapter = useCallback(async (chapterId: string) => {
    dispatch({ type: "REMOVE_CHAPTER", chapterId });
    await apiDeleteChapter(chapterId);
  }, []);

  const removeLesson = useCallback(async (lessonId: string) => {
    dispatch({ type: "REMOVE_LESSON", lessonId });
    await apiDeleteLesson(lessonId);
  }, []);

  const setActiveLesson = useCallback((lessonId: string | null) => {
    dispatch({ type: "SET_ACTIVE_LESSON", lessonId });
  }, []);

  const setActiveTab = useCallback((tab: StudioState["activeTab"]) => {
    dispatch({ type: "SET_ACTIVE_TAB", tab });
  }, []);

  const forceSave = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await performSave();
  }, [performSave]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        forceSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [forceSave]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const cs = stateRef.current;
      if (cs.dirtyCourseFields.size > 0 || Object.keys(cs.dirtyLessonFields).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  let activeLesson: StudioLesson | null = null;
  if (state.activeLessonId) {
    for (const ch of state.chapters) {
      const l = ch.lessons.find((x) => x.id === state.activeLessonId);
      if (l) { activeLesson = l; break; }
    }
  }

  return (
    <CourseStudioContext.Provider
      value={{
        state,
        course: state.course,
        chapters: state.chapters,
        activeLesson,
        saveStatus: state.saveStatus,
        expandedChapters: state.expandedChapters,
        setCourseField,
        setLessonField,
        setChapters,
        addChapter,
        addLesson,
        renameChapter,
        renameLesson,
        removeChapter,
        removeLesson,
        moveChapterAction,
        moveLessonAction,
        toggleChapterExpand,
        duplicateLessonAction,
        duplicateChapterAction,
        toggleStatus,
        setActiveLesson,
        setActiveTab,
        forceSave,
      }}
    >
      {children}
    </CourseStudioContext.Provider>
  );
}
