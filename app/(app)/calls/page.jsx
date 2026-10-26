"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../../lib/api";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useRouter } from "next/navigation";
import Spinner from "../../../components/ui/Spinner";
import Avatar from "../../../components/ui/Avatar";

const DAY = 24 * 60 * 60 * 1000;

const STATUS_STYLES = {
  queued:      { label: "Queued",        cls: "pl-mute" },
  in_progress: { label: "In progress",   cls: "pl-info" },
  completed:   { label: "Completed",     cls: "pl-ok" },
  failed:      { label: "Failed",        cls: "pl-bad" },
  voicemail:   { label: "Voicemail",     cls: "pl-mute" },
  rejected:    { label: "Rejected",      cls: "pl-mute" },
  no_answer:   { label: "No answer",     cls: "pl-warn" },
  busy:        { label: "Busy",          cls: "pl-warn" },
  not_connected:{ label: "Not connected", cls: "pl-mute" },
};

const DISPOSITION_STYLES = {
  meeting_booked:  { label: "Meeting booked",  cls: "pl-dark" },
  interested:      { label: "Interested",      cls: "pl-info" },
  callback:        { label: "Callback",        cls: "pl-warn" },
  not_interested:  { label: "Not interested",  cls: "pl-mute" },
  voicemail:       { label: "Voicemail",       cls: "pl-mute" },
  no_answer:       { label: "No answer",       cls: "pl-mute" },
  busy:            { label: "Busy",            cls: "pl-mute" },
  no_connect:      { label: "Not connected",   cls: "pl-mute" },
  technical_failure:{ label: "Technical failure", cls: "pl-bad" },
};

const FILTERS = ["all", "completed", "in_progress", "no_answer", "voicemail", "busy", "failed", "rejected"];

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

