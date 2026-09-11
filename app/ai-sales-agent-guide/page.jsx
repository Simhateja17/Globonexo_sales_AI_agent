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
import GuideLayout, { GuideList } from "../../components/marketing/GuideLayout";

const loop = [
  {
    step: "Understand the offer",
    body: "The agent is configured once with what you sell, who buys it, the value proposition, the pain points it addresses, the objections you hear, and the tone you use. Everything downstream is generated from this, which is why a vague setup produces vague outreach.",
  },
  {
    step: "Find the accounts",
    body: "It searches for companies and people matching your ideal customer profile — industries, titles, seniority, geography, company size — or takes a list you already have.",
  },
  {
    step: "Qualify before spending",
    body: "Each candidate is checked against an explicit, readable rubric before enrichment is paid for. This is the step that separates an agent from a sequencer, and the step that decides whether your budget goes to people who could actually buy.",
  },
  {
    step: "Research the person",
    body: "Enrichment fills in verified email, role, company detail, size, and technologies. Crucially, the agent also records what it could not find, because that list is what keeps the writing honest.",
  },
  {
    step: "Write the sequence",
    body: "First touch, follow-up, and breakup are generated together so later steps build on earlier ones rather than repeating the pitch. Facts are used as facts; guesses become questions, never claims.",
  },
  {
    step: "Send and follow up",
    body: "Messages go out throttled and inside sending windows. Follow-ups run on schedule until something changes — and a reply stops them automatically.",
  },
  {
    step: "Handle replies",
    body: "Replies are read from your mailbox, threaded, and drafted for you. By default a person approves before anything goes back. Opt-outs are detected and honored.",
  },
  {
    step: "Call when it helps",
    body: "An AI voice agent phones the prospects who never open email, runs discovery, handles objections with your approved responses, and stops immediately on a do-not-call request.",
  },
  {
    step: "Book the meeting",
    body: "It reads real calendar availability, offers only slots that exist, confirms the time and timezone back, and writes the meeting to your calendar.",
  },
];

const canDo = [
  "Build and qualify a target list against a profile you define once",
  "Research each person and record what it could not find out",
  "Write a coherent multi-step sequence rather than three variations of one email",
  "Send, throttle, and follow up on a schedule without supervision",
  "Draft replies and stop the sequence the moment somebody responds",
  "Place outbound calls and hold the conversation itself",
  "Book meetings against real calendar availability",
  "Report what ran, what was rejected, and why",
];

const cannotDo = [
  "Find product-market fit for you — faster outreach to the wrong market fails faster",
  "Run a discovery call that requires real judgment about a complex deal",
  "Negotiate pricing or terms",
  "Take responsibility for your compliance obligations around consent, opt-outs, and call disclosure",
  "Know anything about a prospect that is not in the data it was given",
  "Rescue a weak offer with better wording",
];

const evaluate = [
  "Ask what it does when the context is thin — a tool that always writes will sometimes write something false",
  "Ask whether qualification happens before or after enrichment is billed",
  "Ask whether email and calling share one prospect record or live in two products",
  "Ask who approves a message by default, and how autopilot is turned on",
  "Ask whether a reply stops the follow-ups automatically, on every terminal state",
  "Ask to see rejection reasons, not just accept rates",
  "Ask what happens when the calendar tool is unavailable mid-call",
];

const faqs = [
  {
    q: "What is an AI sales agent?",
    a: "An AI sales agent is software that runs the outbound sales motion end to end rather than assisting with one step of it. It finds accounts matching your ideal customer profile, qualifies and researches each contact, writes and sends a personalized sequence, follows up, handles replies, places calls, and books meetings.",
  },
  {
    q: "How is an AI sales agent different from sales automation software?",
    a: "Sales automation software automates execution — sending on a schedule, updating records, triggering tasks. An AI sales agent makes decisions too: who is worth contacting, what is true about them, what to say, and when to stop. The difference shows up in who writes the message and who decides it should be sent at all.",
  },
  {
    q: "Is an AI sales agent the same as an AI writing assistant?",
    a: "No. A writing assistant drafts on request from whatever is on screen. An agent owns the sequence: it decides who enters it, generates every step as one coherent whole, sends on schedule, reacts to replies, and stops on its own.",
  },
  {
    q: "Do AI sales agents actually book meetings?",
    a: "Yes, when booking is a real tool the agent can call rather than a link it pastes. The thing to check is whether it reads live calendar availability — an agent that proposes times it has not verified will eventually double-book someone.",
  },
  {
    q: "Will prospects know they are talking to an AI?",
    a: "On email the writing is drafted by AI and, by default, approved by you before it sends. On voice calls you are responsible for meeting the disclosure rules that apply in your jurisdiction, and the agent is built to answer honestly rather than claim knowledge or identity it does not have.",
  },
  {
    q: "What makes AI outreach fail?",
    a: "Confident, false personalization. A line about a challenge the company does not have is worse than a plainly generic email, because it proves nobody looked. The fix is architectural: the model has to be told exactly what it does not know, and stopped from writing when the required facts are missing.",
  },
  {
    q: "How much does an AI sales agent cost?",
    a: "Typically a monthly subscription in the low hundreds to low thousands, depending on volume. What matters more than the headline is the pricing axis — per seat, per contact, per enriched record, or per call minute — because at the same list size those produce very different bills.",
  },
];

