export const metadata = {
  title: "AI Sales Agent for B2B Startups Building Outbound",
  description:
    "Build an in-house outbound motion before you hire an SDR. Lead discovery, enrichment, personalized email, follow-ups, replies, and AI voice calls running in parallel across segments — from one subscription.",
  alternates: { canonical: "/solutions/b2b-startups" },
  openGraph: {
    url: "/solutions/b2b-startups",
    title: "AI Sales Agent for B2B Startups Building Outbound",
    description:
      "An outbound motion you can run before your first SDR hire, across several segments at once.",
  },
};

import Link from "next/link";
import Icon from "../../../components/ui/Icon";
import FaqSection from "../../../components/marketing/FaqSection";
import GuideLayout, { GuideList } from "../../../components/marketing/GuideLayout";

const workflow = [
  {
    icon: "target",
    title: "Lead discovery across segments",
    body: "Before product-market fit is settled you are usually testing three guesses about who buys. Run a separate campaign per guess — its own ideal customer profile, its own qualification rubric — in parallel rather than one after another, so you learn in weeks instead of quarters.",
  },
  {
    icon: "users",
    title: "Enrichment that does not burn runway",
    body: "Accounts are checked against the profile before enrichment is billed, so the money goes to people who could plausibly buy. Rejections come back with reasons, which is how you find out that a segment you believed in has almost no reachable contacts.",
  },
  {
    icon: "mail",
    title: "Personalized email without a copywriter",
    body: "Each campaign holds its own product description, value proposition, pain points, objection handling, and tone. Messages are written from what is actually known about the person — and when the essential facts are missing, nothing is drafted at all.",
  },
  {
    icon: "send",
    title: "Follow-ups that do not depend on discipline",
    body: "Most first meetings come from the second and third touch, and a small team drops those first. First touch, follow-up, and breakup are generated together and sent on schedule inside your windows.",
  },
  {
    icon: "inbox",
    title: "Replies handled while you are building",
    body: "Responses are pulled from your mailbox, threaded, and drafted for approval. A reply stops the rest of that sequence automatically, so nobody gets a follow-up after they have already answered a founder.",
  },
  {
    icon: "phone",
    title: "Voice calls without hiring a caller",
    body: "An AI voice agent reaches the buyers who never open a cold email, runs discovery, handles objections with your approved responses, and books from real calendar availability. It is simulation-tested against ten adversarial scenarios before it dials.",
  },
  {
    icon: "calendar",
    title: "Meetings straight onto the founder's calendar",
    body: "Timezone, working days, meeting length, buffer, and minimum notice are yours to set. The agent offers only slots the server confirmed are open.",
  },
  {
    icon: "trend",
    title: "Evidence for the next board update",
    body: "Emails sent, reply rate by campaign, meetings booked, call outcomes, and per-lead rejection reasons — enough to say which segment is responding and which one you should stop paying for.",
  },
];

const beforeHiring = [
  "A campaign costs a fraction of a sales development rep's monthly salary, and starts on the same day",
  "Three segments can be tested at once instead of sequentially through one person's week",
  "The ideal customer profile is written down and editable rather than living in somebody's head",
  "When you do hire, the new rep inherits a working motion and a record of what has already been tried",
  "Nothing about the setup has to be unwound — the agent keeps running alongside the team",
];

const faqs = [
  {
    q: "Should a startup use an AI sales agent before hiring an SDR?",
    a: "It is a reasonable order for most B2B startups. An SDR takes a month to hire, a month to ramp, and needs a defined ideal customer profile to be effective. An agent starts the same day and forces you to write that profile down, so the first rep you hire joins a motion that already works.",
  },
  {
    q: "Does this work before product-market fit?",
    a: "It helps you find it faster, but it will not create it. Running three segment campaigns in parallel tells you within weeks which guess gets replies. What it cannot do is make a weak offer land — faster outreach to the wrong market just fails faster.",
  },
  {
    q: "How many campaigns can I run at once?",
    a: "That is what scales with the plan. Every tier includes the full capability set — email sequences, enrichment, and AI voice calling — and the tier decides how many email and voice campaigns run concurrently and how much monthly volume you get. The numbers are on the pricing page.",
  },
  {
    q: "Do I need a lead list to start?",
    a: "No. You can search for companies and people through the built-in sourcing and enrichment provider, upload a CSV you already have, or add leads by hand.",
  },
  {
    q: "How long until the first meeting?",
    a: "Setup takes about five minutes and campaigns launch the same day. First meetings typically land within two to four weeks, which is mostly a function of follow-up cycles rather than the tooling.",
  },
  {
    q: "Can I stay in control of what gets sent?",
    a: "Yes, and it is the default. Every draft waits for review, and you can edit inline, regenerate, or approve in batch. Autopilot is switched on per campaign once you have read enough output to trust it, and it changes who approves a message, never whether it was validated.",
  },
];

export default function B2bStartupsPage() {
  return (
    <GuideLayout
      breadcrumb={[{ name: "Solutions", path: "/solutions" }, { name: "For B2B startups", path: "/solutions/b2b-startups" }]}
      eyebrow="For B2B startups"
      title="Build an outbound motion before you hire for it."
      intro="Lead discovery, enrichment, personalized email, follow-ups, replies, and AI voice calls — running across several segments at once, from one subscription, so a small team can find out who actually buys without spending a quarter on it."
      secondaryCta={{ href: "/pricing", label: "View pricing" }}
      cta={{
        heading: "Test three segments this month.",
        body: "Choose a plan, connect your inbox, and launch parallel campaigns in five minutes.",
      }}
    >
      <section className="guide-body public-section">
        <h2>The whole workflow, run by a small team</h2>
        <p>
          Every step below runs without a dedicated person owning it. What you keep is the decision-making and the
          conversations.
        </p>
      </section>

      <section className="content-section public-section">
        <div className="card-grid">
          {workflow.map((item) => (
            <article key={item.title} className="content-card">
              <span className="content-card-icon"><Icon name={item.icon} size={20} color="var(--g-700)" /></span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-body public-section">
        <h2>Why this comes before the first SDR hire</h2>
        <GuideList items={beforeHiring} />
        <div className="guide-callout">
          <p>
            The honest limit: none of this substitutes for knowing what you sell and to whom. An agent makes a
            good offer reach more of the right people. It will not rescue a weak one — it will just show you, more
            quickly and more cheaply, that the market is not responding.
          </p>
        </div>
        <p>
          The full capability list is on <Link href="/platform">the platform page</Link>, the honesty guardrails
          on <Link href="/accuracy">the no-guessing page</Link>, and the other audiences on{" "}
          <Link href="/solutions">the solutions overview</Link>.
        </p>
      </section>

      <section className="guide-body public-section">
        <h2>Questions startups ask</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
