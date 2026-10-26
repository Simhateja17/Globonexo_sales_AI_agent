"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Aurora from "../../components/ui/Aurora";
import Icon from "../../components/ui/Icon";
import { FREE_PLAN } from "../../lib/free-plan";

export default function CelebratePage() {
  const router = useRouter();
  // Onboarding saves what it started. A Free workspace brings its own leads,
  // so nothing is searched for and the next step is importing them.
  const [ownLeads, setOwnLeads] = useState(false);
  const [campaignId, setCampaignId] = useState("");
  useEffect(() => {
    try {
      const preparation = JSON.parse(window.sessionStorage.getItem("gnx_onboarding_preparation") || "{}");
      setOwnLeads(preparation?.apollo?.status === "own_leads");
      setCampaignId(new URLSearchParams(window.location.search).get("campaignId") || "");
    } catch {}
  }, []);

  return (
    <div className="screen celebrate-screen">
      <Aurora />
      <div className="celebrate-shell">
        <section className="celebrate-copy" aria-labelledby="celebrate-title">
          <div className="celebrate-mark" aria-hidden="true">
            <Icon name="bolt" size={42} color="#06231a" stroke={2.25} />
          </div>
          <h1 id="celebrate-title" className="display">Your sales workspace is ready.</h1>
          <p>
            {ownLeads
              ? "Your onboarding details are saved and your first campaign draft is created. On the Free plan you bring your own leads: upload a CSV or add them by hand, and your agent writes their emails for you to approve."
              : "Your onboarding details are saved and your first campaign draft is created. GNX is finding up to 10 verified leads in the background and writing their emails, while you explore the workspace."}
          </p>

          <div className="celebrate-actions">
            {ownLeads ? (
              <button className="btn btn-primary btn-lg" type="button" onClick={() => router.push(`/prospects?tab=csv${campaignId ? `&campaignId=${encodeURIComponent(campaignId)}` : ""}`)}>
                Add your leads <Icon name="arrow" size={18} color="#06231a" />
              </button>
            ) : null}
            <button className={`btn ${ownLeads ? "btn-ghost" : "btn-primary"} btn-lg`} type="button" onClick={() => router.push("/dashboard")}>
              Open dashboard <Icon name="arrow" size={18} color={ownLeads ? undefined : "#06231a"} />
            </button>
            <span className="celebrate-auto">
              {ownLeads ? "You can review and launch the campaign once your leads are in." : "You can review and launch the campaign when the audience is ready."}
            </span>
          </div>
        </section>

        <aside className="celebrate-card" aria-label="Onboarding completion">
          <div className="celebrate-card-top">
            <div>
              <span>Setup complete</span>
              <strong>2/2 complete</strong>
            </div>
            <span className="celebrate-status"><span /> Ready</span>
          </div>
          <div className="celebrate-progress" aria-label="100% complete">
            <span style={{ width: "100%" }} />
          </div>
          <div className="celebrate-list">
            {[
              "Onboarding context saved",
              "First campaign draft created",
            ].map(label => (
              <div key={label} className="celebrate-item is-done">
                <span className="celebrate-check">
                  <Icon name="check" size={14} color="#06231a" stroke={3} />
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="celebrate-metrics">
            <div><strong>1</strong><span>Draft campaign</span></div>
            {ownLeads
              ? <div><strong>{FREE_PLAN.maxLeads}</strong><span>Leads you can add</span></div>
              : <div><strong>10</strong><span>Leads preparing</span></div>}
            <div><strong>Now</strong><span>Workspace ready</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
