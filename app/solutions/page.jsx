export const metadata = {
  title: "B2B Lead Generation with an AI SDR Tool",
  description:
    "B2B lead generation run by an AI SDR tool: sourcing, qualification, email sequences, and voice calls. See how it fits an individual seller, an agency running outbound for clients, or a startup building outbound in-house.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    url: "/solutions",
    title: "B2B Lead Generation with an AI SDR Tool",
    description:
      "Sales engagement software that sources, qualifies, writes, sends, and calls, framed for individuals, agencies, and startups.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "Which plan should I start on?",
    a: "Go by volume and people, not by label. One person with one inbox fits Individual. Several inboxes, teammates or clients fit Agency. Many segments at once, or more than 200 emails a day, fit Startup. You can change plan anytime from Billing.",
  },
  {
    q: "Do higher plans unlock better features?",
    a: "Almost none. Every plan has AI email sequences, lead enrichment, AI voice calling and reply drafting. Higher plans add volume, seats, inboxes and numbers. The one feature held back is the inbound AI receptionist, which comes with Agency and Startup.",
  },
  {
    q: "What is an AI SDR, and does it replace a person?",
    a: "It does what a sales development rep does before a deal reaches a closer: builds the list, researches, writes, follows up, handles early replies and books meetings. It takes over the repetitive half. A person still runs the conversation and closes.",
  },
  {
    q: "Will it work if I have not found product-market fit?",
    a: "It can show you which segments respond, quickly and cheaply. It cannot create demand. Poor product-market fit was a factor in 43% of recent venture-backed shutdowns CB Insights studied, and faster outreach to the wrong market only fails faster.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan runs 1 email campaign from your own company inbox, up to 30 emails a day and about 200 AI-written emails a month, on your own leads (CSV or paste, up to 500). Lead enrichment and AI calling are on paid plans. No card needed. Sign up with a work email; each company gets one Free workspace.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="public-page gd-page gd-sol gd-page-solutions">
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
            left: "50%",
            top: "-260px",
            marginLeft: "-280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(41,214,143,.45), rgba(41,214,143,0) 70%)",
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
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)",
            maskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)",
          }}
        ></div>
        <div
          style={{
            position: "relative",
            maxWidth: "920px",
            margin: "0 auto",
            padding: "88px 24px 150px",
            textAlign: "center",
          }}
        >
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
            Solutions
          </div>
          <h1
            style={{
              margin: "24px 0 0",
              fontFamily: "var(--font-display)",
              fontWeight: "600",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              lineHeight: "1",
              letterSpacing: "-.05em",
            }}
          >
            Outbound that fits
            <br />
            <span style={{ color: "#6fe7b0" }}>how you sell.</span>
          </h1>
          <p
            style={{
              margin: "24px auto 0",
              maxWidth: "640px",
              color: "rgba(255,255,255,.76)",
              fontSize: "18.5px",
              lineHeight: "1.7",
            }}
          >
            Selling alone, running outbound for clients, or building a motion before your first sales hire. One AI sales
            agent finds your buyers, emails and calls them, and books the meeting. Your plan sets the volume.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "-96px auto 0", padding: "0 24px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
          <Link className="gd-seg" href="/solutions/individuals">
            <div className="gd-seg-top">
              <div className="gd-seg-ic">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 21a8 8 0 0 1 16 0"></path>
                </svg>
              </div>
              <small>For an individual</small>
              <h3>You are the whole sales team.</h3>
            </div>
            <div className="gd-seg-b">
              <p>
                Founders, consultants and solo sellers who need meetings but cannot spend every day researching, writing
                and chasing.
              </p>
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
                  The agent does the research and writing
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
                  You approve before anything sends
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
                  Email and AI calls in one place
                </li>
              </ul>
              <div className="gd-seg-f">
                <div className="gd-price">
                  $59<span> /month, Individual</span>
                </div>
                <span className="gd-go">
                  See how{" "}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
          <Link className="gd-seg" href="/solutions/agencies">
            <div className="gd-seg-top">
              <div className="gd-seg-ic">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2"></rect>
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"></path>
                </svg>
              </div>
              <small>For an agency</small>
              <h3>Outbound for every client.</h3>
            </div>
            <div className="gd-seg-b">
              <p>
                Lead generation and growth agencies that run outreach for several clients and need each one kept
                separate.
              </p>
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
                  A campaign, targeting and inbox per client
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
                  Rejection reasons a client will accept
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
                  Five seats for your team
                </li>
              </ul>
              <div className="gd-seg-f">
                <div className="gd-price">
                  $179<span> /month, Agency</span>
                </div>
                <span className="gd-go">
                  See how{" "}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
          <Link className="gd-seg" href="/solutions/b2b-startups">
            <div className="gd-seg-top">
              <div className="gd-seg-ic">
                <svg
                  width="22"
                  height="22"
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
              <small>For a B2B startup</small>
              <h3>A motion before the first hire.</h3>
            </div>
            <div className="gd-seg-b">
              <p>
                Early teams that need to learn which segment buys, and build outbound a future sales hire can take over.
              </p>
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
                  Test several segments at once
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
                  Up to 500 emails a day
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
                  Fifteen seats as the team grows
                </li>
              </ul>
              <div className="gd-seg-f">
                <div className="gd-price">
                  $479<span> /month, Startup</span>
                </div>
                <span className="gd-go">
                  See how{" "}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px 40px" }}>
        <div style={{ maxWidth: "680px" }}>
          <div className="gd-eyebrow">Same agent, every plan</div>
          <h2 className="gd-h2">The full loop, whoever you are.</h2>
          <p className="gd-lead">Every plan runs all eight steps. Only the volume changes.</p>
        </div>
        <svg
          className="gd-loop-svg"
          viewBox="0 0 1112 600"
          width="100%"
          role="img"
          aria-label="The outbound loop: find, qualify, research, write, send, reply, call, book, then back to find"
          style={{ display: "block", marginTop: "24px", height: "auto" }}
        >
          <ellipse
            cx="556.0"
            cy="300.0"
            rx="420"
            ry="215"
            fill="none"
            stroke="#cfe9db"
            strokeWidth="2"
            strokeDasharray="6 8"
          ></ellipse>
          <g transform="translate(716.7 101.4) rotate(12.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(944.0 217.7) rotate(51.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(944.0 382.3) rotate(129.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(716.7 498.6) rotate(168.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(395.3 498.6) rotate(-168.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(168.0 382.3) rotate(-129.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(168.0 217.7) rotate(-51.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(395.3 101.4) rotate(-12.0)">
            <circle r="13" fill="#088256"></circle>
            <path
              d="M-4 -5 L3 0 L-4 5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
          <g transform="translate(451.0 45.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              01
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Find
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              Lead database or your CSV
            </text>
          </g>
          <g transform="translate(748.0 108.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              02
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Qualify
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              Fit checked before paid data
            </text>
          </g>
          <g transform="translate(871.0 260.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              03
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Research
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              Notes what it cannot verify
            </text>
          </g>
          <g transform="translate(748.0 412.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              04
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Write
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              A full sequence, from facts
            </text>
          </g>
          <g transform="translate(451.0 475.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              05
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Send
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              Paced, in local hours
            </text>
          </g>
          <g transform="translate(154.0 412.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              06
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Reply
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              Drafted, follow-ups stop
            </text>
          </g>
          <g transform="translate(31.0 260.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              07
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Call
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              AI voice that says it is AI
            </text>
          </g>
          <g transform="translate(154.0 108.0)">
            <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5"></rect>
            <text
              x="18"
              y="33"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="13"
              fontWeight="600"
              fill="#9aa8a0"
            >
              08
            </text>
            <text x="46" y="33" fontFamily="Manrope, sans-serif" fontSize="17" fontWeight="800" fill="#0a1712">
              Book
            </text>
            <text x="18" y="57" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="600" fill="#69786f">
              Only into free time
            </text>
          </g>
          <text
            x="556.0"
            y="278.0"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-display)" }}
            fontSize="34"
            fontWeight="600"
            fill="#0a1712"
            letterSpacing="-1"
          >
            One agent.
          </text>
          <text
            x="556.0"
            y="318.0"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-display)" }}
            fontSize="34"
            fontWeight="600"
            fill="#088256"
            letterSpacing="-1"
          >
            Every plan.
          </text>
          <text
            x="556.0"
            y="352.0"
            textAnchor="middle"
            fontFamily="Manrope, sans-serif"
            fontSize="14"
            fontWeight="700"
            fill="#69786f"
          >
            Runs again every week with fresh leads
          </text>
        </svg>
        <ol className="gd-loop-list" style={{ margin: "28px 0 0", padding: "0", listStyle: "none" }}>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>01</span>
            <span>
              <b style={{ color: "#0a1712" }}>Find</b>{" "}
              <span style={{ color: "#69786f" }}>Lead database or your CSV</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>02</span>
            <span>
              <b style={{ color: "#0a1712" }}>Qualify</b>{" "}
              <span style={{ color: "#69786f" }}>Fit checked before paid data</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>03</span>
            <span>
              <b style={{ color: "#0a1712" }}>Research</b>{" "}
              <span style={{ color: "#69786f" }}>Notes what it cannot verify</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>04</span>
            <span>
              <b style={{ color: "#0a1712" }}>Write</b>{" "}
              <span style={{ color: "#69786f" }}>A full sequence, from facts</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>05</span>
            <span>
              <b style={{ color: "#0a1712" }}>Send</b> <span style={{ color: "#69786f" }}>Paced, in local hours</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>06</span>
            <span>
              <b style={{ color: "#0a1712" }}>Reply</b>{" "}
              <span style={{ color: "#69786f" }}>Drafted, follow-ups stop</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>07</span>
            <span>
              <b style={{ color: "#0a1712" }}>Call</b>{" "}
              <span style={{ color: "#69786f" }}>AI voice that says it is AI</span>
            </span>
          </li>
          <li style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #e7ede9" }}>
            <span style={{ color: "#9aa8a0", fontWeight: "800" }}>08</span>
            <span>
              <b style={{ color: "#0a1712" }}>Book</b> <span style={{ color: "#69786f" }}>Only into free time</span>
            </span>
          </li>
          <li style={{ padding: "12px 0", color: "#088256", fontWeight: "800" }}>Then back to Find, every week</li>
        </ol>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "40px 24px 96px" }}>
        <div className="gd-plan">
          <table>
            <caption
              style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}
            >
              What each plan includes
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    color: "var(--muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  Plan
                </th>
                <th scope="col">
                  Individual<span>$59 a month, $49 yearly</span>
                </th>
                <th scope="col">
                  Agency<span>$179 a month, $149 yearly</span>
                </th>
                <th scope="col">
                  Startup<span>$479 a month, $399 yearly</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Monthly credits</th>
                <td>2,645</td>
                <td>5,370</td>
                <td>14,370</td>
              </tr>
              <tr>
                <th scope="row">Email campaigns at once</th>
                <td>3</td>
                <td>10</td>
                <td>25</td>
              </tr>
              <tr>
                <th scope="row">Voice campaigns at once</th>
                <td>1</td>
                <td>4</td>
                <td>10</td>
              </tr>
              <tr>
                <th scope="row">Emails a day</th>
                <td>100</td>
                <td>200</td>
                <td>500</td>
              </tr>
              <tr>
                <th scope="row">Seats</th>
                <td>1</td>
                <td>5</td>
                <td>15</td>
              </tr>
              <tr>
                <th scope="row">Sending inboxes</th>
                <td>1</td>
                <td>10</td>
                <td>30</td>
              </tr>
              <tr>
                <th scope="row">Phone numbers</th>
                <td>1</td>
                <td>3</td>
                <td>10</td>
              </tr>
              <tr>
                <th scope="row">Inbound AI receptionist</th>
                <td style={{ color: "var(--muted)", fontWeight: "700" }}>Not included</td>
                <td>Included</td>
                <td>Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">How B2B buyers act now</div>
            <h2 className="gd-h2">Buyers ignore pitches. They answer relevance.</h2>
            <p className="gd-lead">
              Gartner&apos;s buyer research explains why GNX is built to check facts, write for one reader, and hand the
              conversation to you at the right moment.
            </p>
          </div>
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            <div className="gd-lstat">
              <b>67%</b>
              <p>of B2B buyers prefer a buying experience without a sales rep.</p>
              <small>Gartner, 646 buyers, 2025</small>
              <em>So outreach has to earn the reply. Relevant facts, never a generic pitch.</em>
            </div>
            <div className="gd-lstat">
              <b>69%</b>
              <p>of buyers turn to sales reps to check what AI tools told them.</p>
              <small>Gartner, 645 buyers, 2025</small>
              <em>So the agent books the meeting, and a person you trust takes it.</em>
            </div>
            <div className="gd-lstat">
              <b>5 to 16</b>
              <p>people sit in a typical B2B buying group, across up to four functions.</p>
              <small>Gartner, 632 buyers, 2024</small>
              <em>So reaching the right roles matters more than reaching many people.</em>
            </div>
          </div>
        </div>
      </section>
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
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
            <h2 className="gd-h2">Which one is me?</h2>
            <p className="gd-lead">
              Still unsure? <Link href="/contact">Ask us</Link> and we will point you to the right plan.
            </p>
          </div>
          <div style={{ flex: "999 1 600px", minWidth: "0" }}>
            <FaqSection items={faqs} className="" />
          </div>
        </div>
      </section>
      <section
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "80px 24px 56px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <h2 className="gd-h2" style={{ margin: "0" }}>
            See it run on your pipeline.
          </h2>
          <p className="gd-lead">Start free, connect your inbox, and launch your first campaign.</p>
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
              boxShadow: "var(--sh-green)",
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
              background: "#fff",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            Book a demo
          </Link>
        </div>
      </section>
      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Solutions", path: "/solutions" }]} />
    </div>
  );
}
