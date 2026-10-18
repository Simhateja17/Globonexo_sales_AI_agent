export const metadata = {
  title: { absolute: "Privacy policy for GNX Sales" },
  description: "Learn how GNX Sales collects, uses, protects, and deletes account, lead, campaign, integration, and analytics data.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import LegalSection from "../../components/marketing/LegalSection";
import PrivacyToc from "../../components/marketing/PrivacyToc";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const glance = [
  { icon: "shield", title: "We never sell your data", body: "Not to advertisers, not to data brokers, not to anyone. Ever." },
  { icon: "mail", title: "Your inbox stays yours", body: "We only read threads the agent started. Unrelated mail is never opened." },
  { icon: "phone", title: "Every call says it is AI", body: "The first thing a prospect hears is that they are talking to an AI agent." },
  { icon: "trash", title: "You can take it back", body: "Access, correct, export or erase your data with one email to us." },
];

const toc = [
  ["who", "Who we are"],
  ["scope", "What this covers"],
  ["collect", "What we collect"],
  ["use", "How we use it"],
  ["google", "Gmail and Google data"],
  ["calls", "AI voice calls"],
  ["ai", "AI processing"],
  ["share", "Who we share with"],
  ["where", "Where data is stored"],
  ["retain", "How long we keep it"],
  ["security", "Security and breaches"],
  ["rights", "Your rights"],
  ["contacted", "If we contacted you"],
  ["children", "Children"],
  ["cookies", "Cookies"],
  ["changes", "Changes"],
  ["contact", "Contact us"],
];

const collected = [
  ["Account", "Name, work email, password or sign-in token, role", "You, at sign up"],
  ["Business profile", "Company name, website, offer, ideal customer, onboarding answers", "You, during onboarding"],
  ["Lead data", "Names, job titles, companies, business emails and phone numbers of prospects", "Your CSV uploads, or our lead data provider at your request"],
  ["Campaigns", "Sequences, call scripts, schedules, budgets, agent instructions", "You and the agent"],
  ["Conversations", "Email threads the agent started, prospect replies, call outcomes and recordings", "Your connected mailbox and our voice provider"],
  ["Billing", "Plan, invoices, billing address, payment status", "You and Razorpay (we never see your full card number)"],
  ["Support", "Messages you send us and anything you attach", "You"],
  ["Usage and device", "Pages viewed, features used, errors, browser, IP address", "Cookies and product analytics"],
];

const providers = [
  ["Supabase", "Sign-in and database"],
  ["Razorpay", "Payments and subscriptions"],
  ["Google", "Gmail and sign-in"],
  ["Retell AI", "AI voice calling"],
  ["AI model providers", "Writing emails, prompts and summaries"],
  ["Lead data provider", "Finding and enriching B2B contacts"],
  ["PostHog", "Product analytics"],
  ["Cloud hosting", "Running the app and website"],
];

const retention = [
  ["Account and workspace", "While your account is open. Erased within 30 days of closing it."],
  ["Leads and campaigns", "Until you delete them or close your account."],
  ["Google and mailbox credentials", "Until you disconnect. Deleted at once when you do."],
  ["Outbound call recordings", "Until you delete them or close your account."],
  ["Inbound call recordings", "Until you delete them or close your account."],
  ["Security and access logs", "At least one year, as the DPDP Rules require."],
  ["Invoices and tax records", "Eight years, as the Companies Act, 2013 and GST law require."],
];

const rights = [
  ["Access", "A summary of what we hold about you and who we shared it with."],
  ["Correction", "Fix, complete or update anything that is wrong."],
  ["Erasure", "Have your data deleted once we no longer need it by law."],
  ["Withdraw consent", "As easily as you gave it, at any time."],
  ["Complaints", "Raise a complaint with us and get an answer."],
  ["Nominate", "Name someone to act for you if you die or cannot act."],
];

const faqs = [
  { q: "Do you sell my data or my lead lists?", a: "No. Your leads, campaigns and conversations are used only to run your account. We never sell them and never use one customer's leads for another." },
  { q: "Is my data used to train AI models?", a: "No. It is sent to AI providers only to produce your emails, replies and call prompts. Google user data is never used to train generalised models." },
  { q: "Can you read all my Gmail?", a: "We only read threads the agent started, to catch replies. The rest of your inbox is never opened. Disconnect anytime and the tokens are deleted." },
  { q: "You are an Indian company. Can I use you from the US or Canada?", a: "Yes. Our database and servers are in the US, so your data stays there. We follow Indian law as the company, and also honour the rights your local law gives you, including CCPA, PIPEDA and GDPR rights. Section 12 lists them." },
  { q: "How do I delete everything?", a: "Email support@gnxsales.com from your account email. We erase your workspace within 30 days, keeping only the logs and tax records the law requires." },
  { q: "Are calls recorded?", a: "Both outbound and inbound calls are recorded so you can review them. Every call starts by saying it is an AI agent." },
];

export default function PrivacyPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <section className="privacy-hero">
        <div className="privacy-hero-inner public-section">
          <div className="privacy-hero-copy">
            <span className="privacy-hero-eyebrow">
              <Icon name="shield" size={14} /> Legal · Privacy Policy
            </span>
            <h1 className="display">
              Your data,<br />
              <span>in plain words.</span>
            </h1>
            <p>
              What GNX Sales collects, why it needs it, who helps us process it, and how you take it back.
              Written for founders, not lawyers, and still the binding version.
            </p>
            <div className="privacy-hero-pills">
              <span>Last updated 17 October 2026</span>
              <span>DPDP Act, 2023 aligned</span>
              <span>12 minute read</span>
            </div>
          </div>
          <aside className="privacy-fiduciary" aria-label="Who is responsible">
            <span>Data Fiduciary</span>
            <strong>Globonexo India Private Limited</strong>
            <div>
              <p>CIN: U62013DC2026PTC469655</p>
              <p>44, Backary Portion, 2nd Floor, Regal Building, Connaught Place, New Delhi, Central Delhi - 110001, India</p>
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
          <LegalSection id="who" n="01" title="Who we are">
            <p>
              GNX Sales (gnxsales.com) is an AI sales agent built and operated by Globonexo India Private Limited, a
              company incorporated under the Companies Act, 2013, with its registered office at 44, Backary Portion, 2nd Floor, Regal Building, Connaught Place, New Delhi, Central Delhi - 110001, India. In this policy, &quot;GNX Sales&quot;, &quot;we&quot; and &quot;us&quot; mean Globonexo India
              Private Limited.
            </p>
            <p>
              This policy is published under the Digital Personal Data Protection Act, 2023 and the Digital Personal
              Data Protection Rules, 2025 (&quot;DPDP law&quot;), the Information Technology Act, 2000 and the rules
              made under it. Where we serve customers in the United States, Canada, the UK or the EU, we also honour
              the rights those laws give you, as set out in section 12.
            </p>
          </LegalSection>

          <LegalSection id="scope" n="02" title="What this covers, and our two roles">
            <p>
              This policy covers our website, the GNX Sales app, and the emails and calls our agent makes. We hold two
              different roles, and it matters which one applies to you:
            </p>
            <div className="privacy-grid privacy-grid--2">
              <div className="privacy-tile privacy-tile--green">
                <span>You are a customer</span>
                <p>
                  For your account, billing and usage data, we are the <strong>Data Fiduciary</strong>. We decide how
                  that data is used, and this policy is our promise to you.
                </p>
              </div>
              <div className="privacy-tile">
                <span>You are a prospect</span>
                <p>
                  If a GNX Sales customer emailed or called you, that customer is the Data Fiduciary. We act as their{" "}
                  <strong>Data Processor</strong>. Section 13 explains what you can do.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection id="collect" n="03" title="What we collect">
            <p>We collect only what the product needs to run. Here is all of it.</p>
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr><th scope="col">Category</th><th scope="col">Examples</th><th scope="col">Where it comes from</th></tr>
                </thead>
                <tbody>
                  {collected.map(([category, examples, source]) => (
                    <tr key={category}><td>{category}</td><td>{examples}</td><td>{source}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              We do not ask for, and you should not upload, sensitive data such as health, financial account, religion,
              caste or government ID details about your prospects.
            </p>
          </LegalSection>

          <LegalSection id="use" n="04" title="How we use it, and on what basis">
            <p>Every use below has a stated purpose. We do not use your data for anything that is not on this list.</p>
            <ul className="privacy-list">
              <li><strong>To run the service you signed up for:</strong> sign you in, build your agent, find and enrich leads, write and send emails, place calls, detect replies and book meetings.</li>
              <li><strong>To alert you and hand over:</strong> when a prospect replies, we notify you so you can take over, or let the agent reply for you if you turned on auto-pilot.</li>
              <li><strong>To bill you:</strong> process payments, issue invoices and keep the records Indian tax law requires.</li>
              <li><strong>To keep things safe:</strong> prevent fraud, spam and abuse, enforce send and call limits, and investigate security issues.</li>
              <li><strong>To support and improve:</strong> answer your questions and fix what breaks, using aggregated usage data.</li>
              <li><strong>To meet the law:</strong> respond to lawful requests from Indian authorities and courts.</li>
            </ul>
            <p>
              Under DPDP law, we rely on the consent you give when you create an account and accept this policy, and on
              the legitimate uses the Act allows, such as uses you voluntarily provide data for and compliance with law.
              You can withdraw consent at any time (section 12). Withdrawing it will stop the parts of the service that
              depend on it, but will not undo processing already done.
            </p>
          </LegalSection>

          <LegalSection id="google" n="05" title="Gmail and Google user data">
            <p>Connecting Google is optional. If you connect Gmail, we ask for three permissions, each for one job:</p>
            <ul className="privacy-list">
              <li><strong>gmail.send</strong> to send the outreach emails and follow-ups you approved, from your own address.</li>
              <li><strong>gmail.readonly</strong> to read only the threads GNX Sales started, so we can spot replies, stop follow-ups and show the conversation in your Inbox.</li>
              <li><strong>userinfo.email</strong> to know which Google account is connected.</li>
            </ul>
            <p>
              We store OAuth tokens so campaigns keep running, plus the message metadata and reply content those
              features need. Disconnecting Google in Settings deletes the tokens. You can also revoke access any time at{" "}
              <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>.
            </p>
            <div className="privacy-note">
              <strong>Limited Use commitment</strong>
              <p>
                GNX Sales&apos; use and transfer of information received from Google APIs to any other app will adhere
                to the{" "}
                <a href="https://developers.google.com/terms/api-services-user-data-policy">
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements. We do not sell Google user data, use it for advertising, or
                use it to develop, improve or train generalised AI or machine learning models. People at GNX Sales can
                see it only with your permission, for security, to comply with law, or once it is aggregated and
                anonymised.
              </p>
            </div>
            <p>
              If you connect a custom mailbox instead, we use SMTP to send and IMAP to read replies to campaign
              messages. Mailbox passwords are encrypted before we store them.
            </p>
          </LegalSection>

          <LegalSection id="calls" n="06" title="AI voice calls">
            <p>
              GNX Sales can call prospects and answer inbound calls with an AI voice agent. Every call opens with a clear
              statement that the caller is an AI, and calls end automatically after 20 minutes.
            </p>
            <ul className="privacy-list">
              <li><strong>Outbound calls:</strong> we store the recording, transcript and outcome (duration, disposition, meeting booked) so you can review them in Call History. Recording laws differ by place, and you are responsible for any notice or consent your prospects&apos; location requires.</li>
              <li><strong>Inbound calls:</strong> we use the caller&apos;s number and the details they confirm to route the call, and we store the recording, transcript and structured outcome so you can review them in Call History. The AI disclosure at the start of the call tells the caller it may be recorded.</li>
            </ul>
          </LegalSection>

          <LegalSection id="ai" n="07" title="AI processing">
            <p>
              To write emails, replies, call prompts and summaries, we send the relevant campaign context, lead details
              and message history to AI model providers. They process it to return a result to your account. We do not
              use your workspace data to train models for anyone else, and we choose providers whose terms do not allow
              them to train on it.
            </p>
            <p>AI can be wrong. That is why replies wait for your approval by default, unless you switch on auto-pilot.</p>
          </LegalSection>

          <LegalSection id="share" n="08" title="Who we share with">
            <p>
              We share data only with providers who help us run GNX Sales, under contracts that limit them to our
              instructions. We never sell personal data or share it for advertising.
            </p>
            <div className="privacy-grid privacy-grid--providers">
              {providers.map(([name, role]) => (
                <div key={name} className="privacy-provider">
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              ))}
            </div>
            <p>
              We may also disclose data when Indian law, a court or a government authority lawfully requires it, to
              protect people from harm, or to a buyer if Globonexo is merged or acquired, in which case this policy
              continues to apply.
            </p>
          </LegalSection>

          <LegalSection id="where" n="09" title="Where your data is stored">
            <p>
              Globonexo is an Indian company, but GNX Sales runs in the <strong>United States</strong>. Our database and
              backend servers are hosted in US data centres, so your account, lead, campaign and conversation data is
              stored and processed there.
            </p>
            <div className="privacy-grid privacy-grid--3">
              <div className="privacy-tile privacy-tile--green"><span>Database</span><strong>United States</strong></div>
              <div className="privacy-tile privacy-tile--green"><span>Backend servers</span><strong>United States</strong></div>
              <div className="privacy-tile"><span>Company</span><strong>India</strong></div>
            </div>
            <p>
              Some providers in section 8 may process data in other countries to do their part of the job. If you are in
              India, your data is transferred out of India to the US. DPDP law allows this unless the Government of
              India restricts a country, and we will stop any transfer that becomes restricted. For customers in the EU
              or UK, we rely on standard contractual clauses or an equivalent safeguard. Our team in India accesses the
              data remotely, only as section 11 allows.
            </p>
          </LegalSection>

          <LegalSection id="retain" n="10" title="How long we keep it">
            <p>We keep data only as long as its purpose lasts, then erase it, unless a law tells us to keep it longer.</p>
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr><th scope="col">Data</th><th scope="col">How long</th></tr>
                </thead>
                <tbody>
                  {retention.map(([data, how]) => (
                    <tr key={data}><td>{data}</td><td>{how}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LegalSection>

          <LegalSection id="security" n="11" title="Security, and what happens if something goes wrong">
            <p>
              We encrypt data in transit and at rest, encrypt stored mailbox passwords, limit staff access to what each
              job needs, and log access to production systems. These follow reasonable security practices under the IT
              Act and the DPDP Rules.
            </p>
            <p>
              No system is perfectly safe. If a breach affects your personal data, we will tell you and the Data
              Protection Board of India without delay, in the form and time the DPDP Rules require, with what happened,
              what it means for you and what we are doing about it.
            </p>
          </LegalSection>

          <LegalSection id="rights" n="12" title="Your rights">
            <p>Under DPDP law you have these rights. Email us to use any of them. We do not charge for it.</p>
            <div className="privacy-grid privacy-grid--rights">
              {rights.map(([name, body]) => (
                <div key={name} className="privacy-tile privacy-tile--green">
                  <strong>{name}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <p>
              <strong>Outside India.</strong> If you are in the EU or UK, you also have the rights to data portability,
              to object, and to complain to your local supervisory authority. If you are in California, you can ask what
              we collect and ask us to delete it, and we confirm we do not sell or share personal information as the
              CCPA defines it. Canadian users have the access and correction rights PIPEDA gives. We will not treat you
              differently for using any right.
            </p>
            <p>
              You can also ask for this policy in Hindi or any other language listed in the Eighth Schedule to the
              Constitution of India.
            </p>
          </LegalSection>

          <LegalSection id="contacted" n="13" title="If a GNX Sales customer contacted you">
            <p>
              Our customers use GNX Sales to email and call business contacts. If you received one of those emails or
              calls, the business that contacted you decides why, and you can ask them directly. You can also:
            </p>
            <ul className="privacy-list">
              <li>Click the unsubscribe link or reply &quot;stop&quot; in any email, or tell the AI caller you do not want to be called.</li>
              <li>Email <a href="mailto:support@gnxsales.com">support@gnxsales.com</a> with your email or phone number. We will block it across that customer&apos;s campaigns and tell them, and help you reach them.</li>
            </ul>
            <p>
              Customers must have a lawful basis to contact you and must honour opt-outs. Our Terms of Service require
              it, and we suspend accounts that ignore it.
            </p>
          </LegalSection>

          <LegalSection id="children" n="14" title="Children">
            <p>
              GNX Sales is a business tool for people 18 and over. We do not knowingly collect data from anyone under 18.
              If you think a child has given us data, tell us and we will erase it.
            </p>
          </LegalSection>

          <LegalSection id="cookies" n="15" title="Cookies">
            <p>
              We use essential cookies to keep you signed in and secure, local storage for your interface preferences,
              and PostHog for product analytics. We do not use advertising cookies. The{" "}
              <Link href="/cookies">Cookie Policy</Link> has the full list and how to turn them off.
            </p>
          </LegalSection>

          <LegalSection id="changes" n="16" title="Changes to this policy">
            <p>
              When we change this policy, we update the date at the top. If a change affects how we use your data in a
              meaningful way, we will email account owners at least 14 days before it takes effect, and ask for fresh
              consent where the law requires it.
            </p>
          </LegalSection>

          <LegalSection id="contact" n="17" title="Contact us">
            <p>
              For any question, request or complaint about your data, write to us. Use the subject
              line &quot;Privacy request&quot; so it reaches the right person.
            </p>
            <div className="privacy-officer">
              <div>
                <span>Privacy requests</span>
                <strong>Globonexo India Private Limited</strong>
                <p>
                  44, Backary Portion, 2nd Floor, Regal Building, Connaught Place, New Delhi, Central Delhi - 110001, India
                </p>
              </div>
              <div>
                <a href="mailto:support@gnxsales.com">support@gnxsales.com</a>
                <p>We acknowledge within 2 business days and resolve within 30 days.</p>
              </div>
            </div>
            <p>
              If you are not satisfied with our answer, you can complain to the Data Protection Board of India once you
              have used our complaint process.
            </p>
          </LegalSection>
        </article>
      </main>

      <section className="privacy-faq public-section" aria-labelledby="privacy-faq-title">
        <div>
          <span className="eyebrow">Privacy FAQ</span>
          <h2 id="privacy-faq-title" className="display">The questions founders ask us first.</h2>
          <p>Short answers. The sections above are the full version.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item" name="privacy-faq">
              <summary>
                <span>{item.q}</span>
                <Icon name="plus" size={18} color="var(--muted)" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="privacy-cta public-section">
        <div className="privacy-cta-card">
          <div>
            <h2 className="display">A question about your data?</h2>
            <p>A real person reads every privacy email. No forms, no ticket numbers.</p>
          </div>
          <div className="content-cta-actions">
            <a className="btn btn-primary btn-lg" href="mailto:support@gnxsales.com">
              Email our privacy team <Icon name="arrow" size={17} color="#06231a" />
            </a>
            <Link className="landing-outline-btn" href="/terms">Read the Terms</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Privacy Policy", path: "/privacy" }]} />
    </div>
  );
}
