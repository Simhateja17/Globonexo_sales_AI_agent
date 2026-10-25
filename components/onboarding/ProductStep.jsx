"use client";
import React, { useState } from "react";
import Icon from "../ui/Icon";
import { Live, Marked } from "./ui";
import api from "../../lib/api";
import { suggestAudience, suggestProductText } from "../../lib/onboarding-suggestions";
import {
  OUTCOME_MIN, PRODUCT_MIN, allPains, hasEmail, hasVoice, productStrength, sampleEmail, stepsFor, textLength,
} from "../../lib/onboarding-flow";

function sentence(text) {
  const clean = String(text || "").trim();
  return clean ? clean.replace(/[.!?]?$/, m => m || ".") : "";
}

const REWRITES = [
  { style: "shorter", label: "Shorter" },
  { style: "specific", label: "More specific" },
  { style: "number", label: "Add a number" },
  { style: "friendlier", label: "Friendlier" },
];

function useRewrite(d) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const run = async (field, style, text) => {
    setBusy(`${field}:${style}`);
    setError("");
    try {
      const { data } = await api.post("/onboarding/rewrite", {
        field, style, text,
        company: d.company.trim(), industry: d.industry.trim(), productDescription: d.productDescription.trim(),
      }, { timeout: 30000 });
      return data?.text || "";
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Nexo could not write a suggestion right now. Try again, or edit it yourself.");
      return "";
    } finally {
      setBusy("");
    }
  };
  return { busy, error, run };
}

