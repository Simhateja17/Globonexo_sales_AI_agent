export const metadata = {
  title: { absolute: "Terms of service for GNX Sales" },
  description: "Read the GNX Sales Terms of Service covering AI sales automation, campaigns, lead data, billing, compliance, and account use.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms", images: ["/og-image.png"] },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import LegalSection from "../../components/marketing/LegalSection";
import PrivacyToc from "../../components/marketing/PrivacyToc";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const glance = [
  { icon: "building", title: "For businesses only", body: "GNX Sales is a B2B tool for reaching business contacts, not consumers." },
  { icon: "shield", title: "You own who you contact", body: "You are the sender. Consent, opt-outs and outreach laws are yours to meet." },
  { icon: "lock", title: "Your data stays yours", body: "We use it only to run your account. Export it before you leave." },
  { icon: "refresh", title: "Cancel anytime", body: "Stop renewal from Billing. Your plan runs to the end of the paid period." },
];

const toc = [
  ["agree", "Agreeing to these terms"],
  ["service", "The service"],
  ["accounts", "Accounts and users"],
  ["billing", "Plans, credits and billing"],
  ["cancel", "Cancelling and refunds"],
  ["outreach", "Your outreach duties"],
  ["calls", "Rules for AI calls"],
  ["aup", "What you cannot do"],
  ["ai", "AI output and autopilot"],
  ["leads", "Lead data and results"],
  ["data", "Your data"],
  ["ip", "Our IP and feedback"],
  ["third", "Third-party services"],
  ["confidential", "Confidentiality"],
  ["availability", "Availability and changes"],
  ["termination", "Suspension and termination"],
  ["warranty", "Disclaimers"],
  ["liability", "Limit of liability"],
  ["indemnity", "Indemnity"],
  ["law", "Law and disputes"],
  ["changes", "Changes to these terms"],
  ["general", "General"],
  ["contact", "Contact"],
];

const billing = [
  ["Paying", "Paid plans are billed in advance, monthly or yearly, in US dollars through Razorpay. The Free plan costs nothing, has the limits shown on the pricing page, and may be changed, paused or closed after long inactivity (paused after 60 days and deleted after 12 months without a sign-in, with email warnings first)."],
  ["Renewal", "Your plan renews automatically at the end of each period until you cancel. We email a reminder before each yearly renewal."],
  ["Credits", "Credits pay for AI writing, lead enrichment and voice calls. One credit equals one US cent of what that work costs us at our providers. Your plan's credits refill at the start of each billing period. Unused credits do not carry over and are not refunded."],
  ["Running out", "When credits run out, new AI, enrichment and call work pauses. Work already in progress can finish."],
  ["Campaign budgets", "A campaign's credit limit is a ceiling you authorise, not a promise of any number of leads."],
  ["Upgrades", "Billing shows the price, any unused credit from your current plan, and the total before you pay."],
  ["Taxes", "Prices currently include no GST or other tax. When GST or other taxes start to apply, we will add them on top and tell you before your next renewal."],
  ["Price changes", "We will email you at least 30 days before a price change, and it takes effect at your next renewal."],
  ["Failed payments", "If a renewal payment fails, we may limit sending and calling until it is paid."],
];

