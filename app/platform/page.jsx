export const metadata = {
  title: "AI Sales Tool: The Whole Outbound Motion in One Platform",
  description:
    "GNX Sales is an AI sales tool that runs the full outbound motion: lead generation, enrichment, AI email sequences, voice calling, replies, meetings, and analytics in one sales automation platform.",
  alternates: { canonical: "/platform" },
  openGraph: {
    url: "/platform",
    title: "AI Sales Tool: The Whole Outbound Motion in One Platform",
    description:
      "Lead generation software, AI email sequences, voice calling, replies, and meetings running as one sales automation platform.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "What does GNX Sales replace?",
    a: "The stack most teams stitch together: a lead database, an enrichment tool, a sequencer, a cold email platform, a dialer or voice agent, scheduling links and the spreadsheet tracking replies. One platform, one credit pool.",
  },
  {
    q: "Is it lead generation software or an outreach tool?",
    a: "Both. Finding, enriching and qualifying leads happens in the same product that writes and sends, so the agent writing a message already knows everything learned while finding the person.",
  },
  {
    q: "Do I need my own lead list?",
    a: "No. Search the built-in lead database, upload a CSV, or add leads by hand. Either way, fit is checked before paid enrichment.",
  },
  {
    q: "Can I edit what the AI writes?",
    a: "Yes. Edit any draft inline, regenerate it, approve one at a time or approve all. Autopilot is a per-campaign switch, and drafts pass the same checks either way.",
  },
  {
    q: "Does it work with my mailbox?",
    a: "Yes. Gmail and Google Workspace connect with an app password, and Outlook or any other provider connects over SMTP and IMAP. No domain migration.",
  },
  {
    q: "Does it connect to my CRM?",
    a: "Not yet. GNX has its own Prospects, Pipeline and Inbox, so you can run the whole outbound loop without one. Tell us which CRM you use and we will prioritise it.",
  },
];

