export const metadata = {
  title: { absolute: "GNX Sales frequently asked questions" },
  description: "Answers to common questions about GNX sales pricing, subscriptions, AI replies, deliverability, integrations, and data handling.",
  alternates: { canonical: "/faq" },
  openGraph: { url: "/faq" },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import FaqAssistant from "../../components/marketing/FaqAssistant";
import FaqBrowser from "../../components/marketing/FaqBrowser";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const groups = [
  {
    id: "start",
    chip: "Getting started",
    icon: "bolt",
    title: "Getting started",
    items: [
      {
        q: "What exactly does GNX Sales do?",
        a: "It is an AI sales agent that runs your outbound for you. It finds buyers who match your ideal customer, researches why they would care, writes and sends the emails, calls them with an AI voice, follows up, and books the meeting on your calendar.",
      },
      {
        q: "How long does setup take?",
        a: "Most people launch their first campaign in one sitting. Answer the onboarding questions so the agent learns your offer, connect Gmail or a custom mailbox, build a lead list, and launch. When meetings come depends on your market and offer, so we do not promise a date.",
      },
      {
        q: "Do I need a technical person?",
        a: "No. Onboarding is a guided set of questions and the connections are one-click sign-ins. If you built your product with AI tools and never hired a salesperson, this was made for you.",
      },
      {
        q: "Can I bring my own leads?",
        a: "Yes. Upload a CSV and map the columns, or let the agent search our lead database for people who match your ideal customer.",
      },
    ],
  },
  {
    id: "agent",
    chip: "Calls and replies",
    icon: "phone",
    title: "Calls and replies",
    items: [
      {
        q: "Does it really make phone calls?",
        a: "Yes. Every plan includes AI voice campaigns. The agent calls your leads, has a real conversation, handles common objections and books a meeting when the prospect is ready. It can also answer inbound calls.",
      },
      {
        q: "Does the caller say it is an AI?",
        a: "Always. Every call opens by telling the person they are speaking to an AI agent. Calls end automatically after 20 minutes.",
      },
      {
        q: "What happens when a prospect replies?",
        a: "Follow-ups to that person stop at once and you get an alert, so you can take over the conversation. Follow-ups also stop for leads who book a meeting, say they are not interested, or unsubscribe. If you prefer, switch on autopilot for that campaign and the agent replies for you within the instructions you set.",
      },
      {
        q: "Are calls recorded?",
        a: "Both outbound and inbound calls are recorded and transcribed so you can review them in Call History.",
      },
      {
        q: "Which languages does the agent speak?",
        a: "English, for both email and calls. It works best for selling to English-speaking markets such as the US, Canada, the UK and India.",
      },
    ],
  },
  {
    id: "quality",
    chip: "AI quality",
    icon: "check",
    title: "AI quality",
    items: [
      {
        q: "Do AI replies send on their own?",
        a: "Only if you turn on autopilot, which you set per campaign. By default every draft waits for you to edit, regenerate or approve it. Autopilot changes who approves a message, never whether it was checked: every message passes the same validation either way.",
      },
      {
        q: "How personal are the messages?",
        a: "Each one is written from your offer and what the agent found about that lead's company and role. When it cannot verify a fact, it leaves the fact out rather than guess.",
      },
      {
        q: "What if it writes something wrong?",
        a: "AI can be wrong, which is why review is the default. Edit the draft, or change the campaign instructions so the pattern does not repeat.",
      },
    ],
  },
  {
    id: "compliance",
    chip: "Compliance",
    icon: "shield",
    title: "Deliverability and compliance",
    items: [
      {
        q: "Will this hurt my domain?",
        a: "Sending is spread across sending windows, never blasted, with a daily cap per plan: 100 emails a day on Individual, 200 on Agency and 500 on Startup. GNX Sales does not warm domains for you, so warm a new domain first and keep lists tight.",
      },
      {
        q: "Who is responsible for compliance?",
        a: "You are, as the business doing the outreach. That includes having a lawful basis for each contact and following rules like CAN-SPAM, the TCPA, CASL and India's DPDP Act where they apply. The Terms of Service set this out in full.",
      },
      {
        q: "How are unsubscribes handled?",
        a: "Every email carries unsubscribe instructions. When someone replies asking to stop, the agent detects it (it ignores the quoted text, so your own footer is never mistaken for an opt-out), marks the lead unsubscribed and stops all further emails and calls to them.",
      },
      {
        q: "Do you check Do Not Call lists?",
        a: "Before you add leads to a voice campaign, you confirm that each number is a direct or mobile line, was checked against the Do Not Call registries that apply, and may lawfully be called. GNX Sales then screens leads before dialing: a DNC match is blocked and never called. Treat our screen as a safety net, not your only check.",
      },
    ],
  },
  {
    id: "integrations",
    icon: "link",
    title: "Integrations",
    items: [
      {
        q: "Which email providers work?",
        a: "Gmail and Google Workspace through secure Google sign-in. Outlook and any other provider connect through SMTP for sending and IMAP for reading replies, as long as your mailbox allows password or app-password sign-in. Individual allows 1 mailbox, Agency 10 and Startup 30.",
      },
      {
        q: "How are meetings booked?",
        a: "In GNX Sales' built-in Calendar. When a prospect agrees, the agent books the meeting there, with the Google Meet link you saved, which is reused for every meeting. Google Calendar sync is coming soon.",
      },
      {
        q: "Does it connect to my CRM?",
        a: "Not yet. GNX Sales has its own Prospects, Pipeline and Inbox built in, so you can run the whole outbound loop without a CRM. Tell us which CRM you use and we will prioritise it.",
      },
    ],
  },
  {
    id: "billing",
    chip: "Plans and billing",
    icon: "card",
    title: "Plans and billing",
    items: [
      {
        q: "What do the plans cost?",
        a: "Individual is $59 a month, Agency $179 and Startup $479. Paying yearly brings them to $49, $149 and $399 a month. Every plan includes AI email sequences, lead enrichment and AI voice calling.",
      },
      {
        q: "What is the difference between plans?",
        a: "Individual: 2,645 credits a month, 3 email and 1 voice campaign, 1 user, 1 mailbox, 1 phone number. Agency: 5,370 credits, 10 email and 4 voice campaigns, 5 users, 10 mailboxes, 3 phone numbers. Startup: 14,370 credits, 25 email and 10 voice campaigns, 15 users, 30 mailboxes, 10 phone numbers.",
      },
      {
        q: "Is there a free trial?",
        a: "No. Every account starts on a paid monthly or yearly plan. Book a demo first if you want to see the agent work before paying.",
      },
      {
        q: "What are credits?",
        a: "Credits pay for the work the agent does: AI writing, finding and enriching contacts, and voice calls. One credit equals one cent of what that work costs us at our providers, so you pay for real usage. Phone numbers cost more to find than emails. Each campaign has a credit ceiling you set, and the agent stops before going over it.",
      },
      {
        q: "What happens when my credits run out?",
        a: "New AI writing, enrichment and calls pause, and anything already in progress finishes. Credits refill on your next billing date, or upgrade to get more straight away.",
      },
      {
        q: "Which currency, and is GST charged?",
        a: "Prices are in US dollars and payments go through Razorpay. Right now no GST or other tax is added, for customers in India or anywhere else. We will start charging GST where it applies soon. When we do, we will email you before your next renewal, and the tax will show as a separate line on your checkout and invoice.",
      },
      {
        q: "Can I change or cancel?",
        a: "Anytime, from Billing. When you upgrade, Billing shows the price with your unused credit on the current plan taken off, before you pay. Cancelling stops the next renewal and your plan keeps working until the end of the period you paid for. We do not refund the unused part of a period.",
      },
      {
        q: "Do you give refunds?",
        a: "Fees are non-refundable, except that we review requests made within 14 days of a charge for duplicate billing, a charge after a confirmed cancellation, or a long outage that stopped you using the product. Email support@gnxsales.com and we answer within 3 business days. Approved refunds reach your original payment method in 5 to 10 business days.",
      },
    ],
  },
  {
    id: "data",
    chip: "Data and privacy",
    icon: "lock",
    title: "Data and privacy",
    items: [
      {
        q: "Who is behind GNX Sales?",
        a: "Globonexo India Private Limited, a company registered in India. We serve customers worldwide, mainly in the US, Canada and India.",
      },
      {
        q: "Where is my data stored?",
        a: "In the United States. Our database and backend servers are hosted in US data centres, so your account, leads, campaigns and conversations are stored and processed there.",
      },
      {
        q: "Do you sell my data?",
        a: "No. We share data only with the providers needed to run the product, such as hosting, email, calling, payments and AI.",
      },
      {
        q: "Is my data used to train AI?",
        a: "No. It is sent to AI providers only to produce content for your account, and never used to build anything for other customers.",
      },
      {
        q: "How do I delete my data?",
        a: "Disconnect integrations anytime in Settings, and email support@gnxsales.com to close your account. We erase your workspace within 30 days. The Privacy Policy explains what the law makes us keep.",
      },
    ],
  },
];

const quickFacts = [
  { value: "$59", unit: " /month", label: "Plans start here, calling included" },
  { value: "Email + calls", label: "One agent runs both channels" },
  { value: "You approve", label: "Replies wait for you by default" },
  { value: "1 business day", label: "Our reply time on support email" },
];

const contacts = [
  { icon: "mail", title: "Email support", body: "For account, billing and product questions.", cta: "support@gnxsales.com", href: "mailto:support@gnxsales.com" },
  { icon: "calendar", title: "Book a 30 minute demo", body: "Watch the agent find, email and call a lead live.", cta: "Pick a time", href: "/contact" },
  { icon: "book", title: "Help Center", body: "Step by step guides for every screen.", cta: "Browse guides", href: "/help" },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <FaqBrowser groups={groups}>
        <section className="faq-facts public-section" aria-label="Quick facts">
          <div>
            {quickFacts.map((fact) => (
              <div key={fact.value}>
                <strong>
                  {fact.value}
                  {fact.unit && <small>{fact.unit}</small>}
                </strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
        </section>
      </FaqBrowser>

      <section className="faq-stuck">
        <div className="faq-stuck-inner public-section">
          <div className="faq-stuck-head">
            <span className="eyebrow">Still stuck</span>
            <h2 className="display">Ask a person.</h2>
            <p>Three ways to reach us. We answer every message within one business day.</p>
          </div>
          <div className="faq-stuck-grid">
            {contacts.map((c) => {
              const inner = (
                <>
                  <span className="faq-stuck-icon"><Icon name={c.icon} size={22} color="#fff" /></span>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <strong>{c.cta}</strong>
                </>
              );
              return c.href.startsWith("mailto:") ? (
                <a key={c.title} className="faq-stuck-card" href={c.href}>{inner}</a>
              ) : (
                <Link key={c.title} className="faq-stuck-card" href={c.href}>{inner}</Link>
              );
            })}
          </div>
        </div>
      </section>

      <FaqAssistant />
      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "FAQ", path: "/faq" }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
