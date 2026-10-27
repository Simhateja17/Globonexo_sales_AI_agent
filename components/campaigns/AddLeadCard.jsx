"use client";

import React, { useState } from "react";
import api from "../../lib/api";
import Icon from "../ui/Icon";
import { listMissingFields, missingEmailWriterFields } from "../../lib/lead-email-state";

const EMPTY_LEAD = { firstName: "", lastName: "", title: "", company: "", email: "", phone: "", location: "", linkedinUrl: "" };

// Adds one lead by hand straight into this campaign. The server enrolls it and
// starts its email draft, so the caller only needs to refresh its lead list.
export default function AddLeadCard({ campaignId, disabled = false, onAdded }) {
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState(EMPTY_LEAD);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => {
    setLead(current => ({ ...current, [key]: value }));
    setError("");
  };

  const close = () => {
    setOpen(false);
    setLead(EMPTY_LEAD);
    setError("");
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
        phone: lead.phone.trim(),
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

  const fields = [
    ["firstName", "First name *", 120],
    ["lastName", "Last name", 120],
    ["email", "Email *", 240],
    ["phone", "Phone (optional)", 80],
    ["company", "Company *", 160],
    ["title", "Job title *", 160],
    ["location", "Location (optional)", 160],
    ["linkedinUrl", "LinkedIn URL (optional)", 500],
  ];

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>Leads</span>
        {!open ? (
          <button className="btn btn-primary btn-sm" type="button" onClick={() => setOpen(true)} disabled={disabled}>
            <Icon name="plus" size={14} color="#06231a" /> Add lead
          </button>
        ) : null}
        <span className="faint" style={{ fontSize: 12.5 }}>Add someone by hand. They join this campaign right away.</span>
      </div>
      {open ? (
        <div style={{ marginTop: 14 }}>
          {error ? <div className="note" style={{ marginBottom: 10 }}>{error}</div> : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {fields.map(([key, placeholder, max]) => (
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
      ) : null}
    </div>
  );
}
