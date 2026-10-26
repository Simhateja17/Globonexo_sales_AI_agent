"use client";
import Link from "next/link";
import Icon from "../ui/Icon";
import FaqSection from "../marketing/FaqSection";
import { LoopAnimator, QualifyCards, ReadyCard, VoiceStage } from "./LandingInteractive";
import { MOST_POPULAR_PLAN_ID, PLAN_CONFIG } from "../../lib/plans";
import FreePlanStrip from "../marketing/FreePlanStrip";

const CALENDLY_URL = "https://calendly.com/gnxsales-support/30min";

const PRIMARY_BTN = {
  background: "linear-gradient(180deg, #29d68f, #00c27a)",
  color: "#06231a",
  boxShadow: "0 12px 30px rgba(0,194,122,.35)",
};
const OUTLINE_BTN = { background: "#fff", border: "1.5px solid #0a1712", color: "#0a1712" };
const GHOST_BTN = { background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.22)", color: "#fff" };

const faqs = [
  {
    q: "Will it make things up about my prospects?",
    a: "No. It writes only from facts it verified about the person and the company. If one of the four required facts is missing, it does not draft the email at all. Guesses about pain points become questions, never claims.",
  },
  {
    q: "Am I locked into a contract?",
    a: "No. Plans run month to month, or yearly at a lower price. There is no setup fee and upgrades are prorated. You can also start on the Free plan with a work email, no card needed.",
  },
  {
    q: "Will it hurt my email deliverability?",
    a: "It sends from your own inbox inside a daily cap, only to verified emails by default, and every email carries the one-click unsubscribe header that Gmail and Yahoo require of bulk senders.",
  },
  {
    q: "Does the caller say it is an AI?",
    a: "Yes. Every call opens with the agent saying it is an AI assistant calling for your company. It ends the call on a do-not-call request, and outbound calls are capped at 10 minutes.",
  },
  {
    q: "How much of my time does it take?",
    a: "Setup takes one sitting: connect your inbox, describe what you sell and who you sell to, and pick your leads. After that you review drafts, or switch on autopilot, and step in when a buyer replies or books.",
  },
  {
    q: "How is it different from hiring an SDR?",
    a: "An SDR costs about $80K a year in on-target pay and takes around three months to ramp. GNX starts at $59 a month and starts working the day you set it up. It does not replace a closer. It keeps the top of your funnel full.",
  },
];

