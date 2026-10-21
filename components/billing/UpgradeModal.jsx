"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "../ui/Icon";
import { freeComparisonRows, upgradePlan } from "../../lib/free-plan";

export default function UpgradeModal({ title, body, onClose }) {
  const router = useRouter();
  const plan = upgradePlan();

  useEffect(() => {
    const onKey = event => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ovl" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="mdl" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
        <div className="mdl-h">
          <span className="li"><Icon name="star" size={20} /></span>
          <div style={{ flex: 1 }}>
            <b id="upgrade-title">{title}</b>
            <p>{body}</p>
          </div>
          <button type="button" className="ibt" aria-label="Close" onClick={onClose}><Icon name="close" size={14} /></button>
        </div>
        <div className="cmpt">
          <div><span>What you get</span><span>Free</span><span>{plan.name}</span></div>
          {freeComparisonRows(plan).map(([label, free, paid]) => (
            <div key={label}><span>{label}</span>{free === "No" ? <em>No</em> : <b>{free}</b>}<b>{paid}</b></div>
          ))}
        </div>
        <div className="mdl-f" style={{ flexWrap: "wrap" }}>
          <small>Takes effect straight away. Cancel any time.</small>
          <button type="button" className="bt bt-g" onClick={onClose}>Not now</button>
          <button type="button" className="bt bt-g" onClick={() => router.push("/pricing")}>Compare plans</button>
          <button type="button" className="bt bt-p" onClick={() => router.push("/billing")}>
            <Icon name="star" size={14} color="#06231a" /> Upgrade · ${plan.monthly}/mo
          </button>
        </div>
      </div>
    </div>
  );
}
