export const metadata = {
  title: "AI Sales Agent for Individual Sellers and Founders",
  description:
    "Run B2B outbound without a full sales team. GNX Sales helps individual sellers find and qualify leads, prepare personalized email sequences, follow up, handle replies, and place AI voice calls.",
  alternates: { canonical: "/solutions/individuals" },
  openGraph: {
    images: ["/og-image.png"],
    url: "/solutions/individuals",
    title: "AI Sales Agent for Individual Sellers and Founders",
    description: "A practical outbound workflow for one person, with review controls for email and AI voice campaigns.",
  },
};

import Link from "next/link";
import FaqSection from "../../../components/marketing/FaqSection";
import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "Is GNX Sales right for one person?",
    a: "Yes. Individual is built for one person running outbound alone: founders, consultants and solo sellers. Lead discovery, qualification, email, replies and AI calls run from one account instead of several tools.",
  },
  {
    q: "Will emails send without my approval?",
    a: "Not by default. Every draft waits for you to edit, regenerate or approve it. Autopilot is an optional switch you can turn on per campaign later.",
  },
  {
    q: "Do I need my own lead list?",
    a: "No. Search the built-in lead database, upload a CSV, or add people by hand.",
  },
  {
    q: "Can I use email and AI calls on the same plan?",
    a: "Yes. Individual includes 3 email campaigns and 1 voice campaign at a time, all drawing from the same 2,645 monthly credits.",
  },
  {
    q: "Does GNX guarantee meetings?",
    a: "No. Results depend on your market, offer, targeting, data and sending setup. GNX runs and measures the work, and shows you why leads were rejected so you can improve the next round.",
  },
];

