export const metadata = {
  title: "Cold Email Software vs an AI Sales Agent",
  description:
    "Cold email software sends sequences to a list you supply. An AI sales agent decides who belongs on the list, writes each message from what it knows, and calls when email is not landing. Here is the honest comparison.",
  alternates: { canonical: "/cold-email-software" },
  openGraph: {
    url: "/cold-email-software",
    title: "Cold Email Software vs an AI Sales Agent",
    description:
      "What cold email software does well, where it stops, and when you need something broader than an email-only tool.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import GuideLayout, { GuideList, ComparisonTable } from "../../components/marketing/GuideLayout";

const goodAt = [
  "Sending a sequence to a list on a schedule, reliably and at volume",
  "Throttling, sending windows, and rotating between mailboxes",
  "Domain warming and deliverability monitoring",
  "Tracking opens, clicks, and replies per campaign",
  "A/B testing subject lines and first touches across a large list",
];

const stopsAt = [
  {
    title: "It takes whatever list you give it",
    body: "Cold email software has no opinion about who should be contacted. If the list is wrong, it will send to the wrong people faster and more reliably than you could by hand. Targeting stays entirely your problem.",
  },
  {
    title: "Personalization is a merge field",
    body: "A first name and a company name in a shared template is not personalization, and readers have long since learned to spot it. Genuine per-person writing requires knowing something specific about the person — which requires research the sending tool does not do.",
  },
  {
    title: "AI add-ons write from thin context",
    body: "Where an AI drafting button exists, it is handed whatever happens to be in the spreadsheet row and asked to sound convincing. That is the setup that produces a confident sentence about a challenge the company does not have — the worst outcome available, because it proves nobody looked.",
  },
  {
    title: "Email is the only channel",
    body: "Some buyers never open a cold email. Reaching them means a phone call, which means a second product with its own prospect data that has no idea what your emails already said.",
  },
  {
    title: "Replies are handed back to you",
    body: "The tool tells you somebody replied. Reading it, drafting an answer, deciding whether it is a real opportunity, and getting a meeting on the calendar are all still manual.",
  },
  {
    title: "Booking is a link and a hope",
    body: "Most cold email tools end at the scheduling link. Whether the meeting actually lands depends on the prospect doing the work.",
  },
];

const comparison = [
  { them: "Sends to the list you supply", us: "Finds and qualifies the list against your profile first" },
  { them: "Templates with merge fields", us: "Each message written from verified facts about that person" },
  { them: "AI drafts from whatever is in the row", us: "The model is told exactly what it does not know, and stops if the essentials are missing" },
  { them: "Email only — calling is a second tool and a second bill", us: "Email and AI voice from one credit pool and one prospect record" },
  { them: "You read and answer every reply", us: "Replies are threaded and drafted, and stop the sequence automatically" },
  { them: "A scheduling link the prospect has to use", us: "The agent books against real calendar availability during the conversation" },
  { them: "Deliverability tooling, no targeting opinion", us: "Tight targeting so you send less and land more" },
];

const whenEmailOnly = [
  "You already have a well-qualified list and only need reliable delivery at volume",
  "You send from many mailboxes and domains and need rotation and warming as a first-class feature",
  "Your team writes its own copy and does not want anything generated",
  "Your buyers are reachable by email alone and phone would be unwelcome",
];

const whenBroader = [
  "Building and qualifying the list is what actually eats your week",
  "Generic templates have stopped getting replies",
  "Some segment of your market never opens email and needs a call",
  "Follow-ups and replies are falling through the cracks",
  "You are paying for a database, an enrichment tool, a sequencer, and a dialer separately",
];

const faqs = [
  {
    q: "What is cold email software?",
    a: "Tools built to send outbound email sequences at volume: list upload, templates and merge fields, scheduling and throttling, mailbox rotation, domain warming, and open and reply tracking. They are good at delivery and neutral about who you send to.",
  },
  {
    q: "Is GNX Sales cold email software?",
    a: "It includes everything cold email software does — sequences, throttled sending inside your windows, follow-ups, reply tracking — but it is broader than an email-only tool. It also sources and qualifies the leads, researches each person before writing, drafts the replies, places AI voice calls, and books the meeting.",
  },
  {
    q: "Do I still need a separate cold email tool?",
    a: "Not for the outbound motion itself. If you run very high volume across many rotating domains and need warming as a dedicated discipline, a specialist sending tool still has a place alongside it.",
  },
  {
    q: "Does cold email still work?",
    a: "Yes, when the targeting is tight and the message is specifically about the reader. What has stopped working is volume — sending more of the same template to a broader list. The constraint has shifted from delivery to relevance.",
  },
  {
    q: "Will AI-written cold email hurt my domain reputation?",
    a: "The risk comes from volume, poor list quality, and spam complaints, not from who wrote the words. Tight targeting, throttled sending, honest content, and warming a new domain matter far more than whether a human or a model drafted the copy.",
  },
  {
    q: "How is this priced compared to cold email tools?",
    a: "Cold email tools usually price per seat or per mailbox. GNX Sales is one subscription with a credit pool that flexes across enrichment, drafting, and calling, with no seat charge. See the pricing page for the tiers.",
  },
];

export default function ColdEmailSoftwarePage() {
  return (
    <GuideLayout
      breadcrumb={[{ name: "Cold email software", path: "/cold-email-software" }]}
      eyebrow="Comparison"
      title="Cold email software, and where it stops."
      intro="Cold email software is genuinely good at one thing: getting a sequence delivered to a list at volume. The trouble is that everything before and after the sending — deciding who belongs on the list, knowing enough to write something true, answering the replies, reaching the people who never open email — is still yours."
      secondaryCta={{ href: "/platform", label: "See the platform" }}
      cta={{
        heading: "More than an email tool.",
        body: "Sourcing, qualification, writing, sending, replies, calling, and booking from one subscription.",
      }}
    >
      <section className="guide-body public-section">
        <div className="guide-toc">
          <strong>On this page</strong>
          <ol>
            <li><a href="#good-at">What cold email software is good at</a></li>
            <li><a href="#stops">Where it stops</a></li>
            <li><a href="#comparison">Side by side</a></li>
            <li><a href="#which">Which one you need</a></li>
            <li><a href="#faq">Frequently asked questions</a></li>
          </ol>
        </div>
      </section>

      <section id="good-at" className="guide-body public-section">
        <h2>What cold email software is good at</h2>
        <p>
          This is not a category to dismiss. Deliverability is a real discipline, and the specialist tools are
          better at it than most all-in-one products.
        </p>
        <GuideList items={goodAt} />
      </section>

      <section id="stops" className="guide-body public-section">
        <h2>Where it stops</h2>
        <p>
          Six places the work comes back to you. None of them are flaws in the tools — they are simply outside
          what a sending product is built to do.
        </p>
        {stopsAt.map((item) => (
          <div key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
        <div className="guide-callout">
          <p>
            The most expensive failure in cold email is not a message that goes to spam. It is a message that
            lands, gets read, and says something confidently untrue about the reader&apos;s business.{" "}
            <Link href="/accuracy">How GNX Sales is built to avoid that</Link>.
          </p>
        </div>
      </section>

      <section id="comparison" className="guide-body public-section">
        <h2>Side by side</h2>
        <ComparisonTable themLabel="Cold email software" rows={comparison} />
      </section>

      <section id="which" className="guide-body public-section">
        <h2>Which one you need</h2>
        <h3>An email-only tool is the right call when</h3>
        <GuideList items={whenEmailOnly} />
        <h3>You need something broader when</h3>
        <GuideList items={whenBroader} />
        <p>
          If it is the second list, start with{" "}
          <Link href="/sales-automation-software">the sales automation overview</Link> or read the{" "}
          <Link href="/ai-sdr-tools">AI SDR tools buyer&apos;s guide</Link>.
        </p>
      </section>

      <section id="faq" className="guide-body public-section">
        <h2>Frequently asked questions</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
