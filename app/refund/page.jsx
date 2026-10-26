export const metadata = {
  title: { absolute: "Refund policy for GNX Sales" },
  description: "How GNX Sales billing and cancelling work: payments are final, your plan runs to the end of the paid period, and billing mistakes are corrected.",
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
  { value: "Full period", title: "Your plan keeps working", body: "Until the end of the period you already paid for." },
  { value: "No refunds", title: "Payments are final", body: "Including unused days and unused credits." },
  { value: "3 days", title: "To fix a billing error", body: "Business days, from the day we get your report." },
];

const steps = [
  { title: "Email us", body: "From your account email to support@gnxsales.com." },
  { title: "Tell us what happened", body: "Workspace name, charge date or invoice, and what looks wrong." },
  { title: "We check", body: "Within 3 business days, with our reason." },
  { title: "We correct it", body: "A confirmed mistake goes back to your original payment method in 5 to 10 business days." },
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
              How cancelling works and what you keep afterwards. Short, because billing should be simple.
            </p>
            <div className="privacy-hero-pills">
              <span>Effective 18 October 2026</span>
              <span>Payments via Razorpay</span>
              <span>3 minute read</span>
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
              <li>Paid plans are paid in advance, monthly or yearly, in US dollars through Razorpay. The Free plan has no charges, so there is nothing to refund on it.</li>
              <li>Your plan renews automatically at the end of each period until you cancel.</li>
              <li>Cancel anytime from <strong>Billing</strong> in the app. Cancelling stops the next renewal.</li>
              <li>Your plan keeps working until the end of the period you already paid for. Cancelling does not end it early.</li>
              <li>Unused credits do not carry over to the next period.</li>
            </ul>
          </LegalSection>

          <LegalSection id="eligible" n="02" title="What happens when you cancel">
            <p>All payments are final. We do not give refunds, including for the unused part of a period.</p>
            <div className="refund-split">
              <div className="refund-card refund-card--yes">
                <div className="refund-card-head">
                  <span><Icon name="check" size={16} color="#fff" stroke={2.5} /></span>
                  <strong>What you keep</strong>
                </div>
                <ul className="privacy-list">
                  <li>Your plan, with all its features, until the end of the paid period.</li>
                  <li>Your remaining credits for that same period.</li>
                  <li>30 days after your account closes to ask us for an export of your data.</li>
                  <li>No further charges once the renewal is stopped.</li>
                </ul>
              </div>
              <div className="refund-card refund-card--no">
                <div className="refund-card-head">
                  <span><Icon name="close" size={16} color="#fff" stroke={2.5} /></span>
                  <strong>What we do not refund</strong>
                </div>
                <ul className="privacy-list privacy-list--no">
                  <li>Unused days left in a period after you cancel.</li>
                  <li>Unused credits, and credits already used for AI writing, lead enrichment or calls.</li>
                  <li>Emails already sent and calls already placed.</li>
                  <li>Results that did not meet your hopes, such as fewer replies or meetings.</li>
                  <li>An account suspended for breaking our Terms of Service.</li>
                </ul>
              </div>
            </div>
          </LegalSection>

          <LegalSection id="how" n="03" title="Billing mistakes we will fix">
            <p>
              If we charge you wrongly, tell us. We correct billing mistakes on our side, such as being charged twice
              for the same period, or charged after a cancellation we had confirmed.
            </p>
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
              Corrections go back through Razorpay in the currency you paid. How fast it shows depends on your bank or
              card issuer. Any bank or currency conversion fees are not returned. Nothing here takes away a refund that
              the law where you live requires.
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
            <h2 className="display">Charged by mistake?</h2>
            <p>Email us with the charge date. A person will check it within 3 business days.</p>
          </div>
          <div className="content-cta-actions">
            <a className="btn btn-primary btn-lg" href="mailto:support@gnxsales.com">
              Report a billing error <Icon name="arrow" size={17} color="#06231a" />
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
