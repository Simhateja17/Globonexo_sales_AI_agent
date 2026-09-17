"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SenderPicker({ channel, campaignId, value, onChange, onSaved, disabled = false, bare = false }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(value || "");
  const [mode, setMode] = useState("new_leads_only");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [unused, setUnused] = useState(null);
  useEffect(() => {
    let live = true;
    setLoaded(false);
    api.get(campaignId ? `/campaigns/${campaignId}/senders` : "/campaigns/senders/allowed").then(({ data }) => {
      if (!live) return;
      const choices = channel === "email" ? data.emailAccounts : data.phoneNumbers;
      setItems(choices);
      const next = choices.some(item => item.id === value) ? value : choices.length === 1 ? choices[0].id : "";
      setSelected(next);
      if (!campaignId && next) onChange?.(next);
      setLoaded(true);
    }).catch(err => { if (live) setError(err.response?.data?.error || "Could not load senders"); });
    return () => { live = false; };
  }, [channel, campaignId, value]);
  async function save() {
    setBusy(true); setError("");
    try {
      const { data } = await api.post(`/campaigns/${campaignId}/sender`, { [channel === "email" ? "emailAccountId" : "phoneNumberId"]: selected, mode });
      setUnused(data.unusedPhoneNumberId); onSaved?.(selected);
    } catch (err) { setError(err.response?.data?.error || "Could not change sender"); }
    finally { setBusy(false); }
  }
  const small = { fontSize: 12, fontWeight: 800, color: "var(--muted)" };
  const selectStyle = bare ? undefined : { width: "min(100%, 320px)", height: 34 };
  return <div className={bare ? "" : "card"} style={bare ? { marginTop: -4 } : { padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={bare ? undefined : { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <label className={bare ? "label" : undefined} style={bare ? undefined : small} htmlFor="campaign-sender">{channel === "email" ? "Sending inbox" : "Calling number"}</label>
      <select id="campaign-sender" className="input" style={selectStyle} disabled={disabled || busy || !loaded} value={selected} onChange={event => { setSelected(event.target.value); onChange?.(event.target.value); }}>
        <option value="">{loaded ? "Choose a sender" : "Loading senders…"}</option>
        {items.map(item => <option key={item.id} value={item.id}>{item.provider_account_id || item.phone_number}{item.assigned_user_id ? " · Assigned" : " · Shared"}</option>)}
      </select>
      {campaignId && !disabled && <>
        <label style={small} htmlFor="sender-move-mode">Apply to</label>
        <select id="sender-move-mode" className="input" style={{ width: "min(100%, 200px)", height: 34 }} value={mode} onChange={event => setMode(event.target.value)}>
          <option value="new_leads_only">New leads only</option><option value="move_everyone">Move everyone</option>
        </select>
        <button type="button" className="btn btn-secondary btn-sm" disabled={busy || !selected || selected === value} onClick={save}>{busy ? "Saving…" : "Change sender"}</button>
      </>}
    </div>
    {campaignId && !disabled && <p className="faint" style={{ fontSize: 12.5 }}>{mode === "new_leads_only" ? "Previously contacted leads keep their original sender while it remains available." : channel === "email" ? "All future emails use this inbox. Follow-ups start a new conversation from the new address." : "All future calls use this number."}</p>}
    {loaded && !items.length && <p className="faint" style={{ fontSize: 12.5 }}>No senders available. Ask an Owner or Admin to add or assign one in Settings.</p>}
    {unused && <p style={{ fontSize: 12.5 }}>This number is no longer selected by a campaign. <a href="/settings#phone-numbers">Review it in Settings and release it to stop the 200-credit monthly charge.</a></p>}
    {error && <p role="alert" className="notice-warn">{error}</p>}
  </div>;
}
