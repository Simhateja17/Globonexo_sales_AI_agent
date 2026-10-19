"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "../ui/Icon";

const ICONS = {
  start: "bolt",
  email: "mail",
  leads: "users",
  campaigns: "send",
  inbox: "inbox",
  voice: "phone",
  meetings: "calendar",
  analytics: "trend",
  billing: "card",
};

const POPULAR = [
  { id: "email", label: "Connect Gmail" },
  { id: "leads", label: "Import a CSV" },
  { id: "campaigns", label: "Launch a campaign" },
  { id: "voice", label: "Set up AI calls" },
];

const START_STEPS = [
  { id: "start", title: "Teach the agent your offer", body: "Answer five onboarding questions about you, your product, your ideal customer and your tone.", cta: "Onboarding guide" },
  { id: "email", title: "Connect a sending inbox", body: "Add Gmail, Outlook or any mailbox with SMTP and IMAP, so the agent can send and read replies.", cta: "Inbox guide" },
  { id: "leads", title: "Find your leads", body: "Search the lead database by title, seniority, location and industry, or import your own CSV.", cta: "Leads guide" },
  { id: "campaigns", title: "Review and launch", body: "Create the campaign, read every draft, approve what you like and press Launch.", cta: "Campaign guide" },
];

const plain = (html) => html.replace(/<[^>]+>/g, "");

// Hero search, start-here steps, topic grid and grouped step-by-step guides for /help.
export default function HelpBrowser({ groups }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map((group) => ({
        ...group,
        guides: group.guides.filter((g) =>
          `${g.title} ${g.where} ${g.steps.map(plain).join(" ")} ${g.tip ? plain(g.tip) : ""}`.toLowerCase().includes(needle)
        ),
      }))
      .filter((group) => group.guides.length > 0);
  }, [groups, needle]);

  return (
    <>
      <section className="faq-hero">
        <div className="faq-hero-inner public-section">
          <span className="faq-hero-eyebrow">Help Center</span>
          <h1 className="display">
            Set it up once.<br />
            <span>Then let it sell.</span>
          </h1>
          <p>Step by step guides for every screen in GNX Sales, from your first inbox to your first booked meeting.</p>
          <form className="faq-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" size={20} color="var(--muted)" />
            <label htmlFor="help-q" className="sr-only">Search the guides</label>
            <input
              id="help-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={'Search guides, e.g. "app password"'}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <nav className="faq-chips help-popular" aria-label="Popular guides">
            <span>Popular:</span>
            {POPULAR.map((p) => (
              <a key={p.id} href={`#${p.id}`}>{p.label}</a>
            ))}
          </nav>
        </div>
      </section>

      <section className="help-start">
        <div className="help-start-inner public-section">
          <div className="help-start-head">
            <div>
              <span className="help-eyebrow">New here</span>
              <h2 className="display">Your first campaign in four steps.</h2>
            </div>
            <p>
              The same steps live in <strong>Get set up</strong> in the app sidebar, with a tick beside each one you finish.
            </p>
          </div>
          <div className="help-start-grid">
            {START_STEPS.map((s, i) => (
              <a key={s.id} className="help-start-card" href={`#${s.id}`}>
                <span className="help-start-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="help-start-go">{s.cta} <Icon name="arrow" size={15} stroke={2} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="help-browse public-section" aria-labelledby="help-topics-h">
        <h2 id="help-topics-h" className="display">Browse by topic</h2>
        <div className="help-topic-grid">
          {groups.map((g) => (
            <a key={g.id} className="help-topic-link" href={`#${g.id}`}>
              <span className="help-topic-icon"><Icon name={ICONS[g.id]} size={20} /></span>
              <span>
                <strong>{g.title}</strong>
                <span>{g.summary}</span>
                <em>{g.guides.length} guides</em>
              </span>
            </a>
          ))}
        </div>
      </section>

      <main className="help-main public-section" aria-live="polite">
        {visible.length === 0 && (
          <div className="faq-empty">
            <p>No guides match &ldquo;{query}&rdquo;.</p>
            <Link href="/contact" className="btn btn-primary btn-sm">Contact support</Link>
          </div>
        )}
        {visible.map((group) => (
          <section key={group.id} className="help-sec" id={group.id}>
            <div className="help-sec-head">
              <span className="faq-topic-icon"><Icon name={ICONS[group.id]} size={20} /></span>
              <h2>{group.title}</h2>
              <p>{group.blurb}</p>
            </div>
            <div className="help-sec-body">
              {group.guides.map((guide, i) => (
                <details key={guide.title} className="help-guide" name="help-guide" open={needle ? true : group.id === "start" && i === 0 && !needle ? true : undefined}>
                  <summary>
                    <span className="help-guide-main">
                      <b>{guide.title}</b>
                      <span className="help-where">{guide.where}</span>
                    </span>
                    <span className="help-count">{guide.steps.length} steps</span>
                    <Icon name="plus" size={18} color="var(--muted)" />
                  </summary>
                  <div className="help-guide-body">
                    <ol className="help-steps">
                      {guide.steps.map((step) => (
                        <li key={step} dangerouslySetInnerHTML={{ __html: step }} />
                      ))}
                    </ol>
                    {guide.tip && (
                      <div className="help-tip">
                        <Icon name="spark" size={18} color="var(--g-700)" />
                        <span dangerouslySetInnerHTML={{ __html: guide.tip }} />
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
