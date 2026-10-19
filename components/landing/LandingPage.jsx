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
import HeroDemo from "./hero-demo/HeroDemo";
import LandingSections from "./LandingSections";

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
              <span className="gd-hero-badge">AI sales agent for B2B outbound</span>
              <h1 className="display gd-h1">
                Book more meetings with an AI sales agent that
                <span>never makes things up.</span>
              </h1>
              <p>
                It finds your buyers, checks they fit, emails and calls them, and books the meeting. Every line it
                writes comes from verified facts, and you approve what goes out or let autopilot run.
              </p>
              <div className="landing-hero-actions" style={loading ? { visibility: 'hidden' } : undefined} aria-hidden={loading || undefined}>
                {user ? (
                  <button className="btn btn-primary btn-lg" onClick={() => router.push('/dashboard')}>
                    Back to dashboard <Icon name="arrow" size={18} color="#06231a" />
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary btn-lg" onClick={() => router.push('/pricing')}>
                      See plans from $59 <Icon name="arrow" size={18} color="#06231a" />
                    </button>
                    <a
                      className="landing-outline-btn"
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Book a demo with GNX Sales"
                    >
                      <Icon name="calendar" size={17} />
                      Book a 30-min demo
                    </a>
                  </>
                )}
              </div>
              <div className="landing-assurances">
                <span><Icon name="check" size={15} color="var(--g-300)" /> Month to month</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> No setup fee</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> Verified emails only</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> AI disclosed on every call</span>
              </div>
            </div>

            <HeroDemo intro={intro} onSkip={endIntro} onLoopEnd={handleLoopEnd} />
            {logoFly && createPortal(
              <div ref={flyRef} className="hd-logo-fly" aria-hidden="true"><Logo size={102} light /></div>,
              document.body,
            )}
          </div>
        </section>

        <LandingSections user={user} loading={loading} />

        <PublicFooter />
      </div>
    </div>
  );
}
