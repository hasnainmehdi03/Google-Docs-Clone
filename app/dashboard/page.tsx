import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import { createDocument } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error loading documents:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Documents
            </h1>

            <p className="mt-2 text-gray-600">
              {user.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-8">
          <form action={createDocument}>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              + New Document
            </button>
          </form>
        </div>

        <div className="mt-8">
          {!documents || documents.length === 0 ? (
            <div className="rounded-lg border bg-white p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                No documents yet
              </h2>

              <p className="mt-2 text-gray-500">
                Create your first document to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Link
                  key={document.id}
                  href={`/document/${document.id}`}
                  className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h2 className="font-semibold text-gray-900">
                    {document.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(document.updated_at).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}