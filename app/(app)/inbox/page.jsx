"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import InboxHealthNote from "../../../components/ui/InboxHealthNote";
import { useRouter } from "next/navigation";
import Avatar from "../../../components/ui/Avatar";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import Spinner from "../../../components/ui/Spinner";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import api from "../../../lib/api";
import { cleanText } from "../../../lib/validation";

const STATUS_LABELS = {
  pending: "Draft pending",
  approved: "Approved",
  rejected: "Rejected",
  sent: "Auto-sent",
  sent_email: "Sent email",
  queued: "Queued",
  failed: "Failed",
  bounced: "Bounced",
};

const LEAD_STAGE_LABELS = {
  new: "New",
  queued: "Queued",
  contacted: "Contacted",
  engaged: "Engaged",
  meeting_booked: "Meeting set",
  not_interested: "Not interested",
  unsubscribed: "Unsubscribed",
};

// The small pill under each thread says what the person has to do, or how the
// conversation ended, rather than only whether it is a reply or a send.
function threadPill(item) {
  const stage = item.leadStatus || item.stage || item.leadStage;
  if (stage === "meeting_booked") return { label: "Meeting set", cls: "pl-dark" };
  if (stage === "not_interested" || stage === "unsubscribed") return { label: LEAD_STAGE_LABELS[stage], cls: "pl-mute" };
  if (item.kind === "reply" && item.aiDraftStatus === "pending") return { label: "Draft ready", cls: "pl-ok" };
  if (item.kind === "reply") return { label: "Replied", cls: "pl-info" };
  return { label: "Sent", cls: "pl-mute" };
}

const EMAIL_FILTERS = [
  { id: "all", label: "All" },
  { id: "replies", label: "Replies" },
  { id: "sent", label: "Sent" },
  { id: "drafts", label: "Drafts" },
];

function formatBody(body) {
  return (body || "").split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
}

