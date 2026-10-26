"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import Icon from "../ui/Icon";
import {
  CADENCES, CALL_GOALS, CALL_LANGUAGES, HOOKS, MAX_EMAILS, VOICES, WEEKDAYS,
} from "../../lib/onboarding-data";
import { buildStylePayload, cadenceDays, followUpGaps, fromServer, objectionsFor } from "../../lib/onboarding-flow";
import { describeVoice, usePreviewPlayer, useVoices } from "../onboarding/VoicePicker";
import { isFreePlan, useOrg } from "../../lib/free-plan";

const hint = { fontSize: 12.5, color: "var(--faint)" };
const sub = { fontSize: 13, fontWeight: 800, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 6 };
const grid2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 };

function Select({ label, value, onChange, options, help }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        <select className="input" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {help && <span style={hint}>{help}</span>}
    </div>
  );
}

function Text({ label, value, onChange, help, placeholder, rows = 3, max = 2000 }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea className="input" rows={rows} maxLength={max} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ minHeight: rows * 26 + 24, resize: "vertical", lineHeight: 1.55 }} />
      {help && <span style={hint}>{help}</span>}
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, help }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        <input className="input" type="number" min={min} max={max} value={value}
          onChange={e => onChange(Math.min(max, Math.max(min, Math.round(Number(e.target.value) || min))))} />
      </div>
      {help && <span style={hint}>{help}</span>}
    </div>
  );
}

/** A Retell voice with a sample to play; falls back to a voice style. */
function VoiceSelect({ d, set }) {
  const { voices, loading, failed } = useVoices();
  const { playing, toggle } = usePreviewPlayer();
  if (loading) return <div className="field"><label>Voice</label><span style={hint}>Loading voices…</span></div>;
  if (failed || voices.length === 0) {
    return (
      <Select label="Voice" value={d.voice} onChange={v => set("voice", v)} options={VOICES.map(v => ({ value: v.id, label: `${v.name} · ${v.desc}` }))}
        help="Voice samples could not load. Our team matches the exact voice to this style." />
    );
  }
  const current = voices.find(v => v.id === d.voiceId);
  return (
    <div className="field">
      <label>Voice</label>
      <div className="row" style={{ gap: 8, alignItems: "center" }}>
        <div className="input-wrap" style={{ flex: 1, minWidth: 0 }}>
          <select className="input" value={d.voiceId} onChange={e => {
            const v = voices.find(x => x.id === e.target.value);
            set("voiceId", v ? v.id : ""); set("voiceName", v ? v.name : "");
          }}>
            {!current && <option value="">Choose a voice</option>}
            {voices.map(v => <option key={v.id} value={v.id}>{v.name} · {describeVoice(v)}</option>)}
          </select>
        </div>
        {current && (
          <button type="button" className="bt bt-g sm" onClick={() => toggle(current)} aria-label={playing === current.id ? `Stop ${current.name}` : `Play ${current.name}`}>
            <Icon name={playing === current.id ? "pause" : "play"} size={13} />{playing === current.id ? "Stop" : "Play"}
          </button>
        )}
      </div>
      <span style={hint}>Used on new voice campaigns. A voice set by our team for your account takes priority.</span>
    </div>
  );
}

/**
 * The email and call style chosen during onboarding, editable without
 * re-running it. Campaigns created from now on start from these answers.
 */
