export const metadata = {
  title: "AI Sales Agent for Agencies Running Client Outbound",
  description:
    "Run outbound for every client from one system. Separate ideal customer profiles, positioning, sequences, and voice agents per client, lead discovery, enrichment, email, follow-ups, replies, and calls without accounts bleeding into one another.",
  alternates: { canonical: "/solutions/agencies" },
  openGraph: {
    url: "/solutions/agencies",
    title: "AI Sales Agent for Agencies Running Client Outbound",
    description:
      "One system, every client kept separate: profiles, positioning, sequences, and voice agents that never share a prompt.",
  },
};

import Link from "next/link";
import FaqSection from "../../../components/marketing/FaqSection";
import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "Can I run outbound for several clients from one account?",
    a: "Yes. Each client's work lives in its own campaigns, with its own targeting, prompt notes, frozen brief, sending inbox and voice agent. Agency runs up to 10 email and 4 voice campaigns at once.",
  },
  {
    q: "How do you stop one client's leads reaching another's campaign?",
    a: "Targeting and qualification live on the campaign, not the account. A lead sourced for one campaign is judged against that campaign's rules and enters only that pipeline.",
  },
  {
    q: "What happens if a client changes their positioning?",
    a: "A campaign locks in the tone, value proposition, pain points and objections it was created with. New positioning applies to campaigns you create afterwards, and never rewrites what already went out.",
  },
  {
    q: "How is this priced for an agency?",
    a: "One subscription at $179 a month, or $149 billed yearly, with 5 seats, 10 inboxes, 3 phone numbers and 5,370 monthly credits. Adding a client uses capacity, not a new per-client fee.",
  },
  {
    q: "What do I show a client at the end of the month?",
    a: "Per-campaign emails sent, reply rate, meetings booked, call outcomes and credit use, plus the reasons leads were rejected, so a shortfall reads as a targeting insight.",
  },
  {
    q: "Can I use it to win clients for my own agency?",
    a: "Yes. Run a campaign for your own offer next to your client campaigns. With most agencies relying on referrals, a steady outbound line is a real advantage.",
  },
];

