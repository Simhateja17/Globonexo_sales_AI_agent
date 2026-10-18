"use client";
import { useMemo, useState } from "react";
import Icon from "../ui/Icon";

// Topic hero search, jump chips, sidebar and grouped accordion for /faq.
// Answers are plain strings so the same data can feed the FAQPage schema.
export default function FaqBrowser({ groups, children }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, needle]);

  return (
    <>
      <section className="faq-hero">
        <div className="faq-hero-inner public-section">
          <span className="faq-hero-eyebrow">FAQs</span>
          <h1 className="display">
            Questions,<br />
            <span>answered straight.</span>
          </h1>
          <p>
            How the agent finds, emails and calls your buyers, what it costs, and what happens to your data. No sales
            talk.
          </p>
        <form className="faq-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <Icon name="search" size={20} color="var(--muted)" />
          <label htmlFor="faq-q" className="sr-only">Search the FAQ</label>
          <input
            id="faq-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={'Try "does it make calls" or "GST"'}
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
        <nav className="faq-chips" aria-label="Jump to a topic">
          {groups.filter((g) => g.chip).map((g) => (
            <a key={g.id} href={`#${g.id}`}>{g.chip}</a>
          ))}
        </nav>
        </div>
      </section>

      {children}

      <main className="faq-main public-section">
        <nav className="faq-topics" aria-label="Topics">
          <span>Topics</span>
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`}>
              {g.title}
              <em>{g.items.length}</em>
            </a>
          ))}
        </nav>

        <div className="faq-body" aria-live="polite">
          {visible.length === 0 && (
            <p className="faq-empty">No answers match &ldquo;{query}&rdquo;. Try another word, or email support@gnxsales.com.</p>
          )}
          {visible.map((group) => (
            <section key={group.id} className="faq-topic" id={group.id}>
              <div className="faq-topic-head">
                <span className="faq-topic-icon"><Icon name={group.icon} size={20} /></span>
                <h2>{group.title}</h2>
              </div>
              <div className="faq-list">
                {group.items.map((item) => (
                  <details key={item.q} className="faq-item" name="faq" open={needle ? true : undefined}>
                    <summary>
                      <span>{item.q}</span>
                      <Icon name="plus" size={18} color="var(--muted)" />
                    </summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
