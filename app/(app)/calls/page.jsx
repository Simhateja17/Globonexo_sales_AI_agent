"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../lib/api";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useRouter } from "next/navigation";
import Spinner from "../../../components/ui/Spinner";
import Avatar from "../../../components/ui/Avatar";

const STATUS_STYLES = {
  queued:      { label: "Queued",      bg: "var(--bg-2)",  color: "var(--muted)", dot: "var(--faint)" },
  in_progress: { label: "In Progress", bg: "#e0f2fe",      color: "#0369a1",      dot: "#0ea5e9" },
  completed:   { label: "Completed",   bg: "var(--g-50)",  color: "var(--g-700)", dot: "var(--g-500)" },
  failed:      { label: "Failed",      bg: "#fee2e2",      color: "#991b1b",      dot: "#ef4444" },
  voicemail:   { label: "Voicemail",   bg: "#f3f4f6",      color: "#374151",      dot: "#9ca3af" },
  rejected:    { label: "Rejected",    bg: "#f3f4f6",      color: "#374151",      dot: "#9ca3af" },
  no_answer:   { label: "No Answer",   bg: "#fff7ed",      color: "#9a3412",      dot: "#f97316" },
  busy:        { label: "Busy",        bg: "#fff7ed",      color: "#9a3412",      dot: "#f97316" },
  not_connected:{ label: "Not Connected", bg: "#f3f4f6",   color: "#4b5563",      dot: "#9ca3af" },
};

const DISPOSITION_STYLES = {
  meeting_booked:  { label: "Meeting Booked",  bg: "var(--g-50)",  color: "var(--g-700)" },
  interested:      { label: "Interested",      bg: "#e0f2fe",      color: "#0369a1" },
  callback:        { label: "Callback",        bg: "#fff7ed",      color: "#9a3412" },
  not_interested:  { label: "Not Interested",  bg: "#fee2e2",      color: "#991b1b" },
  voicemail:       { label: "Voicemail",       bg: "#f3f4f6",      color: "#374151" },
  no_answer:       { label: "No Answer",       bg: "#f3f4f6",      color: "#374151" },
  busy:            { label: "Busy",             bg: "#fff7ed",      color: "#9a3412" },
  no_connect:      { label: "Not Connected",    bg: "#f3f4f6",      color: "#4b5563" },
  technical_failure:{ label: "Technical Failure", bg: "#fee2e2",   color: "#991b1b" },
};

const FILTERS = ["all", "completed", "in_progress", "no_answer", "busy", "voicemail", "failed", "rejected"];

const FILTER_LABELS = {
  all: "All",
  completed: "Completed",
  in_progress: "In Progress",
  failed: "Failed",
  voicemail: "Voicemail",
  rejected: "Rejected",
  no_answer: "No answer",
  busy: "Busy",
};

const EMPTY_STATE_COPY = {
  all:         { title: "No calls yet",             body: "Launch a voice campaign to start making calls." },
  completed:   { title: "No completed calls yet",   body: "Calls will show up here once the conversation finishes." },
  in_progress: { title: "No calls in progress",      body: "Calls will appear here the moment they start dialing." },
  failed:      { title: "No failed calls",           body: "Nice. Nothing has failed to connect." },
  voicemail:   { title: "No voicemails yet",         body: "Calls that hit voicemail will show up here." },
  rejected:    { title: "No rejected calls",         body: "Calls declined by inbound safety and budget rules will show up here." },
  no_answer:   { title: "No unanswered calls",       body: "Calls that did not connect will show up here." },
  busy:        { title: "No busy calls",             body: "Calls that reached a busy destination will show up here." },
};

