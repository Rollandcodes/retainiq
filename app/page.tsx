import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Welcome</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Use the navigation to view your dashboard metrics and member list. Manage billing,
        products, and setup from your Whop Dashboard.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-md border px-4 py-2 text-sm"
        >
          Open Dashboard
        </Link>
        <Link
          href="/members"
          className="rounded-md border px-4 py-2 text-sm"
        >
          View Members
        </Link>
        <a
          href="https://whop.com/dashboard"
          target="_blank"
          className="rounded-md border px-4 py-2 text-sm"
        >
          Whop Dashboard
        </a>
      </div>
    </div>
  );
}
