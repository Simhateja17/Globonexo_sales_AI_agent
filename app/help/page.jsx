export const metadata = {
  title: { absolute: "GNX Sales help center" },
  description: "Guides for setting up agents, sourcing leads, running campaigns, handling replies, and managing billing in GNX sales.",
  alternates: { canonical: "/help" },
  openGraph: { url: "/help", images: ["/og-image.png"] },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import HelpBrowser from "../../components/marketing/HelpBrowser";
import { helpGroups } from "./helpGuides";

const contacts = [
  { icon: "chat", title: "Open a ticket", body: "Signed in? Support in the sidebar keeps the whole thread in one place.", cta: "Go to Support", href: "/support" },
  { icon: "mail", title: "Email support", body: "For account, billing and product questions.", cta: "support@gnxsales.com", href: "mailto:support@gnxsales.com" },
  { icon: "book", title: "Read the FAQs", body: "Short answers on pricing, compliance and your data.", cta: "Browse FAQs", href: "/faq" },
];

export default function HelpPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <HelpBrowser groups={helpGroups} />

      <section className="faq-stuck">
        <div className="faq-stuck-inner public-section">
          <div className="faq-stuck-head">
            <span className="eyebrow">Still stuck</span>
            <h2 className="display">A person will help.</h2>
            <p>We answer every message within one business day.</p>
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

      <PublicFooter />
    </div>
  );
}
