"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SenderPicker from "@/components/campaigns/SenderPicker";
import CampaignSettingsForm from "@/components/campaigns/CampaignSettingsForm";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "../../../../lib/api";
import { canSee } from "../../../../lib/access";
import Icon from "../../../../components/ui/Icon";
import Avatar from "../../../../components/ui/Avatar";
import Spinner from "../../../../components/ui/Spinner";
import { isValidEmail } from "../../../../lib/validation";
import { leadPhoto } from "../../../../lib/lead-photo";
import { FREE_PLAN, isFreePlan, upgradePlan, useOrg } from "../../../../lib/free-plan";
import useFreeUsage from "../../../../hooks/useFreeUsage";
import { campaignLifecycle } from "../../../../lib/campaign-state";
import StateNote from "../../../../components/ui/StateNote";
import DraftReview from "../../../../components/campaigns/DraftReview";
import LeadDetailModal from "../../../../components/leads/LeadDetailModal";
import SendEmailDialog from "../../../../components/leads/SendEmailDialog";
import { readinessEmailLabel, writingCounts } from "../../../../lib/lead-outreach";
import CampaignPreparationPanel from "./CampaignPreparationPanel";
import { browserTimezone, campaignReadyCount, canCallLeadImmediately, formatScheduledInTimezone, voiceLaunchGate } from "../../../../lib/campaign-display";
import { immediateEmailBlockReason } from "../../../../lib/manual-outreach";
import { ACTIVE_ATTEMPT_STATUSES, CALL_NOW_ACTIVE_LIMIT, callNowLimitFromError, outreachAttemptLabel } from "../../../../lib/outreach-status";

const STATUS_STYLES = {
  active: { label: "Active", cls: "pl-ok" },
  paused: { label: "Paused", cls: "pl-warn" },
  draft: { label: "Draft", cls: "pl-mute" },
  completed: { label: "Completed", cls: "pl-info" },
};

const CHANNEL_STYLES = {
  email: { label: "Email", bg: "#e0f2fe", color: "#0369a1" },
  voice: { label: "Voice", bg: "#f0fdf4", color: "#15803d" },
  both: { label: "Email + Voice", bg: "#ede9fe", color: "#6d28d9" },
};

const usesEmail = channel => channel === "email" || channel === "both";
const usesVoice = channel => channel === "voice" || channel === "both";

const LEAD_STATUS_LABELS = {
  new: "New",
  queued: "Queued",
  contacted: "Contacted",
  engaged: "Engaged",
  meeting_booked: "Meeting set",
  not_interested: "Not interested",
  unsubscribed: "Unsubscribed",
  enrichment_failed: "Needs enrichment",
};

const STOPPED_STATUSES = new Set(["engaged", "meeting_booked", "not_interested", "unsubscribed"]);

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span className={`pl ${s.cls}`}><u />{s.label}</span>
  );
}

