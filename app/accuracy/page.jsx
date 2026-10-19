export const metadata = {
  title: { absolute: "No guessing, GNX Sales" },
  description:
    "How GNX Sales keeps AI outreach truthful: context readiness gates, facts separated from hypotheses, and every draft validated before a human ever sees it.",
  alternates: { canonical: "/accuracy" },
  openGraph: { url: "/accuracy" },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "Can the AI still make mistakes?",
    a: "Yes, AI can be wrong, which is why every draft waits for your review by default. The guardrails cut the most damaging errors: invented facts, wrong names and broken templates.",
  },
  {
    q: "Why did some of my leads get no email?",
    a: "Because a required fact was missing: the person's name, job title, company or a verified work email. The lead stays visible with the reason, so you can fix it or move on.",
  },
  {
    q: "Where does the information about each lead come from?",
    a: "From the lead database and enrichment, plus any details you upload or add. The agent only uses what came back, and says nothing about what did not.",
  },
  {
    q: "Does autopilot skip these checks?",
    a: "No. Autopilot changes who approves an email, never whether it was checked. Every draft passes the same eight checks either way.",
  },
  {
    q: "What does the AI caller do when it does not know something?",
    a: "It stays general and truthful, and refuses to invent customers, prices or results. That exact situation is one of the ten pre-launch test scenarios.",
  },
];

