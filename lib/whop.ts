import Whop from "@whop/sdk";
import { headers } from "next/headers";

let client: Whop | null = null;

export function getWhopClient() {
  if (!client) {
    client = new Whop({
      apiKey: process.env.WHOP_API_KEY,
      appID: process.env.WHOP_APP_ID,
    });
  }
  return client;
}

export async function getCompanyContext() {
  const h = await headers();
  const headerCompany = h.get("x-whop-company-id") || undefined;
  const companyId = headerCompany || process.env.WHOP_COMPANY_ID || undefined;
  return { companyId };
}

export async function getActiveMembersCount() {
  const whop = getWhopClient();
  const { companyId } = await getCompanyContext();
  if (!whop || !companyId) return null;
  let count = 0;
  for await (const membership of whop.memberships.list({ company_id: companyId })) {
    if (membership.status === "active" || membership.status === "trialing" || membership.status === "past_due") {
      count += 1;
    }
  }
  return count;
}

export type Metrics = {
  activeMembers: number | null;
  mrrCents: number | null;
  currency: string | null;
};

type MembershipForRevenue = {
  id: string;
  status: string;
  currency?: string | null;
  price_cents?: number | null;
  interval?: "month" | "year" | string | null;
  plan?: {
    price_cents?: number | null;
    interval?: "month" | "year" | string | null;
  } | null;
};

export async function getMetrics(): Promise<Metrics> {
  const activeMembers = await getActiveMembersCount();
  const whop = getWhopClient();
  const { companyId } = await getCompanyContext();
  if (!whop || !companyId) {
    return { activeMembers, mrrCents: null, currency: null };
  }
  let mrrCents: number | null = null;
  let currency: string | null = null;
  try {
    for await (const membership of whop.memberships.list({ company_id: companyId })) {
      const m = membership as unknown as MembershipForRevenue;
      if (m.status === "active" || m.status === "trialing" || m.status === "past_due") {
        const price = m.price_cents ?? m.plan?.price_cents ?? null;
        const interval = m.interval ?? m.plan?.interval ?? "month";
        const cur = m.currency ?? null;
        if (price != null) {
          const normalized = interval === "year" ? Math.floor(price / 12) : interval === "month" ? price : null;
          if (normalized != null) {
            mrrCents = (mrrCents ?? 0) + normalized;
            if (!currency && cur) currency = cur;
          }
        }
      }
    }
  } catch {
    mrrCents = null;
    currency = null;
  }
  return { activeMembers: activeMembers ?? null, mrrCents, currency };
}

