"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import api from "../../../lib/api";

function buildFallbackAnalytics(campaignsPayload, callsPayload) {
  const campaigns = campaignsPayload?.campaigns ?? [];
  const callSummary = callsPayload?.summary ?? {};

  const sent = campaigns.reduce((sum, item) => sum + (item.sent ?? 0), 0);
  const replied = campaigns.reduce((sum, item) => sum + (item.replies ?? 0), 0);
  const meetingsFromEmail = campaigns.reduce((sum, item) => sum + (item.meetings ?? 0), 0);
  const prospects = campaigns.reduce((sum, item) => sum + (item.enrolled ?? 0), 0);
  const meetingsBooked = meetingsFromEmail + (callSummary.meetingsBooked ?? 0);
  const replyRate = sent > 0 ? ((replied / sent) * 100).toFixed(1) : "0";

  return {
    summary: {
      meetings: meetingsBooked,
      replyRate,
      emailsSent: sent,
    },
    dailyEmails: [],
    dailyMeetings: [],
    dayLabels: [],
    funnel: {
      prospects,
      emailed: sent,
      replied,
      meetingsBooked,
      closed: 0,
    },
    calls: {
      total: callSummary.totalCalls ?? 0,
      answered: callSummary.answered ?? 0,
      answerRate: callSummary.answerRate ?? '0',
      meetingsBooked: callSummary.meetingsBooked ?? 0,
      voicemail: callSummary.voicemail ?? 0,
      failed: callSummary.failed ?? 0,
    },
  };
}

async function loadAnalytics() {
  try {
    const [res, campaignsRes] = await Promise.all([
      api.get('/dashboard/analytics'),
      api.get('/analytics/campaigns').catch(() => ({ data: null })),
    ]);
    return { ...res.data, campaigns: campaignsRes.data?.campaigns ?? [] };
  } catch {
    const [campaignsRes, callsRes] = await Promise.all([
      api.get('/analytics/campaigns'),
      api.get('/analytics/calls'),
    ]);
    return { ...buildFallbackAnalytics(campaignsRes.data, callsRes.data), campaigns: campaignsRes.data?.campaigns ?? [] };
  }
}