export default function AccuracyPage() {
  return (
    <div className="public-page gd-page gd-pg2 gd-page-accuracy">
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
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>No Guessing</span>
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
                How GNX writes
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
                No guessing.
                <br /> <span style={{ color: "#6fe7b0" }}>Every line is a fact or a question.</span>
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
                The fastest way to lose a buyer is a confident sentence about a problem they do not have. GNX tells the
                AI exactly what it knows, what it does not, and refuses to write when the basics are missing.
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
              <small>Lead readiness</small>
              <div
                style={{
                  marginTop: "10px",
                  fontFamily: "var(--font-display)",
                  fontSize: "44px",
                  fontWeight: "600",
                  letterSpacing: "-.03em",
                }}
              >
                7 of 10{" "}
                <span
                  style={{
                    fontSize: "16px",
                    color: "rgba(255,255,255,.6)",
                    fontFamily: "var(--font-body)",
                    fontWeight: "700",
                  }}
                >
                  optional facts
                </span>
              </div>
              <ul>
                <li>
                  Required facts<span className="gd-ok">4 of 4</span>
                </li>
                <li>
                  Estimated revenue<span className="gd-miss">Missing, not guessed</span>
                </li>
                <li>
                  Headcount growth<span className="gd-miss">Missing, not guessed</span>
                </li>
                <li>
                  Funding stage<span className="gd-miss">Missing, not guessed</span>
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
            <div className="gd-eyebrow">Why it matters</div>
            <h2 className="gd-h2">Buyers are already wary of AI.</h2>
          </div>
          <div className="gd-g3" style={{ marginTop: "36px" }}>
            <div className="gd-lstat">
              <b>51%</b>
              <p>
                of B2B buyers say they are more likely to meet misleading information from GenAI than from a sales rep.
              </p>
              <small>Gartner, 645 buyers, 2025</small>
            </div>
            <div className="gd-lstat">
              <b>69%</b>
              <p>of B2B buyers turn to sales reps to check what AI tools told them.</p>
              <small>Gartner, 645 buyers, 2025</small>
            </div>
            <div className="gd-lstat">
              <b>88%</b>
              <p>of people say they ignore marketing emails they suspect were written by AI.</p>
              <small>Exclaimer, 1,000 consumers, 2024</small>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">The rule</div>
          <h2 className="gd-h2">Three kinds of information, three treatments.</h2>
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
                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
              </svg>
            </div>
            <h3>Known: used as fact</h3>
            <p>A verified job title or a reported headcount. The email can state it plainly.</p>
          </div>
          <div className="gd-card">
            <div className="gd-ci" style={{ background: "#fff8ec", color: "#8a5a00" }}>
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
            <h3>Guessed: asked, never claimed</h3>
            <p>
              &quot;Pipeline might be a challenge&quot; becomes a question to the reader, not a statement about them.
            </p>
          </div>
          <div className="gd-card">
            <div className="gd-ci" style={{ background: "#f2f5f3", color: "#4b5a52" }}>
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
            <h3>Missing: left out</h3>
            <p>If a fact is not there, it is not mentioned. If a required fact is missing, no email is written.</p>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Readiness</div>
            <h2 className="gd-h2">Every lead gets an ingredient list, not a score.</h2>
            <p className="gd-lead">&quot;7 of 10 ready&quot; tells you what to fix. &quot;68%&quot; does not.</p>
          </div>
          <div className="gd-g2" style={{ marginTop: "36px" }}>
            <div className="gd-ing" style={{ borderColor: "#a8e6c7", background: "#fbfefc" }}>
              <h3>Required: 4 facts</h3>
              <p>All four or nothing gets written.</p>
              <ul>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Person name
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Job title
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Company name
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Work email
                </li>
              </ul>
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "#ecfdf3",
                  color: "#0a3d29",
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "1.6",
                }}
              >
                Scored only after enrichment finishes, so a lead is never judged while its facts are still arriving.
              </div>
            </div>
            <div className="gd-ing">
              <h3>Optional: 10 facts</h3>
              <p>Each one present is a fact the email is allowed to use.</p>
              <ul className="gd-two">
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Industry
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Company size
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  What the company does
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Location
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Seniority
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Department
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Technologies used
                </li>
                <li style={{ color: "#9aa8a0" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9aa8a0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 12h12"></path>
                  </svg>
                  Estimated revenue
                </li>
                <li style={{ color: "#9aa8a0" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9aa8a0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 12h12"></path>
                  </svg>
                  Headcount growth
                </li>
                <li style={{ color: "#9aa8a0" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9aa8a0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 12h12"></path>
                  </svg>
                  Funding stage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Checked before saving</div>
          <h2 className="gd-h2">Eight checks on every draft.</h2>
          <p className="gd-lead">
            A draft that fails any of these is never saved, so it can never be sent, whether you approve by hand or use
            autopilot.
          </p>
        </div>
        <div className="gd-g4" style={{ marginTop: "36px" }}>
          <div className="gd-vc">
            <code>wrong_recipient_name</code>
            <b>Wrong recipient</b>
            <span>The greeting names someone other than the lead.</span>
          </div>
          <div className="gd-vc">
            <code>unresolved_placeholder</code>
            <b>Unfilled placeholders</b>
            <span>Template variables that never got filled in.</span>
          </div>
          <div className="gd-vc">
            <code>markdown_or_html</code>
            <b>Leaked formatting</b>
            <span>Markdown or HTML in a plain-text email.</span>
          </div>
          <div className="gd-vc">
            <code>wrong_step</code>
            <b>Wrong sequence step</b>
            <span>Follow-up text saved as the first email.</span>
          </div>
          <div className="gd-vc">
            <code>duplicate_content</code>
            <b>Duplicate content</b>
            <span>The same text repeated across steps.</span>
          </div>
          <div className="gd-vc">
            <code>empty_subject</code>
            <b>Empty subject</b>
            <span>No subject line at all.</span>
          </div>
          <div className="gd-vc">
            <code>empty_body</code>
            <b>Empty body</b>
            <span>Nothing in the message.</span>
          </div>
          <div className="gd-vc">
            <code>subject_too_long</code>
            <b>Subject too long</b>
            <span>A subject line that would be cut off.</span>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Under the hood</div>
            <h2 className="gd-h2">How the guardrails work.</h2>
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
                  <path d="M6 3h9l4 4v14H6z"></path>
                  <path d="M14 3v5h5M9 13h7M9 17h5"></path>
                </svg>
              </div>
              <h3>The model is told what is missing</h3>
              <p>
                Instead of a vague warning not to make things up, the AI gets a concrete list: no funding stage, no
                headcount, no technologies.
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
              <h3>Facts and guesses are labelled apart</h3>
              <p>
                A reported headcount is a fact. A suspected challenge is a hypothesis, and hypotheses only ever become
                questions.
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
                  <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                  <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                </svg>
              </div>
              <h3>Every email is traceable</h3>
              <p>
                The facts behind each email are saved as a fixed, fingerprinted snapshot, so you can see exactly what it
                was written from.
              </p>
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
            What this means for you
          </h3>
          <ul>
            <li>
              Some leads get no email. That is the system working: a lead without a verified email, title or company is
              skipped and shown with the reason.
            </li>
            <li>Emails can be less flashy. A true, simple line beats a clever one that is wrong.</li>
            <li>
              Thin data means a more general email. Enrich a lead or pick a better segment and the writing gets sharper.
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
            <h2 className="gd-h2">Accuracy questions</h2>
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
          <Link className="gd-other" href="/platform">
            <div style={{ flex: "1" }}>
              <b>The Agent</b>
              <span>Everything the platform does, in one place</span>
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
              True beats clever.
              <br />
              <span style={{ color: "#6fe7b0" }}>Every single time.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              See the guardrails in action on your own leads. Plans from $59 a month.
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
      <div style={{ background: "#041f16", borderBottom: "1px solid rgba(255,255,255,.08)" }}></div>
      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "No guessing", path: "/accuracy" }]} />
    </div>
  );
}
