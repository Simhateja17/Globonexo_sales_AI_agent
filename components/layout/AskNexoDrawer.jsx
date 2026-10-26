"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "../ui/Icon";
import Typing from "../ui/Typing";
import api from "../../lib/api";

const SUGGESTIONS = [
  "Which campaign is doing best this week?",
  "Who replied today?",
  "Summarize hottest leads",
];

// A quick side panel for one-off questions from anywhere in the workspace.
// It talks to the same /agent/chat endpoint as the AI Agent page; answers that
// carry rich results (drafts, lead searches, approvals) are left to that page.
export default function AskNexoDrawer({ agentName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    const onKey = event => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages, typing]);

  const send = async text => {
    const message = (text ?? input).trim();
    if (!message || typing) return;
    setInput("");
    setMessages(current => [...current, { who: "user", text: message }]);
    setTyping(true);
    try {
      const { data } = await api.post("/agent/chat", { message, conversationId }, { timeout: 60000 });
      if (data?.conversationId) setConversationId(data.conversationId);
      setMessages(current => [...current, {
        who: "agent",
        text: data?.content || "Done.",
        rich: Boolean(data?.kind && data.kind !== "text") || Boolean(data?.metadata && Object.keys(data.metadata).length),
      }]);
    } catch (err) {
      const reason = err?.response?.data?.error
        || (err?.code === "ECONNABORTED"
          ? "That took too long to finish. It may still be running; check the AI Agent page."
          : "Something went wrong reaching the agent. Please try again.");
      setMessages(current => [...current, { who: "agent", text: reason }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="gx gx-layer">
      <div className="dim" onClick={onClose} aria-hidden="true" />
      <aside className="drw" role="dialog" aria-modal="true" aria-label={`Ask ${agentName}`}>
        <div className="drw-h">
          <span className="bot-av"><Icon name="spark" size={15} color="#06231a" /></span>
          <b>Ask {agentName}</b>
          <button type="button" className="ibt" aria-label="Close" onClick={onClose}><Icon name="close" size={14} /></button>
        </div>
        <div className="drw-b" ref={bodyRef}>
          {messages.length === 0 ? (
            <div className="bot">
              <span className="bot-av"><Icon name="spark" size={15} color="#06231a" /></span>
              <div className="bot-b"><div className="bot-t">Ask about your campaigns, leads or replies. For longer work, like finding leads or reviewing drafts, use the AI Agent page.</div></div>
            </div>
          ) : messages.map((message, index) => message.who === "user" ? (
            <div key={index} className="me">{message.text}</div>
          ) : (
            <div key={index} className="bot">
              <span className="bot-av"><Icon name="spark" size={15} color="#06231a" /></span>
              <div className="bot-b">
                <div className="bot-t" style={{ whiteSpace: "pre-line" }}>{message.text}</div>
                {message.rich ? <Link className="lnk" href="/agent" onClick={onClose}>Open the full result in AI Agent <Icon name="arrow" size={13} /></Link> : null}
              </div>
            </div>
          ))}
          {typing ? (
            <div className="bot">
              <span className="bot-av"><Icon name="spark" size={15} color="#06231a" /></span>
              <div className="bot-b"><div className="bot-t"><Typing /></div></div>
            </div>
          ) : null}
        </div>
        <div className="drw-f">
          <div className="sugg">
            {SUGGESTIONS.map(item => <button key={item} type="button" disabled={typing} onClick={() => send(item)}>{item}</button>)}
          </div>
          <form className="box" onSubmit={event => { event.preventDefault(); send(); }}>
            <input
              autoFocus
              style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", font: "inherit", fontSize: 13.5, fontWeight: 600, color: "#0a1712" }}
              aria-label={`Ask ${agentName}`}
              placeholder={`Ask ${agentName} anything…`}
              value={input}
              onChange={event => setInput(event.target.value)}
              disabled={typing}
            />
            <button type="submit" className="sendc" aria-label="Send" disabled={typing || !input.trim()}>
              <Icon name="send" size={17} color="#06231a" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
