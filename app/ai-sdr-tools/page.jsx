export const metadata = {
  title: "AI SDR Tools: Buyer's Guide and Comparison",
  description:
    "A buyer's guide to AI SDR tools — the categories on the market, what each one actually automates, the questions to ask before you buy, and how to tell a real AI SDR from a sequencer with an AI label.",
  alternates: { canonical: "/ai-sdr-tools" },
  openGraph: {
    url: "/ai-sdr-tools",
    title: "AI SDR Tools: Buyer's Guide and Comparison",
    description:
      "The categories of AI SDR tool on the market, what each automates, and the questions to ask before you buy.",
  },
};

import Link from "next/link";
import FaqSection from "../../components/marketing/FaqSection";
import GuideLayout, { ComparisonTable } from "../../components/marketing/GuideLayout";

// Categories, not named vendors. Every claim here is about a class of product
// and is true of that class, so the page does not go stale when a competitor
// ships a feature or rename.
const categories = [
  {
    name: "Lead databases",
    does: "Sell you access to contact records — companies, people, emails, phone numbers, firmographics.",
    gap: "Finding a person is not the same as knowing they should be contacted. The list arrives; the deciding, writing, sending, and following up are still yours.",
  },
  {
    name: "Sequencers and cold email platforms",
    does: "Send a sequence to a list on a schedule, throttle the volume, and track opens and replies.",
    gap: "They automate the sending, not the thinking. You still write the messages, and every prospect gets the same template with a first name swapped in.",
  },
  {
    name: "AI writing add-ons",
    does: "Bolt a generation button onto a sequencer so it can draft a first touch from a LinkedIn profile.",
    gap: "The model is given whatever happens to be in the row and asked to sound convincing. That is exactly the setup that produces a confident sentence about a problem the company does not have.",
  },
  {
    name: "AI voice and dialer tools",
    does: "Place outbound calls with a synthetic voice, or connect a human rep faster.",
    gap: "A second product, a second bill, and a second set of prospect data that does not know what your email campaign already said to the same person.",
  },
  {
    name: "Full AI SDR agents",
    does: "Run the whole pre-close motion: sourcing, qualification, research, writing, sending, following up, reply handling, calling, and booking.",
    gap: "The category is young, so the label gets used loosely. The questions below are how you tell a real one from a sequencer wearing the name.",
  },
];

const questions = [
  {
    q: "Does it decide who to contact, or only how to reach them?",
    a: "A real AI SDR checks each account against your ideal customer profile before it spends anything on enrichment. A sequencer takes whatever list you hand it. Ask to see the qualification rules — and ask whether you can read and edit them, or whether they are a hidden score.",
  },
  {
    q: "What does it do when it does not know enough?",
    a: "This is the single most important question, and almost nobody asks it. A tool that always produces a message will sometimes produce a false one. Ask what happens to a lead with a missing job title or an unverified email: does it write anyway, or does it stop and tell you what is missing?",
  },
  {
    q: "Is email and calling one system or two?",
    a: "If voice is a separate product, the voice agent does not know what the email sequence said, a reply on one channel does not stop the other, and you are reconciling two sets of usage against two invoices.",
  },
  {
    q: "Who approves a message before it sends?",
    a: "Full autonomy sounds like the selling point and is usually the risk. You want review as the default, with autopilot as something you switch on per campaign once you have read enough of its output to trust it.",
  },
  {
    q: "Does a reply actually stop the follow-ups?",
    a: "It should happen automatically, on every terminal state — engaged, meeting booked, not interested, unsubscribed. Ask specifically, because the follow-up that arrives after someone already replied is the one that costs you the deal.",
  },
  {
    q: "How is it priced, and what is metered?",
    a: "Per seat, per contact, per enriched record, per email, per call minute — the axis matters more than the headline number. A single credit pool that flexes across enrichment, drafting, and calling is far easier to forecast than four separate meters.",
  },
  {
    q: "Can it book the meeting itself?",
    a: "Booking is where automation either pays off or falls apart. Ask whether the agent reads real calendar availability, or proposes times and hopes. An agent that invents a slot creates a worse impression than no automation at all.",
  },
];

const comparison = [
  { them: "You supply the list, the tool supplies the sending", us: "Sourcing, qualification, and sending are one motion" },
  { them: "Enrichment is billed on every record you pull", us: "Fit is settled against your profile before a credit is spent" },
  { them: "Email is one product, calling is another", us: "Email and AI voice run from one credit pool and one prospect record" },
  { them: "The model writes whatever sounds convincing", us: "The model is handed an explicit list of what it does not know" },
  { them: "A voice agent goes live untested", us: "Ten adversarial scenarios, scored, before it can dial" },
  { them: "You remember to stop the sequence after a reply", us: "A reply stops the follow-ups automatically" },
  { them: "Priced per seat, so a second person doubles the bill", us: "Priced by volume, not by headcount" },
];

