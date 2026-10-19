import Link from "next/link";
import Icon from "../ui/Icon";
import PublicNav from "../layout/PublicNav";
import PublicFooter from "../layout/PublicFooter";
import { BreadcrumbSchema } from "./SiteSchema";
import GuideToc from "./GuideToc";

// Long-form guide shell: light hero with breadcrumb and reading facts, a sticky
// table of contents beside the article, related guides and a closing call to action.
export default function GuideArticleLayout({
  slug,
  crumb,
  eyebrow,
  title,
  intro,
  secondaryCta,
  meta,
  toc,
  related,
  relatedHeading = "Keep reading",
  cta,
  trail,
  children,
}) {
  return (
    <div className={`public-page gd-page gd-page-${slug}`}>
      <PublicNav />

      <section className="gd-hero">
        <div className="gd-hero-inner public-section">
          <div className="gd-hero-main">
            <nav className="gd-crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog">Guides</Link>
              <span aria-hidden="true">/</span>
              <strong>{crumb}</strong>
            </nav>
            <span className="gd-hero-eyebrow">{eyebrow}</span>
            <h1 className="display">{title}</h1>
            <p>{intro}</p>
            <div className="gd-hero-actions">
              <Link className="btn btn-primary btn-lg" href="/signup">
                Choose a plan <Icon name="arrow" size={18} color="#06231a" />
              </Link>
              <Link className="gd-ghost-btn" href={secondaryCta.href}>{secondaryCta.label}</Link>
            </div>
          </div>
          <dl className="gd-meta">
            <div><dt>Reading time</dt><dd>{meta.reading}</dd></div>
            <div><dt>Updated</dt><dd>{meta.updated}</dd></div>
            <div className="gd-meta-wide"><dt>Covers</dt><dd>{meta.covers}</dd></div>
          </dl>
        </div>
      </section>

      <main className="gd-main public-section">
        <GuideToc items={toc} />
        {children}
      </main>

      <section className="gd-related">
        <div className="gd-related-inner public-section">
          <h2 className="display">{relatedHeading}</h2>
          <div className="gd-related-grid">
            {related.map((item) => (
              <Link key={item.href} className="gd-rel" href={item.href}>
                <small>{item.kicker}</small>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gd-cta">
        <div className="gd-cta-inner public-section">
          <div>
            <h2 className="display">{cta.heading}</h2>
            <p>{cta.body}</p>
          </div>
          <div className="gd-cta-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">Choose a plan</Link>
            <Link className="gd-cta-ghost" href="/contact">Book a demo</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={trail} />
    </div>
  );
}