function StatCard({ label, value, icon, tone, detail }) {
  const warn = tone === "warn";
  return (
    <div className="kpi">
      <div className="kpi-top">{label}<span className={`kpi-ic ${warn ? "warn" : ""}`}><Icon name={icon} size={16} /></span></div>
      <b>{value}</b>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.queued;
  return (
    <span className="pl" style={{ background: s.bg, color: s.color }}>
      <u style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

function DispositionBadge({ disposition, status }) {
  if (!disposition) {
    // A connected call may still be waiting for Retell's post-call analysis;
    // terminal non-connected states now receive a provider disposition from
    // call_ended and should not look as if analysis is pending.
    if (status === "completed") {
      return <span className="pl pl-mute">Analyzing…</span>;
    }
    return <span className="muted" style={{ fontSize: 12 }}>Not available</span>;
  }
  const d = DISPOSITION_STYLES[disposition];
  if (!d) return <span className="pl pl-mute">{disposition}</span>;
  return (
    <span className="pl" style={{ background: d.bg, color: d.color }}>
      {d.label}
    </span>
  );
}

function formatDuration(startedAt, endedAt, durationSeconds) {
  const seconds = Number.isFinite(Number(durationSeconds))
    ? Math.max(0, Math.floor(Number(durationSeconds)))
    : startedAt && endedAt
      ? Math.floor((new Date(endedAt) - new Date(startedAt)) / 1000)
      : null;
  if (seconds === null) return "Not available";
  if (seconds < 0) return "Not available";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function leadName(lead) {
  return [lead?.first_name, lead?.last_name].filter(Boolean).join(" ") || lead?.name || "Unknown";
}

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <small>{label}</small>
      <b style={{ overflowWrap: "anywhere" }}>{String(value)}</b>
    </div>
  );
}

function formatProviderCost(cost) {
  const combined = Number(cost?.combined_cost);
  if (!Number.isFinite(combined)) return null;
  return `$${(combined / 100).toFixed(2)} provider cost`;
}

function formatAnalysisLabel(value) {
  return String(value).replace(/_/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

function CallDetailPanel({ call }) {
  const analysis = call.retell_analysis_data && typeof call.retell_analysis_data === "object"
    ? call.retell_analysis_data
    : {};
  const analysisEntries = Object.entries(analysis).filter(([, value]) => value !== null && value !== undefined && value !== "");
  const inbound = call.direction === "inbound";
  const hasRecording = !inbound && (call.recording_url || call.recording_multi_channel_url);

  return (
    <aside className="card cd">
      <div className="cd-h">
        <Avatar name={leadName(call.leads)} size={40} />
        <div style={{ minWidth: 0 }}>
          <b className="ellip">{leadName(call.leads)}</b>
          <small className="ellip">{[call.leads?.company, call.campaigns?.name].filter(Boolean).join(" · ") || (inbound ? call.from_number : call.to_number)}</small>
        </div>
        <DispositionBadge disposition={call.disposition} status={call.status} />
      </div>

      {hasRecording && (
        <div className="rec">
          <audio controls preload="none" src={call.recording_multi_channel_url || call.recording_url} style={{ width: "100%", height: 38 }} />
        </div>
      )}

      {call.call_summary && (
        <div className="cd-sec">
          <small>Summary</small>
          <p>{call.call_summary}</p>
        </div>
      )}

      <div className="cd-sec">
        <small>Details</small>
        <div className="g2k">
          <DetailRow label="Status" value={STATUS_STYLES[call.status]?.label || call.status} />
          <DetailRow label="Duration" value={formatDuration(call.started_at, call.ended_at, call.duration_seconds)} />
          <DetailRow label="Direction" value={call.direction || "outbound"} />
          <DetailRow label="Date" value={formatDate(call.created_at)} />
          <DetailRow label="Connection" value={call.disconnection_reason ? formatAnalysisLabel(call.disconnection_reason) : call.status === "completed" ? "Connected" : null} />
          <DetailRow label="Sentiment" value={call.user_sentiment} />
          <DetailRow label="Call success" value={typeof call.call_successful === "boolean" ? (call.call_successful ? "Yes" : "No") : null} />
          <DetailRow label="Callback" value={call.callback_requested_at ? formatDate(call.callback_requested_at) : null} />
          <DetailRow label="Provider cost" value={formatProviderCost(call.call_cost)} />
          <DetailRow label="Agent version" value={call.agent_version ? `${call.agent_id || "Retell agent"} · v${call.agent_version}` : null} />
        </div>
      </div>

      {analysisEntries.length > 0 && (
        <div className="cd-sec">
          <small>Sales analysis</small>
          <div className="g2k">
            {analysisEntries.map(([key, value]) => <DetailRow key={key} label={formatAnalysisLabel(key)} value={typeof value === "boolean" ? (value ? "Yes" : "No") : value} />)}
          </div>
        </div>
      )}

      <div className="cd-sec">
        <small>Transcript</small>
        {inbound ? (
          <p className="muted">Inbound transcripts and recordings are not retained.</p>
        ) : call.transcript ? (
          <pre style={{ fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#2c3b33", fontFamily: "inherit", fontWeight: 600, margin: 0, maxHeight: 360, overflow: "auto" }}>{call.transcript}</pre>
        ) : (
          <p className="muted">Transcript is still being processed, or this call did not connect.</p>
        )}
      </div>

      {!inbound && call.transcript_with_tool_calls?.length > 0 && (
        <div className="cd-sec">
          <details>
            <summary style={{ cursor: "pointer", color: "#69786f", fontSize: 12, fontWeight: 700 }}>Show tool activity ({call.transcript_with_tool_calls.length} events)</summary>
            <pre style={{ fontSize: 11, lineHeight: 1.45, whiteSpace: "pre-wrap", color: "#69786f", marginTop: 8 }}>{JSON.stringify(call.transcript_with_tool_calls, null, 2)}</pre>
          </details>
        </div>
      )}
    </aside>
  );
}

export default function CallsPage() {
  const router = useRouter();
  const [calls, setCalls]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("all");
  const [numberFilter, setNumberFilter] = useState("");
  const [numbers, setNumbers] = useState([]);
  useEffect(() => { api.get('/phone-numbers').then(({ data }) => setNumbers(data.numbers || [])).catch(() => {}); }, []);
  const [toast, setToast]           = useState("");
  const [selectedCallId, setSelectedCallId] = useState("");
  const [retrying, setRetrying]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (filter !== "all") query.set('status', filter);
      if (numberFilter) query.set('phoneNumberId', numberFilter);
      const params = `?${query}`;
      const { data } = await api.get(`/calls${params}`);
      setCalls(Array.isArray(data) ? data : []);
    } catch {
      setCalls([]);
      setError("Failed to load calls.");
    } finally {
      setLoading(false);
    }
  }, [filter, numberFilter]);

  useEffect(() => { load(); }, [load]);

  const handleRetry = async (callId) => {
    setRetrying(callId);
    try {
      await api.post(`/calls/${callId}/retry`);
      showToast("Call re-queued successfully.");
      load();
    } catch (err) {
      showToast(err?.response?.data?.error ?? "Failed to retry call.");
    } finally {
      setRetrying("");
    }
  };

  const metrics = useMemo(() => ({
    total:      calls.length,
    connected:  calls.filter(c => c.status === "completed").length,
    inProgress: calls.filter(c => c.status === "in_progress" || c.status === "queued").length,
    notConnected: calls.filter(c => ["no_answer", "busy", "not_connected", "voicemail", "failed", "rejected"].includes(c.status)).length,
  }), [calls]);

  const emptyCopy = EMPTY_STATE_COPY[filter] ?? EMPTY_STATE_COPY.all;

  const selectedCall = calls.find(call => call.id === selectedCallId) || calls[0] || null;

  return (
    <main className="gx">
      {toast && (
        <div className="row" style={{ position: "fixed", bottom: 24, right: 24, gap: 8, background: "var(--ink)", color: "#fff", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, zIndex: 9999, maxWidth: 360, boxShadow: "var(--sh-lg)" }}>
          <Icon name="checkCircle" size={15} color="var(--g-300)" />
          {toast}
        </div>
      )}

      <div className="ph">
        <div>
          <h1>Call History</h1>
          <p>Inbound and outbound outcomes. Privacy-protected inbound calls do not retain transcripts or recordings.</p>
        </div>
        <div className="acts">
          <select className="sel-box" style={{ background: "#fff" }} aria-label="Filter by phone number" value={numberFilter} onChange={event => setNumberFilter(event.target.value)}>
            <option value="">All phone numbers</option>
            {numbers.map(number => <option key={number.id} value={number.id}>{number.phone_number || number.label || "Pending number"}</option>)}
          </select>
          <button type="button" className="bt bt-g" onClick={load} disabled={loading}>
            <Icon name="refresh" size={14} /> {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <StatCard label="Total calls" value={metrics.total} icon="phone" />
        <StatCard label="Connected" value={metrics.connected} icon="checkCircle" detail={metrics.total ? `${Math.round((metrics.connected / metrics.total) * 100)}% connect rate` : null} />
        <StatCard label="In progress" value={metrics.inProgress} icon="clock" />
        <StatCard label="Not connected" value={metrics.notConnected} icon="alertCircle" tone="warn" />
      </div>

      <div className="cg">
        <div className="card" style={{ overflow: "hidden", position: "relative" }}>
          <div className="tools">
            <div className="seg" role="tablist" aria-label="Call status" style={{ flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>
          </div>
          {loading && calls.length > 0 && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.6)", display: "grid", placeItems: "center", zIndex: 1 }}>
              <Spinner size={22} />
            </div>
          )}
          {loading && calls.length === 0 ? (
            <div aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="srow">
                  <span className="sk" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                  <div><span className="sk" style={{ width: "40%" }} /><span className="sk" style={{ width: "25%", marginTop: 6, height: 8 }} /></div>
                  <span className="sk" style={{ width: 80, height: 22, borderRadius: 99 }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="empty" style={{ color: "var(--stop)" }}>
              {error} <button type="button" className="bt bt-g sm" onClick={load} style={{ marginLeft: 8 }}>Retry</button>
            </div>
          ) : calls.length === 0 ? (
            filter === "all" ? (
              <EmptyState
                icon="phone"
                title="No calls yet"
                text="Start a voice campaign and your agent calls your leads, says it is an AI first, and logs every call here with a transcript."
                actions={[{ label: "New voice campaign", icon: "plus", primary: true, onClick: () => router.push("/campaigns/new") }]}
              />
            ) : (
              <EmptyState icon="phone" title={emptyCopy.title} text={emptyCopy.body} actions={[{ label: "Show all calls", onClick: () => setFilter("all") }]} />
            )
          ) : (
            <div className="tbl-wrap" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto", transition: "opacity .15s" }}>
              <table className="tbl">
                <thead>
                  <tr>{["Lead", "Campaign", "Status", "Outcome", "Duration", "Date", ""].map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {calls.map(call => (
                    <tr
                      key={call.id}
                      className={selectedCall?.id === call.id ? "sel" : ""}
                      tabIndex={0}
                      aria-selected={selectedCall?.id === call.id}
                      onClick={() => setSelectedCallId(call.id)}
                      onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedCallId(call.id); } }}
                    >
                      <td>
                        <div className="who">
                          <Avatar name={leadName(call.leads)} size={32} />
                          <div style={{ minWidth: 0 }}>
                            <b>{leadName(call.leads)}</b>
                            <small>
                              <Icon name="arrow" size={11} style={call.direction === "inbound" ? { transform: "rotate(135deg)" } : { transform: "rotate(-45deg)" }} />{" "}
                              {call.direction === "inbound" ? `Inbound · to ${call.to_number}` : `Outbound · from ${call.from_number}`}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{call.campaigns?.name || "No campaign"}</td>
                      <td><StatusBadge status={call.status} /></td>
                      <td><DispositionBadge disposition={call.disposition} status={call.status} /></td>
                      <td className="muted">{formatDuration(call.started_at, call.ended_at, call.duration_seconds)}</td>
                      <td className="muted">{formatDate(call.created_at)}</td>
                      <td onClick={event => event.stopPropagation()}>
                        {call.status === "failed" && call.direction !== "inbound" ? (
                          <button type="button" className="bt bt-g sm" onClick={() => handleRetry(call.id)} disabled={retrying === call.id}>
                            {retrying === call.id ? "…" : "Retry"}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedCall ? <CallDetailPanel call={selectedCall} /> : (
          <aside className="card cd"><div className="empty">Select a call to see its summary and transcript.</div></aside>
        )}
      </div>
    </main>
  );
}
