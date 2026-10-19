export const metadata = {
  title: "Sales Automation Software That Runs the Whole Motion",
  description:
    "Sales automation software that does more than send on a schedule. GNX Sales sources and qualifies leads, writes personalized sequences, follows up, handles replies, places AI voice calls, and books meetings, from one subscription.",
  alternates: { canonical: "/sales-automation-software" },
  openGraph: {
    url: "/sales-automation-software",
    title: "Sales Automation Software That Runs the Whole Motion",
    description:
      "Lead sourcing, qualification, AI email sequences, voice calling, replies, and booking in one sales automation platform.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "What is sales automation software?",
    a: "Software that takes repetitive sales work off a person: building lists, sending sequences, scheduling follow-ups, logging activity and booking meetings. It ranges from tools that only automate sending to agents that also decide who to contact and what to say.",
  },
  {
    q: "What can actually be automated in outbound sales?",
    a: "Everything up to the conversation. Sourcing, qualifying, research, writing, sending, follow-ups, reply drafts, calling and booking can all run on their own. The discovery call, deal strategy and negotiation still need a person. Automation does not lift the rules either: email still has to meet laws like CAN-SPAM, and AI calls in the US need prior consent under the TCPA.",
  },
  {
    q: "Does GNX Sales replace my CRM?",
    a: "No. It runs outbound and keeps its own prospects, pipeline and meetings. It creates opportunities. It is not where you manage closing them.",
  },
  {
    q: "Do I need to change my email setup?",
    a: "No. Connect Gmail or Google Workspace with an app password, or any other provider through SMTP for sending and IMAP for reading replies. No domain migration and no separate sending setup.",
  },
  {
    q: "How is it priced?",
    a: "One monthly or yearly subscription per plan, from $59 to $479 a month, with a credit pool shared by enrichment, writing and calling. Seats come with the plan: 1, 5 or 15. No per-channel charge.",
  },
  {
    q: "How quickly can I be running campaigns?",
    a: "Most people launch their first campaign in one sitting. Choose a plan, answer the guided onboarding so the agent learns your offer and ideal customer, connect your mailbox, and launch. When meetings come depends on your market and offer.",
  },
];

