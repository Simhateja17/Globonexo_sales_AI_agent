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

import PricingView from "../../components/marketing/PricingView";

const faqs = [
  {
    q: "Is there a free trial?",
    a: "No. Every account starts on a paid monthly or yearly plan. Book a demo if you want to watch the agent find, email and call a lead before you pay.",
  },
  {
    q: "Is AI calling priced separately?",
    a: "No. Outbound calling is in every plan and draws from the same credits as email and enrichment, and your plan's phone numbers are included. Extra numbers beyond your plan cost 200 credits each every 30 days. The plan decides how many voice campaigns run at once.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "New AI writing, enrichment and calls pause, and anything already in progress finishes. Credits refill on your next billing date, or upgrade to get more straight away. You are never billed for overage.",
  },
  {
    q: "Am I locked into a contract?",
    a: "No. Monthly plans renew month to month and you can cancel from Billing any time; your plan keeps working until the period you paid for ends. Yearly plans are paid up front for 12 months at about 17% less.",
  },
  {
    q: "Are there hidden costs?",
    a: "No setup fee, no onboarding fee, no per-seat and no per-channel charges. You need your own sending inbox and domain, with SPF, DKIM and DMARC set up. GNX does not warm new domains, so warm a brand new one before your first campaign.",
  },
  {
    q: "Will it hurt my email deliverability?",
    a: "It is built not to. By default the agent only emails addresses verified as real, sends are paced inside daily caps of 100 to 500, and every email carries a one-click unsubscribe. Tight targeting does the rest.",
  },
  {
    q: "How much of my time does it take?",
    a: "Setup takes one sitting. After that, plan on reviewing drafts when a batch is ready, usually once a week, and handling the replies and meetings it brings in. Switch on autopilot per campaign once you trust the output.",
  },
  {
    q: "How do I pay?",
    a: "Through Razorpay's secure checkout, in US dollars. Your saved payment method renews the plan automatically each period.",
  },
  {
    q: "Do you charge per seat?",
    a: "No. Seats come with the plan: 1 on Individual, 5 on Agency and 15 on Startup. Adding a teammate within your seats costs nothing extra.",
  },
  {
    q: "How much do I save paying yearly?",
    a: "About 17%. Yearly works out to $49, $149 or $399 a month, billed once as $588, $1,788 or $4,788.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Any time, from Billing. Upgrades show the price with unused credit taken off. Moving to a smaller plan starts at the end of your current period. Cancelling stops the next renewal, and unused time is not refunded.",
  },
  {
    q: "Do you give refunds?",
    a: "Fees are non-refundable, except that we review requests within 14 days of a charge for duplicate billing, a charge after a confirmed cancellation, or a long outage. Email support@gnxsales.com and we reply within 3 business days.",
  },
  {
    q: "Is it cheaper than hiring an SDR?",
    a: "On cost, yes: the median SDR earns about $80K a year on target, before tools and management, while the top plan is $5,748 a year paid monthly. But it does a different job. GNX handles research, writing, follow-up, first calls and booking. A person still runs the conversation and closes.",
  },
];

export default function PricingPage() {
  return <PricingView faqs={faqs} />;
}
