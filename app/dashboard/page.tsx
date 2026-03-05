import { getMetrics } from "@/lib/whop";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getMetrics();
  const currency = metrics.currency?.toUpperCase() ?? "USD";
  const formatMoney = (cents: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-lg border p-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Active Members</div>
        <div className="mt-2 text-3xl font-semibold">
          {metrics.activeMembers == null ? "—" : metrics.activeMembers}
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">MRR</div>
        <div className="mt-2 text-3xl font-semibold">
          {metrics.mrrCents == null ? "—" : formatMoney(metrics.mrrCents)}
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Onboarding</div>
        <OnboardingProgress />
      </div>
      <div className="rounded-lg border p-4 lg:col-span-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Get Set Up</div>
          <Link href="https://whop.com/dashboard" className="text-sm underline" target="_blank">
            Open Dashboard
          </Link>
        </div>
        <OnboardingChecklist />
      </div>
    </div>
  );
}

function OnboardingProgress() {
  const items = [
    { id: "apps", completed: false, label: "Add apps" },
    { id: "store", completed: false, label: "Design store" },
    { id: "payments", completed: false, label: "Set up payments" },
    { id: "invite", completed: false, label: "Invite first user" },
  ];
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const pct = Math.round((completed / total) * 100);
  return (
    <div>
      <div className="mt-2 h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-3 rounded bg-zinc-900 dark:bg-zinc-100"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-sm">{pct}% complete</div>
    </div>
  );
}

function OnboardingChecklist() {
  const items = [
    { id: "apps", completed: false, label: "Add apps to your Whop" },
    { id: "store", completed: false, label: "Design your store page" },
    { id: "payments", completed: false, label: "Set up Whop Payments" },
    { id: "invite", completed: false, label: "Invite your first user" },
  ];
  return (
    <ul className="mt-4 space-y-2">
      {items.map((i) => (
        <li key={i.id} className="flex items-center justify-between rounded border p-3">
          <div>{i.label}</div>
          <button
            disabled
            className="cursor-not-allowed rounded border px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400"
            title="Managed in Whop Dashboard"
          >
            Open
          </button>
        </li>
      ))}
    </ul>
  );
}

