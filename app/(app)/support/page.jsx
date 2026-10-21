"use client";

import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/ui/Icon";
import Avatar from "../../../components/ui/Avatar";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import Spinner from "../../../components/ui/Spinner";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import api from "../../../lib/api";
import { getSupabaseBrowserClient } from "../../../lib/supabase-browser";
import { cleanText } from "../../../lib/validation";

const STATUS_STYLES = {
  open: { label: "Open", cls: "pl-warn" },
  resolved: { label: "Resolved", cls: "pl-ok" },
  closed: { label: "Closed", cls: "pl-mute" },
};

const QUICK_ANSWERS = [
  "Connect a Google or Microsoft inbox",
  "Why a lead was dropped before credits",
  "How autopilot works per campaign",
  "Buy, replace or release a number",
];

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function TicketBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.open;
  return <span className={`pl ${style.cls}`}>{style.label}</span>;
}

function MessageBubble({ message }) {
  const admin = message.senderType === "admin";
  const name = admin ? message.sender?.name || "GNX Support" : "You";
  return (
    <div className={`smsg ${admin ? "" : "mine"}`}>
      <Avatar name={admin ? name : "You"} size={32} />
      <div>
        <div className="mh"><b>{admin ? `${name} · GNX Support` : name}</b><small>{formatTime(message.createdAt)}</small></div>
        <p style={{ whiteSpace: "pre-line" }}>{message.body}</p>
      </div>
    </div>
  );
}