export default function IndividualsPage() {
  return (
    <div className="public-page gd-page gd-sol gd-page-solutions-individuals">
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
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>For an individual</span>
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
                For an individual
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
                You are the whole sales team. <span style={{ color: "#6fe7b0" }}>Now you have help.</span>
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
                For founders, consultants and solo sellers. GNX finds and qualifies prospects, writes the emails,
                follows up, drafts replies and makes AI calls, while you approve what goes out and take the meetings.
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
                  Start on Individual{" "}
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
              <small>Individual plan</small>
              <div className="gd-pr">
                $59<span> /month</span>
              </div>
              <div style={{ marginTop: "6px", color: "rgba(255,255,255,.6)", fontSize: "13px", fontWeight: "700" }}>
                $49 a month billed yearly
              </div>
              <ul>
                <li>
                  Monthly credits<b>2,645</b>
                </li>
                <li>
                  Email campaigns at once<b>3</b>
                </li>
                <li>
                  Voice campaigns at once<b>1</b>
                </li>
                <li>
                  Emails a day<b>100</b>
                </li>
                <li>
                  Inbox and phone number<b>1 each</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Sound familiar?</div>
          <h2 className="gd-h2">Selling alone breaks in the same four places.</h2>
          <p className="gd-lead">GNX was built around them.</p>
        </div>
        <div className="gd-g2" style={{ marginTop: "36px" }}>
          <div className="gd-pain">
            <div className="gd-q">I know who buys. Finding and researching them eats my mornings.</div>
            <p>Every hour on lead lists and LinkedIn tabs is an hour not spent on the product or on actual calls.</p>
            <div className="gd-fix">
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
              <span>
                Describe your ideal customer once. The agent searches, checks fit before paying for data, and researches
                each person.
              </span>
            </div>
          </div>
          <div className="gd-pain">
            <div className="gd-q">My follow-ups slip the moment I get busy.</div>
            <p>
              In two large 2026 datasets, 42% to 57% of replies came from follow-ups, not the first email. Dropping them
              throws that away.
            </p>
            <div className="gd-fix">
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
              <span>
                Follow-ups run on schedule in each lead&apos;s local hours, and stop the moment someone replies.
              </span>
            </div>
          </div>
          <div className="gd-pain">
            <div className="gd-q">Templates get ignored, and I have no time to personalise.</div>
            <p>
              Gartner found 67% of B2B buyers would rather buy without talking to a rep. A generic pitch is easy to
              delete.
            </p>
            <div className="gd-fix">
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
              <span>
                Each email is written from verified facts about that person. If the facts are missing, nothing is
                written.
              </span>
            </div>
          </div>
          <div className="gd-pain">
            <div className="gd-q">Cold calling feels like a second full-time job.</div>
            <p>Some buyers never open email. Calling them yourself is the most expensive hour of your week.</p>
            <div className="gd-fix">
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
              <span>
                An AI voice agent calls, says up front that it is an AI, handles common objections and books the
                meeting.
              </span>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">What changes</div>
            <h2 className="gd-h2">Hand off the grind. Keep the judgment.</h2>
          </div>
          <div className="gd-g2" style={{ marginTop: "36px" }}>
            <div className="gd-col" style={{ background: "#fbfefc", borderColor: "#a8e6c7" }}>
              <h3>The agent takes</h3>
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
                    Finding and qualifying leads<span>Database search or your own CSV</span>
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
                    Researching and writing<span>A full sequence from verified facts</span>
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
                    Sending, follow-ups and reply drafts<span>Paced, and nothing sits unanswered</span>
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
                    First calls and booking<span>Only into time that is really free</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="gd-col" style={{ background: "var(--bg)" }}>
              <h3>You keep</h3>
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
                    Who you sell to<span>Your ideal customer, in your words</span>
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
                    What goes out<span>Every draft waits for you by default</span>
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
                    The meeting itself<span>The conversation is yours</span>
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
                    Pricing and closing<span>The agent never negotiates</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">A typical week</div>
          <h2 className="gd-h2">How the work actually flows.</h2>
          <p className="gd-lead">
            Your schedule, set in Calendar and the campaign. The agent does its part around you.
          </p>
        </div>
        <ol className="gd-tl" style={{ marginTop: "36px" }}>
          <li>
            <i>Once</i>
            <b>Set it up</b>
            <span>
              Work through the five onboarding steps, connect your inbox, set your availability and create a campaign.
            </span>
          </li>
          <li>
            <i>Weekend</i>
            <b>Leads get prepared</b>
            <span>
              On your lead preparation days, Saturday and Sunday by default, the agent finds, enriches, researches and
              drafts.
            </span>
          </li>
          <li>
            <i>Monday</i>
            <b>You review</b>
            <span>Read the drafts, edit or regenerate any you do not like, and approve the rest in one go.</span>
          </li>
          <li>
            <i>All week</i>
            <b>It runs</b>
            <span>
              Emails go out in each lead&apos;s working hours. Replies land in Inbox, and booked meetings appear in
              Calendar.
            </span>
          </li>
        </ol>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px 96px" }}>
        <div className="gd-g2">
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
              What to know first
            </h3>
            <ul>
              <li>One seat, one inbox and one phone number. Need more? Agency adds them.</li>
              <li>The inbound AI receptionist is not included on Individual.</li>
              <li>GNX does not warm a new domain for you. Warm it before your first campaign.</li>
              <li>No plan guarantees meetings. Results depend on your offer, market and list.</li>
            </ul>
          </div>
          <div className="gd-col" style={{ background: "var(--bg)" }}>
            <h3>You stay in control</h3>
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
                  Review is the default<span>Nothing sends until you approve it</span>
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
                  Autopilot is per campaign<span>Turn it on only where you trust the output</span>
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
                  A reply stops the sequence<span>Also on booked, not interested or unsubscribed</span>
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
                  Every rejection has a reason<span>So a short list tells you what to fix</span>
                </div>
              </li>
            </ul>
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
            <h2 className="gd-h2">Questions solo sellers ask</h2>
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
              Get your mornings back.
              <br />
              <span style={{ color: "#6fe7b0" }}>Keep the meetings.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Individual is $59 a month with email, enrichment and AI calling included.
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
          { name: "For an individual", path: "/solutions/individuals" },
        ]}
      />
    </div>
  );
}
