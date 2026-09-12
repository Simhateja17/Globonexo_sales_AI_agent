"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function PhoneNumbers({ teamMembers = [] }) {
  const [state, setState] = useState(null);
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);
  const [country, setCountry] = useState("US");
  const [areaCode, setAreaCode] = useState("");
  const [allowAny, setAllowAny] = useState(false);
  const [busy, setBusy] = useState(false);
  async function load() { const { data } = await api.get("/phone-numbers"); setState(data); }
  useEffect(() => { load().catch(err => setError(err.response?.data?.error || "Could not load phone numbers")); }, []);
  function start(kind, row) { setAction({ kind, row, requestId: crypto.randomUUID() }); setError(""); setAllowAny(false); }
  async function confirm() {
    setBusy(true); setError("");
    try {
      if (action.kind === "buy") await api.post("/phone-numbers", { requestId: action.requestId, country, ...(country === "US" && areaCode ? { areaCode } : {}) }, { timeout: 60000 });
      else if (action.kind === "replace") await api.post(`/phone-numbers/${action.row.id}/replace`, { requestId: action.requestId, allowAnyAreaCode: allowAny }, { timeout: 60000 });
      else await api.delete(`/phone-numbers/${action.row.id}`, { timeout: 60000 });
      setAction(null); await load();
    } catch (err) { setError(err.response?.data?.error || "The operation is pending. Refresh before trying another purchase."); await load().catch(() => {}); }
    finally { setBusy(false); }
  }
  async function assign(row, id) {
    setBusy(true);
    try { await api.patch(`/phone-numbers/${row.id}`, { assignedUserId: id || null }); await load(); }
    catch (err) { setError(err.response?.data?.error || "Could not assign number"); }
    finally { setBusy(false); }
  }
  return <section id="phone-numbers" style={{ border: "1px solid var(--line)", padding: 24, borderRadius: 14, marginBottom: 20 }}>
    <h2>Phone numbers</h2>
    <p>{state ? `${state.used} of ${state.limit} numbers` : "Loading numbers…"} · One included number is free. Extra numbers cost 200 credits every 30 days.</p>
    {state?.numbers.map(row => <div key={row.id} style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
      <strong>{row.label || row.phone_number || "Number purchase"}</strong> · {row.entitlement_kind === "included" ? "Included · Free" : "Extra · 200 credits / 30 days"}
      <p>{row.status} {row.billing_status === "grace" ? `· Payment needed: ${Math.max(0, Math.ceil((Date.parse(row.grace_started_at) + 7 * 86400000 - Date.now()) / 86400000))} days left` : row.last_billed_at && row.entitlement_kind !== "included" ? `· Next charge ${new Date(Date.parse(row.last_billed_at) + 30 * 86400000).toLocaleDateString()}` : ""}</p>
      {row.disable_after && <p>Choose whether to keep this number by {new Date(row.disable_after).toLocaleDateString()}.</p>}
      {state.canManage && <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <label>Label <input className="input" aria-label={`Label ${row.phone_number || 'number'}`} maxLength={100} defaultValue={row.label || ''} disabled={busy} onBlur={async event => {
          const label = event.target.value.trim();
          if (label === (row.label || '')) return;
          setBusy(true);
          try { await api.patch(`/phone-numbers/${row.id}`, { label }); await load(); }
          catch (err) { setError(err.response?.data?.error || 'Could not save number label'); }
          finally { setBusy(false); }
        }} /></label>
        <select aria-label={`Assign ${row.phone_number || "number"}`} className="input" value={row.assigned_user_id || ""} disabled={busy} onChange={event => assign(row, event.target.value)}>
          <option value="">Shared with the team</option>{teamMembers.filter(member => member.membership_status === "active" || member.membershipStatus === "active").map(member => <option key={member.id} value={member.id}>{member.email}</option>)}
        </select>
        {row.status === "active" && <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => start("replace", row)}>Replace · 200 credits</button>}
        {row.status === "active" && row.entitlement_kind !== "included" && <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => start("release", row)}>Release</button>}
      </div>}
    </div>)}
    {state?.canManage && <button type="button" className="btn btn-primary" disabled={busy || state.used >= state.limit} onClick={() => start("buy")}>Buy number · 200 credits</button>}
    {action && <div role="dialog" aria-modal="true" aria-label="Confirm phone number change" style={{ background: "var(--bg-2)", padding: 20, marginTop: 16 }}>
      <h3>{action.kind === "buy" ? "Buy a local number" : action.kind === "replace" ? `Replace ${action.row.phone_number}` : `Release ${action.row.phone_number}`}</h3>
      <p>{action.kind === "release" ? "This deletes the number from Retell and stops future rental charges. Campaigns using it will pause. This cannot be undone." : action.kind === "replace" ? "200 credits now. All campaigns move to the replacement, and the old number is deleted. An included number remains free afterward." : "200 credits now, then 200 every 30 days."}</p>
      {action.kind === "buy" && <>
        <label>Country <select className="input" value={country} onChange={event => { setCountry(event.target.value); setAreaCode(""); }}><option value="US">United States</option><option value="CA">Canada</option></select></label>
        {country === "US" && <label>Area code (optional)<input className="input" inputMode="numeric" maxLength={3} value={areaCode} onChange={event => setAreaCode(event.target.value.replace(/\D/g, ""))} /></label>}
      </>}
      {action.kind === "replace" && action.row.country === "US" && <label><input type="checkbox" checked={allowAny} onChange={event => { setAllowAny(event.target.checked); setAction(current => ({ ...current, requestId: crypto.randomUUID() })); }} /> I accept a number in any US area code.</label>}
      <div className="row" style={{ gap: 8, marginTop: 12 }}><button type="button" className="btn btn-primary" disabled={busy} onClick={confirm}>{busy ? "Processing…" : action.kind === "release" ? "Confirm release" : "Confirm · 200 credits"}</button><button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setAction(null)}>Cancel</button></div>
    </div>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