// Everything below the product demo on the homepage: trust strip, problem,
// loop, qualification, no-guessing, AI calls, co-pilot, audiences, plans, FAQ and closing call to action.
export default function LandingSections({ user, loading }) {
  return (
    <div className="gd-landing">
      <LoopAnimator />
      <section style={{ borderBottom: "1px solid #e7ede9" }}>
        <div className="gd-g4" style={{ maxWidth: "1160px", margin: "0 auto", padding: "36px 24px" }}>
          <div className="gd-fact">
            <span className="gd-ci">
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
            </span>
            <div>
              <b>Verified emails only</b>
              <span>Unverified addresses are skipped by default, so bounces stay low.</span>
            </div>
          </div>
          <div className="gd-fact">
            <span className="gd-ci">
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
            </span>
            <div>
              <b>10 test calls before launch</b>
              <span>An optional simulation scores the AI caller before it dials.</span>
            </div>
          </div>
          <div className="gd-fact">
            <span className="gd-ci">
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
                <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </span>
            <div>
              <b>AI disclosed on every call</b>
              <span>The caller says it is an AI assistant in its first sentence.</span>
            </div>
          </div>
          <div className="gd-fact">
            <span className="gd-ci">
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
                <path d="M12 7v5l3 2"></path>
              </svg>
            </span>
            <div>
              <b>Month to month</b>
              <span>No setup fee. Upgrade, downgrade or cancel when you need to.</span>
            </div>
          </div>
        </div>
      </section>
      <section style={{ background: "#f6faf8", borderBottom: "1px solid #e7ede9" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <div className="gd-eyebrow">The problem</div>
            <h2 className="gd-h2">Faster outreach to the wrong person is still the wrong person.</h2>
            <p className="gd-lead">
              Most outbound tools help you send more. The hard part is sending less, to the right people, with something
              true to say.
            </p>
          </div>
          <div className="gd-g3" style={{ marginTop: "36px" }}>
            <div className="gd-lstat">
              <b>10 tools</b>
              <p>The average sales team juggles to close deals, and most reps feel overwhelmed by them.</p>
              <small>Salesforce, State of Sales</small>
            </div>
            <div className="gd-lstat">
              <b>3 to 5%</b>
              <p>Typical reply rate for cold email. Most replies come from follow-ups, not the first send.</p>
              <small>Saleshandy and Woodpecker, 2026</small>
            </div>
            <div className="gd-lstat">
              <b>~370 dials</b>
              <p>Needed for one booked meeting from cold calling, at a 9.9% connect rate.</p>
              <small>Belkins, cold calling benchmarks 2026</small>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px 72px" }}>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <div className="gd-eyebrow">How it works</div>
            <h2 className="gd-h2">One agent runs the whole loop.</h2>
            <p className="gd-lead">
              Each campaign prepares up to 25 qualified leads a week, then works each one from the first email to the
              booked meeting.
            </p>
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
            <g>
              <circle r="16" fill="#00c27a" opacity=".18">
                <animateMotion
                  dur="14s"
                  repeatCount="indefinite"
                  path="M556,85 A420,215 0 1,1 556,515 A420,215 0 1,1 556,85"
                ></animateMotion>
              </circle>
              <circle r="7" fill="#00a86b" stroke="#fff" strokeWidth="2.5">
                <animateMotion
                  dur="14s"
                  repeatCount="indefinite"
                  path="M556,85 A420,215 0 1,1 556,515 A420,215 0 1,1 556,85"
                ></animateMotion>
              </circle>
            </g>
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#00a86b;#00a86b;#e7ede9;#e7ede9;#00a86b;#00a86b"
                  keyTimes="0.0000;0.0750;0.0850;0.9650;0.9750;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="2.5;2.5;1.5;1.5;2.5;2.5"
                  keyTimes="0.0000;0.0750;0.0850;0.9650;0.9750;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.1146;0.1246;0.2246;0.2346;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.1146;0.1246;0.2246;0.2346;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.2150;0.2250;0.3250;0.3350;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.2150;0.2250;0.3250;0.3350;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.3154;0.3254;0.4254;0.4354;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.3154;0.3254;0.4254;0.4354;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.4650;0.4750;0.5750;0.5850;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.4650;0.4750;0.5750;0.5850;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.6146;0.6246;0.7246;0.7346;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.6146;0.6246;0.7246;0.7346;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.7150;0.7250;0.8250;0.8350;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.7150;0.7250;0.8250;0.8350;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              <rect width="210" height="80" rx="16" fill="#fff" stroke="#e7ede9" strokeWidth="1.5">
                <animate
                  attributeName="stroke"
                  values="#e7ede9;#e7ede9;#00a86b;#00a86b;#e7ede9;#e7ede9"
                  keyTimes="0.0000;0.8154;0.8254;0.9254;0.9354;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  values="1.5;1.5;2.5;2.5;1.5;1.5"
                  keyTimes="0.0000;0.8154;0.8254;0.9254;0.9354;1.0000"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="discrete"
                ></animate>
              </rect>
              <text x="18" y="33" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="600" fill="#9aa8a0">
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
              fontFamily="Space Grotesk, sans-serif"
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
              fontFamily="Space Grotesk, sans-serif"
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
        </div>
      </section>
      <section
        className="gd-js-qual"
        style={{ background: "#f6faf8", borderTop: "1px solid #e7ede9", borderBottom: "1px solid #e7ede9" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <div className="gd-eyebrow">Qualification</div>
            <h2 className="gd-h2">It checks fit before it spends a cent.</h2>
            <p className="gd-lead">
              Every lead is tested against the same four questions before any credits go on revealing contacts or
              writing. Leads that fail are dropped, not padded into your list.
            </p>
          </div>
          <QualifyCards />
        </div>
      </section>
      <section className="gd-js-ready">
        <div className="gd-split" style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div className="gd-splitv">
            <ReadyCard />
          </div>
          <div className="gd-splitc">
            <div style={{ maxWidth: "760px" }}>
              <div className="gd-eyebrow">No guessing</div>
              <h2 className="gd-h2">It never makes things up about your prospects.</h2>
              <p className="gd-lead">
                51% of B2B buyers say GenAI is more likely to mislead them than a sales rep. So GNX writes from verified
                facts only, and shows you which ones it used.
              </p>
              <Link className="gd-tlink" href="/accuracy">
                How No Guessing works{" "}
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
            <div className="gd-g2" style={{ marginTop: "28px" }}>
              <div className="gd-mini">
                <span className="gd-ci">
                  <svg
                    width="18"
                    height="18"
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
                </span>
                <b>It states what it does not know</b>
                <span>
                  The model gets an explicit list of missing facts, not a vague instruction to avoid making things up.
                </span>
              </div>
              <div className="gd-mini">
                <span className="gd-ci">
                  <svg
                    width="18"
                    height="18"
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
                </span>
                <b>Facts and guesses stay separate</b>
                <span>
                  A verified headcount is a fact. &quot;They are struggling with pipeline&quot; is a guess, and guesses
                  become questions, never claims.
                </span>
              </div>
              <div className="gd-mini">
                <span className="gd-ci">
                  <svg
                    width="18"
                    height="18"
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
                </span>
                <b>Readiness you can act on</b>
                <span>
                  A lead reads as &quot;6 of 10 ready&quot; with the missing pieces named, so you know exactly what to
                  add.
                </span>
              </div>
              <div className="gd-mini">
                <span className="gd-ci">
                  <svg
                    width="18"
                    height="18"
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
                </span>
                <b>Nothing is written on thin air</b>
                <span>
                  Without the four required facts, no message is drafted at all. Silence beats a confident guess.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ background: "#f6faf8", borderTop: "1px solid #e7ede9", borderBottom: "1px solid #e7ede9" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <div className="gd-eyebrow">AI calls</div>
            <h2 className="gd-h2">We try to break Nexo before it phones anyone.</h2>
            <p className="gd-lead">
              Before a voice campaign dials, Nexo takes 10 hostile test calls and every transcript is scored. Listen in
              on four of them.
            </p>
            <Link className="gd-tlink" href="/voice">
              How AI calls work{" "}
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
          <VoiceStage />
          <p className="gd-vx-note">
            Sample test calls written to show what each test checks. Real runs use your own agent and cost 100 credits
            for all 10 calls.
          </p>
          <div className="gd-g4" style={{ marginTop: "32px" }}>
            <div className="gd-fact">
              <span className="gd-ci">
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
                  <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </span>
              <div>
                <b>Says it is an AI</b>
                <span>In the first sentence of every call.</span>
              </div>
            </div>
            <div className="gd-fact">
              <span className="gd-ci">
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
              </span>
              <div>
                <b>Never invents facts</b>
                <span>No made-up customers, results or prices.</span>
              </div>
            </div>
            <div className="gd-fact">
              <span className="gd-ci">
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
              </span>
              <div>
                <b>Stops on request</b>
                <span>A do-not-call request ends the call at once.</span>
              </div>
            </div>
            <div className="gd-fact">
              <span className="gd-ci">
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
                  <path d="M12 7v5l3 2"></path>
                </svg>
              </span>
              <div>
                <b>Capped at 10 minutes</b>
                <span>Every call logged with a transcript.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="gd-split" style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div className="gd-splitv">
            <div className="gd-cp">
              <div className="gd-cph">
                <b>
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
                    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"></path>
                  </svg>{" "}
                  AI Co-Pilot
                </b>
                <span className="gd-vpill">Live</span>
              </div>
              <div className="gd-cpb gd-you">Which leads need me today?</div>
              <div className="gd-cpb gd-agent">
                Three replied overnight and are waiting on you.
                <div className="gd-cprows">
                  <div>
                    <b>Head of RevOps · Bluepeak</b>
                    <span>Asked about pricing</span>
                  </div>
                  <div>
                    <b>VP Sales · Fernpoint</b>
                    <span>Wants a call Thursday</span>
                  </div>
                  <div>
                    <b>Founder · Oakline</b>
                    <span>Replied to step 2</span>
                  </div>
                </div>
              </div>
              <div className="gd-cpb gd-you">Pause everything until Monday.</div>
              <div className="gd-cpb gd-agent">
                Paused 4 live campaigns. Nothing will send or dial until you resume.
              </div>
              <div className="gd-cpi">
                <svg
                  width="15"
                  height="15"
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
                <span>Ask your agent anything…</span>
              </div>
            </div>
          </div>
          <div className="gd-splitc">
            <div style={{ maxWidth: "760px" }}>
              <div className="gd-eyebrow">AI Co-Pilot</div>
              <h2 className="gd-h2">Run it by telling it what to do.</h2>
              <p className="gd-lead">
                Your co-pilot runs the outreach on its own, but you never have to hunt through screens to steer it. Ask
                in plain English and it does the work.
              </p>
              <Link className="gd-tlink" href="/platform">
                See everything the agent does{" "}
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
            <ul className="gd-ticks">
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
                <span>Ask it in plain English, no hunting through screens</span>
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
                <span>Pause every live campaign with one sentence</span>
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
                <span>It keeps working between your campaigns, not just inside them</span>
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
                <span>Autopilot changes who approves a message, never what gets checked</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section style={{ background: "#f6faf8", borderTop: "1px solid #e7ede9", borderBottom: "1px solid #e7ede9" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <div className="gd-eyebrow">Who it&apos;s for</div>
            <h2 className="gd-h2">Built for three kinds of sellers.</h2>
            <p className="gd-lead">
              Pick the one that sounds like you. Each has its own page with the numbers that matter for it.
            </p>
          </div>
          <div className="gd-g3" style={{ marginTop: "40px" }}>
            <Link className="gd-who" href="/solutions/individuals">
              <span className="gd-ci">
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
              </span>
              <small>For an individual</small>
              <b>You are the whole sales team.</b>
              <p>Prospecting, follow-ups and calls handled while you do the selling.</p>
              <div className="gd-whof">
                <span>Individual plan · $59/mo</span>
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
              </div>
            </Link>
            <Link className="gd-who" href="/solutions/agencies">
              <span className="gd-ci">
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
              </span>
              <small>For an agency</small>
              <b>Outbound for every client.</b>
              <p>A campaign per client, 5 seats, 10 inboxes and an inbound AI receptionist.</p>
              <div className="gd-whof">
                <span>Agency plan · $179/mo</span>
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
              </div>
            </Link>
            <Link className="gd-who" href="/solutions/b2b-startups">
              <span className="gd-ci">
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
              </span>
              <small>For a B2B startup</small>
              <b>A sales motion before your first hire.</b>
              <p>25 email campaigns, 15 seats, up to 500 emails a day and ~550 calls a month.</p>
              <div className="gd-whof">
                <span>Startup plan · $479/mo</span>
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
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <div className="gd-eyebrow">Pricing</div>
            <h2 className="gd-h2">Start free. Add calling when you are ready.</h2>
            <p className="gd-lead">
              Pay month to month or save about 17% yearly. Credits cover emails, contact reveals and call minutes, at
              cost.
            </p>
          </div>
          <FreePlanStrip style={{ marginTop: "40px" }} />
          <div className="gd-g3" style={{ alignItems: "stretch" }}>
            {PLAN_CONFIG.map((plan) => {
              const featured = plan.id === MOST_POPULAR_PLAN_ID;
              return (
                <div key={plan.id} className={`gd-plan${featured ? " is-pop" : ""}`}>
                  <div className="gd-phd">
                    <small>{plan.name}</small>
                    {featured && <span className="gd-pop">Most popular</span>}
                  </div>
                  <div className="gd-pp">
                    ${plan.monthly}
                    <span>/month</span>
                  </div>
                  <div className="gd-py">or ${plan.annualMonthly}/month billed yearly</div>
                  <ul>
                    <li>
                      <span>Credits a month</span>
                      <b>{plan.monthlyCredits.toLocaleString()}</b>
                    </li>
                    <li>
                      <span>Email campaigns</span>
                      <b>{plan.emailCampaigns}</b>
                    </li>
                    <li>
                      <span>Voice campaigns</span>
                      <b>{plan.voiceCampaigns}</b>
                    </li>
                    <li>
                      <span>Emails a day</span>
                      <b>{plan.dailyEmailCap}</b>
                    </li>
                    <li>
                      <span>Seats</span>
                      <b>{plan.maxSeats}</b>
                    </li>
                  </ul>
                  <Link href="/pricing" className="gd-lbtn" style={featured ? PRIMARY_BTN : OUTLINE_BTN}>
                    Choose {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="gd-pfacts">
            <span>
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
              Month to month
            </span>
            <span>
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
              No setup fee
            </span>
            <span>
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
              Seats included
            </span>
            <span>
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
              Upgrades are prorated
            </span>
            <Link className="gd-tlink" href="/pricing" style={{ margin: "0" }}>
              Compare every feature{" "}
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
        </div>
      </section>
      <section style={{ background: "#f6faf8", borderTop: "1px solid #e7ede9" }}>
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
            <h2 className="gd-h2">What buyers ask before they start.</h2>
            <p className="gd-lead">
              More in the <Link href="/faq">full FAQ</Link> and the <Link href="/help">Help Center</Link>, or{" "}
              <Link href="/contact">ask us</Link>.
            </p>
          </div>
          <div style={{ flex: "999 1 600px", minWidth: "0" }}>
            <FaqSection items={faqs} className="" />
          </div>
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
            padding: "88px 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <h2
              style={{
                margin: "0",
                fontFamily: "var(--font-display)",
                fontWeight: "600",
                fontSize: "46px",
                lineHeight: "1.05",
                letterSpacing: "-.035em",
              }}
            >
              Put your AI sales agent
              <br />
              <span style={{ color: "#6fe7b0" }}>to work this week.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Month to month. No setup fee. Plans from $59, with calling in every one.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", visibility: loading ? "hidden" : undefined }}>
            {user ? (
              <Link href="/dashboard" className="gd-lbtn" style={PRIMARY_BTN}>
                Back to dashboard <Icon name="arrow" size={16} color="#06231a" />
              </Link>
            ) : (
              <Link href="/signup" className="gd-lbtn" style={PRIMARY_BTN}>
                Choose a plan <Icon name="arrow" size={16} color="#06231a" />
              </Link>
            )}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="gd-lbtn" style={GHOST_BTN}>
              Book a 30-min demo
            </a>
          </div>
        </div>
      </section>
      <div style={{ background: "#041f16", borderBottom: "1px solid rgba(255,255,255,.08)" }}></div>
    </div>
  );
}
