"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SenderPicker({ channel, campaignId, value, onChange, onSaved, disabled = false }) {
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
  return <div style={{ padding: 16, border: "1px solid var(--line)", borderRadius: 10, margin: "12px 0" }}>
    <label className="label" htmlFor="campaign-sender">{channel === "email" ? "Sending inbox" : "Calling number"}</label>
    <select id="campaign-sender" className="input" disabled={disabled || busy || !loaded} value={selected} onChange={event => { setSelected(event.target.value); onChange?.(event.target.value); }}>
      <option value="">{loaded ? "Choose a sender" : "Loading senders…"}</option>
      {items.map(item => <option key={item.id} value={item.id}>{item.provider_account_id || item.phone_number}{item.assigned_user_id ? " · Assigned" : " · Shared"}</option>)}
    </select>
    {loaded && !items.length && <p>No senders available. Ask an Owner or Admin to add or assign one in Settings.</p>}
    {campaignId && !disabled && <>
      <label className="label" htmlFor="sender-move-mode">When changing sender</label>
      <select id="sender-move-mode" className="input" value={mode} onChange={event => setMode(event.target.value)}>
        <option value="new_leads_only">New leads only</option><option value="move_everyone">Move everyone</option>
      </select>
      <p className="faint">{mode === "new_leads_only" ? "Previously contacted leads keep their original sender while it remains available." : channel === "email" ? "All future emails use this inbox. Follow-ups start a new conversation from the new address." : "All future calls use this number."}</p>
      <button type="button" className="btn btn-secondary" disabled={busy || !selected} onClick={save}>{busy ? "Saving…" : "Change sender"}</button>
    </>}
    {unused && <p>This number is no longer selected by a campaign. <a href="/settings#phone-numbers">Review it in Settings and release it to stop the 200-credit monthly charge.</a></p>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
