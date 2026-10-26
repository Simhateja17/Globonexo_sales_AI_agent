"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import Avatar from "../../../components/ui/Avatar";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import api from "../../../lib/api";
import { leadPhoto } from "../../../lib/lead-photo";
import { isValidEmail } from "../../../lib/validation";

const STAGES = [
  { id: "new", label: "New leads", tint: "#9aa8a0" },
  { id: "queued", label: "Queued", tint: "#7c8bf0" },
  { id: "contacted", label: "Contacted", tint: "#15c4c0" },
  { id: "engaged", label: "Engaged", tint: "#00a86a" },
  { id: "meeting_booked", label: "Meeting set", tint: "#00c27a" },
  { id: "not_interested", label: "Not interested", tint: "#f59e0b" },
];

function leadName(lead) {
  return lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unknown";
}

const SOURCE_LABELS = { apollo: "Lead database", csv: "CSV", manual: "Manual" };

function LeadCard({ lead }) {
  const router = useRouter();
  const name = leadName(lead);
  const score = lead.score ?? 0;
  const isHot = score >= 80 || lead.status === "engaged";
  const email = isValidEmail(lead.email || "") ? lead.email : "";

  return (
    <article className="pc">
      {isHot ? <span className="hot"><Icon name="flame" size={11} /> Hot</span> : null}
      <div className="who">
        <Avatar name={name} src={leadPhoto(lead) || undefined} size={32} />
        <div>
          <b className="ellip" style={{ display: "block", paddingRight: isHot ? 44 : 0 }}>{name}</b>
          <small className="ellip">{lead.company || "No company"}</small>
        </div>
      </div>
      <div className="pc-s">
        <span className={isHot ? "hi" : ""}>
          {isHot ? <><Icon name="flame" size={11} /> High intent</> : SOURCE_LABELS[lead.source] || lead.source || "Manual"}
        </span>
        <b>{score}</b>
      </div>
      <div className="bar" style={{ marginTop: 5, height: 5 }}><u style={{ width: `${Math.min(100, score)}%` }} /></div>
      <div className="pc-a">
        <button type="button" disabled={!email} title={email ? `Email ${email}` : "No email yet"} onClick={() => { window.location.href = `mailto:${email}`; }}>
          <Icon name="mail" size={13} /> Email
        </button>
        <button type="button" onClick={() => router.push("/calendar")}>
          <Icon name="calendar" size={13} /> Book
        </button>
      </div>
    </article>
  );
}

const LEADS_PER_COLUMN = 10;

export default function PipelinePage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [hotOnly, setHotOnly] = useState(false);
  const [pages, setPages] = useState({});
  const showSkeleton = useFirstLoad(loading);
  useEffect(() => { setPages({}); }, [query, hotOnly]);

  useEffect(() => {
    api.get("/leads", { params: { perPage: 500 } })
      .then(res => setLeads(res.data.items || []))
      .catch(() => setError("Pipeline could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const visibleLeads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter(lead => {
      const haystack = [leadName(lead), lead.company, lead.title, lead.email].filter(Boolean).join(" ").toLowerCase();
      const hot = (lead.score ?? 0) >= 80 || lead.status === "engaged";
      return (!needle || haystack.includes(needle)) && (!hotOnly || hot);
    });
  }, [leads, query, hotOnly]);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STAGES.map(stage => [stage.id, []]));
    for (const lead of visibleLeads) {
      const stage = map[lead.status] ? lead.status : "new";
      map[stage].push(lead);
    }
    for (const stage of STAGES) {
      map[stage.id].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }
    return map;
  }, [visibleLeads]);

  const metrics = useMemo(() => ({
    total: visibleLeads.length,
    hot: visibleLeads.filter(lead => (lead.score ?? 0) >= 80 || lead.status === "engaged").length,
    meetings: visibleLeads.filter(lead => lead.status === "meeting_booked").length,
    contacted: visibleLeads.filter(lead => ["contacted", "engaged", "meeting_booked"].includes(lead.status)).length,
  }), [visibleLeads]);


  if (showSkeleton) return <RouteSkeleton />;

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Pipeline</h1>
          <p>{metrics.total} active leads · {metrics.hot} high-intent accounts</p>
        </div>
        <div className="acts">
          <button type="button" className={`bt ${hotOnly ? "bt-p" : "bt-g"}`} aria-pressed={hotOnly} onClick={() => setHotOnly(value => !value)}>
            <Icon name="flame" size={15} /> Hot only
          </button>
          <Link className="bt bt-d" href="/prospects">
            <Icon name="plus" size={15} color="#fff" /> Add leads
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: "16px 20px" }} data-tour="pipeline-metrics">
        <div className="minis">
          <div className="mini"><b>{metrics.total}</b><small>visible leads</small></div>
          <span className="mini-sep" />
          <div className="mini"><b style={{ color: "#c2410c" }}>{metrics.hot}</b><small>high intent</small></div>
          <span className="mini-sep" />
          <div className="mini"><b>{metrics.contacted}</b><small>contacted or engaged</small></div>
          <span className="mini-sep" />
          <div className="mini"><b>{metrics.meetings}</b><small>meetings set</small></div>
          <label className="inp" style={{ marginLeft: "auto", width: 360, maxWidth: "100%" }}>
            <Icon name="search" size={15} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by lead, company, title or email…" aria-label="Search pipeline" />
          </label>
        </div>
      </div>

      {error ? <div className="note">{error}</div> : null}

      {leads.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="funnel"
            title="Your pipeline is empty"
            text="Leads move from New to Meeting set on their own as your agent emails, calls and books meetings."
            actions={[{ label: "Add leads", icon: "plus", primary: true, onClick: () => router.push("/prospects") }]}
          />
        </div>
      ) : (
        <div className="board-wrap">
          <div className="board">
            {STAGES.map(stage => {
              const stageLeads = grouped[stage.id] || [];
              const pageCount = Math.max(1, Math.ceil(stageLeads.length / LEADS_PER_COLUMN));
              const page = Math.min(pages[stage.id] || 1, pageCount);
              const goTo = next => setPages(current => ({ ...current, [stage.id]: next }));
              return (
              <section key={stage.id} className="pcol" aria-label={stage.label}>
                <div className="pcol-h"><i style={{ background: stage.tint }} />{stage.label}<span>{stageLeads.length}</span></div>
                {stageLeads.slice((page - 1) * LEADS_PER_COLUMN, page * LEADS_PER_COLUMN).map(lead => <LeadCard key={lead.id} lead={lead} />)}
                {pageCount > 1 ? (
                  <div className="pcol-pager">
                    <button type="button" className="bt bt-g sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>Prev</button>
                    <span>{page} / {pageCount}</span>
                    <button type="button" className="bt bt-g sm" disabled={page >= pageCount} onClick={() => goTo(page + 1)}>Next</button>
                  </div>
                ) : null}
                {stage.id === "new" ? (
                  <Link className="pcol-add" href="/prospects"><Icon name="plus" size={13} /> Add leads</Link>
                ) : (grouped[stage.id] || []).length === 0 ? (
                  <div className="pcol-add" style={{ borderStyle: "dashed" }}>No leads here</div>
                ) : null}
              </section>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
