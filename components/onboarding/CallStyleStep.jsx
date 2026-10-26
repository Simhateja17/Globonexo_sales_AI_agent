"use client";
import React, { useState } from "react";
import Icon from "../ui/Icon";
import { Live, Marked, NumberStepper, RuleChips } from "./ui";
import VoicePicker from "./VoicePicker";
import { CALL_GOALS, CALL_LANGUAGES, CALL_RULES, DO_NOT_CALL, MORE_OBJECTIONS, WEEKDAYS } from "../../lib/onboarding-data";
import { defaultOpeningLine, hasEmail, objectionsFor, sampleCall, stepsFor } from "../../lib/onboarding-flow";


function Objection({ item, onSave, onRemove, startEditing, agent }) {
  const [editing, setEditing] = useState(!!startEditing);
  const [q, setQ] = useState(item.q);
  const [a, setA] = useState(item.a);
  const save = () => { if (q.trim() && a.trim()) { onSave({ q: q.trim(), a: a.trim() }); setEditing(false); } };
  if (!editing) {
    return (
      <div className="obj">
        <div className="obj-q"><span>&ldquo;{item.q}&rdquo;</span><button type="button" onClick={() => { setQ(item.q); setA(item.a); setEditing(true); }}>Edit</button></div>
        <div className="obj-a"><b>{agent}</b><span>{item.a}</span></div>
      </div>
    );
  }
  return (
    <div className="obj">
      <div className="obj-q">
        <input value={q} maxLength={200} onChange={e => setQ(e.target.value)} aria-label="What the lead says" placeholder="What the lead says" autoFocus />
        <button type="button" onClick={save} disabled={!q.trim() || !a.trim()}>Save</button>
        <button type="button" onClick={onRemove} style={{ color: "#b42318" }}>Remove</button>
      </div>
      <div className="obj-a"><b>{agent}</b><textarea className="ta" rows={2} maxLength={600} value={a} onChange={e => setA(e.target.value)} aria-label={`How ${agent} answers`} placeholder={`How ${agent} answers`} /></div>
    </div>
  );
}

