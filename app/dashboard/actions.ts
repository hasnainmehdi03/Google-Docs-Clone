"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createDocument() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      title: "Untitled Document",
      content: "",
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }

  redirect(`/document/${data.id}`);
}