"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, ChevronUp, Lightbulb, ListTree, Video, Scissors, CheckCircle2, Radio, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { CourseListItem } from "@/lib/queries/courses";
import { setPipelineStage } from "@/lib/actions/courses";

const STAGES = [
  { id: "IDEA", label: "Idea", icon: Lightbulb },
  { id: "OUTLINING", label: "Outlining", icon: ListTree },
  { id: "RECORDING", label: "Recording", icon: Video },
  { id: "EDITING", label: "Editing", icon: Scissors },
  { id: "READY", label: "Ready", icon: CheckCircle2 },
  { id: "LIVE", label: "Live", icon: Radio },
  { id: "ARCHIVED", label: "Archived", icon: Archive },
] as const;

function PipelineCard({ course }: { course: CourseListItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: course.id,
    data: { course },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group rounded-xl border border-line bg-paper p-3 cursor-grab active:cursor-grabbing transition-all",
        "hover:border-ink/30 hover:shadow-soft",
        isDragging && "opacity-40 shadow-float",
      )}
    >
      <p className="text-[12.5px] font-bold text-ink line-clamp-2 leading-snug">
        {course.title}
      </p>
      <div className="mt-2 flex items-center gap-2 text-[10.5px] text-ink-muted">
        <span>{course.totalLessons} lessons</span>
        <span>·</span>
        <span>{course.totalHours}h</span>
      </div>
    </div>
  );
}

function Column({
  stage,
  courses,
}: {
  stage: typeof STAGES[number];
  courses: CourseListItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const Icon = stage.icon;
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-[200px] shrink-0 rounded-2xl border border-line bg-paper-soft p-3 gap-2 transition-colors",
        isOver && "border-ink/40 bg-paper-muted/60",
      )}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-ink">
          <Icon className="h-3.5 w-3.5" />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]">{stage.label}</p>
        </div>
        <Badge size="sm" variant="soft" className="rounded-full text-[10px]">
          {courses.length}
        </Badge>
      </div>
      <div className="space-y-2 min-h-[40px]">
        {courses.map((c) => (
          <PipelineCard key={c.id} course={c} />
        ))}
        {courses.length === 0 && (
          <div className="rounded-xl border border-dashed border-line h-[58px] flex items-center justify-center">
            <p className="text-[11px] text-ink-subtle italic">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CoursePipelineBoard({ courses: initial }: { courses: CourseListItem[] }) {
  const [collapsed, setCollapsed] = useState(true);
  const [courses, setCourses] = useState(initial);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = async (e: DragEndEvent) => {
    const overId = e.over?.id?.toString();
    const courseId = e.active.id.toString();
    if (!overId) return;
    const target = STAGES.find((s) => s.id === overId);
    if (!target) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, pipelineStage: target.id } : c)),
    );
    try {
      await setPipelineStage(courseId, target.id);
    } catch {
      // revert on failure
      setCourses(initial);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-paper shadow-soft overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-paper-soft transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-paper-muted flex items-center justify-center">
            <ListTree className="h-4 w-4 text-ink" />
          </div>
          <div className="text-left">
            <p className="text-[13.5px] font-bold text-ink">Production Pipeline</p>
            <p className="text-[11px] text-ink-muted">
              Move courses across stages — Idea → Live
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-ink-muted">
            {courses.length} total
          </span>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-ink-muted" />
          ) : (
            <ChevronUp className="h-4 w-4 text-ink-muted" />
          )}
        </div>
      </button>
      {!collapsed && (
        <div className="px-5 pb-5 pt-1 border-t border-line bg-paper-soft/40">
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-2 pt-3">
              {STAGES.map((stage) => (
                <Column
                  key={stage.id}
                  stage={stage}
                  courses={courses.filter((c) => c.pipelineStage === stage.id)}
                />
              ))}
            </div>
          </DndContext>
        </div>
      )}
    </section>
  );
}
