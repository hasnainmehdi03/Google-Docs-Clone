import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DocumentEditor from "@/components/DocumentEditor";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: document, error } = await supabase
    .from("documents")
    .select("id, title, content, owner_id")
    .eq("id", id)
    .single();

  if (error || !document) {
    notFound();
  }

  return (
    <DocumentEditor
  document={{
    id: document.id,
    title: document.title,
    content: document.content,
    owner_id: document.owner_id,
  }}
  currentUserId={user.id}
/>
  );
}