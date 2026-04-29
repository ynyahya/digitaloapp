"use client";

import { useState, useRef, useEffect } from "react";
import { useCourseStudio } from "@/hooks/use-course-studio";
import {
  Type,
  FileVideo,
  ImageIcon,
  Headphones,
  FileText,
  MessageSquare,
  HelpCircle,
  LayoutGrid,
  Code2,
  Paperclip,
  ListChecks,
  Quote,
  Columns2,
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  MoveUp,
  MoveDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBlock } from "./blocks/video-block";
import { ImageBlock } from "./blocks/image-block";
import { AudioBlock } from "./blocks/audio-block";
import { FileBlock } from "./blocks/file-block";
import { QuizBlock } from "./blocks/quiz-block";
import { CalloutBlock } from "./blocks/callout-block";
import { EmbedBlock } from "./blocks/embed-block";
import { CodeBlock } from "./blocks/code-block";
import { AssignmentBlock } from "./blocks/assignment-block";
import { TextBlock } from "./blocks/text-block";

type BlockType = "text" | "video" | "image" | "audio" | "file" | "quiz" | "callout" | "embed" | "code" | "columns" | "assignment" | "resource";

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export function LessonCanvas() {
  const { activeLesson, setLessonField, chapters, renameLesson } = useCourseStudio();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLesson) {
      setEditTitle(activeLesson.title);
      // Parse content JSON into blocks if exists
      try {
        if (activeLesson.contentJson) {
          const parsed = JSON.parse(activeLesson.contentJson);
          if (Array.isArray(parsed)) {
            setBlocks(parsed);
            return;
          }
        }
      } catch {}
      // Default: text block
      setBlocks([{ id: "block-1", type: "text", content: "" }]);
    }
  }, [activeLesson?.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!activeLesson) {
    return (
      <div className="flex-1 bg-[#fbfbfc] h-full flex flex-col items-center justify-center">
        <div className="text-center space-y-3 max-w-[320px]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-paper-soft border border-line flex items-center justify-center">
            <FileText className="h-7 w-7 text-ink-subtle" />
          </div>
          <h3 className="text-[15px] font-semibold text-ink">No lesson selected</h3>
          <p className="text-[12px] text-ink-muted leading-relaxed">
            Select a lesson from the curriculum tree or create a new one to start editing.
          </p>
        </div>
      </div>
    );
  }

  const handleTitleRename = async () => {
    if (editTitle.trim() && editTitle !== activeLesson.title) {
      await renameLesson(activeLesson.id, editTitle);
    }
    setIsEditingTitle(false);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: "",
    };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    setActiveBlock(newBlock.id);
    setShowAddMenu(false);
    persistBlocks(updated);
  };

  const updateBlock = (id: string, content: string) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, content } : b));
    setBlocks(updated);
    persistBlocks(updated);
  };

  const removeBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    if (activeBlock === id) setActiveBlock(null);
    persistBlocks(updated);
  };

  const duplicateBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const newBlock = { ...block, id: `block-${Date.now()}` };
    const idx = blocks.findIndex((b) => b.id === id);
    const updated = [...blocks.slice(0, idx + 1), newBlock, ...blocks.slice(idx + 1)];
    setBlocks(updated);
    setActiveBlock(newBlock.id);
    persistBlocks(updated);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === blocks.length - 1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...blocks];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    setBlocks(updated);
    persistBlocks(updated);
  };

  const persistBlocks = (b: Block[]) => {
    setLessonField(activeLesson.id, "contentJson", JSON.stringify(b));
  };

  // Find lesson position
  let chIdx = 0;
  let lIdx = 0;
  for (let i = 0; i < chapters.length; i++) {
    const li = chapters[i].lessons.findIndex((l) => l.id === activeLesson.id);
    if (li !== -1) {
      chIdx = i + 1;
      lIdx = li + 1;
      break;
    }
  }

  return (
    <div className="flex-1 bg-[#fbfbfc] h-full overflow-y-auto relative">
      <div className="max-w-[780px] mx-auto py-8 px-8 space-y-6 pb-40">
        {/* Lesson Header */}
        <div className="flex items-center justify-between bg-paper p-5 rounded-2xl border border-line">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-[14px] font-semibold text-ink-muted shrink-0">
              {chIdx}.{lIdx}
            </span>
            {isEditingTitle ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleRename}
                onKeyDown={(e) => e.key === "Enter" && handleTitleRename()}
                className="text-[26px] font-bold text-ink bg-transparent border-b-2 border-indigo-500 outline-none w-full"
              />
            ) : (
              <h1
                className="text-[26px] font-bold text-ink cursor-text hover:text-indigo-600 transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {activeLesson.title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                activeLesson.isPublished
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {activeLesson.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Lesson Description */}
        <div className="bg-paper border border-line rounded-2xl p-5 space-y-2">
          <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
            Lesson Description
          </label>
          <textarea
            className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink-muted resize-none focus:outline-none min-h-[60px]"
            placeholder="A brief description of what this lesson covers…"
            value={activeLesson.description || ""}
            onChange={(e) => setLessonField(activeLesson.id, "description", e.target.value)}
            rows={2}
          />
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {blocks.map((block, idx) => (
            <BlockWrapper
              key={block.id}
              block={block}
              isActive={activeBlock === block.id}
              onActivate={() => setActiveBlock(block.id)}
              onUpdate={(content) => updateBlock(block.id, content)}
              onRemove={() => removeBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, "up")}
              onMoveDown={() => moveBlock(block.id, "down")}
              canMoveUp={idx > 0}
              canMoveDown={idx < blocks.length - 1}
            />
          ))}
        </div>

        {/* Add Block Button */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full border-2 border-dashed border-line hover:border-indigo-300 rounded-2xl py-4 flex items-center justify-center gap-2 text-[13px] font-medium text-ink-muted hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add a block
          </button>

          {showAddMenu && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-paper border border-line rounded-2xl p-3 shadow-float z-50 grid grid-cols-4 gap-1.5">
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl gap-1.5 hover:bg-paper-soft transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-paper-soft border border-line flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                    <bt.icon className="h-4 w-4 text-ink-muted group-hover:text-indigo-600" />
                  </div>
                  <span className="text-[9px] font-medium text-ink-muted group-hover:text-ink">
                    {bt.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Prompt */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-ink">Generate content with AI</p>
              <p className="text-[10px] text-ink-muted">
                Describe what you want and AI will write it for you
              </p>
            </div>
          </div>
          <Button size="sm" className="h-7 rounded-lg text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white">
            Write with AI
          </Button>
        </div>
      </div>
    </div>
  );
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: any }[] = [
  { type: "text", label: "Text", icon: Type },
  { type: "video", label: "Video", icon: FileVideo },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "audio", label: "Audio", icon: Headphones },
  { type: "file", label: "File", icon: FileText },
  { type: "quiz", label: "Quiz", icon: HelpCircle },
  { type: "callout", label: "Callout", icon: Quote },
  { type: "embed", label: "Embed", icon: LayoutGrid },
  { type: "code", label: "Code", icon: Code2 },
  { type: "columns", label: "Columns", icon: Columns2 },
  { type: "assignment", label: "Assignment", icon: ListChecks },
  { type: "resource", label: "Resource", icon: Paperclip },
];