export default function OutreachStyle() {
  // The Free plan has no AI calling, so only the email style applies there.
  const free = isFreePlan(useOrg());
  const [d, setD] = useState(null);
  const [missing, setMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/onboarding").then(({ data }) => {
      const restored = fromServer(data);
      if (!restored || !data?.product_description) { setMissing(true); return; }
      // Settings edits a custom tone as optional extra wording, never as a
      // replacement for the Outreach tone picked above.
      setD({ ...restored, tone: restored.customTone ? "custom" : "consultative" });
    }).catch(() => setMissing(true));
  }, []);

  const set = (key, value) => { setD(prev => ({ ...prev, [key]: value })); setSaved(false); setError(""); };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put("/onboarding/style", buildStylePayload(free ? { ...d, channels: "email" } : d));
      const restored = fromServer(data);
      if (restored) setD({ ...restored, tone: restored.customTone ? "custom" : "consultative" });
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Could not save your outreach style.");
    } finally {
      setSaving(false);
    }
  };

  // Enter in a single-line field must not submit the surrounding settings form.
  const stopEnter = e => { if (e.key === "Enter" && e.target.tagName === "INPUT") e.preventDefault(); };

  return (
    <section id="settings-style" className="card sec" style={{ scrollMarginTop: 16 }} onKeyDown={stopEnter}>
      <div className="sec-h">
        <div>
          <b>Outreach style</b>
          <small>How emails and calls sound. Campaigns you create from now on start from these answers.</small>
        </div>
      </div>

      {missing && (
        <p style={{ fontSize: 13.5, color: "var(--muted)" }}>Finish <Link href="/onboarding" style={{ color: "var(--g-700)", fontWeight: 800 }}>onboarding</Link> first. Your email and call style are set up there.</p>
      )}
      {!missing && !d && <p style={{ fontSize: 13.5, color: "var(--muted)" }}>Loading…</p>}

      {d && (
        <div className="col" style={{ gap: 18 }}>
          {free ? (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>The Free plan includes email campaigns. <Link href="/billing" style={{ color: "var(--g-700)", fontWeight: 800 }}>Upgrade</Link> to add AI calling and set up how calls sound.</p>
          ) : (
            <Select label="Channels you use" value={d.channels} onChange={v => set("channels", v)}
              options={[{ value: "email", label: "Email" }, { value: "voice", label: "AI voice calls" }, { value: "both", label: "Email and voice" }]}
              help="New campaigns start on this channel. Voice-only workspaces start new campaigns as voice." />
          )}

          <div style={sub}>Email style</div>
          <div style={grid2}>
            <Select label="How the first email opens" value={d.hook} onChange={v => set("hook", v)}
              options={HOOKS.map(h => ({ value: h.id, label: h.custom ? "Custom (in your words)" : h.label }))}
              help={HOOKS.find(h => h.id === d.hook)?.desc} />
            <Select label="Follow-ups" value={d.cadence} onChange={v => set("cadence", v)}
              options={CADENCES.map(c => ({ value: c.id, label: c.custom ? "Custom" : `${c.label} · ${cadenceDays(c.gaps).map(n => `Day ${n}`).join(", ")}` }))}
              help="Follow-ups stop the moment someone replies." />
          </div>
          {d.hook === "custom" && (
            <Text label="How the first line should open" rows={2} max={500} value={d.customHook} onChange={v => set("customHook", v)}
              placeholder="e.g. Mention their city and a season coming up, then connect it to their busiest days." />
          )}
          {d.cadence === "custom" && (
            <div className="field">
              <label>Your follow-up plan · up to {MAX_EMAILS} emails</label>
              <div className="col" style={{ gap: 8 }}>
                {d.customGaps.map((gap, i) => (
                  <div key={i} className="row" style={{ gap: 10, alignItems: "center", flexWrap: "wrap", fontSize: 13.5, fontWeight: 700 }}>
                    <span style={{ minWidth: 150 }}>Email {i + 2}, after</span>
                    <input className="input" type="number" min={1} max={30} value={gap} style={{ width: 80 }} aria-label={`Days before email ${i + 2}`}
                      onChange={e => set("customGaps", d.customGaps.map((g, j) => (j === i ? Math.min(30, Math.max(1, Math.round(Number(e.target.value) || 1))) : g)))} />
                    <span>days</span>
                    <button type="button" className="bt bt-g sm" disabled={d.customGaps.length <= 1} onClick={() => set("customGaps", d.customGaps.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                ))}
                {d.customGaps.length < MAX_EMAILS - 1 && (
                  <button type="button" className="bt bt-g sm" style={{ alignSelf: "flex-start" }} onClick={() => set("customGaps", [...d.customGaps, 3])}><Icon name="plus" size={14} /> Add a follow-up</button>
                )}
              </div>
              <span style={hint}>Sends on {cadenceDays(followUpGaps(d)).map(n => `day ${n}`).join(", ")}.</span>
            </div>
          )}
          <Text label="Your tone in your own words (optional)" rows={2} max={500} value={d.customTone} onChange={v => set("customTone", v)}
            placeholder="e.g. Like a fellow founder talking to another. Plain, practical, no sales jargon."
            help="Added on top of the Outreach tone above." />
          <Text label="Your own rules for emails" value={d.emailRules} onChange={v => set("emailRules", v)}
            placeholder={"Keep every email under 90 words.\nNever mention pricing in the first email."} help="One rule per line. Plain sentences work best." />

          {!free && <>
          <div style={sub}>Call style</div>
          <div style={grid2}>
            <VoiceSelect d={d} set={set} />
            <Select label="Call language" value={d.callLanguage} onChange={v => set("callLanguage", v)} options={CALL_LANGUAGES.map(l => ({ value: l, label: l }))} />
          </div>
          <Text label="Why you are calling" rows={2} max={600} value={d.openingLine} onChange={v => set("openingLine", v)}
            placeholder="We help teams like yours ... Do you have two minutes?" help="Said right after the AI introduction, which is always on." />
          <Select label="What counts as a good call" value={d.callGoal} onChange={v => set("callGoal", v)}
            options={CALL_GOALS.map(g => ({ value: g.id, label: g.custom ? "Custom (in your words)" : g.label }))} help={CALL_GOALS.find(g => g.id === d.callGoal)?.desc} />
          {d.callGoal === "custom" && (
            <Text label="What the call should achieve" rows={2} max={500} value={d.customGoal} onChange={v => set("customGoal", v)} />
          )}

          <div className="field">
            <label>When people push back</label>
            <div className="col" style={{ gap: 10 }}>
              {objectionsFor(d).map((o, i) => (
                <div key={i} className="col" style={{ gap: 6, padding: 12, border: "1px solid var(--line)", borderRadius: 10 }}>
                  <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    <input className="input" value={o.q} maxLength={200} placeholder="What the lead says" aria-label="What the lead says"
                      onChange={e => set("objections", objectionsFor(d).map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
                    <button type="button" className="bt bt-g sm" onClick={() => set("objections", objectionsFor(d).filter((_, j) => j !== i))}>Remove</button>
                  </div>
                  <textarea className="input" rows={2} maxLength={600} value={o.a} placeholder="How your agent answers" aria-label="How your agent answers"
                    style={{ minHeight: 64, resize: "vertical", lineHeight: 1.5 }}
                    onChange={e => set("objections", objectionsFor(d).map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} />
                </div>
              ))}
              {objectionsFor(d).length < 10 && (
                <button type="button" className="bt bt-g sm" style={{ alignSelf: "flex-start" }} onClick={() => set("objections", [...objectionsFor(d), { q: "", a: "" }])}><Icon name="plus" size={14} /> Add an objection</button>
              )}
            </div>
            <span style={hint}>&ldquo;Don&apos;t call me again&rdquo; is always honoured: the agent apologises, ends the call and never calls that number again.</span>
          </div>

          <div className="field">
            <label>Calling days</label>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {WEEKDAYS.map(w => {
                const on = d.callDays.includes(w.n);
                return (
                  <button type="button" key={w.n} aria-pressed={on} onClick={() => set("callDays", on ? d.callDays.filter(x => x !== w.n) : [...d.callDays, w.n])}
                    style={{ width: 48, height: 38, borderRadius: 10, fontSize: 12.5, fontWeight: 800, border: `1.5px solid ${on ? "var(--g-400)" : "var(--line)"}`, background: on ? "var(--g-50)" : "#fff", color: on ? "var(--g-800)" : "var(--ink-2)" }}>
                    {w.label}
                  </button>
                );
              })}
            </div>
            <span style={hint}>Always in each lead&apos;s local time.</span>
          </div>
          <div style={grid2}>
            <NumberField label="Tries per lead" value={d.maxAttempts} min={1} max={6} onChange={v => set("maxAttempts", v)} help="Retries after no answer or voicemail, then stops." />
            <NumberField label="Calls per hour" value={d.callsPerHour} min={1} max={30} onChange={v => set("callsPerHour", v)} help="Starting slow keeps your number's reputation healthy." />
          </div>
          <Text label="Your own rules for calls" rows={2} value={d.callRules} onChange={v => set("callRules", v)} placeholder={"Keep calls under 3 minutes.\nNever quote exact prices on the call."} />
          <label className="row" style={{ gap: 10, alignItems: "center", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            <input type="checkbox" checked={d.practiceCallsFirst} onChange={e => set("practiceCallsFirst", e.target.checked)} style={{ accentColor: "var(--g-500)", width: 18, height: 18 }} />
            Run practice calls first on new voice campaigns
          </label>
          </>}

          {error && <div role="alert" style={{ padding: "10px 14px", borderRadius: 10, background: "var(--stop-50)", color: "var(--stop)", fontSize: 13, fontWeight: 700 }}>{error}</div>}
          <div className="row" style={{ gap: 12, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
            {saved && <span style={{ fontSize: 13, fontWeight: 800, color: "var(--g-700)" }}>Saved. New campaigns use this style.</span>}
            <button type="button" className="bt bt-p" onClick={save} disabled={saving || d.callDays.length === 0}>
              <Icon name="check" size={15} color="#06231a" />{saving ? "Saving..." : "Save outreach style"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
