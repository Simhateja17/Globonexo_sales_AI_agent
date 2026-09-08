export const metadata = {
  title: "AI Sales Agent for Agencies Running Client Outbound",
  description:
    "Run outbound for every client from one system. Separate ideal customer profiles, positioning, sequences, and voice agents per client — lead discovery, enrichment, email, follow-ups, replies, and calls without accounts bleeding into one another.",
  alternates: { canonical: "/solutions/agencies" },
  openGraph: {
    url: "/solutions/agencies",
    title: "AI Sales Agent for Agencies Running Client Outbound",
    description:
      "One system, every client kept separate: profiles, positioning, sequences, and voice agents that never share a prompt.",
  },
};

import Link from "next/link";
import Icon from "../../../components/ui/Icon";
import FaqSection from "../../../components/marketing/FaqSection";
import GuideLayout, { GuideList } from "../../../components/marketing/GuideLayout";

const workflow = [
  {
    icon: "target",
    title: "Lead discovery, per client",
    body: "Each client campaign carries its own ideal customer profile — industries, titles, seniority, geography, company size — and its own qualification rubric. Accounts are found against that profile, not a shared one, so a fintech client's list and a logistics client's list never touch.",
  },
  {
    icon: "users",
    title: "Enrichment you are not paying twice for",
    body: "Candidates are checked against the client's rubric before enrichment is billed, so you are not burning budget discovering that an account was never a fit. Rejections come back with reasons — no work email, unverified address, shared inbox, duplicate, suppressed — which is exactly the evidence you need when a client asks why the list came in short.",
  },
  {
    icon: "mail",
    title: "Personalized email in each client's voice",
    body: "Every campaign stores its own product description, value proposition, pain points, objection handling, and tone. Two clients with different offers never borrow each other's pitch, because there is no shared global prompt to borrow from.",
  },
  {
    icon: "send",
    title: "Follow-ups that run themselves",
    body: "First touch, follow-up, and breakup are generated together as one sequence, so step three builds on step one instead of repeating it. Sending is throttled inside each client's windows.",
  },
  {
    icon: "inbox",
    title: "Replies threaded and drafted",
    body: "Responses are pulled from the connected mailbox, threaded, and drafted for review. A reply stops the rest of that prospect's sequence automatically — no more explaining to a client why a follow-up landed after their prospect had already answered.",
  },
  {
    icon: "phone",
    title: "Voice calls per client, per offer",
    body: "Each voice campaign gets its own agent and conversation flow built from that client's positioning, and is simulation-tested against ten adversarial scenarios before it is allowed to dial. Do-not-call is checked before every call.",
  },
  {
    icon: "calendar",
    title: "Meetings on the right calendar",
    body: "The agent books against real availability, confirms the time and timezone back, and a database constraint makes double booking impossible.",
  },
  {
    icon: "trend",
    title: "Reporting a client will accept",
    body: "Per-campaign and per-call performance, emails sent, reply rate, meetings booked, and credit usage metered per provider — so a monthly client report is a screenshot, not an evening's work.",
  },
];

const separation = [
  "Each campaign carries its own targeting rules, so one client's accounts never enter another's pipeline",
  "Each campaign stores its own positioning, tone, and objection handling rather than sharing a global setting",
  "A campaign keeps the brief it launched with — changing one client's positioning next month never rewrites outreach you already sent",
  "Voice campaigns get their own agent and conversation flow, so two clients never share one prompt",
  "Suppression and do-not-call are enforced per campaign, not just globally",
];

const faqs = [
  {
    q: "Can I run outbound for multiple clients from one account?",
    a: "Yes. Each client's work lives in its own campaigns, carrying its own ideal customer profile, qualification rules, positioning, tone, sequences, and voice agent. There is no shared global prompt for one client's settings to leak through.",
  },
  {
    q: "How do you stop one client's leads reaching another's campaign?",
    a: "Targeting rules and qualification criteria live on the campaign, not the account. An account sourced for one campaign is evaluated against that campaign's profile and enters that campaign's pipeline only.",
  },
  {
    q: "What happens if a client changes their positioning?",
    a: "A campaign freezes the brief it launched with. Updating positioning affects campaigns you launch afterwards and never silently rewrites outreach that has already gone out — which matters when a client asks what exactly was sent in March.",
  },
  {
    q: "Can each client have their own voice agent?",
    a: "Yes. Every voice campaign gets an agent built from that campaign's own product description, value proposition, pain points, objections, and tone, tested against adversarial scenarios before it dials.",
  },
  {
    q: "How is this priced for an agency?",
    a: "By volume, not by seat or by client. One subscription carries a credit pool that flexes across enrichment, drafting, and calling, plus a ceiling on concurrent campaigns. Adding a client means using capacity, not paying a new per-seat fee.",
  },
  {
    q: "What do I show a client at the end of the month?",
    a: "Per-campaign and per-call analytics: emails sent, reply rate, meetings booked, calls placed and their outcomes, plus per-lead rejection reasons so a shortfall reads as a targeting insight rather than a gap you have to explain.",
  },
];

export default function AgenciesPage() {
  return (
    <GuideLayout
      eyebrow="For agencies"
      title="Run outbound for every client from one system."
      intro="Lead discovery, enrichment, personalized email, follow-ups, replies, and voice calls — running separately for each client, out of one subscription, without accounts or positioning bleeding into one another."
      secondaryCta={{ href: "/pricing", label: "View pricing" }}
      cta={{
        heading: "Add your next client without adding a tool.",
        body: "Choose a plan, connect a mailbox, and launch the first client campaign in five minutes.",
      }}
    >
      <section className="guide-body public-section">
        <h2>The whole workflow, per client</h2>
        <p>
          Every step below runs against that client&apos;s own profile and positioning. Nothing is shared except
          the subscription.
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
        <h2>How clients stay separated</h2>
        <p>
          The risk in running outbound for several clients from one place is not effort. It is one client&apos;s
          pitch turning up in another client&apos;s campaign. Five things prevent it.
        </p>
        <GuideList items={separation} />
        <div className="guide-callout">
          <p>
            The most useful of these is the frozen brief. When a client asks in June what was actually sent in
            March, the campaign still holds the exact positioning it launched with — including the model version
            and the facts behind each message.
          </p>
        </div>
        <p>
          The full capability list is on <Link href="/platform">the platform page</Link>, the voice agent and its
          pre-launch testing on <Link href="/voice">the voice page</Link>, and the other audiences on{" "}
          <Link href="/solutions">the solutions overview</Link>.
        </p>
      </section>

      <section className="guide-body public-section">
        <h2>Questions agencies ask</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
