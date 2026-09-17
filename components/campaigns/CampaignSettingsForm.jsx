"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Australia/Sydney"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fromCampaign(campaign) {
  return {
    name: campaign.name ?? "",
    promptNotes: campaign.promptNotes ?? "",
    maxLeads: campaign.maxLeads ?? 25,
    dailySendCap: campaign.dailySendCap ?? 75,
    weeklyQualifiedLeadTarget: campaign.weeklyQualifiedLeadTarget ?? 25,
    leadPreparationWeekdays: campaign.leadPreparationWeekdays ?? [0, 6],
    businessHoursStart: campaign.businessHoursStart ?? "09:00",
    businessHoursEnd: campaign.businessHoursEnd ?? "17:00",
    timezone: campaign.timezone ?? "America/New_York",
    allowedWeekdays: campaign.allowedWeekdays ?? [1, 2, 3, 4, 5],
    voiceMode: campaign.voiceMode ?? "ai",
    callCadencePerHour: campaign.callCadencePerHour ?? 5,
    maxCallAttempts: campaign.maxCallAttempts ?? 3,
  };
}

function Row({ label, hint, children }) {
  return <div className="col" style={{ gap: 6 }}>
    <label className="label" style={{ marginBottom: 0 }}>{label}</label>
    {children}
    {hint && <span className="faint" style={{ fontSize: 12 }}>{hint}</span>}
  </div>;
}

function DayPicker({ value, onChange, disabled }) {
  return <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
    {DAYS.map((day, index) => {
      const on = value.includes(index);
      return <button key={day} type="button" disabled={disabled} aria-pressed={on} className={`btn btn-sm ${on ? "btn-primary" : "btn-secondary"}`} style={{ minWidth: 48 }}
        onClick={() => {
          const next = on ? value.filter(d => d !== index) : [...value, index].sort();
          if (next.length) onChange(next);
        }}>{day}</button>;
    })}
  </div>;
}

export default function CampaignSettingsForm({ campaign, disabled = false, onSaved }) {
  const [form, setForm] = useState(() => fromCampaign(campaign));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { setForm(fromCampaign(campaign)); }, [campaign]);

  const set = (key, value) => { setForm(current => ({ ...current, [key]: value })); setSaved(false); };
  const original = fromCampaign(campaign);
  const changed = Object.keys(form).filter(key => JSON.stringify(form[key]) !== JSON.stringify(original[key]));
  const isEmail = campaign.channel === "email";
  const isVoice = campaign.channel === "voice";

  async function save() {
    if (form.name.trim().length < 3) { setError("Campaign name needs at least 3 characters."); return; }
    setBusy(true); setError("");
    try {
      const body = Object.fromEntries(changed.map(key => [key, form[key]]));
      const { data } = await api.put(`/campaigns/${campaign.id}`, body);
      setSaved(true);
      onSaved?.(data);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save settings");
    } finally { setBusy(false); }
  }

  const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 };
  const heading = { fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" };

  return <div className="card col" style={{ padding: 20, gap: 22 }}>
    <div className="col" style={{ gap: 14 }}>
      <p style={heading}>Basics</p>
      <Row label="Campaign name">
        <input className="input" disabled={disabled} value={form.name} onChange={e => set("name", e.target.value)} maxLength={120} />
      </Row>
      <Row label="Prompt notes" hint="Who you're targeting, positioning, qualifying rules, exclusions and pain points.">
        <textarea className="input" disabled={disabled} rows={5} maxLength={2000} value={form.promptNotes} onChange={e => set("promptNotes", e.target.value)} style={{ resize: "vertical" }} />
      </Row>
    </div>

    <div className="col" style={{ gap: 14 }}>
      <p style={heading}>Limits</p>
      <div style={grid}>
        <Row label="Max leads"><input className="input" type="number" min={1} disabled={disabled} value={form.maxLeads} onChange={e => set("maxLeads", Number(e.target.value))} /></Row>
        <Row label="Weekly lead target"><input className="input" type="number" min={1} disabled={disabled} value={form.weeklyQualifiedLeadTarget} onChange={e => set("weeklyQualifiedLeadTarget", Number(e.target.value))} /></Row>
        {isEmail && <Row label="Daily send cap" hint="Capped by your plan."><input className="input" type="number" min={1} max={500} disabled={disabled} value={form.dailySendCap} onChange={e => set("dailySendCap", Number(e.target.value))} /></Row>}
        {isVoice && <>
          <Row label="Voice mode">
            <select className="input" disabled={disabled} value={form.voiceMode} onChange={e => set("voiceMode", e.target.value)}>
              <option value="ai">AI calling</option><option value="manual">Manual calling</option>
            </select>
          </Row>
          <Row label="Calls per hour"><input className="input" type="number" min={1} max={60} disabled={disabled} value={form.callCadencePerHour} onChange={e => set("callCadencePerHour", Number(e.target.value))} /></Row>
          <Row label="Max call attempts"><input className="input" type="number" min={1} max={10} disabled={disabled} value={form.maxCallAttempts} onChange={e => set("maxCallAttempts", Number(e.target.value))} /></Row>
        </>}
      </div>
    </div>

    <div className="col" style={{ gap: 14 }}>
      <p style={heading}>Schedule</p>
      <div style={grid}>
        <Row label="Contact hours start"><input className="input" type="time" disabled={disabled} value={form.businessHoursStart} onChange={e => set("businessHoursStart", e.target.value)} /></Row>
        <Row label="Contact hours end"><input className="input" type="time" disabled={disabled} value={form.businessHoursEnd} onChange={e => set("businessHoursEnd", e.target.value)} /></Row>
        <Row label="Timezone">
          <select className="input" disabled={disabled} value={form.timezone} onChange={e => set("timezone", e.target.value)}>
            {(TIMEZONES.includes(form.timezone) ? TIMEZONES : [form.timezone, ...TIMEZONES]).map(zone => <option key={zone} value={zone}>{zone}</option>)}
          </select>
        </Row>
      </div>
      <Row label="Contact days"><DayPicker disabled={disabled} value={form.allowedWeekdays} onChange={v => set("allowedWeekdays", v)} /></Row>
      <Row label="Lead preparation days" hint="Days we look for and research new leads."><DayPicker disabled={disabled} value={form.leadPreparationWeekdays} onChange={v => set("leadPreparationWeekdays", v)} /></Row>
    </div>

    {!disabled && <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <button type="button" className="btn btn-primary" disabled={busy || !changed.length} onClick={save}>{busy ? "Saving…" : "Save settings"}</button>
      {changed.length > 0 && !busy && <button type="button" className="btn btn-ghost" onClick={() => { setForm(original); setError(""); }}>Discard changes</button>}
      {saved && !changed.length && <span className="faint" style={{ fontSize: 13 }}>Saved.</span>}
    </div>}
    {error && <p role="alert" className="notice-warn">{error}</p>}
  </div>;
}