export default function TermsPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <section className="privacy-hero">
        <div className="privacy-hero-inner public-section">
          <div className="privacy-hero-copy">
            <span className="privacy-hero-eyebrow">
              <Icon name="doc" size={14} /> Legal · Terms of Service
            </span>
            <h1 className="display">
              The deal,<br />
              <span>said plainly.</span>
            </h1>
            <p>
              What you get from GNX Sales, what we expect in return, and who is responsible for what when an AI agent
              emails and calls on your behalf.
            </p>
            <div className="privacy-hero-pills">
              <span>Effective 18 October 2026</span>
              <span>Governed by Indian law</span>
              <span>15 minute read</span>
            </div>
          </div>
          <aside className="privacy-fiduciary" aria-label="Who you contract with">
            <span>You are contracting with</span>
            <strong>Globonexo India Private Limited</strong>
            <div>
              <p>CIN: U62013DC2026PTC469655</p>
              <p>44, Backary Portion, 2nd Floor, Regal Building, Connaught Place, New Delhi 110001, India</p>
              <a href="mailto:support@gnxsales.com">support@gnxsales.com</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="privacy-glance public-section" aria-label="At a glance">
        {glance.map((item) => (
          <div key={item.title} className="privacy-glance-card">
            <span className="privacy-glance-icon"><Icon name={item.icon} size={20} color="#fff" /></span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </section>

      <main className="privacy-layout public-section">
        <PrivacyToc items={toc} />

        <article className="privacy-article">
          <LegalSection id="agree" n="01" title="Agreeing to these terms">
            <p>
              These Terms of Service are a contract between you and Globonexo India Private Limited (&quot;GNX
              Sales&quot;, &quot;we&quot;, &quot;us&quot;), a company incorporated in India. They apply when you create
              an account, buy a plan, or use gnxsales.com or the GNX Sales app. By clicking to accept them or using the
              service, you agree to them.
            </p>
            <p>
              If you accept for a company, you confirm you have authority to bind it, and &quot;you&quot; means that
              company. You must be at least 18 and use GNX Sales for business purposes, not personal or household ones.
            </p>
            <p>
              These terms work together with our <Link href="/privacy">Privacy Policy</Link>,{" "}
              <Link href="/refund">Refund Policy</Link> and <Link href="/cookies">Cookie Policy</Link>. If you sign a
              separate order form or agreement with us, that document wins where it clearly conflicts with these terms.
            </p>
          </LegalSection>

          <LegalSection id="service" n="02" title="The service">
            <p>
              GNX Sales is an AI sales agent. Within the limits of your plan and settings, it can find and enrich
              business leads, write and send emails from your mailbox, place and answer AI voice calls, detect replies,
              alert you or reply on autopilot, and book meetings in its built-in calendar.
            </p>
            <p>
              Some features may be labelled beta or preview. They can change, have bugs, or be removed, and the
              service-level parts of these terms do not cover them.
            </p>
          </LegalSection>

          <LegalSection id="accounts" n="03" title="Accounts and users">
            <ul className="privacy-list">
              <li>Give us accurate details and keep them current.</li>
              <li>Keep sign-in details secret. You are responsible for everything done under your account, including by users you invite.</li>
              <li>Each plan has a set number of users, mailboxes and phone numbers. Do not share one login between people to get around them.</li>
              <li>Tell us at once at support@gnxsales.com if you think your account has been misused.</li>
            </ul>
          </LegalSection>

          <LegalSection id="billing" n="04" title="Plans, credits and billing">
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr><th scope="col">Topic</th><th scope="col">How it works</th></tr>
                </thead>
                <tbody>
                  {billing.map(([topic, how]) => (
                    <tr key={topic}><td>{topic}</td><td>{how}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LegalSection>

          <LegalSection id="cancel" n="05" title="Cancelling and refunds">
            <p>
              Cancel anytime from Billing. Cancelling stops the next renewal. Your plan, with its features and credits,
              keeps working until the end of the period you paid for.
            </p>
            <p>
              All payments are final and we do not give refunds, including for the unused part of a period and unused
              credits. The one exception is a billing mistake on our side, such as being charged twice for the same
              period or charged after a confirmed cancellation, which we correct. The Refund Policy has the details.
              Nothing here limits a refund the law requires.
            </p>
          </LegalSection>

          <LegalSection id="outreach" n="06" title="Your outreach duties">
            <p>
              You are the sender of every email and the caller on every call the agent makes for you. We provide the
              tool. You decide who to contact and why, so you are responsible for doing it lawfully. In particular, you
              must:
            </p>
            <ul className="privacy-list">
              <li>Have a lawful basis, and any consent the law requires, for every person you upload, enrich, email or call.</li>
              <li>Follow the outreach laws where your recipients are, which can include CAN-SPAM and the TCPA in the US, CASL in Canada, the GDPR and PECR in the EU and UK, and the DPDP Act and TRAI&apos;s commercial communication rules in India.</li>
              <li>Send only truthful emails that name your business, show a valid postal address, and carry a working way to unsubscribe.</li>
              <li>Honour unsubscribe and do-not-call requests promptly, and never re-upload people who opted out.</li>
              <li>Check numbers against the Do Not Call registries that apply before adding them to a voice campaign, as the app asks you to confirm.</li>
              <li>Keep your sending domain, mailbox and phone numbers in good standing with their providers.</li>
            </ul>
            <div className="privacy-note">
              <strong>Our tools are a safety net, not your compliance program</strong>
              <p>
                GNX Sales adds unsubscribe handling, opt-out detection, DNC screening and AI disclosure. These help, but
                they are not legal advice and they can miss things. Ask your own lawyer what applies to your campaigns.
              </p>
            </div>
          </LegalSection>

          <LegalSection id="calls" n="07" title="Rules for AI voice calls">
            <p>
              In the US, the FCC treats AI-generated voices as &quot;artificial&quot; voices under the Telephone Consumer
              Protection Act. Calls that use one to mobile or residential numbers generally need the recipient&apos;s
              prior express consent, and prior express written consent for marketing. Other countries have their own
              rules. When you run a voice campaign, you agree to:
            </p>
            <ul className="privacy-list">
              <li>Call only business contacts you are lawfully allowed to call, with any consent the law requires.</li>
              <li>Keep the AI disclosure at the start of every call. You may not edit prompts to make the agent claim it is a human.</li>
              <li>Make sure each call names your business and gives a way to ask not to be called again.</li>
              <li>Call only at reasonable local hours for the person called, and never call emergency, healthcare or similar protected lines.</li>
              <li>Give any notice or get any consent that call recording needs where the person is, since calls are recorded.</li>
              <li>Never clone or imitate a real person&apos;s voice without their written permission.</li>
            </ul>
            <p>
              Calls end automatically after 20 minutes. We may pause a voice campaign that draws complaints, carrier
              flags or a high rate of opt-outs while we look into it.
            </p>
          </LegalSection>

          <LegalSection id="aup" n="08" title="What you cannot do">
            <ul className="privacy-list privacy-list--no">
              <li>Send spam, phishing, scams or messages with false headers, subject lines or sender details.</li>
              <li>Contact consumers for personal, family or household offers, or contact minors.</li>
              <li>Promote anything illegal, or adult content, gambling, weapons, drugs, debt relief, payday loans, crypto investment schemes or political campaigns.</li>
              <li>Harass, threaten or discriminate against anyone, or impersonate another person or company.</li>
              <li>Upload sensitive personal data such as health, financial account, religion, caste or government ID details.</li>
              <li>Scrape, resell or share lead data from GNX Sales outside your own outreach.</li>
              <li>Probe, break or overload our systems, get around plan limits, or reverse engineer the service.</li>
              <li>Use GNX Sales to build a competing product.</li>
              <li>Break the rules of Google, our voice provider, our lead data provider, or any other service you connect.</li>
            </ul>
          </LegalSection>

          <LegalSection id="ai" n="09" title="AI output and autopilot">
            <p>
              Emails, replies, research, call scripts and summaries are generated by AI. They can be wrong, out of date
              or unsuitable. By default, replies wait for your approval. If you turn on autopilot, auto-sending or AI
              calling, you authorise the agent to act within the settings and budgets you chose, and you remain
              responsible for what it sends and says.
            </p>
            <p>
              As between you and us, you own the output generated for your account and may use it as you like, subject to
              these terms. Similar output may be generated for other customers.
            </p>
          </LegalSection>

          <LegalSection id="leads" n="10" title="Lead data and results">
            <p>
              Lead data comes from third-party providers and your own uploads. It can be incomplete or wrong, so check
              anything that matters before you rely on it. A campaign&apos;s target number of leads is an upper limit,
              not a promise. Searched, enriched, qualified, contacted and booked are different counts. A campaign can
              finish at 100% and still report a partial result such as &quot;12 of 25 leads found&quot;.
            </p>
            <p>
              We do not guarantee delivery, inbox placement, opens, replies, connected calls, meetings or revenue.
              Results depend on your offer, targeting, reputation and many things outside our control.
            </p>
          </LegalSection>

          <LegalSection id="data" n="11" title="Your data">
            <p>
              You own your data: your leads, campaigns, messages, call recordings and settings. You give us permission to
              host, copy, process and transmit it only to run, secure and support the service for you, and to improve it
              using aggregated data that does not identify you or your contacts.
            </p>
            <p>
              For your prospects&apos; personal data, you are the data fiduciary (or controller) and we process it on
              your behalf, as our Privacy Policy explains. Our servers are in the United States. If you need a signed
              Data Processing Agreement, email us.
            </p>
          </LegalSection>

          <LegalSection id="ip" n="12" title="Our IP and feedback">
            <p>
              GNX Sales, including its software, models, prompts, designs, the GNX Sales name and logo, belongs to
              Globonexo. We give you a limited, non-exclusive, non-transferable right to use it during your subscription
              under these terms. If you send us ideas or feedback, we may use them without paying you or owing you
              anything.
            </p>
          </LegalSection>

          <LegalSection id="third" n="13" title="Third-party services">
            <p>
              GNX Sales relies on services we do not control, including Google, Razorpay, Supabase, our voice provider,
              our lead data provider and AI model providers. Your use of a service you connect, such as Gmail, is also
              governed by that provider&apos;s terms. We are not responsible for their outages, data, pricing or policy
              changes, but we will try to keep the service working when they change.
            </p>
          </LegalSection>

          <LegalSection id="confidential" n="14" title="Confidentiality">
            <p>
              Each of us will keep the other&apos;s non-public information confidential and use it only for this
              agreement. This does not cover information that is public, already known, independently built, or that the
              law requires to be disclosed, in which case the disclosing side will give notice where it is allowed to.
            </p>
          </LegalSection>

          <LegalSection id="availability" n="15" title="Availability and changes to the service">
            <p>
              We work to keep GNX Sales running, but it may be interrupted for maintenance, provider failures, security
              events or things beyond our control. We may change, add or remove features. If we remove a core feature you
              pay for, we will tell you in advance and you may cancel before the change takes effect.
            </p>
          </LegalSection>

          <LegalSection id="termination" n="16" title="Suspension and termination">
            <p>
              We may suspend or close your account, or pause a campaign, if you materially break these terms, do not pay,
              or your use puts people, our systems, our providers or us at legal risk. Where it is safe and lawful, we
              will tell you first and give you a chance to fix it.
            </p>
            <p>
              You may stop using GNX Sales anytime. After your account closes, you have 30 days to ask us to export your
              data, after which we delete it as our Privacy Policy describes. Sections on fees owed, your outreach
              duties, IP, disclaimers, liability, indemnity and disputes survive termination.
            </p>
          </LegalSection>

          <LegalSection id="warranty" n="17" title="Disclaimers">
            <p>
              To the extent the law allows, GNX Sales and all lead data and AI output are provided &quot;as is&quot; and
              &quot;as available&quot;. We do not promise the service will be error-free or uninterrupted, or that it
              will meet your needs, and we disclaim implied warranties of merchantability, fitness for a particular
              purpose and non-infringement.
            </p>
          </LegalSection>

          <LegalSection id="liability" n="18" title="Limit of liability">
            <p>
              To the extent the law allows, neither of us is liable for indirect, incidental, special or consequential
              losses, or for lost profits, revenue, deals or data. Our total liability for all claims about GNX Sales is
              limited to the fees you paid us in the 12 months before the event that caused the claim.
            </p>
            <p>
              These limits do not apply to fraud, wilful misconduct, your payment obligations, your indemnity in section
              19, or anything else the law does not allow us to limit.
            </p>
          </LegalSection>

          <LegalSection id="indemnity" n="19" title="Indemnity">
            <p>
              You will defend and pay for any claim, fine or cost brought against us by a third party or regulator that
              arises from your leads, your content, your campaigns, or your breach of sections 6, 7 or 8. This includes
              claims under spam, telemarketing and privacy laws. We will tell you promptly about such a claim and let you
              control the defence, and you will not settle it in a way that admits fault for us without our consent.
            </p>
          </LegalSection>

          <LegalSection id="law" n="20" title="Governing law and disputes">
            <p>
              These terms are governed by the laws of India. If a dispute arises, email us first and we will both try in
              good faith to settle it within 30 days.
            </p>
            <div className="privacy-grid privacy-grid--3">
              <div className="privacy-tile privacy-tile--green"><span>Step 1</span><strong>Talk to us</strong><p>30 days of good-faith talks</p></div>
              <div className="privacy-tile privacy-tile--green"><span>Step 2</span><strong>Arbitration</strong><p>Sole arbitrator, seated in New Delhi, in English</p></div>
              <div className="privacy-tile"><span>Courts</span><strong>New Delhi</strong><p>For urgent interim relief</p></div>
            </div>
            <p>
              If talks fail, the dispute will be decided by a sole arbitrator under the Arbitration and Conciliation Act,
              1996, appointed by mutual agreement. The seat and venue will be New Delhi, and the hearing may be held
              online. The language will be English. Subject to this, the courts at New Delhi have exclusive
              jurisdiction. Either of us may still ask a court for urgent interim relief, such as to protect
              confidential information or IP.
            </p>
          </LegalSection>

          <LegalSection id="changes" n="21" title="Changes to these terms">
            <p>
              We may update these terms as the product and the law change. For a material change, we will email account
              owners at least 14 days before it takes effect. If you do not agree, you may cancel before then. Using GNX
              Sales after the change takes effect means you accept it.
            </p>
          </LegalSection>

          <LegalSection id="general" n="22" title="General">
            <ul className="privacy-list">
              <li><strong>Force majeure:</strong> neither of us is liable for delays caused by events outside reasonable control, such as outages of major providers, natural disasters or government action. This does not excuse payment.</li>
              <li><strong>Assignment:</strong> you may not transfer these terms without our consent. We may transfer them as part of a merger, acquisition or sale of assets.</li>
              <li><strong>Notices:</strong> we send notices to your account email. You send them to support@gnxsales.com.</li>
              <li><strong>Publicity:</strong> we will not name you as a customer without your permission.</li>
              <li><strong>Whole agreement:</strong> these terms and the policies they name are the whole agreement on this subject. If one part is unenforceable, the rest still applies. Not enforcing a right is not a waiver of it.</li>
              <li><strong>Electronic acceptance:</strong> accepting online is a valid contract under the Information Technology Act, 2000.</li>
            </ul>
          </LegalSection>

          <LegalSection id="contact" n="23" title="Contact">
            <p>Questions about these terms and legal notices go to the address below.</p>
            <div className="privacy-officer">
              <div>
                <span>Legal</span>
                <strong>Globonexo India Private Limited</strong>
                <p>
                  44, Backary Portion, 2nd Floor, Regal Building<br />
                  Connaught Place, New Delhi 110001, India
                </p>
              </div>
              <div>
                <a href="mailto:support@gnxsales.com">support@gnxsales.com</a>
                <p>We reply within one business day.</p>
              </div>
            </div>
          </LegalSection>
        </article>
      </main>

      <section className="privacy-cta public-section">
        <div className="privacy-cta-card">
          <div>
            <h2 className="display">Need a signed agreement or a DPA?</h2>
            <p>Agencies and teams with procurement checks can ask for an order form or a Data Processing Agreement.</p>
          </div>
          <div className="content-cta-actions">
            <a className="btn btn-primary btn-lg" href="mailto:support@gnxsales.com">
              Email us <Icon name="arrow" size={17} color="#06231a" />
            </a>
            <Link className="landing-outline-btn" href="/privacy">Read the Privacy Policy</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Terms of Service", path: "/terms" }]} />
    </div>
  );
}
