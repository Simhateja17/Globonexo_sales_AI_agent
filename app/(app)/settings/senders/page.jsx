"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
export default function SenderSelectionPage() {
  const [state, setState] = useState(null);
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => { api.get("/senders").then(({ data }) => {
    setState(data); setEmails(data.emailAccounts.slice(0, data.emailAccountLimit).map(item => item.id)); setPhones(data.phoneNumbers.slice(0, data.phoneNumberLimit).map(item => item.id));
  }).catch(err => setError(err.response?.data?.error || "Only the Owner can choose senders to keep.")); }, []);
  const toggle = (setter, id) => setter(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  async function save() {
    if (!window.confirm("Disconnect unchecked inboxes and permanently release unchecked phone numbers? Campaigns using them will pause.")) return;
    setBusy(true); setError("");
    try { await api.post("/senders/keep", { emailAccountIds: emails, phoneNumberIds: phones }, { timeout: 60000 }); setDone(true); }
    catch (err) { setError(err.response?.data?.error || "Could not apply selection"); }
    finally { setBusy(false); }
  }
  const deadlines = state ? [...state.emailAccounts, ...state.phoneNumbers].map(item => item.disable_after).filter(Boolean).sort() : [];
  return <main style={{ padding: 24, overflowY: "auto" }}><h1>Choose senders to keep</h1>
    {error && <p role="alert">{error}</p>}
    {done ? <p>Your selection was applied. <a href="/settings">Back to Settings</a></p> : state && <>
      <p>{deadlines.length ? `Choose by ${new Date(deadlines[0]).toLocaleString()}. Otherwise the oldest senders are kept.` : "There is no pending plan-limit selection."}</p>
      <h2>Inboxes · {emails.length} of {state.emailAccountLimit}</h2>
      {state.emailAccounts.map(item => <label key={item.id} style={{ display: "block", padding: 10 }}><input type="checkbox" checked={emails.includes(item.id)} onChange={() => toggle(setEmails, item.id)} /> {item.provider_account_id}</label>)}
      <h2>Phone numbers · {phones.length} of {state.phoneNumberLimit}</h2>
      {state.phoneNumbers.map(item => <label key={item.id} style={{ display: "block", padding: 10 }}><input type="checkbox" checked={phones.includes(item.id)} onChange={() => toggle(setPhones, item.id)} /> {item.phone_number} · {item.entitlement_kind === "included" ? "Included" : "Extra"}</label>)}
      <button className="btn btn-primary" disabled={busy || !deadlines.length || emails.length > state.emailAccountLimit || phones.length > state.phoneNumberLimit} onClick={save}>{busy ? "Applying…" : "Keep selected senders"}</button>
    </>}
  </main>;
}