export default function CallStyleStep({ d, set, footer }) {
  const steps = stepsFor(d.channels);
  const index = steps.findIndex(s => s.id === "voice") + 1;
  const agent = d.agentName.trim() || "Nexo";
  const who = d.firstName.trim() || "you";
  const company = d.company.trim() || "your company";
  const objections = objectionsFor(d);
  const [newIndex, setNewIndex] = useState(-1);
  const extra = MORE_OBJECTIONS.filter(o => !objections.some(x => x.q === o.q));
  const transcript = sampleCall(d);

  const saveObjection = (i, value) => set("objections", objections.map((o, j) => (j === i ? value : o)));
  const removeObjection = i => set("objections", objections.filter((_, j) => j !== i));
  const toggleDay = n => set("callDays", d.callDays.includes(n) ? d.callDays.filter(x => x !== n) : [...d.callDays, n]);

  return (
    <main className="wrap">
      <section className="form">
        <div>
          <div className="eyebrow">Step {index} of {steps.length} · voice calls</div>
          <h1 className="h1">How should {agent} sound on calls?</h1>
          <p className="lede">Your product and audience answers already power the calls. Here you pick a voice, how calls open, and what {agent} says when people push back.</p>
        </div>

        <div className="card">
          <div className="lbl">Voice <small>Press play to hear each one</small></div>
          <VoicePicker d={d} set={set} />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label className="lbl sm" htmlFor="ob-lang">Call language</label>
            <select id="ob-lang" className="sel" value={d.callLanguage} onChange={e => set("callLanguage", e.target.value)}>
              {CALL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="card">
          <div className="lbl">How every call opens <span className="tag lock"><Icon name="lock" size={12} stroke={2.2} />First line always on</span></div>
          <div className="open">
            <div className="open-l"><Icon name="phone" size={16} stroke={2} /><span>&ldquo;Hi, is this Alex? This is {agent}, an AI assistant calling on behalf of {who} at {company}.&rdquo;</span></div>
            <label className="hint" htmlFor="ob-why" style={{ display: "block", padding: "12px 16px 0" }}>Then, in your words: why are you calling?</label>
            <textarea id="ob-why" className="ta" rows={2} maxLength={600} value={d.openingLine} placeholder={defaultOpeningLine(d)} onChange={e => set("openingLine", e.target.value)} />
          </div>
          <span className="hint">The first line is fixed so every call is upfront about being an AI. You can change everything after it.</span>
        </div>

        <div className="card">
          <div className="lbl">What counts as a good call?</div>
          <div className="goals">
            {CALL_GOALS.map(g => {
              const on = d.callGoal === g.id;
              return (
                <button type="button" key={g.id} className={`oc row ${g.custom ? "cu" : ""} ${on ? "on" : ""}`} aria-pressed={on} onClick={() => set("callGoal", g.id)}>
                  <span className="rd" aria-hidden="true" /><span><b>{g.label}</b><span className="d">{g.desc}</span></span>
                </button>
              );
            })}
          </div>
          {d.callGoal === "custom" && (
            <div className="cus">
              <label className="hint dk" htmlFor="ob-goal">What should {agent} get from the call?</label>
              <textarea id="ob-goal" className="ta sm" rows={2} maxLength={500} autoFocus value={d.customGoal} onChange={e => set("customGoal", e.target.value)}
                placeholder="e.g. Find out which tool they use today, then offer a free trial setup." />
            </div>
          )}
        </div>

        <div className="card">
          <div className="lbl">When people push back <small>Suggested for {(d.industry || "your industry").toLowerCase()}. Edit the answers.</small></div>
          <div className="objs">
            {objections.map((o, i) => (
              <Objection key={`${i}-${o.q}`} agent={agent} item={o} startEditing={i === newIndex}
                onSave={v => { saveObjection(i, v); setNewIndex(-1); }} onRemove={() => { removeObjection(i); setNewIndex(-1); }} />
            ))}
            <div className="obj">
              <div className="obj-q"><span>&ldquo;{DO_NOT_CALL.q}&rdquo;</span><span className="tag lock"><Icon name="lock" size={12} stroke={2.2} />Always on</span></div>
              <div className="obj-a"><b>{agent}</b><span>Apologises, ends the call, and never calls that number again.</span></div>
            </div>
          </div>
          <div className="acts">
            <button type="button" className="mini d" onClick={() => { setNewIndex(objections.length); set("objections", [...objections, { q: "", a: "" }]); }} disabled={objections.length >= 10}>
              <Icon name="plus" size={14} stroke={2.4} />Add an objection
            </button>
            {extra.length > 0 && objections.length < 10 && (
              <button type="button" className="mini" onClick={() => set("objections", [...objections, extra[0]])}><Icon name="sparkle" size={14} stroke={2.2} />Suggest more</button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="lbl">When {agent} calls <small>Always in each lead&apos;s local time</small></div>
          <div className="rf">
            <span className="hint dk" id="ob-days">Days</span>
            <div className="days" role="group" aria-labelledby="ob-days">
              {WEEKDAYS.map(w => <button type="button" key={w.n} className={d.callDays.includes(w.n) ? "on" : ""} aria-pressed={d.callDays.includes(w.n)} onClick={() => toggleDay(w.n)}>{w.label}</button>)}
            </div>
          </div>
          <div className="grid-rules">
            <div className="rf">
              <span className="hint dk">Tries per lead</span>
              <NumberStepper label="Tries" value={d.maxAttempts} min={1} max={6} onChange={v => set("maxAttempts", v)} />
              <span className="hint">Retries after no answer or voicemail, then stops.</span>
            </div>
            <div className="rf">
              <span className="hint dk">Calls per hour</span>
              <NumberStepper label="Calls" value={d.callsPerHour} min={1} max={30} onChange={v => set("callsPerHour", v)} />
              <span className="hint">Starting slow keeps your number&apos;s reputation healthy.</span>
            </div>
          </div>
          <span className="hint">Leads without a phone number are skipped for calls{hasEmail(d.channels) ? ". They still get your emails." : "."}</span>
        </div>

        <div className="card">
          <div className="lbl">Your own rules for calls</div>
          <textarea className="ta sm" rows={2} maxLength={2000} aria-label="Your own rules for calls" value={d.callRules} onChange={e => set("callRules", e.target.value)}
            placeholder={"Keep calls under 3 minutes.\nNever quote exact prices on the call."} />
          <RuleChips rules={CALL_RULES} text={d.callRules} onChange={v => set("callRules", v)} />
        </div>

        {footer}
      </section>

      <aside className="side">
        <div className="pv">
          <div className="pv-h">How a call could go<Live /></div>
          <div className="tr">
            {transcript.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}><small>{m.from === "n" ? agent : "Alex"}</small><Marked parts={m.text} /></div>
            ))}
          </div>
        </div>
        <div className="dark">
          <b>Hear it before real leads do</b>
          <p>On the next screen you can turn on practice calls, so {agent} runs through scenarios like a busy owner or a price question before it calls anyone real.</p>
        </div>
      </aside>
    </main>
  );
}
