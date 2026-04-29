"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link,
  Code,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

export function TextBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: "Start typing… press / for block commands" }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-p:leading-relaxed max-w-none focus:outline-none min-h-[80px] text-[14px] text-ink",
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 pb-2 border-b border-line flex-wrap">
        <ToolBtn editor={editor} action="bold" icon={Bold} />
        <ToolBtn editor={editor} action="italic" icon={Italic} />
        <ToolBtn editor={editor} action="strike" icon={Strikethrough} />
        <div className="w-px h-3 bg-line mx-1" />
        <ToolBtn editor={editor} action="heading1" icon={Heading1} />
        <ToolBtn editor={editor} action="heading2" icon={Heading2} />
        <div className="w-px h-3 bg-line mx-1" />
        <ToolBtn editor={editor} action="bulletList" icon={List} />
        <ToolBtn editor={editor} action="orderedList" icon={ListOrdered} />
        <div className="w-px h-3 bg-line mx-1" />
        <ToolBtn
          editor={editor}
          action="link"
          icon={Link}
          onClick={() => {
            if (editor) {
              const url = window.prompt("Enter URL:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolBtn({
  editor,
  action,
  icon: Icon,
  onClick,
}: {
  editor: Editor | null;
  action?: string;
  icon: any;
  onClick?: () => void;
}) {
  if (!editor) return null;

  const isActive =
    action === "bold"
      ? editor.isActive("bold")
      : action === "italic"
      ? editor.isActive("italic")
      : action === "strike"
      ? editor.isActive("strike")
      : action === "heading1"
      ? editor.isActive("heading", { level: 1 })
      : action === "heading2"
      ? editor.isActive("heading", { level: 2 })
      : action === "bulletList"
      ? editor.isActive("bulletList")
      : action === "orderedList"
      ? editor.isActive("orderedList")
      : false;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (!action) return;
    const chain = editor.chain().focus();
    switch (action) {
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "strike":
        chain.toggleStrike().run();
        break;
      case "heading1":
        chain.toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        chain.toggleHeading({ level: 2 }).run();
        break;
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-ink-muted hover:bg-paper-soft hover:text-ink"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
