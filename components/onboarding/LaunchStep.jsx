"use client";
import React, { useState } from "react";
import Icon from "../ui/Icon";
import { FormError, Marked } from "./ui";
import { CADENCES, CALL_GOALS, HOOKS, TONES, VOICES } from "../../lib/onboarding-data";
import {
  allPains, audienceSentence, capitalize, cadenceDays, callDaysSummary, followUpGaps, hasEmail, hasVoice, sampleCall, sampleEmail, usableObjections,
} from "../../lib/onboarding-flow";

function Summary({ icon, title, onEdit, children }) {
  return (
    <div className="sumc">
      <div className="sumc-h"><b><i><Icon name={icon} size={14} stroke={2} /></i>{title}</b><button type="button" onClick={onEdit} aria-label={`Edit ${title}`}>Edit</button></div>
      {children}
    </div>
  );
}

function CheckRow({ on, required, onClick, title, tag, children }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} className={`ckrow ${on ? "on" : required ? "req" : ""}`} onClick={onClick}>
      <span className="cbx" aria-hidden="true">{on && <Icon name="check" size={13} stroke={3.2} />}</span>
      <span><b>{title}{tag}</b><span className="d">{children}</span></span>
    </button>
  );
}

/**
 * `checkout` is set when a paid plan was picked after sign-up and is not paid
 * yet: { plan, billingPeriod }. Launch then opens checkout first.
 */
