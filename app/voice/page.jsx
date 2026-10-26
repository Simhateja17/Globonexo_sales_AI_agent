export const metadata = {
  title: "AI Voice Agent Platform for Outbound Sales Calls",
  description:
    "Test an AI voice agent for sales before launch with selectable simulations. Outbound AI calling with do-not-call enforcement, real calendar booking, and a number provisioned for you.",
  alternates: { canonical: "/voice" },
  openGraph: {
    images: ["/og-image.png"],
    url: "/voice",
    title: "AI Voice Agent Platform for Outbound Sales Calls",
    description: "Outbound AI calling with selectable adversarial simulation testing before launch.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const faqs = [
  {
    q: "What is an AI voice agent for sales?",
    a: "Software that places calls and holds the conversation itself: it introduces your offer, runs discovery, handles objections and books a meeting. In GNX, each voice campaign gets its own agent built from that campaign's brief.",
  },
  {
    q: "Does the caller say it is an AI?",
    a: "Always. The first line of every outbound call says the caller is an AI assistant from your company, and the inbound receptionist opens the same way. Outbound calls end after 10 minutes, inbound calls after 20.",
  },
  {
    q: "Can I test the agent before it calls real prospects?",
    a: "Yes. Switch on the pre-launch test and the agent runs through ten scored scenarios, from a skeptic to a do-not-call request to a failing calendar. Each run uses 100 credits.",
  },
  {
    q: "Do I need to buy a phone number?",
    a: "No. Your plan includes its numbers: 1, 3 or 10. Extra numbers cost 200 credits each every 30 days.",
  },
  {
    q: "Can it book meetings during the call?",
    a: "Yes. It checks open slots on the server, offers only those, books the one the prospect picks and reads the time and timezone back.",
  },
  {
    q: "What does a call cost?",
    a: "Calls draw from your plan's credits. A real call averages about 27 credits, from 8 to 79 depending on length.",
  },
];

export default function VoicePage() {
  return (
    <div className="public-page gd-page gd-pg2 gd-page-voice">
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
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: "800" }}>AI Calls</span>
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
                AI voice agent
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
                An AI caller that is
                <br /> <span style={{ color: "#6fe7b0" }}>honest, tested and booked.</span>
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
                Reach the buyers who never open email. Every call opens by saying it is an AI, every agent is tested
                before it dials, and meetings land only in time that is really free.
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
              <small>How every call opens</small>
              <div className="gd-bubble gd-ai">
                <b>AI caller</b>Hi Sarah, this is Nexo, an AI assistant calling from Northwind. Did I catch you at an
                okay time for a quick question?
              </div>
              <div className="gd-bubble gd-me">
                <b>Prospect</b>Sure, I have a minute.
              </div>
              <div className="gd-bubble gd-ai">
                <b>AI caller</b>Thanks. I saw your team is hiring two SDRs. How are you handling outbound today?
              </div>
              <p style={{ margin: "14px 0 0", color: "rgba(255,255,255,.55)", fontSize: "12.5px", lineHeight: "1.5" }}>
                The opening line is fixed: the caller always says it is an AI. Names and details are illustrative.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Why AI for calling</div>
            <h2 className="gd-h2">Cold calling is a numbers game people cannot afford.</h2>
            <p className="gd-lead">Benchmarks from 175,000+ B2B dials in 2025.</p>
          </div>
          <div className="gd-g3" style={{ marginTop: "36px" }}>
            <div className="gd-lstat">
              <b>9.9%</b>
              <p>of cold dials reach a live person.</p>
              <small>Belkins, 2025 dial data</small>
            </div>
            <div className="gd-lstat">
              <b>~370</b>
              <p>dials, end to end, for one booked meeting.</p>
              <small>Belkins, 2025 dial data</small>
            </div>
            <div className="gd-lstat">
              <b>4.6%</b>
              <p>of live conversations turn into a meeting.</p>
              <small>Belkins, 2025 dial data</small>
            </div>
          </div>
          <p
            style={{
              margin: "24px 0 0",
              maxWidth: "760px",
              color: "var(--muted)",
              fontSize: "15.5px",
              lineHeight: "1.7",
            }}
          >
            That volume is why calling gets skipped. An AI caller takes the dials, voicemails and retries, so the
            meetings that come out of it land with you.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Anatomy of a call</div>
          <h2 className="gd-h2">What happens on every call.</h2>
        </div>
        <ol className="gd-tl" style={{ marginTop: "36px" }}>
          <li>
            <i>Before</i>
            <b>Screened</b>
            <span>
              You confirm consent and DNC checks when importing. GNX screens again and blocks any Do Not Call match
              before dialing.
            </span>
          </li>
          <li>
            <i>Opening</i>
            <b>Disclosed</b>
            <span>
              The first line says the caller is an AI assistant from your company, and asks if now is a good time.
            </span>
          </li>
          <li>
            <i>Talking</i>
            <b>On brief</b>
            <span>
              Discovery and objection handling come from that campaign&apos;s brief. A do-not-call request ends the call
              at once.
            </span>
          </li>
          <li>
            <i>Closing</i>
            <b>Booked and logged</b>
            <span>
              It offers only open slots, confirms time and timezone, then logs the recording, transcript and summary.
            </span>
          </li>
        </ol>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Tested before it phones anyone</div>
            <h2 className="gd-h2">Ten scored test calls, before launch.</h2>
            <p className="gd-lead">
              Switch on the pre-launch test and the agent faces ten scripted callers with pass and fail rules. Fix the
              campaign and run it again.
            </p>
          </div>
          <div className="gd-g5" style={{ marginTop: "36px" }}>
            <div className="gd-sc">
              <i>01</i>
              <div>
                <b>Interested prospect</b>
                <span>Runs discovery before pitching</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>02</i>
              <div>
                <b>Busy prospect</b>
                <span>Gets off the phone politely</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>03</i>
              <div>
                <b>Skeptical prospect</b>
                <span>Uses your approved answers</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>04</i>
              <div>
                <b>Wrong person</b>
                <span>Apologises and stops</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>05</i>
              <div>
                <b>Where did you get my number?</b>
                <span>No claims of private knowledge</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>06</i>
              <div>
                <b>Missing personalisation</b>
                <span>Stays generic and truthful</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>07</i>
              <div>
                <b>Do-not-call request</b>
                <span>Acknowledges and ends the call</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>08</i>
              <div>
                <b>Successful booking</b>
                <span>Real slot, time read back</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>09</i>
              <div>
                <b>Calendar tool fails</b>
                <span>Says it cannot check, invents nothing</span>
              </div>
            </div>
            <div className="gd-sc">
              <i>10</i>
              <div>
                <b>Pushed to invent facts</b>
                <span>Refuses to make up customers or prices</span>
              </div>
            </div>
          </div>
          <div className="gd-gnx">Each test run of all ten scenarios uses 100 credits.</div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">Booking and safety</div>
          <h2 className="gd-h2">Built so it cannot make things up.</h2>
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
                <rect x="3" y="5" width="18" height="16" rx="2"></rect>
                <path d="M3 10h18M8 3v4M16 3v4"></path>
              </svg>
            </div>
            <h3>Availability from the server</h3>
            <p>The agent never invents a time. The backend computes open slots and hands back a short list to offer.</p>
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
            <h3>No double booking</h3>
            <p>A database rule refuses two meetings in the same slot. If two calls race, one gets a new time.</p>
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
                <path d="M12 7v5l3 2"></path>
              </svg>
            </div>
            <h3>Hard limits on every call</h3>
            <p>
              Outbound calls end after 10 minutes, and 45 seconds of silence ends any call. Voicemail hangs up instead
              of rambling.
            </p>
          </div>
        </div>
      </section>
      <section
        style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className="gd-eyebrow">Inbound AI receptionist</div>
            <h2 className="gd-h2">Answer the calls that come back.</h2>
            <p className="gd-lead">On Agency and Startup, a separate inbound agent answers calls to your numbers.</p>
          </div>
          <div className="gd-g2" style={{ marginTop: "36px" }}>
            <div className="gd-col" style={{ background: "#fbfefc", borderColor: "#a8e6c7" }}>
              <h3>What it does</h3>
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
                    Opens as an AI<span>Its very first sentence says so</span>
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
                    Recognises callers<span>And caps minutes for unknown numbers each day</span>
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
                    Ends after 20 minutes<span>A hard limit on every inbound call</span>
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
                    Keeps nothing<span>Inbound recordings and transcripts are not retained</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="gd-col" style={{ background: "var(--bg)" }}>
              <h3>How you control it</h3>
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
                    Off by default<span>Switch it on in Settings</span>
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
                    Daily minute cap<span>For unknown callers, so credits stay safe</span>
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
                    One number list<span>Uses the numbers on your plan</span>
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
                    Plan based<span>Included on Agency and Startup</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div className="gd-eyebrow">The rules for AI calls</div>
          <h2 className="gd-h2">Disclosure is becoming the law. GNX already does it.</h2>
          <p className="gd-lead">A summary for US calling, as of October 2026. Not legal advice.</p>
        </div>
        <div className="gd-g4" style={{ marginTop: "36px" }}>
          <div className="gd-law">
            <small>Federal, 2024</small>
            <b>FCC and the TCPA</b>
            <span>
              AI-generated voices count as artificial voices, so these calls need the person&apos;s prior express
              consent.
            </span>
          </div>
          <div className="gd-law">
            <small>Federal, proposed</small>
            <b>FCC disclosure rule</b>
            <span>
              A 2024 proposal would require callers to disclose AI use when getting consent and on every call.
            </span>
          </div>
          <div className="gd-law">
            <small>Utah</small>
            <b>AI Policy Act</b>
            <span>Businesses must disclose AI when a consumer asks, and an AI may never claim to be human.</span>
          </div>
          <div className="gd-law">
            <small>Maine, 2025</small>
            <b>AI chatbot law</b>
            <span>
              Bars AI that could mislead someone into thinking they are talking to a human, including by voice.
            </span>
          </div>
        </div>
        <div className="gd-gnx">
          <b>Where GNX fits.</b> Every call opens with an AI disclosure and every Do Not Call match is blocked. Getting
          consent for the numbers you call stays with you.
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
            <h2 className="gd-h2">AI calling questions</h2>
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
              Let the AI take the dials.
              <br />
              <span style={{ color: "#6fe7b0" }}>You take the meetings.</span>
            </h2>
            <p style={{ margin: "16px 0 0", color: "rgba(255,255,255,.74)", fontSize: "16.5px", lineHeight: "1.7" }}>
              Outbound AI calling is included in every paid plan, from $59 a month.
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
      <BreadcrumbSchema trail={[{ name: "AI voice agent", path: "/voice" }]} />
    </div>
  );
}
