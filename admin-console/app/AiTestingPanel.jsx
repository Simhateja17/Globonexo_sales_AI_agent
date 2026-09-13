"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../components/ui/Icon";
import Spinner from "../../components/ui/Spinner";
import adminApi from "../lib/admin-api";

const PROVIDER_LABELS = {
  elevenlabs: "ElevenLabs",
  openai: "OpenAI",
  cartesia: "Cartesia",
  minimax: "MiniMax",
  fish_audio: "Fish Audio",
  inworld: "Inworld",
  platform: "Retell platform",
};

function money(value) {
  return value == null ? "price not listed" : `$${Number(value).toFixed(3)}/min`;
}

function errorText(err, fallback) {
  return err?.response?.data?.error || err?.message || fallback;
}

function askReason(action) {
  const reason = window.prompt(`Reason for ${action} (5–500 characters):`);
  const trimmed = reason?.trim() || "";
  return trimmed.length >= 5 ? trimmed.slice(0, 500) : null;
}

function Section({ eyebrow, title, children, right }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="row spread" style={{ gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 style={{ margin: "4px 0 0", fontSize: 18 }}>{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="col" style={{ gap: 6, flex: "1 1 220px", minWidth: 0 }}>
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}

function VoiceSelect({ voices, value, onChange, placeholder, excludeProvider }) {
  const groups = useMemo(() => {
    const map = {};
    for (const voice of voices) {
      if (excludeProvider && voice.provider === excludeProvider) continue;
      (map[voice.provider] ||= []).push(voice);
    }
    return Object.entries(map);
  }, [voices, excludeProvider]);
  const known = voices.some(voice => voice.voiceId === value);
  return (
    <select className="input" value={value || ""} onChange={event => onChange(event.target.value || null)} style={{ height: 38 }}>
      <option value="">{placeholder}</option>
      {value && !known ? <option value={value}>{value}</option> : null}
      {groups.map(([provider, items]) => (
        <optgroup key={provider} label={`${PROVIDER_LABELS[provider] || provider} · ${money(items[0]?.pricePerMinute)}`}>
          {items.map(voice => (
            <option key={voice.voiceId} value={voice.voiceId}>
              {voice.voiceName} ({[voice.gender, voice.accent].filter(Boolean).join(", ") || voice.voiceId})
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function ModelSelect({ models, value, onChange, placeholder }) {
  return (
    <select className="input" value={value || ""} onChange={event => onChange(event.target.value || null)} style={{ height: 38 }}>
      <option value="">{placeholder}</option>
      {models.map(model => <option key={model.id} value={model.id}>{model.id} · {money(model.pricePerMinute)}</option>)}
    </select>
  );
}

function VoiceModelPicker({ catalog, value, onChange, voicePlaceholder = "Keep current voice", modelPlaceholder = "Keep current model" }) {
  const voices = catalog?.voices ?? [];
  const models = catalog?.models ?? [];
  const voice = voices.find(item => item.voiceId === value.voiceId);
  const backup = voices.find(item => item.voiceId === value.fallbackVoiceId);
  const model = models.find(item => item.id === value.model);
  const total = voice?.pricePerMinute != null && model?.pricePerMinute != null ? voice.pricePerMinute + model.pricePerMinute : null;
  const preview = voice?.previewAudioUrl;
  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row wrap" style={{ gap: 12, alignItems: "flex-end" }}>
        <Field label="Voice">
          <VoiceSelect voices={voices} value={value.voiceId} placeholder={voicePlaceholder} onChange={voiceId => onChange({ ...value, voiceId })} />
        </Field>
        <Field label="Backup voice (different provider)">
          <VoiceSelect voices={voices} value={value.fallbackVoiceId} placeholder="No backup voice" excludeProvider={voice?.provider} onChange={fallbackVoiceId => onChange({ ...value, fallbackVoiceId })} />
        </Field>
        <Field label="AI model">
          <ModelSelect models={models} value={value.model} placeholder={modelPlaceholder} onChange={modelId => onChange({ ...value, model: modelId })} />
        </Field>
      </div>
      <div className="admin-pill-list">
        <span className="chip">voice · {voice ? money(voice.pricePerMinute) : "—"}</span>
        <span className="chip">backup · {backup ? `${PROVIDER_LABELS[backup.provider] || backup.provider}` : "none"}</span>
        <span className="chip">model · {model ? money(model.pricePerMinute) : "—"}</span>
        <span className="chip" style={{ fontWeight: 800 }}>voice + model · {total == null ? "—" : `$${total.toFixed(3)}/min`}</span>
        {preview ? <audio controls src={preview} style={{ height: 30 }} /> : null}
      </div>
      {catalog?.voicesError ? <div className="notice-warn">Retell voice list could not be loaded: {catalog.voicesError}</div> : null}
    </div>
  );
}

const EMPTY_SETTING = { voiceId: null, fallbackVoiceId: null, model: null };

function toForm(row) {
  return row ? { voiceId: row.voice_id, fallbackVoiceId: row.fallback_voice_id, model: row.model } : EMPTY_SETTING;
}

function VoiceSettingsSection({ catalog, organizations, setError, setNotice, onOverridesChanged }) {
  const [settings, setSettings] = useState(null);
  const [platformForm, setPlatformForm] = useState(EMPTY_SETTING);
  const [overrideOrgId, setOverrideOrgId] = useState("");
  const [overrideForm, setOverrideForm] = useState(EMPTY_SETTING);
  const [busy, setBusy] = useState(false);
  const [pushResult, setPushResult] = useState(null);

  const load = () => adminApi.get("/ops/ai-testing/voice-settings")
    .then(res => {
      setSettings(res.data);
      setPlatformForm(toForm(res.data.platform));
    })
    .catch(err => setError(errorText(err, "Voice settings could not be loaded.")));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const row = settings?.overrides?.find(item => item.organization_id === overrideOrgId);
    setOverrideForm(toForm(row));
  }, [overrideOrgId, settings]);

  const orgName = id => organizations.find(org => org.id === id)?.name || id;

  const run = async (action, fn) => {
    const reason = askReason(action);
    if (!reason) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn(reason);
      await load();
      onOverridesChanged?.();
    } catch (err) {
      setError(errorText(err, `Could not complete: ${action}.`));
    } finally {
      setBusy(false);
    }
  };

  const push = async (organizationId, dryRun) => {
    const reason = askReason(dryRun ? "previewing the push to existing agents" : "pushing voice settings to existing agents");
    if (!reason) return;
    if (!dryRun && !window.confirm("Update existing Retell agents now? Calls already in progress are not affected.")) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await adminApi.post("/ops/ai-testing/voice-settings/push", { organizationId: organizationId || null, dryRun, reason }, { timeout: 300000 });
      setPushResult(data);
    } catch (err) {
      setError(errorText(err, "Push to existing agents failed."));
    } finally {
      setBusy(false);
    }
  };

  if (!settings) return <Section eyebrow="Settings" title="Voice and AI model"><div className="soft-empty"><Spinner size={16} /></div></Section>;

  return (
    <Section eyebrow="Settings" title="Voice and AI model" right={busy ? <Spinner size={16} /> : null}>
      {!settings.available ? <div className="notice-warn" style={{ marginBottom: 12 }}>The voice settings table is not in the database yet. Calls keep using the built-in defaults until the migration is applied.</div> : null}
      <p className="muted" style={{ marginTop: 0 }}>
        Organizations with their own setting use it; everyone else uses the platform default. Changes apply to new calls. Use “Push to existing agents” so agents that already exist pick up the change.
      </p>

      <h3 style={{ fontSize: 14, margin: "16px 0 8px" }}>Platform default</h3>
      <VoiceModelPicker catalog={catalog} value={platformForm} onChange={setPlatformForm} voicePlaceholder={`Built-in default (${catalog?.codeDefaults?.campaignVoiceId || "openai-Coral"})`} modelPlaceholder={`Built-in default (${catalog?.codeDefaults?.model || "gpt-4.1"})`} />
      <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
        <button className="btn btn-primary btn-sm" type="button" disabled={busy} onClick={() => run("changing the platform voice default", reason => adminApi.put("/ops/ai-testing/voice-settings/platform", { ...platformForm, reason }).then(() => setNotice("Platform default saved.")))}>Save platform default</button>
        <button className="btn btn-ghost btn-sm" type="button" disabled={busy} onClick={() => push(null, true)}>Preview push (all organizations)</button>
        <button className="btn btn-ghost btn-sm" type="button" disabled={busy} onClick={() => push(null, false)}>Push to existing agents (all)</button>
      </div>

      <h3 style={{ fontSize: 14, margin: "22px 0 8px" }}>Organization override</h3>
      <Field label="Organization">
        <select className="input" value={overrideOrgId} onChange={event => setOverrideOrgId(event.target.value)} style={{ height: 38, maxWidth: 420 }}>
          <option value="">Choose an organization…</option>
          {organizations.map(org => <option key={org.id} value={org.id}>{org.name}{settings.overrides.some(row => row.organization_id === org.id) ? " · has override" : ""}</option>)}
        </select>
      </Field>
      {overrideOrgId ? (
        <div style={{ marginTop: 12 }}>
          <VoiceModelPicker catalog={catalog} value={overrideForm} onChange={setOverrideForm} voicePlaceholder="Use platform default voice" modelPlaceholder="Use platform default model" />
          <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary btn-sm" type="button" disabled={busy} onClick={() => run(`changing the voice override for ${orgName(overrideOrgId)}`, reason => adminApi.put(`/ops/ai-testing/voice-settings/organizations/${overrideOrgId}`, { ...overrideForm, reason }).then(() => setNotice("Organization override saved.")))}>Save override</button>
            <button className="btn btn-ghost btn-sm danger-text" type="button" disabled={busy || !settings.overrides.some(row => row.organization_id === overrideOrgId)} onClick={() => run(`clearing the voice override for ${orgName(overrideOrgId)}`, reason => adminApi.delete(`/ops/ai-testing/voice-settings/organizations/${overrideOrgId}`, { data: { reason } }).then(() => setNotice("Override cleared; organization uses the platform default.")))}>Clear override</button>
            <button className="btn btn-ghost btn-sm" type="button" disabled={busy} onClick={() => push(overrideOrgId, false)}>Push to this organization’s agents</button>
          </div>
        </div>
      ) : null}

      {settings.overrides.length > 0 ? (
        <div className="card table-shell" style={{ marginTop: 16 }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr>{["Organization", "Voice", "Backup", "Model", "Updated"].map(header => <th key={header}>{header}</th>)}</tr></thead>
              <tbody>
                {settings.overrides.map(row => (
                  <tr className="data-row" key={row.organization_id}>
                    <td><strong>{orgName(row.organization_id)}</strong></td>
                    <td>{row.voice_id || "platform default"}</td>
                    <td>{row.fallback_voice_id || "—"}</td>
                    <td>{row.model || "platform default"}</td>
                    <td><span className="faint">{row.updated_at ? new Date(row.updated_at).toLocaleString() : ""}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {pushResult ? (
        <div className="notice-good" style={{ marginTop: 14 }}>
          <strong>{pushResult.dryRun ? "Preview" : "Push finished"}:</strong>{" "}
          {Object.entries(pushResult.summary).map(([key, count]) => `${count} ${key.replaceAll("_", " ")}`).join(" · ") || "no agents found"}
          {pushResult.results.filter(row => row.outcome === "error").map(row => <div key={`${row.target}-${row.id}`} className="danger-text" style={{ fontSize: 12 }}>{row.organizationName} · {row.target} · {row.error}</div>)}
        </div>
      ) : null}
    </Section>
  );
}

function VoiceTestSection({ catalog, organizations, setError, setNotice }) {
  const [orgId, setOrgId] = useState("");
  const [context, setContext] = useState(null);
  const [campaignId, setCampaignId] = useState("");
  const [overrides, setOverrides] = useState(EMPTY_SETTING);
  const [busy, setBusy] = useState(false);
  const [callState, setCallState] = useState("idle");
  const [tests, setTests] = useState({ available: true, items: [] });
  const clientRef = useRef(null);

  const loadTests = () => adminApi.get("/ops/ai-testing/voice-tests").then(res => setTests(res.data)).catch(() => {});
  useEffect(() => { loadTests(); return () => clientRef.current?.stopCall(); }, []);

  useEffect(() => {
    setContext(null);
    setCampaignId("");
    if (!orgId) return;
    adminApi.get(`/ops/ai-testing/organizations/${orgId}/context`)
      .then(res => setContext(res.data))
      .catch(err => setError(errorText(err, "Organization campaigns could not be loaded.")));
  }, [orgId]);

  const campaign = context?.campaigns?.find(item => item.id === campaignId);
  const voiceCampaigns = (context?.campaigns ?? []).filter(item => item.voiceTestable || item.simulationTestable);

  const start = async kind => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { data } = await adminApi.post("/ops/ai-testing/voice-tests", { organizationId: orgId, campaignId, kind, ...overrides }, { timeout: 120000 });
      if (kind === "web_call") {
        const { RetellWebClient } = await import("retell-client-js-sdk");
        const client = new RetellWebClient();
        clientRef.current = client;
        client.on("call_started", () => setCallState("connected"));
        client.on("call_ended", () => { setCallState("ended"); loadTests(); });
        client.on("error", () => { setCallState("error"); client.stopCall(); });
        setCallState("connecting");
        await client.startCall({ accessToken: data.accessToken });
      } else {
        setNotice(`Simulation started (${data.total ?? 10} scenarios). Use Refresh on the test below to see results.`);
      }
      loadTests();
    } catch (err) {
      setCallState("idle");
      setError(errorText(err, "Test could not be started."));
    } finally {
      setBusy(false);
    }
  };

  const refresh = async id => {
    try {
      await adminApi.post(`/ops/ai-testing/voice-tests/${id}/refresh`, {}, { timeout: 60000 });
      loadTests();
    } catch (err) {
      setError(errorText(err, "Test result could not be refreshed."));
    }
  };

  const feedback = async (id, rating) => {
    const text = window.prompt("Optional notes about this test:") ?? "";
    try {
      await adminApi.post(`/ops/ai-testing/voice-tests/${id}/feedback`, { rating, feedback: text });
      loadTests();
    } catch (err) {
      setError(errorText(err, "Feedback could not be saved."));
    }
  };

  const inCall = callState === "connecting" || callState === "connected";

  return (
    <Section eyebrow="Staff test" title="Voice agent testing">
      <div className="notice-warn" style={{ marginBottom: 12, lineHeight: 1.5 }}>
        <strong>STAFF TEST.</strong> Test calls run in this browser with fake test details. No real lead is ever called. Tests are recorded in the admin audit log, do not use the customer’s credits, and do not appear in the customer’s call history, analytics, or billing.
      </div>
      <div className="row wrap" style={{ gap: 12, alignItems: "flex-end" }}>
        <Field label="Organization">
          <select className="input" value={orgId} onChange={event => setOrgId(event.target.value)} style={{ height: 38 }}>
            <option value="">Choose an organization…</option>
            {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>
        </Field>
        <Field label="Voice campaign">
          <select className="input" value={campaignId} onChange={event => setCampaignId(event.target.value)} disabled={!context} style={{ height: 38 }}>
            <option value="">{context && voiceCampaigns.length === 0 ? "No prepared AI voice campaigns" : "Choose a campaign…"}</option>
            {voiceCampaigns.map(item => <option key={item.id} value={item.id}>{item.name} · {item.status}{item.published ? " · live agent" : " · draft agent"}</option>)}
          </select>
        </Field>
      </div>
      {context?.effectiveVoiceSettings ? (
        <p className="faint" style={{ margin: "10px 0 0", fontSize: 12.5 }}>
          This organization currently uses voice <strong>{context.effectiveVoiceSettings.voiceId}</strong> ({context.effectiveVoiceSettings.source.voice}) and model <strong>{context.effectiveVoiceSettings.model}</strong> ({context.effectiveVoiceSettings.source.model}).
        </p>
      ) : null}

      {campaign ? (
        <div style={{ marginTop: 16 }}>
          <span className="eyebrow">Try a different voice or model for this test only</span>
          <div style={{ marginTop: 8 }}>
            <VoiceModelPicker catalog={catalog} value={overrides} onChange={setOverrides} />
          </div>
          <div className="row wrap" style={{ gap: 8, marginTop: 14 }}>
            {inCall ? (
              <button className="btn btn-primary btn-sm" type="button" onClick={() => { clientRef.current?.stopCall(); setCallState("ended"); }}>
                <Icon name="pause" size={14} color="#06231a" /> End test call ({callState})
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" type="button" disabled={busy || !campaign.voiceTestable} onClick={() => start("web_call")}>
                <Icon name="phone" size={14} color="#06231a" /> Start test call in browser
              </button>
            )}
            <button className="btn btn-ghost btn-sm" type="button" disabled={busy || inCall || !campaign.simulationTestable} onClick={() => start("simulation")}>
              <Icon name="play" size={14} /> Run simulation (text, model only)
            </button>
          </div>
        </div>
      ) : null}

      <h3 style={{ fontSize: 14, margin: "22px 0 8px" }}>Recent staff tests</h3>
      {!tests.available ? <div className="notice-warn">Staff test history table is not in the database yet; tests still run and are recorded in the audit log.</div> : null}
      <div className="card table-shell">
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 900 }}>
            <thead><tr>{["Time", "Organization / campaign", "Type", "Voice / model", "Result", "Feedback", ""].map(header => <th key={header}>{header}</th>)}</tr></thead>
            <tbody>
              {tests.items.length === 0 ? <tr><td colSpan={7} className="table-empty">No staff tests yet.</td></tr> : tests.items.map(test => (
                <tr className="data-row" key={test.id}>
                  <td><span className="faint">{new Date(test.created_at).toLocaleString()}</span></td>
                  <td><strong>{test.organization_name}</strong><div className="faint">{test.campaign_name}</div></td>
                  <td><span className="chip">{test.kind === "web_call" ? "test call" : "simulation"}</span></td>
                  <td>{test.voice_id || "current voice"}<div className="faint">{test.model || "current model"}</div></td>
                  <td>
                    <span className="chip">{test.status}</span>
                    {test.results?.passed != null ? <div className="faint">{test.results.passed}/{test.results.total} passed</div> : null}
                    {test.results?.durationMs != null ? <div className="faint">{Math.round(test.results.durationMs / 1000)}s · {test.results.disconnectionReason || ""}</div> : null}
                  </td>
                  <td>{test.feedback_rating ? <span className="chip">{test.feedback_rating.replace("_", " ")}</span> : (
                    <div className="row" style={{ gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" type="button" onClick={() => feedback(test.id, "good")}>Good</button>
                      <button className="btn btn-ghost btn-sm" type="button" onClick={() => feedback(test.id, "needs_improvement")}>Needs work</button>
                    </div>
                  )}</td>
                  <td><button className="btn btn-ghost btn-sm" type="button" onClick={() => refresh(test.id)}><Icon name="refresh" size={13} /> Refresh</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

function TextGenerationSection({ organizations, setError }) {
  const [orgId, setOrgId] = useState("");
  const [context, setContext] = useState(null);
  const [campaignId, setCampaignId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [replyId, setReplyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setContext(null);
    setCampaignId("");
    setLeadId("");
    setReplyId("");
    setResult(null);
    if (!orgId) return;
    adminApi.get(`/ops/ai-testing/organizations/${orgId}/context`)
      .then(res => setContext(res.data))
      .catch(err => setError(errorText(err, "Organization data could not be loaded.")));
  }, [orgId]);

  const tests = [
    { label: "Generate email: step 1 (cold intro)", url: "generate-email", body: { campaignId, leadId, stepNumber: 1 }, disabled: !campaignId || !leadId },
    { label: "Generate email: step 2 (follow-up)", url: "generate-email", body: { campaignId, leadId, stepNumber: 2 }, disabled: !campaignId || !leadId },
    { label: "Generate email: step 3 (breakup)", url: "generate-email", body: { campaignId, leadId, stepNumber: 3 }, disabled: !campaignId || !leadId },
    { label: "Generate voice prompt", url: "generate-voice-prompt", body: { campaignId }, disabled: !campaignId },
    { label: "Generate reply", url: "generate-reply", body: { emailReplyId: replyId }, disabled: !replyId },
  ];

  const call = async test => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await adminApi.post(`/ops/ai-testing/${test.url}`, { organizationId: orgId, ...test.body }, { timeout: 90000 });
      setResult({ name: test.label, data });
    } catch (err) {
      setError(errorText(err, "AI generation failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section eyebrow="Staff test" title="Email, reply, and voice prompt generation">
      <p className="muted" style={{ marginTop: 0 }}>Runs the same AI generation customers get, for any organization. Staff runs do not use the customer’s credits.</p>
      <div className="row wrap" style={{ gap: 12 }}>
        <Field label="Organization">
          <select className="input" value={orgId} onChange={event => setOrgId(event.target.value)} style={{ height: 38 }}>
            <option value="">Choose an organization…</option>
            {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>
        </Field>
        <Field label="Campaign">
          <select className="input" value={campaignId} onChange={event => setCampaignId(event.target.value)} disabled={!context} style={{ height: 38 }}>
            <option value="">Choose a campaign…</option>
            {(context?.campaigns ?? []).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </Field>
        <Field label="Lead">
          <select className="input" value={leadId} onChange={event => setLeadId(event.target.value)} disabled={!context} style={{ height: 38 }}>
            <option value="">Choose a lead…</option>
            {(context?.leads ?? []).map(item => <option key={item.id} value={item.id}>{item.label}{item.company ? ` · ${item.company}` : ""}</option>)}
          </select>
        </Field>
        <Field label="Reply (for generate reply)">
          <select className="input" value={replyId} onChange={event => setReplyId(event.target.value)} disabled={!context} style={{ height: 38 }}>
            <option value="">Choose a reply…</option>
            {(context?.replies ?? []).map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="row wrap" style={{ gap: 8, marginTop: 14 }}>
        {tests.map(test => (
          <button key={test.label} className="btn btn-ghost btn-sm" type="button" disabled={!orgId || loading || test.disabled} onClick={() => call(test)}>{test.label}</button>
        ))}
      </div>
      {loading ? <div className="soft-empty" style={{ marginTop: 12 }}><Spinner size={16} /> Generating… (takes 3–8 seconds)</div> : null}
      {result ? (
        <div className="notice-good" style={{ marginTop: 14, lineHeight: 1.55 }}>
          <strong>{result.name}</strong>
          {result.data.subject ? <div style={{ marginTop: 10 }}><span className="eyebrow">Subject</span><div style={{ fontWeight: 700 }}>{result.data.subject}</div></div> : null}
          {result.data.body ? <div style={{ marginTop: 10 }}><span className="eyebrow">Body</span><div style={{ whiteSpace: "pre-wrap" }}>{result.data.body}</div></div> : null}
          {result.data.prompt ? <div style={{ marginTop: 10 }}><span className="eyebrow">Voice prompt</span><div style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{result.data.prompt}</div></div> : null}
        </div>
      ) : null}
    </Section>
  );
}

export default function AiTestingPanel({ organizations, setError, setNotice, onOverridesChanged }) {
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    adminApi.get("/ops/ai-testing/catalog", { timeout: 20000 })
      .then(res => setCatalog(res.data))
      .catch(err => setError(errorText(err, "Voice and model list could not be loaded.")));
  }, []);

  const sortedOrganizations = useMemo(
    () => [...(organizations ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [organizations],
  );

  return (
    <div className="col" style={{ gap: 16 }}>
      <VoiceTestSection catalog={catalog} organizations={sortedOrganizations} setError={setError} setNotice={setNotice} />
      <VoiceSettingsSection catalog={catalog} organizations={sortedOrganizations} setError={setError} setNotice={setNotice} onOverridesChanged={onOverridesChanged} />
      <TextGenerationSection organizations={sortedOrganizations} setError={setError} />
    </div>
  );
}