export default function SalesAutomationSoftwarePage() {
  return (
    <div className="public-page gd-page gd-page-sales-automation-software">
      <PublicNav />
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #041f16 0%, #06311f 45%, #075b3f 100%)",
          color: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "560px",
            height: "560px",
            right: "-160px",
            top: "-220px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(41,214,143,.5), rgba(41,214,143,0) 70%)",
            filter: "blur(60px)",
          }}
        ></div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "0",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 40%, #000 0%, transparent 70%)",
            maskImage: "radial-gradient(ellipse at 30% 40%, #000 0%, transparent 70%)",
          }}
        ></div>
        <div style={{ position: "relative", maxWidth: "1160px", margin: "0 auto", padding: "56px 24px 96px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Link className="gd-crumb" href="/">
              Home
            </Link>
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,.35)" }}>
              /
            </span>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>Sales automation software</span>
          </nav>
          <div
            style={{
              marginTop: "44px",
              display: "inline-flex",
              padding: "7px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.14)",
              color: "#a8f0c6",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            Sales automation software
          </div>
          <h1
            style={{
              margin: "24px 0 0",
              maxWidth: "880px",
              fontFamily: "var(--font-display)",
              fontWeight: "600",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              lineHeight: "1",
              letterSpacing: "-.05em",
            }}
          >
            Sales automation that does more than <span style={{ color: "#6fe7b0" }}>press send.</span>
          </h1>
          <p
            style={{
              margin: "24px 0 0",
              maxWidth: "660px",
              color: "rgba(255,255,255,.76)",
              fontSize: "18.5px",
              lineHeight: "1.7",
            }}
          >
            Most sales automation software sends for you and leaves you the thinking. GNX Sales finds and qualifies the
            accounts, researches each person, writes the sequence, sends it, follows up, drafts the replies, makes the
            calls and books the meeting. One subscription.
          </p>
          <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "50px",
                padding: "0 24px",
                borderRadius: "999px",
                background: "linear-gradient(180deg, #29d68f, #00c27a)",
                color: "#06231a",
                fontSize: "15px",
                fontWeight: "800",
                boxShadow: "0 12px 30px rgba(0,194,122,.35)",
              }}
            >
              Choose a plan{" "}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6"></path>
              </svg>
            </Link>
            <Link
              href="/pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "50px",
                padding: "0 24px",
                borderRadius: "999px",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "800",
              }}
            >
              View pricing
            </Link>
          </div>
          <div
            style={{
              marginTop: "48px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px 28px",
              color: "rgba(255,255,255,.7)",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6fe7b0"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              Email and AI calling in every plan
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6fe7b0"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              You approve replies by default
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6fe7b0"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5 9-10"></path>
              </svg>
              From $59 a month
            </span>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "88px 24px 80px" }}>
        <div style={{ maxWidth: "680px" }}>
          <div className="gd-eyebrow">What it automates</div>
          <h2 className="gd-h2">Eight jobs, one motion.</h2>
          <p className="gd-lead">
            Work that usually lives in six products and a spreadsheet, running together with one shared picture of every
            prospect.
          </p>
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "20px",
            padding: "24px 28px",
            borderRadius: "20px",
            background: "#041f16",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: "600",
              fontSize: "52px",
              letterSpacing: "-.04em",
              lineHeight: "1",
              color: "#6fe7b0",
            }}
          >
            28%
          </div>
          <div style={{ flex: "1 1 320px" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.6" }}>
              of a sales rep&apos;s week goes to actually selling. These eight jobs are a big part of the rest.
            </div>
            <div style={{ marginTop: "4px", color: "rgba(255,255,255,.6)", fontSize: "13px", fontWeight: "600" }}>
              Salesforce State of Sales, 7,775 sales professionals surveyed, 2022
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          <div className="gd-card">
            <span className="gd-k">01</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="5"></circle>
                <circle cx="12" cy="12" r="1"></circle>
              </svg>
            </div>
            <h3>Deciding who to contact</h3>
            <p>
              Define your ideal customer once. Every campaign checks account and role fit against clear, editable rules
              before a credit goes on enrichment.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">02</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3.5"></circle>
                <path d="M2.5 20a6.5 6.5 0 0 1 13 0"></path>
                <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"></path>
              </svg>
            </div>
            <h3>Building the list</h3>
            <p>
              Search the lead database, upload a CSV or add leads by hand. Enrichment runs in batches and retries on
              rate limits. Rejected leads keep a reason you can act on.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">03</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
            </div>
            <h3>Writing the outreach</h3>
            <p>
              The first email, follow-ups and last email are written together as one sequence, from that campaign&apos;s
              own notes, not one shared template.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">04</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 3L10 14"></path>
                <path d="M21 3l-7 18-4-7-7-4 18-7z"></path>
              </svg>
            </div>
            <h3>Sending and following up</h3>
            <p>
              Paced sending inside each lead&apos;s local hours, follow-ups on schedule, a one-click unsubscribe in
              every email, and a hard stop the moment someone replies or opts out.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">05</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 13h5l1.5 3h5L16 13h5"></path>
                <path d="M5 5h14l2 8v6H3v-6l2-8z"></path>
              </svg>
            </div>
            <h3>Handling replies</h3>
            <p>
              Replies are pulled from your mailbox, threaded and drafted for you. You approve by default. Autopilot is a
              switch you turn on per campaign.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">06</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"></path>
              </svg>
            </div>
            <h3>Calling by AI voice</h3>
            <p>
              Ten scored test calls before launch, a Do Not Call screen before every dial, and a phone number set up for
              you.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">07</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="2"></rect>
                <path d="M3 10h18M8 3v4M16 3v4"></path>
              </svg>
            </div>
            <h3>Booking the meeting</h3>
            <p>
              Availability is checked on the server with timezones and buffers handled, and the database refuses a
              second booking in the same slot.
            </p>
          </div>
          <div className="gd-card">
            <span className="gd-k">08</span>
            <div className="gd-ci">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 17l6-6 4 4 8-8"></path>
                <path d="M15 7h6v6"></path>
              </svg>
            </div>
            <h3>Reporting what happened</h3>
            <p>
              Emails sent, reply rate, meetings booked, per campaign and per call, plus credit use tied to what each
              provider actually charged.
            </p>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "88px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "40px 64px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 280px", maxWidth: "360px" }}>
            <div className="gd-eyebrow">How it differs</div>
            <h2 className="gd-h2">Not the usual stack.</h2>
            <p className="gd-lead">
              Typical sales automation automates the sending. This automates the deciding and the writing too.
            </p>
          </div>
          <div className="gd-cmp" style={{ flex: "999 1 600px", minWidth: "0" }}>
            <div className="gd-cmp-row gd-cmp-h">
              <div>Typical sales automation</div>
              <div>GNX Sales</div>
            </div>
            <div className="gd-cmp-row">
              <div>Automates sending, you still decide who and what</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                Automates the deciding, the writing and the sending
              </div>
            </div>
            <div className="gd-cmp-row">
              <div>One tool per layer, one bill per tool</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                One platform, one subscription, one credit pool
              </div>
            </div>
            <div className="gd-cmp-row">
              <div>Priced per seat, so a bigger team doubles the bill</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                Priced by plan, with seats included
              </div>
            </div>
            <div className="gd-cmp-row">
              <div>Calling is a separate product with its own data</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                Email and voice share one prospect record
              </div>
            </div>
            <div className="gd-cmp-row">
              <div>Templates with a first name swapped in</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                Each email written from what is actually known about that person
              </div>
            </div>
            <div className="gd-cmp-row">
              <div>The model writes even when it knows nothing</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                No required facts, no email. Silence beats a guess
              </div>
            </div>
            <div className="gd-cmp-row">
              <div>Weeks of setup and an implementation call</div>
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#088256"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10"></path>
                </svg>
                Most people launch their first campaign in one sitting
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "88px 24px 80px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "16px",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <div className="gd-eyebrow">Every plan</div>
            <h2 className="gd-h2">The full loop, from the first plan up.</h2>
            <p className="gd-lead">
              Plans differ mainly by volume. The one feature held back is the inbound AI receptionist, which comes with
              Agency and Startup.
            </p>
          </div>
          <Link
            href="/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              height: "46px",
              padding: "0 20px",
              borderRadius: "999px",
              background: "#0a1712",
              color: "#fff",
              fontSize: "14.5px",
              fontWeight: "800",
            }}
          >
            Compare plans{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6"></path>
            </svg>
          </Link>
        </div>
        <ul className="gd-inc" style={{ marginTop: "32px" }}>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            AI email sequences with per-step review, inline editing and approve all
          </li>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            Lead sourcing and enrichment from verified data providers
          </li>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            AI voice calling with a phone number set up for you
          </li>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            Reply drafting, threading and automatic opt-out detection
          </li>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            Meeting booking in the built-in Calendar, with Google Calendar sync coming soon
          </li>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            Campaign, call and credit usage analytics
          </li>
          <li>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#088256"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5 9-10"></path>
            </svg>
            An AI Agent chat that runs the whole system in plain English
          </li>
        </ul>
      </section>
      <section style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "88px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "40px 64px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 280px", maxWidth: "360px" }}>
            <div className="gd-eyebrow">Questions</div>
            <h2 className="gd-h2">Asked before buying.</h2>
            <p className="gd-lead">
              More in the <Link href="/faq">full FAQ</Link>.
            </p>
          </div>
          <div style={{ flex: "999 1 600px", minWidth: "0" }}>
            <FaqSection items={faqs} className="" />
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "72px 24px" }}>
        <h2
          style={{
            margin: "0",
            fontFamily: "var(--font-display)",
            fontWeight: "600",
            fontSize: "28px",
            letterSpacing: "-.025em",
          }}
        >
          Still comparing?
        </h2>
        <div
          style={{
            marginTop: "22px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          <Link className="gd-rel" href="/ai-sales-agent-guide">
            <small>Category guide</small>
            <strong>What is an AI sales agent?</strong>
            <span>The nine-step loop, what it can and cannot do, and how to judge one.</span>
          </Link>
          <Link className="gd-rel" href="/ai-sdr-tools">
            <small>Buyer&apos;s guide</small>
            <strong>AI SDR tools</strong>
            <span>Five kinds of product, and the seven questions that tell them apart.</span>
          </Link>
          <Link className="gd-rel" href="/cold-email-software">
            <small>Comparison</small>
            <strong>Cold email software, and where it stops</strong>
            <span>What sending tools do well, and the work they hand back to you.</span>
          </Link>
        </div>
        <div
          style={{
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid var(--line)",
            color: "var(--muted)",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
        >
          <strong style={{ color: "var(--ink)" }}>Sources:</strong>
          <a
            href="https://www.salesforce.com/news/stories/sales-research-2023/"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Salesforce, State of Sales (2022)
          </a>{" "}
          ·
          <a
            href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            FTC, CAN-SPAM guide
          </a>{" "}
          ·
          <a
            href="https://www.fcc.gov/document/fcc-confirms-tcpa-applies-ai-technologies-generate-human-voices"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            FCC, TCPA and AI voices (2024)
          </a>
        </div>
      </section>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #041f16 0%, #06311f 50%, #075b3f 100%)",
          color: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "480px",
            height: "480px",
            right: "-120px",
            top: "-220px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(41,214,143,.45), rgba(41,214,143,0) 70%)",
            filter: "blur(60px)",
          }}
        ></div>
        <div
          style={{
            position: "relative",
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "80px 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <h2
              style={{
                margin: "0",
                fontFamily: "var(--font-display)",
                fontWeight: "600",
                fontSize: "42px",
                lineHeight: "1.05",
                letterSpacing: "-.035em",
              }}
            >
              Automate the whole motion,
              <br />
              <span style={{ color: "#6fe7b0" }}>not just the sending.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Choose a plan, connect your inbox, and launch your first campaign.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "50px",
                padding: "0 24px",
                borderRadius: "999px",
                background: "linear-gradient(180deg, #29d68f, #00c27a)",
                color: "#06231a",
                fontSize: "15px",
                fontWeight: "800",
              }}
            >
              Choose a plan
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "50px",
                padding: "0 24px",
                borderRadius: "999px",
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "800",
              }}
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Sales automation software", path: "/sales-automation-software" }]} />
    </div>
  );
}
