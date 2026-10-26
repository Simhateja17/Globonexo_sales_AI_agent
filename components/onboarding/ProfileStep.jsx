"use client";
import React, { useState } from "react";
import Icon from "../ui/Icon";
import { Combo, Live } from "./ui";
import { INDUSTRIES, QUICK_ROLES, ROLES } from "../../lib/onboarding-data";
import { hasVoice, stepsFor } from "../../lib/onboarding-flow";

const STEP_COPY = { profile: "Who you are", product: "What you sell", audience: "Who to reach", email: "How your emails sound", voice: "How your calls sound", launch: "Preview and launch" };

export default function ProfileStep({ d, set, fromSignup, footer }) {
  const [searchingRole, setSearchingRole] = useState(!QUICK_ROLES.includes(d.role) && !!d.role);
  const agent = d.agentName.trim() || "your agent";
  const who = d.firstName.trim() || "you";
  const company = d.company.trim() || "your company";
  const industry = d.industry ? d.industry.toLowerCase() : "your industry";
  const steps = stepsFor(d.channels);
  const ideas = Array.from(new Set(["Nexo", "Aria", "Sam", d.company.trim() ? `${d.company.trim().split(" ")[0]} Assistant` : "Max"]));
  const voice = hasVoice(d.channels);

  return (
    <main className="wrap">
      <section className="form">
        <div>
          <div className="eyebrow">Step 1 of {steps.length} · about {d.channels === "both" ? 5 : 3} minutes in total</div>
          <h1 className="h1">Who is {d.agentName.trim() || "Nexo"} selling for?</h1>
          <p className="lede">Four quick answers. Your industry choice lets {d.agentName.trim() || "Nexo"} pre-write the next steps for you, so after this it is mostly reviewing instead of typing.</p>
        </div>

        <div className="card roomy">
          <div className="row2">
            <label className="fld">
              <span className="lbl sm">First name {fromSignup.firstName && <span className="tag gray">From sign-up</span>}</span>
              <span className="in"><span className="ic"><Icon name="user" size={18} /></span>
                <input value={d.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Maya" maxLength={80} autoComplete="given-name" /></span>
            </label>
            <label className="fld">
              <span className="lbl sm">Last name <small>Optional</small></span>
              <span className="in"><span className="ic"><Icon name="user" size={18} /></span>
                <input value={d.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Collins" maxLength={80} autoComplete="family-name" /></span>
            </label>
          </div>

          <label className="fld">
            <span className="lbl sm">Company name</span>
            <span className="in"><span className="ic"><Icon name="building" size={18} /></span>
              <input value={d.company} onChange={e => set("company", e.target.value)} placeholder="Northwind Logistics" maxLength={160} autoComplete="organization" /></span>
          </label>

          <div className="fld">
            <span className="lbl sm" id="role-label">Your role</span>
            <div className="chips" role="group" aria-labelledby="role-label">
              {QUICK_ROLES.map(r => (
                <button type="button" key={r} className={`chip ${d.role === r ? "on" : ""}`} aria-pressed={d.role === r} onClick={() => { set("role", r); setSearchingRole(false); }}>{r}</button>
              ))}
              {!searchingRole && (
                <button type="button" className={`chip more ${!QUICK_ROLES.includes(d.role) && d.role ? "on" : ""}`} onClick={() => setSearchingRole(true)}>
                  <Icon name="search" size={14} stroke={2.2} />Search {ROLES.length}+ roles
                </button>
              )}
            </div>
            {searchingRole && (
              <Combo label="Search roles" icon="search" value={QUICK_ROLES.includes(d.role) ? "" : d.role} onChange={v => set("role", v)}
                options={ROLES} placeholder="Type your role, e.g. Head of Growth" />
            )}
          </div>

          <div className="fld">
            <span className="lbl sm">Your industry <span className="tag"><Icon name="sparkle" size={12} stroke={2.2} />Unlocks pre-written drafts</span></span>
            <Combo label="Your industry" icon="store" value={d.industry} onChange={v => set("industry", v)} options={INDUSTRIES} capitalize placeholder="Type to search, e.g. Retail" />
            <span className="hint">Type to search all {INDUSTRIES.length} industries. The next steps start from drafts written for this industry.</span>
          </div>
        </div>

        <div className="card roomy">
          <div className="nm">
            <span className="nm-av" aria-hidden="true">{(d.agentName.trim() || "A").charAt(0).toUpperCase()}</span>
            <div className="nm-b">
              <label className="fld">
                <span className="lbl sm">Name your AI agent <small>You can change it anytime</small></span>
                <span className="in"><span className="ic"><Icon name="sparkle" size={18} /></span>
                  <input value={d.agentName} onChange={e => set("agentName", e.target.value)} maxLength={40} placeholder="Nexo" /></span>
              </label>
              <div className="chips">
                <span className="hint b">Ideas:</span>
                {ideas.map(n => <button type="button" key={n} className={`chip sm more ${d.agentName === n ? "on" : ""}`} onClick={() => set("agentName", n)}>{n}</button>)}
              </div>
              <div className="say">
                {voice ? <>On calls it introduces itself as: <b>&ldquo;This is {agent}, an AI assistant calling on behalf of {who} at {company}.&rdquo;</b> You&apos;ll see this name across the app too.</>
                  : <>You&apos;ll see <b>{agent}</b> across the app. Emails go out under your own name, never the agent&apos;s.</>}
              </div>
            </div>
          </div>
        </div>

        {footer}
      </section>

      <aside className="side">
        <div className="pv">
          <div className="pv-h">How you appear{voice ? "" : " in emails"}<Live /></div>
          <div className="pv-b">
            <div className="found"><i><Icon name="mail" size={15} stroke={2} /></i><div><b>Sign-off</b><span>{[d.firstName, d.lastName].filter(s => s.trim()).join(" ") || "Your name"}<br />{d.role || "Your role"}, {company}</span></div></div>
            {voice && <div className="found"><i><Icon name="phone" size={15} stroke={2} /></i><div><b>On calls</b><span>&ldquo;{agent}, an AI assistant calling on behalf of {who} at {company}.&rdquo;</span></div></div>}
            <div className="found"><i><Icon name="store" size={15} stroke={2} /></i><div><b>Next step drafts</b><span>Product description, customer outcome and buyer problems, written for {industry}.</span></div></div>
            <div className="found"><i><Icon name="target" size={15} stroke={2} /></i><div><b>Suggested audience</b><span>Titles and industries that usually buy from {d.industry ? `${industry} companies` : "companies like yours"}, ready to tick.</span></div></div>
          </div>
        </div>
        <div className="note"><Icon name="shieldPlain" size={18} color="#088256" style={{ flex: "none" }} /><span><b>Drafts are only a starting point.</b> You check and edit every one before {d.agentName.trim() || "Nexo"} uses it.</span></div>
        <div className="dark">
          <b>Your setup in {steps.length} short steps</b>
          <p>Most of it is prefilled. You confirm, {d.agentName.trim() || "Nexo"} does the rest.</p>
          <div className="tl">{steps.map((s, i) => <div key={s.id}><em>{i + 1}</em>{STEP_COPY[s.id]}</div>)}</div>
        </div>
      </aside>
    </main>
  );
}
