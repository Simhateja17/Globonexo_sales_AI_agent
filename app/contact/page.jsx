export const metadata = {
  title: { absolute: "Contact GNX Sales support" },
  description: "Reach the GNX sales team for product support, billing questions, sales, and security reports.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", images: ["/og-image.png"] },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import ContactForm from "../../components/marketing/ContactForm";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";
import { DEMO_URL, INSTAGRAM_URL, LINKEDIN_URL, SUPPORT_EMAIL, SUPPORT_HOURS } from "../../lib/site";

const tips = [
  "Write from the email on your account",
  "Name the campaign, lead or call involved",
  "Say what you expected and what happened",
  "Add the time and a screenshot",
];

export default function ContactPage() {
  return (
    <div className="public-page contact-page">
      <PublicNav />

      <section className="privacy-hero">
        <div className="privacy-hero-inner public-section">
          <div className="privacy-hero-copy">
            <span className="privacy-hero-eyebrow">Contact us</span>
            <h1 className="display">
              Talk to a person<br />
              <span>who knows the product.</span>
            </h1>
            <p>
              No bots, no ticket queues you never hear back from. Pick what you need below and the right person on our
              team reads it.
            </p>
            <div className="privacy-hero-pills">
              <span className="contact-live"><i aria-hidden="true" />Replies within 1 business day</span>
              <span>Support hours: {SUPPORT_HOURS}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="privacy-glance privacy-glance--3 public-section" aria-label="Ways to reach us">
        <div className="privacy-glance-card contact-channel">
          <span className="privacy-glance-icon"><Icon name="chat" size={22} color="#fff" /></span>
          <h2>Product support</h2>
          <p>
            Trouble with campaigns, calls, the inbox or a connection. Signed in? Open a ticket in the app, it reaches
            us with your account details attached.
          </p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <small>Replies within 1 business day</small>
        </div>
        <div className="privacy-glance-card contact-channel contact-channel--dark">
          <span className="privacy-glance-icon"><Icon name="calendar" size={22} color="#6fe7b0" /></span>
          <h2>Sales and demos</h2>
          <p>
            Not sure which plan fits, or want to watch the agent find, email and call a lead live? Book 30 minutes with
            us.
          </p>
          <a className="btn btn-primary" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Book a 30 minute demo</a>
          <small>Video call on Google Meet</small>
        </div>
        <div className="privacy-glance-card contact-channel">
          <span className="privacy-glance-icon"><Icon name="card" size={22} color="#fff" /></span>
          <h2>Billing and cancelling</h2>
          <p>
            Invoices, plan changes, cancelling and billing mistakes, handled under our{" "}
            <Link href="/refund">Refund Policy</Link>.
          </p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <small>Billing errors checked within 3 business days</small>
        </div>
      </section>

      <main className="contact-main public-section">
        <ContactForm />

        <aside className="contact-side">
          <div className="contact-side-card contact-side-card--tint">
            <h3>Get a faster answer</h3>
            <ul>
              {tips.map((tip) => (
                <li key={tip}><Icon name="check" size={16} color="var(--g-700)" stroke={2.5} />{tip}</li>
              ))}
            </ul>
            <Link href="/help">Or browse the Help Center</Link>
          </div>
          <div className="contact-side-card">
            <h3><Icon name="shield" size={18} color="var(--g-700)" /> Security and privacy</h3>
            <p>
              Report a vulnerability, ask how we handle data, or ask us to delete it. We acknowledge security reports
              within 24 hours.
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </div>
          <div className="contact-side-card">
            <h3>Got an email or call from us?</h3>
            <p>
              If a GNX Sales customer contacted you and you want it to stop, email us your address or number and we will
              block it for that customer.
            </p>
          </div>
        </aside>
      </main>

      <section className="contact-office">
        <div className="contact-office-inner public-section">
          <div className="contact-side-card">
            <span className="contact-kicker">Registered office</span>
            <h3>Globonexo India Private Limited</h3>
            <p>
              44, Backary Portion, 2nd Floor, Regal Building<br />
              Connaught Place, New Delhi 110001, India
            </p>
            <small>CIN U62013DC2026PTC469655 · For legal notices by post</small>
          </div>
          <div className="contact-side-card">
            <span className="contact-kicker">Privacy requests</span>
            <h3>Data questions and complaints</h3>
            <p>
              For access, correction, deletion or complaints about your data. Use the subject line &quot;Privacy
              request&quot;. We acknowledge within 2 business days.
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Privacy%20request`}>{SUPPORT_EMAIL}</a>
          </div>
          <div className="contact-side-card">
            <span className="contact-kicker">Follow along</span>
            <h3>We build in public</h3>
            <p>Product updates, outbound tips and what we are shipping next.</p>
            <div className="contact-social">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Contact", path: "/contact" }]} />
    </div>
  );
}
