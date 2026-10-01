"use client";

// The full "everything we know about this person" window. Shared by the
// prospects page and the campaign page so both always show the same details.

import React, { useEffect } from "react";
import Icon from "../ui/Icon";
import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { isValidEmail, normalizeUrl } from "../../lib/validation";
import { leadPhoto } from "../../lib/lead-photo";
import { outreachAttemptLabel } from "../../lib/outreach-status";

export const STAGE_LABELS = {
  all: "All",
  new: "New",
  queued: "Queued",
  contacted: "Contacted",
  engaged: "Engaged",
  meeting_booked: "Meeting set",
  not_interested: "Not interested",
  unsubscribed: "Unsubscribed",
};
export const STOPPED_STATUSES = new Set(["engaged", "meeting_booked", "not_interested", "unsubscribed"]);
export const STAGE_COLORS = {
  new: "#9aa8a0",
  queued: "#7c8bf0",
  contacted: "#15c4c0",
  engaged: "#00a86a",
  meeting_booked: "#00c27a",
  not_interested: "#f59e0b",
  unsubscribed: "#ef4444",
};
export const SOURCE_LABELS = { all: "All sources", apollo: "Lead database", csv: "CSV", manual: "Manual" };

export function safeExternalUrl(value) {
  try {
    return normalizeUrl(value);
  } catch {
    return "";
  }
}

export function leadName(lead) {
  return lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unnamed lead";
}

export function stageStyle(status) {
  const color = STAGE_COLORS[status] || "#9aa8a0";
  return { background: `${color}1f`, color, border: `1px solid ${color}45` };
}