export default function AgenciesPage() {
  return (
    <div className="public-page gd-page gd-sol gd-page-solutions-agencies">
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
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>For agencies</span>
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
                For an agency
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
                Run outbound for every client, <span style={{ color: "#6fe7b0" }}>from one place.</span>
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
                For lead generation and growth agencies. Each client gets its own campaigns, targeting, inbox and voice
                agent, out of one subscription, with reporting you can put in front of a client.
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
                  Start on Agency{" "}
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
              <small>Agency plan</small>
              <div className="gd-pr">
                $179<span> /month</span>
              </div>
              <div style={{ marginTop: "6px", color: "rgba(255,255,255,.6)", fontSize: "13px", fontWeight: "700" }}>
                $149 a month billed yearly
              </div>
              <ul>
                <li>
                  Email campaigns at once<b>10</b>
                </li>
                <li>
                  Voice campaigns at once<b>4</b>
                </li>
                <li>
                  Sending inboxes<b>10</b>
                </li>
                <li>
                  Seats<b>5</b>
                </li>
                <li>
                  Phone numbers<b>3</b>
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
            <div className="gd-eyebrow">The agency math</div>
            <h2 className="gd-h2">Clients pay for meetings. Tools should not eat the margin.</h2>
          </div>
          <div className="gd-g3" style={{ marginTop: "36px" }}>
            <div className="gd-lstat">
              <b>$2k to $15k</b>
              <p>a month is what B2B outbound agencies commonly charge clients on retainer.</p>
              <small>Vendor estimates, Cleverly and SalesBread, 2025 to 2026</small>
            </div>
            <div className="gd-lstat">
              <b>$150 to $500</b>
              <p>per meeting is a typical pay-per-meeting price for SMB appointments.</p>
              <small>Vendor estimates, Cleverly and SalesBread</small>
            </div>
            <div className="gd-lstat">
              <b>75%</b>
              <p>
                of marketing and professional services firms say referrals are their best lead source. Only 7% call
                their pipeline strong and growing.
              </p>
              <small>RSW/US survey, September 2025</small>
            </div>
          </div>
          <p
            style={{
              margin: "28px 0 0",
              maxWidth: "760px",
              color: "var(--muted)",
              fontSize: "15.5px",
              lineHeight: "1.7",
            }}
          >
            One Agency plan at $179 a month runs up to 10 client email campaigns and 4 voice campaigns at once. Use it
            for your clients, and for your own new business too.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Per client, end to end</div>
          <h2 className="gd-h2">Every step runs against that client&apos;s brief.</h2>
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
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="5"></circle>
                <circle cx="12" cy="12" r="1"></circle>
              </svg>
            </div>
            <h3>Targeting per client</h3>
            <p>
              Each campaign carries its own ideal customer: titles, seniority, locations, industries, company HQ and
              technologies. A fintech client&apos;s list never touches a logistics client&apos;s.
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
            <h3>Short lists you can explain</h3>
            <p>
              Fit is checked before paid enrichment, and rejected leads stay visible with a reason, such as no work
              email or a shared inbox. That is your answer when a client asks why the list came in short.
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
            <h3>Each client&apos;s own inbox</h3>
            <p>
              Connect up to 10 sending inboxes. Send each client&apos;s campaign from their domain, and assign the inbox
              to the teammate who runs that account.
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
            <h3>Replies that stop the sequence</h3>
            <p>
              Replies thread in Inbox and get drafted for review. A reply stops that prospect&apos;s follow-ups, so no
              client hears about an email sent after their buyer answered.
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
            <h3>A voice agent per campaign</h3>
            <p>
              Every voice campaign builds its own agent, with ten scored test calls before launch, a Do Not Call screen
              before every dial and an AI disclosure on every call.
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
            <h3>Reports a client will accept</h3>
            <p>
              Emails sent, reply rate, meetings booked and call outcomes per campaign, plus credit use. The monthly
              report becomes a screenshot, not an evening.
            </p>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Keeping clients apart</div>
            <h2 className="gd-h2">Five things stop one client&apos;s pitch reaching another&apos;s buyers.</h2>
          </div>
          <div className="gd-g2" style={{ marginTop: "36px" }}>
            <div className="gd-col" style={{ background: "#fbfefc", borderColor: "#a8e6c7" }}>
              <h3>Separated per campaign</h3>
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
                    Targeting and qualification rules<span>Leads are judged against that campaign only</span>
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
                    Prompt notes<span>Everything the agent should know about this client</span>
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
                    A frozen brief
                    <span>
                      Tone, value proposition, pain points and objections are locked in when the campaign is created
                    </span>
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
                    A voice agent<span>Two clients never share one call script</span>
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
                    A sending inbox<span>Each client&apos;s email comes from their own mailbox</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="gd-col" style={{ background: "var(--bg)" }}>
              <h3>Shared across the workspace</h3>
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
                    Unsubscribes and Do Not Call<span>An opt-out is honoured on every campaign, for safety</span>
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
                    Your team<span>Five seats. Invite members into your workspace</span>
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
                    The credit pool<span>One monthly allowance, with a ceiling per campaign</span>
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
                    One subscription<span>Billed once, however many clients you run</span>
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
                    Calendar<span>One calendar and one default meeting link today</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
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
            Honest limits for agencies today
          </h3>
          <ul>
            <li>
              All meetings land in one shared Calendar with one default meeting link. Separate calendars per client are
              not available yet.
            </li>
            <li>
              New campaigns copy tone and positioning from your workspace settings. Put each client&apos;s specifics in
              that campaign&apos;s prompt notes.
            </li>
            <li>
              Each campaign prepares up to 25 qualified leads a week, and the plan caps sending at 200 emails a day
              across all clients.
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
            <h2 className="gd-h2">Questions agencies ask</h2>
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
          <Link className="gd-other" href="/solutions/b2b-startups">
            <div style={{ flex: "1" }}>
              <b>For a B2B startup</b>
              <span>A motion before your first sales hire</span>
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
              Add your next client
              <br />
              <span style={{ color: "#6fe7b0" }}>without adding a tool.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Agency is $179 a month for up to 10 email and 4 voice campaigns at once.
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
            href="https://www.cleverly.co/blog/b2b-lead-generation-agency-cost"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cleverly, B2B lead generation agency cost (2026)
          </a>{" "}
          ·{" "}
          <a
            href="https://salesbread.com/appointment-setting-services-cost/"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            SalesBread, appointment setting cost (2025)
          </a>{" "}
          ·{" "}
          <a
            href="https://www.agilitypr.com/pr-agency-news/pipeline-crisis-93-of-marketing-services-and-professional-services-firms-say-their-growth-engine-isnt-strong-enough/"
            style={{ fontWeight: "700" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            RSW/US survey via Agility PR (2025)
          </a>
        </div>
      </div>
      <PublicFooter />
      <BreadcrumbSchema
        trail={[
          { name: "Solutions", path: "/solutions" },
          { name: "For an agency", path: "/solutions/agencies" },
        ]}
      />
    </div>
  );
}
