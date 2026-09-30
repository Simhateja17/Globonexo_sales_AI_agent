"use client";
import React, { useMemo, useState } from "react";
import Icon from "../ui/Icon";
import api from "../../lib/api";

const LEGAL_BASIS = [
  ["legitimate_interest", "Legitimate interest"],
  ["consent", "Consent"],
  ["existing_business_relationship", "Existing business relationship"],
  ["other", "Other lawful basis"],
];

function browserTimezone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined; } catch { return undefined; }
}

function browserCountry() {
  try { return new Intl.Locale(navigator.language).maximize().region || undefined; } catch { return undefined; }
}

const LEAD_FIELDS = new Set(["firstName", "lastName", "name", "email", "phone", "company", "title", "location", "linkedinUrl"]);

/**
 * Column-matching card for an attached spreadsheet. Everything is editable;
 * nothing is saved until Confirm.
 */
export default function ImportMappingCard({ preview, onImported }) {
  const done = preview?.status === "imported";
  const [status, setStatus] = useState(done ? "imported" : "pending");
  const [sheets, setSheets] = useState(() => (preview?.sheets || []).filter(s => s.selected).map(s => s.name));
  const [columns, setColumns] = useState(() => (preview?.columns || []).map(c => ({ ...c })));
  const [mode, setMode] = useState(preview?.mode || "leads");
  const [campaignName, setCampaignName] = useState(preview?.campaignName || "");
  const suggested = preview?.channel?.suggestion;
  const [channel, setChannel] = useState(suggested === "ask" ? "" : suggested || "email");
  const [legalBasis, setLegalBasis] = useState("legitimate_interest");
  const [voiceConfirmed, setVoiceConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState("");

  const allSheets = preview?.sheets || [];
  const chosenSheets = allSheets.filter(s => sheets.includes(s.name));
  const rowCount = chosenSheets.reduce((sum, s) => sum + s.rowCount, 0);
  const visibleHeaders = useMemo(() => new Set(chosenSheets.flatMap(s => s.headers)), [chosenSheets]);
  const headersDiffer = chosenSheets.length > 1 && chosenSheets.some(s => s.headers.join("|") !== chosenSheets[0].headers.join("|"));
  const limit = preview?.campaignLeadLimit ?? 25;
  const locked = status === "imported" || busy;

  const setTarget = (header, target) => {
    setColumns(current => current.map(c => {
      if (c.header === header) return { ...c, target, personalize: target === "extra" ? c.personalize : false };
      // Each of our fields can come from one column only.
      if (LEAD_FIELDS.has(target) && c.target === target) return { ...c, target: "extra" };
      return c;
    }));
  };
  const setPersonalize = (header, value) => setColumns(current => current.map(c => c.header === header ? { ...c, personalize: value } : c));
  const toggleSheet = name => setSheets(current => current.includes(name) ? current.filter(n => n !== name) : [...current, name]);

  const identifying = columns.some(c => visibleHeaders.has(c.header) && ["email", "phone", "name", "firstName", "lastName"].includes(c.target));
  const problem = !sheets.length ? "Pick at least one sheet."
    : !identifying ? "Match at least one column to Email, Phone or a name."
    : mode === "campaign" && campaignName.trim().length < 3 ? "Give the campaign a name."
    : mode === "campaign" && !channel ? "Choose email or calls for the campaign."
    : mode === "campaign" && channel === "voice" && !voiceConfirmed ? "Tick the do-not-call confirmation to make a calling campaign."
    : "";

  const confirm = async () => {
    if (problem || !preview?.attachmentId) return;
    setBusy(true);
    setErrorText("");
    try {
      const { data } = await api.post(`/agent/attachments/${preview.attachmentId}/import`, {
        sheets,
        columns: columns.map(({ header, target, personalize }) => ({ header, target, personalize: !!personalize })),
        mode,
        campaign: mode === "campaign" ? { name: campaignName.trim(), channel, timezone: browserTimezone() } : undefined,
        voiceCompliance: mode === "campaign" && channel === "voice"
          ? { confirmed: true, legalBasis, country: browserCountry() }
          : undefined,
      }, { timeout: 180000 });
      setStatus("imported");
      onImported?.(data);
    } catch (err) {
      setErrorText(err?.response?.data?.error || (err?.code === "ECONNABORTED"
        ? "This is taking a while. It may still finish; check the Leads page before trying again."
        : "The import could not be completed. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const fieldOptions = preview?.fields || [];

  return (
    <div className="card import-card" style={{ padding: 16, maxWidth: 620, borderRadius: 16, border: "1px solid var(--g-200, #b9efd8)" }}>
      <div className="row spread" style={{ gap: 10 }}>
        <div className="row" style={{ gap: 8, minWidth: 0 }}>
          <Icon name="paperclip" size={16} color="var(--g-600)" />
          <strong style={{ fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{preview?.fileName || "Attached file"}</strong>
        </div>
        <span className="chip" style={{ fontSize: 10.5, flex: "none" }}>{status === "imported" ? "Imported" : `${rowCount.toLocaleString()} rows`}</span>
      </div>

      {allSheets.length > 1 && (
        <div style={{ marginTop: 12 }}>
          <div className="eyebrow">Sheets to import</div>
          <div className="col" style={{ gap: 2, marginTop: 4 }}>
            {allSheets.map(s => (
              <label key={s.name} className="apollo-checkbox-row" style={{ marginTop: 4 }}>
                <input type="checkbox" checked={sheets.includes(s.name)} disabled={locked} onChange={() => toggleSheet(s.name)} />
                {s.name} · {s.rowCount.toLocaleString()} rows{s.looksLikeSummary ? " · looks like a summary" : ""}
              </label>
            ))}
          </div>
          {headersDiffer && <p style={{ fontSize: 11.5, color: "var(--orange-700)", margin: "8px 0 0" }}>These sheets have different columns. They'll be joined into one list, and missing values stay empty.</p>}
        </div>
      )}

      <div className="eyebrow" style={{ marginTop: 14 }}>Column matching</div>
      <div className="import-columns" style={{ marginTop: 6 }}>
        {columns.filter(c => visibleHeaders.has(c.header)).map(c => (
          <div key={c.header} className="import-column-row">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.header}</div>
              <div className="faint" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(c.samples || []).join(" · ") || "No values"}</div>
            </div>
            <div className="col" style={{ gap: 4 }}>
              <select className="input" style={{ height: 34, fontSize: 12.5, padding: "0 8px" }} value={c.target} disabled={locked} onChange={e => setTarget(c.header, e.target.value)}>
                {fieldOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                <option value="extra">Keep as extra info</option>
                <option value="skip">Skip this column</option>
              </select>
              {c.target === "extra" && (
                <label className="row" style={{ gap: 6, fontSize: 11, color: "var(--muted)" }}>
                  <input type="checkbox" style={{ accentColor: "var(--g-600)" }} checked={!!c.personalize} disabled={locked} onChange={e => setPersonalize(c.header, e.target.checked)} />
                  Use for personalizing{c.sensitive ? " (looks private)" : ""}
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="eyebrow" style={{ marginTop: 14 }}>What to do</div>
      <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
        {[["leads", "Add as leads"], ["campaign", "Add as leads + make a draft campaign"]].map(([value, label]) => (
          <button key={value} type="button" className={`btn btn-sm ${mode === value ? "btn-primary" : "btn-ghost"}`} disabled={locked} onClick={() => setMode(value)}>{label}</button>
        ))}
      </div>

      {mode === "campaign" && (
        <div className="col" style={{ gap: 8, marginTop: 10 }}>
          <input className="input" style={{ height: 38, fontSize: 13 }} value={campaignName} maxLength={120} disabled={locked} onChange={e => setCampaignName(e.target.value)} placeholder="Campaign name" />
          <div className="row wrap" style={{ gap: 6, alignItems: "center" }}>
            {[["email", "Email"], ["voice", "Calls"]].map(([value, label]) => (
              <button key={value} type="button" className={`btn btn-sm ${channel === value ? "btn-primary" : "btn-ghost"}`} disabled={locked} onClick={() => setChannel(value)}>
                <Icon name={value === "email" ? "mail" : "phone"} size={13} /> {label}
              </button>
            ))}
            <span className="faint" style={{ fontSize: 11 }}>
              {suggested === "ask"
                ? "This file has both emails and phone numbers. Pick one."
                : `Suggested from the file: ${preview?.channel?.withEmail ?? 0} with email, ${preview?.channel?.withPhone ?? 0} with phone.`}
            </span>
          </div>
          {channel === "voice" && (
            <div style={{ background: "var(--bg-2)", borderRadius: 10, padding: 10 }}>
              <select className="input" style={{ height: 34, fontSize: 12.5 }} value={legalBasis} disabled={locked} onChange={e => setLegalBasis(e.target.value)}>
                {LEGAL_BASIS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <label className="apollo-checkbox-row" style={{ marginTop: 8, fontSize: 12 }}>
                <input type="checkbox" checked={voiceConfirmed} disabled={locked} onChange={e => setVoiceConfirmed(e.target.checked)} />
                I confirm these numbers were DNC-checked, have not opted out, and may lawfully be called.
              </label>
            </div>
          )}
          <p className="faint" style={{ fontSize: 11, margin: 0 }}>
            A campaign holds up to {limit} leads. If there are more, the first {limit} usable ones go in and the rest are saved as leads.
            The campaign stays a draft. Nothing is sent or called until you launch it.
          </p>
        </div>
      )}

      {errorText && <p style={{ color: "var(--red-600, #c0392b)", fontSize: 11.5, margin: "10px 0 0" }}>{errorText}</p>}
      {status === "imported" ? (
        <p className="faint" style={{ fontSize: 11.5, margin: "12px 0 0" }}><Icon name="check" size={12} /> Imported. This upload can't be used again.</p>
      ) : (
        <div className="row" style={{ gap: 10, marginTop: 12, alignItems: "center" }}>
          <button className="btn btn-primary btn-sm" disabled={!!problem || busy} onClick={confirm}>
            <Icon name="check" size={13} color="#06231a" /> {busy ? "Importing…" : "Confirm"}
          </button>
          {problem && <span className="faint" style={{ fontSize: 11.5 }}>{problem}</span>}
        </div>
      )}
    </div>
  );
}

export function ImportResultCard({ result }) {
  if (!result) return null;
  const skipped = result.skippedExamples || [];
  return (
    <div className="card" style={{ padding: 16, maxWidth: 480, borderRadius: 16 }}>
      <div className="row wrap" style={{ gap: 8 }}>
        <span className="chip">{result.created ?? 0} new</span>
        <span className="chip">{result.alreadyExisted ?? 0} already existed</span>
        {result.skipped > 0 && <span className="chip">{result.skipped} skipped</span>}
        {result.campaign && <span className="chip">{result.campaign.enrolled} in campaign</span>}
      </div>
      {skipped.length > 0 && (
        <details style={{ marginTop: 10, fontSize: 11.5 }}>
          <summary>Skipped rows</summary>
          {skipped.map((item, i) => <div key={i} className="faint" style={{ marginTop: 3 }}>{item.sheet} row {item.row}: {item.reason}</div>)}
        </details>
      )}
    </div>
  );
}
