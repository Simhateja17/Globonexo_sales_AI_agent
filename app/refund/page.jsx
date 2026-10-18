export const metadata = {
  title: { absolute: "Refund policy for GNX Sales" },
  description: "Review the GNX Sales Refund Policy for subscription billing, cancellations, usage charges, eligibility, and refund requests.",
  alternates: { canonical: "/refund" },
  openGraph: { url: "/refund" },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import LegalSection from "../../components/marketing/LegalSection";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const numbers = [
  { value: "1 click", title: "To cancel", body: "From Billing, anytime. No call, no form." },
  { value: "14 days", title: "To ask for a refund", body: "From the date of the charge, for the cases below." },
  { value: "3 days", title: "For our decision", body: "Business days, from the day we get your request." },
  { value: "5–10 days", title: "For money to arrive", body: "Business days, back to your original card or account." },
];

const steps = [
  { title: "Email us", body: "From your account email to support@gnxsales.com." },
  { title: "Tell us what happened", body: "Workspace name, charge date or invoice, and why." },
  { title: "We decide", body: "Within 3 business days, with our reason." },
  { title: "Money returns", body: "To your original payment method in 5 to 10 business days." },
];

export default function RefundPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <section className="privacy-hero">
        <div className="privacy-hero-inner public-section">
          <div className="privacy-hero-copy">
            <span className="privacy-hero-eyebrow">
              <Icon name="refresh" size={14} /> Legal · Refund Policy
            </span>
            <h1 className="display">
              Cancel anytime.<br />
              <span>No surprises.</span>
            </h1>
            <p>
              How cancelling works, when we give money back, and exactly how to ask. Short, because billing should be
              simple.
            </p>
            <div className="privacy-hero-pills">
              <span>Effective 18 October 2026</span>
              <span>Payments via Razorpay</span>
              <span>5 minute read</span>
            </div>
          </div>
        </div>
      </section>

      <section className="privacy-glance public-section" aria-label="Key numbers">
        {numbers.map((item) => (
          <div key={item.value} className="privacy-glance-card legal-stat">
            <strong>{item.value}</strong>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </section>

      <main className="privacy-layout privacy-layout--single public-section">
        <article className="privacy-article">
          <LegalSection id="cancel" n="01" title="How billing and cancelling work">
            <ul className="privacy-list">
              <li>There is no free trial. Plans are paid in advance, monthly or yearly, in US dollars through Razorpay.</li>
              <li>Your plan renews automatically at the end of each period until you cancel.</li>
              <li>Cancel anytime from <strong>Billing</strong> in the app. Cancelling stops the next renewal.</li>
              <li>Your plan keeps working until the end of the period you already paid for. We do not refund the unused part of that period.</li>
              <li>Unused credits do not carry over to the next period and are not refunded.</li>
            </ul>
          </LegalSection>

          <LegalSection id="eligible" n="02" title="When we give a refund">
            <p>Fees are non-refundable, except in the cases below. Ask within 14 days of the charge.</p>
            <div className="refund-split">
              <div className="refund-card refund-card--yes">
                <div className="refund-card-head">
                  <span><Icon name="check" size={16} color="#fff" stroke={2.5} /></span>
                  <strong>We will refund</strong>
                </div>
                <ul className="privacy-list">
                  <li>You were charged twice for the same period.</li>
                  <li>You were charged after a cancellation we had confirmed.</li>
                  <li>A long outage on our side stopped you from using GNX Sales.</li>
                  <li>We removed a core feature you paid for. You get the unused part of the period back.</li>
                </ul>
              </div>
              <div className="refund-card refund-card--no">
                <div className="refund-card-head">
                  <span><Icon name="close" size={16} color="#fff" stroke={2.5} /></span>
                  <strong>We will not refund</strong>
                </div>
                <ul className="privacy-list privacy-list--no">
                  <li>Credits already used for AI writing, lead enrichment or calls.</li>
                  <li>Emails already sent and calls already placed.</li>
                  <li>Unused credits or days left in a period after you cancel.</li>
                  <li>Results that did not meet your hopes, such as fewer replies or meetings.</li>
                  <li>An account suspended for breaking our Terms of Service.</li>
                </ul>
              </div>
            </div>
            <p>Nothing here takes away a refund that the law where you live requires.</p>
          </LegalSection>

          <LegalSection id="how" n="03" title="How to ask for a refund">
            <ol className="refund-steps">
              {steps.map((step, i) => (
                <li key={step.title} className={i === steps.length - 1 ? "is-last" : undefined}>
                  <span>{i + 1}</span>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <p>
              Approved refunds go back through Razorpay in the currency you paid. How fast it shows depends on your
              bank or card issuer. Any bank or currency conversion fees are not refunded.
            </p>
          </LegalSection>

          <LegalSection id="changes-plan" n="04" title="Upgrades and downgrades">
            <p>
              When you upgrade, Billing shows the new price, any unused credit from your current plan, and the total
              before you pay. A downgrade takes effect at your next renewal, and your current plan and credits stay as
              they are until then. Switching plans does not create a cash refund.
            </p>
          </LegalSection>

          <LegalSection id="chargebacks" n="05" title="Chargebacks">
            <p>
              Please email us before you dispute a charge with your bank. Most problems are fixed faster that way. While
              a chargeback is open, we may pause the account until it is settled.
            </p>
          </LegalSection>

          <LegalSection id="contact" n="06" title="Changes and contact">
            <p>
              If we change this policy, we update the date at the top. Changes do not apply to charges made before them.
              For anything about billing, write to <a href="mailto:support@gnxsales.com">support@gnxsales.com</a>. This
              policy is part of our <Link href="/terms">Terms of Service</Link>.
            </p>
          </LegalSection>
        </article>
      </main>

      <section className="privacy-cta public-section">
        <div className="privacy-cta-card">
          <div>
            <h2 className="display">Charged when you shouldn&apos;t have been?</h2>
            <p>Email us with the charge date. A person will look at it within 3 business days.</p>
          </div>
          <div className="content-cta-actions">
            <a className="btn btn-primary btn-lg" href="mailto:support@gnxsales.com">
              Request a refund <Icon name="arrow" size={17} color="#06231a" />
            </a>
            <Link className="landing-outline-btn" href="/faq#billing">Billing FAQ</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Refund Policy", path: "/refund" }]} />
    </div>
  );
}
