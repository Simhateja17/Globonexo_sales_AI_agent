"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Aurora from "../ui/Aurora";
import Icon from "../ui/Icon";
import PublicNav from "../layout/PublicNav";
import PublicFooter from "../layout/PublicFooter";
import { useAuth } from "../../hooks/useAuth";
import HeroDemo from "./hero-demo/HeroDemo";
import LandingSections from "./LandingSections";

const CALENDLY_URL = "https://calendly.com/gnxsales-support/30min";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="screen landing-screen">
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
                    <button className="btn btn-primary btn-lg" onClick={() => router.push('/signup')}>
                      Start free <Icon name="arrow" size={18} color="#06231a" />
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
                <span><Icon name="check" size={15} color="var(--g-300)" /> Free plan, no card</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> Month to month</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> No setup fee</span>
                <span><Icon name="check" size={15} color="var(--g-300)" /> AI disclosed on every call</span>
              </div>
            </div>

            {/* The hero copy owns the first screen; the demo below it starts
                playing once the visitor scrolls it into view. */}
            <HeroDemo />
          </div>
        </section>

        <LandingSections user={user} loading={loading} />

        <PublicFooter />
      </div>
    </div>
  );
}
