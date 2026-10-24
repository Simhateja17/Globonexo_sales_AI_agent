export const metadata = {
  title: "AI Sales Agent for B2B Startups Building Outbound",
  description:
    "Build an in-house outbound motion before you hire an SDR. Lead discovery, enrichment, personalized email, follow-ups, replies, and AI voice calls running in parallel across segments, from one subscription.",
  alternates: { canonical: "/solutions/b2b-startups" },
  openGraph: {
    images: ["/og-image.png"],
    url: "/solutions/b2b-startups",
    title: "AI Sales Agent for B2B Startups Building Outbound",
    description: "An outbound motion you can run before your first SDR hire, across several segments at once.",
  },
};

import Link from "next/link";
import FaqSection from "../../../components/marketing/FaqSection";
import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "Should we use an AI sales agent before hiring an SDR?",
    a: "It is a practical way to define and test outbound before growing the team. The setup makes you write down your ideal customer, rules and messaging, which your first sales hire can build on.",
  },
  {
    q: "Does this work before product-market fit?",
    a: "It can show which segments respond, quickly and cheaply. It cannot create demand. Separate campaigns give each segment its own targeting and messaging, and the results show which guesses deserve more testing.",
  },
  {
    q: "How many campaigns can we run at once?",
    a: "Startup runs up to 25 email and 10 voice campaigns at once, with up to 500 emails a day and 14,370 monthly credits.",
  },
  {
    q: "Do we need a lead list to start?",
    a: "No. Search the built-in lead database, upload a CSV, or add people by hand.",
  },
  {
    q: "How long until the first meeting?",
    a: "Most teams launch their first campaign in one sitting. When meetings arrive depends on your market, offer, list and cadence, so we do not promise a date.",
  },
  {
    q: "Can we stay in control of what gets sent?",
    a: "Yes, by default. Every draft waits for review, and you can edit, regenerate or approve in bulk. Autopilot is turned on per campaign, and it changes who approves a message, never whether it was checked.",
  },
];

