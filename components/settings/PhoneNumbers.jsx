"use client";
import { useEffect, useState } from "react";
import Icon from "../ui/Icon";
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
  const usage = row => row.entitlement_kind === "included" ? "Included" : "Extra, 200 credits every 30 days";
  const billingNote = row => row.billing_status === "grace"
    ? `Payment needed: ${Math.max(0, Math.ceil((Date.parse(row.grace_started_at) + 7 * 86400000 - Date.now()) / 86400000))} days left`
    : row.last_billed_at && row.entitlement_kind !== "included"
      ? `Next charge ${new Date(Date.parse(row.last_billed_at) + 30 * 86400000).toLocaleDateString()}`
      : "";
  return <section id="phone-numbers" className="card" style={{ overflow: "hidden", scrollMarginTop: 16 }}>
    <div className="card-h">
      <div><b>Phone numbers</b><small>{state ? `${state.used} of ${state.limit} numbers · 1 included, extras are 200 credits every 30 days` : "Loading numbers…"}</small></div>
      {state?.canManage && <button type="button" className="bt bt-g sm" disabled={busy || state.used >= state.limit} onClick={() => start("buy")}><Icon name="plus" size={13} /> Buy a number</button>}
    </div>
    {state?.numbers.length === 0 && <div className="empty">No phone numbers yet.</div>}
    {state?.numbers.map(row => <div key={row.id} className="srow" style={{ flexWrap: "wrap" }}>
      <span className="si"><Icon name="phone" size={17} /></span>
      <div>
        <b>{row.label || row.phone_number || "Number purchase"}</b>
        <small>{[row.label ? row.phone_number : null, usage(row), billingNote(row)].filter(Boolean).join(" · ")}</small>
        {row.disable_after && <small style={{ color: "#c2410c" }}>Choose whether to keep this number by {new Date(row.disable_after).toLocaleDateString()}.</small>}
      </div>
      <span className={`pl ${row.status === "active" ? "pl-ok" : "pl-mute"}`}><u />{row.status === "active" ? "Active" : row.status}</span>
      {state.canManage && <div className="acts" style={{ width: "100%", paddingLeft: 52 }}>
        <input className="input" style={{ width: 180, height: 32 }} aria-label={`Label ${row.phone_number || 'number'}`} placeholder="Label" maxLength={100} defaultValue={row.label || ''} disabled={busy} onBlur={async event => {
          const label = event.target.value.trim();
          if (label === (row.label || '')) return;
          setBusy(true);
          try { await api.patch(`/phone-numbers/${row.id}`, { label }); await load(); }
          catch (err) { setError(err.response?.data?.error || 'Could not save number label'); }
          finally { setBusy(false); }
        }} />
        <select aria-label={`Assign ${row.phone_number || "number"}`} className="sel-box" style={{ height: 32 }} value={row.assigned_user_id || ""} disabled={busy} onChange={event => assign(row, event.target.value)}>
          <option value="">Shared with the team</option>{teamMembers.filter(member => member.membership_status === "active" || member.membershipStatus === "active").map(member => <option key={member.id} value={member.id}>{member.email}</option>)}
        </select>
        {row.status === "active" && <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => start("replace", row)}>Replace · 200 credits</button>}
        {row.status === "active" && row.entitlement_kind !== "included" && <button type="button" className="bt bt-x sm" disabled={busy} onClick={() => start("release", row)}>Release</button>}
      </div>}
    </div>)}
    {action && <div role="dialog" aria-modal="true" aria-label="Confirm phone number change" className="gnote warn" style={{ margin: "0 18px 18px" }}>
      <b>{action.kind === "buy" ? "Buy a local number" : action.kind === "replace" ? `Replace ${action.row.phone_number}` : `Release ${action.row.phone_number}`}</b>
      <p style={{ margin: "6px 0 10px" }}>{action.kind === "release" ? "This deletes the number from Retell and stops future rental charges. Campaigns using it will pause. This cannot be undone." : action.kind === "replace" ? "200 credits now. All campaigns move to the replacement, and the old number is deleted. An included number remains free afterward." : "200 credits now, then 200 every 30 days."}</p>
      {action.kind === "buy" && <div className="acts">
        <label className="fld"><span>Country</span><select className="sel-box" value={country} onChange={event => { setCountry(event.target.value); setAreaCode(""); }}><option value="US">United States</option><option value="CA">Canada</option></select></label>
        {country === "US" && <label className="fld"><span>Area code (optional)</span><input className="input" style={{ height: 38, width: 120 }} inputMode="numeric" maxLength={3} value={areaCode} onChange={event => setAreaCode(event.target.value.replace(/\D/g, ""))} /></label>}
      </div>}
      {action.kind === "replace" && action.row.country === "US" && <label className="row" style={{ gap: 6 }}><input type="checkbox" checked={allowAny} onChange={event => { setAllowAny(event.target.checked); setAction(current => ({ ...current, requestId: crypto.randomUUID() })); }} /> I accept a number in any US area code.</label>}
      <div className="acts" style={{ marginTop: 12 }}><button type="button" className="bt bt-p sm" disabled={busy} onClick={confirm}>{busy ? "Processing…" : action.kind === "release" ? "Confirm release" : "Confirm · 200 credits"}</button><button type="button" className="bt bt-g sm" disabled={busy} onClick={() => setAction(null)}>Cancel</button></div>
    </div>}
    {error && <div role="alert" className="note" style={{ margin: "0 18px 18px" }}>{error}</div>}
  </section>;
}
