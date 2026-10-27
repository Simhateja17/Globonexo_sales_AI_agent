"use client";
import React, { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import { FREE_PLAN, MAX_ANNUAL_SAVINGS_PERCENT, MOST_POPULAR_PLAN_ID, PLAN_CONFIG } from "../../lib/plans";
import { canUseFree, freeUnavailableReason, money, planCard, readFreeEligibility } from "../../lib/plan-choice";

function session() {
  try { return typeof window === "undefined" ? null : window.sessionStorage; } catch { return null; }
}

/**
 * The first onboarding step: pick Free or a paid plan. Paid plans are not
 * charged here; checkout opens from the Launch button at the end of setup.
 */
export default function PlanStep({ organization, choice, onChoose }) {
  const [annual, setAnnual] = useState(choice ? choice.billingPeriod === "annual" : true);
  const [selected, setSelected] = useState(choice?.planId || MOST_POPULAR_PLAN_ID);
  const [eligibility, setEligibility] = useState(null);
  useEffect(() => { setEligibility(readFreeEligibility(session())); }, []);

  const freeOk = canUseFree(organization);
  useEffect(() => {
    if (organization && !freeOk && selected === FREE_PLAN.id) setSelected(MOST_POPULAR_PLAN_ID);
  }, [organization, freeOk, selected]);

  const cards = [planCard(FREE_PLAN, annual), ...PLAN_CONFIG.map(plan => planCard(plan, annual))];
  const current = cards.find(c => c.id === selected) || cards[2];
  const isFree = current.id === FREE_PLAN.id;
  const plan = PLAN_CONFIG.find(p => p.id === current.id);
  const choose = planId => onChoose({ planId, billingPeriod: annual ? "annual" : "monthly" });

  return (
    <main className="pp">
        <div className="pp-head">
          <div>
            <div className="eyebrow">Step 1 · choose a plan</div>
            <h1 className="h1 xl">Pick the plan that fits how you sell</h1>
            <p className="lede" style={{ fontSize: 16 }}>Start free with email, or pick a paid plan to add verified lead search and AI calls. You can change plans any time from Billing.</p>
          </div>
          <div className="pp-toggle" role="group" aria-label="Billing period">
            <button type="button" aria-pressed={!annual} className={!annual ? "on" : ""} onClick={() => setAnnual(false)}>Monthly</button>
            <button type="button" aria-pressed={annual} className={annual ? "on" : ""} onClick={() => setAnnual(true)}>
              Yearly<span className="tag-d">Save up to {MAX_ANNUAL_SAVINGS_PERCENT}%</span>
            </button>
          </div>
        </div>

        <div className="pp-grid" role="radiogroup" aria-label="Plan">
          {cards.map(card => {
            const on = card.id === selected;
            const locked = card.id === FREE_PLAN.id && !freeOk;
            return (
              <div key={card.id} role="radio" aria-checked={on} aria-disabled={locked} tabIndex={locked ? -1 : 0}
                className={`pp-card ${on ? "on" : ""} ${locked ? "lock" : ""}`}
                onClick={() => !locked && setSelected(card.id)}
                onKeyDown={e => { if (!locked && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setSelected(card.id); } }}>
                {card.id === MOST_POPULAR_PLAN_ID && <span className="pp-pop">Most popular</span>}
                <div className="pp-top"><b className="dsp">{card.name}</b><span className="rdo" aria-hidden="true" /></div>
                <p className="pp-desc">{card.desc}</p>
                <div className="pp-price"><b>{card.price}</b> {card.per}</div>
                <div className="pp-billed">{locked ? <span className="pp-why"><Icon name="lock" size={12} stroke={2.2} />{freeUnavailableReason(eligibility)}</span> : card.billed}</div>
                <div className="pp-stats">
                  {card.stats.map(([label, value]) => <div key={label}><small>{label}</small><b>{value}</b></div>)}
                </div>
                <ul className="pp-feats">
                  {card.feats.map(f => <li key={f}><Icon name="check" size={14} stroke={2.6} color="#00a86b" />{f}</li>)}
                  {card.missing.map(f => <li key={f} className="no"><span aria-hidden="true">–</span>{f}<span className="sr"> (not included)</span></li>)}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="pp-bar">
          <div className="pp-sum">
            <b>{current.name} · {isFree ? "$0, no card needed" : `${current.price}/month, billed ${annual ? "yearly" : "monthly"}`}</b>
            <span>{isFree
              ? "Set up and launch your first email campaign now. Upgrade from Billing whenever you want calls or lead search."
              : "You will pay after setup, right before your first launch. Nothing is charged now."}</span>
          </div>
          <div className="pp-acts">
            {!isFree && <span className="pp-note"><Icon name="lock" size={14} stroke={2} />Secure checkout with Razorpay</span>}
            {!isFree && <span className="pp-note">Cancel any time</span>}
            {!isFree && freeOk && <button type="button" className="pp-link" onClick={() => choose(FREE_PLAN.id)}>Start on Free instead</button>}
            <button type="button" className="bt bt-p bt-xl" onClick={() => choose(current.id)}>
              Continue with {current.name}<Icon name="arrow" size={18} stroke={2.2} />
            </button>
          </div>
          {!isFree && plan && annual && <span className="pp-fine">{money(plan.annualTotal)} charged once a year at your first launch. Switch to monthly any time before then.</span>}
        </div>
      </main>
  );
}
