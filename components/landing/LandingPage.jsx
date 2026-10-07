"use client";
import React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Aurora from "../ui/Aurora";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import PublicNav from "../layout/PublicNav";
import PublicFooter from "../layout/PublicFooter";
import { useAuth } from "../../hooks/useAuth";
import { PLAN_CONFIG, marketingCeilingsFor } from "../../lib/plans";
import QualifyDemo from "./QualifyDemo";
import VoiceTestDemo from "./VoiceTestDemo";
import HeroDemo from "./hero-demo/HeroDemo";
import FaqSection from "../marketing/FaqSection";

const CALENDLY_URL = "https://calendly.com/gnxsales-support/30min";
const INTRO_KEY = "gnx-hero-intro-seen";

// Runs before first paint so the heading never flashes before the intro.
// Skipped for return visitors, phones and small tablets (they always get the
// heading with the demo below it), reduced motion, and crawlers, so the heading
// is always there for anyone who is not watching the demo.
const INTRO_SCRIPT = `try{var d=document.documentElement;if(innerWidth>900&&!localStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!navigator.webdriver&&!/bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent))d.classList.add("gnx-intro")}catch(e){}`;

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const copilotPoints = [
    'Ask it in plain English — no hunting through screens',
    'Pause every live campaign with one sentence',
    'It keeps working between your campaigns, not just inside them',
    'Autopilot changes who approves a message, never what gets checked',
  ];

  const chat = [
    { from: 'you', text: 'Which leads need me today?' },
    { from: 'agent', text: 'Three replied overnight and are waiting on you.', rows: [
      { name: 'Head of RevOps · Bluepeak', note: 'Asked about pricing' },
      { name: 'VP Sales · Fernpoint', note: 'Wants a call Thursday' },
      { name: 'Founder · Oakline', note: 'Replied to step 2' },
    ] },
    { from: 'you', text: 'Pause everything until Monday.' },
    { from: 'agent', text: 'Paused 4 live campaigns. Nothing will send or dial until you resume.' },
  ];

  // Sourced from context-readiness.service.ts and email-validation.service.ts.
  const accuracy = [
    { icon: 'doc', title: 'It states what it does not know', text: 'The model is handed an explicit list of missing facts, not a vague instruction to avoid making things up. Telling it exactly what is absent is far stronger.' },
    { icon: 'target', title: 'Facts and guesses stay separate', text: 'A verified headcount is a fact. "They are struggling with pipeline" is a hypothesis, and hypotheses become questions, never claims.' },
    { icon: 'sliders', title: 'Readiness you can act on', text: 'A lead reads as "7 of 10 ready" with the missing pieces named. You can act on a missing fact. You cannot act on "68% quality".' },
    { icon: 'lock', title: 'Nothing is written on thin air', text: 'Without the required facts about a person and their company, no message is drafted at all. Silence beats a confident guess.' },
  ];

  const voicePoints = [
    'Adversarial scenarios, judged before a campaign dials, if you choose to test it',
    'Refuses to invent customers, pricing, or ROI it was never given',
    'Ends the call immediately on a do-not-call request',
    'Books only real calendar slots, never an invented time',
    'A calling number is provisioned for you automatically, nothing to set up',
  ];

  // Rotates through the real plan catalogue so the numbers can never drift from
  // what checkout actually sells. Every figure here comes from PLAN_CONFIG.
  const [planIndex, setPlanIndex] = React.useState(0);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const plan = PLAN_CONFIG[planIndex];

  React.useEffect(() => {
    if (!autoRotate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setPlanIndex((i) => (i + 1) % PLAN_CONFIG.length), 4000);
    return () => clearInterval(id);
  }, [autoRotate]);

  const { emailsPerMonth, callsPerMonth } = marketingCeilingsFor(plan);
  const capacity = [
    { value: plan.voiceCampaigns, label: plan.voiceCampaigns === 1 ? 'voice campaign' : 'voice campaigns' },
    { value: plan.emailCampaigns, label: 'email campaigns' },
    { value: callsPerMonth.toLocaleString(), label: 'calls / month', prefix: 'Up to' },
    { value: emailsPerMonth.toLocaleString(), label: 'emails / month', prefix: 'Up to' },
  ];

  const faqs = [
    {
      q: 'What is an AI sales agent?',
      a: 'An AI sales agent is software that runs the outbound sales motion end to end instead of just assisting with one step. GNX Sales finds companies that match your ideal customer profile, enriches and qualifies each contact, writes a personalized email sequence, sends and follows up on a schedule, drafts replies, places AI voice calls, and books meetings on your calendar.',
    },
    {
      q: 'How is an AI sales agent different from sales automation software?',
      a: 'Most sales automation software automates sending. It still needs you to decide who to contact and what to say. An AI sales agent makes those decisions too: it qualifies each account against your rules before spending on enrichment, and writes each message from what it actually knows about that person and company.',
    },
    {
      q: 'Does GNX Sales do both email and phone calls?',
      a: 'Yes. Email sequences and AI voice calling are included on every plan and draw from the same credit pool. A calling number is provisioned for you automatically, so voice is never a separate tool or a second bill.',
    },
    {
      q: 'Will the AI make things up about my prospects?',
      a: 'It is designed to stop unsupported claims. The model is handed an explicit list of the facts it is missing, facts and hypotheses are kept separate, and if the required context about a person and their company is not there, no message is drafted at all.',
    },
    {
      q: 'How long does it take to get started?',
      a: 'About five minutes to be live. You choose a plan, answer a guided set of onboarding questions so the agent learns your offer and ideal customer, connect Gmail or an SMTP and IMAP mailbox, and launch your first campaign.',
    },
    {
      q: 'Do messages send without my approval?',
      a: 'Not unless you turn that on. Every draft waits for your review by default. Autopilot can be enabled per campaign once you trust it, and it changes who approves a message, never whether that message was validated.',
    },
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  // First visit: the product demo plays one full loop on its own, a large logo
  // flies into the nav, then the heading unfolds above the demo. A skip,
  // scroll or key press jumps straight to the end.
  const [intro, setIntro] = React.useState(false);
  const [logoFly, setLogoFly] = React.useState(false);
  const flyRef = React.useRef(null);

  const endIntro = React.useCallback(() => {
    const root = document.documentElement;
    if (!root.classList.contains('gnx-intro')) return;
    try { localStorage.setItem(INTRO_KEY, '1'); } catch {}
    root.classList.add('gnx-intro-reveal');
    root.classList.remove('gnx-intro', 'gnx-intro-logo');
    setIntro(false);
    setLogoFly(false);
    setTimeout(() => root.classList.remove('gnx-intro-reveal'), 1400);
  }, []);

  const handleLoopEnd = React.useCallback(() => {
    const root = document.documentElement;
    if (!root.classList.contains('gnx-intro')) return;
    root.classList.add('gnx-intro-logo');
    setLogoFly(true);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('gnx-intro')) return undefined;
    setIntro(true);
    const events = ['wheel', 'touchmove', 'keydown'];
    events.forEach((name) => window.addEventListener(name, endIntro, { passive: true }));
    return () => {
      events.forEach((name) => window.removeEventListener(name, endIntro));
      root.classList.remove('gnx-intro', 'gnx-intro-reveal', 'gnx-intro-logo');
    };
  }, [endIntro]);

  // The big logo is drawn at 3x the nav logo, centred on the demo, then shrinks
  // onto the nav logo so the two line up exactly when the copy is removed.
  // It aims at the logo itself, not the nav button: the button stretches across
  // the nav's first grid column, so its centre sits well right of the logo.
  React.useEffect(() => {
    if (!logoFly) return undefined;
    const el = flyRef.current;
    const navLogo = document.querySelector('.site-nav-logo');
    const target = navLogo?.firstElementChild || navLogo;
    const flying = el?.firstElementChild;
    const shell = document.getElementById('product');
    if (!el || !flying || !target || !shell || !el.animate) {
      endIntro();
      return undefined;
    }
    const s = shell.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    el.style.left = `${s.left + s.width / 2 - box.width / 2}px`;
    el.style.top = `${s.top + s.height / 2 - box.height / 2}px`;
    // Measure after placing it, then move its top-left corner onto the nav
    // logo's top-left corner at the exact size ratio.
    const from = flying.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const scale = t.width / from.width;
    const dx = t.left - from.left;
    const dy = t.top - from.top;

    let cancelled = false;
    const appear = el.animate(
      [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }],
      { duration: 600, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' },
    );
    const hold = setTimeout(() => {
      const fly = el.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 1, transform: `translate(${dx}px, ${dy}px) scale(${scale})` }],
        { duration: 1000, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' },
      );
      fly.finished.then(() => { if (!cancelled) endIntro(); }).catch(() => {});
    }, 1500);
    return () => {
      cancelled = true;
      clearTimeout(hold);
      appear.cancel();
    };
  }, [logoFly, endIntro]);

  return (
    <div className="screen landing-screen">
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <div className="landing-scroll">
        <section className="landing-hero">
          <Aurora />
          <PublicNav variant="dark" scrollTo={scrollTo} />

          <div id="landing-top" className="landing-hero-inner">
            <div className="landing-hero-copy">
              <h1 className="display">
                Your AI sales agent.
                <span>Always prospecting.</span>
                <span>
                  Always <span className="landing-hero-rotator"><em>Calling</em><em aria-hidden="true">Mailing</em></span>.
                </span>
              </h1>
              <p>GNX Sales is sales automation software that finds buyers, researches why they would care, writes personalized outreach, and reaches them by email or AI voice call. You can focus on closing.</p>
              <div className="landing-hero-actions" style={loading ? { visibility: 'hidden' } : undefined} aria-hidden={loading || undefined}>
                {user ? (
                  <button className="btn btn-primary btn-lg" onClick={() => router.push('/dashboard')}>
                    Back to dashboard <Icon name="arrow" size={18} color="#06231a" />
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary btn-lg" onClick={() => router.push('/signup')}>
                      Start with a paid plan <Icon name="arrow" size={18} color="#06231a" />
                    </button>
                    <a
                      className="landing-outline-btn"
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Book a demo with GNX Sales"
                    >
                      <Icon name="calendar" size={17} />
                      Book a demo
                    </a>
                  </>
                )}
              </div>
              <div className="landing-assurances">
                <span><Icon name="check" size={15} color="var(--g-300)" /> For an individual, an agency, or a startup</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> Live in 5 minutes</span>
              </div>
            </div>

            <HeroDemo intro={intro} onSkip={endIntro} onLoopEnd={handleLoopEnd} />
            {logoFly && createPortal(
              <div ref={flyRef} className="hd-logo-fly" aria-hidden="true"><Logo size={102} light /></div>,
              document.body,
            )}
          </div>
        </section>

        <section className="landing-problem landing-section">
          <QualifyDemo
            intro={(
              <div className="landing-section-intro">
                <h2 className="display">B2B lead generation: volume was <em className="hl">never</em> the problem</h2>
                <p>A faster way to reach the wrong person is still the wrong person. Before anyone gets contacted, GNX works out:</p>
              </div>
            )}
          />
        </section>

        <section id="accuracy" className="landing-accuracy landing-section">
          <div className="landing-section-intro">
            <span className="landing-fit-label">No guessing</span>
            <h2 className="display">It won&apos;t write what it <em className="hl">doesn&apos;t know</em></h2>
            <p>Most AI agents for sales fail on a sentence that sounds confident and was never true. Yours is handed a list of the gaps instead.</p>
          </div>
          <div className="landing-accuracy-grid">
            {accuracy.map((item) => (
              <article key={item.title}>
                <div className="landing-usecase-icon landing-usecase-icon--accent">
                  <Icon name={item.icon} size={20} color="#fff" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="landing-accuracy-note">
            <Icon name="alertCircle" size={16} color="var(--g-800)" />
            <span>The line every prospect has learned to distrust — &ldquo;I know your team is struggling with X&rdquo; — written by a system that never knew that. GNX is designed to block unsupported claims like this.</span>
          </p>
        </section>

        <section id="voice" className="landing-voice landing-section">
          <div className="landing-voice-copy">
            <span className="landing-fit-label">AI voice agent</span>
            <h2 className="display"><em className="hl">Test</em> your AI voice agent before it phones anyone</h2>
            <p>
              Select pre-launch simulation testing to put the agent through adversarial calls and score every transcript —
              the busy prospect, the skeptic, the wrong person, the one who asks where you got their number.
            </p>
            <ul className="landing-copilot-points">
              {voicePoints.map((point) => (
                <li key={point}>
                  <div className="landing-usecase-icon landing-usecase-icon--accent landing-usecase-icon--sm">
                    <Icon name="check" size={14} color="#fff" />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
            <Link className="landing-text-link" href="/voice">
              How voice calling works <Icon name="arrow" size={15} color="var(--g-700)" />
            </Link>
          </div>
          <VoiceTestDemo />
        </section>

        <section id="copilot" className="landing-copilot landing-section">
          <div className="landing-copilot-copy">
            <span className="landing-fit-label">AI Co-Pilot</span>
            <h2 className="display">Run sales automation by just <em className="hl">telling it</em> what to do</h2>
            <p>
              Your co-pilot runs the outreach on its own — but you never have to hunt through screens to steer it.
              Ask in plain English and it does the work.
            </p>
            <ul className="landing-copilot-points">
              {copilotPoints.map((point) => (
                <li key={point}>
                  <div className="landing-usecase-icon landing-usecase-icon--accent landing-usecase-icon--sm">
                    <Icon name="check" size={14} color="#fff" />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
            <Link className="landing-text-link" href="/platform">
              Everything the agent handles <Icon name="arrow" size={15} color="var(--g-700)" />
            </Link>
          </div>

          <div className="cp" aria-hidden="true">
            <div className="qd-bar"><span /><span /><span /><em>Agent</em></div>
            <div className="cp-thread">
              {chat.map((m) => (
                <div key={m.text} className={`cp-msg is-${m.from}`}>
                  {m.from === 'agent' && <span className="cp-ava"><Icon name="bolt" size={13} color="#fff" /></span>}
                  <div>
                    <p>{m.text}</p>
                    {m.rows && (
                      <div className="cp-rows">
                        {m.rows.map((r) => (
                          <div key={r.name}><strong>{r.name}</strong><span>{r.note}</span></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="cp-input"><Icon name="chat" size={13} color="var(--faint)" /><span>Ask your agent anything…</span></div>
          </div>
        </section>

        <section id="results" className="landing-results landing-section">
          <div className="landing-results-copy">
            <h2 className="display">
              What <span key={plan.id} className="landing-plan-price">${plan.monthly}</span> gets you
            </h2>
            <p>Every plan includes all three capabilities. Tiers differ by volume, never by locked features.</p>
            <div className="landing-plan-tabs" role="tablist" aria-label="Choose a plan to compare">
              {PLAN_CONFIG.map((p, i) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={i === planIndex}
                  className={i === planIndex ? 'is-active' : ''}
                  onClick={() => { setPlanIndex(i); setAutoRotate(false); }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div key={plan.id} className="landing-outcomes">
            {capacity.map((item) => (
              <div key={item.label}>
                {item.prefix && <em className="landing-outcome-prefix">{item.prefix}</em>}
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <FaqSection
          className="landing-faq landing-section"
          heading="AI sales agent questions, answered"
          intro="What people ask before putting an AI agent in front of their prospects."
          items={faqs}
        />

        <section className="landing-cta landing-section">
          <div>
            <h2 className="display">Put your AI sales agent to work</h2>
            <p>Choose a plan, connect your inbox, and launch your first campaign in five minutes.</p>
          </div>
          <div className="landing-cta-actions" style={loading ? { visibility: 'hidden' } : undefined} aria-hidden={loading || undefined}>
            {user ? (
              <button className="btn btn-primary btn-lg" onClick={() => router.push('/dashboard')}>
                Back to dashboard <Icon name="arrow" size={18} color="#06231a" />
              </button>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => router.push('/signup')}>
                  Choose a plan <Icon name="arrow" size={18} color="#06231a" />
                </button>
                <Link className="landing-outline-btn" href="/pricing">View pricing</Link>
              </>
            )}
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  );
}
