"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";
import {
  askFaqAssistant,
  FAQ_ASSISTANT_MAX_CHARS,
  FAQ_ASSISTANT_UNAVAILABLE,
  SUPPORT_EMAIL,
} from "../../lib/faq-assistant";

const SUGGESTIONS = [
  "Does it really make phone calls?",
  "What do the plans cost?",
  "Is my data used to train AI?",
  "How do refunds work?",
];

const GREETING =
  "Hi, I'm the GNX Sales assistant. Ask me about how the agent works, calls and email, pricing and billing, compliance, or your data.";

// Floating "ask a question" panel for /faq. Answers come from the backend, which
// is grounded only in the published FAQ, so anything it cannot confirm is sent
// to a person instead of guessed.
export default function FaqAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const send = useCallback(
    async (text) => {
      const question = text.trim().slice(0, FAQ_ASSISTANT_MAX_CHARS);
      if (!question || busy) return;

      const next = [...messages, { role: "user", content: question }];
      setMessages(next);
      setInput("");
      setBusy(true);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const reply = await askFaqAssistant(next, { signal: controller.signal });
        setMessages((prev) => [...prev, { role: "assistant", content: reply.answer, status: reply.status }]);
      } catch (err) {
        if (controller.signal.aborted && !busy) return;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err?.message || FAQ_ASSISTANT_UNAVAILABLE, status: "error" },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [messages, busy]
  );

  // Lets other parts of the page (e.g. an empty search) hand a question over.
  useEffect(() => {
    const onOpen = (event) => {
      setOpen(true);
      const question = event.detail?.question;
      if (question) send(question);
    };
    window.addEventListener("faq-assistant:open", onOpen);
    return () => window.removeEventListener("faq-assistant:open", onOpen);
  }, [send]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onKeyDown = (event) => {
    if (event.key === "Escape") setOpen(false);
  };

  return (
    <>
      {!open && (
        <button type="button" className="faq-assistant-launcher" onClick={() => setOpen(true)}>
          <Icon name="spark" size={18} color="#06231a" /> Ask our AI
        </button>
      )}

      {open && (
        <section className="faq-assistant" role="dialog" aria-label="FAQ assistant" onKeyDown={onKeyDown}>
          <header className="faq-assistant-head">
            <span className="faq-assistant-badge"><Icon name="spark" size={16} color="#fff" /></span>
            <div>
              <strong>GNX Sales assistant</strong>
              <span>AI answers from our FAQ</span>
            </div>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className="faq-assistant-list" ref={listRef} aria-live="polite">
            <p className="faq-assistant-msg is-bot">{GREETING}</p>
            {messages.length === 0 && (
              <div className="faq-assistant-suggest">
                {SUGGESTIONS.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`faq-assistant-row ${m.role === "user" ? "is-user" : "is-bot"}`}>
                <p className={`faq-assistant-msg ${m.role === "user" ? "is-user" : "is-bot"}${m.status === "error" ? " is-error" : ""}`}>
                  {m.content}
                </p>
                {(m.status === "escalate" || m.status === "not_covered" || m.status === "error") && (
                  <a className="faq-assistant-support" href={`mailto:${SUPPORT_EMAIL}`}>
                    <Icon name="mail" size={14} /> Email support
                  </a>
                )}
              </div>
            ))}
            {busy && <p className="faq-assistant-msg is-bot faq-assistant-typing" aria-label="Assistant is typing"><i /><i /><i /></p>}
          </div>

          <form
            className="faq-assistant-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="faq-assistant-q" className="sr-only">Your question</label>
            <input
              id="faq-assistant-q"
              ref={inputRef}
              value={input}
              maxLength={FAQ_ASSISTANT_MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !input.trim()} aria-label="Send question">
              <Icon name="send" size={16} color="#06231a" />
            </button>
          </form>
          <p className="faq-assistant-note">
            AI can be wrong. Don&apos;t share passwords or card details. For account help, email {SUPPORT_EMAIL}.
          </p>
        </section>
      )}
    </>
  );
}