export default function ProductStep({ d, set, footer }) {
  const agent = d.agentName.trim() || "Nexo";
  const company = d.company.trim() || "your company";
  const industry = (d.industry || "your industry").toLowerCase();
  const steps = stepsFor(d.channels);
  const productLen = textLength(d.productDescription);
  const outcomeLen = textLength(d.valueProp);
  const weak = productLen < PRODUCT_MIN;
  const draft = suggestProductText(d.industry, d.company);
  const [suggestion, setSuggestion] = useState(draft.productDescription);
  const [dismissed, setDismissed] = useState(false);
  const [ownPain, setOwnPain] = useState("");
  const [addingPain, setAddingPain] = useState(false);
  const { busy, error, run } = useRewrite(d);
  const strength = productStrength(d.productDescription);
  const painOptions = Array.from(new Set([...suggestAudience(d.industry).painChips, ...d.customPains]));
  const picked = allPains(d);
  const email = sampleEmail(d);
  const outcomeIsDraft = d.valueProp.trim() === draft.valueProp;
  const showSuggestion = !dismissed && (weak || busy === "product:another") && suggestion && suggestion !== d.productDescription;

  const togglePain = p => {
    if (d.customPains.includes(p) && !d.pains.includes(p)) set("customPains", d.customPains.filter(x => x !== p));
    else set("pains", d.pains.includes(p) ? d.pains.filter(x => x !== p) : [...d.pains, p]);
  };
  const addOwnPain = () => {
    const p = ownPain.trim().slice(0, 80);
    if (p && !picked.includes(p)) set("customPains", [...d.customPains, p]);
    setOwnPain("");
    setAddingPain(false);
  };
  const tryAnother = async () => {
    const text = await run("product", productLen ? "expand" : "another", d.productDescription.trim() || suggestion);
    if (text) setSuggestion(text);
  };
  const rewriteOutcome = async style => {
    const text = await run("outcome", style, d.valueProp);
    if (text) set("valueProp", text);
  };

  const call = hasVoice(d.channels);
  const mailOn = hasEmail(d.channels);
  const productPart = { text: sentence(d.productDescription) || "…", mark: true, weak };
  const pain1 = (picked[0] || "").toLowerCase();

  return (
    <main className="wrap">
      <section className="form">
        <div>
          <div className="eyebrow">Step 2 of {steps.length} · used for {mailOn && call ? "emails and calls" : mailOn ? "emails" : "calls"}</div>
          <h1 className="h1">What does {company} sell?</h1>
          <p className="lede">We started you with drafts written for {industry}. Edit anything. Each answer shows up in the {mailOn && call ? "email and call previews" : mailOn ? "email preview" : "call preview"} on the right, so you can see why it matters.</p>
        </div>

        <div className="card">
          <label className="fld" htmlFor="ob-product">
            <span className="lbl">What does {company} do? <small>One or two sentences</small></span>
            <textarea id="ob-product" className={`ta ${weak && productLen > 0 ? "warn" : weak ? "" : "ok"}`} rows={2} maxLength={4000}
              value={d.productDescription} onChange={e => set("productDescription", e.target.value)} aria-describedby="ob-product-msg"
              placeholder={`e.g. ${draft.productDescription}`} />
          </label>
          <div className="meta" id="ob-product-msg">
            {weak
              ? <><span className="wm"><Icon name="alertCircle" size={16} stroke={2} style={{ flex: "none", marginTop: 2 }} />Add who it&apos;s for and what it handles, so {mailOn ? "emails" : "calls"} can be specific.</span><span className="cnt">{productLen} of {PRODUCT_MIN} characters minimum</span></>
              : <><span className="hint">Say who it is for and what it handles.</span><span className="cnt ok">Looks good</span></>}
          </div>
          {showSuggestion && (
            <div className="sug">
              <div className="sug-h"><Icon name="sparkle" size={14} stroke={2.2} />{agent} can expand this from your answers so far</div>
              <p>{suggestion} <span className="hint">Check the details are right before using it.</span></p>
              <div className="acts">
                <button type="button" className="mini p" onClick={() => set("productDescription", suggestion)}>Use this</button>
                <button type="button" className="mini" onClick={tryAnother} disabled={!!busy}>{busy === "product:another" || busy === "product:expand" ? "Writing…" : "Try another"}</button>
                <button type="button" className="mini" onClick={() => setDismissed(true)}>Keep mine</button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <label className="fld" htmlFor="ob-outcome">
            <span className="lbl">What changes for customers after they switch? {outcomeIsDraft && <span className="tag">Draft for {industry}</span>}</span>
            <textarea id="ob-outcome" className={`ta ${outcomeLen >= OUTCOME_MIN ? "ok" : ""}`} rows={3} maxLength={2000}
              value={d.valueProp} onChange={e => set("valueProp", e.target.value)} placeholder="e.g. Teams book more meetings and spend less time on manual follow-up." />
          </label>
          <div className="meta">
            <span className="hint">Results beat features. A number makes it stronger.</span>
            {outcomeLen >= OUTCOME_MIN ? <span className="cnt ok">Looks good</span> : <span className="cnt">{outcomeLen} of {OUTCOME_MIN} characters minimum</span>}
          </div>
          <div className="acts">
            <span className="hint b">Rewrite:</span>
            {REWRITES.map(r => (
              <button type="button" key={r.style} className="mini" disabled={!!busy || outcomeLen === 0} onClick={() => rewriteOutcome(r.style)}>
                {busy === `outcome:${r.style}` ? "Writing…" : r.label}
              </button>
            ))}
          </div>
          {error && <span className="wm" role="alert" style={{ fontSize: 12.5, fontWeight: 700 }}><Icon name="alertCircle" size={16} stroke={2} style={{ flex: "none", marginTop: 2 }} />{error}</span>}
        </div>

        <div className="card">
          <div className="fld">
            <span className="lbl" id="pains-label">Which problems should {mailOn ? "emails" : "calls"} bring up? <small>Pick 2 to 4. Suggested for {industry}.</small></span>
            <div className="chips" role="group" aria-labelledby="pains-label">
              {painOptions.map(p => {
                const on = picked.includes(p);
                return <button type="button" key={p} className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={() => togglePain(p)}>{p}</button>;
              })}
              {!addingPain && <button type="button" className="chip more" onClick={() => setAddingPain(true)}><Icon name="plus" size={14} stroke={2.4} />Write your own</button>}
            </div>
            {addingPain && (
              <div className="addown">
                <span className="in"><input autoFocus value={ownPain} maxLength={80} placeholder="e.g. Customers waiting on hold" aria-label="Write your own problem"
                  onChange={e => setOwnPain(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); addOwnPain(); } if (e.key === "Escape") setAddingPain(false); }} /></span>
                <button type="button" className="mini p" onClick={addOwnPain}>Add</button>
                <button type="button" className="mini" onClick={() => { setAddingPain(false); setOwnPain(""); }}>Cancel</button>
              </div>
            )}
            {picked.length > 4 && <span className="hint">More than 4 can make emails feel unfocused. Nexo uses the first ones most.</span>}
          </div>
        </div>

        {footer}
      </section>

      <aside className="side">
        {mailOn && (
          <div className="pv">
            <div className="pv-h">Your first email, as {agent} would write it<Live /></div>
            <div className="mail-meta"><span>To: <b>{email.to}</b></span><span>Subject: <b>{email.subject}</b></span></div>
            <div className="mail">
              <p>{email.greeting}</p>
              <p>Teams like yours often hit {picked[0] ? <span className="mk">{picked[0].toLowerCase()}</span> : "a few familiar problems"}{picked[1] && <> and <span className="mk">{picked[1].toLowerCase()}</span></>}.</p>
              <p><Marked parts={[productPart]} /> {d.valueProp.trim() ? <span className="mk">{sentence(d.valueProp)}</span> : null}</p>
              <p>Worth a 15-minute look this week?</p>
              <p>{d.firstName.trim() || "You"}</p>
            </div>
          </div>
        )}
        {call && (
          <div className="pv">
            <div className="pv-h">On a call, {agent} would say<Live /></div>
            <div className="mail" style={{ paddingBottom: 8 }}>
              <p>&ldquo;…<Marked parts={[productPart]} />{pain1 && <> Is <span className="mk">{pain1}</span> something you deal with?</>}&rdquo;</p>
            </div>
          </div>
        )}
        <div className="str">
          <div className="str-top">How specific {agent} can be<span className={strength.level === 3 ? "ok" : ""}>{strength.label}</span></div>
          <div className="segs" aria-hidden="true">{[1, 2, 3].map(n => <i key={n} className={n <= strength.level ? (strength.level === 3 ? "g" : "f") : ""} />)}</div>
          <p>{weak && productLen > 0 ? <>&ldquo;{d.productDescription.trim()}&rdquo; reads as generic. </> : null}{strength.note}</p>
        </div>
      </aside>
    </main>
  );
}
