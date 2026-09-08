export const metadata = {
  title: "AI Sales Agent for Individual Sellers and Founders",
  description:
    "Run B2B outbound without a full sales team. GNX Sales helps individual sellers find and qualify leads, prepare personalized email sequences, follow up, handle replies, and place AI voice calls.",
  alternates: { canonical: "/solutions/individuals" },
  openGraph: {
    url: "/solutions/individuals",
    title: "AI Sales Agent for Individual Sellers and Founders",
    description:
      "A practical outbound workflow for one person, with review controls for email and AI voice campaigns.",
  },
};

import Link from "next/link";
import Icon from "../../../components/ui/Icon";
import FaqSection from "../../../components/marketing/FaqSection";
import GuideLayout, { GuideList } from "../../../components/marketing/GuideLayout";

const workflow = [
  {
    icon: "target",
    title: "Define who you want to reach",
    body: "Set the industries, roles, seniority, locations, and company sizes that fit your offer. Each campaign uses those rules as its qualification rubric.",
  },
  {
    icon: "search",
    title: "Find and qualify prospects",
    body: "Source companies and contacts, then check each candidate against your campaign rules before using paid enrichment. Rejected leads keep a visible reason instead of disappearing from the workflow.",
  },
  {
    icon: "mail",
    title: "Prepare a complete email sequence",
    body: "GNX drafts the first email, follow-ups, and breakup message from the facts available about the prospect and your offer. You can review, edit, regenerate, or approve the drafts.",
  },
  {
    icon: "send",
    title: "Keep follow-ups moving",
    body: "Approved sequences run within the sending windows you choose. When a prospect replies, the remaining follow-ups stop automatically.",
  },
  {
    icon: "inbox",
    title: "Work replies from one inbox",
    body: "Incoming responses stay threaded with the prospect and campaign. GNX can prepare a reply for your review while you keep control of what is sent.",
  },
  {
    icon: "phone",
    title: "Add AI voice when it fits",
    body: "Create a voice campaign from your positioning and objection guidance. Pre-launch simulations are available if you choose to test the agent before calling prospects.",
  },
  {
    icon: "calendar",
    title: "Offer real calendar availability",
    body: "Set your working days, meeting length, buffers, and minimum notice. The booking flow uses the availability returned by your connected calendar.",
  },
  {
    icon: "trend",
    title: "See where your time is paying off",
    body: "Review campaign activity, replies, meetings, call outcomes, and lead rejection reasons so you can decide which audience and message deserve another round.",
  },
];

const controls = [
  "Draft review is the default, so you decide what is ready to send",
  "Autopilot can be selected per campaign when you are comfortable with its output",
  "A reply stops the remaining sequence for that prospect",
  "Suppression and do-not-call checks run at the campaign boundary",
  "Campaign analytics show what ran and why leads were rejected",
];

const faqs = [
  {
    q: "Is GNX Sales suitable for one person?",
    a: "Yes. The workflow is designed so an individual seller, consultant, or founder can run lead discovery, qualification, email sequences, replies, and voice campaigns from one account without assembling several separate tools.",
  },
  {
    q: "Will emails send without my approval?",
    a: "Draft review is the default. You can edit, regenerate, or approve messages before they send. Autopilot is an optional per-campaign setting you can select later.",
  },
  {
    q: "Do I need an existing lead list?",
    a: "No. You can source companies and contacts through the connected lead provider, upload a CSV, or add leads manually.",
  },
  {
    q: "Can I use email and voice in the same account?",
    a: "Yes. Email and AI voice campaigns are available within the same product and use the plan's shared credit allowance. Plan limits determine the available volume and concurrent campaigns.",
  },
  {
    q: "Does GNX guarantee meetings?",
    a: "No. Results depend on the market, offer, targeting, contact data, messaging, sending setup, and prospect response. GNX helps run and measure the workflow but does not promise a particular outcome.",
  },
];

export default function IndividualsPage() {
  return (
    <GuideLayout
      breadcrumb={[{ name: "Solutions", path: "/solutions" }, { name: "For an individual", path: "/solutions/individuals" }]}
      eyebrow="For an individual"
      title="Run outbound yourself without making it your whole day."
      intro="Find and qualify prospects, prepare personalized email sequences, follow up, handle replies, and add AI voice calls from one workflow — while keeping control of what goes live."
      secondaryCta={{ href: "/pricing", label: "View pricing" }}
      cta={{
        heading: "Build an outbound workflow you can manage alone.",
        body: "Choose a plan, connect your inbox, and configure your first campaign.",
      }}
    >
      <section className="guide-body public-section">
        <h2>The outbound workflow for one person</h2>
        <p>
          GNX handles the repeated research and campaign steps. You keep the decisions, approvals, and buyer
          conversations that need your judgment.
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
        <h2>You decide how much the agent does</h2>
        <GuideList items={controls} />
        <div className="guide-callout">
          <p>
            Start with review enabled. If a campaign&apos;s output consistently matches your standards, you can
            choose whether to enable autopilot for that campaign. The control remains yours.
          </p>
        </div>
        <p>
          See every capability on <Link href="/platform">the platform page</Link>, review the voice workflow on{" "}
          <Link href="/voice">the AI calls page</Link>, or compare allowances on the{" "}
          <Link href="/pricing">pricing page</Link>.
        </p>
      </section>

      <section className="guide-body public-section">
        <h2>Questions individual sellers ask</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