function BarChart({ title, data, labels }) {
  const actualMax = Math.max(...data, 1);
  return (
    <div className="card">
      <div className="card-h"><div><b>{title}</b><small>{labels.length > 1 ? "Last 7 days" : "Total"}</small></div></div>
      <div className="bc">
        {data.map((v, i) => (
          <div key={i} className="bcc">
            <span className="bv">{v}</span>
            <i style={{ height: `${Math.max((v / actualMax) * 130, 4)}px`, opacity: v ? 1 : 0.25 }} />
            <small>{labels[i]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelChart({ funnel }) {
  const stages = [
    { label: 'Prospects found', v: funnel.prospects },
    { label: 'Emailed', v: funnel.emailed },
    { label: 'Replied', v: funnel.replied },
    { label: 'Meeting booked', v: funnel.meetingsBooked },
    { label: 'Closed', v: funnel.closed },
  ];
  const maxVal = Math.max(...stages.map(s => s.v), 1);
  return (
    <div className="card">
      <div className="card-h"><div><b>Conversion funnel</b><small>From prospect found to closed</small></div></div>
      <div className="fn">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].v : 0;
          return (
            <div key={s.label} className="fr">
              <span>{s.label}</span>
              <div className="fb"><u style={{ width: `${Math.max((s.v / maxVal) * 100, 1)}%` }}>{s.v.toLocaleString()}</u></div>
              <em>{i > 0 && prev > 0 ? `${Math.round((s.v / prev) * 100)}% of prev` : ""}</em>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const showSkeleton = useFirstLoad(loading);

  useEffect(() => {
    loadAnalytics()
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (showSkeleton) return <RouteSkeleton />;

  if (!data) {
    return (
      <main className="gx">
        <div className="card empty">Unable to load analytics. Please try again.</div>
      </main>
    );
  }

  const summary = data.summary ?? {};
  const funnel = data.funnel ?? { prospects: 0, emailed: 0, replied: 0, meetingsBooked: 0, closed: 0 };
  const calls = data.calls ?? null;
  const campaigns = data.campaigns ?? [];
  const labels = data.dayLabels?.length ? data.dayLabels : ['Total'];

  return (
    <main className="gx analytics-page">
      <div className="ph">
        <div>
          <h1 data-tour="analytics-header">Analytics</h1>
          <p>Performance over the last 30 days.</p>
        </div>
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <div className="kpi"><div className="kpi-top">Meetings booked<span className="kpi-ic"><Icon name="calendar" size={16} /></span></div><b>{summary.meetings ?? 0}</b><small>last 30 days</small></div>
        <div className="kpi"><div className="kpi-top">Reply rate<span className="kpi-ic"><Icon name="chat" size={16} /></span></div><b>{summary.replyRate ?? 0}%</b><small>of emails sent</small></div>
        <div className="kpi"><div className="kpi-top">Emails sent<span className="kpi-ic"><Icon name="send" size={16} /></span></div><b>{summary.emailsSent ?? 0}</b><small>last 30 days</small></div>
        <div className="kpi"><div className="kpi-top">Calls made<span className="kpi-ic"><Icon name="phone" size={16} /></span></div><b>{calls?.total ?? 0}</b><small>{calls?.answerRate ?? 0}% answered</small></div>
      </div>

      {!(summary.emailsSent > 0) && !(calls?.total > 0) ? (
        <div className="card">
          <EmptyState
            icon="trend"
            title="Not enough data yet"
            text="Charts fill in after your first week of sending. You will see emails, replies and meetings by campaign."
            actions={[{ label: "View campaigns", onClick: () => router.push("/campaigns") }]}
          />
        </div>
      ) : null}

      <div className="an2">
        <BarChart title="Emails sent" data={data.dailyEmails?.length ? data.dailyEmails : [summary.emailsSent ?? 0]} labels={labels} />
        <BarChart title="Meetings booked" data={data.dailyMeetings?.length ? data.dailyMeetings : [summary.meetings ?? 0]} labels={labels} />
      </div>

      <div className="an2">
        <FunnelChart funnel={funnel} />
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="card-h"><div><b>By campaign</b><small>Sends, replies and meetings per campaign</small></div></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Campaign</th><th>Sent</th><th>Replies</th><th>Meetings</th></tr></thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr><td colSpan={4} className="empty">No campaigns yet.</td></tr>
                ) : campaigns.map(c => (
                  <tr key={c.campaignId} onClick={() => router.push(`/campaigns/${c.campaignId}`)}>
                    <td><b style={{ color: "#0a1712", fontWeight: 800 }}>{c.name}</b></td>
                    <td>{c.sent}</td>
                    <td>{c.channel === "voice" ? "n/a" : `${c.replies} · ${c.replyRate}%`}</td>
                    <td>{c.meetings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {calls && (
        <div className="card">
          <div className="card-h">
            <div><b>Call performance</b><small>Inbound and outbound</small></div>
            <button type="button" className="lnk" onClick={() => router.push("/calls")}>Call History <Icon name="arrow" size={14} /></button>
          </div>
          <div className="cpg">
            {[
              { k: 'Total calls', v: calls.total ?? 0 },
              { k: 'Answer rate', v: `${calls.answerRate ?? 0}%` },
              { k: 'Meetings booked', v: calls.meetingsBooked ?? 0 },
              { k: 'Voicemail', v: calls.voicemail ?? 0 },
              { k: 'Failed', v: calls.failed ?? 0 },
            ].map(s => <div key={s.k}><small>{s.k}</small><b>{s.v}</b></div>)}
          </div>
        </div>
      )}
    </main>
  );
}
