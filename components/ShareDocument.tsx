"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  documentId: string;
  ownerId: string;
  currentUserId: string;
};

type Collaborator = {
  id: string;
  user_id: string;
  role: string;
};

export default function ShareDocument({
  documentId,
  ownerId,
  currentUserId,
}: Props) {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  const isOwner = ownerId === currentUserId;

  const loadCollaborators = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("document_collaborators")
    .select("id, user_id, role")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load collaborators:", error);
    setMessage("Failed to load collaborators.");
    return;
  }

  setCollaborators(data ?? []);
};

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
      console.error("Failed to add collaborator:", error);
      setMessage(error.message);
    } else {
      setMessage("Collaborator added successfully.");
      setUserId("");

      await loadCollaborators();
    }

    setLoading(false);
  };

const removeCollaborator = async (collaboratorId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to remove this collaborator?"
  );

  if (!confirmed) {
    return;
  }

  setLoading(true);
  setMessage("");

  const supabase = createClient();

  const { error } = await supabase
    .from("document_collaborators")
    .delete()
    .eq("id", collaboratorId);

  if (error) {
    console.error("Failed to remove collaborator:", error);
    setMessage("Failed to remove collaborator.");
  } else {
    setMessage("Collaborator removed successfully.");

    await loadCollaborators();
  }

  setLoading(false);
};

  if (!isOwner) {
    return null;
  }


  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
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

<button
  type="button"
  onClick={loadCollaborators}
  className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
>
  Manage Access
</button>

        {message && (
          <span className="text-sm text-gray-600">
            {message}
          </span>
        )}
      </div>

      {collaborators.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            People with access
          </h3>

          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between gap-4 rounded-md bg-gray-50 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-700">
                    {collaborator.user_id}
                  </p>

                  <p className="text-xs capitalize text-gray-500">
                    {collaborator.role}
                  </p>
                </div>
                <button
  type="button"
  onClick={() => removeCollaborator(collaborator.id)}
  disabled={loading}
  className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
>
  Remove
</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}