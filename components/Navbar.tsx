import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-8 py-4">
      <Link href="/" className="text-xl font-bold">
        Plan Editor
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="rounded px-4 py-2 hover:bg-gray-100"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}