import { getWhopClient, getCompanyContext } from "@/lib/whop";

export const dynamic = "force-dynamic";

type MemberRow = {
  id: string;
  name: string;
  username?: string | null;
  status: string;
};

type MembershipLite = {
  id: string;
  status: string;
  user?: { name?: string | null; username?: string | null } | null;
};

async function loadMembers(): Promise<MemberRow[]> {
  const whop = getWhopClient();
  const { companyId } = await getCompanyContext();
  if (!whop || !companyId) return [];
  const rows: MemberRow[] = [];
  for await (const membership of whop.memberships.list({ company_id: companyId })) {
    const m = membership as unknown as MembershipLite;
    const name = m.user?.name ?? m.user?.username ?? "Unknown";
    rows.push({
      id: m.id,
      name: name,
      username: m.user?.username ?? null,
      status: m.status,
    });
  }
  return rows;
}

export default async function MembersPage() {
  const members = await loadMembers();
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Members</h1>
      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-left dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-2">{m.name}</td>
                <td className="px-4 py-2">{m.username ?? "—"}</td>
                <td className="px-4 py-2 capitalize">{m.status.replace("_", " ")}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-zinc-600 dark:text-zinc-400" colSpan={3}>
                  No members to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
