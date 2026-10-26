"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { DEMO_URL } from "../../lib/site";

// variant: "light" (default, white pages) or "dark" (homepage hero over Aurora background)
// scrollTo: pass on the homepage so the logo scrolls to top instead of navigating
export default function PublicNav({ variant = "light", scrollTo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const dark = variant === "dark";

  const handleScroll = (id) => {
    scrollTo?.(id);
    setMobileOpen(false);
  };

  return (
    <header className={`site-nav${dark ? " site-nav--dark" : ""}`}>
      {scrollTo ? (
        <button className="site-nav-logo" onClick={() => handleScroll("landing-top")} aria-label="GNX Sales home">
          <Logo size={34} light={dark} />
        </button>
      ) : (
        <Link className="site-nav-logo" href="/" aria-label="GNX Sales home" onClick={() => setMobileOpen(false)}>
          <Logo size={34} light={dark} />
        </Link>
      )}

      <nav className="site-nav-links">
        <Link href="/platform" onClick={() => setMobileOpen(false)}>The Agent</Link>
        <Link href="/voice" onClick={() => setMobileOpen(false)}>AI Calls</Link>
        <Link href="/accuracy" onClick={() => setMobileOpen(false)}>No Guessing</Link>
        <Link href="/solutions" onClick={() => setMobileOpen(false)}>Who It&apos;s For</Link>
        <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
        <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
      </nav>

      <div className="site-nav-actions" style={loading ? { visibility: "hidden" } : undefined} aria-hidden={loading || undefined}>
        {user ? (
          <Link className="btn btn-primary btn-sm" href="/dashboard">
            Back to dashboard <Icon name="arrow" size={16} color="#06231a" />
          </Link>
        ) : (
          <>
            <Link className="public-link" href="/login">Sign in</Link>
            <a className="site-nav-demo" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Book a demo</a>
            <Link className="btn btn-primary btn-sm" href="/signup">
              Start free <Icon name="arrow" size={16} color="#06231a" />
            </Link>
          </>
        )}
      </div>

      <button
        className="site-nav-burger"
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <Icon name={mobileOpen ? "close" : "menu"} size={22} />
      </button>

      {mobileOpen && (
        <div className="site-nav-mobile">
          <Link href="/platform" onClick={() => setMobileOpen(false)}>The Agent</Link>
          <Link href="/voice" onClick={() => setMobileOpen(false)}>AI Calls</Link>
          <Link href="/accuracy" onClick={() => setMobileOpen(false)}>No Guessing</Link>
          <Link href="/solutions" onClick={() => setMobileOpen(false)}>Who It&apos;s For</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>

          <div className="site-nav-mobile-actions" style={loading ? { visibility: "hidden" } : undefined} aria-hidden={loading || undefined}>
            {user ? (
              <Link className="btn btn-primary btn-lg" href="/dashboard" onClick={() => setMobileOpen(false)}>
                Back to dashboard
              </Link>
            ) : (
              <>
                <Link className="btn btn-ghost btn-lg" href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <a className="btn btn-ghost btn-lg" href={DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>Book a demo</a>
                <Link className="btn btn-primary btn-lg" href="/signup" onClick={() => setMobileOpen(false)}>Start free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