function BlockWrapper({
  block,
  isActive,
  onActivate,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  block: Block;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (content: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div
      className={`group/block relative bg-paper rounded-2xl border transition-all ${
        isActive ? "border-indigo-300 shadow-sm ring-1 ring-indigo-100" : "border-line hover:border-line"
      }`}
      onClick={onActivate}
    >
      {/* Block Controls (hover) */}
      <div className="absolute -left-10 top-2 flex flex-col gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md bg-paper border border-line hover:bg-paper-soft text-ink-muted"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={!canMoveUp}
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          className="p-1 rounded-md bg-paper border border-line hover:bg-paper-soft text-ink-muted"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={!canMoveDown}
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <button
          className="p-1 rounded-md hover:bg-paper-soft text-ink-muted"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          className="p-1 rounded-md hover:bg-rose-50 text-ink-muted hover:text-rose-500"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Block Content */}
      <div className="p-5">
        <BlockRenderer block={block} onUpdate={onUpdate} />
      </div>

      {/* Block Type Label */}
      <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-paper border border-line rounded-full text-[9px] font-semibold text-ink-muted uppercase tracking-wider">
        {block.type}
      </div>
    </div>
  );
}

function BlockRenderer({
  block,
  onUpdate,
}: {
  block: Block;
  onUpdate: (content: string) => void;
}) {
  switch (block.type) {
    case "text":
      return <TextBlock content={block.content} onChange={onUpdate} />;
    case "video":
      return <VideoBlock content={block.content} onChange={onUpdate} />;
    case "image":
      return <ImageBlock content={block.content} onChange={onUpdate} />;
    case "audio":
      return <AudioBlock content={block.content} onChange={onUpdate} />;
    case "file":
      return <FileBlock content={block.content} onChange={onUpdate} />;
    case "quiz":
      return <QuizBlock content={block.content} onChange={onUpdate} />;
    case "callout":
      return <CalloutBlock content={block.content} onChange={onUpdate} />;
    case "embed":
      return <EmbedBlock content={block.content} onChange={onUpdate} />;
    case "code":
      return <CodeBlock content={block.content} onChange={onUpdate} />;
    case "assignment":
      return <AssignmentBlock content={block.content} onChange={onUpdate} />;
    default:
      return <TextBlock content={block.content} onChange={onUpdate} />;
  }
}
