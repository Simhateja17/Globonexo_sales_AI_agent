"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../../components/ui/Icon";
import Spinner from "../../../components/ui/Spinner";
import { useSetup } from "../../../providers/SetupProvider";
import {
  canSkipStep,
  groupSteps,
  nextIncompleteStep,
  progressSummary,
  stepBadge,
  stepMeta,
} from "../../../lib/setup-model";

function StepRow({ step, number, isNext, onSkip, onReset, onOpenCopilot }) {
  const router = useRouter();
  const meta = stepMeta(step.id);
  const badge = stepBadge(step);
  const [busy, setBusy] = useState(false);
  const done = step.status === "complete";
  const unavailable = step.status === "unavailable";

  const run = async action => {
    setBusy(true);
    try {
      await action(step.id);
    } finally {
      setBusy(false);
    }
  };

  const open = () => {
    if (step.id === "campaign") {
      onOpenCopilot();
      return;
    }
    router.push(meta.href);
  };

  return (
    <div className={`sr ${done ? "" : isNext ? "next" : "todo"}`}>
      <span className="smk" aria-hidden="true">
        {done ? <Icon name="check" size={14} color="#fff" stroke={3} /> : number}
      </span>
      <div className="st">
        <b>{meta.title}</b>
        <small>{meta.summary}</small>
      </div>
      <span className={`sv ${!done && !unavailable && badge.tone !== "done" ? "hl" : ""}`}>{step.detail || badge.label}</span>
      {busy ? (
        <Spinner size={16} />
      ) : (
        <div className="acts">
          {done ? (
            <button type="button" className="bt bt-g sm" onClick={open}>Edit</button>
          ) : !unavailable ? (
            <button type="button" className={`bt ${isNext ? "bt-p" : "bt-g"} sm`} onClick={open}>{meta.cta}</button>
          ) : null}
          {canSkipStep(step) ? (
            <button type="button" className="lnk" onClick={() => run(onSkip)}>Skip</button>
          ) : null}
          {step.skipped ? (
            <button type="button" className="lnk" onClick={() => run(onReset)}>Undo skip</button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function SetupPage() {
  const { loading, error, steps, refresh, skipStep, resetStep, openCopilot, startTour } = useSetup();

  const summary = progressSummary(steps);
  const next = nextIncompleteStep(steps);
  const nextMeta = next ? stepMeta(next.id) : null;
  let counter = 0;

  return (
    <main className="gx" data-tour="setup-checklist">
      <div className="ph">
        <div>
          <h1>Get set up</h1>
          <p>Everything your agent needs to find, write to, call and book your buyers. Each step reflects your real account.</p>
        </div>
        <div className="acts">
          <button type="button" className="bt bt-g" onClick={() => startTour({ restart: true })}>
            <Icon name="play" size={14} /> Replay tour
          </button>
          <button type="button" className="bt bt-p" onClick={openCopilot}>
            <Icon name="spark" size={15} color="#06231a" /> Set up with AI
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card empty"><Spinner size={20} /></div>
      ) : error ? (
        <div className="note" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ flex: 1 }}>Setup status unavailable. {error}</span>
          <button type="button" className="bt bt-g sm" onClick={() => refresh()}>Retry</button>
        </div>
      ) : (
        <>
          <div className="card su-top">
            <div className="ring">
              <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#eef3f0" strokeWidth="9" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#00a86b" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${((summary.percent / 100) * 251.3).toFixed(1)} 251.3`} transform="rotate(-90 48 48)" />
              </svg>
              <b>{summary.percent}%</b>
            </div>
            <div>
              <b>{summary.resolved} of {summary.total} done</b>
              <p>
                {summary.allDone || !nextMeta
                  ? "Everything is configured. Your campaigns have what they need to run."
                  : `Next: ${nextMeta.title}. Optional steps can be skipped and finished later.`}
                {summary.completed !== summary.resolved ? ` ${summary.resolved - summary.completed} skipped.` : ""}
              </p>
              <div className="bar"><u style={{ width: `${summary.percent}%` }} /></div>
            </div>
          </div>

          <div className="su-grid">
            <div className="col" style={{ gap: 16 }}>
              {groupSteps(steps).map(section => {
                const doneCount = section.steps.filter(step => step.status === "complete").length;
                return (
                  <section key={section.group} className="card" style={{ overflow: "hidden" }}>
                    <div className="sg-h">
                      <b>{section.group}</b>
                      <span>{doneCount} of {section.steps.length} done</span>
                    </div>
                    {section.steps.map(step => {
                      counter += 1;
                      return (
                        <StepRow
                          key={step.id}
                          step={step}
                          number={counter}
                          isNext={next?.id === step.id}
                          onSkip={skipStep}
                          onReset={resetStep}
                          onOpenCopilot={openCopilot}
                        />
                      );
                    })}
                  </section>
                );
              })}
            </div>

            <div className="col" style={{ gap: 16 }}>
              <div className="card cop">
                <b><Icon name="spark" size={18} /> Set up with AI</b>
                <p>Answer a few questions in plain English and the copilot fills in your profile, ideal customer and first campaign for you.</p>
                <div className="q">“We sell outbound tooling to Series A SaaS teams in the US.”</div>
                <div className="q">“Keep the tone consultative, 3 emails over 8 days.”</div>
                <button type="button" className="bt bt-p" onClick={openCopilot}>
                  <Icon name="spark" size={15} color="#06231a" /> Open Setup Copilot
                </button>
              </div>
              <div className="card tips">
                <b>Good to know</b>
                <div className="tip"><Icon name="shield" size={15} /> Nothing sends or dials until you launch a campaign.</div>
                <div className="tip"><Icon name="users" size={15} /> Leads are checked for fit before credits are spent.</div>
                <div className="tip"><Icon name="phone" size={15} /> Voice calling is optional and can be added later.</div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
