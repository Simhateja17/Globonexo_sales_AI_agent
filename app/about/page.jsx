export const metadata = {
  title: { absolute: "About GNX Sales" },
  description: "Globonexo builds AI sales agents that find buyers, start conversations, and book meetings for small sales teams.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

import Link from "next/link";
import Icon from "../../components/ui/Icon";
import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import { BreadcrumbSchema } from "../../components/marketing/SiteSchema";
import { DEMO_URL } from "../../lib/site";

const stats = [
  { value: "2", label: "Channels, email and AI voice, run by one agent" },
  { value: "0", label: "Messages sent without passing validation" },
  { value: "3", label: "Plans, with calling included in every one" },
  { value: "4", label: "People building it, two co-founders and two developers" },
];

const steps = [
  { n: "01", title: "Finds", body: "Buyers who match your ideal customer, with verified contact details." },
  { n: "02", title: "Writes", body: "Emails built on what it actually found, never on guesses." },
  { n: "03", title: "Calls", body: "Real phone conversations with an AI voice that says it is an AI.", dark: true },
  { n: "04", title: "Books", body: "The meeting, then tells you so you can take it from there." },
];

const principles = [
  { icon: "target", title: "Meetings, not volume", body: "Sending more email is not the goal. We measure ourselves on real conversations and meetings that land on a calendar." },
  { icon: "eye", title: "You stay in charge", body: "Replies wait for your approval until you choose autopilot. Automation should remove busywork, not your judgement." },
  { icon: "check", title: "Silence beats a guess", body: "If the agent can't verify a fact about a lead, it leaves it out. A confident wrong detail costs you the deal." },
  { icon: "phone", title: "Honest by default", body: "Every call says it is an AI. Every email can be unsubscribed from. We never let the agent pretend to be someone it isn't." },
  { icon: "lock", title: "Your data stays yours", body: "Lead lists and conversations are sensitive. We keep access scoped, retention clear, and we never sell data." },
  { icon: "bolt", title: "Live in days", body: "A new team should have a working agent and a live campaign in its first week, not its first quarter." },
];

const history = [
  { when: "September 2025 · The problem", tone: "200", body: "Through Globonexo's work with founders and dev teams, we kept meeting small companies losing hours a day to prospecting and follow-ups instead of selling." },
  { when: "April 2026 · Version one", tone: "400", body: "Lead sourcing, AI email sequences, reply handling and meeting booking shipped as one connected workflow." },
  { when: "2026 · Now", tone: "600", body: "AI voice calling joined email, so one agent can reach a buyer by inbox and by phone. Next up: Google Calendar sync and more languages.", now: true },
];

const team = [
  { name: "Simha Teja Ugrarapu", initials: "ST", role: "Co-Founder and Lead Developer", line: "Leads development of the agent, from lead sourcing and email to AI calls.", email: "simhateja@gnxsales.com", tint: "linear-gradient(135deg, var(--g-200), var(--g-400))" },
  { name: "Samuel Burth", initials: "SB", role: "Co-Founder", line: "Sets the direction for the product and the company.", tint: "linear-gradient(135deg, var(--g-100), var(--teal))" },
  { name: "Poojitha Gobburu", initials: "PG", role: "Developer", line: "Builds and ships features across the GNX Sales app and backend.", email: "poojitha@gnxsales.com", tint: "linear-gradient(135deg, var(--g-200), var(--lime))" },
  { name: "Manasa Cherukupalli", initials: "MC", role: "Developer", line: "Builds and ships features across the GNX Sales app and backend.", email: "manasa@gnxsales.com", tint: "linear-gradient(135deg, var(--g-100), var(--violet))" },
];

const facts = [
  { label: "Company", title: "Globonexo India Private Limited", body: "CIN U62013DC2026PTC469655" },
  { label: "Registered office", title: "New Delhi, India", body: "Regal Building, Connaught Place" },
  { label: "Who we serve", title: "US, Canada and India", body: "English-speaking B2B teams" },
  { label: "Where data lives", title: "United States", body: "Database and servers" },
];

export default function AboutPage() {
  return (
    <div className="public-page">
      <PublicNav />

      <section className="privacy-hero about-hero">
        <div className="privacy-hero-inner public-section">
          <div className="privacy-hero-copy">
            <span className="privacy-hero-eyebrow">About GNX Sales</span>
            <h1 className="display">
              The salesperson<br />
              <span>you couldn&apos;t hire yet.</span>
            </h1>
            <p>
              GNX Sales is an AI sales agent that finds your buyers, emails them, calls them and books the meeting. We
              build it for founders and small teams who made something good and now need people to buy it.
            </p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary btn-lg" href="/signup">
                Start free <Icon name="arrow" size={17} color="#06231a" />
              </Link>
              <Link className="landing-outline-btn" href="/contact">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-numbers public-section" aria-label="GNX Sales in numbers">
        <div>
          {stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-story public-section">
        <div>
          <span className="eyebrow">Why we built it</span>
          <h2 className="display">Building got easy. Selling didn&apos;t.</h2>
        </div>
        <div className="about-story-body">
          <p>AI tools now let one person build and ship a real product in weeks. What they don&apos;t give you is customers. Most founders we talk to have a product that works and no sales process at all: no list, no outreach, no one following up.</p>
          <p>Hiring a salesperson costs more than most early teams can spend, and the tools built for big sales teams assume you already have one. So follow-ups get dropped, leads go cold, and good products stay unknown.</p>
          <p>GNX Sales is our answer: an agent that does the work a first sales hire would do. It finds people who match your ideal customer, researches why they would care, writes to them, calls them, follows up, and puts the meeting on your calendar. You stay in charge of what it says.</p>
        </div>
      </section>

      <section className="about-steps public-section" aria-label="What it does">
        {steps.map((s) => (
          <div key={s.n} className={s.dark ? "is-dark" : undefined}>
            <span>{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </section>

      <section className="about-block public-section">
        <div className="about-block-head">
          <span className="eyebrow">What we believe</span>
          <h2 className="display">The rules that decide what we build, and what we refuse to ship.</h2>
        </div>
        <div className="about-principles">
          {principles.map((p) => (
            <div key={p.title} className="about-principle">
              <span className="faq-topic-icon"><Icon name={p.icon} size={20} stroke={p.icon === "check" ? 2.2 : 1.8} /></span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-history">
        <div className="about-history-inner public-section">
          <span className="eyebrow">How we got here</span>
          <h2 className="display">A short history.</h2>
          <ol>
            {history.map((h) => (
              <li key={h.when} data-tone={h.tone}>
                <i aria-hidden="true" />
                <span className={h.now ? "is-now" : undefined}>{h.when}</span>
                <p>{h.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-block public-section">
        <div className="about-team-head">
          <div className="about-block-head">
            <span className="eyebrow">The team</span>
            <h2 className="display">Small on purpose. Building every day.</h2>
          </div>
          <p>
            Four people across engineering and leadership, building GNX Sales inside Globonexo, which also helps
            companies hire vetted developers.
          </p>
        </div>
        <div className="about-team">
          {team.map((m) => (
            <div key={m.name} className="about-member">
              <span className="about-avatar" style={{ background: m.tint }} aria-hidden="true">{m.initials}</span>
              <h3>{m.name}</h3>
              <strong>{m.role}</strong>
              <p>{m.line}</p>
              {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
            </div>
          ))}
        </div>
      </section>

      <section className="about-facts public-section">
        {facts.map((f) => (
          <div key={f.label} className="privacy-tile privacy-tile--green">
            <span>{f.label}</span>
            <strong>{f.title}</strong>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      <section className="privacy-cta public-section">
        <div className="privacy-cta-card">
          <div>
            <h2 className="display">See it run on your pipeline.</h2>
            <p>Pick a plan and launch this week, or book 30 minutes and we will walk through your outbound with you.</p>
          </div>
          <div className="content-cta-actions">
            <Link className="btn btn-primary btn-lg" href="/signup">Start free</Link>
            <a className="landing-outline-btn" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Book a demo</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <BreadcrumbSchema trail={[{ name: "About", path: "/about" }]} />
    </div>
  );
}
