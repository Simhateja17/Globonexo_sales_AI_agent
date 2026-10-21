"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { canSee } from "../../../lib/access";
import Icon from "../../../components/ui/Icon";

const STATUS_STYLES = {
  active: { label: "Active", cls: "pl-ok" },
  paused: { label: "Paused", cls: "pl-warn" },
  draft: { label: "Draft", cls: "pl-mute" },
  completed: { label: "Completed", cls: "pl-info" },
};

const CHANNEL_ICON_STYLES = {
  email: { background: "#e0f2fe", color: "#0369a1" },
  voice: { background: "#f3efff", color: "#6741c9" },
  both: { background: "#ecfdf3", color: "#088256" },
};

const CHANNEL_LABELS = {
  email: "Email",
  voice: "Voice",
  both: "Email + Voice",
};

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function CampaignSkeleton() {
  return (
    <div className="col" style={{ gap: 12 }}>
      {[0, 1, 2].map(item => (
        <div key={item} className="card" style={{ padding: 18 }}>
          <div className="row spread">
            <div className="row" style={{ gap: 12 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--bg-2)" }} />
              <div className="col" style={{ gap: 8 }}>
                <span style={{ width: 220, height: 14, borderRadius: 99, background: "var(--bg-2)" }} />
                <span style={{ width: 150, height: 10, borderRadius: 99, background: "var(--line-2)" }} />
              </div>
            </div>
            <span style={{ width: 104, height: 30, borderRadius: 99, background: "var(--bg-2)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function leadLabel(lead) {
  const name = lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unnamed lead";
  const detail = [lead.title, lead.company].filter(Boolean).join(" · ");
  return detail ? `${name} · ${detail}` : name;
}

function CampaignSettingsDrawer({
  campaign,
  assignedLeads,
  availableLeads,
  selectedLeadIds,
  onSelectedLeadIdsChange,
  loading,
  busy,
  error,
  onClose,
  onAdd,
  onRemove,
}) {
  if (!campaign) return null;

  return (
    <div
      role="presentation"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(6, 35, 26, .22)", display: "flex", justifyContent: "flex-end" }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-settings-title"
        style={{ width: "min(720px, 100vw)", height: "100%", overflowY: "auto", background: "#fff", boxShadow: "-18px 0 50px rgba(6, 35, 26, .16)", padding: 24 }}
      >
        <div className="row spread" style={{ gap: 16, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <span className="eyebrow">Campaign settings</span>
            <h2 id="campaign-settings-title" style={{ margin: "4px 0 0", fontSize: 22 }}>{campaign.name}</h2>
            <p className="faint" style={{ marginTop: 5 }}>{CHANNEL_LABELS[campaign.channel]} · {assignedLeads.length} assigned lead{assignedLeads.length === 1 ? "" : "s"}</p>
          </div>
          <button className="btn btn-ghost btn-sm" type="button" onClick={onClose}>
            <Icon name="close" size={16} /> Close
          </button>
        </div>

        {error ? <div className="notice-warn" style={{ marginTop: 16 }}>{error}</div> : null}

        <div className="card" style={{ marginTop: 18, padding: 16, borderRadius: 8 }}>
          <div className="row spread" style={{ gap: 12, alignItems: "flex-end" }}>
            <label className="field" style={{ flex: 1 }}>
              <span>Add lead to campaign</span>
              <select
                className="input"
                value={selectedLeadIds[0] || ""}
                onChange={event => onSelectedLeadIdsChange(event.target.value ? [event.target.value] : [])}
                disabled={loading || busy}
              >
                <option value="">Choose an existing prospect</option>
                {availableLeads.map(lead => <option key={lead.id} value={lead.id}>{leadLabel(lead)}</option>)}
              </select>
            </label>
            <button className="btn btn-primary btn-sm" type="button" onClick={onAdd} disabled={busy || selectedLeadIds.length === 0}>
              <Icon name="plus" size={15} color="#06231a" /> Add lead
            </button>
          </div>
          <p className="faint" style={{ marginTop: 10, fontSize: 12.5 }}>Existing prospects can be added without recreating them.</p>
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="row spread" style={{ marginBottom: 10 }}>
            <strong>Assigned leads</strong>
            {loading ? <span className="faint">Loading...</span> : null}
          </div>
          <div className="card table-shell">
            <div className="table-scroll">
              <table className="data-table" style={{ minWidth: 560 }}>
                <thead><tr>{["Lead", "Status", ""].map(header => <th key={header}>{header}</th>)}</tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={3} className="table-empty">Loading campaign leads...</td></tr>
                  ) : assignedLeads.length === 0 ? (
                    <tr><td colSpan={3} className="table-empty">No leads are attached to this campaign.</td></tr>
                  ) : assignedLeads.map(lead => (
                    <tr className="data-row" key={lead.id}>
                      <td><strong style={{ fontSize: 14 }}>{leadLabel(lead)}</strong><div className="faint">{lead.email || lead.phone || "No contact yet"}</div></td>
                      <td><span className="chip">{lead.campaignMembership?.qualificationStatus || lead.status || "selected"}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-ghost btn-sm danger-text" type="button" disabled={busy} onClick={() => onRemove(lead)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, enrolled: 0, sent: 0, meetings: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("mine");
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [settingsCampaign, setSettingsCampaign] = useState(null);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data }, teamResult] = await Promise.all([
        api.get("/campaigns"),
        api.get("/team").catch(() => ({ data: null })),
      ]);
      setCampaigns(Array.isArray(data?.items) ? data.items : []);
      setSummary(data?.summary ?? { total: 0, active: 0, enrolled: 0, sent: 0, meetings: 0 });
      setTeam(teamResult.data ?? null);
    } catch (err) {
      setError(err?.response?.data?.error || "Campaigns could not be loaded. Check the API server and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const filteredCampaigns = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return campaigns.filter(campaign => {
      const statusMatch = statusFilter === "all" || campaign.status === statusFilter;
      const assignmentMatch = assignmentFilter === "all"
        || (assignmentFilter === "unassigned" && !campaign.assignedUserId)
        || (assignmentFilter === "mine" && (!team?.viewer?.id || campaign.assignedUserId === team.viewer.id));
      const textMatch =
        !needle ||
        campaign.name?.toLowerCase().includes(needle) ||
        CHANNEL_LABELS[campaign.channel]?.toLowerCase().includes(needle);
      return statusMatch && assignmentMatch && textMatch;
    });
  }, [campaigns, search, statusFilter, assignmentFilter, team]);

  const setCampaignInList = updated => {
    setCampaigns(current => current.map(campaign => (campaign.id === updated.id ? updated : campaign)));
  };

  const loadCampaignSettings = useCallback(async campaign => {
    if (!campaign) return;
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const [assignedResult, allResult] = await Promise.all([
        api.get("/leads", { params: { campaignId: campaign.id, perPage: 200 } }),
        api.get("/leads", { params: { perPage: 500 } }),
      ]);
      const assigned = Array.isArray(assignedResult.data?.items) ? assignedResult.data.items : [];
      const all = Array.isArray(allResult.data?.items) ? allResult.data.items : [];
      const assignedIds = new Set(assigned.map(lead => lead.id));
      setAssignedLeads(assigned);
      setAvailableLeads(all.filter(lead => !assignedIds.has(lead.id)));
      setSelectedLeadIds([]);
    } catch (err) {
      setSettingsError(err?.response?.data?.error || "Campaign settings could not be loaded.");
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  const openCampaignSettings = campaign => {
    setSettingsCampaign(campaign);
    setAssignedLeads([]);
    setAvailableLeads([]);
    setSelectedLeadIds([]);
    loadCampaignSettings(campaign);
  };

  const addSelectedLeads = async () => {
    if (!settingsCampaign || selectedLeadIds.length === 0) return;
    setSettingsBusy(true);
    setSettingsError("");
    try {
      await api.post(`/campaigns/${settingsCampaign.id}/assign-leads`, { leadIds: selectedLeadIds });
      await Promise.all([loadCampaignSettings(settingsCampaign), loadCampaigns()]);
    } catch (err) {
      setSettingsError(err?.response?.data?.error || "Lead could not be added to this campaign.");
    } finally {
      setSettingsBusy(false);
    }
  };

  const removeLeadFromCampaign = async lead => {
    if (!settingsCampaign) return;
    const ok = window.confirm(`Remove ${leadLabel(lead)} from "${settingsCampaign.name}"? The prospect record will stay in Prospects.`);
    if (!ok) return;
    setSettingsBusy(true);
    setSettingsError("");
    try {
      await api.post(`/campaigns/${settingsCampaign.id}/remove-leads`, { leadIds: [lead.id] });
      await Promise.all([loadCampaignSettings(settingsCampaign), loadCampaigns()]);
    } catch (err) {
      setSettingsError(err?.response?.data?.error || "Lead could not be removed from this campaign.");
    } finally {
      setSettingsBusy(false);
    }
  };

  const runAction = async (campaign, action) => {
    setBusyId(campaign.id + action);
    setError("");
    try {
      const { data } = await api.post(`/campaigns/${campaign.id}/${action}`);
      setCampaignInList(data);
      await loadCampaigns();
    } catch (err) {
      const details = err?.response?.data?.details;
      const detailText = details && typeof details === "object"
        ? ` Ready: ${details.ready ?? 0}, missing email: ${details.missingEmail ?? 0}, stopped: ${details.stopped ?? 0}.`
        : "";
      setError(`${err?.response?.data?.error || "Campaign action failed. Please try again."}${detailText}`);
    } finally {
      setBusyId("");
    }
  };

  const rebuildVoiceAgent = async campaign => {
    setBusyId(campaign.id + "rebuild");
    setError("");
    try {
      await api.post(`/campaigns/${campaign.id}/prepare`);
      router.push(`/campaigns/${campaign.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Voice agent rebuild could not be started. Please try again.");
      setBusyId("");
    }
  };

  const deleteCampaign = async campaign => {
    const ok = window.confirm(`Delete "${campaign.name}"? This cannot be undone.`);
    if (!ok) return;

    setBusyId(campaign.id + "delete");
    setError("");
    try {
      await api.delete(`/campaigns/${campaign.id}`);
      await loadCampaigns();
    } catch (err) {
      setError(err?.response?.data?.error || "Campaign could not be deleted.");
    } finally {
      setBusyId("");
    }
  };

  const archiveCampaign = async campaign => {
    if (!window.confirm(`Archive "${campaign.name}"? Its history will stay available, but outreach will stop.`)) return;
    setBusyId(campaign.id + "archive");
    setError("");
    try {
      await api.post(`/campaigns/${campaign.id}/archive`);
      await loadCampaigns();
    } catch (err) {
      setError(err?.response?.data?.error || "Campaign could not be archived.");
    } finally {
      setBusyId("");
    }
  };

  const statusCounts = useMemo(() => campaigns.reduce((counts, campaign) => {
    counts[campaign.status] = (counts[campaign.status] || 0) + 1;
    return counts;
  }, {}), [campaigns]);

  const metrics = [
    { k: "Active campaigns", v: summary.active, d: `of ${summary.total} in this workspace`, icon: "send" },
    { k: "Enrolled leads", v: summary.enrolled, d: "across all campaigns", icon: "users" },
    { k: "Messages sent", v: summary.sent, d: "emails and calls", icon: "mail" },
    { k: "Meetings booked", v: summary.meetings, d: "from campaigns", icon: "calendar" },
  ];

  return (
    <main className="gx campaigns-page">
      <div className="ph">
        <div>
          <h1>Campaigns</h1>
          <p>{summary.total} campaigns · {summary.active} active · {summary.sent} messages sent</p>
        </div>
        <div className="acts">
          <button type="button" className="bt bt-p" onClick={() => router.push("/campaigns/new")}>
            <Icon name="plus" size={15} color="#06231a" /> New campaign
          </button>
        </div>
      </div>

      <div className="kpis" data-tour="campaigns-metrics" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {metrics.map(metric => (
          <div key={metric.k} className="kpi">
            <div className="kpi-top">{metric.k}<span className="kpi-ic"><Icon name={metric.icon} size={16} /></span></div>
            <b>{metric.v}</b>
            <small>{metric.d}</small>
          </div>
        ))}
      </div>

      <div className="ctools" style={{ flexWrap: "wrap" }}>
        <div className="seg" role="tablist" aria-label="Status">
          {["all", "active", "paused", "draft", "completed"].map(status => (
            <button key={status} type="button" role="tab" aria-selected={statusFilter === status} className={statusFilter === status ? "on" : ""} onClick={() => setStatusFilter(status)}>
              {status === "all" ? "All" : STATUS_STYLES[status].label} <em>{status === "all" ? campaigns.length : statusCounts[status] || 0}</em>
            </button>
          ))}
        </div>
        <div className="seg" role="tablist" aria-label="Owner">
          {[["mine", "Mine"], ["all", "Everyone"], ["unassigned", "Unassigned"]].map(([value, label]) => (
            <button key={value} type="button" role="tab" aria-selected={assignmentFilter === value} className={assignmentFilter === value ? "on" : ""} onClick={() => setAssignmentFilter(value)}>{label}</button>
          ))}
        </div>
        <label className="inp" style={{ marginLeft: "auto", width: 300, maxWidth: "100%" }}>
          <Icon name="search" size={15} />
          <input placeholder="Search campaigns…" aria-label="Search campaigns" value={search} onChange={event => setSearch(event.target.value)} />
        </label>
      </div>

      {error && <div className="note">{error}</div>}

      {loading ? (
        <CampaignSkeleton />
      ) : filteredCampaigns.length === 0 ? (
        <div className="card empty" style={{ padding: 40 }}>
          <span className="need-ic" style={{ margin: "0 auto" }}><Icon name="send" size={20} /></span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "#0a1712", margin: "14px 0 0" }}>No campaigns found</h2>
          <p style={{ margin: "8px auto 0", maxWidth: 420, lineHeight: 1.5 }}>
            Create a campaign with a channel, name, ICP source, send cap, and working hours.
          </p>
          <button type="button" className="bt bt-p" style={{ marginTop: 18 }} onClick={() => router.push("/campaigns/new")}>
            <Icon name="plus" size={15} color="#06231a" /> New campaign
          </button>
        </div>
      ) : (
        filteredCampaigns.map(campaign => {
          const viewer = team?.viewer;
          const canOperate = !viewer || ['owner', 'admin'].includes(viewer.role) || campaign.assignedUserId === viewer.id;
          const canDelete = canSee(viewer?.role, 'campaign.delete');
          const assignee = team?.members?.find(member => member.id === campaign.assignedUserId);
          const statusStyle = STATUS_STYLES[campaign.status] ?? STATUS_STYLES.draft;
          const primaryAction = campaign.status === "active" ? "pause" : "launch";
          const hasReadyLeads = (campaign.stats?.ready ?? 0) > 0;
          const launchBlocked = primaryAction === "launch" && campaign.channel === "email" && !hasReadyLeads;
          const primaryLabel = campaign.status === "active" ? "Pause" : launchBlocked ? "Needs email" : "Launch";
          const actionBusy = busyId === campaign.id + primaryAction;
          const rebuildBusy = busyId === campaign.id + "rebuild";
          const enrolled = campaign.stats?.enrolled ?? 0;
          const ready = campaign.stats?.ready ?? 0;
          const progress = enrolled > 0 ? Math.min(100, Math.round((ready / enrolled) * 100)) : 0;
          const stop = event => event.stopPropagation();
          return (
            <div
              key={campaign.id}
              className="card cc"
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/campaigns/${campaign.id}`)}
              onKeyDown={event => {
                if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  router.push(`/campaigns/${campaign.id}`);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="cc-head" style={{ flexWrap: "wrap" }}>
                <span className="cc-ic" style={CHANNEL_ICON_STYLES[campaign.channel] || CHANNEL_ICON_STYLES.email}>
                  <Icon name={campaign.channel === "voice" ? "phone" : "send"} size={19} />
                </span>
                <div className="cc-name">
                  <b className="ellip">{campaign.name}</b>
                  <small>
                    {CHANNEL_LABELS[campaign.channel]} · Created {formatDate(campaign.createdAt)}{assignee ? ` · Assigned to ${[assignee.first_name, assignee.last_name].filter(Boolean).join(' ') || assignee.email}` : ' · Unassigned'}
                  </small>
                </div>
                {!canOperate ? <span className="muted" style={{ fontSize: 12, fontWeight: 800 }}>View only</span> : null}
                <span className={`pl ${statusStyle.cls}`}><u />{statusStyle.label}</span>
                <div className="acts" onClick={stop}>
                  {canOperate && campaign.status === "paused" && campaign.channel === "voice" ? (
                    <button type="button" className="bt bt-p sm" disabled={rebuildBusy} onClick={() => rebuildVoiceAgent(campaign)}>
                      <Icon name="refresh" size={14} color="#06231a" /> {rebuildBusy ? "Rebuilding..." : "Rebuild agent"}
                    </button>
                  ) : null}
                  {canOperate && campaign.status !== "completed" && (
                    <button
                      type="button"
                      className="bt bt-g sm"
                      disabled={actionBusy || launchBlocked}
                      title={launchBlocked ? "Reveal or upload lead emails before launching." : undefined}
                      onClick={() => runAction(campaign, primaryAction)}
                    >
                      <Icon name={primaryAction === "pause" ? "pause" : "play"} size={14} /> {actionBusy ? "Working..." : primaryLabel}
                    </button>
                  )}
                  {canOperate && (
                    <button type="button" className="bt bt-g sm" onClick={() => openCampaignSettings(campaign)}>
                      <Icon name="cog" size={14} /> Settings
                    </button>
                  )}
                  {canOperate && !campaign.archivedAt && (
                    <button type="button" className="bt bt-g sm" disabled={busyId === campaign.id + "archive"} onClick={() => archiveCampaign(campaign)}>
                      {busyId === campaign.id + "archive" ? "Archiving..." : "Archive"}
                    </button>
                  )}
                  {canDelete && (
                    <button type="button" className="ibt" aria-label={`Delete ${campaign.name}`} disabled={busyId === campaign.id + "delete"} onClick={() => deleteCampaign(campaign)}>
                      <Icon name="trash" size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="cc-body">
                <div>
                  <div className="cc-pt"><b>{ready} of {enrolled}</b> ready<span>{campaign.stats?.sent ?? 0} sent</span></div>
                  <div className="bar"><u style={{ width: `${progress}%` }} /></div>
                </div>
                <div className="cc-stats">
                  {[
                    ["Enrolled", enrolled],
                    ["Ready", ready],
                    ["Missing email", campaign.stats?.missingEmail ?? 0],
                    ["Queued", campaign.stats?.queued ?? 0],
                    ["Sent", campaign.stats?.sent ?? 0],
                    ["Meetings", campaign.stats?.meetings ?? 0],
                  ].map(([key, value]) => (
                    <div key={key}><small>{key}</small><b>{value}</b></div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
      <CampaignSettingsDrawer
        campaign={settingsCampaign}
        assignedLeads={assignedLeads}
        availableLeads={availableLeads}
        selectedLeadIds={selectedLeadIds}
        onSelectedLeadIdsChange={setSelectedLeadIds}
        loading={settingsLoading}
        busy={settingsBusy}
        error={settingsError}
        onClose={() => setSettingsCampaign(null)}
        onAdd={addSelectedLeads}
        onRemove={removeLeadFromCampaign}
      />
    </main>
  );
}