export default function PlatformPage() {
  return (
    <div className="public-page gd-page gd-pg2 gd-page-platform">
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
        <div style={{ position: "relative", maxWidth: "1160px", margin: "0 auto", padding: "48px 24px 88px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Link className="gd-crumb" href="/">
              Home
            </Link>
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,.35)" }}>
              /
            </span>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>The Agent</span>
          </nav>
          <div style={{ marginTop: "40px", display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center" }}>
            <div style={{ flex: "999 1 520px", minWidth: "0" }}>
              <div
                style={{
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
                The platform
              </div>
              <h1
                style={{
                  margin: "22px 0 0",
                  fontFamily: "var(--font-display)",
                  fontWeight: "600",
                  fontSize: "clamp(42px, 6vw, 72px)",
                  lineHeight: "1.02",
                  letterSpacing: "-.045em",
                }}
              >
                Your whole outbound stack. <span style={{ color: "#6fe7b0" }}>One agent.</span>
              </h1>
              <p
                style={{
                  margin: "22px 0 0",
                  maxWidth: "620px",
                  color: "rgba(255,255,255,.76)",
                  fontSize: "18px",
                  lineHeight: "1.7",
                }}
              >
                Find buyers, check fit, research, write, send, follow up, reply, call and book, from one platform with
                one shared record of every prospect and one credit pool.
              </p>
              <div style={{ marginTop: "30px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Link
                  href="/pricing"
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
                  See pricing
                </Link>
              </div>
            </div>
            <div className="gd-panel">
              <small>What one agent replaces</small>
              <ul>
                <li>
                  <span className="gd-x">Lead database</span>
                  <span className="gd-ok">GNX</span>
                </li>
                <li>
                  <span className="gd-x">Enrichment tool</span>
                  <span className="gd-ok">GNX</span>
                </li>
                <li>
                  <span className="gd-x">Sequencer</span>
                  <span className="gd-ok">GNX</span>
                </li>
                <li>
                  <span className="gd-x">Cold email platform</span>
                  <span className="gd-ok">GNX</span>
                </li>
                <li>
                  <span className="gd-x">Dialer or voice agent</span>
                  <span className="gd-ok">GNX</span>
                </li>
                <li>
                  <span className="gd-x">Scheduling links</span>
                  <span className="gd-ok">GNX</span>
                </li>
                <li>
                  <span className="gd-x">The reply spreadsheet</span>
                  <span className="gd-ok">GNX</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Why one platform</div>
            <h2 className="gd-h2">Sales teams are drowning in tools.</h2>
            <p className="gd-lead">Salesforce surveyed 7,775 sales professionals. The answer was consistent.</p>
          </div>
          <div className="gd-g3" style={{ marginTop: "36px" }}>
            <div className="gd-lstat">
              <b>10</b>
              <p>tools, on average, that sales teams use to close deals.</p>
              <small>Salesforce State of Sales, 2022</small>
            </div>
            <div className="gd-lstat">
              <b>66%</b>
              <p>of sales reps say they are overwhelmed by the number of tools.</p>
              <small>Salesforce State of Sales, 2022</small>
            </div>
            <div className="gd-lstat">
              <b>94%</b>
              <p>of sales organisations planned to consolidate their tech stack.</p>
              <small>Salesforce State of Sales, 2022</small>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">What is inside</div>
          <h2 className="gd-h2">Nine parts. One system.</h2>
          <p className="gd-lead">Each one hands its work to the next, so nothing learned along the way is lost.</p>
        </div>
        <div className="gd-g3" style={{ marginTop: "36px" }}>
          <div className="gd-card">
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
                <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"></path>
              </svg>
            </div>
            <h3>Setup copilot</h3>
            <p>
              A guided flow builds your agent: what you sell, who buys, your value, pains and tone. It can draft your
              first campaign for you to confirm.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>Campaigns and qualification</h3>
            <p>
              Define your ideal customer once. Account and role fit are checked against clear, editable rules before any
              paid enrichment.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>Lead database and CSV</h3>
            <p>
              Search for people by title, seniority, location, industry and technology, upload a CSV, or add leads by
              hand.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>Email sequences</h3>
            <p>
              First email, follow-ups and last email are written together from verified facts, so step three builds on
              step one.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>AI voice calling</h3>
            <p>
              Each voice campaign gets its own agent, opens every call as an AI, runs ten scored test calls and books
              into real free time.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>Inbox and replies</h3>
            <p>
              Replies are read from your mailbox, threaded and drafted. A reply stops that prospect&apos;s follow-ups
              straight away.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>Calendar and booking</h3>
            <p>
              Set hours, buffers and notice. The server offers only open slots, and the database refuses a double
              booking.
            </p>
          </div>
          <div className="gd-card">
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
            <h3>Dashboard and analytics</h3>
            <p>
              Tasks, next meeting, weekly goal, reply rate, meetings booked, call outcomes and rejection reasons per
              campaign.
            </p>
          </div>
          <div className="gd-card">
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
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
              </svg>
            </div>
            <h3>AI Agent chat</h3>
            <p>
              Ask in plain English: find 50 ICP leads, summarise the hottest replies, pause weekend sending. You approve
              before it acts.
            </p>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">One record, every channel</div>
            <h2 className="gd-h2">Follow one lead through the platform.</h2>
            <p className="gd-lead">
              Because every step shares one record, the call knows what the emails said, and a reply anywhere stops
              everything.
            </p>
          </div>
          <ol className="gd-tl" style={{ marginTop: "36px" }}>
            <li>
              <i>Found</i>
              <b>Matched and qualified</b>
              <span>
                Pulled from the lead database, checked against the campaign&apos;s rules, and kept only if the email is
                verified.
              </span>
            </li>
            <li>
              <i>Researched</i>
              <b>Ready: 7 of 10</b>
              <span>Enriched, then scored on what is actually known. Missing facts are named, not guessed.</span>
            </li>
            <li>
              <i>Contacted</i>
              <b>Emailed, then called</b>
              <span>
                A three-step sequence goes out in their local hours. If they never open, the AI caller tries the phone.
              </span>
            </li>
            <li>
              <i>Booked</i>
              <b>On your calendar</b>
              <span>They pick an open slot. The meeting, transcript and history sit on the same record.</span>
            </li>
          </ol>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Control</div>
          <h2 className="gd-h2">You decide how far the agent goes.</h2>
        </div>
        <div className="gd-g2" style={{ marginTop: "36px" }}>
          <div className="gd-col" style={{ background: "#fbfefc", borderColor: "#a8e6c7" }}>
            <h3>You control</h3>
            <ul>
              <li>
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
                <div>
                  Review before send<span>Every draft waits for you by default</span>
                </div>
              </li>
              <li>
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
                <div>
                  Autopilot per campaign<span>Only where you trust the output</span>
                </div>
              </li>
              <li>
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
                <div>
                  Credit ceiling per campaign<span>The agent stops before going over</span>
                </div>
              </li>
              <li>
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
                <div>
                  Send windows and daily caps<span>In each lead&apos;s local hours</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="gd-col" style={{ background: "var(--bg)" }}>
            <h3>Always on</h3>
            <ul>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#69786f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
                <div>
                  A reply stops follow-ups<span>Also on booked, not interested, unsubscribed</span>
                </div>
              </li>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#69786f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
                <div>
                  Do Not Call screen<span>Before every dial</span>
                </div>
              </li>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#69786f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
                <div>
                  One-click unsubscribe<span>In every email</span>
                </div>
              </li>
              <li>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#69786f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
                <div>
                  Verified emails only<span>By default, to protect your domain</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Works with what you have</div>
            <h2 className="gd-h2">No migration, no new infrastructure.</h2>
          </div>
          <div className="gd-g3" style={{ marginTop: "36px" }}>
            <div className="gd-card">
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
              <h3>Your mailboxes</h3>
              <p>
                Gmail and Google Workspace with an app password, Outlook, or any provider over SMTP and IMAP. Up to 30
                inboxes on Startup.
              </p>
            </div>
            <div className="gd-card">
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
              <h3>Built-in calendar</h3>
              <p>Meetings book into GNX Calendar with your saved meeting link. Google Calendar sync is coming soon.</p>
            </div>
            <div className="gd-card">
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
                  <path d="M6 3h9l4 4v14H6z"></path>
                  <path d="M14 3v5h5M9 13h7M9 17h5"></path>
                </svg>
              </div>
              <h3>Your data</h3>
              <p>
                Import leads by CSV with column mapping. GNX keeps its own Prospects, Pipeline and Inbox, so you can run
                outbound without a CRM.
              </p>
            </div>
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
            <div className="gd-eyebrow">Questions</div>
            <h2 className="gd-h2">Platform questions</h2>
            <p className="gd-lead">
              More in the <Link href="/faq">full FAQ</Link>, or <Link href="/contact">ask us</Link>.
            </p>
          </div>
          <div style={{ flex: "999 1 600px", minWidth: "0" }}>
            <FaqSection items={faqs} className="" />
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "72px 24px 24px" }}>
        <h2
          style={{
            margin: "0",
            fontFamily: "var(--font-display)",
            fontWeight: "600",
            fontSize: "26px",
            letterSpacing: "-.025em",
          }}
        >
          Keep exploring
        </h2>
        <div className="gd-g3" style={{ marginTop: "22px" }}>
          <Link className="gd-other" href="/voice">
            <div style={{ flex: "1" }}>
              <b>AI Calls</b>
              <span>How the AI caller works and stays honest</span>
            </div>
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
          <Link className="gd-other" href="/accuracy">
            <div style={{ flex: "1" }}>
              <b>No Guessing</b>
              <span>How every email stays true</span>
            </div>
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
          <Link className="gd-other" href="/pricing">
            <div style={{ flex: "1" }}>
              <b>Pricing</b>
              <span>Plans from $59 a month</span>
            </div>
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
      </section>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: "56px",
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
          <div style={{ maxWidth: "620px" }}>
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
              Retire five tools.
              <br />
              <span style={{ color: "#6fe7b0" }}>Keep one agent.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Plans start at $59 a month with email, enrichment and AI calling included.
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
      <div style={{ background: "#041f16", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "22px 24px",
            color: "rgba(255,255,255,.55)",
            fontSize: "12.5px",
            lineHeight: "1.8",
          }}
        >
          <strong style={{ color: "#fff" }}>Sources:</strong>{" "}
          <a
            href="https://www.salesforce.com/news/stories/sales-research-2023/"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Salesforce, State of Sales (2022)
          </a>{" "}
          ·{" "}
          <a
            href="https://www.gartner.com/en/newsroom/press-releases/2026-07-28-gartner-predicts-ai-agents-will-outnumber-sellers-10-to-1-by-2028-yet-fewer-than-40-percent-of-sellers-will-say-agents-improved-productivity"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Gartner, AI agents and sellers (2026)
          </a>
        </div>
      </div>
      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "The platform", path: "/platform" }]} />
    </div>
  );
}
