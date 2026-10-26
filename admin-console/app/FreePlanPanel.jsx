"use client";

import React, { useCallback, useEffect, useState } from "react";
import Icon from "../../components/ui/Icon";
import adminApi from "../lib/admin-api";

function dollars(cents) {
  return `$${((Number(cents) || 0) / 100).toFixed(2)}`;
}

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString() : "Never";
}

function Metric({ label, value, icon, tone }) {
  return (
    <div className="metric-card">
      <span className="metric-icon" data-tone={tone || "green"}><Icon name={icon} size={16} /></span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

// Free plan control room: Azure credit runway, the Free signup switch, users
// worth a personal upgrade email, and the waitlist.
export default function FreePlanPanel({ askReason, setError, setNotice }) {
  const [overview, setOverview] = useState(null);
  const [hot, setHot] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [overviewRes, hotRes, waitlistRes] = await Promise.all([
        adminApi.get("/ops/free-plan"),
        adminApi.get("/ops/free-plan/hot-organizations"),
        adminApi.get("/ops/free-plan/waitlist"),
      ]);
      setOverview(overviewRes.data);
      setHot(hotRes.data.items ?? []);
      setWaitlist(waitlistRes.data.items ?? []);
    } catch (err) {
      setError(err.response?.data?.error || "Could not load the Free plan overview.");
    }
  }, [setError]);

  useEffect(() => { load(); }, [load]);

  const toggleSignups = async () => {
    const next = !overview?.freeSignupsEnabled;
    const reason = askReason(next ? "turning Free signups on" : "turning Free signups off");
    if (!reason) return;
    setSaving(true);
    try {
      await adminApi.post("/ops/settings/free-signups", { enabled: next, reason });
      setNotice(next ? "Free signups are on." : "Free signups are off. New signups join the waitlist.");
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not change Free signups.");
    } finally {
      setSaving(false);
    }
  };

  const azure = overview?.azure;
  const usedPercent = azure?.budgetCents ? Math.round((azure.spentCents / azure.budgetCents) * 100) : 0;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="metric-grid">
        <Metric label={`Azure credits left of ${dollars(azure?.budgetCents)}`} value={dollars(azure?.remainingCents)} icon="chart" tone={usedPercent >= 80 ? "warn" : undefined} />
        <Metric label="Azure spend, last 7 days" value={dollars(azure?.last7DaysCents)} icon="trend" />
        <Metric label="days left at this rate" value={azure?.daysLeftAtCurrentRate ?? "No recent use"} icon="calendar" />
        <Metric label="Free accounts (paused)" value={`${overview?.freeOrganizations ?? 0} (${overview?.pausedFreeOrganizations ?? 0})`} icon="users" />
      </div>

      <div className="card" style={{ padding: 20, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Free signups are {overview?.freeSignupsEnabled ? "ON" : "OFF"}</div>
          <p className="muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
            When off, new work-email signups join the waitlist ({overview?.waitlistCount ?? 0} waiting) and can still choose a paid plan.
            This month Free accounts used {dollars(azure?.freeThisMonthCents)} of {dollars(azure?.thisMonthCents)} Azure spend.
          </p>
        </div>
        <button className={overview?.freeSignupsEnabled ? "btn btn-ghost" : "btn btn-primary"} onClick={toggleSignups} disabled={saving || !overview}>
          {saving ? "Saving…" : overview?.freeSignupsEnabled ? "Turn Free signups off" : "Turn Free signups on"}
        </button>
      </div>

      <div className="card table-shell">
        <div style={{ padding: "16px 20px 0", fontWeight: 800 }}>Hot Free users: email them personally</div>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 980 }}>
            <thead><tr>{["Organization", "Owner email", "AI credits used", "Emails sent (30d)", "Replies (30d)", "Leads", "Last active"].map(header => <th key={header}>{header}</th>)}</tr></thead>
            <tbody>
              {hot.length === 0 ? <tr><td colSpan={7} className="table-empty">No Free users close to a limit or getting replies yet.</td></tr> : hot.map(org => (
                <tr className="data-row" key={org.organizationId}>
                  <td><strong>{org.organizationName}</strong></td>
                  <td>{org.ownerEmail ? <a href={`mailto:${org.ownerEmail}`}>{org.ownerEmail}</a> : "Not found"}</td>
                  <td>{org.creditsUsed} / {org.creditsIncluded}</td>
                  <td>{org.emailsSent30d}</td>
                  <td>{org.replies30d}</td>
                  <td>{org.leadsTotal}</td>
                  <td>{formatDate(org.lastActiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card table-shell">
        <div style={{ padding: "16px 20px 0", fontWeight: 800 }}>Waitlist</div>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 640 }}>
            <thead><tr>{["Email", "Company", "Joined"].map(header => <th key={header}>{header}</th>)}</tr></thead>
            <tbody>
              {waitlist.length === 0 ? <tr><td colSpan={3} className="table-empty">Nobody is waiting.</td></tr> : waitlist.map(entry => (
                <tr className="data-row" key={entry.id}>
                  <td>{entry.email}</td>
                  <td>{entry.company || "Not given"}</td>
                  <td>{formatDate(entry.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
