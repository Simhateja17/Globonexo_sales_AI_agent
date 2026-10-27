"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import Icon from "../ui/Icon";
import { listMissingFields, missingEmailWriterFields } from "../../lib/lead-email-state";

const EMPTY_LEAD = { firstName: "", lastName: "", title: "", company: "", email: "", phone: "", location: "", linkedinUrl: "" };

const FIELDS = [
  ["firstName", "First name *", 120],
  ["lastName", "Last name", 120],
  ["email", "Email *", 240],
  ["phone", "Phone (optional)", 80],
  ["company", "Company *", 160],
  ["title", "Job title *", 160],
  ["location", "Location (optional)", 160],
  ["linkedinUrl", "LinkedIn URL (optional)", 500],
];

function prospectName(item) {
  return item.name || [item.firstName, item.lastName].filter(Boolean).join(" ") || "Unnamed lead";
}

// Adds leads to this campaign, either picked from the existing Prospects or
// typed in by hand. The server enrolls them and starts their email drafts, so
// the caller only needs to refresh its lead list.
export default function AddLeadCard({ campaignId, disabled = false, hidePhone = false, enrolledIds = [], onAdded }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("prospects");
  const [lead, setLead] = useState(EMPTY_LEAD);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [prospects, setProspects] = useState([]);
  const [loadingProspects, setLoadingProspects] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState([]);

  useEffect(() => {
    if (!open || mode !== "prospects") return undefined;
    let live = true;
    setLoadingProspects(true);
    api.get("/leads", { params: { perPage: 500 } })
      .then(({ data }) => { if (live) setProspects(Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []); })
      .catch(err => { if (live) setError(err?.response?.data?.error || "Prospects could not be loaded."); })
      .finally(() => { if (live) setLoadingProspects(false); });
    return () => { live = false; };
  }, [open, mode]);

  const available = useMemo(() => {
    const taken = new Set(enrolledIds);
    const q = query.trim().toLowerCase();
    return prospects.filter(item => !taken.has(item.id)
      && (!q || [item.name, item.firstName, item.lastName, item.email, item.company, item.title].filter(Boolean).join(" ").toLowerCase().includes(q)));
  }, [prospects, enrolledIds, query]);

  const set = (key, value) => {
    setLead(current => ({ ...current, [key]: value }));
    setError("");
  };

  const togglePicked = id => {
    setPicked(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setError("");
  };

  const close = () => {
    setOpen(false);
    setLead(EMPTY_LEAD);
    setPicked([]);
    setQuery("");
    setError("");
  };

  const addPicked = async () => {
    if (busy || picked.length === 0) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/campaigns/${campaignId}/assign-leads`, { leadIds: picked });
      close();
      await onAdded?.();
    } catch (err) {
      setError(err?.response?.data?.error || "Those prospects could not be added.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (busy) return;
    const firstName = lead.firstName.trim();
    const lastName = lead.lastName.trim();
    const company = lead.company.trim();
    const email = lead.email.trim();
    const missing = missingEmailWriterFields({ firstName, lastName, title: lead.title, company, email });
    if (missing.length > 0) {
      setError(`Add their ${listMissingFields(missing)}. The email is written from them.`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/leads", {
        source: "manual",
        campaignId,
        firstName,
        lastName,
        name: [firstName, lastName].filter(Boolean).join(" ") || undefined,
        title: lead.title.trim(),
        company,
        email,
        phone: hidePhone ? "" : lead.phone.trim(),
        location: lead.location.trim(),
        linkedinUrl: lead.linkedinUrl.trim(),
      });
      close();
      await onAdded?.(data);
    } catch (err) {
      setError(err?.response?.data?.error || "This lead could not be added.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>Leads</span>
        {!open ? (
          <button className="btn btn-primary btn-sm" type="button" onClick={() => setOpen(true)} disabled={disabled}>
            <Icon name="plus" size={14} color="#06231a" /> Add lead
          </button>
        ) : null}
        <span className="faint" style={{ fontSize: 12.5 }}>Pick people already in Prospects, or add someone new. They join this campaign right away.</span>
      </div>
      {open ? (
        <div style={{ marginTop: 14 }}>
          {error ? <div className="note" style={{ marginBottom: 10 }}>{error}</div> : null}
          <div className="seg" role="tablist" aria-label="Add lead source" style={{ marginBottom: 12 }}>
            {[["prospects", "From Prospects"], ["new", "New lead"]].map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={mode === key} className={mode === key ? "on" : ""} onClick={() => { setMode(key); setError(""); }}>{label}</button>
            ))}
          </div>
          {mode === "prospects" ? (
            <div>
              <input className="input" placeholder="Search prospects by name, email or company" value={query} onChange={e => setQuery(e.target.value)} style={{ height: 40, marginBottom: 10 }} />
              <div style={{ maxHeight: 280, overflowY: "auto", border: "1px solid var(--line-2, #e5e9e7)", borderRadius: 10 }}>
                {loadingProspects ? (
                  <div className="faint" style={{ padding: 14, fontSize: 13 }}>Loading prospects...</div>
                ) : available.length === 0 ? (
                  <div className="faint" style={{ padding: 14, fontSize: 13 }}>No prospects left to add. Every prospect is already in this campaign.</div>
                ) : available.map(item => (
                  <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid var(--line-2, #eef1ef)" }}>
                    <input type="checkbox" checked={picked.includes(item.id)} onChange={() => togglePicked(item.id)} />
                    <span style={{ minWidth: 0 }}>
                      <b style={{ fontSize: 13.5 }}>{prospectName(item)}</b>
                      <small className="faint" style={{ display: "block" }}>{[item.title, item.company, item.email].filter(Boolean).join(" · ") || "No details"}</small>
                    </span>
                  </label>
                ))}
              </div>
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" type="button" onClick={addPicked} disabled={busy || picked.length === 0}>
                  <Icon name="plus" size={14} color="#06231a" /> {busy ? "Adding..." : picked.length > 1 ? `Add ${picked.length} leads` : "Add lead"}
                </button>
                <button className="btn btn-ghost btn-sm" type="button" onClick={close} disabled={busy}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                {FIELDS.filter(([key]) => !(hidePhone && key === "phone")).map(([key, placeholder, max]) => (
                  <input key={key} className="input" aria-label={placeholder.replace(" *", "")} placeholder={placeholder} value={lead[key]} onChange={e => set(key, e.target.value)} maxLength={max} style={{ height: 40 }} />
                ))}
              </div>
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" type="button" onClick={save} disabled={busy}>
                  <Icon name="plus" size={14} color="#06231a" /> {busy ? "Adding..." : "Add lead"}
                </button>
                <button className="btn btn-ghost btn-sm" type="button" onClick={close} disabled={busy}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
