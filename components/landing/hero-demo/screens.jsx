"use client";
import React from "react";
import Icon from "../../ui/Icon";
import Avatar from "../../ui/Avatar";
import Typing from "../../ui/Typing";
import {
  LEADS, TOP_LEAD, PROSPECT_METRICS, STAGE_COLORS, STAGE_LABELS,
  CAMPAIGNS, CAMPAIGN_STATUS, CHANNEL_LABELS, DRAFTS,
  THREADS, OPEN_THREAD,
  WEEK, NEW_MEETING, MEETING_STATUS,
  AGENT_HISTORY, AGENT_KPIS, AGENT_QUICK, AGENT_FILE, AGENT_PROMPT, AGENT_STEPS,
  CHANNEL_STYLES, VOICE_LEADS, CALLS, CALL_STATUS, CALL_OUTCOME, OWEN_CALL, photoFor,
} from "./demoData";

// Static copies of the real app screens (app/(app)/*), using the same class
// names so they inherit the product's styles. Everything that moves is driven
// by the flags object `f` from HeroDemo; `data-hd` marks what the cursor and
// camera can aim at.

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
  return { background: `${color}1f`, color, border: `1px solid ${color}45` };
}

/* ---------------------------------------------------------------- Prospects */

const SORTED = [...LEADS].sort((a, b) => b.score - a.score);

