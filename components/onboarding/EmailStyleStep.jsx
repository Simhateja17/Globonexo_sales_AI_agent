"use client";
import React, { useState } from "react";
import api from "../../lib/api";
import Icon from "../ui/Icon";
import { Live, Marked, NumberStepper, RuleChips } from "./ui";
import { CADENCES, EMAIL_RULES, HOOKS, MAX_EMAILS, TONES, TOOLS } from "../../lib/onboarding-data";
import { buildPreviewRequest, cadenceDays, followUpGaps, hasVoice, sampleEmail, stepsFor, toneSample } from "../../lib/onboarding-flow";

function OptionCard({ on, custom, onClick, title, children, extra }) {
  return (
    <button type="button" className={`oc ${custom ? "cu" : ""} ${on ? "on" : ""}`} aria-pressed={on} onClick={onClick}>
      <b>{title}{extra}<span className="rd" aria-hidden="true" /></b>
      {children}
    </button>
  );
}

export default function EmailStyleStep({ d, set, footer }) {
  const steps = stepsFor(d.channels);
  const index = steps.findIndex(s => s.id === "email") + 1;
  const agent = d.agentName.trim() || "Nexo";
  const email = sampleEmail(d);
  const gaps = followUpGaps(d);
  const days = cadenceDays(gaps);
  const ruleLabels = EMAIL_RULES.filter(r => d.emailRules.split("\n").map(l => l.trim()).includes(r.line)).map(r => r.label.toLowerCase());
  const ownLines = d.emailRules.split("\n").map(l => l.trim()).filter(l => l && !EMAIL_RULES.some(r => r.line === l));

  // "Generate" asks Nexo to write email 1 for real from these answers. The
  // sample above it is instant but cannot follow custom wording.
  const request = buildPreviewRequest(d);
  const requestKey = JSON.stringify(request);
  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const stale = generated && generated.key !== requestKey;
  const usesOwnWords = d.tone === "custom" || d.hook === "custom" || ownLines.length > 0;
  const generate = async () => {
    setGenerating(true);
    setGenError("");
    try {
      const { data } = await api.post("/onboarding/preview-email", request, { timeout: 45000 });
      setGenerated({ ...data, key: requestKey });
    } catch (err) {
      setGenError(err?.response?.data?.error || err?.response?.data?.message || `${agent} could not write a preview right now. Try again.`);
    } finally {
      setGenerating(false);
    }
  };
  const words = generated
    ? generated.body.split(/\s+/).filter(Boolean).length
    : email.words;

  const setGap = (i, value) => {
    const next = [...d.customGaps];
    next[i] = Math.min(30, Math.max(1, Math.round(Number(value) || 1)));
    set("customGaps", next);
  };

  return (
    <main className="wrap">
      <section className="form">
        <div>
          <div className="eyebrow">Step {index} of {steps.length} · {hasVoice(d.channels) ? "emails only · " : ""}good defaults already set</div>
          <h1 className="h1">How should your emails sound?</h1>
          <p className="lede">Click a tone and watch the email on the right change. If the defaults feel right, just continue.</p>
        </div>

        <div className="card">
          <div className="lbl">Tone <small>Each card shows a sample opening line</small></div>
          <div className="opts">
            {TONES.map(t => (
              <OptionCard key={t.id} title={t.label} custom={t.custom} on={d.tone === t.id} onClick={() => set("tone", t.id)}>
                <span className={t.custom ? "p" : ""}>{t.custom ? toneSample(t.id, d).line : `"${toneSample(t.id, d).line}"`}</span>
              </OptionCard>
            ))}
          </div>
          {d.tone === "custom" && (
            <div className="cus">
              <label className="hint dk" htmlFor="ob-tone">Describe the tone in your own words</label>
              <textarea id="ob-tone" className="ta" rows={2} maxLength={500} autoFocus value={d.customTone} onChange={e => set("customTone", e.target.value)}
                placeholder="e.g. Like a fellow founder talking to another. Plain, practical, a little light-hearted. No sales jargon." />
            </div>
          )}
        </div>

        <div className="card">
          <div className="lbl">How the first email opens</div>
          <div className="opts">
            {HOOKS.map(h => (
              <OptionCard key={h.id} title={h.label} custom={h.custom} on={d.hook === h.id} onClick={() => set("hook", h.id)}>
                <span className="p">{h.desc}</span>
              </OptionCard>
            ))}
          </div>
          {d.hook === "custom" && (
            <div className="cus">
              <label className="hint dk" htmlFor="ob-hook">How should the first line open?</label>
              <textarea id="ob-hook" className="ta" rows={2} maxLength={500} autoFocus value={d.customHook} onChange={e => set("customHook", e.target.value)}
                placeholder="e.g. Start by mentioning their city and a season coming up, then connect it to their busiest days." />
            </div>
          )}
        </div>

        <div className="card">
          <div className="lbl">Follow-ups <small>Stops the moment someone replies</small></div>
          <div className="opts">
            {CADENCES.map(c => (
              <OptionCard key={c.id} title={c.label} custom={c.custom} on={d.cadence === c.id} onClick={() => set("cadence", c.id)}
                extra={c.recommended ? <span className="tag" style={{ marginLeft: "auto", marginRight: 6 }}>Recommended</span> : null}>
                <span className="p">{c.desc}</span>
                <span className="dy">{c.gaps ? cadenceDays(c.gaps).map(n => `Day ${n}`).join(" · ") : `Up to ${MAX_EMAILS} emails`}</span>
              </OptionCard>
            ))}
          </div>
          {d.cadence === "custom" && (
            <div className="cus">
              <span className="hint dk">Your follow-up plan <span style={{ fontWeight: 600, color: "#69786f" }}>· up to {MAX_EMAILS} emails</span></span>
              <div className="ced">
                <div className="cr"><i>1</i><span>First email</span><b style={{ color: "#69786f", fontSize: 12.5 }}>Day 0</b></div>
                {d.customGaps.map((gap, i) => {
                  const last = i === d.customGaps.length - 1;
                  return (
                    <div className="cr" key={i}>
                      <i>{i + 2}</i>
                      <span>{last ? "Last note, offers to step back" : "Follow-up, if no reply"}</span>
                      after<input className="num" type="number" min={1} max={30} value={gap} aria-label={`Days before follow-up ${i + 1}`} onChange={e => setGap(i, e.target.value)} />days
                      <button type="button" aria-label={`Remove follow-up ${i + 1}`} disabled={d.customGaps.length <= 1}
                        onClick={() => set("customGaps", d.customGaps.filter((_, j) => j !== i))}><Icon name="close" size={15} stroke={2.2} /></button>
                    </div>
                  );
                })}
              </div>
              {d.customGaps.length < MAX_EMAILS - 1 && (
                <button type="button" className="chip" style={{ alignSelf: "flex-start", minHeight: 40 }} onClick={() => set("customGaps", [...d.customGaps, 3])}>+ Add a follow-up</button>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="lbl" style={{ justifyContent: "flex-start" }}>Your own rules for {agent} <span className="tag new">New</span></div>
          <label className="hint" htmlFor="ob-rules">Anything {agent} should always or never do. Plain sentences work best.</label>
          <textarea id="ob-rules" className="ta" rows={3} maxLength={2000} value={d.emailRules} onChange={e => set("emailRules", e.target.value)}
            placeholder={"Keep every email under 90 words.\nNever mention pricing in the first email."} />
          <RuleChips rules={EMAIL_RULES} text={d.emailRules} onChange={v => set("emailRules", v)} label="Add a common rule:" />
        </div>

        <div className="card">
          <div className="split">
            <div>
              <div className="lbl">Meetings you want a month</div>
              <NumberStepper label="Meetings" value={d.meetingTarget} min={1} max={50} onChange={v => set("meetingTarget", v)} />
              <span className="hint">Sets your dashboard goal.</span>
            </div>
            <div style={{ flex: 1, minWidth: "min(260px, 100%)" }}>
              <div className="lbl">Tools you use <small>Optional</small></div>
              <div className="chips">
                {TOOLS.map(t => {
                  const on = d.tools.includes(t);
                  return <button type="button" key={t} className={`chip xs ${on ? "on" : ""}`} style={{ minHeight: 40 }} aria-pressed={on}
                    onClick={() => set("tools", on ? d.tools.filter(x => x !== t) : [...d.tools, t])}>{t}</button>;
                })}
              </div>
            </div>
          </div>
        </div>

        {footer}
      </section>

      <aside className="side">
        <div className="pv">
          <div className="pv-h">Email 1, in this style{generated ? <span className="gen-tag"><Icon name="sparkle" size={11} stroke={2.4} />Written by {agent}</span> : <Live />}</div>
          <div className="mail-meta"><span>To: <b>{email.to}</b></span><span>Subject: <b>{generated ? generated.subject : email.subject}</b></span></div>
          {generated ? (
            <div className="mail gen">
              {generated.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para.trim()}</p>)}
            </div>
          ) : (
            <div className="mail">
              <p>{email.greeting}</p>
              {email.body.map((parts, i) => <p key={i}><Marked parts={parts} /></p>)}
              <p>{email.signoff}</p>
            </div>
          )}
          {stale && <div className="stale" role="status">You changed the style since this was written. Generate again to see it.</div>}
          <div className="pv-f">
            <span className="hint">
              {generated ? "Sample lead. Real emails use details Nexo finds about each one."
                : usesOwnWords ? "Your own tone, opening and rules only show in a generated email."
                  : "Instant sample. Generate to see how Nexo really writes it."}
            </span>
            <span className="acts">
              {generated && <button type="button" className="mini" onClick={() => setGenerated(null)}>Show sample</button>}
              <button type="button" className="mini p" onClick={generate} disabled={generating}>
                <Icon name="sparkle" size={13} stroke={2.4} />{generating ? "Writing…" : generated ? "Generate again" : "Generate"}
              </button>
            </span>
          </div>
          {genError && <div className="stale" role="alert" style={{ background: "#fdf3f2", borderColor: "#f6cfcb", color: "#b42318" }}>{genError}</div>}
          {days.slice(1).map((day, i) => (
            <div className="fu" key={i}><i>{i + 2}</i><span>{i === days.length - 2 ? "Last note, offers to step back" : "Follow-up, if no reply"}</span><em>Day {day}</em></div>
          ))}
        </div>
        <div className="rules">
          <b>Your rules applied</b>
          {[`${words} words`, ...ruleLabels, ...(ownLines.length ? [`${ownLines.length} rule${ownLines.length > 1 ? "s" : ""} of your own`] : [])].join(" · ")}
          {gaps.length + 1 > 3 && <><br />{gaps.length + 1} emails in the sequence.</>}
        </div>
      </aside>
    </main>
  );
}
