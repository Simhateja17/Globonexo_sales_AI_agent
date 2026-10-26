export const metadata = {
  title: { absolute: "Cookie policy for GNX Sales" },
  description: "Learn how GNX Sales uses essential, preference, analytics, and third-party cookies to operate and improve the service.",
  alternates: { canonical: "/cookies" },
  openGraph: { url: "/cookies", images: ["/og-image.png"] },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import LegalSection from "../../components/marketing/LegalSection";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";

const kinds = [
  { icon: "lock", badge: "Always on", title: "Essential", body: "Keep you signed in and the app secure. GNX Sales cannot work without them." },
  { icon: "sliders", badge: "Your device only", title: "Preferences", body: "Remember small choices, like a tour you closed. Stored in your browser, never sent to us." },
  { icon: "trend", badge: "You can turn off", title: "Analytics", body: "Show us which features get used and where things break, so we can fix them.", muted: true },
];

const cookies = [
  ["sb-…-auth-token", "Essential cookie", "Keeps you signed in through Supabase, our sign-in provider.", "Until you sign out"],
  ["site_auth_ok", "Essential cookie", "Remembers you passed our site access check.", "7 days"],
  ["ph_…_posthog", "Analytics cookie", "PostHog product analytics: pages viewed, clicks, errors and device type.", "1 year"],
  ["returning_user", "Local storage", "Knows you have been here before, to skip the first-visit intro.", "Until cleared"],
  ["Tour and intro keys", "Local storage", "Remembers tours and tips you have closed.", "Until cleared"],
  ["gnx-active-apollo-import", "Local storage", "Keeps track of a lead import in progress if you refresh the page.", "Until the import ends"],
  ["gnx_onboarding_preparation", "Session storage", "Holds onboarding progress while you set up.", "Until you close the tab"],
];

const others = [
  ["Razorpay", "Checkout and fraud checks when you pay"],
  ["Google", "When you sign in or connect Gmail"],
  ["Google Fonts", "Loads our fonts. Sets no cookies"],
];

export default function CookiesPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <section className="privacy-hero">
        <div className="privacy-hero-inner public-section">
          <div className="privacy-hero-copy">
            <span className="privacy-hero-eyebrow">
              <Icon name="cookie" size={14} /> Legal · Cookie Policy
            </span>
            <h1 className="display">
              A short list.<br />
              <span>No ad trackers.</span>
            </h1>
            <p>Every cookie and bit of browser storage GNX Sales uses, why it is there, and how to turn it off.</p>
            <div className="privacy-hero-pills">
              <span>Effective 18 October 2026</span>
              <span>4 minute read</span>
            </div>
          </div>
        </div>
      </section>

      <section className="privacy-glance privacy-glance--3 public-section" aria-label="What we use">
        {kinds.map((item) => (
          <div key={item.title} className="privacy-glance-card">
            <div className="legal-kind-head">
              <span className="privacy-glance-icon"><Icon name={item.icon} size={20} color="#fff" /></span>
              <em className={item.muted ? "is-muted" : undefined}>{item.badge}</em>
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </section>

      <main className="privacy-layout privacy-layout--single public-section">
        <article className="privacy-article">
          <LegalSection id="what" n="01" title="What cookies are">
            <p>
              Cookies are small text files a website saves in your browser. We also use similar browser storage, called
              local storage and session storage. This policy covers all of them on gnxsales.com and in the GNX Sales
              app, run by Globonexo India Private Limited.
            </p>
          </LegalSection>

          <LegalSection id="list" n="02" title="Everything we set">
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">What it does</th><th scope="col">Lasts</th></tr>
                </thead>
                <tbody>
                  {cookies.map(([name, type, what, lasts]) => (
                    <tr key={name}><td>{name}</td><td>{type}</td><td>{what}</td><td>{lasts}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>We also use Vercel Web Analytics to count page visits. It does not use cookies and does not identify you.</p>
          </LegalSection>

          <LegalSection id="third" n="03" title="Cookies set by others">
            <p>
              Some steps take you to another company&apos;s page or window, and that company may set its own cookies
              under its own policy:
            </p>
            <div className="privacy-grid privacy-grid--providers">
              {others.map(([name, role]) => (
                <div key={name} className="privacy-provider">
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </LegalSection>

          <LegalSection id="never" n="04" title="What we never use">
            <ul className="privacy-list privacy-list--no">
              <li>Advertising or retargeting cookies.</li>
              <li>Social media tracking pixels.</li>
              <li>Selling or sharing cookie data with ad networks or data brokers.</li>
            </ul>
          </LegalSection>

          <LegalSection id="control" n="05" title="How to turn them off">
            <ul className="privacy-list">
              <li><strong>In your browser:</strong> every major browser lets you block or delete cookies and clear site data in its settings. Blocking essential cookies will sign you out.</li>
              <li><strong>Analytics only:</strong> block cookies from gnxsales.com&apos;s analytics, use a browser that blocks trackers, or email us to switch analytics off for your account.</li>
              <li><strong>Do Not Track:</strong> browsers send this signal in different ways and there is no common standard, so we treat the steps above as the way to opt out.</li>
            </ul>
            <p>
              If you are in the EU or UK, analytics cookies need your consent, and you can withdraw it anytime by
              clearing them or emailing us.
            </p>
          </LegalSection>

          <LegalSection id="changes" n="06" title="Changes and contact">
            <p>
              When we add or remove a cookie, we update this list and the date at the top. Questions go to{" "}
              <a href="mailto:support@gnxsales.com">support@gnxsales.com</a>. For how we handle personal data in
              general, read the <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </LegalSection>
        </article>
      </main>

      <section className="privacy-cta public-section">
        <div className="privacy-cta-card">
          <div>
            <h2 className="display">Want analytics off for your account?</h2>
            <p>Send us one line from your account email and we will switch it off.</p>
          </div>
          <div className="content-cta-actions">
            <a className="btn btn-primary btn-lg" href="mailto:support@gnxsales.com">
              Email us <Icon name="arrow" size={17} color="#06231a" />
            </a>
            <Link className="landing-outline-btn" href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "Cookie Policy", path: "/cookies" }]} />
    </div>
  );
}