function Spark({ values }) {
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 200;
    const y = 27 - (value / max) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg className="spark" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,30 ${points.join(" ")} 200,30`} fill="#00a86b" opacity=".08" />
      <polyline points={points.join(" ")} fill="none" stroke="#00a86b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function StatCard({ label, value, icon, tone, detail, series }) {
  const warn = tone === "warn";
  return (
    <div className="kpi">
      <div className="kpi-top">{label}<span className={`kpi-ic ${warn ? "warn" : ""}`}><Icon name={icon} size={16} /></span></div>
      <b>{value}</b>
      {detail ? <small>{detail}</small> : null}
      {series ? <Spark values={series} /> : null}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.queued;
  return <span className={`pl ${s.cls}`}>{s.label}</span>;
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
  return <span className={`pl ${d.cls}`}>{d.label}</span>;
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

// The list reads like a log: a time for today, then Yesterday, a weekday, and
// only older calls get a date. The detail panel keeps the full timestamp.
function formatCallWhen(value) {
  if (!value) return "Not available";
  const at = new Date(value);
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const days = Math.floor((startOfToday - new Date(at.getFullYear(), at.getMonth(), at.getDate())) / DAY);
  if (days <= 0) return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(at);
  if (days === 1) return "Yesterday";
  if (days < 7) return new Intl.DateTimeFormat("en", { weekday: "short" }).format(at);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(at);
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

function formatClock(seconds) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

// The bars are decoration (we do not have the audio's real peaks); they only
// show how far into the recording the listener is. Heights come from the call
// id so the same call always draws the same shape.
function waveBars(seed, count = 46) {
  let state = 0;
  for (const char of String(seed)) state = (state * 31 + char.charCodeAt(0)) >>> 0;
  return Array.from({ length: count }, () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return 28 + (state % 63);
  });
}

function RecordingPlayer({ call, src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(Number(call.duration_seconds) || 0);
  const bars = useMemo(() => waveBars(call.id), [call.id]);
  const progress = duration > 0 ? time / duration : 0;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  };
  const seek = event => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const box = event.currentTarget.getBoundingClientRect();
    audio.currentTime = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)) * duration;
    setTime(audio.currentTime);
  };

  return (
    <div className="rec">
      <button type="button" className="play" onClick={toggle} aria-label={playing ? "Pause recording" : "Play recording"}>
        <Icon name={playing ? "pause" : "play"} size={15} />
      </button>
      <div className="wv" onClick={seek} role="presentation" style={{ cursor: "pointer" }}>
        {bars.map((height, index) => <i key={index} className={index / bars.length < progress ? "on" : ""} style={{ height: `${height}%` }} />)}
      </div>
      <small>{formatClock(time)} / {formatClock(duration)}</small>
      <audio
        ref={audioRef}
        preload="none"
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setTime(0); }}
        onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={event => { if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration); }}
      />
    </div>
  );
}

// Retell stores the transcript as "Agent: ..." / "User: ..." lines. Show it as
// a conversation; if it has some other shape, show it as written.
function parseTranscript(text) {
  const lines = String(text || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const turns = [];
  for (const line of lines) {
    const match = line.match(/^(agent|user|assistant|customer|caller|lead)\s*:\s*(.*)$/i);
    if (match) {
      const speaker = /^(agent|assistant)$/i.test(match[1]) ? "agent" : "user";
      turns.push({ speaker, text: match[2] });
    } else if (turns.length) {
      turns[turns.length - 1].text += ` ${line}`;
    } else {
      return null;
    }
  }
  return turns.length ? turns : null;
}

function Transcript({ text, leadFirstName }) {
  const turns = parseTranscript(text);
  if (!turns) {
    return <pre style={{ fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#2c3b33", fontFamily: "inherit", fontWeight: 600, margin: 0, maxHeight: 360, overflow: "auto" }}>{text}</pre>;
  }
  return (
    <div style={{ maxHeight: 420, overflow: "auto" }}>
      {turns.map((turn, index) => (
        <div key={index} className={`ln${turn.speaker === "user" ? " u" : ""}`}>
          <b>{turn.speaker === "agent" ? "Agent" : (leadFirstName || "Lead")}</b>
          <span>{turn.text}</span>
        </div>
      ))}
    </div>
  );
}

function CallDetailPanel({ call, onClose, onRetry, retrying }) {
  const analysis = call.retell_analysis_data && typeof call.retell_analysis_data === "object"
    ? call.retell_analysis_data
    : {};
  const analysisEntries = Object.entries(analysis).filter(([, value]) => value !== null && value !== undefined && value !== "");
  const inbound = call.direction === "inbound";
  const hasRecording = !inbound && (call.recording_url || call.recording_multi_channel_url);

  return (
    <aside className="card cd">
      <div className="cd-h">
        <Avatar name={leadName(call.leads)} size={42} />
        <div style={{ minWidth: 0 }}>
          <b className="ellip">{[leadName(call.leads), call.leads?.company].filter(Boolean).join(" · ") || (inbound ? call.from_number : call.to_number)}</b>
          <small className="ellip">{[inbound ? "Inbound" : "Outbound", call.campaigns?.name, formatDuration(call.started_at, call.ended_at, call.duration_seconds)].filter(Boolean).join(" · ")}</small>
        </div>
        {call.status === "failed" && !inbound ? (
          <button type="button" className="bt bt-g sm" onClick={() => onRetry(call.id)} disabled={retrying === call.id}>{retrying === call.id ? "…" : "Retry"}</button>
        ) : <DispositionBadge disposition={call.disposition} status={call.status} />}
        <button type="button" className="ibt" aria-label="Close call details" onClick={onClose}><Icon name="close" size={15} /></button>
      </div>

      {hasRecording && <RecordingPlayer key={call.id} call={call} src={call.recording_multi_channel_url || call.recording_url} />}

      {call.call_summary && (
        <div className="cd-sec">
          <small>Call summary</small>
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
          <Transcript text={call.transcript} leadFirstName={call.leads?.first_name || leadName(call.leads).split(" ")[0]} />
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

function callSeconds(call) {
  const explicit = Number(call.duration_seconds);
  if (Number.isFinite(explicit) && call.duration_seconds !== null && call.duration_seconds !== undefined) return Math.max(0, explicit);
  if (call.started_at && call.ended_at) return Math.max(0, (new Date(call.ended_at) - new Date(call.started_at)) / 1000);
  return 0;
}

function formatAverage(seconds) {
  if (!seconds) return "0s";
  const total = Math.round(seconds);
  return total >= 60 ? `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, "0")}s` : `${total}s`;
}

export default function CallsPage() {
  const router = useRouter();
  const [allCalls, setAllCalls]     = useState([]);
  const [filteredCalls, setFilteredCalls] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("all");
  const [numberFilter, setNumberFilter] = useState("");
  const [numbers, setNumbers] = useState([]);
  useEffect(() => { api.get('/phone-numbers').then(({ data }) => setNumbers(data.numbers || [])).catch(() => {}); }, []);
  const [toast, setToast]           = useState("");
  const [selectedCallId, setSelectedCallId] = useState("");
  const [panelClosed, setPanelClosed] = useState(false);
  const [retrying, setRetrying]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  // The tab counts and the stat cards need every call, so the full list is
  // always loaded. A status tab asks the server for its own list as well, so a
  // long history still shows every call of that kind.
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const base = new URLSearchParams();
      if (numberFilter) base.set('phoneNumberId', numberFilter);
      const withStatus = new URLSearchParams(base);
      if (filter !== "all") withStatus.set('status', filter);
      const [{ data: everything }, statusData] = await Promise.all([
        api.get(`/calls?${base}`),
        filter === "all" ? Promise.resolve(null) : api.get(`/calls?${withStatus}`),
      ]);
      setAllCalls(Array.isArray(everything) ? everything : []);
      setFilteredCalls(statusData ? (Array.isArray(statusData.data) ? statusData.data : []) : null);
    } catch {
      setAllCalls([]);
      setFilteredCalls(null);
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

  const calls = filteredCalls ?? allCalls;

  const counts = useMemo(() => {
    const result = { all: allCalls.length };
    for (const name of FILTERS) if (name !== "all") result[name] = allCalls.filter(call => call.status === name).length;
    return result;
  }, [allCalls]);

  const stats = useMemo(() => {
    const now = Date.now();
    const inWeek = (call, weeksAgo) => {
      const at = new Date(call.created_at).getTime();
      return at <= now - weeksAgo * 7 * DAY && at > now - (weeksAgo + 1) * 7 * DAY;
    };
    const thisWeek = allCalls.filter(call => inWeek(call, 0));
    const lastWeek = allCalls.filter(call => inWeek(call, 1));
    const connected = allCalls.filter(call => call.status === "completed");
    const meetings = allCalls.filter(call => call.disposition === "meeting_booked");
    const withTime = connected.filter(call => callSeconds(call) > 0);
    const average = withTime.length ? withTime.reduce((sum, call) => sum + callSeconds(call), 0) / withTime.length : 0;
    // Seven daily points for the little trend lines, oldest first.
    const days = Array.from({ length: 7 }, (_, index) => {
      const end = now - (6 - index) * DAY;
      return allCalls.filter(call => { const at = new Date(call.created_at).getTime(); return at <= end && at > end - DAY; });
    });
    return {
      week: thisWeek.length,
      delta: thisWeek.length - lastWeek.length,
      connectRate: allCalls.length ? Math.round((connected.length / allCalls.length) * 100) : 0,
      meetings: meetings.length,
      average,
      series: {
        calls: days.map(day => day.length),
        connected: days.map(day => day.filter(call => call.status === "completed").length),
        meetings: days.map(day => day.filter(call => call.disposition === "meeting_booked").length),
        average: days.map(day => { const timed = day.filter(call => call.status === "completed" && callSeconds(call) > 0); return timed.length ? timed.reduce((sum, call) => sum + callSeconds(call), 0) / timed.length : 0; }),
      },
    };
  }, [allCalls]);

  const emptyCopy = EMPTY_STATE_COPY[filter] ?? EMPTY_STATE_COPY.all;

  const selectedCall = calls.find(call => call.id === selectedCallId) || calls[0] || null;
  const showPanel = !panelClosed && Boolean(selectedCall);
  const pickCall = id => { setSelectedCallId(id); setPanelClosed(false); };

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
          <p>Every inbound and outbound call, with outcome, summary and transcript.</p>
        </div>
        <div className="acts">
          <select className="sel-box" style={{ background: "#fff" }} aria-label="Filter by phone number" value={numberFilter} onChange={event => setNumberFilter(event.target.value)}>
            <option value="">All phone numbers{numbers.length ? ` (${numbers.length})` : ""}</option>
            {numbers.map(number => <option key={number.id} value={number.id}>{number.phone_number || number.label || "Pending number"}</option>)}
          </select>
          <button type="button" className="bt bt-g" onClick={load} disabled={loading}>
            <Icon name="refresh" size={14} /> {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <StatCard
          label="Calls this week"
          value={stats.week}
          icon="phone"
          detail={allCalls.length ? <><span className={stats.delta >= 0 ? "up" : "dn"}>{stats.delta >= 0 ? "+" : ""}{stats.delta}</span> vs last week</> : null}
          series={stats.series.calls}
        />
        <StatCard label="Connected" value={`${stats.connectRate}%`} icon="checkCircle" detail="reached a person" series={stats.series.connected} />
        <StatCard label="Meetings booked" value={stats.meetings} icon="calendar" detail="on calls" series={stats.series.meetings} />
        <StatCard label="Average call" value={formatAverage(stats.average)} icon="clock" detail="connected calls only" series={stats.series.average} />
      </div>

      <div className="seg" role="tablist" aria-label="Call status" style={{ alignSelf: "flex-start", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => { setFilter(f); setPanelClosed(false); }}>
            {FILTER_LABELS[f]}{counts[f] ? <em>{counts[f]}</em> : null}
          </button>
        ))}
      </div>

      <div className="cg" style={showPanel ? undefined : { gridTemplateColumns: "minmax(0, 1fr)" }}>
        <div className="card" style={{ overflow: "hidden", position: "relative" }}>
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
                  <tr>{["Lead", "Direction", "Status", "Outcome", "Duration", "Date"].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {calls.map(call => {
                    const inbound = call.direction === "inbound";
                    return (
                      <tr
                        key={call.id}
                        className={showPanel && selectedCall?.id === call.id ? "sel" : ""}
                        tabIndex={0}
                        aria-selected={selectedCall?.id === call.id}
                        onClick={() => pickCall(call.id)}
                        onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); pickCall(call.id); } }}
                      >
                        <td>
                          <div className="who">
                            <Avatar name={inbound && !call.leads ? "Inbound caller" : leadName(call.leads)} size={32} />
                            <div style={{ minWidth: 0 }}>
                              <b>{call.leads ? leadName(call.leads) : inbound ? "Inbound caller" : "Unknown"}</b>
                              <small>{call.leads?.company || (inbound ? call.from_number : call.to_number) || "No company"}</small>
                            </div>
                          </div>
                        </td>
                        <td className="muted">{inbound ? "Inbound" : "Outbound"}</td>
                        <td><StatusBadge status={call.status} /></td>
                        <td><DispositionBadge disposition={call.disposition} status={call.status} /></td>
                        <td>{formatDuration(call.started_at, call.ended_at, call.duration_seconds)}</td>
                        <td className="muted">{formatCallWhen(call.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showPanel ? <CallDetailPanel call={selectedCall} onClose={() => setPanelClosed(true)} onRetry={handleRetry} retrying={retrying} /> : null}
      </div>
    </main>
  );
}
