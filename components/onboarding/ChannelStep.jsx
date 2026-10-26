"use client";
import React from "react";
import Icon from "../ui/Icon";
import { hasEmail, hasVoice, stepsFor } from "../../lib/onboarding-flow";

const CHOICES = [
  {
    id: "email", icon: "mail", title: "Email campaigns",
    text: "Personal cold emails from your own inbox, with follow-ups that stop when someone replies. You approve every email before it sends.",
    meta: ["You'll need: your work inbox", "Best for: reaching many people"],
  },
  {
    id: "voice", icon: "phone", title: "AI voice calls",
    text: "Nexo calls your leads, says up front that it is an AI, talks through your offer, handles objections and books meetings. Every call is logged with a transcript.",
    meta: ["You'll need: nothing, a calling number is included", "Best for: fast, real conversations"],
  },
  {
    id: "both", icon: "mailPhone", title: "Both", tag: "Most teams",
    text: "Set up email and voice together. They share your product and audience answers, so it only adds one extra step for how calls should sound.",
    meta: ["You'll need: your work inbox", "Run them side by side"],
  },
];

const NOTES = { Profile: "Shared", Product: "Shared", "Ideal customer": "Shared", "Email style": "Email", "Call style": "Voice" };

export default function ChannelStep({ d, set, firstName, onContinue, free }) {
  const steps = stepsFor(d.channels);
  // The Free plan has no AI calling, so only email can be picked there.
  const locked = id => free && id !== "email";
  const onKey = e => {
    if (free) return;
    const order = CHOICES.map(c => c.id);
    const i = order.indexOf(d.channels);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); set("channels", order[(i + 1) % order.length]); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); set("channels", order[(i + order.length - 1) % order.length]); }
  };
  return (
    <main className="wrap tall">
      <section className="form">
        <div>
          <div className="eyebrow">{firstName ? `Welcome, ${firstName}` : "Welcome"}</div>
          <h1 className="h1 xl">How should Nexo reach your buyers?</h1>
          <p className="lede" style={{ fontSize: 16 }}>{free ? "The Free plan includes email campaigns from your company inbox. AI calling comes with paid plans, and you can add it later." : "Pick one or both. Setup only asks what your choice needs, and you can add the other channel later from Settings."}</p>
        </div>

        <div className="choices" role="radiogroup" aria-label="Campaign type" onKeyDown={onKey}>
          {CHOICES.map(c => {
            const on = d.channels === c.id;
            const lock = locked(c.id);
            return (
              <button key={c.id} type="button" role="radio" aria-checked={on} aria-disabled={lock} tabIndex={on ? 0 : -1} className={`chc ${on ? "on" : ""} ${lock ? "lock" : ""}`}
                onClick={() => !lock && set("channels", c.id)}>
                <span className="chc-ic"><Icon name={c.icon} size={24} /></span>
                <span className="chc-b">
                  <span className="chc-t">{c.title}{lock ? <span className="tag gray"><Icon name="lock" size={11} stroke={2.4} />Paid plans</span> : c.tag && <span className="tag-d">{c.tag}</span>}</span>
                  <p>{c.text}</p>
                  <span className="chc-meta">{lock
                    ? <span className="pl">AI calling is not on the Free plan. <a href="/billing" onClick={e => e.stopPropagation()}>See plans</a></span>
                    : c.meta.map(m => <span className="pl" key={m}>{m}</span>)}</span>
                </span>
                <span className="rdo" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <div className="foot">
          <span className="hint" style={{ fontSize: 13 }}>{free ? "You're on the Free plan: email campaigns from your company inbox. Upgrade anytime to add calls." : "Not sure? Pick Both. You can switch either one off later."}</span>
          <button type="button" className="bt bt-p bt-xl" onClick={onContinue}>Continue<Icon name="arrow" size={18} stroke={2.2} /></button>
        </div>
      </section>

      <aside className="side">
        <div className="pv">
          <div className="pv-h"><b>Your setup</b><span style={{ color: "#088256", fontSize: 12.5 }}>{steps.length} steps · about {d.channels === "both" ? 5 : 3} min</span></div>
          <div className="sl">
            {steps.map((s, i) => {
              const label = s.id === "launch" ? "Preview and launch" : s.label;
              const channelOnly = s.id === "email" || s.id === "voice";
              return <div key={s.id} className={channelOnly ? "ch2" : ""}><i>{i + 1}</i>{label}<small>{NOTES[s.label] || ""}</small></div>;
            })}
          </div>
        </div>
        <div className="gtk">
          <b>Good to know</b>
          {hasVoice(d.channels) && (
            <>
              <div className="nr"><i><Icon name="phone" size={13} stroke={2} /></i><span>Your calling number is set up for you after launch. No phone hardware needed.</span></div>
              <div className="nr"><i><Icon name="shieldPlain" size={13} stroke={2} /></i><span>Before the first call you&apos;ll confirm you are allowed to call these contacts.</span></div>
            </>
          )}
          {hasEmail(d.channels) && (
            <div className="nr"><i><Icon name="mail" size={13} stroke={2} /></i><span>You connect your inbox after launch. Nothing sends before that.</span></div>
          )}
        </div>
      </aside>
    </main>
  );
}