export default function B2bStartupsPage() {
  return (
    <div className="public-page gd-page gd-sol gd-page-solutions-b2b-startups">
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
            <Link className="gd-crumb" href="/solutions">
              Solutions
            </Link>
            <span aria-hidden="true" style={{ color: "rgba(255,255,255,.35)" }}>
              /
            </span>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>For B2B startups</span>
          </nav>
          <div style={{ marginTop: "40px", display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "flex-end" }}>
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
                For a B2B startup
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
                Build an outbound motion <span style={{ color: "#6fe7b0" }}>before you hire for it.</span>
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
                For early B2B teams. Test several segments at once, learn who actually buys, and leave a working,
                written-down motion for the sales hire who comes next.
              </p>
              <div style={{ marginTop: "30px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
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
                  Start on Startup{" "}
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
            <div className="gd-pc">
              <small>Startup plan</small>
              <div className="gd-pr">
                $479<span> /month</span>
              </div>
              <div style={{ marginTop: "6px", color: "rgba(255,255,255,.6)", fontSize: "13px", fontWeight: "700" }}>
                $399 a month billed yearly
              </div>
              <ul>
                <li>
                  Email campaigns at once<b>25</b>
                </li>
                <li>
                  Voice campaigns at once<b>10</b>
                </li>
                <li>
                  Emails a day<b>500</b>
                </li>
                <li>
                  Seats<b>15</b>
                </li>
                <li>
                  Inboxes and numbers<b>30 and 10</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Before your first SDR hire</div>
          <h2 className="gd-h2">What a first sales hire involves, next to GNX.</h2>
          <p className="gd-lead">
            Not either or. Many teams run GNX first, then hand a working motion to the person they hire.
          </p>
        </div>
        <div className="gd-cmp" style={{ marginTop: "36px" }}>
          <div className="gd-cmp-row gd-cmp-h">
            <div></div>
            <div>A typical first SDR</div>
            <div>GNX Sales, Startup plan</div>
          </div>
          <div className="gd-cmp-row">
            <div>Cost</div>
            <div>$80K median on-target earnings, $55K of it base</div>
            <div>$479 a month, or $4,788 a year billed yearly</div>
          </div>
          <div className="gd-cmp-row">
            <div>Time to ramp</div>
            <div>About 3 months on average</div>
            <div>Running once onboarding, an inbox and a campaign are set up</div>
          </div>
          <div className="gd-cmp-row">
            <div>How long it lasts</div>
            <div>1.9 years average tenure</div>
            <div>Stays, with the playbook written down</div>
          </div>
          <div className="gd-cmp-row">
            <div>Monthly target</div>
            <div>Around 10 held meetings is the median quota</div>
            <div>No meeting quota promised. You see every result</div>
          </div>
          <div className="gd-cmp-row">
            <div>What it does best</div>
            <div>Live conversations and judgment</div>
            <div>Research, writing, follow-up, first calls, booking</div>
          </div>
        </div>
        <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: "13px", fontWeight: "600" }}>
          SDR figures from The Bridge Group 2025 SDR Metrics Report. They exclude tools, data and management time.
        </p>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Find out who buys</div>
            <h2 className="gd-h2">Test three guesses at once, not one per quarter.</h2>
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
                  <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                </svg>
              </div>
              <h3>A campaign per segment</h3>
              <p>
                Run up to 25 email campaigns at once, each with its own ideal customer and qualification rules, so
                segments are compared side by side.
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
              <h3>Enrichment that protects runway</h3>
              <p>
                Fit is checked before paid enrichment, and every rejection keeps a reason. That is how you learn a
                segment you believed in has few reachable buyers.
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
              <h3>Personal email without a copywriter</h3>
              <p>
                Each email is written from what is known about that person. When the essentials are missing, nothing is
                drafted.
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
              <h3>Calls without hiring a caller</h3>
              <p>
                AI voice campaigns reach buyers who skip email, after ten scored test calls and a Do Not Call screen.
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
              <h3>Meetings on the founder&apos;s calendar</h3>
              <p>
                Set your hours, buffers and notice. The agent offers only open slots and books with your meeting link.
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
              <h3>Evidence for the next board update</h3>
              <p>
                Reply rate by campaign, meetings booked, call outcomes and rejection reasons show which segment to
                double down on.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">When you do hire</div>
          <h2 className="gd-h2">Your first sales hire inherits a motion, not a blank page.</h2>
        </div>
        <div className="gd-g2" style={{ marginTop: "36px" }}>
          <div className="gd-col" style={{ background: "#fbfefc", borderColor: "#a8e6c7" }}>
            <h3>What they get on day one</h3>
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
                  A written ideal customer<span>Targeting and rules, not tribal knowledge</span>
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
                  A record of what was tried<span>Every campaign, message and result</span>
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
                  Working inboxes and numbers<span>Ready to use</span>
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
                  A seat waiting<span>Startup includes 15</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="gd-col" style={{ background: "var(--bg)" }}>
            <h3>What they spend time on</h3>
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
                  Conversations the agent booked<span>Discovery and demos</span>
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
                  Deals that need judgment<span>Pricing, procurement, negotiation</span>
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
                  Sharpening the playbook<span>Using the data the agent produced</span>
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
                  Steering the agent<span>Better targeting and prompt notes each week</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px 96px" }}>
        <div className="gd-lim">
          <h3>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8a5a00"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3l9 16H3l9-16z"></path>
              <path d="M12 10v4M12 17v.5"></path>
            </svg>
            The honest limit
          </h3>
          <ul>
            <li>
              GNX makes a good offer reach more of the right people. It cannot create demand. Poor product-market fit
              was a factor in 43% of recent venture-backed shutdowns CB Insights studied.
            </li>
            <li>
              Each campaign prepares up to 25 qualified leads a week. Scale by running more campaigns, up to 25 at once.
            </li>
            <li>
              Meeting timing depends on your market, offer, list and follow-up cadence. No fixed time to first meeting
              is promised.
            </li>
          </ul>
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
            <h2 className="gd-h2">Questions startups ask</h2>
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
          Not quite you?
        </h2>
        <div
          style={{
            marginTop: "22px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          <Link className="gd-other" href="/solutions/individuals">
            <div style={{ flex: "1" }}>
              <b>For an individual</b>
              <span>Outbound when you are the whole sales team</span>
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
          <Link className="gd-other" href="/solutions/agencies">
            <div style={{ flex: "1" }}>
              <b>For an agency</b>
              <span>Outbound for every client, kept separate</span>
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
          <Link className="gd-other" href="/solutions">
            <div style={{ flex: "1" }}>
              <b>All solutions</b>
              <span>Compare plans side by side</span>
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
              Test three segments
              <br />
              <span style={{ color: "#6fe7b0" }}>this month.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Startup is $479 a month for up to 25 email and 10 voice campaigns at once.
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
              Start free
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
      <div style={{ background: "#041f16", borderBottom: "1px solid rgba(255,255,255,.08)" }}></div>
      <PublicFooter />
      <BreadcrumbSchema
        trail={[
          { name: "Solutions", path: "/solutions" },
          { name: "For a B2B startup", path: "/solutions/b2b-startups" },
        ]}
      />
    </div>
  );
}
