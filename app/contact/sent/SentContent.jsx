"use client";

import { useEffect, useState } from "react";
import SiteResultPage from "../../../components/marketing/SiteResultPage";
import { DEMO_URL, SUPPORT_EMAIL } from "../../../lib/site";
import { CONTACT_SENT_KEY } from "../../../lib/contact";



// The contact form stores what was sent in sessionStorage just before it
// navigates here, so the page can echo it back without putting the email
// address in the URL. Anyone landing here directly sees the generic copy.
export default function SentContent() {
  const [sent, setSent] = useState(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(CONTACT_SENT_KEY);
      if (raw) setSent(JSON.parse(raw));
    } catch {
      // Storage can be blocked; the generic copy still reads correctly.
    }
  }, []);

  const firstName = String(sent?.name || "").trim().split(/\s+/)[0];
  const sentAt = sent?.sentAt ? new Date(sent.sentAt) : null;

  return (
    <SiteResultPage
      eyebrow="Message sent"
      title={firstName ? `Thanks, ${firstName}.` : "Thanks."}
      accent="We have it."
      text={`Your message reached the same inbox as ${SUPPORT_EMAIL}. A real person will reply${sent?.email ? ` to ${sent.email}` : ""} within 1 business day.`}
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Browse the Help Center", href: "/help" }}
      card={sent ? {
        title: "What you sent",
        rows: [
          { icon: "mail", label: sent.email, detail: "Reply goes here" },
          { icon: "chat", label: "Topic", detail: sent.topic },
          ...(sentAt && !Number.isNaN(sentAt.getTime())
            ? [{ icon: "clock", label: "Sent", detail: sentAt.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }) }]
            : []),
        ],
      } : null}
      sectionTitle="While you wait"
      cards={[
        { icon: "book", title: "Help Center", text: "Answers on inboxes, campaigns, calling and billing.", href: "/help", linkLabel: "Get help" },
        { icon: "star", title: "Pricing", text: "Plans with enrichment and AI calling, from $59 a month.", href: "/pricing", linkLabel: "See pricing" },
        { icon: "calendar", title: "Book a demo", text: "30 minutes, on your own buyers.", href: DEMO_URL, linkLabel: "Pick a time" },
      ]}
    />
  );
}
