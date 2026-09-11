export const metadata = {
  title: "B2B Lead Generation with an AI SDR Tool",
  description:
    "B2B lead generation run by an AI SDR tool — sourcing, qualification, email sequences, and voice calls. See how it fits an individual seller, an agency running outbound for clients, or a startup building outbound in-house.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    url: "/solutions",
    title: "B2B Lead Generation with an AI SDR Tool",
    description:
      "Sales engagement software that sources, qualifies, writes, sends, and calls — framed for individuals, agencies, and startups.",
  },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";
import FaqSection from "../../components/marketing/FaqSection";

// Segments mirror the real plan catalogue rather than inventing audience
// categories the product cannot actually serve (there is no seat/team system,
// so "per rep" framing would be selling something that does not exist).
const segments = [
  {
    id: "individual",
    icon: "user",
    link: { href: "/solutions/individuals", label: "How individuals run outbound" },
    eyebrow: "For an individual",
    title: "Run B2B outbound alone without it becoming your whole day.",
    intro:
      "One person can only research, write, and follow up so many times a week. GNX takes the repetitive half of that and leaves you the conversations.",
    steps: [
      { icon: "target", title: "Define the ICP once", body: "You describe who you sell to a single time. Every campaign after that works from it, so you are not rebuilding a lead list by hand each week." },
      { icon: "search", title: "Fit checked before spend", body: "Accounts are checked against your ICP before any enrichment is paid for, so your allowance goes toward people who could actually buy." },
      { icon: "doc", title: "Sequences written for you", body: "First touch, follow-up, and breakup are drafted as one coherent sequence, so later steps do not repeat the same pitch." },
      { icon: "check", title: "You stay in the loop", body: "Review and edit before anything sends, or turn on autopilot per campaign once you trust it." },
    ],
  },
  {
    id: "agency",
    icon: "building",
    link: { href: "/solutions/agencies", label: "How agencies run client outbound" },
    eyebrow: "For an agency",
    title: "Agency lead generation for every client from one system.",
    intro:
      "Each client gets its own campaigns, its own ideal-customer profile, and its own conversation flow, without accounts bleeding into one another.",
    steps: [
      { icon: "target", title: "A separate profile per client", body: "Each campaign carries its own targeting rules and qualification criteria, so one client's accounts never end up in another's pipeline." },
      { icon: "chat", title: "Outreach in each client's voice", body: "Campaigns store their own product description, value proposition, tone, and objection handling rather than sharing one global setting." },
      { icon: "lock", title: "Campaign settings stay frozen", body: "A campaign keeps the brief it launched with. Changing one client's positioning next month does not silently rewrite outreach you already sent." },
      { icon: "send", title: "Email and voice per client", body: "Voice campaigns get their own agent and conversation flow, so two clients with different offers never share one prompt." },
    ],
  },
  {
    id: "startup",
    icon: "trend",
    link: { href: "/solutions/b2b-startups", label: "How B2B startups build outbound" },
    eyebrow: "For a startup",
    title: "Startup B2B lead generation, built in-house at volume.",
    intro:
      "More campaigns running at once, a higher daily sending ceiling, and the same guardrails applied to every message that goes out.",
    steps: [
      { icon: "grid", title: "More campaigns in parallel", body: "Run separate motions for different segments, products, or regions at the same time instead of queueing them one after another." },
      { icon: "spark", title: "Autopilot where it is earned", body: "Turn autopilot on per campaign. It changes who approves the message, never whether the message was validated." },
      { icon: "phone", title: "Voice as a real channel", body: "Voice campaigns scale with the plan and draw from the same credit pool as email, so reaching by phone is never an upsell." },
      { icon: "trend", title: "Visibility into what ran", body: "Campaign and voice-call analytics, plus per-lead rejection reasons, so a shortfall shows up as a targeting insight instead of a silent gap." },
    ],
  },
];


const faqs = [
  {
    q: "What is an AI SDR tool?",
    a: "An AI SDR tool does the work a sales development rep does before a deal reaches a closer: building a target list, researching each account, writing the first touch and the follow-ups, handling early replies, and booking the meeting. GNX Sales does that across both email and phone.",
  },
  {
    q: "Does an AI SDR replace a human rep?",
    a: "It replaces the repetitive half of the job, not the conversation. The agent handles sourcing, qualification, writing, sending, following up, and scheduling. A person still runs the call and closes the deal.",
  },
  {
    q: "Can an agency keep clients separated?",
    a: "Yes. Each campaign carries its own ideal customer profile, qualification rules, product description, value proposition, tone, objection handling, and voice agent. One client's accounts never end up in another's pipeline, and a campaign keeps the brief it launched with.",
  },
  {
    q: "How does it decide who is worth contacting?",
    a: "You define an ideal customer profile once — industries, titles, seniority, geography, company size. Every candidate is checked against that explicit, editable rubric before any enrichment is paid for, and rejections are shown with reasons rather than disappearing silently.",
  },
  {
    q: "Is voice calling available on every plan?",
    a: "Voice and email draw from the same credit pool on every plan. What scales with the tier is how many voice campaigns you can run at once, never whether you get the channel at all.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="public-page story-page">
      <div className="story-hero-band">
        <PublicNav variant="dark" />
        <section className="story-hero public-section">
          <span className="eyebrow">Solutions</span>
          <h1 className="display">B2B lead generation, built for how you actually sell.</h1>
          <p>
            The same AI SDR tool, framed three ways. Every plan includes the full sales engagement software
            capability set — email sequences, lead sourcing and enrichment, and AI voice calling. What changes is
            volume, not access.
          </p>
          <div className="content-hero-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">
              Choose a plan <Icon name="arrow" size={18} color="#06231a" />
            </Link>
            <Link className="landing-outline-btn" href="/platform">See the AI sales tool</Link>
          </div>
        </section>
      </div>

      <main>

        {segments.map((segment, index) => {
          return (
            <section key={segment.id} id={segment.id} className={`content-section public-section solutions-segment${index > 0 ? " solutions-segment--divider" : ""}`}>
              <div className="content-section-head">
                <span className="content-card-icon"><Icon name={segment.icon} size={20} color="var(--g-700)" /></span>
                <span className="eyebrow">{segment.eyebrow}</span>
                <h2>{segment.title}</h2>
                <p>{segment.intro}</p>
                {segment.link && (
                  <Link className="landing-text-link" href={segment.link.href}>
                    {segment.link.label} <Icon name="arrow" size={15} color="var(--g-700)" />
                  </Link>
                )}
              </div>
              <div className="card-grid solutions-values-grid">
                {segment.steps.map((step) => (
                  <article key={step.title} className="content-card">
                    <span className="content-card-icon"><Icon name={step.icon} size={20} color="var(--g-700)" /></span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <FaqSection heading="B2B lead generation questions" items={faqs} />

        <section className="solutions-cta">
          <div>
            <h2>See it run on your pipeline.</h2>
            <p>Choose a plan, connect your inbox, and put your agent to work.</p>
          </div>
          <div className="content-cta-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">
              Choose a plan <Icon name="arrow" size={16} color="#06231a" />
            </Link>
            <Link className="landing-outline-btn" href="/contact">Contact support</Link>
          </div>
        </section>
      </main>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Solutions", path: "/solutions" }]} />
    </div>
  );
}