function ChannelBadge({ channel }) {
  const c = CHANNEL_STYLES[channel] ?? CHANNEL_STYLES.email;
  return (
    <span className="pl" style={{ background: c.bg, color: c.color }}>
      {usesEmail(channel) && <Icon name="mail" size={12} />}
      {usesVoice(channel) && <Icon name="phone" size={12} />}
      {c.label}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function leadName(lead) {
  return lead.name || [lead.firstName ?? lead.first_name, lead.lastName ?? lead.last_name].filter(Boolean).join(" ") || "Unnamed lead";
}

function leadStatusStyle(status) {
  const color = {
    new: "#9aa8a0",
    queued: "#7c8bf0",
    contacted: "#15c4c0",
    engaged: "#00a86a",
    meeting_booked: "#00c27a",
    not_interested: "#f59e0b",
    unsubscribed: "#ef4444",
    enrichment_failed: "#f97316",
  }[status] || "#9aa8a0";
  return { background: `${color}1f`, color, border: `1px solid ${color}45` };
}

function campaignEligibility(lead) {
  const membership = lead.campaignMembership;
  if (!membership || membership.qualificationStatus === "qualified") return null;
  const reason = membership.rejectionReason || lead.rejectionReason;
  const labels = {
    dnc_found: "Blocked: DNC match",
    dnc_pending: "Awaiting DNC check",
    dnc_missing: "DNC check required",
    internal_do_not_call: "Blocked: do not call",
    no_phone: "Missing phone",
    invalid_phone: "Invalid phone",
    enrichment_not_attempted_budget: "Not enriched: campaign budget reached",
    missing_identity: "Missing identity data",
  };
  return {
    label: labels[reason] || (membership.qualificationStatus === "pending" ? "Preparing" : "Not eligible"),
    blocked: membership.status === "blocked" || membership.qualificationStatus === "rejected",
  };
}

function CampaignLeadRow({ lead, attempt, displayTimezone, campaignStatus, showEmail, showPhone, isAiVoice, actionKey, onEmailNow, onCallNow, onOpen, canOperate = true, callNowLimit = null, emailReadiness = null }) {
  const status = lead.status || "new";
  const hasEmail = isValidEmail(lead.email || "");
  const hasPhone = Boolean(lead.phone?.trim());
  const stopped = STOPPED_STATUSES.has(status);
  const eligibility = campaignEligibility(lead);
  const campaignBlocked = Boolean(eligibility?.blocked || (lead.campaignMembership && lead.campaignMembership.qualificationStatus !== "qualified"));
  // A lead still being prepared can be emailed: the email dialog shows it
  // being written, or lets the person write it. Only a rejected or blocked
  // lead is out of reach.
  const emailBlockReason = immediateEmailBlockReason({ hasEmail, campaignId: lead.campaignId, status, campaignBlocked: Boolean(eligibility?.blocked) });
  const bounced = lead.emailStatus === "bounced";
  const emailState = showEmail ? readinessEmailLabel(emailReadiness) : null;
  const writing = emailState?.tone === "busy";
  const canEmailNow = canOperate && showEmail && !emailBlockReason && !bounced && !writing;
  const canCallNow = canOperate && canCallLeadImmediately({
    campaignStatus,
    showPhone,
    isAiVoice,
    hasPhone,
    hasCampaign: Boolean(lead.campaignId),
    stopped,
    campaignBlocked,
  });
  const sending = actionKey === `email:${lead.id}`;
  const calling = actionKey === `call:${lead.id}`;

  return (
    <tr
      onClick={() => onOpen(lead.id)}
      tabIndex={0}
      title="Open lead details"
      onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onOpen(lead.id); } }}
    >
      <td>
        <div className="who">
          <Avatar name={leadName(lead)} src={leadPhoto(lead) || undefined} size={34} />
          <div style={{ minWidth: 0 }}>
            <b className="ellip">{leadName(lead)}</b>
            <small className="ellip">{lead.title || "No title"} · {lead.company || "No company"}</small>
          </div>
        </div>
      </td>
      {showEmail && <td><span style={{ fontWeight: 700, fontSize: 13 }}>{lead.email || "Not revealed"}</span></td>}
      {showPhone && <td><span style={{ fontWeight: 700, fontSize: 13 }}>{lead.phone || "No phone"}</span></td>}
      <td>
        <div className="col" style={{ gap: 4, alignItems: "flex-start" }}>
          <span className="pl" style={{ ...leadStatusStyle(status), border: 0 }}>{LEAD_STATUS_LABELS[status] || status.replace(/_/g, " ")}</span>
          {bounced && <span className="pl pl-bad" title="This address could not receive email. No more emails go to it.">Email bounced</span>}
          {emailState ? (
            <span className="faint row" style={{ fontSize: 11.5, gap: 5, color: emailState.tone === "warn" ? "#b54708" : undefined }}>
              {writing ? <Spinner size={10} /> : null}{emailState.label}
            </span>
          ) : eligibility ? <span className="faint" style={{ fontSize: 11.5 }}>{eligibility.label}</span> : null}
        </div>
      </td>
      <td>
        {attempt ? (
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 12.5 }}>{attempt.scheduled_at ? formatScheduledInTimezone(attempt.scheduled_at, displayTimezone) : "Not scheduled"}</strong>
            <span className="faint" style={{ fontSize: 11.5 }}>{attempt.blocked_reason ? outreachAttemptLabel(attempt) : `${outreachAttemptLabel(attempt)} · ${attempt.lead_timezone || "timezone required"}`}</span>
          </div>
        ) : <span className="faint" style={{ fontSize: 12 }}>Not scheduled</span>}
      </td>
      <td onClick={event => event.stopPropagation()}>
        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
          {showEmail && (
            <button
              className="bt bt-g sm"
              type="button"
              disabled={!canEmailNow || Boolean(actionKey)}
              title={!hasEmail ? "Lead needs an email" : bounced ? "This address bounced, so emails to it are stopped" : stopped ? "Sequence is stopped for this lead" : eligibility?.blocked ? eligibility.label || "Lead is not ready" : writing ? "Your agent is writing this email" : "Read this lead's email, then send it"}
              style={{ height: 32, padding: "0 10px", fontSize: 12, whiteSpace: "nowrap" }}
              onClick={() => onEmailNow(lead.id)}
            >
              <Icon name={emailState?.tone === "warn" ? "edit" : "send"} size={13} /> {sending ? "Sending..." : writing ? "Writing email…" : emailState?.action === "details" ? "Add details" : emailState?.tone === "warn" ? "Write email" : "Email immediately"}
            </button>
          )}
          {showPhone && (
            <button
              className="bt bt-g sm"
              type="button"
              disabled={!canCallNow || Boolean(callNowLimit) || Boolean(actionKey)}
              title={!isAiVoice ? "Immediate calls are available for AI voice campaigns" : !hasPhone ? "Lead needs a phone number" : campaignBlocked ? eligibility?.label || "Lead is not ready" : stopped ? "Calls are stopped for this lead" : callNowLimit ? callNowLimit.message : "Call this lead now"}
              style={{ height: 32, padding: "0 10px", fontSize: 12, whiteSpace: "nowrap" }}
              onClick={() => onCallNow(lead.id)}
            >
              <Icon name="phone" size={13} /> {calling ? "Calling..." : "Call immediately"}
            </button>
          )}
        </div>
      </td>
      <td style={{ whiteSpace: "normal" }}><span className="faint" style={{ fontSize: 13, lineHeight: 1.35, display: "block" }}>{lead.location || "-"}</span></td>
    </tr>
  );
}