export function formatNextOutreach(attempt) {
  if (!attempt) return "Not scheduled";
  if (!attempt.scheduled_at) return attempt.blocked_reason ? outreachAttemptLabel(attempt) : "Not scheduled";
  const time = new Intl.DateTimeFormat("en", { timeZone: attempt.display_timezone || undefined, month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(attempt.scheduled_at));
  return `${time} · ${outreachAttemptLabel(attempt)}`;
}

export function formatDateTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function titleCase(value) {
  if (!value) return "";
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function DetailField({ label, value, tone }) {
  const empty = value === null || value === undefined || value === "" ;
  return (
    <div className="lead-detail-field">
      <span>{label}</span>
      <strong style={empty ? { color: "var(--muted)", fontWeight: 600 } : tone ? { color: tone } : undefined}>
        {empty ? "Not available" : value}
      </strong>
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

export default function LeadDetailModal({ lead, onClose, onEnrich, enriching, onSendNow, sending }) {
  useEffect(() => {
    const onKey = event => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const name = leadName(lead);
  const photo = leadPhoto(lead);
  const status = lead.status || "new";
  const safeEmail = isValidEmail(lead.email) ? lead.email : "";
  const safeLinkedIn = safeExternalUrl(lead.linkedinUrl);
  const phoneNumbers = Array.isArray(lead.phoneNumbers) ? lead.phoneNumbers : [];
  const employment = Array.isArray(lead.employmentHistory) ? lead.employmentHistory : [];
  const geo = [lead.city, lead.state, lead.country].filter(Boolean).join(", ") || lead.location || "";
  const enrichedAt = formatDateTime(lead.lastApolloEnrichedAt);
  const contextAt = formatDateTime(lead.contextRefreshedAt);
  const canSendNow = Boolean(safeEmail) && Boolean(lead.campaignId) && status !== "contacted" && !STOPPED_STATUSES.has(status);

  // What we know vs. what is still missing, so the user can see the depth of
  // our knowledge before writing to this person.
  const knowledge = [
    { label: "Email", has: Boolean(lead.email) },
    { label: "Phone", has: Boolean(lead.phone) || phoneNumbers.length > 0 },
    { label: "Job title", has: Boolean(lead.title) },
    { label: "Company", has: Boolean(lead.company) },
    { label: "Location", has: Boolean(geo) },
    { label: "LinkedIn", has: Boolean(lead.linkedinUrl) },
    { label: "Seniority", has: Boolean(lead.seniority) },
    { label: "Work history", has: employment.length > 0 },
  ];
  const known = knowledge.filter(item => item.has).length;
  const completeness = Math.round((known / knowledge.length) * 100);

  const rawEntries = lead.rawData && typeof lead.rawData === "object"
    ? Object.entries(lead.rawData).filter(([, value]) => value !== null && value !== "" && typeof value !== "object")
    : [];

  return (
    <div className="csv-modal-backdrop lead-detail-backdrop" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} role="dialog" aria-modal="true" aria-label={`${name} details`}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="csv-modal lead-detail-modal" style={{ position: "relative", background: "#fff", borderRadius: 16, maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,.2)" }}>
        <div className="row spread lead-detail-head" style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", flex: "none", gap: 12 }}>
          <div className="row" style={{ gap: 12, minWidth: 0 }}>
            <Avatar name={name} size={44} src={photo} />
            <div className="col" style={{ minWidth: 0 }}>
              <h2 className="ellip" style={{ fontSize: 18, fontWeight: 800 }}>{name}</h2>
              <span className="faint ellip" style={{ fontSize: 12.5 }}>
                {lead.title || "No title"} · {lead.company || "No company"}
              </span>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="badge" style={stageStyle(status)}>{STAGE_LABELS[status] || status}</span>
            <button onClick={onClose} title="Close" style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", color: "var(--muted)" }}>
              <Icon name="plus" size={18} style={{ transform: "rotate(45deg)" }} />
            </button>
          </div>
        </div>

        <div className="scroll" style={{ flex: 1, padding: "18px 24px 24px", minHeight: 0 }}>
          <DetailSection
            title="What we know"
            hint={enriching ? "Enriching now..." : enrichedAt ? `Last enriched ${enrichedAt}` : "Not enriched yet"}
          >
            <div className="row" style={{ gap: 12, alignItems: "center", marginBottom: 10 }}>
              <div className="score-bar" style={{ flex: 1 }}><span style={{ width: `${completeness}%` }} /></div>
              <strong style={{ fontSize: 13 }}>{known}/{knowledge.length} fields</strong>
            </div>
            <div className="lead-detail-chips">
              {knowledge.map(item => (
                <span key={item.label} className={`chip ${item.has ? "chip-ready" : "chip-blocked"}`}>
                  {item.has ? "✓" : "—"} {item.label}
                </span>
              ))}
            </div>
            {enriching ? (
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <Spinner size={14} />
                <span className="faint" style={{ fontSize: 12.5 }}>Pulling fresh details from the lead database. This panel updates when it finishes.</span>
              </div>
            ) : null}
          </DetailSection>

          <DetailSection title="Contact">
            <div className="lead-detail-grid">
              <DetailField label="Email" value={lead.email} />
              <DetailField label="Email status" value={lead.emailStatus ? titleCase(lead.emailStatus) : null} />
              <DetailField label="Email confidence" value={lead.emailConfidence != null ? `${lead.emailConfidence}%` : null} />
              <DetailField label="Phone" value={lead.phone} />
              <DetailField label="LinkedIn" value={safeLinkedIn ? <a href={safeLinkedIn} target="_blank" rel="noreferrer">View profile</a> : null} />
            </div>
            {phoneNumbers.length ? (
              <div className="lead-detail-list">
                {phoneNumbers.map((entry, index) => (
                  <div key={index} className="row spread lead-detail-list-row">
                    <strong style={{ fontSize: 13 }}>{entry.sanitized_number || entry.raw_number || entry.number || "Unknown number"}</strong>
                    <span className="faint" style={{ fontSize: 12 }}>{titleCase(entry.type_cd || entry.type || "other")}{entry.status ? ` · ${titleCase(entry.status)}` : ""}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </DetailSection>

          <DetailSection title="Role and company">
            <div className="lead-detail-grid">
              <DetailField label="Title" value={lead.title} />
              <DetailField label="Headline" value={lead.headline} />
              <DetailField label="Company" value={lead.company} />
              <DetailField label="Seniority" value={lead.seniority ? titleCase(lead.seniority) : null} />
              <DetailField label="Department" value={lead.department ? titleCase(lead.department) : null} />
              <DetailField label="Job function" value={lead.jobFunction ? titleCase(lead.jobFunction) : null} />
              <DetailField label="Location" value={geo} />
              <DetailField label="Country" value={lead.country} />
            </div>
          </DetailSection>

          {employment.length ? (
            <DetailSection title="Work history">
              <div className="lead-detail-list">
                {employment.slice(0, 8).map((job, index) => (
                  <div key={index} className="lead-detail-list-row col" style={{ gap: 2, alignItems: "flex-start" }}>
                    <strong style={{ fontSize: 13 }}>{job.title || "Unknown role"}</strong>
                    <span className="faint" style={{ fontSize: 12 }}>
                      {[job.organization_name || job.company, [job.start_date, job.current ? "Present" : job.end_date].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                ))}
              </div>
            </DetailSection>
          ) : null}

          <DetailSection title="Outreach">
            <div className="lead-detail-grid">
              <DetailField label="Stage" value={STAGE_LABELS[status] || status} />
              <DetailField label="Score" value={lead.score ?? 0} />
              <DetailField label="Source" value={SOURCE_LABELS[lead.source] || titleCase(lead.source)} />
              <DetailField label="Campaign" value={lead.campaignId ? "Attached" : null} />
              <DetailField label="Qualification" value={lead.qualificationStatus ? titleCase(lead.qualificationStatus) : null} />
              <DetailField label="Rejection reason" value={lead.rejectionReason ? titleCase(lead.rejectionReason) : null} />
              <DetailField label="Next outreach" value={formatNextOutreach(lead.nextOutreach)} />
              <DetailField label="Added" value={formatDateTime(lead.createdAt)} />
            </div>
          </DetailSection>

          <DetailSection title="Contact rules">
            <div className="lead-detail-chips">
              <span className={`chip ${lead.emailUnsubscribed ? "chip-blocked" : "chip-ready"}`}>{lead.emailUnsubscribed ? "Unsubscribed" : "Subscribed"}</span>
              <span className={`chip ${lead.doNotEmail ? "chip-blocked" : "chip-ready"}`}>{lead.doNotEmail ? "Do not email" : "Email allowed"}</span>
              <span className={`chip ${lead.doNotCall ? "chip-blocked" : "chip-ready"}`}>{lead.doNotCall ? "Do not call" : "Calls allowed"}</span>
              {lead.dncStatus ? <span className="chip chip-blocked">DNC: {titleCase(lead.dncStatus)}</span> : null}
            </div>
          </DetailSection>

          <DetailSection title="Record" hint={contextAt ? `Context refreshed ${contextAt}` : undefined}>
            <div className="lead-detail-grid">
              <DetailField label="Lead ID" value={lead.id} />
              <DetailField label="Lead database ID" value={lead.apolloId || lead.apolloContactId} />
              <DetailField label="Account ID" value={lead.accountId} />
              <DetailField label="Last enriched" value={enrichedAt} />
            </div>
            {rawEntries.length ? (
              <details className="lead-detail-raw">
                <summary>Raw imported fields ({rawEntries.length})</summary>
                <div className="lead-detail-grid">
                  {rawEntries.map(([key, value]) => (
                    <DetailField key={key} label={titleCase(key)} value={String(value)} />
                  ))}
                </div>
              </details>
            ) : null}
          </DetailSection>
        </div>

        <div className="row lead-detail-foot" style={{ gap: 8, padding: "14px 24px", borderTop: "1px solid var(--line)", flex: "none", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            disabled={enriching}
            onClick={() => onEnrich(lead.id)}
            title="Pull the latest details from the lead database"
          >
            {enriching ? <Spinner size={13} /> : <Icon name="search" size={13} />} {enriching ? "Enriching..." : lead.email ? "Refresh details" : "Reveal email"}
          </button>
          {safeEmail ? <a className="btn btn-ghost btn-sm" href={`mailto:${safeEmail}`}><Icon name="mail" size={13} /> Email</a> : null}
          <button className="btn btn-primary btn-sm" type="button" disabled={!canSendNow || sending} onClick={() => onSendNow(lead.id)}>
            <Icon name="send" size={13} /> {sending ? "Sending..." : "Send now"}
          </button>
        </div>
      </div>
    </div>
  );
}
