"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";
import Icon from "../../../../components/ui/Icon";
import Avatar from "../../../../components/ui/Avatar";
import Spinner from "../../../../components/ui/Spinner";
import RouteSkeleton from "../../../../components/ui/RouteSkeleton";
import { leadPhoto } from "../../../../lib/lead-photo";
import { isValidEmail } from "../../../../lib/validation";
import {
  SOURCE_LABELS,
  STAGE_LABELS,
  STOPPED_STATUSES,
  formatDateTime,
  formatNextOutreach,
  leadName,
  safeExternalUrl,
  stageStyle,
  titleCase,
} from "../../../../components/leads/LeadDetailModal";

const TIMELINE_TABS = [
  { id: "all", label: "All" },
  { id: "email", label: "Emails" },
  { id: "call", label: "Calls" },
];

function localTime(timezone) {
  if (!timezone) return null;
  try {
    return new Intl.DateTimeFormat("en", { timeZone: timezone, weekday: "short", hour: "numeric", minute: "2-digit" }).format(new Date());
  } catch {
    return null;
  }
}

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return null;
  const m = Math.floor(value / 60);
  return m > 0 ? `${m}m ${value % 60}s` : `${value}s`;
}

// Builds the lead's conversation from the campaign's email messages and the
// call log. There is no per-lead timeline endpoint, so both are filtered to
// this lead on the client.
function buildTimeline(messages, calls) {
  const emailEvents = messages.map(message => {
    const sent = message.status === "sent";
    return {
      id: `email-${message.id}`,
      kind: "email",
      icon: sent ? "send" : "spark",
      tone: sent ? "" : "dark",
      title: sent
        ? `Step ${message.stepNumber} email sent`
        : `Step ${message.stepNumber} drafted · ${message.status === "approved" ? "approved, waiting to send" : "waiting for your OK"}`,
      time: (sent && message.schedule?.scheduledAt) || message.approvedAt || message.createdAt,
      subject: message.subject,
      body: message.body,
    };
  });
  const callEvents = calls.map(call => ({
    id: `call-${call.id}`,
    kind: "call",
    icon: "phone",
    tone: "blue",
    title: `${call.direction === "inbound" ? "Inbound call" : "Call"} · ${titleCase(call.disposition || call.status)}`,
    time: call.started_at || call.created_at,
    body: [formatDuration(call.duration_seconds), call.call_summary].filter(Boolean).join(" · ") || null,
  }));
  return [...emailEvents, ...callEvents].sort((a, b) => new Date(a.time || 0) - new Date(b.time || 0));
}