export default function AiSalesAgentGuidePage() {
  return (
    <GuideLayout
      breadcrumb={[{ name: "What is an AI sales agent?", path: "/ai-sales-agent-guide" }]}
      eyebrow="Category guide"
      title="What is an AI sales agent?"
      intro="An AI sales agent runs the outbound motion end to end — finding buyers, researching them, writing, sending, following up, calling, and booking — instead of assisting with one step of it. This guide covers how the loop works, what it can and cannot do, and how to evaluate one honestly."
      secondaryCta={{ href: "/platform", label: "See one running" }}
    >
      <section className="guide-body public-section">
        <div className="guide-toc">
          <strong>On this page</strong>
          <ol>
            <li><a href="#definition">The short definition</a></li>
            <li><a href="#loop">How the loop works, step by step</a></li>
            <li><a href="#limits">What it can and cannot do</a></li>
            <li><a href="#accuracy">The failure mode that matters</a></li>
            <li><a href="#evaluate">How to evaluate one</a></li>
            <li><a href="#faq">Frequently asked questions</a></li>
          </ol>
        </div>
      </section>

      <section id="definition" className="guide-body public-section">
        <h2>The short definition</h2>
        <p>
          An AI sales agent is software that owns the pre-close sales motion. It decides who to contact, works out
          what is true about them, writes what to say, sends it, follows up, answers replies, calls when email is
          not landing, and books the meeting on your calendar.
        </p>
        <p>
          The word doing the work in that sentence is <em>decides</em>. Sales automation software executes
          decisions you have already made. An agent makes them, then executes them, and reports back on what it
          did. That is the whole distinction, and every practical difference follows from it.
        </p>
        <div className="guide-callout">
          <p>
            A useful test: if the product cannot tell you why a specific person was contacted and a specific other
            person was not, it is automating sending rather than running the motion.
          </p>
        </div>
      </section>

      <section id="loop" className="guide-body public-section">
        <h2>How the loop works, step by step</h2>
        <p>
          Nine steps, running continuously. Each one hands its output to the next, which is why the context an
          agent gathers while finding somebody is still available when it writes to them.
        </p>
        {loop.map((item, index) => (
          <div key={item.step}>
            <h3>{index + 1}. {item.step}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </section>

      <section id="limits" className="guide-body public-section">
        <h2>What it can and cannot do</h2>
        <h3>What it does well</h3>
        <GuideList items={canDo} />
        <h3>What it will not do for you</h3>
        <GuideList items={cannotDo} />
      </section>

      <section id="accuracy" className="guide-body public-section">
        <h2>The failure mode that matters</h2>
        <p>
          Almost every disappointing AI outreach story has the same shape: a message that sounded specific and was
          not true. &ldquo;I know your team is struggling with X&rdquo; — written by a system that never knew that.
          Readers have learned to spot it, and it does more damage than an obviously generic email, because it
          proves nobody looked.
        </p>
        <p>
          The fix is not a better prompt telling the model to avoid making things up. It is handing the model an
          explicit list of what is missing for this specific person, keeping facts and hypotheses apart, turning
          hypotheses into questions instead of claims, and refusing to draft at all when the required facts are
          absent. That is how GNX Sales is built —{" "}
          <Link href="/accuracy">the full explanation is here</Link>.
        </p>
      </section>

      <section id="evaluate" className="guide-body public-section">
        <h2>How to evaluate one</h2>
        <p>Seven questions that get past the demo.</p>
        <GuideList items={evaluate} />
        <p>
          The <Link href="/ai-sdr-tools">AI SDR tools buyer&apos;s guide</Link> goes through each of these in
          detail, and <Link href="/b2b-lead-generation-tools">the lead generation tools guide</Link> covers the
          layers an agent has to replace.
        </p>
      </section>

      <section id="faq" className="guide-body public-section">
        <h2>Frequently asked questions</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
