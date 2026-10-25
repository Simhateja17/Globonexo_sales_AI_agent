"use client";

/**
 * Draft review.
 *
 * This replaced the separate "skim your leads" step in the setup arc: every
 * draft shows the person it is addressed to, their title, company and address,
 * so the recipient can be verified without leaving the screen.
 *
 * Three things the design has to make unmissable. Approve all, because a first
 * campaign carries thirty drafts and approving them one at a time is not a
 * reasonable ask. The failure count, because generation is automatic - if
 * two leads produced nothing, nobody pressed a button that could have told
 * them, and a silently uncontacted lead is one the customer paid to enrich.
 *
 * And the thin-context pile, for the same reason as the failure count. These
 * are the emails autopilot refuses to send, so they are waiting on a person who
 * may well believe nothing is waiting on them. Every bulk control here counts
 * them separately and leaves them behind - "Approve all" that swept them up
 * would be the fastest way to make the hold meaningless.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../lib/api";
import Icon from "../ui/Icon";
import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { formatScheduledInTimezone } from "../../lib/campaign-display";

const STEP_LABELS = { 1: "First touch", 2: "Follow-up", 3: "Final follow-up" };

function stepLabel(stepNumber) {
  return STEP_LABELS[stepNumber] ?? `Follow-up ${stepNumber - 1}`;
}

function stepTiming(delayDays) {
  if (!Number(delayDays)) return "Send immediately";
  return `Send on Day ${delayDays}`;
}

const THIN_CHIP = { bg: "#fef9c3", color: "#854d0e" };

// An approved email with no send slot is the worst state this screen can be
// in: it looks finished and does nothing. Naming the reason in plain words is
// the difference between a customer fixing it and a customer never finding out.
const BLOCKED_REASONS = {
  timezone_required: "We could not work out a send time for this lead, so it is not scheduled yet.",
  campaign_not_active: "This campaign is not active, so nothing is scheduled yet. Launch it to start sending.",
  campaign_paused: "This campaign is paused. Resume it to schedule this email.",
  not_approved: "This email is not approved yet, so it will not send.",
  sequence_stopped: "This lead replied or opted out, so the rest of the sequence was stopped.",
  email_not_sent: "The last send attempt did not go through.",
};

function blockedMessage(reason) {
  if (!reason) return null;
  return BLOCKED_REASONS[reason] ?? "This email is not scheduled yet.";
}

function thinTitle(message) {
  return `We had ${message.contextScore ?? 0} of ${message.contextScoreMax ?? 10} optional details for this lead, so this email is deliberately short and role-based rather than padded with guesses. Autopilot will not send it. You decide whether it goes out.`;
}

// A thin draft says "needs your OK" rather than "needs review", because the two
// are different asks: autopilot can take a review off the customer's hands and
// cannot take this one.
function StatusChip({ status, approvedBy, thinContext }) {
  const styles = {
    draft: thinContext
      ? { label: "Needs your OK", ...THIN_CHIP }
      : { label: "Needs review", bg: "#fff7ed", color: "#9a3412" },
    approved: { label: approvedBy === "autopilot" ? "Approved by autopilot" : "Approved", bg: "var(--g-50)", color: "var(--g-700)" },
    queued: { label: "Queued", bg: "#eef2ff", color: "#4338ca" },
    sent: { label: "Sent", bg: "var(--bg-2)", color: "var(--muted)" },
  };
  const style = styles[status] ?? styles.draft;
  return (
    <span className="chip" style={{ background: style.bg, color: style.color, fontSize: 11, fontWeight: 700 }}>
      {style.label}
    </span>
  );
}

// Editing happens in a modal rather than inline: the inline box was cramped,
// and Regenerate sits next to Save so the customer can ask for a fresh draft
// without first closing the editor.
function EditDraftModal({ message, onClose, onSave, onRegenerate, busy }) {
  const [subject, setSubject] = useState(message.subject ?? "");
  const [body, setBody] = useState(message.body ?? "");
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const lead = message.lead ?? {};
  const dirty = subject !== (message.subject ?? "") || body !== (message.body ?? "");

  // A regenerate swaps the draft underneath us. Take the new copy into the
  // fields so the customer sees what they would be saving.
  useEffect(() => {
    setSubject(message.subject ?? "");
    setBody(message.body ?? "");
  }, [message.subject, message.body]);

  useEffect(() => {
    const onKey = event => { if (event.key === "Escape" && !pending) onClose(); };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, pending]);

  const save = async () => {
    setPending("save");
    setError("");
    const failure = await onSave(message.id, { subject, body });
    setPending(null);
    if (failure) setError(failure);
    else onClose();
  };

  const regenerate = async () => {
    setPending("regenerate");
    setError("");
    const failure = await onRegenerate(message.id);
    setPending(null);
    if (failure) setError(failure);
  };

  const locked = busy || Boolean(pending);

  return createPortal(
    <div className="csv-modal-backdrop draft-edit-backdrop" role="dialog" aria-modal="true" aria-label={`Edit email to ${lead.name || "lead"}`}>
      <div className="draft-edit-scrim" onClick={() => !pending && onClose()} />
      <div className="csv-modal draft-edit-modal">
        <div className="row spread draft-edit-head">
          <div className="row" style={{ gap: 12, minWidth: 0 }}>
            <Avatar name={lead.name || "Unnamed lead"} src={lead.photoUrl || undefined} size={40} />
            <div className="col" style={{ minWidth: 0 }}>
              <h2 className="ellip" style={{ fontSize: 17, fontWeight: 800 }}>Edit email</h2>
              <span className="faint ellip" style={{ fontSize: 12.5 }}>
                To {lead.name || "Unnamed lead"}{lead.company ? ` at ${lead.company}` : ""}{lead.email ? ` · ${lead.email}` : ""}
              </span>
            </div>
          </div>
          <button type="button" className="draft-edit-close" onClick={onClose} disabled={Boolean(pending)} title="Close">
            <Icon name="plus" size={18} style={{ transform: "rotate(45deg)" }} />
          </button>
        </div>

        <div className="scroll draft-edit-body">
          <label className="draft-edit-label" htmlFor={`draft-subject-${message.id}`}>Subject</label>
          <input
            id={`draft-subject-${message.id}`}
            className="input"
            value={subject}
            disabled={pending === "regenerate"}
            onChange={event => setSubject(event.target.value)}
            placeholder="Subject"
          />
          <label className="draft-edit-label" htmlFor={`draft-body-${message.id}`} style={{ marginTop: 14 }}>Message</label>
          <textarea
            id={`draft-body-${message.id}`}
            className="input draft-edit-textarea"
            value={body}
            disabled={pending === "regenerate"}
            onChange={event => setBody(event.target.value)}
          />
          {pending === "regenerate" && (
            <div className="row" style={{ gap: 8, marginTop: 10 }}>
              <Spinner size={14} />
              <span className="faint" style={{ fontSize: 12.5 }}>Writing a fresh version for {lead.name || "this lead"}…</span>
            </div>
          )}
          {error && <div className="draft-edit-error">{error}</div>}
        </div>

        <div className="row spread draft-edit-foot">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={locked}
            onClick={regenerate}
            title={dirty ? "Write a new version. This replaces the changes you have made here." : "Write a new version of this email."}
          >
            <Icon name="refresh" size={14} /> {pending === "regenerate" ? "Regenerating…" : "Regenerate"}
          </button>
          <div className="row" style={{ gap: 8 }}>
            <button type="button" className="btn btn-ghost btn-sm" disabled={Boolean(pending)} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary btn-sm" disabled={locked || !dirty || !body.trim()} onClick={save}>
              {pending === "save" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const EMAILS_PER_PAGE = 10;

// Row and detail share one vocabulary so the list pill and the detail pill can
// never disagree. Thin-context drafts say "Needs your OK" because autopilot
// cannot take that decision off the customer.
function statusPill(message) {
  if (message.status === "approved") {
    return { label: message.approvedBy === "autopilot" ? "Approved by autopilot" : "Approved", cls: "pl-ok" };
  }
  if (message.status === "queued") return { label: "Scheduled", cls: "pl-info" };
  if (message.status === "sent") return { label: "Sent", cls: "pl-mute" };
  return { label: message.thinContext ? "Needs your OK" : "Needs your OK", cls: "pl-warn" };
}

function factLabels(message) {
  const raw = message.verifiedFacts ?? message.facts ?? message.usedFacts;
  if (!Array.isArray(raw)) return [];
  return raw.map(fact => (typeof fact === "string" ? fact : fact?.label || fact?.text || "")).filter(Boolean);
}

function DraftListRow({ message, selected, onSelect }) {
  const lead = message.lead ?? {};
  const pill = statusPill(message);
  return (
    <button type="button" className={`dr${selected ? " on" : ""}`} onClick={() => onSelect(message.id)} aria-current={selected ? "true" : undefined}>
      <Avatar name={lead.name || "Unnamed lead"} src={lead.photoUrl || undefined} size={32} />
      <span className="dr-m">
        <b className="ellip">{lead.name || "Unnamed lead"}</b>
        <small className="ellip">{[lead.title, lead.company].filter(Boolean).join(" · ") || lead.email || "No title or company"}</small>
        <span>{message.subject || "No subject"}</span>
      </span>
      <span className={`pl ${pill.cls}`}>{pill.label}</span>
    </button>
  );
}

function DraftDetail({ message, displayTimezone, onApprove, onSendThin, onSave, onRegenerate, busy }) {
  const [editing, setEditing] = useState(false);
  const closeEditor = useCallback(() => setEditing(false), []);
  const lead = message.lead ?? {};
  const sent = message.status === "sent";
  const pill = statusPill(message);
  const scheduledAt = message.schedule?.scheduledAt;
  const selectedTime = formatScheduledInTimezone(scheduledAt, displayTimezone);
  const leadTime = message.schedule?.leadTimezone && message.schedule.leadTimezone !== displayTimezone
    ? formatScheduledInTimezone(scheduledAt, message.schedule.leadTimezone)
    : null;
  const facts = factLabels(message);
  const hasContextScore = message.contextScoreMax != null;
  const blocked = !selectedTime && !sent ? blockedMessage(message.schedule?.blockedReason) : null;

  return (
    <div className="ev">
      {editing && (
        <EditDraftModal message={message} busy={busy} onClose={closeEditor} onSave={onSave} onRegenerate={onRegenerate} />
      )}
      <div className="ev-top">
        <Avatar name={lead.name || "Unnamed lead"} src={lead.photoUrl || undefined} size={40} />
        <div>
          <b>{lead.name || "Unnamed lead"}</b>
          <small>{[[lead.title, lead.company].filter(Boolean).join(" · "), lead.email].filter(Boolean).join(" · ") || "No title or company"}</small>
        </div>
        {message.thinContext && (
          <span className="pl pl-warn" title={thinTitle(message)}>Thin context</span>
        )}
        <span className={`pl ${pill.cls}`}>{pill.label}</span>
      </div>

      {facts.length > 0 ? (
        <div className="used">
          <small>Written from these verified facts</small>
          <div className="facts">
            {facts.map(fact => (
              <span key={fact} className="fact" style={{ background: "#fff" }}><Icon name="check" size={12} />{fact}</span>
            ))}
          </div>
        </div>
      ) : hasContextScore ? (
        <div className="used">
          <small>Written from what we verified</small>
          <div className="facts">
            <span className={message.thinContext ? "fact miss" : "fact"} style={message.thinContext ? undefined : { background: "#fff" }}>
              {message.contextScore ?? 0} of {message.contextScoreMax} optional details found
            </span>
          </div>
        </div>
      ) : null}

      {message.thinContext && !sent && (
        <div className="note" style={{ background: "#fefce8", borderColor: "#fde68a", color: "#854d0e", fontWeight: 700, lineHeight: 1.5 }}>
          {thinTitle(message)}
        </div>
      )}

      <div className="mail">
        <div className="mail-sub"><span>Subject</span><b>{message.subject || "No subject"}</b></div>
        <div className="mail-body">{message.body}</div>
      </div>

      <div className="ev-foot">
        <span className="sched">
          <Icon name="clock" size={15} />
          {selectedTime
            ? `${message.schedule?.status === "sent" ? "Sent" : "Sends"} ${leadTime ? `${leadTime} their time` : `${selectedTime} your time`}${message.status === "draft" ? ", once approved" : ""}`
            : blocked
              ? `Not scheduled: ${blocked}`
              : "Scheduled once approved"}
        </span>
        {!sent && (
          <>
            <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => setEditing(true)}>
              <Icon name="edit" size={14} /> Edit
            </button>
            <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => onRegenerate(message.id)}>
              <Icon name="refresh" size={14} /> Regenerate
            </button>
            {message.status === "draft" && (
              message.thinContext ? (
                <button
                  type="button"
                  className="bt bt-p sm"
                  disabled={busy}
                  onClick={() => onSendThin([message.id])}
                  title="Send this email even though we know little about the lead. Any follow-ups to this person go with it, so you are not asked again."
                >
                  Send anyway
                </button>
              ) : (
                <button type="button" className="bt bt-p sm" disabled={busy} onClick={() => onApprove([message.id])}>
                  <Icon name="check" size={14} color="#06231a" /> Approve
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DraftReview({ campaignId, displayTimezone, onChanged, tabs = null, onSummary = null }) {
  const [messages, setMessages] = useState([]);
  const [sequenceSteps, setSequenceSteps] = useState([]);
  const [state, setState] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      const [{ data: messageData }, { data: generationData }, { data: stepData }] = await Promise.all([
        api.get(`/campaigns/${campaignId}/messages`),
        api.get(`/campaigns/${campaignId}/generation`),
        api.get(`/campaigns/${campaignId}/steps`),
      ]);
      setMessages(messageData.items ?? []);
      setSequenceSteps(stepData.items ?? []);
      setState(messageData);
      setGeneration(generationData);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load your drafts.");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => { load(); }, [load]);

  // Lead preparation is a streaming pipeline: another lead may finish after
  // the latest generation run reached a terminal state. Keep the visible
  // campaign review synchronized so each email appears while other leads are
  // still enriching or researching, without requiring a page refresh.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [load]);

  // Resolves to an error message, or null on success, so the edit modal can
  // stay open and say what went wrong instead of closing on a failed save.
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await load();
      onChanged?.();
      return null;
    } catch (err) {
      const message = err?.response?.data?.message || "That did not work. Please try again.";
      setError(message);
      return message;
    } finally {
      setBusy(false);
    }
  };

  const approve = ids => run(() => api.post(`/campaigns/${campaignId}/messages/approve-batch`, { messageIds: ids }));
  const approveAll = () => run(() => api.post(`/campaigns/${campaignId}/messages/approve-batch`, {}));
  // No ids means every thin-context email in the campaign. With ids, the server
  // also picks up the same leads' follow-ups, so one decision per person.
  const sendThin = ids => run(() => api.post(`/campaigns/${campaignId}/messages/send-thin-context`, ids ? { messageIds: ids } : {}));
  const save = (id, patch) => run(() => api.patch(`/campaigns/${campaignId}/messages/${id}`, patch));
  const regenerate = id => run(() => api.post(`/campaigns/${campaignId}/messages/${id}/regenerate`));
  const setAutopilot = enabled => run(() => api.post(`/campaigns/${campaignId}/autopilot`, { enabled }));
  const retryFailed = () => run(() => api.post(`/campaigns/${campaignId}/generation/retry`));

  const counts = state?.counts ?? { draft: 0, approved: 0, sent: 0, thinWaiting: 0 };
  const thinWaiting = counts.thinWaiting ?? 0;
  // Drafts autopilot or Approve all can still clear on the customer's behalf.
  const ordinaryDrafts = Math.max(0, counts.draft - thinWaiting);
  // "not_started" has no run behind it, so it must not read as "writing".
  const generating = generation && generation.status !== "not_started" && !generation.isTerminal;
  const generationPercent = generating && generation.totalLeads > 0
    ? Math.round(((generation.processedLeads ?? 0) / generation.totalLeads) * 100)
    : 0;
  const failedLeads = generation?.failedLeads ?? 0;
  const messageGroups = useMemo(() => {
    const stepByNumber = new Map(sequenceSteps.map(step => [Number(step.stepNumber), step]));
    const grouped = new Map();

    for (const message of messages) {
      const stepNumber = Number(message.stepNumber) || 1;
      if (!grouped.has(stepNumber)) grouped.set(stepNumber, []);
      grouped.get(stepNumber).push(message);
    }

    return [...grouped.entries()]
      .sort(([left], [right]) => left - right)
      .map(([stepNumber, stepMessages]) => ({
        step: stepByNumber.get(stepNumber) ?? { stepNumber, delayDays: stepNumber === 1 ? 0 : null, bodyPromptContext: "" },
        messages: stepMessages,
      }));
  }, [messages, sequenceSteps]);

  // The campaign page draws its progress stepper from these numbers, so it
  // never has to fetch the drafts a second time.
  useEffect(() => {
    if (!onSummary || loading) return;
    onSummary({
      total: messages.length,
      steps: messageGroups.length,
      draft: counts.draft ?? 0,
      thinWaiting,
      approved: counts.approved ?? 0,
      sent: counts.sent ?? 0,
      generating: Boolean(generating),
      autopilotEnabled: Boolean(state?.autopilotEnabled),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, messages.length, messageGroups.length, counts.draft, thinWaiting, counts.approved, counts.sent, generating, state?.autopilotEnabled]);

  if (loading) {
    return <div className="card" style={{ padding: 20 }}><span className="faint" style={{ fontSize: 13 }}>Loading your drafts…</span></div>;
  }

  const current = messageGroups.find(group => group.step.stepNumber === activeStep) ?? messageGroups[0] ?? null;
  const stepMessages = current?.messages ?? [];
  const pageCount = Math.max(1, Math.ceil(stepMessages.length / EMAILS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pageMessages = stepMessages.slice((currentPage - 1) * EMAILS_PER_PAGE, currentPage * EMAILS_PER_PAGE);
  const selected = pageMessages.find(message => message.id === selectedId) ?? pageMessages[0] ?? null;
  const displayTz = displayTimezone || selected?.schedule?.displayTimezone;

  const chooseStep = stepNumber => {
    setActiveStep(stepNumber);
    setSelectedId(null);
    setPage(1);
  };

  return (
    <div className="col" style={{ gap: 16 }} data-tour="campaign-drafts">
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {tabs}
        <div className="auto" style={{ marginLeft: "auto" }}>
          {/* The tour highlights this immediately after the first manual
              approval. Turning it on approves everything already waiting. */}
          <button
            type="button"
            className={`tog${state?.autopilotEnabled ? " on" : ""}`}
            data-tour="campaign-autopilot"
            role="switch"
            aria-checked={Boolean(state?.autopilotEnabled)}
            aria-label="Autopilot"
            disabled={busy}
            onClick={() => setAutopilot(!state?.autopilotEnabled)}
            title={
              state?.autopilotEnabled
                ? "Turn autopilot off to go back to approving each email yourself."
                : "Approve every draft waiting now, and auto-approve anything written from here on."
            }
          />
          {state?.autopilotEnabled ? "Autopilot on" : "Autopilot off"}
        </div>
        {ordinaryDrafts > 0 && (
          <button type="button" className="bt bt-p" disabled={busy} onClick={approveAll}>
            <Icon name="check" size={15} color="#06231a" /> Approve all {ordinaryDrafts}
          </button>
        )}
      </div>

      {generating && (
        <div className="note" style={{ background: "#f4fbf7", borderColor: "#d9efe3", color: "#0a5d3f" }}>
          Writing emails… {generationPercent}% ({generation.processedLeads ?? 0} of {generation.totalLeads ?? 0} leads done). They appear here as they are finished.
        </div>
      )}

      {state?.autopilotEnabled && (
        <div className="note" style={{ background: "#f4fbf7", borderColor: "#d9efe3", color: "#0a5d3f", fontWeight: 700, lineHeight: 1.5 }}>
          Autopilot is on for this campaign. New emails are approved as they are written. Safety checks still
          run on every one. An email that fails them is never saved as a draft. Emails written from thin
          context are the exception: autopilot never sends those, so they wait here for you.
        </div>
      )}

      {/* The pile has to be visible from the top of the screen. A customer who
          believes autopilot has everything in hand has no reason to scroll. */}
      {thinWaiting > 0 && (
        <div className="note" style={{ background: "#fefce8", borderColor: "#fde68a", color: "#854d0e", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span style={{ flex: "1 1 320px", lineHeight: 1.5 }}>
            <b>{thinWaiting} email{thinWaiting === 1 ? "" : "s"} need{thinWaiting === 1 ? "s" : ""} your OK.</b>{" "}
            <span style={{ fontWeight: 600 }}>
              We returned very little about these leads, so the emails are short and generic. Your agent
              will not send them on its own. Read them and send the ones that work, or narrow your targeting
              and import better-matched leads.
            </span>
          </span>
          <button
            type="button"
            className="bt bt-g sm"
            disabled={busy}
            onClick={() => sendThin(null)}
            title="Approve and schedule every thin-context email in this campaign, follow-ups included."
          >
            Send all {thinWaiting} anyway
          </button>
        </div>
      )}

      {failedLeads > 0 && (
        <div className="note" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span style={{ flex: "1 1 320px", lineHeight: 1.5 }}>
            <b>{generation.generatedMessages} written, {failedLeads} lead{failedLeads === 1 ? "" : "s"} failed.</b>{" "}
            <span style={{ fontWeight: 600 }}>{(generation.failures ?? [])[0]?.reason || "The agent could not produce a usable email for these leads."}</span>
          </span>
          <button type="button" className="bt bt-g sm" disabled={busy} onClick={retryFailed}>Retry these</button>
        </div>
      )}

      {error && <div className="note" style={{ background: "#fef3f2", borderColor: "#fecaca", color: "#b42318" }}>{error}</div>}

      {messages.length === 0 || !current ? (
        <div className="card empty">
          {generation?.status === "not_started"
            ? "Email writing hasn't started yet."
            : generating
              ? "The agent is writing your emails now. They appear here as they are finished."
              : "No emails yet. They are written automatically once your leads finish enriching."}
        </div>
      ) : (
        <div className="card split">
          <div className="dl">
            <div className="dl-h">
              <div className="steps" style={{ flexWrap: "wrap" }}>
                {messageGroups.map(({ step }) => {
                  const on = step.stepNumber === current.step.stepNumber;
                  return (
                    <button key={step.stepNumber} type="button" className={on ? "on" : ""} aria-pressed={on} onClick={() => chooseStep(step.stepNumber)}>
                      {on ? `Step ${step.stepNumber} · ${stepLabel(step.stepNumber)}` : `Step ${step.stepNumber}`}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="faint" style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, borderBottom: "1px solid #eef3f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span>{stepTiming(current.step.delayDays)} · {stepMessages.length} email{stepMessages.length === 1 ? "" : "s"} ready</span>
              {(() => {
                // Thin drafts are deliberately not in this list. Approving a step
                // is a bulk judgement about copy the agent wrote well; the thin
                // ones are the copy it could not write well.
                const draftIds = stepMessages.filter(message => message.status === "draft" && !message.thinContext).map(message => message.id);
                return draftIds.length > 0 ? (
                  <button type="button" className="lnk" disabled={busy} onClick={() => approve(draftIds)}>
                    Approve {draftIds.length} draft{draftIds.length === 1 ? "" : "s"}
                  </button>
                ) : null;
              })()}
            </div>
            {current.step.bodyPromptContext ? (
              <p className="faint" style={{ margin: 0, padding: "10px 14px", fontSize: 12, lineHeight: 1.5, fontWeight: 600, borderBottom: "1px solid #eef3f0" }}>{current.step.bodyPromptContext}</p>
            ) : null}
            {pageMessages.map(message => (
              <DraftListRow key={message.id} message={message} selected={selected?.id === message.id} onSelect={setSelectedId} />
            ))}
            {stepMessages.length > EMAILS_PER_PAGE && (
              <div className="tfoot">
                <span>{(currentPage - 1) * EMAILS_PER_PAGE + 1} to {Math.min(stepMessages.length, currentPage * EMAILS_PER_PAGE)} of {stepMessages.length}</span>
                <div className="acts">
                  <button type="button" className="bt bt-g sm" disabled={currentPage <= 1} onClick={() => { setPage(currentPage - 1); setSelectedId(null); }}>Previous</button>
                  <button type="button" className="bt bt-g sm" disabled={currentPage >= pageCount} onClick={() => { setPage(currentPage + 1); setSelectedId(null); }}>Next</button>
                </div>
              </div>
            )}
          </div>
          {selected ? (
            <DraftDetail
              key={selected.id}
              message={selected}
              displayTimezone={displayTz}
              busy={busy}
              onApprove={approve}
              onSendThin={sendThin}
              onSave={save}
              onRegenerate={regenerate}
            />
          ) : <div className="empty">Choose an email on the left to read it.</div>}
        </div>
      )}
    </div>
  );
}
