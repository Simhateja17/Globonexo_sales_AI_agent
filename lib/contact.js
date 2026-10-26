import { API_BASE_URL } from "./api";
import { SUPPORT_EMAIL } from "./site";

export const CONTACT_TOPICS = [
  "Product support",
  "Sales or a demo",
  "Billing or cancelling",
  "Privacy or data request",
  "Security report",
  "Partnership or press",
];

export const CONTACT_FALLBACK_ERROR = `We couldn't send that right now. Please email ${SUPPORT_EMAIL} directly.`;

// Plain fetch on purpose: the shared axios client redirects to /login on a 401,
// and this endpoint is public.
export async function sendContactMessage(values) {
  const res = await fetch(`${API_BASE_URL}/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || CONTACT_FALLBACK_ERROR);
    err.status = res.status;
    throw err;
  }
  return data;
}

// sessionStorage key the contact form writes before sending people to
// /contact/sent, so that page can echo back what was sent.
export const CONTACT_SENT_KEY = "gnx:contact-sent";
