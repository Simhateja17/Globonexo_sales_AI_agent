"use client";
import { useEffect, useState } from "react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import Link from "next/link";
import api from "@/lib/api";
import Icon from "@/components/ui/Icon";
export default function SenderSelectionPage() {
  const confirm = useConfirm();
  const [state, setState] = useState(null);
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => { api.get("/senders").then(({ data }) => {
    setState(data); setEmails(data.emailAccounts.slice(0, data.emailAccountLimit).map(item => item.id)); setPhones(data.phoneNumbers.slice(0, data.phoneNumberLimit).map(item => item.id));
  }).catch(err => setError(err.response?.data?.error || "Only the Owner or an Admin can choose senders to keep.")); }, []);
  const toggle = (setter, id) => setter(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  async function save() {
    if (!(await confirm({ title: "Keep only the selected senders?", body: "Unchecked inboxes disconnect and unchecked phone numbers are released for good. Campaigns using them pause.", keeps: "The checked inboxes and numbers, and every campaign's history.", confirmLabel: "Keep selected senders", danger: true }))) return;
    setBusy(true); setError("");
    try { await api.post("/senders/keep", { emailAccountIds: emails, phoneNumberIds: phones }, { timeout: 60000 }); setDone(true); }
    catch (err) { setError(err.response?.data?.error || "Could not apply selection"); }
    finally { setBusy(false); }
  }
  const deadlines = state ? [...state.emailAccounts, ...state.phoneNumbers].map(item => item.disable_after).filter(Boolean).sort() : [];
  const overEmail = state && emails.length > state.emailAccountLimit;
  const overPhone = state && phones.length > state.phoneNumberLimit;
  return <main className="gx">
    <div className="ph">
      <div>
        <h1>Senders</h1>
        <p>Choose which inboxes and numbers to keep after a plan change. Unchecked inboxes disconnect and unchecked numbers are released.</p>
      </div>
      <div className="acts"><Link className="bt bt-g" href="/settings">Back to settings</Link></div>
    </div>
    {error && <div role="alert" className="note">{error}</div>}
    {done ? <div className="gnote ok"><b>Your selection was applied.</b> <Link className="lnk" href="/settings">Back to Settings</Link></div> : state && <>
      <div className={`gnote ${deadlines.length ? "warn" : ""}`}>{deadlines.length ? `Choose by ${new Date(deadlines[0]).toLocaleString()}. Otherwise the oldest senders are kept.` : "There is no pending plan-limit selection."}</div>
      <div className="two">
        <div className="scol">
          <section className="card" style={{ overflow: "hidden" }}>
            <div className="card-h"><div><b>Sending inboxes</b><small>{emails.length} of {state.emailAccountLimit} kept</small></div>{overEmail && <span className="pl pl-bad">Too many</span>}</div>
            {state.emailAccounts.map(item => <label key={item.id} className="srow" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={emails.includes(item.id)} onChange={() => toggle(setEmails, item.id)} />
              <span className="si"><Icon name="mail" size={16} /></span>
              <div><b>{item.provider_account_id}</b></div>
            </label>)}
          </section>
          <section className="card" style={{ overflow: "hidden" }}>
            <div className="card-h"><div><b>Phone numbers</b><small>{phones.length} of {state.phoneNumberLimit} kept</small></div>{overPhone && <span className="pl pl-bad">Too many</span>}</div>
            {state.phoneNumbers.map(item => <label key={item.id} className="srow" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={phones.includes(item.id)} onChange={() => toggle(setPhones, item.id)} />
              <span className="si"><Icon name="phone" size={16} /></span>
              <div><b>{item.phone_number}</b><small>{item.entitlement_kind === "included" ? "Included" : "Extra"}</small></div>
            </label>)}
          </section>
        </div>
        <aside className="scol">
          <div className="card pad">
            <h3 className="h3">Apply selection</h3>
            <p className="sub">Disconnecting an inbox or releasing a number pauses any campaign that uses it.</p>
            <button type="button" className="bt bt-p" style={{ marginTop: 14, justifyContent: "center", width: "100%" }} disabled={busy || !deadlines.length || overEmail || overPhone} onClick={save}>{busy ? "Applying…" : "Keep selected senders"}</button>
          </div>
        </aside>
      </div>
    </>}
  </main>;
}