function appendMessageOnce(messages = [], message) {
  if (!message || messages.some(item => item.id === message.id)) return messages;
  return [...messages, message];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [composing, setComposing] = useState(false);
  const showSkeleton = useFirstLoad(loading);

  const openTickets = useMemo(() => tickets.filter(ticket => ticket.status === "open").length, [tickets]);

  const loadTickets = () => {
    setError("");
    return api.get("/support/tickets")
      .then(({ data }) => {
        const items = Array.isArray(data?.items) ? data.items : [];
        setTickets(items);
        setSelectedId(current => current || items[0]?.id || "");
      })
      .catch(() => setError("Support tickets could not be loaded."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);
    setError("");
    api.get(`/support/tickets/${selectedId}`)
      .then(({ data }) => setDetail(data))
      .catch(() => setError("Ticket messages could not be loaded."))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return undefined;

    let cancelled = false;
    let channel;

    // The browser's Supabase client only carries the anon key, which RLS
    // treats as no identity at all. postgres_changes rows never pass the
    // org-isolation policy without this. Fetching the caller's own Supabase
    // access token (already valid, just normally locked in an httpOnly
    // cookie) and feeding it to the Realtime socket gives it a real auth.uid()
    // to check against.
    api.get("/support/realtime-token")
      .then(async ({ data }) => {
        if (cancelled || !data?.token) return;
        await supabase.realtime.setAuth(data.token);
        if (cancelled) return;

        channel = supabase
          .channel(`support-ticket-${selectedId}`)
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "support_messages", filter: `ticket_id=eq.${selectedId}` },
            payload => {
              const row = payload.new;
              setDetail(current => {
                if (!current || current.messages?.some(message => message.id === row.id)) return current;
                return {
                  ...current,
                  messages: appendMessageOnce(current.messages, {
                    id: row.id,
                    ticketId: row.ticket_id,
                    senderType: row.sender_type,
                    senderId: row.sender_id,
                    body: row.body,
                    createdAt: row.created_at,
                  }),
                };
              });
            }
          )
          .subscribe();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [selectedId]);

  const createTicket = async event => {
    event.preventDefault();
    const safeSubject = cleanText(subject, { max: 180 });
    const safeBody = cleanText(newBody, { max: 4000, multiline: true });
    if (!safeSubject || !safeBody) return;
    setCreating(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post("/support/tickets", { subject: safeSubject, body: safeBody });
      setSubject("");
      setNewBody("");
      setNotice("Support ticket created.");
      setComposing(false);
      await loadTickets();
      setSelectedId(data.id);
    } catch (err) {
      setError(err?.response?.data?.error || "Ticket could not be created.");
    } finally {
      setCreating(false);
    }
  };

  const sendReply = async event => {
    event.preventDefault();
    const safeBody = cleanText(replyBody, { max: 4000, multiline: true });
    if (!selectedId || !safeBody) return;
    setSending(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post(`/support/tickets/${selectedId}/messages`, { body: safeBody });
      setReplyBody("");
      setDetail(current => current ? { ...current, messages: appendMessageOnce(current.messages, data) } : current);
      await loadTickets();
    } catch (err) {
      setError(err?.response?.data?.error || "Reply could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async status => {
    if (!selectedId) return;
    setError("");
    try {
      await api.patch(`/support/tickets/${selectedId}/status`, { status });
      setDetail(current => current ? { ...current, status } : current);
      await loadTickets();
    } catch {
      setError("Ticket status could not be updated.");
    }
  };

  if (showSkeleton) return <RouteSkeleton />;

  const showForm = composing || tickets.length === 0;

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Support</h1>
          <p>Real people reply within 1 business day, usually much sooner. {openTickets} open ticket{openTickets === 1 ? "" : "s"}.</p>
        </div>
        <div className="acts">
          <button type="button" className="bt bt-p" onClick={() => { setComposing(true); setError(""); setNotice(""); }}>
            <Icon name="plus" size={15} color="#06231a" /> New ticket
          </button>
        </div>
      </div>

      {(error || notice) ? <div className={error ? "note" : "gnote ok"}>{error || notice}</div> : null}

      <div className="two" style={{ gridTemplateColumns: "360px minmax(0,1fr)" }}>
        <div className="scol">
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="card-h"><div><b>Your tickets</b><small>{tickets.length} ticket{tickets.length === 1 ? "" : "s"}</small></div></div>
            {tickets.length === 0 ? (
              <div className="empty">No tickets yet.</div>
            ) : tickets.map(ticket => (
              <button key={ticket.id} type="button" className={`tk ${!showForm && ticket.id === selectedId ? "on" : ""}`} onClick={() => { setSelectedId(ticket.id); setComposing(false); }}>
                <div><b className="ellip">{ticket.subject}</b><TicketBadge status={ticket.status} /></div>
                <small className="ellip">{(STATUS_STYLES[ticket.status] || STATUS_STYLES.open).label} · updated {formatTime(ticket.updatedAt)}</small>
              </button>
            ))}
          </div>
          <div className="card pad">
            <h3 className="h3">Quick answers</h3>
            <p className="sub">Most questions are answered in the Help Center.</p>
            <div style={{ marginTop: 8 }}>
              {QUICK_ANSWERS.map(item => (
                <a key={item} className="lk" href={`/help?q=${encodeURIComponent(item)}`}>
                  <i><Icon name="book" size={13} /></i><span>{item}</span><Icon name="arrow" size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {showForm ? (
          <form className="card" onSubmit={createTicket}>
            <div className="card-h"><div><b>New ticket</b><small>Tell us what is happening. Links and error messages help.</small></div></div>
            <div className="pad col" style={{ gap: 14 }}>
              <label className="fld">
                <span>Subject</span>
                <input className="input" value={subject} onChange={event => setSubject(event.target.value)} placeholder="What do you need help with?" />
              </label>
              <label className="fld">
                <span>Message</span>
                <textarea className="input" style={{ height: "auto", minHeight: 140, paddingTop: 12, resize: "vertical" }} value={newBody} onChange={event => setNewBody(event.target.value)} placeholder="Share details, links, screenshots, or errors." />
              </label>
              <div className="acts">
                {tickets.length > 0 ? <button type="button" className="bt bt-g" onClick={() => setComposing(false)}>Cancel</button> : null}
                <button className="bt bt-p" type="submit" disabled={creating || !subject.trim() || !newBody.trim()}>
                  <Icon name="send" size={14} color="#06231a" /> {creating ? "Creating..." : "Create ticket"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="card-h">
              {detail ? (
                <>
                  <div style={{ minWidth: 0 }}><b className="ellip" style={{ display: "block" }}>{detail.subject}</b><small>Opened {formatTime(detail.createdAt)}</small></div>
                  <div className="acts">
                    <TicketBadge status={detail.status} />
                    {detail.status === "open" ? (
                      <button className="bt bt-g sm" type="button" onClick={() => updateStatus("resolved")}><Icon name="check" size={13} /> Resolve</button>
                    ) : (
                      <button className="bt bt-g sm" type="button" onClick={() => updateStatus("open")}>Reopen</button>
                    )}
                  </div>
                </>
              ) : (
                <div><b>Select a ticket</b><small>Support replies appear here in real time.</small></div>
              )}
            </div>

            {detailLoading ? (
              <div className="empty"><Spinner size={20} /></div>
            ) : !detail ? (
              <div className="empty">Select a ticket from the list.</div>
            ) : detail.messages?.length === 0 ? (
              <div className="empty">No messages yet. Send the first message to start the thread.</div>
            ) : detail.messages.map(message => <MessageBubble key={message.id} message={message} />)}

            {detail ? (
              <form className="compose" onSubmit={sendReply}>
                <textarea
                  aria-label="Reply"
                  value={replyBody}
                  onChange={event => setReplyBody(event.target.value)}
                  placeholder={detail.status === "closed" ? "Closed tickets cannot receive replies." : "Write a reply…"}
                  disabled={detail.status === "closed" || sending}
                />
                <div>
                  <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Replies appear here as soon as they are sent.</span>
                  <button className="bt bt-p sm" type="submit" disabled={detail.status === "closed" || sending || !replyBody.trim()}>
                    <Icon name="send" size={13} color="#06231a" /> {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
