"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  documentId: string;
  ownerId: string;
  currentUserId: string;
};

export default function ShareDocument({
  documentId,
  ownerId,
  currentUserId,
}: Props) {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwner = ownerId === currentUserId;

  if (!isOwner) {
    return null;
  }

  const addCollaborator = async () => {
    if (!userId.trim()) {
      setMessage("Enter a user ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("document_collaborators")
      .insert({
        document_id: documentId,
        user_id: userId.trim(),
        role: "editor",
      });

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setMessage("Collaborator added.");
      setUserId("");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Collaborator user ID"
        className="w-64 rounded-md border px-3 py-2 text-sm"
      />

      <button
        type="button"
        onClick={addCollaborator}
        disabled={loading}
        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Sharing..." : "Share"}
      </button>

      {message && (
        <span className="text-sm text-gray-600">
          {message}
        </span>
      )}
    </div>
  );
}