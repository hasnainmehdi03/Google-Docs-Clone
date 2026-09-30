import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-5xl font-bold">
          Plan Collaboration Editor
        </h1>

        <p className="max-w-xl text-lg text-gray-600">
          Create documents, organize your ideas, and collaborate with others
          in real time.
        </p>

        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded border px-6 py-3 font-medium hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </main>
    </>
  );
}