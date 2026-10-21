"use client";

import { useSearchParams } from "next/navigation";
import SiteResultPage from "../../components/marketing/SiteResultPage";
import { DEMO_URL, SUPPORT_EMAIL } from "../../lib/site";

// Calendly sends invitees here after booking when the event's confirmation
// page is set to "Redirect to an external site" with "Pass event details"
// on. It appends invitee_full_name, invitee_email, event_start_time,
// event_end_time and invitee_uuid. Every value is optional so the page still
// reads correctly when someone lands here without them.
function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function validDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function googleCalendarLink(start, end, email) {
  const stamp = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "GNX Sales demo",
    dates: `${stamp(start)}/${stamp(end)}`,
    details: `Your 30 minute GNX Sales demo. The join link is in the invite sent to ${email || "your inbox"}.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default function DemoContent() {
  const search = useSearchParams();
  const params = Object.fromEntries(search?.entries() ?? []);
  const fullName = String(first(params.invitee_full_name) || "").trim().slice(0, 80);
  const firstName = fullName.split(/\s+/)[0] || "";
  const email = String(first(params.invitee_email) || "").trim().slice(0, 254);
  const start = validDate(first(params.event_start_time));
  const end = validDate(first(params.event_end_time)) || (start ? new Date(start.getTime() + 30 * 60000) : null);
  const inviteeId = String(first(params.invitee_uuid) || "").replace(/[^A-Za-z0-9-]/g, "");
  const minutes = start && end ? Math.round((end - start) / 60000) : 30;

  // Rendered in the browser, so day and time are in the visitor's own zone.
  const dayLabel = start ? new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(start) : null;
  const dateLabel = start ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(start) : "In your invite";
  const timeLabel = start ? `${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(start)} your time` : null;

  return (
    <SiteResultPage
      eyebrow="You are booked"
      title={dayLabel ? `See you ${dayLabel},` : "See you soon,"}
      accent={firstName ? `${firstName}.` : "you are booked."}
      text={`A calendar invite is on its way${email ? ` to ${email}` : ""}. In ${minutes} minutes we will run the agent on a few of your real buyers, so bring one market you sell to.`}
      primary={start && end ? { label: "Add to calendar", href: googleCalendarLink(start, end, email) } : { label: "Back to home", href: "/" }}
      secondary={inviteeId ? { label: "Reschedule", href: `https://calendly.com/reschedulings/${inviteeId}` } : { label: "Book another time", href: DEMO_URL }}
      card={{
        title: "Your demo",
        rows: [
          { icon: "calendar", label: dateLabel, detail: timeLabel },
          { icon: "clock", label: `${minutes} minutes`, detail: "Video call" },
          { icon: "link", label: "Join link", detail: "In the invite" },
          { icon: "users", label: "With the GNX team", detail: "Ask anything" },
        ],
      }}
      sectionTitle={`Get the most out of ${minutes} minutes`}
      cards={[
        { icon: "users", title: "Pick one market", text: "A job title and a region you sell to. We will find real buyers in it live." },
        { icon: "mail", title: "Bring a past email", text: "One cold email that worked for you. The agent will match your voice." },
        { icon: "phone", title: "Questions about calling", text: "Ask how the agent says it is an AI and how it stops when asked." },
      ]}
      note={<>Need to change something before then? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></>}
    />
  );
}
