export const metadata = {
  title: "What Is an AI Sales Agent? A Complete Guide",
  description:
    "What an AI sales agent is, how it differs from sales automation software and an AI writing assistant, what it can and cannot do, how the loop works step by step, and how to evaluate one before you buy.",
  alternates: { canonical: "/ai-sales-agent-guide" },
  openGraph: {
    url: "/ai-sales-agent-guide",
    title: "What Is an AI Sales Agent? A Complete Guide",
    description:
      "How an AI sales agent works step by step, where it helps, where it does not, and how to evaluate one.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import GuideArticleLayout from "../../components/marketing/GuideArticleLayout";

const faqs = [
  {
    q: "What is an AI sales agent?",
    a: "Software that runs the outbound sales motion end to end instead of helping with one step. It finds accounts that match your ideal customer, qualifies and researches each contact, writes and sends a personal sequence, follows up, handles replies, calls, and books meetings.",
  },
  {
    q: "How is it different from sales automation software?",
    a: "Sales automation carries out tasks: sending on a schedule, updating records, triggering steps. An AI sales agent also makes the decisions: who is worth contacting, what is true about them, what to say and when to stop.",
  },
  {
    q: "Is it the same as an AI writing assistant?",
    a: "No. A writing assistant drafts on request from whatever is on screen. An agent owns the sequence: it decides who enters it, writes every step as one whole, sends on schedule, reacts to replies and stops on its own.",
  },
  {
    q: "Do AI sales agents actually book meetings?",
    a: "Yes, when booking is a real tool the agent uses, not a link it pastes. Check whether it reads live availability. An agent that offers times it has not checked will eventually double-book someone.",
  },
  {
    q: "Will prospects know they are talking to an AI?",
    a: "On calls, yes: every GNX Sales call opens by saying the caller is an AI agent. Emails are drafted by AI and, by default, approved by you before they send. You are still responsible for the rules where you sell. In the US, the FCC ruled in February 2024 that AI-generated voices fall under the TCPA's rules for artificial voices, so you need the person's prior express consent to call.",
  },
  {
    q: "What makes AI outreach fail?",
    a: "Confident, false personalisation. A line about a problem the company does not have is worse than a generic email, because it proves nobody looked. The fix is built in: tell the model exactly what it does not know, and stop it writing when the required facts are missing.",
  },
  {
    q: "How much does an AI sales agent cost?",
    a: "Usually a monthly subscription. What it charges for matters more than the headline price: per seat, per contact, per enriched record or per call minute produce very different bills at the same list size. GNX Sales plans run from $59 to $479 a month, with email, enrichment and calling drawn from one credit pool.",
  },
];

const toc = [
  { id: "definition", label: "The short definition" },
  { id: "loop", label: "How the loop works" },
  { id: "limits", label: "What it can and cannot do" },
  { id: "accuracy", label: "The failure mode that matters" },
  { id: "evaluate", label: "How to evaluate one" },
  { id: "faq", label: "Questions" },
];

const related = [
  {
    href: "/ai-sdr-tools",
    kicker: "Buyer's guide",
    title: "AI SDR tools: what they do and how to choose one",
    body: "Five kinds of product, and the seven questions that tell them apart.",
  },
  {
    href: "/b2b-lead-generation-tools",
    kicker: "Practical guide",
    title: "B2B lead generation tools",
    body: "The layers an AI agent has to replace, and what each one costs you.",
  },
  {
    href: "/accuracy",
    kicker: "How we build",
    title: "No guessing",
    body: "How GNX Sales keeps facts and guesses apart in every email.",
  },
];

export default function AiSalesAgentGuidePage() {
  return (
    <GuideArticleLayout
      slug="ai-sales-agent-guide"
      crumb="What is an AI sales agent?"
      eyebrow="Category guide"
      title={
        <>
          What is an AI
          <br />
          sales agent?
        </>
      }
      intro="An AI sales agent runs the outbound motion end to end: finding buyers, researching them, writing, sending, following up, calling and booking, instead of helping with one step. This guide covers how the loop works, what it can and cannot do, and how to judge one honestly."
      secondaryCta={{ href: "/platform", label: "See one running" }}
      meta={{
        reading: "8 min",
        updated: "Oct 2026",
        covers: "The 9-step loop, limits, the failure mode to watch, 7 buying questions",
      }}
      toc={toc}
      related={related}
      relatedHeading="Keep reading"
      cta={{
        heading: (
          <>
            See the whole loop run
            <br />
            <span className="gd-accent">on your own leads.</span>
          </>
        ),
        body: "Plans start at $59 a month with email, enrichment and AI calling included.",
      }}
      trail={[{ name: "What is an AI sales agent?", path: "/ai-sales-agent-guide" }]}
    >
      <article className="gd-art">
        <section id="definition">
          <h2>The short definition</h2>
          <p>
            An AI sales agent is software that owns the pre-close sales motion. It decides who to contact, works out
            what is true about them, writes what to say, sends it, follows up, answers replies, calls when email is not
            landing, and books the meeting.
          </p>
          <p>
            The word doing the work in that sentence is <em>decides</em>. Sales automation software carries out
            decisions you already made. An agent makes them, carries them out, and reports back on what it did. Every
            practical difference follows from that.
          </p>
          <div className="gd-fig">
            <b>28%</b>
            <span>
              of a sales rep&apos;s week goes to actually selling. Everything else in the week is work around the
              selling.<small>Salesforce State of Sales, survey of 7,775 sales professionals, 2022</small>
            </span>
          </div>
          <p>
            That gap is what an agent is for. It takes the research, writing, follow-up and scheduling, so the people
            left in the loop spend their time on conversations.
          </p>
          <div className="gd-callout">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6fe7b0"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flex: "none", marginTop: "2px" }}
            >
              <path d="M9 18h6M10 21h4"></path>
              <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"></path>
            </svg>
            <p>
              <b>A useful test</b>If the product cannot tell you why one person was contacted and another was not, it is
              automating sending, not running the motion.
            </p>
          </div>
        </section>
        <section id="loop">
          <h2>How the loop works, step by step</h2>
          <p>
            Nine steps, running all the time. Each hands its output to the next, so what the agent learned while finding
            someone is still there when it writes to them.
          </p>
          <ol className="gd-loop" style={{ margin: "30px 0 0", padding: "0", listStyle: "none" }}>
            <li>
              <div className="gd-ln">1</div>
              <div>
                <h3>
                  Understand the offer<span className="gd-tag">Once</span>
                </h3>
                <p>
                  The agent is set up once with what you sell, who buys it, the value it delivers, the pains it solves,
                  the objections you hear and the tone you use. Everything after is built from this, which is why a
                  vague setup gives vague outreach.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">2</div>
              <div>
                <h3>
                  Find the accounts<span className="gd-tag">Sourcing</span>
                </h3>
                <p>
                  It searches for companies and people that match your ideal customer: industries, titles, seniority,
                  location and company size. Or it takes a list you already have.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">3</div>
              <div>
                <h3>
                  Qualify before spending<span className="gd-tag">Sourcing</span>
                </h3>
                <p>
                  Each candidate is checked against a readable set of rules before any paid enrichment. This step
                  separates an agent from a sequencer, and decides whether your budget goes to people who could actually
                  buy.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">4</div>
              <div>
                <h3>
                  Research the person<span className="gd-tag">Research</span>
                </h3>
                <p>
                  Enrichment fills in a verified email, role, company detail, size and technologies. The agent also
                  records what it could not find, because that list is what keeps the writing honest.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">5</div>
              <div>
                <h3>
                  Write the sequence<span className="gd-tag">Email</span>
                </h3>
                <p>
                  First touch, follow-ups and the last email are written together, so later steps build on earlier ones
                  instead of repeating the pitch. Facts are used as facts. Guesses become questions, never claims.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">6</div>
              <div>
                <h3>
                  Send and follow up<span className="gd-tag">Email</span>
                </h3>
                <p>
                  Messages go out spread across sending windows, never blasted. Follow-ups run on schedule until
                  something changes, and a reply stops them automatically.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">7</div>
              <div>
                <h3>
                  Handle replies<span className="gd-tag">Email</span>
                </h3>
                <p>
                  Replies are read from your mailbox, threaded and drafted for you. By default a person approves before
                  anything goes back. Opt-outs are detected and honoured.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">8</div>
              <div>
                <h3>
                  Call when it helps<span className="gd-tag">Voice</span>
                </h3>
                <p>
                  An AI voice agent calls the prospects who never open email. It says up front that it is an AI, runs
                  discovery, handles objections with your approved answers, and stops at once on a do-not-call request.
                </p>
              </div>
            </li>
            <li>
              <div className="gd-ln">9</div>
              <div>
                <h3>
                  Book the meeting<span className="gd-tag">Calendar</span>
                </h3>
                <p>
                  It checks your real availability, offers only slots that exist, confirms the time and timezone back,
                  and books the meeting with your meeting link.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <section id="limits">
          <h2>What it can and cannot do</h2>
          <div className="gd-lists">
            <div className="gd-lc">
              <h3>What it does well</h3>
              <ul>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Build and qualify a target list against a profile you define once
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Research each person and record what it could not find
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Write one connected sequence, not three versions of the same email
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Send, pace and follow up on schedule without supervision
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Draft replies and stop the sequence the moment someone responds
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Place outbound calls and hold the conversation itself
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Book meetings only into time that is really free
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#088256"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                  Report what ran, what was rejected, and why
                </li>
              </ul>
            </div>
            <div className="gd-lc" style={{ background: "var(--bg)" }}>
              <h3>What it will not do for you</h3>
              <ul>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#69786f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                  Find product-market fit. Faster outreach to the wrong market just fails faster
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#69786f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                  Run a discovery call that needs real judgment about a complex deal
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#69786f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                  Negotiate pricing or terms
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#69786f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                  Take on your legal duties. In the US, AI voices count as &quot;artificial&quot; under the TCPA, so
                  calls need prior consent
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#69786f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                  Know anything about a prospect that is not in the data it was given
                </li>
                <li>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#69786f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18"></path>
                  </svg>
                  Rescue a weak offer with better wording
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section id="accuracy">
          <h2>The failure mode that matters</h2>
          <p>
            Most disappointing AI outreach stories have the same shape: a message that sounded specific and was not
            true. &quot;I know your team is struggling with X&quot;, written by a system that never knew that. Readers
            have learned to spot it, and it does more damage than a plainly generic email, because it proves nobody
            looked.
          </p>
          <p>
            The fix is not a better prompt asking the model not to make things up. It is giving the model an explicit
            list of what is known and missing for this person, keeping facts and guesses apart, turning guesses into
            questions, and refusing to write at all when the required facts are missing. That is how GNX Sales is built.{" "}
            <Link href="/accuracy">Read the full explanation</Link>.
          </p>
          <div
            style={{
              marginTop: "28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            <div style={{ padding: "20px", borderRadius: "16px", border: "1px solid var(--line)" }}>
              <div
                style={{
                  color: "var(--g-700)",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Known
              </div>
              <div
                style={{
                  marginTop: "8px",
                  color: "var(--ink)",
                  fontSize: "15px",
                  fontWeight: "700",
                  lineHeight: "1.55",
                }}
              >
                Used as a fact in the email
              </div>
            </div>
            <div style={{ padding: "20px", borderRadius: "16px", border: "1px solid var(--line)" }}>
              <div
                style={{
                  color: "#8a5a00",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Guessed
              </div>
              <div
                style={{
                  marginTop: "8px",
                  color: "var(--ink)",
                  fontSize: "15px",
                  fontWeight: "700",
                  lineHeight: "1.55",
                }}
              >
                Asked as a question, never claimed
              </div>
            </div>
            <div style={{ padding: "20px", borderRadius: "16px", border: "1px solid var(--line)" }}>
              <div
                style={{
                  color: "#4b5a52",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Missing
              </div>
              <div
                style={{
                  marginTop: "8px",
                  color: "var(--ink)",
                  fontSize: "15px",
                  fontWeight: "700",
                  lineHeight: "1.55",
                }}
              >
                Left out, or no email is written
              </div>
            </div>
          </div>
        </section>
        <section id="evaluate">
          <h2>How to evaluate one</h2>
          <p>
            Gartner expects AI agents to outnumber sellers 10 to 1 by 2028, yet predicts fewer than 40% of sellers will
            say agents made them more productive. Its point: an agent is only as good as the data and systems around it.
            These seven questions test exactly that, and get past the demo.
          </p>
          <ol className="gd-ev">
            <li>
              <div>
                What does it do when the context is thin?
                <span>A tool that always writes will sometimes write something false.</span>
              </div>
            </li>
            <li>
              <div>
                Does qualification happen before or after enrichment is billed?
                <span>After means you pay to learn someone was never a fit.</span>
              </div>
            </li>
            <li>
              <div>
                Do email and calling share one prospect record?
                <span>Or do they live in two products that never talk?</span>
              </div>
            </li>
            <li>
              <div>
                Who approves a message by default?<span>And how is autopilot switched on?</span>
              </div>
            </li>
            <li>
              <div>
                Does a reply stop the follow-ups on every outcome?
                <span>Replied, booked, not interested and unsubscribed.</span>
              </div>
            </li>
            <li>
              <div>
                Can you see why leads were rejected?<span>Not just how many were accepted.</span>
              </div>
            </li>
            <li>
              <div>
                What happens if the calendar fails mid-call?
                <span>An agent that invents a slot is worse than no agent.</span>
              </div>
            </li>
          </ol>
          <p>
            The <Link href="/ai-sdr-tools">AI SDR tools buyer&apos;s guide</Link> goes through each question in detail,
            and the <Link href="/b2b-lead-generation-tools">lead generation tools guide</Link> covers the layers an
            agent has to replace.
          </p>
        </section>
        <section id="faq">
          <h2>Frequently asked questions</h2>
          <FaqSection items={faqs} className="" />
        </section>
      </article>
    </GuideArticleLayout>
  );
}