const faqs = [
  {
    q: "What are AI SDR tools?",
    a: "AI SDR tools automate the work of a sales development rep: building a target list, researching each account, writing the first touch and follow-ups, handling early replies, and booking a qualified meeting. The category ranges from AI writing buttons on an existing sequencer to full agents that run the whole motion.",
  },
  {
    q: "Are AI SDR tools worth it?",
    a: "They are worth it when the bottleneck is research and writing volume rather than product-market fit. If you already know who buys and why, an AI SDR removes the repetitive half of reaching them. If you do not yet know who buys, faster outreach to the wrong people just fails faster.",
  },
  {
    q: "How much do AI SDR tools cost?",
    a: "Most sit between roughly $100 and $1,500 a month depending on the volume tier and how many meters are running. Watch the pricing axis rather than the headline: per-seat, per-contact, per-enrichment, and per-call-minute pricing add up very differently at the same list size.",
  },
  {
    q: "Can an AI SDR replace a human SDR?",
    a: "It replaces the repetitive part of the role, not the judgment. Sourcing, qualification, research, writing, follow-up, and scheduling can run unattended. Discovery calls, deal strategy, and anything requiring real negotiation still need a person.",
  },
  {
    q: "What is the biggest risk with an AI SDR tool?",
    a: "Confident, false personalization. A message referencing a problem the company does not have does more damage than a plainly generic one, because it tells the reader nobody looked. Choose a tool that stops rather than guesses when the context is thin.",
  },
];

export default function AiSdrToolsPage() {
  return (
    <GuideLayout
      eyebrow="Buyer's guide"
      title="AI SDR tools: what they do and how to choose one."
      intro="The term covers five quite different kinds of product. This guide separates them, explains what each one actually automates, and gives you the seven questions that tell a real AI SDR from a sequencer with an AI label on it."
      secondaryCta={{ href: "/solutions", label: "See it by use case" }}
    >
      <section className="guide-body public-section">
        <div className="guide-toc">
          <strong>On this page</strong>
          <ol>
            <li><a href="#categories">The five categories of AI SDR tool</a></li>
            <li><a href="#questions">Seven questions to ask before you buy</a></li>
            <li><a href="#comparison">How GNX Sales compares</a></li>
            <li><a href="#faq">Frequently asked questions</a></li>
          </ol>
        </div>
      </section>

      <section id="categories" className="guide-body public-section">
        <h2>The five categories of AI SDR tool</h2>
        <p>
          Almost every product in this market calls itself an AI SDR. They are not the same thing, and the
          difference is which part of the job you are still doing yourself after you buy.
        </p>
        {categories.map((category) => (
          <div key={category.name}>
            <h3>{category.name}</h3>
            <p><strong>What it does.</strong> {category.does}</p>
            <p><strong>Where the work comes back to you.</strong> {category.gap}</p>
          </div>
        ))}
        <div className="guide-callout">
          <p>
            A quick test: ask a vendor what their product does with a lead whose job title is missing. A sequencer
            sends anyway. A writing add-on invents something plausible. A real AI SDR tells you the lead is not
            ready and names what is missing.
          </p>
        </div>
      </section>

      <section id="questions" className="guide-body public-section">
        <h2>Seven questions to ask before you buy</h2>
        <p>
          Demos are built to look good. These questions are the ones that separate products that run the motion
          from products that run the sending.
        </p>
        {questions.map((item, index) => (
          <div key={item.q}>
            <h3>{index + 1}. {item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </section>

      <section id="comparison" className="guide-body public-section">
        <h2>How GNX Sales compares</h2>
        <p>
          We built GNX Sales because the honest answer to most of those seven questions, across most of the
          category, is disappointing. Here is where we land against the common pattern.
        </p>
        <ComparisonTable themLabel="The usual AI SDR stack" rows={comparison} />
        <p>
          The full capability list is on <Link href="/platform">the platform page</Link>, the voice agent and its
          pre-launch testing are covered on <Link href="/voice">the AI voice agent page</Link>, and{" "}
          <Link href="/pricing">pricing</Link> shows what each tier includes.
        </p>
      </section>

      <section id="faq" className="guide-body public-section">
        <h2>Frequently asked questions</h2>
        <FaqSection items={faqs} className="" />
      </section>
    </GuideLayout>
  );
}
