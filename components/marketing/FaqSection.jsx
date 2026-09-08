import Icon from "../ui/Icon";

// One FAQ block, rendered on marketing pages so each page answers the
// questions people actually type into search, and emits its own FAQPage
// schema so those answers can be picked up as rich results.
export default function FaqSection({ heading, intro, items, className = "content-section public-section" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className={className}>
      <div className="content-section-head">
        <h2>{heading}</h2>
        {intro && <p>{intro}</p>}
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>
              <span>{item.q}</span>
              <Icon name="plus" size={18} color="var(--muted)" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
