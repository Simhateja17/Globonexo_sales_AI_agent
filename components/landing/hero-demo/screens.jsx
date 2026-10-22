"use client";
import React from "react";
import Icon from "../../ui/Icon";
import Avatar from "../../ui/Avatar";
import Typing from "../../ui/Typing";
import {
  LEADS, TOP_LEAD, PROSPECT_METRICS, STAGE_COLORS, STAGE_LABELS,
  CAMPAIGNS, CHANNEL_LABELS, DRAFTS,
  THREADS, OPEN_THREAD,
  WEEK, NEW_MEETING, MEETING_STATUS,
  AGENT_HISTORY, AGENT_KPIS, AGENT_QUICK, AGENT_FILE, AGENT_PROMPT, AGENT_STEPS,
  CHANNEL_STYLES, VOICE_LEADS, CALLS, CALL_STATUS, CALL_OUTCOME, OWEN_CALL, photoFor,
} from "./demoData";

// True on phones: the stage shows the app's phone layout at real size, and a
// few wide tables show only the columns that fit, like a phone user would see.
export const CompactContext = React.createContext(false);

// Static copies of the real app screens (app/(app)/*). The workspace pages use
// the GNX app design, scoped under .gx in app/(app)/app-design.css, so these
// copies use the same markup and class names and inherit the same styles.
// Everything that moves is driven by the flags object `f` from HeroDemo;
// `data-hd` marks what the cursor and camera can aim at.

// Reveals `text` a few characters at a time while `active`; shows it whole
// once `done` is set (or when the scene is jumped to its final state).
function TypeText({ text, active, done, cps = 60 }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!active || done) return undefined;
    setCount(0);
    const step = Math.max(1, Math.round(cps / 30));
    const id = setInterval(() => setCount(c => (c >= text.length ? c : c + step)), 1000 / 30);
    return () => clearInterval(id);
  }, [active, done, text, cps]);
  if (done) return text;
  if (!active) return "";
  return text.slice(0, count);
}

function stageStyle(stage) {
  const color = STAGE_COLORS[stage] || "#9aa8a0";
  return { background: `${color}1f`, color, border: 0 };
}

// A page of the app. The real pages scroll; the demo moves them with
// transforms instead, so the page itself never scrolls.
function Page({ children, className = "" }) {
  return <main className={`gx hd-gx ${className}`}>{children}</main>;
}

function readiness(lead) {
  if (lead.stage === "engaged" || lead.stage === "meeting_booked") return { label: "Stopped", cls: "pl-mute" };
  if (!lead.email) return { label: "Needs email", cls: "pl-warn" };
  return { label: "Email ready", cls: "pl-ok" };
}

/* ---------------------------------------------------------------- Prospects */

const SORTED = [...LEADS].sort((a, b) => b.score - a.score);
const FIRST_LEAD = LEADS[0];

function LeadPreview({ lead, isNew }) {
  const ready = readiness(lead);
  return (
    <aside key={lead.id} className={`card pv ${isNew ? "hd-swap-in" : ""}`} data-hd="lead-preview">
      <div className="pv-top">
        <div className="pv-id">
          <Avatar name={lead.name} size={52} src={photoFor(lead.name)} />
          <div style={{ minWidth: 0 }}>
            <b>{lead.name}</b>
            <small>{lead.title} · {lead.company}</small>
          </div>
          <span className="ibt" style={{ marginLeft: "auto" }}><Icon name="link" size={15} /></span>
        </div>
        <div className="pv-tags">
          <span className="pl" style={stageStyle(lead.stage)}>{STAGE_LABELS[lead.stage]}</span>
          <span className={`pl ${ready.cls}`}>{ready.label}</span>
          <span className="pl pl-dark">Score {lead.score}</span>
        </div>
      </div>
      <div className="pv-sec">
        <div className="pv-h">Contact</div>
        <div className="kv"><span>Email</span><b className="ellip">{lead.email}</b></div>
        <div className="kv"><span>Phone</span><b>{lead.phone}</b></div>
        <div className="kv"><span>Location</span><b>{lead.location || "San Francisco, US"}</b></div>
        <div className="kv"><span>Source</span><b>Lead database</b></div>
      </div>
      {lead.history ? (
        <div className="pv-sec">
          <div className="pv-h">Work history</div>
          <div className="tl">
            {lead.history.map(job => <div key={job.title}><i /><b>{job.title}</b><span>{job.where}</span></div>)}
          </div>
        </div>
      ) : null}
      <div className="pv-sec">
        <div className="pv-h">Next step</div>
        <div className="tl">
          <div><i /><b>{lead.next}</b><span>Attached to a campaign</span></div>
        </div>
      </div>
      <div className="pv-acts">
        <span className="bt bt-g">Full profile</span>
        <span className="bt bt-p"><Icon name="send" size={14} color="#06231a" /> Send now</span>
      </div>
    </aside>
  );
}