export function ProspectsScreen({ f }) {
  const bodyRef = React.useRef(null);
  const [rowH, setRowH] = React.useState(0);
  React.useLayoutEffect(() => {
    const row = bodyRef.current?.querySelector("tr");
    if (row) setRowH(row.offsetHeight);
  }, []);

  return (
    <div className="col" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <div className="row spread page-toolbar">
        <div>
          <h1 className="display page-title">Prospects</h1>
          <p className="muted page-subtitle">Source, score, filter, and prepare leads for campaigns.</p>
        </div>
        <div className="row segmented-control prospects-source-tabs">
          {["Lead table", "Manual add", "Lead database search", "CSV upload"].map((label, i) => (
            <button key={label} type="button" tabIndex={-1} className={i === 0 ? "is-active" : ""}>{label}</button>
          ))}
        </div>
      </div>

      <div className="grow app-page hd-noscroll">
        <div className="col" style={{ gap: 16 }}>
          <div className="metric-grid">
            {PROSPECT_METRICS.map(m => (
              <div key={m.label} className="metric-card">
                <span className="metric-icon" data-tone={m.tone || "green"}><Icon name={m.icon} size={16} /></span>
                <div><strong>{m.value}</strong><span>{m.label}</span></div>
              </div>
            ))}
          </div>

          <div className="card table-shell prospects-table-shell">
            <div className="filter-bar">
              <div className="input-wrap filter-search">
                <span className="lead-ico"><Icon name="search" size={16} /></span>
                <div className="input has-ico hd-fake-input">Search name, company, role, email...</div>
              </div>
              <div className="input compact-select hd-fake-select">All</div>
              <div className="input compact-select hd-fake-select">All sources</div>
              <div data-hd="sort" className={`input compact-select hd-fake-select ${f.sortOpen ? "is-focused" : ""}`}>
                {f.sorted ? "Score high-low" : "Newest first"}
                {f.sortOpen && (
                  <div className="hd-menu">
                    <span>Newest first</span>
                    <span data-hd="sort-score" className="is-hover">Score high-low</span>
                    <span>Score low-high</span>
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-sm" type="button" tabIndex={-1}>
                <Icon name="plus" size={15} color="#06231a" /> Add manually
              </button>
            </div>

            <div className="table-scroll hd-noscroll">
              <table className="data-table prospects-table">
                <colgroup>
                  <col className="prospect-col" /><col className="email-col" /><col className="email-col" />
                  <col className="stage-col" /><col className="ready-col" /><col className="score-col" />
                  <col className="location-col" /><col style={{ width: "7%" }} />
                </colgroup>
                <thead>
                  <tr>{["Prospect", "Email", "Phone", "Stage", "Readiness", "Score", "Next outreach", ""].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody ref={bodyRef}>
                  {LEADS.map((lead, domIndex) => {
                    const target = f.sorted ? SORTED.indexOf(lead) : domIndex;
                    const dy = (target - domIndex) * rowH;
                    const stopped = lead.stage === "engaged" || lead.stage === "meeting_booked";
                    return (
                      <tr
                        key={lead.id}
                        className={`data-row hd-sort-row ${f.open && lead.id === TOP_LEAD.id ? "is-pressed" : ""}`}
                        style={{ transform: dy ? `translateY(${dy}px)` : undefined }}
                        data-hd={lead.id === TOP_LEAD.id ? "lead-top" : undefined}
                        data-hd-dy={dy || undefined}
                      >
                        <td>
                          <div className="row" style={{ gap: 11, minWidth: 0 }}>
                            <Avatar name={lead.name} src={photoFor(lead.name)} size={34} />
                            <div className="col" style={{ minWidth: 0 }}>
                              <span style={{ fontWeight: 800, fontSize: 14 }} className="ellip">{lead.name}</span>
                              <span className="faint ellip" style={{ fontSize: 12 }}>{lead.title} · {lead.company}</span>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ fontWeight: 700, fontSize: 13 }}>{lead.email}</span></td>
                        <td><span style={{ fontWeight: 700, fontSize: 13 }}>{lead.phone}</span></td>
                        <td><span className="badge" style={stageStyle(lead.stage)}>{STAGE_LABELS[lead.stage]}</span></td>
                        <td><span className={`chip ${stopped ? "chip-blocked" : "chip-ready"}`}>{stopped ? "Stopped" : "Email ready"}</span></td>
                        <td>
                          <div className="row" style={{ gap: 8, minWidth: 86 }}>
                            <div className="score-bar"><span style={{ width: `${lead.score}%` }} /></div>
                            <strong style={{ fontSize: 13 }}>{lead.score}</strong>
                          </div>
                        </td>
                        <td><span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>{lead.next}</span></td>
                        <td>
                          <div className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                            <span className="icon-btn"><Icon name="mail" size={14} /></span>
                            <span className="icon-btn"><Icon name="link" size={14} /></span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="lead-detail-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DetailSection({ title, hint, children }) {
  return (
    <section className="lead-detail-section">
      <div className="lead-detail-section-head">
        <h3>{title}</h3>
        {hint ? <span className="faint" style={{ fontSize: 12 }}>{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

// Rendered over the whole stage, like the real modal is over the whole app.
export function LeadModal({ open }) {
  const lead = TOP_LEAD;
  const knowledge = ["Email", "Phone", "Job title", "Company", "Location", "LinkedIn", "Seniority", "Work history"];
  return (
    <div className={`hd-modal ${open ? "is-open" : ""}`} aria-hidden="true">
      <div className="hd-modal-backdrop" />
      <div className="csv-modal lead-detail-modal hd-modal-card" data-hd="lead-modal">
        <div className="row spread lead-detail-head" style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", flex: "none", gap: 12 }}>
          <div className="row" style={{ gap: 12, minWidth: 0 }}>
            <Avatar name={lead.name} src={photoFor(lead.name)} size={44} />
            <div className="col" style={{ minWidth: 0 }}>
              <h2 className="ellip" style={{ fontSize: 18, fontWeight: 800 }}>{lead.name}</h2>
              <span className="faint ellip" style={{ fontSize: 12.5 }}>{lead.title} · {lead.company}</span>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="badge" style={stageStyle(lead.stage)}>{STAGE_LABELS[lead.stage]}</span>
            <span data-hd="modal-close" style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", color: "var(--muted)" }}>
              <Icon name="plus" size={18} style={{ transform: "rotate(45deg)" }} />
            </span>
          </div>
        </div>
        <div style={{ flex: 1, padding: "18px 24px 24px", minHeight: 0, overflow: "hidden" }}>
          <span data-hd="lead-modal-top" className="hd-anchor" />
          <DetailSection title="What we know" hint="Last enriched Sep 30, 8:12 AM">
            <div className="row" style={{ gap: 12, alignItems: "center", marginBottom: 10 }}>
              <div className="score-bar" style={{ flex: 1 }}><span style={{ width: open ? "100%" : "0%", transition: "width .9s .35s ease" }} /></div>
              <strong style={{ fontSize: 13 }}>8/8 fields</strong>
            </div>
            <div className="lead-detail-chips">
              {knowledge.map(k => <span key={k} className="chip chip-ready">✓ {k}</span>)}
            </div>
          </DetailSection>
          <DetailSection title="Role and company">
            <div className="lead-detail-grid">
              <DetailField label="Title" value={lead.title} />
              <DetailField label="Headline" value={lead.headline} />
              <DetailField label="Company" value={lead.company} />
              <DetailField label="Seniority" value={lead.seniority} />
              <DetailField label="Department" value={lead.department} />
              <DetailField label="Location" value={lead.location} />
            </div>
          </DetailSection>
          <DetailSection title="Work history">
            <div className="lead-detail-list">
              {lead.history.map(job => (
                <div key={job.title} className="lead-detail-list-row col" style={{ gap: 2, alignItems: "flex-start" }}>
                  <strong style={{ fontSize: 13 }}>{job.title}</strong>
                  <span className="faint" style={{ fontSize: 12 }}>{job.where}</span>
                </div>
              ))}
            </div>
          </DetailSection>
          <DetailSection title="Contact">
            <div className="lead-detail-grid">
              <DetailField label="Email" value={lead.email} />
              <DetailField label="Email status" value={lead.emailStatus} />
              <DetailField label="Email confidence" value={lead.emailConfidence} />
              <DetailField label="Phone" value={lead.phone} />
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Campaigns */

function ChannelIcon({ channel }) {
  return (
    <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--g-50)", border: "1px solid var(--g-100)", display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flex: "none" }}>
      {channel === "both" ? (
        <><Icon name="send" size={15} color="var(--g-600)" /><Icon name="phone" size={15} color="var(--g-600)" /></>
      ) : (
        <Icon name={channel === "voice" ? "phone" : "send"} size={20} color="var(--g-600)" />
      )}
    </span>
  );
}

function CampaignList() {
  const metrics = [["Campaigns", "5"], ["Active", "3"], ["Enrolled leads", "926"], ["Messages sent", "4,912"]];
  return (
    <div className="col campaigns-page" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <div className="row spread campaigns-header" style={{ padding: "16px 24px", borderBottom: "1px solid var(--line)", flex: "none", background: "#fff", gap: 16 }}>
        <div>
          <h1 className="display" style={{ fontSize: 22 }}>Campaigns</h1>
          <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>5 total - 3 active - 4,912 messages sent</p>
        </div>
        <span className="btn btn-primary btn-sm"><Icon name="plus" size={15} color="#06231a" /> New campaign</span>
      </div>
      <div className="campaigns-metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--line)", flex: "none", background: "#fff" }}>
        {metrics.map(([k, v]) => (
          <div key={k} className="card campaigns-metric-card" style={{ padding: "12px 16px", borderRadius: 8 }}>
            <div className="faint" style={{ fontSize: 12, fontWeight: 800 }}>{k}</div>
            <div className="display" style={{ fontSize: 26, marginTop: 5 }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="grow campaigns-scroll hd-noscroll" style={{ padding: "16px 24px", minHeight: 0 }}>
        <div className="col" style={{ gap: 12 }}>
          {CAMPAIGNS.map((c, i) => {
            const s = CAMPAIGN_STATUS[c.status];
            return (
              <div key={c.id} className="card campaigns-card" data-hd={i === 0 ? "camp-top" : c.channel === "voice" ? "camp-voice" : undefined} style={{ padding: 18, borderRadius: 8 }}>
                <div className="row spread campaigns-card-head" style={{ gap: 16, alignItems: "flex-start" }}>
                  <div className="row" style={{ gap: 12, minWidth: 0 }}>
                    <ChannelIcon channel={c.channel} />
                    <div className="col" style={{ minWidth: 0 }}>
                      <span style={{ fontWeight: 800, fontSize: 15 }} className="ellip">{c.name}</span>
                      <span className="faint" style={{ fontSize: 12.5, marginTop: 3 }}>
                        {CHANNEL_LABELS[c.channel]} - Created {c.created} · {c.owner === "Unassigned" ? "Unassigned" : `Assigned to ${c.owner}`}
                      </span>
                    </div>
                  </div>
                  <div className="row campaigns-card-actions" style={{ gap: 8 }}>
                    <span className="badge" style={{ background: s.bg, color: s.color, height: 26 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: s.dot, flex: "none" }} />
                      {s.label}
                    </span>
                    {c.status !== "completed" && (
                      <span className="btn btn-ghost btn-sm" style={{ height: 32 }}>
                        <Icon name={c.status === "active" ? "pause" : "play"} size={14} /> {c.status === "active" ? "Pause" : "Launch"}
                      </span>
                    )}
                    <span className="btn btn-ghost btn-sm" style={{ height: 32 }}><Icon name="cog" size={14} /> Settings</span>
                  </div>
                </div>
                <div className="campaigns-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line-2)" }}>
                  {["Enrolled", "Ready", "Missing email", "Queued", "Sent", "Meetings"].map((k, j) => (
                    <div key={k} className="col">
                      <span className="faint" style={{ fontSize: 11.5, fontWeight: 800 }}>{k}</span>
                      <span style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)", marginTop: 3 }}>{c.stats[j]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
    <div className="col" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <div className="row spread page-toolbar campaign-detail-toolbar">
        <div className="row" style={{ gap: 12, minWidth: 0 }}>
          <span data-hd="camp-back" className="btn btn-ghost btn-sm" style={{ width: 40, padding: 0 }}><Icon name="arrowLeft" size={16} /></span>
          <div style={{ minWidth: 0 }}>
            <h1 className="display page-title ellip">{c.name}</h1>
            <div className="row" style={{ gap: 8, marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: "var(--g-50)", color: "var(--g-700)", fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--g-500)" }} />Active
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: "#eff6ff", color: "#1d4ed8", fontSize: 12, fontWeight: 600 }}>
                <Icon name="mail" size={12} />Email
              </span>
              <span className="faint" style={{ fontSize: 12 }}>Created {c.created}</span>
              <span className="faint" style={{ fontSize: 12 }}>Assigned to {c.owner}</span>
            </div>
          </div>
        </div>
        <span className="btn btn-ghost btn-sm">Pause</span>
      </div>

      <div className="grow app-page hd-noscroll">
        <div className="col hd-scroller" style={{ gap: 16, transform: f.scroll ? `translateY(${-f.scroll}px)` : undefined }} data-hd-dy={f.scroll ? -f.scroll : undefined}>
          <div className="metric-grid">
            {[["Enrolled", "412"], ["Ready", "386"], ["Missing email", "26"], ["Queued", String(48 + (f.approvedN || 0))], ["Sent", "2,140"]].map(([label, value]) => (
              <div key={label} className="metric-card">
                <span className="metric-icon"><Icon name={label === "Sent" ? "send" : "users"} size={16} /></span>
                <div><strong>{value}</strong><span>{label}</span></div>
              </div>
            ))}
          </div>

          <div className="segmented-control prospects-source-tabs">
            {["Emails", "Leads", "Settings"].map((label, i) => (
              <button key={label} type="button" tabIndex={-1} className={i === 0 ? "is-active" : ""}>{label}</button>
            ))}
          </div>

          <div className="col" style={{ gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <div className="row spread" style={{ gap: 12, alignItems: "flex-start" }}>
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
      </div>
    </div>
  );
}

const LEAD_STATUS = {
  new: ["New", "#9aa8a0"],
  queued: ["Queued", "#7c8bf0"],
  contacted: ["Contacted", "#15c4c0"],
  meeting_booked: ["Meeting set", "#00c27a"],
};

function badgeTone(color) {
  return { background: `${color}1f`, color, border: `1px solid ${color}45` };
}

// The voice campaign's Leads tab, with the real "Call immediately" button.
function VoiceCampaignDetail({ f }) {
  const c = CAMPAIGNS.find(item => item.channel === "voice");
  const voice = CHANNEL_STYLES.voice;
  return (
    <div className="col" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <div className="row spread page-toolbar campaign-detail-toolbar">
        <div className="row" style={{ gap: 12, minWidth: 0 }}>
          <span className="btn btn-ghost btn-sm" style={{ width: 40, padding: 0 }}><Icon name="arrowLeft" size={16} /></span>
          <div style={{ minWidth: 0 }}>
            <h1 className="display page-title ellip">{c.name}</h1>
            <div className="row" style={{ gap: 8, marginTop: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: "var(--g-50)", color: "var(--g-700)", fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--g-500)" }} />Active
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: voice.bg, color: voice.color, fontSize: 12, fontWeight: 600 }}>
                <Icon name="phone" size={12} />{voice.label}
              </span>
              <span className="faint" style={{ fontSize: 12 }}>Created {c.created}</span>
              <span className="faint" style={{ fontSize: 12 }}>Assigned to {c.owner}</span>
            </div>
          </div>
        </div>
        <span className="btn btn-ghost btn-sm">Pause</span>
      </div>

      <div className="grow app-page hd-noscroll">
        <div className="col" style={{ gap: 16 }}>
          <div className="metric-grid">
            {[["Enrolled", "150"], ["Ready", "142"], ["Queued", "20"], ["Sent", "248"]].map(([label, value]) => (
              <div key={label} className="metric-card">
                <span className="metric-icon"><Icon name={label === "Sent" ? "phone" : "users"} size={16} /></span>
                <div><strong>{value}</strong><span>{label}</span></div>
              </div>
            ))}
          </div>

          <div className="segmented-control prospects-source-tabs">
            {["Leads", "Settings"].map((label, i) => (
              <button key={label} type="button" tabIndex={-1} className={i === 0 ? "is-active" : ""}>{label}</button>
            ))}
          </div>

          <div className="card table-shell">
            <div className="filter-bar">
              <div>
                <strong style={{ fontSize: 14 }}>Campaign leads</strong>
                <p className="faint" style={{ fontSize: 12, marginTop: 2 }}>150 leads attached to this campaign.</p>
              </div>
            </div>
            <div className="table-scroll hd-noscroll">
              <table className="data-table" style={{ minWidth: 980, tableLayout: "fixed" }}>
                <colgroup>
                  {["30%", "16%", "12%", "18%", "14%", "10%"].map((w, i) => <col key={i} style={{ width: w }} />)}
                </colgroup>
                <thead>
                  <tr>{["Lead", "Phone", "Status", "Next outreach", "Action", "Location"].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {VOICE_LEADS.map((lead, i) => {
                    const [label, color] = LEAD_STATUS[lead.status];
                    const calling = i === 0 && f.calling;
                    return (
                      <tr key={lead.id} className="data-row">
                        <td>
                          <div className="row" style={{ gap: 11, minWidth: 0 }}>
                            <Avatar name={lead.name} src={photoFor(lead.name)} size={34} />
                            <div className="col" style={{ minWidth: 0 }}>
                              <span className="ellip" style={{ fontWeight: 800, fontSize: 14 }}>{lead.name}</span>
                              <span className="faint ellip" style={{ fontSize: 12 }}>{lead.title} - {lead.company}</span>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ fontWeight: 700, fontSize: 13 }}>{lead.phone}</span></td>
                        <td><span className="badge" style={badgeTone(color)}>{label}</span></td>
                        <td>
                          {lead.nextNote ? (
                            <div className="col" style={{ gap: 2 }}>
                              <strong style={{ fontSize: 12.5 }}>{lead.next}</strong>
                              <span className="faint ellip" style={{ fontSize: 11.5 }}>{lead.nextNote}</span>
                            </div>
                          ) : <span className="faint" style={{ fontSize: 12 }}>Not scheduled</span>}
                        </td>
                        <td>
                          <span
                            data-hd={i === 0 ? "call-now" : undefined}
                            className={`btn btn-ghost btn-sm ${i === 0 && f.pressCall ? "is-pressed" : ""}`}
                            style={{ height: 32, padding: "0 10px", fontSize: 12, whiteSpace: "nowrap", opacity: lead.status === "meeting_booked" || (f.calling && i > 0) ? 0.5 : 1 }}
                          >
                            <Icon name="phone" size={13} /> {calling ? "Calling..." : "Call immediately"}
                          </span>
                        </td>
                        <td><span className="faint" style={{ fontSize: 13 }}>{lead.location}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {f.toast && (
        <div className="row hd-toast hd-pop">
          <Icon name="checkCircle" size={15} color="var(--g-300)" /> Calling this lead now.
        </div>
      )}
    </div>
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
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 99, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700 }}>
      <span className={status === "in_progress" ? "hd-live-dot" : undefined} style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
}

function CallOutcome({ outcome, status }) {
  if (!outcome) {
    return <span style={{ fontSize: 11, color: "var(--faint)" }}>{status === "completed" ? "Analyzing…" : "Not available"}</span>;
  }
  const d = CALL_OUTCOME[outcome];
  return <span className="hd-pop" style={{ padding: "3px 9px", borderRadius: 99, background: d.bg, color: d.color, fontSize: 11, fontWeight: 600 }}>{d.label}</span>;
}

function owenState(f) {
  return {
    status: f.done ? "completed" : "in_progress",
    outcome: f.outcome ? "meeting_booked" : null,
  };
}

export function CallsScreen({ f }) {
  const owen = owenState(f);
  const kpis = [
    ["total calls", "248", "phone"],
    ["connected", f.done ? "172" : "171", "checkCircle"],
    ["in progress", f.done ? "0" : "1", "clock", true],
    ["not connected", "76", "alertCircle", true],
  ];
  return (
    <div className="grow app-page hd-noscroll">
      <div className="col" style={{ gap: 20 }}>
        <div className="row spread" style={{ gap: 12 }}>
          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(140deg,#29d68f,#15c4c0)", display: "grid", placeItems: "center", boxShadow: "var(--sh-green)", flex: "none" }}>
              <Icon name="phone" size={20} color="#06231a" />
            </span>
            <div>
              <h1 className="display" style={{ fontSize: 20, margin: 0 }}>Call History</h1>
              <p className="faint" style={{ fontSize: 13, marginTop: 4 }}>Inbound and outbound outcomes. Privacy-protected inbound calls do not retain transcripts or recordings.</p>
            </div>
          </div>
          <span className="btn btn-ghost btn-sm"><Icon name="refresh" size={14} /> Refresh</span>
        </div>

        <div className="calls-kpi-grid">
          {kpis.map(([label, value, icon, warn]) => (
            <div key={label} className="card kpi-card-accent" data-tone={warn ? "warn" : undefined} style={{ padding: "15px 16px", borderRadius: 14 }}>
              <div className="row spread">
                <span className="faint nw" style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</span>
                <span className="kpi-icon-badge" data-tone={warn ? "warn" : undefined}><Icon name={icon} size={15} /></span>
              </div>
              <strong className="display" style={{ display: "block", fontSize: 28, marginTop: 10, color: "var(--ink)" }}>{value}</strong>
            </div>
          ))}
        </div>

        <div className="row" style={{ gap: 8 }}>
          {["All", "Completed", "In Progress", "No answer", "Busy", "Voicemail", "Failed", "Rejected"].map((label, i) => (
            <span key={label} className="btn calls-filter-chip" style={{ height: 32, padding: "0 15px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flex: "none", border: i === 0 ? "none" : "1px solid var(--line)", background: i === 0 ? "linear-gradient(180deg,var(--g-400),var(--g-500))" : "#fff", color: i === 0 ? "#06231a" : "var(--ink-2)", boxShadow: i === 0 ? "var(--sh-green)" : "var(--sh-xs)" }}>{label}</span>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", borderRadius: 16 }}>
          <table className="calls-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Lead", "Direction", "Campaign", "Status", "Outcome", "Duration", "Date", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CALLS.map((call, i) => {
                const status = i === 0 ? owen.status : call.status;
                const outcome = i === 0 ? owen.outcome : call.outcome;
                return (
                  <tr key={call.id} className={i === 0 ? "hd-call-new" : undefined} data-hd={i === 0 ? "call-owen" : undefined} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line-2)" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <div className="row" style={{ gap: 9 }}>
                        <Avatar name={call.name} src={photoFor(call.name)} size={28} />
                        <div className="col" style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700 }}>{call.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{call.company}</div>
                          <div className="faint">From {call.from}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                      <span className="row" style={{ gap: 5 }}>
                        <Icon name="arrow" size={12} color="var(--faint)" style={{ transform: "rotate(-45deg)" }} /> outbound
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{call.campaign}</td>
                    <td style={{ padding: "12px 16px" }}><CallStatusBadge status={status} /></td>
                    <td style={{ padding: "12px 16px" }}><CallOutcome key={outcome || status} outcome={outcome} status={status} /></td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{i === 0 && !f.done ? <span className="hd-live-dot-text">Live</span> : call.duration}</td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)", whiteSpace: "nowrap" }}>{call.date}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span data-hd={i === 0 ? "call-details" : undefined} className={`btn btn-ghost btn-sm ${i === 0 && f.pressDetails ? "is-pressed" : ""}`} style={{ fontSize: 11 }}>Details</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CallDetailRow({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: 12, padding: "7px 0", borderBottom: "1px solid var(--line-2)" }}>
      <span style={{ color: "var(--muted)", fontSize: 12 }}>{label}</span>
      <span style={{ color: "var(--ink)", fontSize: 12 }}>{value}</span>
    </div>
  );
}

function formatClock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// The real CallDetailsModal, drawn over the whole stage like the lead modal.
// `lines` reveals the transcript one line at a time while the recording plays.
export function CallModal({ open, scroll = 0, lines = 0 }) {
  const call = CALLS[0];
  const total = OWEN_CALL.transcript.length;
  return (
    <div className={`hd-modal ${open ? "is-open" : ""}`} aria-hidden="true">
      <div className="hd-modal-backdrop" style={{ background: "rgba(10,23,18,0.55)" }} />
      <div className="hd-modal-card hd-call-card">
        <div className="hd-scroller" style={{ padding: 26, transform: scroll ? `translateY(${-scroll}px)` : undefined }} data-hd-dy={scroll ? -scroll : undefined}>
          <div className="row spread" style={{ marginBottom: 18 }}>
            <div className="row" style={{ gap: 12 }}>
              <Avatar name={call.name} src={photoFor(call.name)} size={38} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5 }}>{call.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{call.company}</div>
              </div>
            </div>
            <span data-hd="call-close" className="btn btn-ghost btn-sm" style={{ width: 34, height: 34, padding: 0, fontSize: 18, lineHeight: 1, borderRadius: "50%" }}>×</span>
          </div>
          <div className="row" style={{ gap: 8, marginBottom: 20 }}>
            <CallStatusBadge status="completed" />
            <CallOutcome outcome="meeting_booked" status="completed" />
            <span className="chip" style={{ fontSize: 11.5, height: 24 }}>{call.duration}</span>
          </div>

          <section data-hd="call-summary" style={{ marginBottom: 18, padding: 14, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12 }}>
            <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>Call summary</div>
            <div style={{ fontSize: 13, lineHeight: 1.55 }}>{OWEN_CALL.summary}</div>
          </section>

          <section style={{ marginBottom: 18 }}>
            {OWEN_CALL.rows.map(([label, value]) => <CallDetailRow key={label} label={label} value={value} />)}
          </section>

          <section style={{ marginBottom: 18 }}>
            <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>Sales analysis</div>
            <div style={{ borderTop: "1px solid var(--line-2)" }}>
              {OWEN_CALL.analysis.map(([label, value]) => <CallDetailRow key={label} label={label} value={value} />)}
            </div>
          </section>

          <section style={{ marginBottom: 18 }}>
            <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>Recording</div>
            <div className="hd-audio">
              <span className="hd-audio-play"><Icon name={lines > 0 && lines < total ? "pause" : "play"} size={14} /></span>
              <span className="hd-audio-time">{formatClock(Math.round((lines / total) * 167))} / 2:47</span>
              <span className="hd-audio-track"><span style={{ width: `${(lines / total) * 100}%` }} /></span>
            </div>
          </section>

          <section data-hd="call-transcript">
            <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>Transcript</div>
            <div className="hd-transcript">
              {OWEN_CALL.transcript.map(([who, text], i) => (
                <div key={i} className={`hd-transcript-line ${i < lines ? "is-shown" : ""} ${who === "Agent" ? "is-agent" : ""}`}>
                  <strong>{who}:</strong> {text}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- Inbox */

function formatBody(text) {
  return text.split("\n").map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>);
}

export function InboxScreen({ f }) {
  const list = f.filter === "replies" ? THREADS.filter(t => t.kind === "reply") : THREADS;
  const counts = { all: THREADS.length, replies: THREADS.filter(t => t.kind === "reply").length, sent: THREADS.filter(t => t.kind === "sent").length, drafts: 2 };
  const t = OPEN_THREAD;
  return (
    <div className="email-inbox-shell">
      <aside className="email-list-panel">
        <div className="input hd-fake-select">All inboxes</div>
        <div className="email-list-head">
          <div className="row spread" style={{ gap: 12 }}>
            <div>
              <h1 className="display">Emails</h1>
              <p>{THREADS.length} lead conversations</p>
            </div>
            <span className="email-count-chip">{THREADS.length}</span>
          </div>
          <div className="input-wrap email-list-search">
            <span className="lead-ico"><Icon name="search" size={15} /></span>
            <div className="input has-ico hd-fake-input">Search emails...</div>
          </div>
          <div className="email-filter-tabs">
            {[["all", "All"], ["replies", "Replies"], ["sent", "Sent"], ["drafts", "Drafts"]].map(([id, label]) => (
              <button key={id} type="button" tabIndex={-1} data-hd={`filter-${id}`} className={(f.filter || "all") === id ? "is-active" : ""}>
                {label}<span>{counts[id]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="email-thread-scroll hd-noscroll">
          {list.map((item, i) => (
            <div key={item.id} className={`email-thread-item hd-thread-in ${i === 0 ? "is-active" : ""}`}>
              <Avatar name={item.name} src={photoFor(item.name)} size={42} />
              <div className="email-thread-copy">
                <div className="row spread" style={{ gap: 8 }}>
                  <strong className="ellip">{item.name}</strong>
                  <span>{item.time}</span>
                </div>
                <p className="ellip">{item.company}</p>
                <div className="email-thread-subject ellip">{item.subject}</div>
                <div className="email-thread-preview ellip">
                  {i === 0 && f.sent ? "Happy to. For a 10-person team, GNX finds and researches…" : item.preview}
                </div>
              </div>
              <div className="email-thread-footer">
                <span className={`email-thread-status ${item.kind === "reply" ? "has-reply" : ""}`}>{item.kind === "reply" ? "Reply" : "Sent"}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="email-chat-panel">
        <header className="email-chat-head">
          <div className="row" style={{ gap: 12, minWidth: 0 }}>
            <Avatar name={t.name} src={photoFor(t.name)} size={42} />
            <div className="col" style={{ minWidth: 0 }}>
              <strong className="ellip">{t.name}</strong>
              <span className="ellip">{t.email}</span>
            </div>
          </div>
          <span className="chip">{f.sent ? "Queued" : "Draft pending"}</span>
        </header>

        <div className="email-chat-scroll hd-noscroll hd-bottom">
          <div className="email-chat-stack">
            <div className="email-chat-date">{t.sentAt}</div>
            <div className="email-chat-message is-outbound">
              <div className="email-chat-meta"><span>You sent</span><span>{t.sentAt}</span></div>
              <div className="email-chat-bubble"><h2>{t.subject}</h2><p>{formatBody(t.sentBody)}</p></div>
            </div>
            <div className="email-chat-message is-inbound" data-hd="reply-in">
              <div className="email-chat-meta"><span>{t.name} replied</span><span>{t.replyAt}</span></div>
              <div className="email-chat-bubble"><p>{t.replyBody}</p></div>
            </div>
            {f.sent && (
              <div className="email-chat-message is-outbound hd-pop">
                <div className="email-chat-meta"><span>You sent</span><span>Just now</span></div>
                <div className="email-chat-bubble"><p>{formatBody(t.draft)}</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="email-composer-wrap" data-hd="composer">
          <div className="email-nexo-row">
            <span data-hd="draft-btn" className={`email-nexo-draft-btn ${f.drafting ? "is-pressed" : ""}`}>
              <Icon name="spark" size={15} />
              {f.drafting && !f.typing ? "Drafting..." : "Ask GNX sales to draft"}
            </span>
          </div>
          <div className="email-message-composer">
            <span className="email-composer-icon-btn"><Icon name="plus" size={22} /></span>
            <div className={`email-composer-input ${f.typing && !f.sent ? "hd-composer-grow" : ""}`}>
              <div className="hd-composer-text">
                {f.typing && !f.sent
                  ? <TypeText text={t.draft} active={f.typing} done={f.typed} cps={140} />
                  : <span className="hd-placeholder">Message {t.name}</span>}
              </div>
            </div>
            <span data-hd="send" className="email-composer-send"><Icon name="send" size={18} color="#06231a" /></span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------------------------------------------------- Calendar */

function MeetingCard({ m, isNew }) {
  const s = MEETING_STATUS[m.status];
  return (
    <div className={`cal-meeting-card ${isNew ? "hd-new-meeting" : ""}`} data-hd={isNew ? "new-meeting" : undefined}>
      <div className="row spread" style={{ gap: 8, alignItems: "flex-start" }}>
        <div className="row" style={{ gap: 8, minWidth: 0 }}>
          <Avatar name={m.name} src={photoFor(m.name)} size={28} />
          <div className="col" style={{ minWidth: 0 }}>
            <span style={{ fontWeight: 800, fontSize: 13 }} className="ellip">{m.name}</span>
            <span className="muted ellip" style={{ fontSize: 11.5 }}>{m.company}</span>
          </div>
        </div>
      </div>
      <span className="badge" style={{ background: s.bg, color: s.color, fontSize: 10.5, marginTop: 8 }}>{s.label}</span>
      <div className="row spread" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-2)" }}>{m.time} · 30 min</span>
      </div>
      {m.join ? (
        <span className="row" data-hd={isNew ? "join" : undefined} style={{ gap: 4, marginTop: 8, fontSize: 12, color: "var(--g-700)", fontWeight: 700 }}>
          <Icon name="link" size={13} /> Join meeting
        </span>
      ) : null}
    </div>
  );
}

export function CalendarScreen({ f }) {
  const total = WEEK.reduce((sum, day) => sum + day.meetings.length, 0) + (f.newMeeting ? 1 : 0);
  return (
    <div className="grow app-page hd-noscroll">
      <div className="row spread page-head">
        <div>
          <h1 className="display page-title">Calendar</h1>
          <p className="muted page-subtitle">{total} meetings booked by your AI agent</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="btn btn-ghost btn-sm"><Icon name="arrowLeft" size={15} /></span>
          <span className="btn btn-ghost btn-sm">Today</span>
          <span className="btn btn-ghost btn-sm"><Icon name="arrow" size={15} /></span>
        </div>
      </div>
      <div className="cal-layout">
        <div className="cal-grid">
          {WEEK.map(day => {
            const meetings = day.short === "Thu" && f.newMeeting ? [...day.meetings, NEW_MEETING] : day.meetings;
            return (
              <div key={day.short} className="cal-day-col" data-hd={day.short === "Thu" ? "thu" : undefined}>
                <div className={`cal-day-head ${day.today ? "is-today" : ""}`}>
                  <span className="faint">{day.short}</span>
                  <strong>{day.date}</strong>
                </div>
                <div className="cal-day-body">
                  {meetings.length === 0
                    ? <span className="faint" style={{ fontSize: 11.5 }}>No meetings</span>
                    : meetings.map(m => <MeetingCard key={m.id} m={m} isNew={m.id === NEW_MEETING.id} />)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="card cal-settings-card">
          <strong style={{ fontSize: 14 }}>Availability</strong>
          <div className="col" style={{ gap: 12, marginTop: 14 }}>
            <div className="col" style={{ gap: 6 }}>
              <span className="faint" style={{ fontSize: 12, fontWeight: 800 }}>Working days</span>
              <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="cal-day-toggle hd-center" style={i > 0 && i < 6 ? { background: "var(--g-500)", color: "#06231a", borderColor: "var(--g-500)" } : { background: "var(--bg)", color: "var(--muted)" }}>{d}</span>
                ))}
              </div>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <div className="col grow" style={{ gap: 6 }}><span className="faint" style={{ fontSize: 12, fontWeight: 800 }}>Start</span><div className="input hd-fake-select">09:00</div></div>
              <div className="col grow" style={{ gap: 6 }}><span className="faint" style={{ fontSize: 12, fontWeight: 800 }}>End</span><div className="input hd-fake-select">17:00</div></div>
            </div>
            <div className="col" style={{ gap: 6 }}><span className="faint" style={{ fontSize: 12, fontWeight: 800 }}>Timezone</span><div className="input hd-fake-select">America/Los_Angeles</div></div>
            <div className="col" style={{ gap: 6 }}><span className="faint" style={{ fontSize: 12, fontWeight: 800 }}>Default meeting link</span><div className="input hd-fake-select">meet.northwindlabs.com/maya</div></div>
          </div>
        </div>
      </div>
    </div>
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
              <div className="input has-ico hd-fake-input" style={{ height: 50, color: f.typing && !f.sent ? "var(--ink)" : undefined }}>
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