// The four-stage strip under the header: what has happened to this campaign and
// what is waiting on a person. Built only from numbers the page already has.
function CampaignProgress({ campaign, leadCount, preparationDone, drafts, freePlan = false, writing = null }) {
  const stats = campaign?.stats || {};
  const enrolled = stats.enrolled ?? leadCount;
  const missing = Number(stats.missingEmail ?? 0);
  const queued = Number(stats.queued ?? 0);
  const sent = Number(stats.sent ?? 0);
  const written = Number(drafts?.total ?? 0);
  const waiting = Number(drafts?.draft ?? 0);
  // Free brings its own leads, so its audience is done only once leads are in.
  const audienceDone = freePlan ? enrolled > 0 : preparationDone || enrolled > 0;
  const beingWritten = Number(writing?.writing ?? 0);
  const writeYourself = Number(writing?.writeYourself ?? 0);
  const needsDetails = Number(writing?.needsDetails ?? 0);
  const emailsDone = audienceDone && written > 0 && !drafts?.generating && beingWritten === 0 && writeYourself === 0 && needsDetails === 0;
  const approvalsDone = emailsDone && waiting === 0;
  const stages = [
    {
      key: "audience",
      done: audienceDone,
      title: audienceDone ? (freePlan ? "Leads added" : "Audience found") : (freePlan ? "Add your leads" : "Finding your audience"),
      text: audienceDone
        ? `${enrolled} lead${enrolled === 1 ? "" : "s"} enrolled${missing > 0 ? ` · ${missing} without an email` : ""}`
        : freePlan ? "Upload a CSV or add leads by hand" : "Searching and checking contacts before any credits are spent",
    },
    {
      key: "written",
      done: emailsDone,
      title: emailsDone ? "Emails written" : "Writing emails",
      text: emailsDone
        ? `${drafts.steps || 1}-step sequence from verified facts only`
        : beingWritten > 0 ? `Your agent is writing ${beingWritten} email${beingWritten === 1 ? "" : "s"} now`
        : needsDetails > 0 ? `${needsDetails} lead${needsDetails === 1 ? " needs" : "s need"} a job title or company before the email can be written. Open the lead to add it`
        : writeYourself > 0 ? `${writeYourself} email${writeYourself === 1 ? "" : "s"} for you to write${writing?.creditsExhausted ? " · AI credits are used up" : ""}. Open the lead to write it`
        : drafts?.generating ? "Your agent is writing each email now" : freePlan && !audienceDone ? "Starts once you add leads" : freePlan ? "Starts as soon as a lead is added" : "Starts once leads finish enriching",
    },
    {
      key: "approve",
      done: approvalsDone,
      title: approvalsDone ? "Emails approved" : `${waiting} email${waiting === 1 ? "" : "s"} need${waiting === 1 ? "s" : ""} your OK`,
      text: approvalsDone
        ? (drafts?.autopilotEnabled ? "Autopilot approves new emails as they are written" : "Nothing is waiting on you")
        : "Approve below, or turn on autopilot for this campaign",
    },
    {
      key: "sending",
      done: sent > 0 && queued === 0 && approvalsDone,
      title: "Sending",
      text: `${queued} queued · ${sent} sent · 9 AM to 5 PM in each lead's timezone`,
    },
  ];
  const currentIndex = stages.findIndex(stage => !stage.done);
  return (
    <div className="card prep" aria-label="Campaign progress">
      {stages.map((stage, index) => {
        const cls = stage.done ? "" : index === currentIndex ? " cur" : " todo";
        return (
          <div key={stage.key} className={`ps${cls}`}>
            <span className="ps-ic">{stage.done ? <Icon name="check" size={15} color="#fff" /> : index + 1}</span>
            <div><b>{stage.title}</b><small>{stage.text}</small></div>
          </div>
        );
      })}
    </div>
  );
}