function leadName(lead = {}, fallback = "Lead") {
  return [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
    lead.name ||
    fallback;
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function filterThreads(items, filter) {
  if (filter === "replies") return items.filter(item => item.kind === "reply");
  if (filter === "sent") return items.filter(item => item.kind === "sent" || ["approved", "sent", "sent_email"].includes(item.aiDraftStatus));
  if (filter === "drafts") return items.filter(item => item.kind === "reply" && item.aiDraftStatus === "pending");
  return items;
}

function buildFallbackDraft(detail, thread, displayName) {
  if (detail?.ai_draft_reply) return detail.ai_draft_reply;
  const firstName = displayName.split(" ")[0] || "there";
  const company = detail?.leads?.company || thread?.company || "your team";
  return `Hi ${firstName},\n\nThanks for taking a look. Based on what ${company} is working on, GNX sales can help keep outreach and follow-up moving without adding more manual work for your team.\n\nWould it be useful if I shared a short walkthrough and a few example workflows for your pipeline?`;
}

function MessageBubble({ side, label, meta, avatar, children }) {
  const isOutbound = side === "outbound";
  return (
    <div className={`msg ${isOutbound ? "" : "msg-in"}`}>
      <div className="msg-h">
        {isOutbound ? <span className="pl pl-mute">{label}</span> : <>{avatar}<b>{label}</b></>}
        {meta ? <span>{meta}</span> : null}
      </div>
      {children}
    </div>
  );
}

export default function InboxPage() {
  const router = useRouter();
  const composerRef = useRef(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [sentMessages, setSentMessages] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [senderFilter, setSenderFilter] = useState("");
  // Phones show the thread list or one open thread, never both.
  const [mobileView, setMobileView] = useState("list");
  const showSkeleton = useFirstLoad(loading);

  // Grow the reply box with what is typed (or drafted), up to the CSS
  // max-height; past that it scrolls. Reset to "auto" first so it can also
  // shrink when text is deleted.
  useLayoutEffect(() => {
    const box = composerRef.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${box.scrollHeight}px`;
  }, [composerBody, selectedId]);

  useEffect(() => {
    let cancelled = false;
    api.get("/inbox")
      .then(res => {
        if (cancelled) return;
        const items = (res.data?.threads || []).map(item => ({ ...item, kind: item.kind || "reply" }));
        setThreads(items);
        setSelectedId(items[0]?.id || null);
      })
      .catch(() => {
        if (!cancelled) setError("Inbox could not be loaded. Check backend, login session, and your email connection.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);
    setError("");
    setSuccess("");
    setComposerBody("");

    api.get(`/inbox/${selectedId}`)
      .then(res => {
        setDetail({ ...res.data, kind: res.data?.kind || "reply" });
        setDraftBody(res.data?.ai_draft_reply || "");
        // A reply arrives with the agent's draft already written, so open it in
        // the box ready to approve instead of an empty field.
        const waitingDraft = res.data?.kind !== "sent" && res.data?.ai_draft_reply && (res.data?.ai_draft_status || "pending") === "pending";
        if (waitingDraft) setComposerBody(res.data.ai_draft_reply);
      })
      .catch(() => {
        const selectedThread = threads.find(item => item.id === selectedId);
        if (selectedThread?.kind === "sent") {
          setDetail({
            kind: "sent",
            leads: {
              name: selectedThread.name,
              company: selectedThread.company,
              email: selectedThread.email,
            },
            email_messages: {
              subject: selectedThread.subject,
              body: selectedThread.preview,
              created_at: selectedThread.createdAt,
              sent_at: selectedThread.sentAt,
            },
          });
          return;
        }
        setError("Thread details could not be loaded.");
      })
      .finally(() => setDetailLoading(false));
  }, [selectedId, threads]);

  const sendManualMessage = async event => {
    event.preventDefault();
    if (!selectedId || !composerBody.trim() || sending) return;

    const body = cleanText(composerBody, { max: 4000, multiline: true });
    if (!body) return;

    setSending(true);
    setError("");
    setSuccess("");
    try {
      const isSentThread = thread?.kind === "sent" || detail?.kind === "sent";
      const { data } = await api.post(isSentThread ? `/inbox/${selectedId}/follow-up` : `/emails/${selectedId}/approve`, { body });
      const message = {
        id: data?.queuedEmailMessageId || `${selectedId}-${Date.now()}`,
        body,
        sentAt: new Date().toISOString(),
      };

      setSentMessages(current => ({
        ...current,
        [selectedId]: [...(current[selectedId] || []), message],
      }));
      setComposerBody("");
      setThreads(current => current.map(item => item.id === selectedId ? {
        ...item,
        preview: body.slice(0, 120),
        time: "queued",
        aiDraftStatus: data?.ai_draft_status || "approved",
      } : item));
      setDetail(current => current ? {
        ...current,
        ai_draft_reply: body,
        ai_draft_status: data?.ai_draft_status || "approved",
      } : current);
      setSuccess(isSentThread ? "Follow-up queued. The send-email worker will send it through your active email account." : "Reply queued. The send-email worker will send it through your active email account.");
    } catch {
      setError("Message could not be queued. Check your email connection, Redis worker, and backend logs.");
    } finally {
      setSending(false);
    }
  };

  // There is no server call for turning a reply draft down, so Reject clears the
  // draft from the box and leaves the thread alone. Nothing is sent.
  const rejectDraft = () => {
    setComposerBody("");
    setDraftBody("");
    setSuccess("Draft discarded. Nothing was sent.");
  };

  const regenerateDraft = async () => {
    if (!selectedId || drafting) return;
    setDrafting(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await api.post(`/emails/${selectedId}/regenerate`);
      const body = cleanText(data?.ai_draft_reply || "", { max: 8000, multiline: true });
      if (body) {
        setDraftBody(body);
        setComposerBody(body);
        setDetail(current => current ? { ...current, ...data } : current);
      }
    } catch {
      setError("Draft could not be generated. Check AI configuration and backend logs.");
    } finally {
      setDrafting(false);
    }
  };

  const fillComposerWithDraft = async () => {
    if (!selectedId || drafting) return;
    setDrafting(true);
    setError("");
    setSuccess("");
    try {
      let body = detail?.ai_draft_reply || draftBody;
      if (!body && (thread?.kind === "sent" || detail?.kind === "sent")) {
        try {
          const { data } = await api.post(`/inbox/${selectedId}/draft-follow-up`);
          body = data?.body || "";
        } catch {
          body = buildFallbackDraft(detail, thread, displayName);
        }
      } else if (!body) {
        const { data } = await api.post(`/emails/${selectedId}/regenerate`);
        body = data?.ai_draft_reply || "";
        setDetail(current => current ? { ...current, ...data } : current);
      }

      body = cleanText(body || buildFallbackDraft(detail, thread, displayName), { max: 8000, multiline: true });
      if (!body) return;
      setDraftBody(body);
      setComposerBody(body);
      window.requestAnimationFrame(() => {
        if (!composerRef.current) return;
        composerRef.current.focus();
        composerRef.current.scrollTop = composerRef.current.scrollHeight;
      });
    } catch {
      setError("Draft could not be generated. Check AI configuration and backend logs.");
    } finally {
      setDrafting(false);
    }
  };

  if (showSkeleton) return <RouteSkeleton />;

  const hasThreads = threads.length > 0;
  const thread = threads.find(item => item.id === selectedId) || threads[0] || null;
  const lead = detail?.leads || {};
  const originalMessage = detail?.email_messages || {};
  const displayName = leadName(lead, thread?.name || "Lead");
  const draftStatus = detail?.ai_draft_status || thread?.aiDraftStatus || "pending";
  const hasReply = detail?.kind === "reply";
  const canReply = Boolean(thread);
  const draftIsWaiting = hasReply && draftStatus === "pending" && composerBody.trim() && composerBody === draftBody;
  const leadStatusKey = lead.status || thread?.leadStatus || thread?.stage || "";
  const stageLabel = LEAD_STAGE_LABELS[leadStatusKey] || (hasReply ? "Replied" : "Awaiting reply");
  const leadProfileId = lead.id || detail?.lead_id || thread?.leadId || "";
  const stepNumber = thread?.stepNumber || originalMessage.step_number;
  const timeline = [
    hasReply && detail?.received_at ? { title: stepNumber ? `Replied to step ${stepNumber}` : "Replied", text: formatDateTime(detail.received_at) } : null,
    originalMessage.sent_at || originalMessage.created_at ? { title: stepNumber ? `Step ${stepNumber} sent` : "Email sent", text: formatDateTime(originalMessage.sent_at || originalMessage.created_at) } : null,
  ].filter(Boolean);
  const manualMessages = selectedId ? sentMessages[selectedId] || [] : [];
  const filteredThreads = filterThreads(threads, activeFilter).filter(item => !senderFilter || item.connectedAccountId === senderFilter);
  const filterCounts = {
    all: threads.length,
    replies: filterThreads(threads, "replies").length,
    sent: filterThreads(threads, "sent").length,
    drafts: filterThreads(threads, "drafts").length,
  };

  const changeFilter = filter => {
    const nextThreads = filterThreads(threads, filter);
    setActiveFilter(filter);
    if (nextThreads.length > 0 && !nextThreads.some(item => item.id === selectedId)) {
      setSelectedId(nextThreads[0].id);
    }
  };

  const inboxes = [...new Map(threads.filter(item => item.connectedAccountId).map(item => [item.connectedAccountId, item.inboxAddress])).entries()];

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Inbox</h1>
          <p>Replies from every campaign mailbox, with a Nexo draft ready on each.</p>
        </div>
        <div className="acts">
          <select className="sel-box" style={{ background: "#fff" }} aria-label="Filter by inbox" value={senderFilter} onChange={event => setSenderFilter(event.target.value)}>
            <option value="">All inboxes ({inboxes.length})</option>
            {inboxes.map(([id, address]) => <option key={id} value={id}>{address || "Inbox"}</option>)}
          </select>
        </div>
      </div>

      <InboxHealthNote />

      <div className="card ib" data-view={mobileView}>
        <aside data-tour="inbox-threads" className="il">
          <div className="il-h">
            <div className="seg" style={{ display: "flex" }} role="tablist" aria-label="Email filters">
              {EMAIL_FILTERS.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter.id}
                  className={activeFilter === filter.id ? "on" : ""}
                  onClick={() => changeFilter(filter.id)}
                >
                  {filter.label}{filterCounts[filter.id] ? <em>{filterCounts[filter.id]}</em> : null}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredThreads.length > 0 ? (
              filteredThreads.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`th ${selectedId === item.id ? "on" : ""}`}
                  onClick={() => { setSelectedId(item.id); setMobileView("thread"); }}
                >
                  <Avatar name={item.name} src={item.photoUrl || undefined} size={36} />
                  <div className="th-m">
                    <div className="th-top">
                      <b className="ellip">{item.kind === "reply" && item.aiDraftStatus === "pending" ? <i /> : null}{item.name}</b>
                      <small>{item.time}</small>
                    </div>
                    <span className="th-s">{item.subject}</span>
                    <span className="th-p">{item.preview}</span>
                    <div style={{ marginTop: 7 }}>
                      {(() => { const pill = threadPill(item); return <span className={`pl ${pill.cls}`}>{pill.label}</span>; })()}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              threads.length === 0 ? (
                <EmptyState
                  compact
                  icon="inbox"
                  title="You are all caught up"
                  text="When a lead replies, your agent drafts an answer and it shows up here for your OK."
                  actions={[{ label: "View campaigns", onClick: () => router.push("/campaigns") }]}
                />
              ) : (
                <EmptyState compact icon="search" title={`No ${activeFilter} yet`} text="Try another filter." actions={[{ label: "Show all", onClick: () => changeFilter("all") }]} />
              )
            )}
          </div>
        </aside>

        <section className="cv">
          {thread ? (
            <div className="cv-h">
              <button type="button" className="ibt cv-back" aria-label="Back to inbox" onClick={() => setMobileView("list")}><Icon name="arrowLeft" size={15} /></button>
              <div style={{ minWidth: 0, flex: 1 }}>
                <b className="ellip" style={{ display: "block" }}>{originalMessage.subject || thread.subject || displayName}</b>
                <small className="ellip">{[thread.campaignName, thread.stepNumber ? `step ${thread.stepNumber}` : null, thread.inboxAddress ? `via ${thread.inboxAddress}` : (thread.campaignName ? null : thread.company)].filter(Boolean).join(" · ") || lead.email || thread.email}</small>
              </div>
              <span className="pl pl-mute">{STATUS_LABELS[draftStatus] || draftStatus}</span>
            </div>
          ) : null}

          {error ? <div className="note">{error}</div> : null}
          {success ? <div className="notice-good">{success}</div> : null}

          {!thread ? (
            <div className="empty">Choose a lead on the left to open the email conversation.</div>
          ) : detailLoading ? (
            <div className="empty"><Spinner size={20} /></div>
          ) : (
            <>
              <MessageBubble side="outbound" label="You sent" meta={formatDateTime(originalMessage.sent_at || originalMessage.created_at) || thread.time}>
                <p>{formatBody(originalMessage.body || thread.preview || lead.email)}</p>
              </MessageBubble>

              {hasReply ? (
                <MessageBubble
                  side="inbound"
                  label={displayName}
                  avatar={<Avatar name={displayName} src={lead.photo_url || thread?.photoUrl || undefined} size={26} />}
                  meta={[lead.email || thread.email, formatDateTime(detail.received_at)].filter(Boolean).join(" · ")}
                >
                  <p>{formatBody(detail.body || thread.preview)}</p>
                </MessageBubble>
              ) : (
                <div className="msg-h" style={{ color: "#69786f", fontWeight: 700 }}>
                  <Icon name="clock" size={15} /> Waiting for this lead to reply.
                </div>
              )}

              {manualMessages.map(message => (
                <MessageBubble key={message.id} side="outbound" label="You sent" meta={formatDateTime(message.sentAt)}>
                  <p>{formatBody(message.body)}</p>
                </MessageBubble>
              ))}
            </>
          )}

          {thread && canReply ? (
            <form className="dft" onSubmit={sendManualMessage}>
              <div className="dft-h">
                <Icon name="spark" size={15} /> {draftIsWaiting ? "Nexo's draft reply" : "Your reply"}
                <span>{draftIsWaiting ? "Waiting for your OK" : composerBody.trim() ? "Ready when you are" : "Write it, or ask for a draft"}</span>
              </div>
              <textarea
                ref={composerRef}
                className="dft-in"
                value={composerBody}
                onChange={event => setComposerBody(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendManualMessage(event);
                  }
                }}
                rows={4}
                aria-label={`Message ${displayName}`}
                placeholder={`Message ${displayName}`}
              />
              <div className="dft-f">
                <div className="x">
                  <button type="button" className="ibt" title="Attachments are not supported yet" aria-label="Attach a file" disabled>
                    <Icon name="paperclip" size={14} />
                  </button>
                  {hasReply ? (
                    <button type="button" className="ibt" title="Write a new draft" aria-label="Write a new draft" disabled={detailLoading || drafting || !selectedId} onClick={regenerateDraft}>
                      <Icon name="refresh" size={14} />
                    </button>
                  ) : null}
                </div>
                {draftIsWaiting ? (
                  <>
                    <button type="button" className="bt bt-g sm" disabled={sending} onClick={rejectDraft}>Reject</button>
                    <button type="button" className="bt bt-g sm" disabled={sending} onClick={() => composerRef.current?.focus()}>
                      <Icon name="edit" size={14} /> Edit
                    </button>
                  </>
                ) : null}
                {!composerBody.trim() ? (
                  <button type="button" className="bt bt-g sm" disabled={detailLoading || drafting || !selectedId} onClick={fillComposerWithDraft}>
                    <Icon name="spark" size={14} /> {drafting ? "Drafting..." : "Draft with AI"}
                  </button>
                ) : null}
                <button type="submit" className="bt bt-p sm" disabled={!composerBody.trim() || sending}>
                  <Icon name="send" size={14} color="#06231a" /> {sending ? "Sending..." : draftIsWaiting ? "Approve and send" : "Send"}
                </button>
              </div>
            </form>
          ) : null}
        </section>

        <aside className="ctx" style={{ borderLeft: "1px solid #eef3f0" }}>
          {thread ? (
            <>
              <div className="ctx-id">
                <Avatar name={displayName} src={lead.photo_url || thread?.photoUrl || undefined} size={56} />
                <b>{displayName}</b>
                <small>{[lead.title, lead.company || thread.company].filter(Boolean).join(" · ") || "Lead"}</small>
                <div className="pv-tags" style={{ justifyContent: "center" }}>
                  <span className={`pl ${hasReply ? "pl-ok" : "pl-mute"}`}>{stageLabel}</span>
                  {lead.score != null ? <span className="pl pl-dark">Score {lead.score}</span> : null}
                </div>
              </div>
              {lead.status || thread.leadStatus ? (
                <div className="ctx-sec">
                  <small className="h">Stage</small>
                  <div className="sel-box" aria-label="Lead stage"><span>{stageLabel}</span></div>
                </div>
              ) : null}
              <div className="ctx-sec">
                <small className="h">Contact</small>
                <div className="kv"><span>Email</span><b className="ellip">{lead.email || thread.email || "Unknown"}</b></div>
                {lead.phone ? <div className="kv"><span>Phone</span><b>{lead.phone}</b></div> : null}
                {lead.location ? <div className="kv"><span>Location</span><b>{lead.location}</b></div> : null}
                {thread.inboxAddress ? <div className="kv"><span>Inbox</span><b className="ellip">{thread.inboxAddress}</b></div> : null}
              </div>
              {timeline.length > 0 ? (
                <div className="ctx-sec">
                  <small className="h">Sequence</small>
                  <div className="tl">
                    {timeline.map(entry => (
                      <div key={entry.title}><i /><b>{entry.title}</b><span>{entry.text}</span></div>
                    ))}
                  </div>
                </div>
              ) : null}
              {leadProfileId ? (
                <button type="button" className="bt bt-g" style={{ justifyContent: "center" }} onClick={() => router.push(`/prospects/${leadProfileId}`)}>Open lead profile</button>
              ) : null}
            </>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
