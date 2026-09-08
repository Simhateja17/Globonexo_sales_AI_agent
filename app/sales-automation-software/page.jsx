export const metadata = {
  title: "Sales Automation Software That Runs the Whole Motion",
  description:
    "Sales automation software that does more than send on a schedule. GNX Sales sources and qualifies leads, writes personalized sequences, follows up, handles replies, places AI voice calls, and books meetings — from one subscription.",
  alternates: { canonical: "/sales-automation-software" },
  openGraph: {
    url: "/sales-automation-software",
    title: "Sales Automation Software That Runs the Whole Motion",
    description:
      "Lead sourcing, qualification, AI email sequences, voice calling, replies, and booking in one sales automation platform.",
  },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import FaqSection from "../../components/marketing/FaqSection";
import GuideLayout, { GuideList, ComparisonTable } from "../../components/marketing/GuideLayout";

const automates = [
  {
    icon: "target",
    title: "Deciding who to contact",
    body: "You define an ideal customer profile once. Every campaign after that checks candidates against an explicit, editable rubric before a credit is spent on enrichment.",
  },
  {
    icon: "users",
    title: "Building and enriching the list",
    body: "Search for companies and people, upload a CSV, or add leads by hand. Enrichment runs in batches with retry and backoff, and rejections come back with reasons you can act on.",
  },
  {
    icon: "mail",
    title: "Writing the outreach",
    body: "First touch, follow-up, and breakup are generated together as one coherent sequence, from that campaign's own positioning — not one shared global template.",
  },
  {
    icon: "send",
    title: "Sending and following up",
    body: "Throttled sending inside your windows, follow-ups on schedule, and a hard stop the moment a prospect replies or opts out.",
  },
  {
    icon: "inbox",
    title: "Handling replies",
    body: "Replies are pulled from your mailbox, threaded, and drafted for you. Human approval is the default; autopilot is something you switch on per campaign.",
  },
  {
    icon: "phone",
    title: "Calling by AI voice",
    body: "An AI voice agent with a selectable ten-scenario pre-launch test, do-not-call checks before every call, and a number provisioned for you.",
  },
  {
    icon: "calendar",
    title: "Booking the meeting",
    body: "Real calendar availability computed on the server, timezone and buffer handling, and a database constraint that makes double booking impossible.",
  },
  {
    icon: "trend",
    title: "Reporting what happened",
    body: "Emails sent, reply rate, meetings booked, per-campaign and per-call performance, and credit usage reconciled against actual provider cost.",
  },
];

const comparison = [
  { them: "Automates sending; you still decide who and what", us: "Automates the deciding, the writing, and the sending" },
  { them: "One tool per layer, one bill per tool", us: "One platform, one subscription, one credit pool" },
  { them: "Priced per seat, so growing the team doubles the bill", us: "Priced by volume, with no seat charge" },
  { them: "Calling is a separate product with its own data", us: "Email and voice share one prospect record" },
  { them: "Templates with a first name swapped in", us: "Each message written from what is actually known about that person" },
  { them: "The model writes even when it knows nothing", us: "No required facts, no message — silence beats a guess" },
  { them: "Weeks of setup and a implementation call", us: "Live in about five minutes" },
];

const included = [
  "AI email sequences with per-step review, inline editing, and batch approval",
  "Lead sourcing and enrichment from verified data providers",
  "AI voice calling with a phone number provisioned for you",
  "Reply drafting, threading, and automatic opt-out detection",
  "Meeting booking against your real Google Calendar availability",
  "Campaign, voice-call, and credit-usage analytics",
  "A chat interface that operates the whole system in plain English",
];

const faqs = [
  {
    q: "What is sales automation software?",
    a: "Software that takes repetitive sales work off a person: building lists, sending sequences, scheduling follow-ups, logging activity, and booking meetings. The category ranges from tools that only automate sending to agents that also decide who to contact and what to say.",
  },
  {
    q: "What can actually be automated in outbound sales?",
    a: "Everything up to the conversation. Sourcing, qualification, research, writing, sending, follow-up, reply drafting, calling, and booking all run without supervision. The discovery call, the deal strategy, and the negotiation still need a person.",
  },
  {
    q: "Does GNX Sales replace my CRM?",
    a: "No. It runs the outbound motion and keeps its own pipeline, prospect, and meeting records. It is the system that creates opportunities, not the system of record for closing them.",
  },
  {
    q: "Do I need to change my email setup?",
    a: "No. Connect Gmail through OAuth, or any provider through SMTP for sending and IMAP for reading replies. No domain migration and no separate sending infrastructure.",
  },
  {
    q: "How is it priced?",
    a: "One monthly or annual subscription per plan, with a credit pool that flexes across enrichment, drafting, and calling. No per-seat charge and no per-channel charge. See the plans on the pricing page.",
  },
  {
    q: "How quickly can I be running campaigns?",
    a: "About five minutes. Choose a plan, answer the guided onboarding questions so the agent learns your offer and ideal customer, connect your mailbox, and launch.",
  },
];

export default function SalesAutomationSoftwarePage() {
  return (
    <GuideLayout
      breadcrumb={[{ name: "Sales automation software", path: "/sales-automation-software" }]}
      eyebrow="Sales automation software"
      title="Sales automation that does more than press send."
      intro="Most sales automation software automates the sending and leaves you the thinking. GNX Sales sources and qualifies the accounts, researches each person, writes the sequence, sends it, follows up, drafts the replies, places the calls, and books the meeting — from one subscription."
      secondaryCta={{ href: "/pricing", label: "View pricing" }}
      cta={{
        heading: "Automate the whole motion, not just the sending.",
        body: "Choose a plan, connect your inbox, and launch your first campaign in five minutes.",
      }}
    >
      <section className="guide-body public-section">
        <h2>What it automates</h2>
        <p>
          Eight jobs that normally live in six different products and one spreadsheet, running as a single motion
          with one shared understanding of every prospect.
        </p>
      </section>

      <section className="content-section public-section">
        <div className="card-grid">
          {automates.map((item) => (
            <article key={item.title} className="content-card">
              <span className="content-card-icon"><Icon name={item.icon} size={20} color="var(--g-700)" /></span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-body public-section">
        <h2>How it differs from the usual stack</h2>
        <ComparisonTable themLabel="Typical sales automation software" rows={comparison} />
      </section>

      <section className="guide-body public-section">
        <h2>What every plan includes</h2>
        <p>
          Tiers differ by volume, never by locked features. Every plan carries the full loop.
        </p>
        <GuideList items={included} />
        <p>
          The complete breakdown is on <Link href="/platform">the platform page</Link>. If you are still comparing
          categories, start with{" "}
          <Link href="/ai-sales-agent-guide">the AI sales agent guide</Link> or the{" "}
          <Link href="/ai-sdr-tools">AI SDR tools buyer&apos;s guide</Link>.
        </p>
      </section>

      <section className="guide-body public-section">
        <h2>Frequently asked questions</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
