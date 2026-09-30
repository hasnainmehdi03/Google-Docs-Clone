"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],

    content,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[600px] bg-white p-8 text-base leading-7 outline-none " +
          "[&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-4xl [&_h1]:font-bold " +
          "[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold " +
          "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-8 " +
          "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-8 " +
          "[&_li]:my-1 [&_p]:my-2",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const buttonClass = (active = false) =>
    `rounded-md border px-3 py-2 text-sm ${
      active
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", { level: 1 })
          )}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", { level: 2 })
          )}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={buttonClass(editor.isActive("bulletList"))}
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={buttonClass(editor.isActive("orderedList"))}
        >
          Numbered List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={buttonClass()}
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={buttonClass()}
        >
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}