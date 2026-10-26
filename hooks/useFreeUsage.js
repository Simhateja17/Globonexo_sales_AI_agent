"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";

/**
 * Live Free-plan usage: AI credits this month (from /billing/usage) and
 * emails sent today across the workspace's inboxes (from /email-accounts).
 * Leads come from the caller, which usually already has the dashboard KPIs.
 * Pass `enabled = false` to skip the requests on paid plans.
 */
export default function useFreeUsage(enabled = true, refreshKey = null) {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    Promise.allSettled([api.get("/billing/usage"), api.get("/email-accounts")]).then(([usageRes, inboxRes]) => {
      if (!active) return;
      const billing = usageRes.status === "fulfilled" ? usageRes.value.data : null;
      const accounts = inboxRes.status === "fulfilled" && Array.isArray(inboxRes.value.data?.accounts) ? inboxRes.value.data.accounts : [];
      const liveAccounts = accounts.filter(account => account.status === "active" || account.status === "needs_attention");
      setUsage({
        creditsUsed: Number(billing?.credits?.usedCredits ?? 0) + Number(billing?.credits?.reservedCredits ?? 0),
        creditsTotal: Number(billing?.credits?.totalCredits ?? 0) || null,
        emailsThisMonth: Number(billing?.emailsSentThisMonth ?? 0),
        emailCampaigns: billing?.campaignUsage?.email ?? null,
        sentToday: liveAccounts.length ? liveAccounts.reduce((sum, account) => sum + Number(account.sentToday ?? 0), 0) : null,
        dailyCap: liveAccounts.length ? liveAccounts.reduce((sum, account) => sum + Number(account.todayLimit ?? account.dailySendCap ?? 0), 0) : null,
      });
    });
    return () => { active = false; };
  }, [enabled, refreshKey]);

  return usage;
}
