export const metadata = {
  title: "B2B Lead Generation Tools: A Practical Guide",
  description:
    "A practical guide to B2B lead generation tools — the stack most teams end up with, what each layer costs you in time and money, how to run the whole thing as one motion, and the metrics that tell you it is working.",
  alternates: { canonical: "/b2b-lead-generation-tools" },
  openGraph: {
    url: "/b2b-lead-generation-tools",
    title: "B2B Lead Generation Tools: A Practical Guide",
    description:
      "The layers of a B2B lead generation stack, what each one costs you, and how to run them as a single motion.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import GuideLayout, { GuideList, ComparisonTable } from "../../components/marketing/GuideLayout";

const layers = [
  {
    name: "1. Sourcing — finding the accounts",
    body: "A contact database or scraper turns your ideal customer profile into a list of companies and people. This is the cheapest layer to buy and the easiest to get wrong: a list is only as good as the profile behind it, and most teams write that profile once, loosely, and never revisit it.",
    watch: "Records existing in a database is not evidence anyone is contactable. Expect a meaningful share of any list to have no work email, an unverified address, or a shared inbox behind it.",
  },
  {
    name: "2. Enrichment — filling in the gaps",
    body: "Enrichment adds the detail a message needs: verified email, role and seniority, company size, industry, technologies, funding. It is usually metered per record, which means you pay for the bad-fit accounts as well as the good ones.",
    watch: "Qualify before you enrich, not after. Ordering it the other way around is the single most common way lead generation budgets disappear.",
  },
  {
    name: "3. Qualification — deciding who is worth it",
    body: "An explicit rubric that scores each account against your profile: right industries, right titles, right seniority, right geography, right size. Done well, it is readable and editable. Done badly, it is a hidden score you cannot argue with.",
    watch: "If a tool cannot show you why a lead was rejected, you cannot fix your targeting. Rejection reasons are more useful than accept rates.",
  },
  {
    name: "4. Messaging — writing the outreach",
    body: "First touch, follow-up, and breakup. Generated as one coherent sequence, later steps build on earlier ones. Generated one at a time, you get the same pitch three times with different opening lines.",
    watch: "Personalization that is wrong is worse than none. A sentence about a problem the company does not have tells the reader nobody looked.",
  },
  {
    name: "5. Sending — getting it delivered",
    body: "Throttling, sending windows, domain warming, and reply tracking. This layer decides whether any of the previous four matter, because an undelivered message is an unread one.",
    watch: "Volume is the enemy of deliverability. Tight targeting lets you send less and land more.",
  },
  {
    name: "6. Follow-up and replies — the part that gets dropped",
    body: "Most meetings come from the second and third touch, and most teams stop after the first. Reply handling matters just as much: the follow-up that lands after somebody already answered is the one that loses the deal.",
    watch: "A reply must stop the rest of the sequence automatically, on every terminal state, not when you remember to pause it.",
  },
  {
    name: "7. Calling — the channel most teams skip",
    body: "A phone call reaches people who never open email, and reaches them faster. It is skipped because it is the most expensive minute in the stack — unless an AI voice agent places the call.",
    watch: "If calling lives in a separate product, the voice agent has no idea what your emails already said to the same person.",
  },
  {
    name: "8. Booking — turning interest into a meeting",
    body: "Real calendar availability, timezone handling, buffers, minimum notice, reschedules. Unglamorous and the place automation most often falls over.",
    watch: "An agent that proposes a time it has not checked will eventually double-book someone. That costs more goodwill than it saved effort.",
  },
];

const metrics = [
  "Reply rate per campaign, not per mailbox — a healthy campaign and a dead one average out to something meaningless",
  "Meetings booked per hundred qualified leads, which is the only number that survives contact with a CFO",
  "Rejection reasons by count, so a shortfall reads as a targeting problem rather than a mystery",
  "Cost per booked meeting across every meter you are paying, not just the subscription",
  "Time from list build to first send — the stack tax you pay every single campaign",
];

const comparison = [
  { them: "Six or seven tools, six or seven bills", us: "One platform, one subscription, one credit pool" },
  { them: "Enrich first, discover the bad fit afterwards", us: "Qualification runs before enrichment is paid for" },
  { them: "The sequencer does not know what the dialer said", us: "Email and voice share one prospect record" },
  { them: "Rejected leads vanish without explanation", us: "Every rejection carries a reason you can act on" },
  { them: "Follow-ups stop when you remember to stop them", us: "A reply ends the sequence automatically" },
  { them: "Booking links you hope somebody clicks", us: "The agent books against real calendar availability" },
];

const faqs = [
  {
    q: "What are B2B lead generation tools?",
    a: "Software that helps you find, qualify, and reach potential business buyers. In practice a full stack spans eight layers: sourcing, enrichment, qualification, messaging, sending, follow-up and replies, calling, and booking. Most products cover one or two of them.",
  },
  {
    q: "What is the best B2B lead generation tool?",
    a: "It depends on which layer is your bottleneck. If you have a good list and no time to write, you need messaging automation. If you are guessing at who to contact, a bigger database will not help. The tools that pay off fastest are the ones that remove your specific bottleneck, not the ones with the most features.",
  },
  {
    q: "How many lead generation tools do I actually need?",
    a: "Fewer than most teams end up with. Each additional tool adds a bill, an integration, and a place where prospect context gets lost. The strongest argument for a single platform is not the price — it is that the agent writing the message already knows everything learned while finding the person.",
  },
  {
    q: "Should I qualify leads before or after enrichment?",
    a: "Before, always. Enrichment is metered per record, so enriching first means paying to discover that an account was never a fit. Checking against your ideal customer profile costs nothing and removes most of the bad spend.",
  },
  {
    q: "How do I measure whether lead generation is working?",
    a: "Meetings booked per hundred qualified leads, and cost per booked meeting across every meter you pay. Open rates and connection counts move for reasons that have nothing to do with revenue.",
  },
];

export default function B2bLeadGenerationToolsPage() {
  return (
    <GuideLayout
      breadcrumb={[{ name: "B2B lead generation tools", path: "/b2b-lead-generation-tools" }]}
      eyebrow="Practical guide"
      title="B2B lead generation tools, layer by layer."
      intro="A working B2B lead generation stack has eight layers. Most teams buy six tools to cover them, pay six bills, and lose the prospect's context somewhere between the third and the fourth. Here is what each layer does, where the money leaks, and how to run the whole thing as one motion."
      secondaryCta={{ href: "/solutions", label: "See it by use case" }}
    >
      <section className="guide-body public-section">
        <div className="guide-toc">
          <strong>On this page</strong>
          <ol>
            <li><a href="#layers">The eight layers of a lead generation stack</a></li>
            <li><a href="#metrics">The five metrics worth tracking</a></li>
            <li><a href="#one-system">Running it as one system</a></li>
            <li><a href="#faq">Frequently asked questions</a></li>
          </ol>
        </div>
      </section>

      <section id="layers" className="guide-body public-section">
        <h2>The eight layers of a lead generation stack</h2>
        <p>
          You need every one of these to book a meeting. The question is not whether you have them — it is how
          many separate products you are paying for, and how much context is dropped between them.
        </p>
        {layers.map((layer) => (
          <div key={layer.name}>
            <h3>{layer.name}</h3>
            <p>{layer.body}</p>
            <p><strong>What to watch.</strong> {layer.watch}</p>
          </div>
        ))}
      </section>

      <section id="metrics" className="guide-body public-section">
        <h2>The five metrics worth tracking</h2>
        <p>
          Most lead generation dashboards report activity. Activity is not the point. These are the numbers that
          tell you whether the stack is earning its keep.
        </p>
        <GuideList items={metrics} />
      </section>

      <section id="one-system" className="guide-body public-section">
        <h2>Running it as one system</h2>
        <p>
          GNX Sales covers all eight layers as a single motion. Sourcing and enrichment feed qualification,
          qualification decides who gets written to, the writing knows every fact that was learned along the way,
          and email and voice work from the same prospect record and the same credit pool.
        </p>
        <ComparisonTable themLabel="A stitched-together stack" rows={comparison} />
        <p>
          See the full capability list on <Link href="/platform">the platform page</Link>, or read the{" "}
          <Link href="/ai-sdr-tools">AI SDR tools buyer&apos;s guide</Link> for the questions to ask any vendor in
          this category.
        </p>
      </section>

      <section id="faq" className="guide-body public-section">
        <h2>Frequently asked questions</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