const LEADS_PER_PAGE = 10;

export default function CampaignDetailPage() {
  const freePlan = isFreePlan(useOrg());
  const freeLive = useFreeUsage(freePlan);
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaign, setCampaign] = useState(null);
  const [team, setTeam] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadPage, setLeadPage] = useState(1);
  const [detailLeadId, setDetailLeadId] = useState("");
  const [enrichingId, setEnrichingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [launching, setLaunching] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [assignmentBusy, setAssignmentBusy] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [displayTimezone, setDisplayTimezone] = useState(browserTimezone());
  const [preparationData, setPreparationData] = useState(null);
  const [sendLeadId, setSendLeadId] = useState("");
  const [draftSummary, setDraftSummary] = useState(null);
  // Set when the server refuses "Call now" for being over a limit; greys out
  // every Call now button until `until` passes.
  const [callNowLimit, setCallNowLimit] = useState(null);
  const preparationSignatureRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [campaignRes, leadsRes, scheduleRes, settingsRes, teamRes] = await Promise.all([
        api.get(`/campaigns/${id}`),
        api.get("/leads", { params: { campaignId: id, perPage: 500 } }),
        api.get(`/campaigns/${id}/schedule`),
        api.get("/settings").catch(() => ({ data: {} })),
        api.get("/team").catch(() => ({ data: null })),
      ]);
      setCampaign(campaignRes.data);
      setLeads(Array.isArray(leadsRes.data?.items) ? leadsRes.data.items : leadsRes.data ?? []);
      setSchedule(Array.isArray(scheduleRes.data?.items) ? scheduleRes.data.items : []);
      setDisplayTimezone(settingsRes.data?.displayTimezone || settingsRes.data?.profile?.displayTimezone || browserTimezone());
      setTeam(teamRes.data ?? null);
      // A fresh list may show an instant call has finished, so let people try again.
      setCallNowLimit(current => current?.code === CALL_NOW_ACTIVE_LIMIT ? null : current);
    } catch (err) {
      setError(err?.response?.data?.error ?? "Failed to load campaign.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // Leads join the campaign while preparation streams in, so a list loaded on
  // first paint can show 1 lead under a card that already says 25 are done.
  // Refresh the lead list and stats quietly whenever preparation moves.
  const refreshLeads = useCallback(async () => {
    if (!id) return;
    try {
      const [campaignRes, leadsRes, scheduleRes] = await Promise.all([
        api.get(`/campaigns/${id}`),
        api.get("/leads", { params: { campaignId: id, perPage: 500 } }),
        api.get(`/campaigns/${id}/schedule`),
      ]);
      setCampaign(campaignRes.data);
      setLeads(Array.isArray(leadsRes.data?.items) ? leadsRes.data.items : leadsRes.data ?? []);
      setSchedule(Array.isArray(scheduleRes.data?.items) ? scheduleRes.data.items : []);
    } catch {
      // The next preparation update retries; keep what is already on screen.
    }
  }, [id]);

  const handlePreparationChanged = useCallback(data => {
    setPreparationData(data);
    const status = data?.campaign?.status;
    if (status) setCampaign(current => current ? { ...current, status } : current);
    const signature = JSON.stringify([
      data?.campaign?.preparation_status,
      data?.campaign?.preparation_progress,
      data?.campaign?.acquisition_status,
      data?.readiness?.length ?? 0,
      data?.readinessCounts,
      data?.latestImport?.status,
      data?.latestImport?.qualified,
    ]);
    const previous = preparationSignatureRef.current;
    preparationSignatureRef.current = signature;
    if (previous !== null && previous !== signature) refreshLeads();
  }, [refreshLeads]);

  useEffect(() => {
    if (!callNowLimit) return undefined;
    const wait = callNowLimit.until - Date.now();
    if (wait <= 0) {
      setCallNowLimit(null);
      return undefined;
    }
    const timer = setTimeout(() => setCallNowLimit(null), Math.min(wait, 2_147_000_000));
    return () => clearTimeout(timer);
  }, [callNowLimit]);

  const viewer = team?.viewer;
  const canOperate = !campaign || !viewer || ['owner', 'admin'].includes(viewer.role) || campaign.assignedUserId === viewer.id;

  const handleLaunch = async () => {
    if (!canOperate) return;
    setLaunching(true);
    setError("");
    try {
      const { data } = await api.post(`/campaigns/${id}/launch`);
      setCampaign(prev => ({ ...prev, status: "active" }));
      if (data.emailQueued !== undefined && data.voiceQueued !== undefined && usesEmail(data.channel) && usesVoice(data.channel)) {
        showToast(`Campaign launched. ${data.emailQueued} email${data.emailQueued === 1 ? "" : "s"} and ${data.voiceQueued} call${data.voiceQueued === 1 ? "" : "s"} queued${data.skipped ? `, ${data.skipped} skipped` : ""}.`);
      } else if (data.queued !== undefined) {
        showToast(`Campaign launched. ${data.queued} queued${data.skipped ? `, ${data.skipped} skipped` : ""}.`);
      } else {
        showToast("Campaign launched successfully.");
      }
      await load();
    } catch (err) {
      const message = err?.response?.data?.error ?? "Failed to launch campaign.";
      setError(message);
      showToast(message);
    } finally {
      setLaunching(false);
    }
  };

  const handlePause = async () => {
    if (!canOperate) return;
    setPausing(true);
    try {
      await api.post(`/campaigns/${id}/pause`);
      setCampaign(prev => ({ ...prev, status: "paused" }));
      showToast("Campaign paused.");
    } catch (err) {
      showToast(err?.response?.data?.error ?? "Failed to pause campaign.");
    } finally {
      setPausing(false);
    }
  };

  const handleAssignment = async event => {
    const assignedUserId = event.target.value;
    if (!assignedUserId) return;
    setAssignmentBusy(true);
    setError("");
    try {
      const { data } = await api.patch(`/campaigns/${id}/assignment`, { assignedUserId });
      setCampaign(data);
      showToast("Campaign assignment updated.");
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || "Could not update the campaign assignment.");
    } finally {
      setAssignmentBusy(false);
    }
  };

  // Opens the lead's email; the dialog sends only what was read.
  const sendLeadNow = useCallback(leadId => {
    if (!canOperate) return;
    setError("");
    setDetailLeadId("");
    setSendLeadId(leadId);
  }, [canOperate]);

  const handleEmailSent = useCallback(async () => {
    showToast("Email sent to this lead.");
    await load();
  }, [load, showToast]);

  const enrichLead = useCallback(async leadId => {
    setEnrichingId(leadId);
    setError("");
    try {
      const { data } = await api.post("/leads/apollo-enrich", { leadId });
      setLeads(current => current.map(lead => lead.id === leadId ? { ...lead, ...data } : lead));
      showToast(data?.email ? "Email revealed for this lead." : "We found lead details, but no email was available on your plan.");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not reveal this lead's email.");
    } finally {
      setEnrichingId("");
    }
  }, [showToast]);

  const callLeadNow = useCallback(async leadId => {
    if (!canOperate) return;
    setActionKey(`call:${leadId}`);
    setError("");
    try {
      const { data } = await api.post(`/leads/${leadId}/call-now`);
      if (data?.queueStatus === "waiting_for_line") {
        showToast(data.message || "All lines are busy, this call will start as soon as one frees up.");
      } else {
        showToast("Calling this lead now.");
      }
      await load();
    } catch (err) {
      const limit = callNowLimitFromError(err);
      if (limit) {
        setCallNowLimit(limit);
        setError(limit.message);
      } else {
        setError(err?.response?.data?.error || "Could not call this lead now.");
      }
    } finally {
      setActionKey("");
    }
  }, [canOperate, load, showToast]);

  // The tab lives in the URL so a reload and a shared link both land on the
  // section the customer was reading.
  const requestedTab = searchParams.get("tab");
  const selectTab = useCallback(tab => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab !== "emails") params.set("tab", tab);
    else params.delete("tab");
    const query = params.toString();
    router.push(query ? `/campaigns/${id}?${query}` : `/campaigns/${id}`, { scroll: false });
  }, [id, router, searchParams]);

  const detailLead = detailLeadId ? leads.find(lead => lead.id === detailLeadId) || null : null;
  const sendLead = sendLeadId ? leads.find(lead => lead.id === sendLeadId) || null : null;
  const emailReadinessByLead = useMemo(() => new Map((preparationData?.readiness ?? [])
    .filter(row => row.channel === "email")
    .map(row => [row.lead_id, row])), [preparationData]);

  const metrics = useMemo(() => {
    const stats = campaign?.stats || {};
    const ready = campaignReadyCount({ channel: campaign?.channel, stats, preparationData });
    return [
      ["Enrolled", stats.enrolled ?? leads.length],
      ["Ready", ready],
      ["Missing email", stats.missingEmail ?? 0],
      ["Queued", stats.queued ?? 0],
      ["Sent", stats.sent ?? 0],
      ["Bounced", stats.bounced ?? 0],
    ];
  }, [campaign, leads.length, preparationData]);
  const nextAttemptByLead = useMemo(() => {
    const map = new Map();
    for (const attempt of schedule) {
      if (!map.has(attempt.lead_id) && ACTIVE_ATTEMPT_STATUSES.includes(attempt.status)) map.set(attempt.lead_id, attempt);
    }
    return map;
  }, [schedule]);

  if (loading) {
    return (
      <div className="col" style={{ gap: 16, padding: "32px 0" }}>
        <div style={{ width: 280, height: 20, borderRadius: 99, background: "var(--bg-2)" }} />
        <div className="card" style={{ padding: 24, height: 180, background: "var(--bg-2)" }} />
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="card" style={{ padding: 24, color: "var(--error)", textAlign: "center" }}>
        {error}
        <button className="btn btn-ghost btn-sm" onClick={load} style={{ marginLeft: 12 }}>Retry</button>
      </div>
    );
  }

  if (!campaign) return null;

  const emailEnabled = usesEmail(campaign.channel);
  const lifecycle = campaignLifecycle(campaign, { readyCount: Number(metrics.find(([label]) => label === "Ready")?.[1] ?? 0) });
  const activeTab = ["leads", "settings"].includes(requestedTab) ? requestedTab : emailEnabled ? "emails" : "leads";
  const voiceEnabled = usesVoice(campaign.channel);
  const dualChannel = emailEnabled && voiceEnabled;
  const isAiVoice = voiceEnabled && (campaign.voiceMode ?? "ai") === "ai";
  const launchGate = isAiVoice ? voiceLaunchGate(preparationData) : { blocked: false, message: "" };
  const canAssign = canSee(viewer?.role, 'campaign.assign');
  const assignee = team?.members?.find(member => member.id === campaign.assignedUserId);

  // A dual-channel campaign shows an Email and a Phone column, so the lead
  // table columns are derived rather than picked from two fixed layouts.
  const leadColumnWeights = [
    { header: "Lead", weight: dualChannel ? 24 : 28 },
    ...(emailEnabled ? [{ header: "Email", weight: dualChannel ? 16 : 20 }] : []),
    ...(voiceEnabled ? [{ header: "Phone", weight: dualChannel ? 12 : 16 }] : []),
    { header: "Status", weight: dualChannel ? 9 : 11 },
    { header: "Next outreach", weight: dualChannel ? 12 : 14 },
    { header: "Action", weight: dualChannel ? 15 : 16 },
    { header: "Location", weight: dualChannel ? 12 : 13 },
  ];
  // Normalise to exactly 100% so the last column (Location) is never pushed out of the table.
  const leadWeightTotal = leadColumnWeights.reduce((sum, column) => sum + column.weight, 0);
  const leadColumns = leadColumnWeights.map(column => ({ header: column.header, width: `${(column.weight / leadWeightTotal * 100).toFixed(2)}%` }));

  const campaignTabs = (
    <div className="seg" role="tablist" aria-label="Campaign sections">
      {[...(emailEnabled ? [["emails", "Emails"]] : []), ["leads", "Leads"], ["settings", "Settings"]].map(([key, label]) => (
        <button key={key} type="button" role="tab" aria-selected={activeTab === key} className={activeTab === key ? "on" : ""} onClick={() => selectTab(key)}>
          {label}{key === "leads" ? <em>{leads.length}</em> : null}
          {key === "emails" && draftSummary?.total ? <em>{draftSummary.total}</em> : null}
        </button>
      ))}
    </div>
  );

  return (
    <main className="gx">
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "var(--ink)", color: "var(--bg)", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999, maxWidth: 360, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      <div className="ph">
        <div className="cdh" style={{ minWidth: 0 }}>
          <button className="back" type="button" onClick={() => router.push("/campaigns")} aria-label="Back to campaigns">
            <Icon name="arrowLeft" size={16} />
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 className="ellip">{campaign.name}</h1>
            <div className="cdh-meta" style={{ flexWrap: "wrap" }}>
              <StatusBadge status={campaign.status} />
              <ChannelBadge channel={campaign.channel} />
              <span>Created {formatDate(campaign.createdAt)}</span>
              <span>· Assigned to {assignee ? [assignee.first_name, assignee.last_name].filter(Boolean).join(" ") || assignee.email : "Unassigned"}</span>
            </div>
          </div>
        </div>
        <div className="acts">
          {!canOperate && <span className="muted" style={{ fontSize: 12, fontWeight: 800 }}>View only</span>}
          {canOperate && (
            <button className="bt bt-g" type="button" onClick={() => selectTab("settings")}><Icon name="cog" size={15} /> Settings</button>
          )}
          {canOperate && (campaign.status === "draft" || campaign.status === "paused") && (
            <button className="bt bt-p" type="button" data-tour="campaign-launch" onClick={handleLaunch} disabled={launching || launchGate.blocked} title={launchGate.blocked ? launchGate.message : undefined}>
              {launching ? "Launching..." : "Launch campaign"}
            </button>
          )}
          {canOperate && campaign.status === "active" && (
            <button className="bt bt-g" type="button" onClick={handlePause} disabled={pausing}>
              <Icon name="pause" size={15} />
              {pausing ? "Pausing..." : "Pause"}
            </button>
          )}
        </div>
      </div>

      {error ? <div className="note">{error}</div> : null}

      {lifecycle && lifecycle.key !== "active" && lifecycle.key !== "draft" ? (
        <StateNote
          tone={lifecycle.tone}
          title={lifecycle.title}
          text={lifecycle.text}
          action={lifecycle.fix
            ? { label: "Fix connection", onClick: () => router.push(lifecycle.fix) }
            : lifecycle.key === "audience_exhausted" || lifecycle.key === "credit_limit"
              ? { label: "Edit settings", onClick: () => selectTab("settings") }
              : (lifecycle.key === "ready" || lifecycle.key === "ready_partly") && emailEnabled
                ? { label: "Review emails", onClick: () => selectTab("emails") }
                : null}
        />
      ) : null}

      {freePlan && emailEnabled ? (
        <div className="lim-banner">
          <span className="li"><Icon name="clock" size={18} /></span>
          <div>
            <b>
              {freeLive?.sentToday != null
                ? `${freeLive.sentToday} of ${freeLive.dailyCap || FREE_PLAN.dailyEmailCap} emails sent today`
                : `Free sends up to ${FREE_PLAN.dailyEmailCap} emails a day`}
            </b>
            <span>
              {freeLive?.sentToday != null && freeLive.sentToday >= (freeLive.dailyCap || FREE_PLAN.dailyEmailCap)
                ? `The rest send tomorrow inside your sending window. Paid plans send up to ${upgradePlan().dailyEmailCap} a day.`
                : `Anything over the daily limit sends the next day inside your sending window. Paid plans send up to ${upgradePlan().dailyEmailCap} a day.`}
            </span>
          </div>
          <button type="button" className="bt bt-p sm" onClick={() => router.push("/billing")}>
            <Icon name="star" size={13} color="#06231a" /> Upgrade to {upgradePlan().name}
          </button>
        </div>
      ) : null}

      <div className="col" style={{ gap: 16 }}>
          {emailEnabled ? <CampaignProgress campaign={campaign} leadCount={leads.length} preparationDone={Number(preparationData?.campaign?.preparation_progress ?? 0) >= 100} drafts={draftSummary} freePlan={freePlan} writing={writingCounts(preparationData?.readiness ?? [])} /> : null}
          {canOperate ? <CampaignPreparationPanel campaignId={campaign.id} channel={campaign.channel} campaignStatus={campaign.status} onChanged={handlePreparationChanged} freePlan={freePlan} leadCount={leads.length} /> : <div className="card" style={{ padding: 16, color: "#69786f", fontSize: 13, fontWeight: 600 }}>This campaign is assigned to another teammate. You can review its status and history, but operational controls are read-only.</div>}

          <div className="mets">
            {metrics.map(([label, value]) => (
              <div key={label} className="met">
                <small>{label}</small>
                <b style={label === "Bounced" && value > 0 ? { color: "#b42318" } : undefined}>{value}</b>
              </div>
            ))}
          </div>

          {!(emailEnabled && activeTab === "emails" && canOperate) ? <div>{campaignTabs}</div> : null}

          {activeTab === "settings" && (
            <div className="col" style={{ gap: 16 }}>
              <SenderPicker campaignId={campaign.id} channel={campaign.channel} value={campaign.channel === "email" ? campaign.emailAccountId : campaign.phoneNumberId} disabled={!canOperate} onSaved={id => setCampaign(current => ({ ...current, [current.channel === "email" ? "emailAccountId" : "phoneNumberId"]: id }))} />
              {canAssign && team?.members?.length > 0 && <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}><span style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>Campaign owner</span><select className="input" aria-label="Campaign assignee" value={campaign.assignedUserId || ""} onChange={handleAssignment} disabled={assignmentBusy} style={{ width: "min(100%, 280px)", height: 34 }}><option value="" disabled>Unassigned</option>{team.members.filter(member => member.membership_status === "active").map(member => <option key={member.id} value={member.id}>{[member.first_name, member.last_name].filter(Boolean).join(" ") || member.email} · {member.role}</option>)}</select>{assignmentBusy && <span className="faint" style={{ fontSize: 12 }}>Saving…</span>}</div>}
              <CampaignSettingsForm campaign={campaign} disabled={!canOperate} onSaved={() => load()} />
            </div>
          )}

          {emailEnabled && activeTab === "emails" && (
            canOperate ? <DraftReview campaignId={campaign.id} displayTimezone={displayTimezone} onChanged={load} tabs={campaignTabs} onSummary={setDraftSummary} /> : <div className="card" style={{ padding: 20, color: "var(--muted)", fontSize: 13 }}>Message drafts are read-only for campaigns assigned to another teammate.</div>
          )}

          {activeTab === "leads" && (
          <div className="card" style={{ overflow: "hidden" }} data-tour="campaign-leads">
            <div className="card-h">
              <div>
                <b>Campaign leads</b>
                <small>{leads.length} leads attached to this campaign.</small>
              </div>
            </div>
            <div className="tbl-wrap">
              <table className="tbl" style={{ minWidth: dualChannel ? 1300 : 980, tableLayout: "fixed" }}>
                <colgroup>
                  {leadColumns.map(column => <col key={column.header} style={{ width: column.width }} />)}
                </colgroup>
                <thead>
                  <tr>{leadColumns.map(column => <th key={column.header}>{column.header}</th>)}</tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr><td colSpan={leadColumns.length} className="empty">No leads are attached to this campaign.</td></tr>
                  ) : leads.slice((Math.min(leadPage, Math.ceil(leads.length / LEADS_PER_PAGE)) - 1) * LEADS_PER_PAGE, Math.min(leadPage, Math.ceil(leads.length / LEADS_PER_PAGE)) * LEADS_PER_PAGE).map(lead => (
                    <CampaignLeadRow key={lead.id} lead={lead} emailReadiness={emailReadinessByLead.get(lead.id) ?? null} attempt={nextAttemptByLead.get(lead.id)} displayTimezone={displayTimezone} campaignStatus={campaign.status} showEmail={emailEnabled} showPhone={voiceEnabled} isAiVoice={isAiVoice} actionKey={actionKey} onEmailNow={sendLeadNow} onCallNow={callLeadNow} onOpen={leadId => router.push(`/prospects/${leadId}`)} canOperate={canOperate} callNowLimit={callNowLimit} />
                  ))}
                </tbody>
              </table>
            </div>
            {leads.length > LEADS_PER_PAGE ? (() => {
              const pageCount = Math.ceil(leads.length / LEADS_PER_PAGE);
              const page = Math.min(leadPage, pageCount);
              return (
                <div className="tfoot">
                  <span>Showing {(page - 1) * LEADS_PER_PAGE + 1} to {Math.min(leads.length, page * LEADS_PER_PAGE)} of {leads.length}</span>
                  <div className="acts">
                    <span className="pg-of">Page {page} of {pageCount}</span>
                    <button type="button" className="bt bt-g sm" disabled={page <= 1} onClick={() => setLeadPage(page - 1)}>Previous</button>
                    <button type="button" className="bt bt-g sm" disabled={page >= pageCount} onClick={() => setLeadPage(page + 1)}>Next</button>
                  </div>
                </div>
              );
            })() : null}
          </div>
          )}
      </div>
      {detailLead ? (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setDetailLeadId("")}
          onEnrich={enrichLead}
          enriching={enrichingId === detailLead.id}
          onSendNow={sendLeadNow}
          sending={actionKey === `email:${detailLead.id}`}
        />
      ) : null}
      {sendLead ? (
        <SendEmailDialog
          lead={sendLead}
          campaignId={id}
          onClose={() => { setSendLeadId(""); refreshLeads(); }}
          onSent={handleEmailSent}
        />
      ) : null}
    </main>
  );
}
