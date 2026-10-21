import Link from "next/link";
import Icon from "../ui/Icon";
import PublicNav from "../layout/PublicNav";
import PublicFooter from "../layout/PublicFooter";
import "./site-result.css";

function ActionLink({ href, className, children }) {
  const external = /^https?:/.test(href);
  return external
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <Link className={className} href={href}>{children}</Link>;
}

/**
 * Dark hero + "next steps" cards, as used by the 404, demo booked and
 * message sent pages. `aside` is either a card of rows or decorative text.
 */
export default function SiteResultPage({ eyebrow, title, accent, text, primary, secondary, card, bigText, sectionTitle, cards, note }) {
  return (
    <div className="public-page">
      <PublicNav />
      <main>
        <section className="mk-wrap">
          <div className="mk-in">
            <div>
              <span className="mk-eb">{eyebrow}</span>
              <h1 className="mk-h">{title} <span>{accent}</span></h1>
              <p className="mk-p">{text}</p>
              <div className="mk-btns">
                {primary ? (
                  <ActionLink className="mk-b1" href={primary.href}>{primary.label} <Icon name="arrow" size={16} color="#06231a" /></ActionLink>
                ) : null}
                {secondary ? <ActionLink className="mk-b2" href={secondary.href}>{secondary.label}</ActionLink> : null}
              </div>
            </div>
            {card ? (
              <div className="mk-card">
                <small>{card.title}</small>
                {card.rows.map(row => (
                  <div key={row.label} className="mk-row">
                    <i><Icon name={row.icon} size={16} /></i>
                    <span>{row.label}</span>
                    {row.detail ? <em>{row.detail}</em> : null}
                  </div>
                ))}
              </div>
            ) : bigText ? (
              <div className="mk-big" aria-hidden="true">{bigText}</div>
            ) : null}
          </div>
        </section>

        <section className="mk-sec">
          <h2>{sectionTitle}</h2>
          <div className="mk-g3">
            {cards.map(item => (
              <div key={item.title} className="mk-c">
                <i><Icon name={item.icon} size={18} /></i>
                <b>{item.title}</b>
                <span>{item.text}</span>
                {item.href ? <ActionLink href={item.href}>{item.linkLabel} →</ActionLink> : null}
              </div>
            ))}
          </div>
          {note ? <div className="mk-note">{note}</div> : null}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
