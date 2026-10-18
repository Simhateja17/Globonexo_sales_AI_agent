import { API_BASE_URL } from "./api";

export const FAQ_ASSISTANT_MAX_CHARS = 600;
export const SUPPORT_EMAIL = "support@gnxsales.com";
const MAX_SENT_MESSAGES = 12;
const REQUEST_TIMEOUT_MS = 25000;

export const FAQ_ASSISTANT_UNAVAILABLE = `The assistant is unavailable right now. Browse the questions below or email ${SUPPORT_EMAIL}.`;

// Only user/assistant text goes to the server, trimmed and capped. The server
// treats the history as untrusted context, so this is just about payload size.
export function toRequestMessages(history) {
  return history
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, FAQ_ASSISTANT_MAX_CHARS) }))
    .slice(-MAX_SENT_MESSAGES);
}

// Plain fetch on purpose: the shared axios client redirects to /login on a 401,
// and this endpoint is public.
export async function askFaqAssistant(history, { signal } = {}) {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const res = await fetch(`${API_BASE_URL}/public/faq-assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: toRequestMessages(history) }),
      signal: timeout.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = res.status === 429 || res.status === 503 || res.status === 400 ? data.error : null;
      const err = new Error(message || FAQ_ASSISTANT_UNAVAILABLE);
      err.status = res.status;
      throw err;
    }
    return { status: data.status || "answered", answer: String(data.answer || "") };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
