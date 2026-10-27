"use client";
import { useState } from "react";
import api from "@/lib/api";
import Icon from "@/components/ui/Icon";
import { listMissingFields, missingEmailWriterFields } from "@/lib/lead-email-state";

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", company: "", title: "", location: "", linkedinUrl: "" };

export default function AddLeadCard({ campaign, disabled = false, onAdded }) {
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");
  const isEmail = campaign.channel === "email";
  const isVoice = campaign.channel === "voice";

  const set = (key, value) => { setLead(current => ({ ...current, [key]: value })); setError(""); setAdded(""); };

  async function submit() {
    if (busy) return;
    const values = Object.fromEntries(Object.entries(lead).map(([key, value]) => [key, value.trim()]));
    if (!values.firstName && !values.lastName && !values.email && !values.company) { setError("Add a name, email, or company before saving this lead."); return; }
    const missing = isEmail ? missingEmailWriterFields(values) : [];
    if (missing.length) { setError(`Add their ${listMissingFields(missing)}. The email is written from them.`); return; }
    if (isVoice && !values.phone) { setError("Voice campaigns need a phone number for manual leads."); return; }

    setBusy(true); setError("");
    try {
      const { data: created } = await api.post("/leads", {
        source: "manual",
        ...values,
        name: [values.firstName, values.lastName].filter(Boolean).join(" ") || undefined,
      });
      await api.post(`/campaigns/${campaign.id}/assign-leads`, { leadIds: [created.id] });
      setAdded([values.firstName, values.lastName].filter(Boolean).join(" ") || values.email || values.company);
      setLead(EMPTY);
      setOpen(false);
      onAdded?.(created);
    } catch (err) {
      setError(err?.response?.data?.error || "Lead could not be added to this campaign.");
    } finally { setBusy(false); }
  }

  const field = (key, placeholder, maxLength) => <input className="input" placeholder={placeholder} value={lead[key]} maxLength={maxLength} disabled={busy} onChange={e => set(key, e.target.value)} />;

  return <div className="card col" style={{ padding: 14, gap: 12 }}>
    <div className="row spread" style={{ gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>Leads</span>
        <span className="faint" style={{ fontSize: 12 }}>{added ? `Added ${added} to this campaign.` : "Add someone to this campaign by hand."}</span>
      </div>
      {!open && <button type="button" className="btn btn-primary btn-sm" disabled={disabled} onClick={() => { setOpen(true); setAdded(""); }}>
        <Icon name="plus" size={14} color="#06231a" /> Add lead
      </button>}
    </div>
    {open && <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {field("firstName", isEmail ? "First name *" : "First name", 120)}
        {field("lastName", "Last name", 120)}
        {field("email", isVoice ? "Email (optional)" : "Email *", 240)}
        {field("phone", isEmail ? "Phone (optional)" : "Phone *", 80)}
        {field("company", isEmail ? "Company *" : "Company", 160)}
        {field("title", isEmail ? "Job title *" : "Title", 160)}
        {field("location", "Location (optional)", 160)}
        {field("linkedinUrl", "LinkedIn URL (optional)", 500)}
      </div>
      <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={submit}>
          <Icon name="plus" size={14} color="#06231a" /> {busy ? "Adding…" : "Add lead"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => { setOpen(false); setLead(EMPTY); setError(""); }}>Cancel</button>
      </div>
    </>}
    {error && <p role="alert" className="notice-warn">{error}</p>}
  </div>;
}