export function ProspectsScreen({ f }) {
  const compact = React.useContext(CompactContext);
  const bodyRef = React.useRef(null);
  const [rowH, setRowH] = React.useState(0);
  React.useLayoutEffect(() => {
    const row = bodyRef.current?.querySelector("tr");
    if (row) setRowH(row.offsetHeight);
  }, []);
  const selected = f.open ? TOP_LEAD : FIRST_LEAD;

  return (
    <Page>
      <div className="ph">
        <div>
          <h1>Prospects</h1>
          <p>Source, score, filter, and prepare leads for campaigns.</p>
        </div>
        <div className="acts">
          <span className="bt bt-g"><Icon name="doc" size={15} /> Import CSV</span>
          <span className="bt bt-g"><Icon name="plus" size={15} /> Add manually</span>
          <span className="bt bt-p"><Icon name="search" size={15} color="#06231a" /> Find new leads</span>
        </div>
      </div>

      <div className="card" style={{ padding: "16px 20px" }}>
        <div className="minis">
          {PROSPECT_METRICS.map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <span className="mini-sep" />}
              <div className="mini"><b style={m.tone === "warn" ? { color: "#c2410c" } : i === 3 ? { color: "#088256" } : undefined}>{m.value}</b><small>{m.label}</small></div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="pros-grid">
        <div className="card" style={{ overflow: "visible", position: "relative" }}>
          <div className="tools">
            <span className="inp" style={{ width: compact ? "100%" : 250 }}>
              <Icon name="search" size={15} />
              <span className="hd-ph">Search name, company, role…</span>
            </span>
            {!compact && <span className="chipf">Stage</span>}
            {!compact && <span className="chipf">Source</span>}
            <span data-hd="sort" className={`chipf hd-chip-menu ${f.sortOpen ? "is-focused" : ""}`} style={{ marginLeft: compact ? 0 : "auto", borderStyle: "solid" }}>
              {f.sorted ? "Score high to low" : "Newest first"} <Icon name="arrow" size={12} style={{ transform: "rotate(90deg)" }} />
              {f.sortOpen && (
                <span className="hd-menu">
                  <span>Newest first</span>
                  <span data-hd="sort-score" className="is-hover">Score high to low</span>
                  <span>Score low to high</span>
                </span>
              )}
            </span>
          </div>

          <div className="tbl-wrap hd-noscroll">
            <table className="tbl" style={{ tableLayout: "fixed", minWidth: compact ? 0 : 680 }}>
              {compact ? (
                <colgroup><col /><col style={{ width: 92 }} /></colgroup>
              ) : (
                <colgroup><col style={{ width: "36%" }} /><col style={{ width: "15%" }} /><col style={{ width: "16%" }} /><col style={{ width: "13%" }} /><col /></colgroup>
              )}
              <thead>
                <tr>{(compact ? ["Prospect", "Score"] : ["Prospect", "Stage", "Readiness", "Score", "Next step"]).map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody ref={bodyRef}>
                {LEADS.map((lead, domIndex) => {
                  const target = f.sorted ? SORTED.indexOf(lead) : domIndex;
                  const dy = (target - domIndex) * rowH;
                  const ready = readiness(lead);
                  const isSel = selected.id === lead.id;
                  return (
                    <tr
                      key={lead.id}
                      className={`hd-sort-row ${isSel ? "sel" : lead.score >= 80 ? "hot" : ""}`}
                      style={{ transform: dy ? `translateY(${dy}px)` : undefined }}
                      data-hd={lead.id === TOP_LEAD.id ? "lead-top" : undefined}
                      data-hd-dy={dy || undefined}
                    >
                      <td>
                        <div className="who">
                          <Avatar name={lead.name} size={34} src={photoFor(lead.name)} />
                          <div style={{ minWidth: 0 }}>
                            <b className="ellip">{lead.name}</b>
                            <small className="ellip">{lead.title} · {lead.company}</small>
                          </div>
                        </div>
                      </td>
                      {!compact && <td><span className="pl" style={stageStyle(lead.stage)}>{STAGE_LABELS[lead.stage]}</span></td>}
                      {!compact && <td><span className={`pl ${ready.cls}`}>{ready.label}</span></td>}
                      <td><div className="score"><i><u style={{ width: `${lead.score}%` }} /></i><b>{lead.score}</b></div></td>
                      {!compact && <td className="ellip">{lead.next}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tfoot"><span>Showing 1 to 11 of 1,248</span></div>
        </div>

        <LeadPreview lead={selected} isNew={Boolean(f.open)} />
      </div>
    </Page>
  );
}

/* ---------------------------------------------------------------- Campaigns */

const LIST_STATUS = {
  active: { label: "Active", cls: "pl-ok" },
  paused: { label: "Paused", cls: "pl-warn" },
  draft: { label: "Draft", cls: "pl-mute" },
  completed: { label: "Completed", cls: "pl-info" },
};

const CHANNEL_ICON_STYLES = {
  email: { background: "#e0f2fe", color: "#0369a1" },
  voice: { background: "#f3efff", color: "#6741c9" },
  both: { background: "#ecfdf3", color: "#088256" },
};

function CampaignList() {
  const compact = React.useContext(CompactContext);
  const metrics = [
    { k: "Active campaigns", v: "3", d: "of 5 in this workspace", icon: "send" },
    { k: "Enrolled leads", v: "926", d: "across all campaigns", icon: "users" },
    { k: "Messages sent", v: "4,912", d: "emails and calls", icon: "mail" },
    { k: "Meetings booked", v: "41", d: "from campaigns", icon: "calendar" },
  ];
  return (
    <Page className="campaigns-page">
      <div className="ph">
        <div>
          <h1>Campaigns</h1>
          <p>5 campaigns · 3 active · 4,912 messages sent</p>
        </div>
        <div className="acts"><span className="bt bt-p"><Icon name="plus" size={15} color="#06231a" /> New campaign</span></div>
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {metrics.map(m => (
          <div key={m.k} className="kpi">
            <div className="kpi-top">{m.k}<span className="kpi-ic"><Icon name={m.icon} size={16} /></span></div>
            <b>{m.v}</b>
            <small>{m.d}</small>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="ctools">
          <div className="seg">
            {[["All", 5], ["Active", 3], ["Paused", 1], ["Draft", 1], ["Completed", 0]].map(([label, n], i) => (
              <span key={label} className={`hd-seg-btn ${i === 0 ? "on" : ""}`}>{label} <em>{n}</em></span>
            ))}
          </div>
          <span className="inp" style={{ marginLeft: "auto", width: 300 }}>
            <Icon name="search" size={15} />
            <span className="hd-ph">Search campaigns…</span>
          </span>
        </div>
      )}

      {CAMPAIGNS.map((c, i) => {
        const s = LIST_STATUS[c.status];
        const [enrolled, ready, missing, queued, sent, meetings] = c.stats;
        const pct = Number(enrolled.replace(",", "")) ? Math.round((Number(ready.replace(",", "")) / Number(enrolled.replace(",", ""))) * 100) : 0;
        return (
          <div key={c.id} className="card cc" data-hd={i === 0 ? "camp-top" : c.channel === "voice" ? "camp-voice" : undefined}>
            <div className="cc-head" style={{ flexWrap: "wrap" }}>
              <span className="cc-ic" style={CHANNEL_ICON_STYLES[c.channel]}>
                <Icon name={c.channel === "voice" ? "phone" : "send"} size={19} />
              </span>
              <div className="cc-name">
                <b className="ellip">{c.name}</b>
                <small>{CHANNEL_LABELS[c.channel]} · Created {c.created} · {c.owner === "Unassigned" ? "Unassigned" : `Assigned to ${c.owner}`}</small>
              </div>
              <span className={`pl ${s.cls}`}><u />{s.label}</span>
              {!compact && (
                <div className="acts">
                  {c.status !== "completed" && <span className="bt bt-g sm"><Icon name={c.status === "active" ? "pause" : "play"} size={14} /> {c.status === "active" ? "Pause" : "Launch"}</span>}
                  <span className="bt bt-g sm"><Icon name="cog" size={14} /> Settings</span>
                </div>
              )}
            </div>
            <div className="cc-body">
              <div>
                <div className="cc-pt"><b>{ready} of {enrolled}</b> ready<span>{sent} sent</span></div>
                <div className="bar"><u style={{ width: `${pct}%` }} /></div>
              </div>
              <div className="cc-stats">
                {[["Enrolled", enrolled], ["Ready", ready], ["Missing email", missing], ["Queued", queued], ["Sent", sent], ["Meetings", meetings]].map(([k, v]) => (
                  <div key={k}><small>{k}</small><b>{v}</b></div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </Page>
  );
}

function ChannelBadge({ channel }) {
  const c = CHANNEL_STYLES[channel];
  return (
    <span className="pl" style={{ background: c.bg, color: c.color }}>
      {channel !== "voice" && <Icon name="mail" size={12} />}
      {channel !== "email" && <Icon name="phone" size={12} />}
      {c.label}
    </span>
  );
}

function CampaignHeader({ c, channel }) {
  return (
    <div className="ph">
      <div className="cdh" style={{ minWidth: 0 }}>
        <span className="back"><Icon name="arrowLeft" size={16} /></span>
        <div style={{ minWidth: 0 }}>
          <h1 className="ellip">{c.name}</h1>
          <div className="cdh-meta" style={{ flexWrap: "wrap" }}>
            <span className="pl pl-ok"><u />Active</span>
            <ChannelBadge channel={channel} />
            <span>Created {c.created}</span>
            <span>· Assigned to {c.owner}</span>
          </div>
        </div>
      </div>
      <div className="acts">
        <span className="bt bt-g"><Icon name="cog" size={15} /> Settings</span>
        <span className="bt bt-g"><Icon name="pause" size={15} /> Pause</span>
      </div>
    </div>
  );
}

function Mets({ items }) {
  return (
    <div className="mets">
      {items.map(([label, value]) => (
        <div key={label} className="met"><small>{label}</small><b>{value}</b></div>
      ))}
    </div>
  );
}

function Tabs({ items, on }) {
  return (
    <div>
      <div className="seg">
        {items.map(([label, n]) => (
          <span key={label} className={`hd-seg-btn ${label === on ? "on" : ""}`}>{label}{n != null ? <em>{n}</em> : null}</span>
        ))}
      </div>
    </div>
  );
}

const DRAFT_CHIP = {
  draft: { label: "Needs review", bg: "#fff7ed", color: "#9a3412" },
  approved: { label: "Approved", bg: "var(--g-50)", color: "var(--g-700)" },
};

function CampaignDetail({ f }) {
  const c = CAMPAIGNS[0];
  const pending = DRAFTS.length - (f.approvedN || 0);
  return (
    <Page>
      <div className="col hd-scroller" style={{ gap: 18, transform: f.scroll ? `translateY(${-f.scroll}px)` : undefined }} data-hd-dy={f.scroll ? -f.scroll : undefined}>
        <CampaignHeader c={c} channel="email" />
        <Mets items={[["Enrolled", "412"], ["Ready", "386"], ["Missing email", "26"], ["Queued", String(48 + (f.approvedN || 0))], ["Sent", "2,140"], ["Bounced", "0"]]} />
        <Tabs items={[["Emails"], ["Leads", 412], ["Settings"]]} on="Emails" />

        <div className="col" style={{ gap: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="row spread hd-email-head" style={{ gap: 12, alignItems: "flex-start" }}>
              <div className="col" style={{ gap: 3 }}>
                <strong style={{ fontSize: 14 }}>Generated emails · {DRAFTS.length} ready</strong>
                <span className="faint" style={{ fontSize: 12.5 }}>
                  {pending} awaiting approval, {DRAFTS.length - pending} approved, 0 sent.
                </span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <span className="btn btn-ghost btn-sm"><Icon name="bolt" size={14} /> Turn on autopilot</span>
                {pending > 0 && (
                  <span data-hd="approve-all" className={`btn btn-primary btn-sm ${f.pressApprove ? "is-pressed" : ""}`}>Approve all {DRAFTS.length}</span>
                )}
              </div>
            </div>
          </div>

          <section className="campaign-email-step">
            <div className="campaign-email-step-head">
              <span className="campaign-email-step-number">01</span>
              <span className="campaign-email-step-title">
                <strong>Step 1 · First touch</strong>
                <span className="faint">Send immediately · {DRAFTS.length} emails ready</span>
              </span>
            </div>
            <div>
              {DRAFTS.map((d, i) => {
                const approved = i < (f.approvedN || 0);
                const chip = approved ? DRAFT_CHIP.approved : DRAFT_CHIP.draft;
                const expanded = f.expanded && i === 0;
                return (
                  <div key={d.id} className="campaign-email-row" data-hd={i === 0 ? "draft-top" : undefined}>
                    <div className="campaign-email-summary">
                      <Avatar name={d.lead} src={photoFor(d.lead)} size={40} />
                      <span className="campaign-email-copy">
                        <strong>{d.subject}</strong>
                        <span className="faint campaign-email-recipient">{d.lead} at {d.company}</span>
                        <span className="faint campaign-email-preview">{d.body.replace(/\n+/g, " ")}</span>
                      </span>
                      <span className="campaign-email-state">
                        <span key={chip.label} className={`chip ${approved ? "hd-pop" : ""}`} style={{ background: chip.bg, color: chip.color, fontSize: 11, fontWeight: 700 }}>
                          {chip.label}
                        </span>
                        <span className={expanded ? "campaign-email-expand-icon is-open" : "campaign-email-expand-icon"}><Icon name="arrow" size={15} /></span>
                      </span>
                    </div>
                    <div className={`hd-collapse ${expanded ? "is-open" : ""}`}><div>
                      <div className="campaign-email-detail" data-hd={i === 0 ? "draft-body" : undefined}>
                        <div className="row spread campaign-email-meta" style={{ gap: 12 }}>
                          <div className="col" style={{ gap: 2, minWidth: 0 }}>
                            <strong style={{ fontSize: 13.5 }}>{d.lead}</strong>
                            <span className="faint" style={{ fontSize: 12 }}>{d.title} at {d.company}</span>
                            <span className="faint" style={{ fontSize: 11.5 }}>{d.email}</span>
                            <span style={{ fontSize: 11.5, color: "var(--g-700)", fontWeight: 700, marginTop: 3 }}>
                              <Icon name="clock" size={12} /> Scheduled Oct 1, 9:30 AM · your timezone
                            </span>
                          </div>
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                          <div className="col" style={{ gap: 8 }}>
                            <strong style={{ fontSize: 13.5 }}>{d.subject}</strong>
                            <p style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--ink-2)", margin: 0 }}>{d.body}</p>
                          </div>
                        </div>
                        <div className="row spread campaign-email-actions" style={{ gap: 8 }}>
                          <div className="row" style={{ gap: 8 }}>
                            <span className="btn btn-ghost btn-sm"><Icon name="doc" size={14} /> Edit</span>
                            <span className="btn btn-ghost btn-sm"><Icon name="refresh" size={14} /> Regenerate</span>
                          </div>
                          {!approved && <span className="btn btn-primary btn-sm">Approve</span>}
                        </div>
                      </div>
                    </div></div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
}

const LEAD_STATUS = {
  new: ["New", "#9aa8a0"],
  queued: ["Queued", "#7c8bf0"],
  contacted: ["Contacted", "#15c4c0"],
  meeting_booked: ["Meeting set", "#00c27a"],
};

// The voice campaign's Leads tab, with the real "Call immediately" button.
function VoiceCampaignDetail({ f }) {
  const compact = React.useContext(CompactContext);
  const c = CAMPAIGNS.find(item => item.channel === "voice");
  return (
    <Page>
      <CampaignHeader c={c} channel="voice" />
      <Mets items={[["Enrolled", "150"], ["Ready", "142"], ["Missing email", "0"], ["Queued", "20"], ["Sent", "248"], ["Bounced", "0"]]} />
      <Tabs items={[["Leads", 150], ["Settings"]]} on="Leads" />

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-h">
          <div>
            <b>Campaign leads</b>
            <small>150 leads attached to this campaign.</small>
          </div>
        </div>
        <div className="tbl-wrap hd-noscroll">
          <table className="tbl" style={compact ? { width: "100%", minWidth: 0, tableLayout: "fixed" } : { minWidth: 980, tableLayout: "fixed" }}>
            {compact ? <colgroup><col /><col style={{ width: 150 }} /></colgroup> : (
              <colgroup>{["30%", "16%", "12%", "18%", "14%", "10%"].map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
            )}
            <thead>
              <tr>{(compact ? ["Lead", "Action"] : ["Lead", "Phone", "Status", "Next outreach", "Action", "Location"]).map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {VOICE_LEADS.map((lead, i) => {
                const [label, color] = LEAD_STATUS[lead.status];
                const calling = i === 0 && f.calling;
                return (
                  <tr key={lead.id}>
                    <td>
                      <div className="who">
                        <Avatar name={lead.name} src={photoFor(lead.name)} size={34} />
                        <div style={{ minWidth: 0 }}>
                          <b className="ellip">{lead.name}</b>
                          <small className="ellip">{lead.title} · {lead.company}</small>
                        </div>
                      </div>
                    </td>
                    {!compact && <td><span style={{ fontWeight: 700, fontSize: 13 }}>{lead.phone}</span></td>}
                    {!compact && <td><span className="pl" style={{ background: `${color}1f`, color }}>{label}</span></td>}
                    {!compact && <td>
                      {lead.nextNote ? (
                        <div className="col" style={{ gap: 2 }}>
                          <strong style={{ fontSize: 12.5 }}>{lead.next}</strong>
                          <span className="faint ellip" style={{ fontSize: 11.5 }}>{lead.nextNote}</span>
                        </div>
                      ) : <span className="faint" style={{ fontSize: 12 }}>Not scheduled</span>}
                    </td>}
                    <td>
                      <span
                        data-hd={i === 0 ? "call-now" : undefined}
                        className={`bt bt-g sm ${i === 0 && f.pressCall ? "is-pressed" : ""} ${calling ? "hd-calling" : ""}`}
                        style={{ opacity: lead.status === "meeting_booked" || (f.calling && i > 0) ? 0.5 : 1 }}
                      >
                        <Icon name="phone" size={13} /> {calling ? "Calling..." : "Call immediately"}
                      </span>
                    </td>
                    {!compact && <td><span className="faint" style={{ fontSize: 13 }}>{lead.location}</span></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {f.toast && (
        <div className="row hd-toast hd-pop">
          <Icon name="checkCircle" size={15} color="var(--g-300)" /> Calling this lead now.
        </div>
      )}
    </Page>
  );
}

export function CampaignsScreen({ f }) {
  if (f.view === "voice") return <div key="voice" className="hd-swap"><VoiceCampaignDetail f={f} /></div>;
  return f.view === "detail"
    ? <div key="detail" className="hd-swap"><CampaignDetail f={f} /></div>
    : <div key="list" className="hd-swap"><CampaignList /></div>;
}

/* ------------------------------------------------------------- Call History */

function CallStatusBadge({ status }) {
  const s = CALL_STATUS[status];
  return (
    <span className="pl" style={{ background: s.bg, color: s.color }}>
      <u className={status === "in_progress" ? "hd-live-dot" : undefined} style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

function CallOutcome({ outcome, status }) {
  if (!outcome) {
    return status === "completed"
      ? <span className="pl pl-mute">Analyzing…</span>
      : <span className="muted" style={{ fontSize: 12 }}>Not available</span>;
  }
  const d = CALL_OUTCOME[outcome];
  return <span className="pl hd-pop" style={{ background: d.bg, color: d.color }}>{d.label}</span>;
}

function owenState(f) {
  return {
    status: f.done ? "completed" : "in_progress",
    outcome: f.outcome ? "meeting_booked" : null,
  };
}

function formatClock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// The real call detail panel, beside the table. `lines` reveals the
// transcript one line at a time while the recording plays.
function CallPanel({ f }) {
  const call = CALLS[0];
  const lines = f.lines || 0;
  const total = OWEN_CALL.transcript.length;
  const scroll = f.callScroll || 0;
  return (
    <aside className="card cd hd-panel-in" data-hd="call-panel">
      <div className="hd-scroller" style={{ transform: scroll ? `translateY(${-scroll}px)` : undefined }} data-hd-dy={scroll ? -scroll : undefined}>
        <div className="cd-h">
          <Avatar name={call.name} src={photoFor(call.name)} size={40} />
          <div style={{ minWidth: 0 }}>
            <b className="ellip">{call.name}</b>
            <small className="ellip">{call.company} · {call.campaign}</small>
          </div>
          <CallOutcome outcome="meeting_booked" status="completed" />
        </div>
        <div className="rec">
          <div className="hd-audio">
            <span className="hd-audio-play"><Icon name={lines > 0 && lines < total ? "pause" : "play"} size={14} /></span>
            <span className="hd-audio-time">{formatClock(Math.round((lines / total) * 167))} / 2:47</span>
            <span className="hd-audio-track"><span style={{ width: `${(lines / total) * 100}%` }} /></span>
          </div>
        </div>
        <div className="cd-sec" data-hd="call-summary">
          <small>Summary</small>
          <p>{OWEN_CALL.summary}</p>
        </div>
        <div className="cd-sec">
          <small>Sales analysis</small>
          <div className="g2k">
            {OWEN_CALL.analysis.map(([label, value]) => <div key={label}><small>{label}</small><b>{value}</b></div>)}
          </div>
        </div>
        <div className="cd-sec" data-hd="call-transcript">
          <small>Transcript</small>
          <div className="hd-transcript">
            {OWEN_CALL.transcript.map(([who, text], i) => (
              <div key={i} className={`hd-transcript-line ${i < lines ? "is-shown" : ""} ${who === "Agent" ? "is-agent" : ""}`}>
                <strong>{who}:</strong> {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function CallsScreen({ f }) {
  const compact = React.useContext(CompactContext);
  const owen = owenState(f);
  const completed = CALLS.filter(c => c.status === "completed").length + (f.done ? 1 : 0);
  return (
    <Page>
      <div className="ph">
        <div>
          <h1>Call History</h1>
          <p>Inbound and outbound outcomes. Privacy-protected inbound calls do not retain transcripts or recordings.</p>
        </div>
        {!compact && (
          <div className="acts">
            <span className="sel-box" style={{ background: "#fff" }}>All phone numbers</span>
            <span className="bt bt-g"><Icon name="refresh" size={14} /> Refresh</span>
          </div>
        )}
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {[
          ["Total calls", "248", "phone"],
          ["Connected", String(160 + completed), "checkCircle", "68% connect rate"],
          ["In progress", f.done ? "0" : "1", "clock"],
          ["Not connected", "82", "alertCircle", null, true],
        ].map(([k, v, icon, d, warn]) => (
          <div key={k} className="kpi">
            <div className="kpi-top">{k}<span className={`kpi-ic ${warn ? "warn" : ""}`}><Icon name={icon} size={16} /></span></div>
            <b>{v}</b>
            {d ? <small>{d}</small> : null}
          </div>
        ))}
      </div>

      <div className="cg">
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="tools">
            <div className="seg">
              {(compact ? ["All", "Completed", "No answer"] : ["All", "Completed", "In Progress", "No answer", "Busy", "Voicemail", "Failed"]).map((label, i) => (
                <span key={label} className={`hd-seg-btn ${i === 0 ? "on" : ""}`}>{label}</span>
              ))}
            </div>
          </div>
          <div className="tbl-wrap hd-noscroll">
            <table className="tbl" style={compact ? { tableLayout: "fixed", minWidth: 0 } : undefined}>
              {compact && <colgroup><col /><col style={{ width: 120 }} /></colgroup>}
              <thead>
                <tr>{(compact ? ["Lead", "Outcome"] : ["Lead", "Campaign", "Status", "Outcome", "Duration", "Date"]).map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {CALLS.map((call, i) => {
                  const status = i === 0 ? owen.status : call.status;
                  const outcome = i === 0 ? owen.outcome : call.outcome;
                  return (
                    <tr key={call.id} className={i === 0 ? `hd-call-new ${f.open ? "sel" : ""}` : undefined} data-hd={i === 0 ? "call-owen" : undefined}>
                      <td>
                        <div className="who">
                          <Avatar name={call.name} src={photoFor(call.name)} size={32} />
                          <div style={{ minWidth: 0 }}>
                            <b className="ellip">{call.name}</b>
                            <small className="ellip"><Icon name="arrow" size={11} style={{ transform: "rotate(-45deg)" }} /> Outbound · from {call.from}</small>
                          </div>
                        </div>
                      </td>
                      {!compact && <td className="muted">{call.campaign}</td>}
                      {!compact && <td><CallStatusBadge status={status} /></td>}
                      <td><CallOutcome outcome={outcome} status={status} /></td>
                      {!compact && <td className="muted">{i === 0 && !f.done ? <span className="hd-live-dot-text">Live</span> : call.duration}</td>}
                      {!compact && <td className="muted">{call.date}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {f.open ? <CallPanel f={f} /> : (
          <aside className="card cd"><div className="empty">Select a call to see its summary and transcript.</div></aside>
        )}
      </div>
    </Page>
  );
}

/* -------------------------------------------------------------------- Inbox */

function formatBody(text) {
  return text.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>);
}

export function InboxScreen({ f }) {
  const compact = React.useContext(CompactContext);
  const filter = f.filter || "all";
  const threads = filter === "replies" ? THREADS.filter(t => t.kind === "reply") : THREADS;
  const open = filter === "replies";
  const thread = THREADS[0];
  const view = compact && open ? "thread" : "list";
  const counts = { all: THREADS.length, replies: THREADS.filter(t => t.kind === "reply").length, sent: THREADS.filter(t => t.kind === "sent").length };
  return (
    <Page>
      <div className="ph">
        <div>
          <h1>Inbox</h1>
          <p>{THREADS.length} lead conversations across your campaign mailboxes.</p>
        </div>
        {!compact && <div className="acts"><span className="sel-box" style={{ background: "#fff" }}>All inboxes (2)</span></div>}
      </div>

      <div className="card ib hd-ib" data-view={view}>
        <aside className="il">
          <div className="il-h">
            <div className="seg" style={{ display: "flex" }}>
              {[["all", "All"], ["replies", "Replies"], ["sent", "Sent"], ["drafts", "Drafts"]].map(([id, label]) => (
                <span key={id} data-hd={`filter-${id}`} className={`hd-seg-btn ${filter === id ? "on" : ""}`}>
                  {label}{counts[id] ? <em>{counts[id]}</em> : null}
                </span>
              ))}
            </div>
          </div>
          <div className="hd-noscroll" style={{ flex: 1 }}>
            {threads.map(item => (
              <div key={item.id} className={`th hd-pop ${open && item.id === thread.id ? "on" : ""}`}>
                <Avatar name={item.name} src={photoFor(item.name)} size={36} />
                <div className="th-m">
                  <div className="th-top">
                    <b className="ellip">{item.kind === "reply" && item.id === thread.id && !f.sent ? <i /> : null}{item.name}</b>
                    <small>{item.time}</small>
                  </div>
                  <span className="th-s">{item.subject}</span>
                  <span className="th-p">{item.preview}</span>
                  <div style={{ marginTop: 7 }}>
                    <span className={`pl ${item.kind === "reply" ? "pl-ok" : "pl-mute"}`}>{item.kind === "reply" ? "Reply" : "Sent"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="cv hd-bottom">
          {open ? (
            <div key="thread" className="hd-thread-in col" style={{ gap: 0, flex: 1, minHeight: 0 }}>
              <div className="cv-h">
                {compact && <span className="ibt cv-back"><Icon name="arrowLeft" size={15} /></span>}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <b className="ellip" style={{ display: "block" }}>{OPEN_THREAD.subject}</b>
                  <small className="ellip">{thread.company} · via maya@northwindlabs.com</small>
                </div>
                <span className="pl pl-mute">{f.sent ? "Sent email" : "Draft pending"}</span>
              </div>
              <div className="hd-thread-body">
                <div className="msg">
                  <div className="msg-h"><span className="pl pl-mute">You sent</span><span>{OPEN_THREAD.sentAt}</span></div>
                  {formatBody(OPEN_THREAD.sentBody)}
                </div>
                <div className="msg in" data-hd="reply-in">
                  <div className="msg-h"><Avatar name={OPEN_THREAD.name} src={photoFor(OPEN_THREAD.name)} size={26} /><b>{OPEN_THREAD.name}</b><span>{OPEN_THREAD.email} · {OPEN_THREAD.replyAt}</span></div>
                  {formatBody(OPEN_THREAD.replyBody)}
                </div>
                {f.sent && (
                  <div className="msg hd-pop">
                    <div className="msg-h"><span className="pl pl-mute">You sent</span><span>Just now</span></div>
                    {formatBody(OPEN_THREAD.draft)}
                  </div>
                )}
              </div>
              {!f.sent && (
                <div className="dft" data-hd="composer">
                  <div className="dft-h">
                    <Icon name="spark" size={15} /> Your reply
                    <span>{f.typing || f.typed ? "Ready when you are" : "Write it, or ask for a draft"}</span>
                  </div>
                  <div className="dft-in hd-dft-text">
                    {f.typing || f.typed ? (
                      <>
                        <TypeText text={OPEN_THREAD.draft} active={f.typing} done={f.typed} cps={140} />
                        {!f.typed && <span className="hd-caret" />}
                      </>
                    ) : <span className="hd-placeholder">Message {OPEN_THREAD.name}</span>}
                  </div>
                  <div className="dft-f">
                    <div className="x" />
                    <span data-hd="draft-btn" className={`bt bt-g sm ${f.drafting && !f.typing ? "is-pressed" : ""}`}>
                      <Icon name="spark" size={14} /> {f.drafting && !f.typed ? "Drafting..." : "Draft with AI"}
                    </span>
                    <span data-hd="send" className={`bt bt-p sm ${f.typed ? "" : "hd-dim"}`}>
                      <Icon name="send" size={14} color="#06231a" /> Send
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty">Choose a lead on the left to open the email conversation.</div>
          )}
        </section>

        <aside className="ctx" style={{ borderLeft: "1px solid #eef3f0" }}>
          {open ? (
            <>
              <div className="ctx-id">
                <Avatar name={OPEN_THREAD.name} src={photoFor(OPEN_THREAD.name)} size={56} />
                <b>{OPEN_THREAD.name}</b>
                <small>Founder · {thread.company}</small>
                <div className="pv-tags" style={{ justifyContent: "center" }}>
                  <span className="pl pl-ok">Replied</span>
                  <span className="pl pl-dark">Score 87</span>
                </div>
              </div>
              <div className="ctx-sec">
                <small className="h">Contact</small>
                <div className="kv"><span>Email</span><b className="ellip">{OPEN_THREAD.email}</b></div>
                <div className="kv"><span>Location</span><b>Austin, US</b></div>
                <div className="kv"><span>Inbox</span><b className="ellip">maya@northwindlabs.com</b></div>
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </Page>
  );
}

/* ----------------------------------------------------------------- Calendar */

const GRID_START = 8;
const HOUR_PX = 56;
const HOURS = Array.from({ length: 11 }, (_, i) => GRID_START + i);

function parseHour(time) {
  const [, h, m, ap] = time.match(/(\d+):(\d+)\s*(AM|PM)/);
  let hour = Number(h) % 12;
  if (ap === "PM") hour += 12;
  return hour + Number(m) / 60;
}

function formatHour(hour) {
  return `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`;
}

export function CalendarScreen({ f }) {
  const compact = React.useContext(CompactContext);
  const week = WEEK.map(day => day.short === "Thu" && f.newMeeting ? { ...day, meetings: [...day.meetings, NEW_MEETING] } : day);
  const upcoming = [
    ...(f.newMeeting ? [{ ...NEW_MEETING, day: "Thu", isNew: true }] : []),
    { ...WEEK[3].meetings[0], day: "Today" },
    { ...WEEK[4].meetings[0], day: "Thu" },
    { ...WEEK[4].meetings[1], day: "Thu" },
  ].slice(0, 3);
  const count = week.reduce((n, d) => n + d.meetings.length, 0);
  return (
    <Page>
      <div className="ph">
        <div>
          <h1>Calendar</h1>
          <p>{count} meetings booked by your AI agent. It only books into your free time.</p>
        </div>
        {!compact && (
          <div className="acts">
            <span className="ibt"><Icon name="arrowLeft" size={15} /></span>
            <span className="ibt"><Icon name="arrow" size={15} /></span>
            <span className="bt bt-g sm">Today</span>
            <span className="sel-box" style={{ background: "#fff" }}>Sep 27 – Oct 3</span>
            <span className="bt bt-g"><Icon name="sliders" size={14} /> Availability</span>
          </div>
        )}
      </div>

      <div className="cal-grid">
        <div className="card wk-scroll" style={{ overflow: "hidden" }}>
          <div>
            <div className="wk-h">
              <div />
              {week.map(day => <div key={day.short} className={day.today ? "today" : ""}>{day.short}<b>{day.date}</b></div>)}
            </div>
            <div className="wk-b">
              <div className="hrs">
                {HOURS.map(hour => <div key={hour} className="hr"><span>{hour === GRID_START ? "" : formatHour(hour)}</span></div>)}
              </div>
              {week.map(day => (
                <div key={day.short} className={`dcol ${day.short === "Sun" || day.short === "Sat" ? "wk" : ""} ${day.today ? "today" : ""}`} style={{ height: HOURS.length * HOUR_PX }} data-hd={day.short === "Thu" ? "thu" : undefined}>
                  {day.meetings.map(m => {
                    const isNew = m.id === NEW_MEETING.id;
                    return (
                      <div
                        key={m.id}
                        className={`mb ${m.status === "completed" ? "done" : m.id === "m4" ? "next" : ""} ${isNew ? "hd-new-meeting" : ""}`}
                        style={{ top: (parseHour(m.time) - GRID_START) * HOUR_PX + 2 }}
                        data-hd={isNew ? "new-meeting" : undefined}
                      >
                        <b>{m.name}</b>
                        <span>{m.time.replace(":00", "")} · {m.company}</span>
                      </div>
                    );
                  })}
                  {day.today ? <div className="now" style={{ top: (11.6 - GRID_START) * HOUR_PX }}><i /></div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-h"><div><b>Coming up</b><small>Next 3 meetings</small></div></div>
            {upcoming.map(m => (
              <div key={m.id} className={`upc ${m.isNew ? "hd-pop hd-upc-new" : ""}`}>
                <div className="upc-t"><small>{m.day}</small><b>{m.time.replace(/\s?[AP]M$/i, "")}</b></div>
                <div>
                  <span className="nm">{m.name}</span>
                  <div className="co">{m.company} · 30 min</div>
                </div>
                <span className="bt bt-g sm" data-hd={m.isNew ? "join" : undefined}>Join</span>
              </div>
            ))}
          </div>
          {!compact && (
            <div className="card">
              <div className="card-h"><div><b>Availability</b><small>What your agent books against</small></div><span className="lnk">Edit</span></div>
              <div className="av-rows" style={{ padding: "6px 18px 16px" }}>
                <span className="muted" style={{ fontSize: 12, fontWeight: 800 }}>Working days</span>
                <div className="days">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => <span key={d} className={i === 0 || i === 6 ? "off" : ""}>{d}</span>)}
                </div>
                <div className="kv"><span>Hours</span><b>9:00 AM to 5:00 PM</b></div>
                <div className="kv"><span>Timezone</span><b>America/Los_Angeles</b></div>
                <div className="kv"><span>Meeting length</span><b>30 min</b></div>
                <div className="kv"><span>Meeting link</span><b className="ellip" style={{ maxWidth: 170 }}>meet.google.com/nwl-demo</b></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

/* ----------------------------------------------------------------- AI Agent */

const bubble = (isUser) => ({
  maxWidth: 480, padding: "12px 16px", fontSize: 14.5, lineHeight: 1.55,
  borderRadius: 18, fontWeight: isUser ? 600 : 500, whiteSpace: "pre-line",
  background: isUser ? "linear-gradient(180deg,var(--g-400),var(--g-500))" : "#fff",
  color: isUser ? "#06231a" : "var(--ink)",
  border: isUser ? "none" : "1px solid var(--line)",
  borderTopRightRadius: isUser ? 4 : 18, borderTopLeftRadius: isUser ? 18 : 4,
  boxShadow: isUser ? "var(--sh-green)" : "var(--sh-xs)",
});

function AgentAvatar() {
  return (
    <span style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(140deg,#29d68f,#15c4c0)", display: "grid", placeItems: "center", flex: "none", boxShadow: "0 4px 12px rgba(0,168,106,.22)" }}>
      <Icon name="spark" size={17} color="#06231a" />
    </span>
  );
}

// What the operating system shows when the paperclip is clicked. The real
// input accepts .xlsx, .xls and .csv only, so everything else is greyed out.
const PICKER_FILES = [
  { name: "Q3 board deck.pdf", size: "4.2 MB", kind: "PDF document" },
  { name: AGENT_FILE, size: "38 KB", kind: "Excel workbook", pick: true },
  { name: "pricing-notes.docx", size: "22 KB", kind: "Word document" },
  { name: "webinar-attendees.csv", size: "12 KB", kind: "CSV document", ok: true },
  { name: "team-photo.png", size: "2.8 MB", kind: "PNG image" },
];

function FilePicker({ open, selected }) {
  return (
    <div className={`hd-picker ${open ? "is-open" : ""}`}>
      <div className="hd-picker-window" data-hd="picker">
        <div className="hd-picker-bar">
          <span className="hd-picker-lights"><i /><i /><i /></span>
          <strong>Downloads</strong>
        </div>
        <div className="hd-picker-body">
          <div className="hd-picker-side">
            <span className="hd-picker-label">Favorites</span>
            {["Recents", "Desktop", "Documents", "Downloads"].map(place => (
              <span key={place} className={place === "Downloads" ? "is-active" : ""}>{place}</span>
            ))}
          </div>
          <div className="hd-picker-list">
            <div className="hd-picker-row hd-picker-head"><span>Name</span><span>Size</span><span>Kind</span></div>
            {PICKER_FILES.map(file => (
              <div
                key={file.name}
                data-hd={file.pick ? "pick-file" : undefined}
                className={`hd-picker-row ${file.pick || file.ok ? "" : "is-disabled"} ${file.pick && selected ? "is-selected" : ""}`}
              >
                <span className="row" style={{ gap: 8 }}><Icon name="doc" size={15} /> {file.name}</span>
                <span>{file.size}</span>
                <span>{file.kind}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hd-picker-foot">
          <span className="hd-picker-btn">Cancel</span>
          <span data-hd="pick-open" className={`hd-picker-btn is-primary ${selected ? "" : "is-dim"}`}>Open</span>
        </div>
      </div>
    </div>
  );
}

export function AgentScreen({ f }) {
  return (
    <div className="row agent-page" style={{ flex: 1, minHeight: 0, alignItems: "stretch", overflow: "hidden", position: "relative" }}>
      <FilePicker open={Boolean(f.pickerOpen)} selected={Boolean(f.pickerSelected)} />
      <div className="grow col agent-chat-pane" style={{ minWidth: 0 }}>
        <div className="row spread agent-chat-head" style={{ padding: "16px 24px 12px", flex: "none", borderBottom: "1px solid var(--line)" }}>
          <div className="row" style={{ gap: 12 }}>
            <span className="agent-avatar-ring" style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(140deg,#29d68f,#15c4c0)", display: "grid", placeItems: "center", flex: "none" }}>
              <Icon name="spark" size={22} color="#06231a" />
            </span>
            <div className="col">
              <div className="row" style={{ gap: 8 }}>
                <span className="display" style={{ fontSize: 18, fontWeight: 600 }}>GNX sales</span>
                <span className="chip agent-status-chip"><span className="dot" style={{ animation: "pulse-dot 1.4s infinite" }} /> Active</span>
              </div>
              <span className="faint" style={{ fontSize: 12.5 }}>Your autonomous sales agent</span>
            </div>
          </div>
        </div>

        <div className="grow agent-chat-scroll hd-noscroll hd-bottom" style={{ padding: "16px 24px", minHeight: 0 }}>
          <div className="col agent-message-list" style={{ gap: 14, maxWidth: 700, margin: "0 auto", paddingBottom: 8, width: "100%" }}>
            <div className="row" style={{ gap: 9, justifyContent: "flex-end" }}>
              <div style={bubble(true)}>Summarize hottest leads</div>
            </div>
            <div className="row" style={{ gap: 9 }}>
              <AgentAvatar />
              <div style={bubble(false)}>64 hot leads this week. Priya Raman (Loopwise) and Owen Park (Tidewell) both opened your last email twice and fit your ideal customer best.</div>
            </div>

            {f.sent && (
              <div className="row hd-pop" style={{ gap: 9, justifyContent: "flex-end" }}>
                <div style={bubble(true)}>{AGENT_PROMPT}{"\n"}📎 {AGENT_FILE}</div>
              </div>
            )}
            {f.sent && f.steps === 0 && (
              <div className="row hd-pop" style={{ gap: 9 }}>
                <AgentAvatar />
                <div className="card" style={{ padding: "10px 14px", borderTopLeftRadius: 4 }}><Typing /></div>
              </div>
            )}
            {f.steps > 0 && (
              <div className="row hd-pop" style={{ gap: 9 }}>
                <AgentAvatar />
                <div style={bubble(false)} data-hd="agent-steps">
                  <div className="col" style={{ gap: 6 }}>
                    {AGENT_STEPS.slice(0, f.steps).map(s => (
                      <span key={s} className="row hd-pop" style={{ gap: 8 }}>
                        <Icon name="checkCircle" size={16} color="var(--g-600)" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {f.approval && (
              <div className="row hd-pop" style={{ gap: 9 }}>
                <AgentAvatar />
                <div className="card" data-hd="approval" style={{ padding: 16, maxWidth: 480, borderRadius: 16, border: "1px solid var(--orange-200, #f6d2a5)" }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Approval needed</div>
                  <p className="faint" style={{ fontSize: 12.5, margin: "7px 0 10px" }}>Proceed with <strong>create campaign draft</strong> for 48 leads?</p>
                  {f.approved
                    ? <span className="chip" style={{ fontSize: 11 }}>approved</span>
                    : (
                      <div className="row" style={{ gap: 8 }}>
                        <span data-hd="proceed" className={`btn btn-primary btn-sm ${f.pressProceed ? "is-pressed" : ""}`}>Proceed</span>
                        <span className="btn btn-ghost btn-sm">Cancel</span>
                      </div>
                    )}
                </div>
              </div>
            )}
            {f.created && (
              <div className="row hd-pop" style={{ gap: 9 }}>
                <AgentAvatar />
                <div className="card" data-hd="campaign-created" style={{ padding: 16, maxWidth: 480, borderRadius: 16, border: "1px solid var(--g-200, #b9efd8)" }}>
                  <div className="row spread" style={{ gap: 10 }}>
                    <div className="row" style={{ gap: 8 }}><Icon name="target" size={16} color="var(--g-600)" /><strong style={{ fontSize: 13.5 }}>Campaign draft created</strong></div>
                    <span className="chip" style={{ fontSize: 10.5 }}>Draft</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 12 }}>Northwind leads · Q4 outreach</div>
                  <div className="faint" style={{ fontSize: 11.5, marginTop: 4 }}>email · up to 48 leads · nothing will send yet</div>
                  <span data-hd="prepare" className={`btn btn-primary btn-sm ${f.pressPrepare ? "is-pressed" : ""}`} style={{ marginTop: 12, opacity: f.preparing ? 0.7 : 1 }}>
                    <Icon name="bolt" size={13} color="#06231a" /> {f.preparing ? "Preparing…" : "Proceed with Campaign preparation"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="agent-composer" style={{ flex: "none", padding: "10px 24px 18px", borderTop: "1px solid var(--line)", background: "#fff" }}>
          <div className="row wrap agent-quick-actions" style={{ gap: 7, maxWidth: 700, margin: "0 auto 10px" }}>
            {AGENT_QUICK.map(q => (
              <span key={q} className="chip" style={{ background: "#fff", border: "1px solid var(--line)", color: "var(--ink-2)", height: 30, fontSize: 12.5 }}>
                <Icon name="bolt" size={12} color="var(--g-600)" /> {q}
              </span>
            ))}
          </div>
          {f.attached && !f.sent && (
            <div className="row hd-pop" style={{ gap: 7, maxWidth: 700, margin: "0 auto 8px" }}>
              <span className="chip" style={{ height: 30, fontSize: 12.5 }}>
                <Icon name="paperclip" size={12} color="var(--g-600)" /> {AGENT_FILE} <Icon name="close" size={12} />
              </span>
              <span className="faint" style={{ fontSize: 11.5 }}>Say what to do, e.g. &quot;add as leads&quot; or &quot;make a campaign for these&quot;.</span>
            </div>
          )}
          <div className="row agent-input-row" style={{ gap: 10, maxWidth: 700, margin: "0 auto" }}>
            <span data-hd="attach" className={`btn btn-ghost ${f.pressAttach ? "is-pressed" : ""}`} style={{ width: 50, height: 50, padding: 0, borderRadius: 14, flex: "none" }}>
              <Icon name="paperclip" size={19} />
            </span>
            <div className="input-wrap grow" data-hd="agent-input">
              <span className="lead-ico"><Icon name="spark" size={16} /></span>
              <div className={`input has-ico hd-fake-input agent-fake-input ${f.typing && !f.sent ? "is-typing" : ""}`} style={{ height: 50, color: f.typing && !f.sent ? "var(--ink)" : undefined }}>
                {f.typing && !f.sent
                  ? <><TypeText text={AGENT_PROMPT} active={f.typing} done={f.typed} cps={45} /><span className="hd-caret" /></>
                  : f.attached && !f.sent ? "What should I do with this file?" : "Ask GNX sales to prospect, draft, or follow up…"}
              </div>
            </div>
            <span data-hd="agent-send" className="btn btn-primary agent-send-btn" style={{ width: 50, height: 50, padding: 0, borderRadius: 14, flex: "none" }}>
              <Icon name="send" size={19} color="#06231a" />
            </span>
          </div>
        </div>
      </div>

      <aside className="agent-overview-panel hd-noscroll" style={{ width: 300, flex: "none", borderLeft: "1px solid var(--line)", background: "#fff", padding: 18 }}>
        <div className="card" style={{ padding: 14, borderRadius: 14, marginBottom: 18 }}>
          <div className="row spread" style={{ gap: 8 }}>
            <div className="row" style={{ gap: 7 }}>
              <Icon name="chat" size={14} color="var(--g-600)" />
              <span className="eyebrow" style={{ margin: 0 }}>Chat history</span>
            </div>
            <span className="btn btn-ghost btn-sm" style={{ padding: "4px 7px", fontSize: 11 }}><Icon name="plus" size={13} /> New</span>
          </div>
          <div className="col" style={{ gap: 4, marginTop: 10 }}>
            {AGENT_HISTORY.map((title, i) => (
              <div key={title} className="row" style={{ gap: 8, borderRadius: 8, padding: "8px 7px", background: i === 0 ? "var(--g-50)" : "transparent" }}>
                <Icon name="chat" size={13} color={i === 0 ? "var(--g-600)" : "var(--muted)"} />
                <span className="ellip" style={{ fontSize: 11.5, fontWeight: i === 0 ? 700 : 500 }}>{title}</span>
              </div>
            ))}
          </div>
        </div>
        <span className="eyebrow">Overview</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {AGENT_KPIS.map(s => (
            <div key={s.k} className="card kpi-card-accent" data-tone={s.warn ? "warn" : undefined} style={{ padding: 14, borderRadius: 14 }}>
              <span className="kpi-icon-badge" data-tone={s.warn ? "warn" : undefined}><Icon name={s.ico} size={15} /></span>
              <div className="display" style={{ fontSize: 22, marginTop: 8 }}>{s.v}</div>
              <div className="faint" style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{s.k}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
