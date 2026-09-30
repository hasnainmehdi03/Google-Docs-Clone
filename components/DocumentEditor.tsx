"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/RichTextEditor";
import ShareDocument from "@/components/ShareDocument";

type DocumentEditorProps = {
  document: {
    id: string;
    title: string;
    content: string | null;
    owner_id: string;
  };
  currentUserId: string;
};

export default function DocumentEditor({
  document,
  currentUserId,
}: DocumentEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveDocument = async () => {
    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("documents")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", document.id);

    if (error) {
      console.error("Error saving document:", error);
      setMessage("Failed to save document.");
    } else {
      setMessage("Saved");
      router.refresh();
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            ← Dashboard
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-[200px] flex-1 rounded-md border px-3 py-2 text-lg font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Document title"
          />

          <ShareDocument
            documentId={document.id}
            ownerId={document.owner_id}
            currentUserId={currentUserId}
          />

          <button
            type="button"
            onClick={saveDocument}
            disabled={saving}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {message && (
          <p className="mb-3 text-sm text-gray-600">
            {message}
          </p>
        )}

        <RichTextEditor
          content={content}
          onChange={setContent}
        />
      </main>
    </div>
  );
}