export default function LaunchStep({ d, set, onJump, onBack, onLaunch, loading, error, free, checkout, onChangePlan }) {
  const email = hasEmail(d.channels);
  const voice = hasVoice(d.channels);
  const both = email && voice;
  const [tab, setTab] = useState("email");
  const agent = d.agentName.trim() || "Nexo";
  const fullName = [d.firstName, d.lastName].map(s => s.trim()).filter(Boolean).join(" ");
  const sample = sampleEmail(d);
  const call = sampleCall(d);
  const blocked = voice && !d.permissionConfirmed;
  const viewEmail = email && (!both || tab === "email");
  const viewCall = voice && (!both || tab === "call");
  const tone = TONES.find(t => t.id === d.tone);
  const hook = HOOKS.find(h => h.id === d.hook);
  const cadence = CADENCES.find(c => c.id === d.cadence);
  const days = cadenceDays(followUpGaps(d));
  const voiceDef = VOICES.find(v => v.id === d.voice);
  const goal = CALL_GOALS.find(g => g.id === d.callGoal);
  const emailRules = d.emailRules.split("\n").map(l => l.trim()).filter(Boolean);
  const callRules = d.callRules.split("\n").map(l => l.trim()).filter(Boolean);

  const next = [{ t: "Your setup is saved", s: "Every future campaign starts from these answers" }];
  if (both) next.push({ t: "Connect your inbox, and we set up your calling number", s: "The two things campaigns send and call from" });
  else if (voice) next.push({ t: "We set up your calling number and voice agent", s: "Included in your plan. We let you know when it's ready" });
  else next.push({ t: "Connect the inbox " + agent + " sends from", s: free ? "Your company address, about 2 minutes" : "About 2 minutes" });
  next.push(free
    ? { t: "Add your leads and start your first campaign", s: "Import a CSV or add people yourself. Nothing is sent until you approve it" }
    : { t: "Add leads and start your first campaign", s: voice ? "Nothing goes out until you launch it" : "Nothing is sent until you approve it" });

  return (
    <main className="wrap">
      <section className="form">
        <div>
          <div className="eyebrow">Last step</div>
          <h1 className="h1">Here&apos;s your agent. Ready?</h1>
          <p className="lede">
            {both ? "Check the sample email and the sample call. If they sound like you, launch. Anything off, use the Edit links."
              : voice ? "Read through the sample call. If it sounds right, confirm calling permission and launch."
                : "Read the sample email. If it sounds like you, launch. Anything off, use the Edit links."}
          </p>
        </div>

        <div className="card roomy">
          <div className="agent">
            <span className="av" aria-hidden="true">{agent.charAt(0).toUpperCase()}</span>
            <div className="agent-n"><b>{agent}</b><span>Sells for {d.company.trim() || "your company"} · works for {fullName || "you"}</span></div>
            <div className="chs">
              {email && <span className="chp"><Icon name="mail" size={14} stroke={2} />Email</span>}
              {voice && <span className="chp"><Icon name="phone" size={14} stroke={2} />Voice</span>}
            </div>
          </div>
          <div className="row2">
            <label className="fld">
              <span className="lbl sm">Agent name</span>
              <span className="in"><span className="ic"><Icon name="sparkle" size={18} /></span><input value={d.agentName} maxLength={40} onChange={e => set("agentName", e.target.value)} /></span>
              <span className="hint">{voice ? "Leads hear this name on calls, said as an AI assistant." : "Only you see this name, inside the app."}</span>
            </label>
            <label className="fld">
              <span className="lbl sm">Booking link <small>Optional</small></span>
              <span className="in"><span className="ic"><Icon name="link" size={18} /></span><input value={d.bookingLink} maxLength={300} placeholder="cal.com/yourname" onChange={e => set("bookingLink", e.target.value)} /></span>
              <span className="hint">Shared when a lead wants to meet. Add later if you like.</span>
            </label>
          </div>
        </div>

        <div className="sums">
          <Summary icon="user" title="You" onEdit={() => onJump("profile")}>
            <p>{fullName || "You"}, {d.role} at {d.company.trim() || "your company"}. {capitalize(d.industry)}.</p>
          </Summary>
          <Summary icon="store" title="Product" onEdit={() => onJump("product")}>
            <p>{d.productDescription.trim()}</p>
            {allPains(d).length > 0 && <div className="pills">{allPains(d).slice(0, 4).map(p => <span className="pl" key={p}>{p}</span>)}</div>}
          </Summary>
          <Summary icon="target" title="Audience" onEdit={() => onJump("audience")}>
            <p>{audienceSentence(d).map(p => p.text).join("")}</p>
          </Summary>
          {email && (
            <Summary icon="mail" title="Email style" onEdit={() => onJump("email")}>
              <p>{tone?.custom ? "Your own tone" : tone?.label}. Opens with {hook?.custom ? "your own opening" : hook?.label.toLowerCase()}. {days.length} emails over {days[days.length - 1]} days{cadence?.custom ? "" : ` (${cadence?.label.toLowerCase()})`}.</p>
              {emailRules.length > 0 && <div className="pills">{emailRules.slice(0, 3).map(r => <span className="pl" key={r}>{r.replace(/\.$/, "")}</span>)}</div>}
            </Summary>
          )}
          {voice && (
            <Summary icon="phone" title="Call style" onEdit={() => onJump("voice")}>
              <p>{d.voiceId && d.voiceName ? `${d.voiceName}` : `${voiceDef?.name} style`} voice, {d.callLanguage}. Goal: {goal?.custom ? "your own" : goal?.label.toLowerCase()}. {callDaysSummary(d.callDays)}, up to {d.maxAttempts} {d.maxAttempts === 1 ? "try" : "tries"}.</p>
              <div className="pills">
                <span className="pl">{usableObjections(d).length + 1} objection answers</span>
                {callRules.slice(0, 2).map(r => <span className="pl" key={r}>{r.replace(/\.$/, "")}</span>)}
              </div>
            </Summary>
          )}
        </div>

        {voice && (
          <div className="vcard">
            <div className="vh"><i><Icon name="phone" size={15} stroke={2} /></i>Before {agent} makes calls</div>
            <div className="vb">
              <div className="numrow"><Icon name="checkCircle" size={18} color="#088256" style={{ flex: "none" }} /><span><b>Calling number included.</b> We set up your number and voice agent after you launch. No extra hardware.</span></div>
              <CheckRow on={d.practiceCallsFirst} onClick={() => set("practiceCallsFirst", !d.practiceCallsFirst)} title="Run practice calls first" tag={<span className="gtag">Recommended</span>}>
                {agent} handles scripted practice scenarios, like a busy owner or a price objection, so you can check it before a real lead hears it.
              </CheckRow>
              <CheckRow on={d.permissionConfirmed} required onClick={() => set("permissionConfirmed", !d.permissionConfirmed)} title="I'm allowed to call these contacts" tag={<span className="rtag">Required</span>}>
                I confirm that my organization is permitted to make automated calls to these contacts and will follow applicable calling laws.
              </CheckRow>
            </div>
          </div>
        )}

        <div className="next">
          <div>When you launch</div>
          {next.map((n, i) => <div key={n.t}><i>{i + 1}</i><span><b>{n.t}</b><small>{n.s}</small></span></div>)}
        </div>

        {checkout && (
          <div className="numrow" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <span><b>{checkout.plan.name} plan · ${checkout.billingPeriod === "annual"
              ? `${checkout.plan.annualMonthly}/month, $${checkout.plan.annualTotal.toLocaleString("en-US")} billed yearly`
              : `${checkout.plan.monthly}/month, billed monthly`}.</b> You pay now with Razorpay, then {agent} launches. Cancel any time.</span>
            <button type="button" className="mini" onClick={onChangePlan}>Change plan</button>
          </div>
        )}

        <FormError message={error} id="ob-launch-error" />

        <div className="foot">
          <button type="button" className="bt bt-g" onClick={onBack} disabled={loading}><Icon name="arrowLeft" size={18} stroke={2.2} />Back</button>
          <div className="right">
            {blocked
              ? <span className="need"><Icon name="alertCircle" size={16} stroke={2} />Confirm calling permission to launch</span>
              : <span className="safe"><Icon name="shieldPlain" size={16} stroke={2} />Nothing goes out yet</span>}
            <button type="button" className={`bt bt-l ${blocked ? "bt-off" : "bt-p"}`} aria-disabled={blocked} disabled={loading} onClick={onLaunch}>
              <Icon name={checkout ? "card" : "bolt"} size={18} stroke={2} />{loading ? (checkout ? "Opening checkout…" : "Launching…") : checkout ? `Pay and launch ${agent}` : `Launch ${agent}`}
            </button>
          </div>
        </div>
      </section>

      <aside className="side">
        <div className="pv">
          <div className="pv-h">
            <span>{both ? "Preview" : voice ? "Sample call" : "Sample first email"}</span>
            {both && (
              <div className="tabs" role="tablist" aria-label="Preview">
                <button type="button" role="tab" aria-selected={tab === "email"} className={tab === "email" ? "on" : ""} onClick={() => setTab("email")}>Email</button>
                <button type="button" role="tab" aria-selected={tab === "call"} className={tab === "call" ? "on" : ""} onClick={() => setTab("call")}>Call</button>
              </div>
            )}
          </div>
          {viewEmail && (
            <>
              <div className="mail-meta">
                <span>From: <b>{fullName || "You"}</b></span>
                <span>To: <b>{sample.to}</b></span>
                <span>Subject: <b>{sample.subject}</b></span>
              </div>
              <div className="mail">
                <p>{sample.greeting}</p>
                {sample.body.map((parts, i) => <p key={i}>{parts.map(p => p.text).join("")}</p>)}
                <p className="sig">{d.firstName.trim() || "You"}<br />{d.role}, {d.company.trim()}</p>
              </div>
              <div className="pv-f"><span className="hint">Sample lead. Real emails use details {agent} finds about each one.</span></div>
            </>
          )}
          {viewCall && (
            <>
              <div className="tr">
                {call.map((m, i) => <div key={i} className={`msg ${m.from}`}><small>{m.from === "n" ? agent : "Alex"}</small><Marked parts={m.text.map(p => ({ ...p, mark: false }))} /></div>)}
              </div>
              <div className="pv-f"><span className="hint">Sample conversation. Real calls adapt to what each person says.</span></div>
            </>
          )}
        </div>
      </aside>
    </main>
  );
}
