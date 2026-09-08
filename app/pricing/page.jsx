export const metadata = {
  title: "AI Sales Agent Pricing: Plans, Credits, and Limits",
  description:
    "AI SDR pricing without the usual add-ons. Every GNX Sales plan includes email sequences, lead enrichment, and AI voice calling from one credit pool. Compare plans and monthly costs.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    url: "/pricing",
    title: "AI Sales Agent Pricing: Plans, Credits, and Limits",
    description:
      "Every plan includes email, enrichment, and AI voice calling on one credit pool. Credits set the ceiling, not the feature list.",
  },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import PlanCards from "../../components/marketing/PlanCards";
import FaqSection from "../../components/marketing/FaqSection";

// The contrast that used to sit on the landing page. It belongs here, next to
// the prices, where someone is actually deciding.
const comparison = [
  { them: 'Buy a list and send to all of it', us: 'Every account checked against your profile first' },
  { them: 'Pay to enrich, then find out they were a bad fit', us: 'Fit is settled before a credit is spent' },
  { them: 'Email only — calling is a different tool and a second bill', us: 'Email and AI voice from one shared pool' },
  { them: 'The model writes whatever sounds convincing', us: 'It is handed an explicit list of what it does not know' },
  { them: 'A voice agent goes live untested', us: 'Stress-test it against adversarial calls before it dials, if you want the check' },
  { them: 'You remember to stop the sequence after a reply', us: 'A reply stops the follow-ups on its own' },
  { them: 'Buy and configure your own calling number separately', us: 'A phone number is provisioned for you automatically' },
];


const faqs = [
  {
    q: "How does AI sales agent pricing work here?",
    a: "One monthly or annual subscription per plan. Each plan comes with a pool of credits that flex across lead enrichment, message drafting, and voice calling, plus a ceiling on how many campaigns you can run at once. There is no per-seat charge and no per-channel charge.",
  },
  {
    q: "Is AI voice calling priced separately?",
    a: "No. Email and voice draw from the same credit pool on every plan, and a calling number is provisioned for you automatically. What scales with the tier is how many voice campaigns run at once, never whether you get the channel.",
  },
  {
    q: "Is there a free trial?",
    a: "No. All accounts start on a paid monthly or annual subscription. You choose a plan before onboarding, and cancelling stops the next renewal while the current paid period stays available.",
  },
  {
    q: "What happens if I hit my plan limits?",
    a: "You are prompted to upgrade before sending beyond your plan's email, call, or enrichment limits. Usage already consumed is billed as used.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Any time, from Billing in your settings. Cancelling stops future renewals and your plan stays active through the end of the current billing period.",
  },
  {
    q: "How does this compare to hiring an SDR?",
    a: "A plan costs a fraction of a sales development rep's monthly salary and covers sourcing, enrichment, writing, sending, following up, calling, and booking. It does not replace the person who runs the meeting.",
  },
];

export default function PricingPage() {
  return (
    <div className="public-page story-page">
      <div className="story-hero-band">
        <PublicNav variant="dark" />
        <section className="story-hero public-section">
          <span className="eyebrow">Pricing</span>
          <h1 className="display">AI sales agent pricing without adding headcount.</h1>
          <p>Choose a monthly or annual paid plan. Every tier includes the same core sales loop — email sequences, lead enrichment, and AI voice calling. Credits set the ceiling and flex across enrichment, drafting, and calling, so AI SDR pricing here means one number, not a feature ladder.</p>
          <div className="content-hero-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">
              Choose a plan <Icon name="arrow" size={18} color="#06231a" />
            </Link>
            <Link className="landing-outline-btn" href="/platform">See what is included</Link>
          </div>
        </section>
      </div>

      <main>
        <section className="pricing-grid public-section" aria-label="Pricing plans">
          <PlanCards />
        </section>

        <section className="pricing-compare public-section">
          <div className="content-section-head">
            <h2>Why this AI SDR pricing beats the usual stack</h2>
            <p>Not a cheaper version of the same thing. A different way of deciding who gets contacted.</p>
          </div>
          <div className="cmp">
            <div className="cmp-head">
              <span>The usual way</span>
              <span className="cmp-head-us">GNX Sales</span>
            </div>
            {comparison.map((row) => (
              <div key={row.us} className="cmp-row">
                <div className="cmp-them"><Icon name="close" size={15} color="var(--stop)" /><p>{row.them}</p></div>
                <div className="cmp-us"><Icon name="check" size={15} color="var(--g-800)" /><p>{row.us}</p></div>
              </div>
            ))}
          </div>
        </section>

        <FaqSection heading="Pricing questions" items={faqs} />

        <section className="pricing-note public-section">
          <div>
            <h2>Every plan includes the core sales loop.</h2>
            <p>Every plan includes AI email sequences, lead enrichment from verified data providers, AI voice calling with a phone number provisioned for you, human-approved replies, inbox review, dashboard metrics, and support access.</p>
          </div>
          <Link className="btn btn-primary btn-lg" href="/signup">
            Create account <Icon name="arrow" size={16} color="#06231a" />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
