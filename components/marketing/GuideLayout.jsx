import Link from "next/link";
import Icon from "../ui/Icon";
import PublicNav from "../layout/PublicNav";
import PublicFooter from "../layout/PublicFooter";

// Shared shell for the long-form guide and comparison pages. Keeps the hero,
// breadcrumb, and closing call to action identical across them so every entry
// point into the site leads to the same next step.
export default function GuideLayout({
  eyebrow,
  title,
  intro,
  secondaryCta = { href: "/platform", label: "See the platform" },
  cta = {
    heading: "Put an AI sales agent on it.",
    body: "Choose a plan, connect your inbox, and launch your first campaign in five minutes.",
  },
  children,
}) {
  return (
    <div className="public-page story-page">
      <div className="story-hero-band">
        <PublicNav variant="dark" />
        <section className="story-hero public-section">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="display">{title}</h1>
          <p>{intro}</p>
          <div className="content-hero-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">
              Choose a plan <Icon name="arrow" size={18} color="#06231a" />
            </Link>
            <Link className="landing-outline-btn" href={secondaryCta.href}>{secondaryCta.label}</Link>
          </div>
        </section>
      </div>

      <main>
        {children}

        <section className="solutions-cta">
          <div>
            <h2>{cta.heading}</h2>
            <p>{cta.body}</p>
          </div>
          <div className="content-cta-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">
              Choose a plan <Icon name="arrow" size={16} color="#06231a" />
            </Link>
            <Link className="landing-outline-btn" href="/pricing">View pricing</Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export function GuideList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={15} color="var(--g-700)" stroke={2.4} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ComparisonTable({ themLabel, usLabel = "GNX Sales", rows }) {
  return (
    <div className="cmp">
      <div className="cmp-head">
        <span>{themLabel}</span>
        <span className="cmp-head-us">{usLabel}</span>
      </div>
      {rows.map((row) => (
        <div key={row.us} className="cmp-row">
          <div className="cmp-them"><Icon name="close" size={15} color="var(--stop)" /><p>{row.them}</p></div>
          <div className="cmp-us"><Icon name="check" size={15} color="var(--g-800)" /><p>{row.us}</p></div>
        </div>
      ))}
    </div>
  );
}
