"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered } from 'lucide-react'

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-line p-2 bg-paper-muted rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('bold') ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('italic') ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('strike') ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      
      <div className="w-px h-4 bg-line mx-1" />
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <div className="w-px h-4 bg-line mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('bulletList') ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded-md hover:bg-paper transition-colors ${editor.isActive('orderedList') ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted'}`}
        type="button"
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something..."
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      // Return HTML for rendering, but if empty return empty string
      const html = editor.getHTML();
      if (html === '<p></p>') {
        onChange('');
      } else {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-p:leading-relaxed max-w-none focus:outline-none min-h-[150px] p-4 text-[14px] text-ink',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="border border-line rounded-xl overflow-hidden focus-within:border-ink/30 transition-colors bg-paper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