export default function LeadProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [assignCampaignId, setAssignCampaignId] = useState("");

  const loadLead = useCallback(async () => {
    const { data } = await api.get("/leads", { params: { perPage: 500 } });
    const found = (data?.items ?? []).find(item => item.id === id) ?? null;
    setLead(found);
    return found;
  }, [id]);

  useEffect(() => {
    loadLead()
      .catch(() => setError("This lead could not be loaded."))
      .finally(() => setLoading(false));
    api.get("/campaigns").then(res => setCampaigns(res.data?.items ?? [])).catch(() => {});
  }, [loadLead]);

  useEffect(() => {
    if (!lead) return;
    let active = true;
    setTimelineLoading(true);
    Promise.all([
      lead.campaignId
        ? api.get(`/campaigns/${lead.campaignId}/messages`).then(res => res.data?.items ?? []).catch(() => [])
        : Promise.resolve([]),
      api.get("/calls", lead.campaignId ? { params: { campaignId: lead.campaignId } } : undefined).then(res => (Array.isArray(res.data) ? res.data : [])).catch(() => []),
    ]).then(([campaignMessages, callRows]) => {
      if (!active) return;
      setMessages(campaignMessages.filter(message => message.lead?.id === lead.id));
      setCalls(callRows.filter(call => call.lead_id === lead.id));
    }).finally(() => { if (active) setTimelineLoading(false); });
    return () => { active = false; };
  }, [lead]);

  const timeline = useMemo(() => buildTimeline(messages, calls), [messages, calls]);
  const visibleTimeline = tab === "all" ? timeline : timeline.filter(event => event.kind === tab);

  const run = async (key, action, success) => {
    setBusy(key);
    setError("");
    setNotice("");
    try {
      await action();
      await loadLead();
      setNotice(success);
    } catch (err) {
      setError(err?.response?.data?.error || "That action could not be completed.");
    } finally {
      setBusy("");
    }
  };

  if (loading) return <RouteSkeleton />;

  if (!lead) {
    return (
      <main className="gx">
        <div className="ph"><div><Link className="lnk" href="/prospects"><Icon name="arrowLeft" size={14} /> Prospects</Link></div></div>
        <div className="card empty">{error || "This lead was not found. It may have been deleted."}</div>
      </main>
    );
  }

  const name = leadName(lead);
  const status = lead.status || "new";
  const safeEmail = isValidEmail(lead.email) ? lead.email : "";
  const safeLinkedIn = safeExternalUrl(lead.linkedinUrl);
  const geo = [lead.city, lead.state, lead.country].filter(Boolean).join(", ") || lead.location || "";
  const campaign = campaigns.find(item => item.id === lead.campaignId);
  const canSendNow = Boolean(safeEmail) && Boolean(lead.campaignId) && status !== "contacted" && !STOPPED_STATUSES.has(status);
  const hasPendingDraft = messages.some(message => message.status === "draft");
  const employment = Array.isArray(lead.employmentHistory) ? lead.employmentHistory : [];
  const facts = [
    lead.headline ? { label: lead.headline, source: "Profile headline" } : null,
    lead.title && lead.company ? { label: `${lead.title} at ${lead.company}`, source: "Lead record" } : null,
    lead.seniority ? { label: `${titleCase(lead.seniority)} seniority`, source: "Lead database" } : null,
    lead.department ? { label: `${titleCase(lead.department)} department`, source: "Lead database" } : null,
    ...employment.slice(0, 3).map(job => ({
      label: `${job.title || "Role"}${job.organization_name || job.company ? ` · ${job.organization_name || job.company}` : ""}`,
      source: [job.start_date, job.current ? "Present" : job.end_date].filter(Boolean).join(" to ") || "Work history",
    })),
  ].filter(Boolean);
  const readiness = safeEmail && lead.phone ? "Email + voice" : safeEmail ? "Email ready" : lead.phone ? "Voice ready" : "Not ready";

  return (
    <main className="gx">
      <div className="ph">
        <div><Link className="lnk" href="/prospects"><Icon name="arrowLeft" size={14} /> Prospects</Link></div>
        <div className="acts">
          <button type="button" className="bt bt-g" disabled={busy === "enrich"} onClick={() => run("enrich", () => api.post("/leads/apollo-enrich", { leadId: lead.id }), "Lead details refreshed.")}>
            {busy === "enrich" ? <Spinner size={13} /> : <Icon name="refresh" size={14} />} {lead.email ? "Refresh details" : "Reveal email"}
          </button>
          {hasPendingDraft ? (
            <button type="button" className="bt bt-p" onClick={() => router.push(`/campaigns/${lead.campaignId}`)}>
              <Icon name="check" size={14} color="#06231a" /> Review draft
            </button>
          ) : (
            <button type="button" className="bt bt-p" disabled={!canSendNow || busy === "send"} onClick={() => run("send", () => api.post(`/leads/${lead.id}/send-now`), "Email sent to this lead.")}>
              <Icon name="send" size={14} color="#06231a" /> {busy === "send" ? "Sending..." : "Send now"}
            </button>
          )}
        </div>
      </div>

      {error ? <div className="note">{error}</div> : null}
      {notice ? <div className="gnote ok">{notice}</div> : null}

      <div className="lp">
        <div className="scol">
          <div className="card lp-hd">
            <Avatar name={name} size={64} src={leadPhoto(lead)} />
            <div>
              <h2>{name}</h2>
              <p>{[lead.title, lead.company, geo].filter(Boolean).join(" · ") || "No details yet"}</p>
              <div className="pv-tags" style={{ marginTop: 0 }}>
                <span className="pl" style={{ ...stageStyle(status), border: 0 }}>{STAGE_LABELS[status] || status}</span>
                <span className={`pl ${readiness === "Not ready" ? "pl-warn" : "pl-ok"}`}>{readiness}</span>
                <span className="pl pl-dark">Score {lead.score ?? 0}</span>
              </div>
            </div>
            {safeLinkedIn ? <a className="ibt" href={safeLinkedIn} target="_blank" rel="noreferrer" aria-label="Open LinkedIn"><Icon name="link" size={15} /></a> : null}
          </div>

          <div className="card">
            <div className="card-h">
              <div><b>Conversation</b><small>Every email and call with {lead.firstName || name.split(" ")[0]}, oldest first.</small></div>
              <div className="tabs-mini" role="tablist">
                {TIMELINE_TABS.map(item => (
                  <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "on" : ""} onClick={() => setTab(item.id)}>{item.label}</button>
                ))}
              </div>
            </div>
            {timelineLoading ? (
              <div className="empty"><Spinner size={18} /></div>
            ) : visibleTimeline.length === 0 ? (
              <div className="empty">{lead.campaignId ? "Nothing sent or drafted yet." : "This lead is not in a campaign yet."}</div>
            ) : (
              <div className="tl2">
                {visibleTimeline.map(event => (
                  <div key={event.id} className="ev">
                    <span className={`ei ${event.tone}`}><Icon name={event.icon} size={16} /></span>
                    <div>
                      <b>{event.title}</b><small>{formatDateTime(event.time)}</small>
                      {event.subject ? <p style={{ marginBottom: 0 }}><b style={{ display: "block", fontSize: 13 }}>{event.subject}</b>{event.body}</p> : event.body ? <p className={event.kind === "call" ? "in2" : ""}>{event.body}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="scol">
          <div className="card pad">
            <h3 className="h3">Contact</h3>
            <div style={{ marginTop: 8 }}>
              <div className="kv"><span>Email</span><b className="ellip" style={{ maxWidth: 200 }}>{lead.email || "Not revealed"}</b></div>
              <div className="kv"><span>Email check</span><b>{lead.emailStatus ? titleCase(lead.emailStatus) : "Not checked"}</b></div>
              <div className="kv"><span>Phone</span><b>{lead.phone || "Not found"}</b></div>
              {localTime(lead.timezone) ? <div className="kv"><span>Local time</span><b>{localTime(lead.timezone)}</b></div> : null}
              <div className="kv"><span>Campaign</span><b>{campaign ? <Link className="lnk" href={`/campaigns/${campaign.id}`}>{campaign.name}</Link> : lead.campaignId ? "Attached" : "None"}</b></div>
              <div className="kv"><span>Source</span><b>{SOURCE_LABELS[lead.source] || titleCase(lead.source) || "Manual"}</b></div>
              <div className="kv"><span>Next outreach</span><b>{formatNextOutreach(lead.nextOutreach)}</b></div>
            </div>
            {safeEmail ? <a className="bt bt-g sm" style={{ marginTop: 12 }} href={`mailto:${safeEmail}`}><Icon name="mail" size={13} /> Email directly</a> : null}
          </div>

          <div className="card pad">
            <h3 className="h3">Facts the agent can use</h3>
            <p className="sub">Each one comes from the lead record. The agent writes nothing else.</p>
            <div style={{ marginTop: 6 }}>
              {facts.length === 0 ? <p className="sub">No verified facts yet. Refresh details to pull them from the lead database.</p> : facts.map(fact => (
                <div key={fact.label} className="fct"><b>{fact.label}</b><small>{fact.source}</small></div>
              ))}
            </div>
          </div>

          {!lead.campaignId ? (
            <div className="card pad">
              <h3 className="h3">Add to campaign</h3>
              <div className="col" style={{ gap: 10, marginTop: 10 }}>
                <select className="sel-box" aria-label="Campaign" value={assignCampaignId} onChange={event => setAssignCampaignId(event.target.value)}>
                  <option value="">Choose a campaign</option>
                  {campaigns.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <button type="button" className="bt bt-p sm" style={{ alignSelf: "flex-start" }} disabled={!assignCampaignId || busy === "assign"} onClick={() => run("assign", () => api.post(`/campaigns/${assignCampaignId}/assign-leads`, { leadIds: [lead.id] }), "Lead added to the campaign.")}>
                  <Icon name="plus" size={13} color="#06231a" /> Add to campaign
                </button>
              </div>
            </div>
          ) : null}

          <div className="card pad">
            <h3 className="h3">Contact rules</h3>
            <div className="pv-tags">
              <span className={`pl ${lead.emailUnsubscribed ? "pl-bad" : "pl-ok"}`}>{lead.emailUnsubscribed ? "Unsubscribed" : "Subscribed"}</span>
              <span className={`pl ${lead.doNotEmail ? "pl-bad" : "pl-ok"}`}>{lead.doNotEmail ? "Do not email" : "Email allowed"}</span>
              <span className={`pl ${lead.doNotCall ? "pl-bad" : "pl-ok"}`}>{lead.doNotCall ? "Do not call" : "Calls allowed"}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
