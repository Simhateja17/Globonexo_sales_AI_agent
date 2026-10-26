"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import Icon from "../ui/Icon";
import Spinner from "../ui/Spinner";
import { AI_CREDITS_EXHAUSTED, campaignSendsEmail, useLeadOutreach } from "../../lib/lead-outreach";
import { leadName } from "./LeadDetailModal";

const SUBJECT_MAX = 200;
const BODY_MAX = 10_000;

/**
 * Every "Send now" opens this. It shows the lead's first campaign email and
 * sends only that email, after it has been read. While the AI is writing it,
 * it says so and updates when the draft lands. When the AI could not write it
 * (most often: AI credits are used up), the person writes it here instead.
 */
export default function SendEmailDialog({ lead, campaignId, onClose, onSent }) {
  const { outreach, setOutreach, loading, error: loadError, reload } = useLeadOutreach(lead.id, { campaignId });
  const [editing, setEditing] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const closeButton = useRef(null);
  const name = leadName(lead);
  const draft = outreach?.draft;
  const campaign = outreach?.campaign;
  const resolvedCampaignId = campaignId || campaign?.id;

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = event => { if (event.key === "Escape" && !busy) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  // The editor opens by itself when there is nothing for the AI to give.
  useEffect(() => {
    if (draft?.state === "write_yourself") setEditing(true);
  }, [draft?.state]);

  const startEditing = () => {
    setSubject(draft?.subject || "");
    setBody(draft?.body || "");
    setError("");
    setEditing(true);
  };

  const fail = (err, fallback) => {
    setError(err?.response?.data?.error || fallback);
    const latest = err?.response?.data?.details?.draft;
    if (latest) setOutreach(current => current ? { ...current, draft: latest } : current);
  };

  const askAi = async () => {
    setBusy("generate");
    setError("");
    try {
      const { data } = await api.post(`/leads/${lead.id}/draft/generate`, { campaignId: resolvedCampaignId });
      setOutreach(data);
      setEditing(false);
    } catch (err) {
      fail(err, "The AI could not start writing this email.");
    } finally {
      setBusy("");
    }
  };

  const send = async messageId => {
    const { data } = await api.post(`/leads/${lead.id}/send-now`, { campaignId: resolvedCampaignId, messageId });
    onSent?.(data?.lead ?? null);
    onClose();
  };

  const saveOwn = async ({ andSend }) => {
    const cleanSubject = subject.trim();
    const cleanBody = body.trim();
    if (!cleanSubject || !cleanBody) {
      setError("Add a subject and write the email before saving.");
      return;
    }
    setBusy(andSend ? "send" : "save");
    setError("");
    try {
      const { data } = await api.put(`/leads/${lead.id}/draft`, { campaignId: resolvedCampaignId, subject: cleanSubject, body: cleanBody });
      setOutreach(data);
      setEditing(false);
      if (andSend) await send(data?.draft?.messageId);
    } catch (err) {
      fail(err, andSend ? "Your email was not sent." : "Your email could not be saved.");
    } finally {
      setBusy("");
    }
  };

  const sendReviewed = async () => {
    setBusy("send");
    setError("");
    try {
      await send(draft.messageId);
    } catch (err) {
      fail(err, "This email was not sent.");
      reload({ quiet: true });
    } finally {
      setBusy("");
    }
  };

  const creditsOut = draft?.reasonCode === AI_CREDITS_EXHAUSTED;
  let content;
  let footer = null;

  if (loading && !outreach) {
    content = <div className="row" style={{ gap: 10 }}><Spinner size={16} /><span className="faint">Loading the email…</span></div>;
  } else if (loadError && !outreach) {
    content = <div className="gnote bad">{loadError}</div>;
  } else if (!campaign) {
    content = <div className="gnote warn">{name} is not in a campaign yet. Add them to an email campaign and their first email is written automatically.</div>;
  } else if (!campaignSendsEmail(campaign)) {
    content = <div className="gnote warn">{campaign.name} is a calling campaign, so it does not send email.</div>;
  } else if (editing) {
    content = (
      <>
        {draft?.state === "write_yourself" && draft.reason ? (
          <div className={`gnote ${creditsOut ? "warn" : ""}`} style={{ marginBottom: 14 }}>
            {draft.reason}
            {creditsOut ? <> <Link className="lnk" href="/billing">Add credits</Link></> : null}
          </div>
        ) : null}
        <label className="draft-edit-label" htmlFor="own-email-subject">Subject</label>
        <input
          id="own-email-subject"
          className="input"
          value={subject}
          maxLength={SUBJECT_MAX}
          disabled={Boolean(busy)}
          onChange={event => setSubject(event.target.value)}
          placeholder={`A short subject for ${name}`}
        />
        <label className="draft-edit-label" htmlFor="own-email-body" style={{ marginTop: 14 }}>Message</label>
        <textarea
          id="own-email-body"
          className="input draft-edit-textarea"
          value={body}
          maxLength={BODY_MAX}
          disabled={Boolean(busy)}
          onChange={event => setBody(event.target.value)}
          placeholder={`Hi ${lead.firstName || name.split(" ")[0] || "there"},`}
        />
        <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>An unsubscribe link is added at the bottom when it is sent.</p>
      </>
    );
    footer = (
      <>
        {draft?.state === "ready" ? (
          <button type="button" className="bt bt-g" disabled={Boolean(busy)} onClick={() => setEditing(false)}>Back to email</button>
        ) : !creditsOut ? (
          <button type="button" className="bt bt-g" disabled={Boolean(busy)} onClick={askAi}>
            {busy === "generate" ? <Spinner size={13} /> : <Icon name="spark" size={14} />} Ask AI to write it
          </button>
        ) : null}
        <button type="button" className="bt bt-g" style={{ marginLeft: "auto" }} disabled={Boolean(busy)} onClick={() => saveOwn({ andSend: false })}>
          {busy === "save" ? <Spinner size={13} /> : null} Save
        </button>
        <button type="button" className="bt bt-p" disabled={Boolean(busy)} onClick={() => saveOwn({ andSend: true })}>
          {busy === "send" ? <Spinner size={13} /> : <Icon name="send" size={14} color="#06231a" />} Save and send now
        </button>
      </>
    );
  } else if (draft?.state === "writing") {
    content = (
      <div className="col" style={{ gap: 10 }}>
        <div className="row" style={{ gap: 10 }}><Spinner size={16} /><b>Writing an email to {name}…</b></div>
        <p className="faint" style={{ margin: 0 }}>This usually takes a few seconds. It appears here as soon as it is ready, and nothing is sent until you send it.</p>
      </div>
    );
    footer = (
      <button type="button" className="bt bt-g" style={{ marginLeft: "auto" }} onClick={startEditing}>
        <Icon name="edit" size={14} /> Write it myself instead
      </button>
    );
  } else if (draft?.state === "ready") {
    const queued = draft.status === "queued";
    content = (
      <>
        <div className="kv"><span>To</span><b className="ellip">{lead.email}</b></div>
        <div className="kv"><span>Subject</span><b>{draft.subject}</b></div>
        <div className="gnote" style={{ marginTop: 12, whiteSpace: "pre-wrap", maxHeight: 320, overflow: "auto", fontWeight: 500 }}>{draft.body}</div>
        <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>
          {campaign.status === "active" ? "" : `${campaign.name} has not launched yet. Sending now emails only ${name}. `}
          An unsubscribe link is added at the bottom.
        </p>
      </>
    );
    footer = (
      <>
        <button type="button" className="bt bt-g" disabled={Boolean(busy) || queued} onClick={startEditing}>
          <Icon name="edit" size={14} /> Edit
        </button>
        <button type="button" className="bt bt-p" style={{ marginLeft: "auto" }} disabled={Boolean(busy) || queued} onClick={sendReviewed}>
          {busy === "send" || queued ? <Spinner size={13} /> : <Icon name="send" size={14} color="#06231a" />} {queued ? "Sending…" : "Send now"}
        </button>
      </>
    );
  } else if (draft?.state === "sent") {
    content = <div className="gnote ok">The first email to {name} has already been sent.</div>;
  } else if (draft?.state === "blocked") {
    content = <div className="gnote bad">{draft.reason || `${name} cannot be emailed.`}</div>;
  } else {
    content = <p style={{ margin: 0 }}>No email has been written for {name} yet. Let the AI write it from what is known about them, or write it yourself.</p>;
    footer = (
      <>
        <button type="button" className="bt bt-g" style={{ marginLeft: "auto" }} disabled={Boolean(busy)} onClick={startEditing}>
          <Icon name="edit" size={14} /> Write it myself
        </button>
        <button type="button" className="bt bt-p" disabled={Boolean(busy)} onClick={askAi}>
          {busy === "generate" ? <Spinner size={13} /> : <Icon name="spark" size={14} color="#06231a" />} Ask AI to write it
        </button>
      </>
    );
  }

  return (
    <div className="gx gx-layer">
      <div className="ovl" style={{ position: "fixed" }} role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
        <div className="mdl" role="dialog" aria-modal="true" aria-labelledby="send-email-title" style={{ width: 640, maxWidth: "100%" }}>
          <div className="mdl-h">
            <span className="li"><Icon name="mail" size={20} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b id="send-email-title">{editing ? `Write the email to ${name}` : `Email ${name}`}</b>
              <p className="ellip">{campaign ? `First email in ${campaign.name}` : lead.email || ""}</p>
            </div>
            <button ref={closeButton} type="button" className="ibt" aria-label="Close" disabled={Boolean(busy)} onClick={onClose}>
              <Icon name="close" size={16} />
            </button>
          </div>
          <div style={{ padding: "0 26px" }}>
            {content}
            {error ? <div className="gnote bad" style={{ marginTop: 12 }}>{error}</div> : null}
          </div>
          <div className="mdl-f">
            {footer ?? <button type="button" className="bt bt-g" style={{ marginLeft: "auto" }} onClick={onClose}>Close</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
