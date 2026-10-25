"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../../components/ui/Icon";
import useFreeUsage from "../../../hooks/useFreeUsage";
import InboxHealthNote from "../../../components/ui/InboxHealthNote";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import SetupChecklist from "../../../components/setup/SetupChecklist";
import { useSetup } from "../../../providers/SetupProvider";
import api from "../../../lib/api";
import { FREE_PLAN, isFreePlan, upgradePlan, useOrg } from "../../../lib/free-plan";

const ICON_MAP = {
  email_sent: "send",
  reply: "chat",
  meeting: "calendar",
};

const TASK_ICON_MAP = {
  email: "mail",
  reply: "chat",
  email: "send",
  campaign: "target",
  lead: "users",
};

function KpiCard({ item }) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        {item.label}
        <span className={`kpi-ic ${item.tone === "warn" ? "warn" : ""}`}><Icon name={item.icon} size={16} /></span>
      </div>
      <b>{item.value}</b>
      <small>{item.detail}</small>
    </div>
  );
}

function OnboardingPreparationCard({ preparation, onOpenCampaign, onOpenProspects }) {
  if (!preparation?.status || preparation.status === "idle") return null;

  const target = Number(preparation.targetEnriched || 10);
  const enriched = Number(preparation.enriched || 0);
  const attached = Number(preparation.attached || preparation.candidatesFound || 0);
  const attempts = Number(preparation.candidatesAttempted || 0);
  const rejected = Number(preparation.rejected || 0);
  const progress = enriched >= target
    ? 100
    : Math.min(99, Math.round((enriched / Math.max(target, 1)) * 100));

  // A run that found some leads but not the full target is 'partial', not a
  // failure: the lead database may simply not hold ten verified people matching this ICP.
  // Reporting that plainly beats raising an alarm the customer cannot action.
  const partial = preparation.status === "partial" || (preparation.status === "attention" && enriched > 0);
  const ready = (preparation.status === "ready" || preparation.status === "completed") && enriched >= target;
  const attention = preparation.status === "attention" && enriched === 0;

  const title = ready
    ? "Your first audience is ready"
    : partial
      ? `Found ${enriched} of ${target} leads`
      : attention
        ? "Your first audience needs attention"
        : "Preparing your first audience";

  const detail = ready
    ? "We found your verified prospects and the agent is writing their emails."
    : partial
      ? `We had ${enriched} verified contact${enriched === 1 ? "" : "s"} matching this profile${rejected > 0 ? `, and ${rejected} more were filtered out as unreachable or shared inboxes` : ""}. You can broaden the profile for more.`
      : attention
        ? preparation.error || "We found nobody matching this profile. Broaden the titles, industries, or regions in Prospects and try again."
        : "GNX is searching our lead database and enriching the audience in the background. You can keep working.";

  return (
    <div className={`need ${ready ? "hi" : ""}`} data-tour="dashboard-preparation" style={{ display: "block" }}>
      <div className="row spread" style={{ gap: 14, alignItems: "flex-start" }}>
        <div className="row" style={{ gap: 11, alignItems: "flex-start" }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", flex: "none", background: attention ? "#fff7ed" : "var(--g-50)", color: attention ? "#c2410c" : "var(--g-700)" }}>
            <Icon name={attention ? "bell" : ready ? "checkCircle" : "spark"} size={18} />
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 3, maxWidth: 680 }}>{detail}</p>
          </div>
        </div>
        <span className="chip" style={{ color: attention ? "#9a3412" : ready ? "var(--g-700)" : "var(--ink-2)", background: attention ? "#fff7ed" : ready ? "var(--g-50)" : "var(--bg-2)" }}>
          {preparation.status === "preparing" ? "In progress" : preparation.status.charAt(0).toUpperCase() + preparation.status.slice(1)}
        </span>
      </div>

      <div style={{ height: 8, borderRadius: 999, background: "var(--bg-2)", overflow: "hidden", marginTop: 15 }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: attention ? "#f97316" : "var(--g-600)", transition: "width .25s ease" }} />
      </div>
      <div className="row spread" style={{ marginTop: 9, gap: 12, flexWrap: "wrap" }}>
        <span className="faint" style={{ fontSize: 12, fontWeight: 800 }}>{enriched}/{target} qualified</span>
        <div className="row" style={{ gap: 16 }}>
          <span className="faint" style={{ fontSize: 12 }}>Reviewed {attached}</span>
          {/* Rejections are shown rather than hidden: a shortfall the customer
              can see the reason for is a targeting insight, where a silent one
              just looks like the product underdelivering. */}
          {rejected > 0 && <span className="faint" style={{ fontSize: 12 }}>Filtered out {rejected}</span>}
          <span className="faint" style={{ fontSize: 12 }}>Searched {attempts}</span>
        </div>
      </div>

      {(ready || partial || attention) && (
        <button
          className={ready || partial ? "bt bt-p sm" : "bt bt-g sm"}
          type="button"
          style={{ marginTop: 13 }}
          onClick={ready || partial ? onOpenCampaign : onOpenProspects}
        >
          {ready || partial ? "Review your emails" : "Refine audience"}{" "}
          <Icon name="arrow" size={14} color={ready || partial ? "#06231a" : "currentColor"} />
        </button>
      )}
    </div>
  );
}

function formatMeetingTime(value) {
  const meetingDate = new Date(value);
  if (Number.isNaN(meetingDate.getTime())) return "Time to be confirmed";

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dateKey = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const meetingKey = dateKey(meetingDate);
  const day = meetingKey === dateKey(today)
    ? "Today"
    : meetingKey === dateKey(tomorrow)
      ? "Tomorrow"
      : meetingDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = meetingDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return `${day} at ${time}`;
}


const ACTIVITY_PER_PAGE = 10;
const ACTIVITY_TABS = [
  { id: "all", label: "All" },
  { id: "reply", label: "Replies" },
  { id: "meeting", label: "Meetings" },
  { id: "email_sent", label: "Sends" },
];

const ACTIVITY_TONE = { reply: "reply", meeting: "mtg", call: "call" };

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function NeedCard({ tone, icon, title, detail, action, primary, onClick, highlight, dataTour }) {
  return (
    <div className={`need ${highlight ? "hi" : ""}`} data-tour={dataTour}>
      <span className={`need-ic ${tone || ""}`}><Icon name={icon} size={19} /></span>
      <div>
        <b>{title}</b>
        {detail ? <p>{detail}</p> : null}
        {action ? (
          <button type="button" className={`bt ${primary ? "bt-p" : "bt-g"} sm`} onClick={onClick}>{action}</button>
        ) : null}
      </div>
    </div>
  );
}

function GoalRing({ current, target }) {
  const circumference = 2 * Math.PI * 40;
  const ratio = Math.min(1, (current || 0) / Math.max(target || 1, 1));
  return (
    <div className="ring">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r="40" fill="none" stroke="#eef3f0" strokeWidth="9" />
        <circle cx="48" cy="48" r="40" fill="none" stroke="#00a86b" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(ratio * circumference).toFixed(1)} ${circumference.toFixed(1)}`} transform="rotate(-90 48 48)" />
      </svg>
      <b>{current ?? 0}<small>of {target ?? 1}</small></b>
    </div>
  );
}

function FreeWelcome({ firstName, organization, router }) {
  const { steps } = useSetup();
  const stepDone = id => steps.find(step => step.id === id)?.status === "complete";
  const welcomeSteps = [
    { id: "workspace", title: "Create your workspace", body: "Done. Your teammates can join it from Team.", done: true },
    { id: "email", title: "Connect your inbox", body: `Your agent sends from your own company inbox, up to ${FREE_PLAN.dailyEmailCap} emails a day.`, action: "Connect inbox", icon: "mail", href: "/settings#settings-inboxes" },
    { id: "leads", title: "Add your leads", body: `Upload a CSV or add them by hand, up to ${FREE_PLAN.maxLeads} leads. Each address's format and domain is checked.`, action: "Import CSV", icon: "doc", href: "/prospects" },
    { id: "campaign", title: "Start your campaign", body: "Tell your agent who you sell to. Every email waits for your OK until you turn on autopilot.", action: "New campaign", icon: "plus", href: "/campaigns/new" },
  ].map(step => ({ ...step, done: step.done || stepDone(step.id) }));
  const nextId = welcomeSteps.find(step => !step.done)?.id;
  const plan = upgradePlan();

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Welcome to GNX, {firstName}</h1>
          <p>{organization?.name || "Your workspace"} is on the Free plan. Four steps and your agent starts writing to your leads.</p>
        </div>
        <div className="acts">
          <button type="button" className="bt bt-g" onClick={() => router.push("/agent")}><Icon name="spark" size={15} /> Talk to your agent</button>
        </div>
      </div>

      <div className="wl">
        {welcomeSteps.map((step, index) => (
          <div key={step.id} className={`wstep ${step.done ? "done" : step.id === nextId ? "next" : ""}`}>
            <i>{step.done ? <Icon name="check" size={14} color="#fff" stroke={3} /> : index + 1}</i>
            <b>{step.title}</b>
            <span>{step.body}</span>
            {!step.done && step.action ? (
              <button type="button" className={`bt ${step.id === nextId ? "bt-p" : "bt-g"} sm`} onClick={() => router.push(step.href)}>
                <Icon name={step.icon} size={13} color={step.id === nextId ? "#06231a" : undefined} /> {step.action}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <KpiCard item={{ label: "Emails sent", value: 0, detail: "Starts after your first launch", icon: "send" }} />
        <KpiCard item={{ label: "Replies", value: 0, detail: "Drafted answers land in Inbox", icon: "chat" }} />
        <KpiCard item={{ label: "Meetings", value: 0, detail: "Booked from replies", icon: "calendar" }} />
        <KpiCard item={{ label: "Your leads", value: 0, detail: `0 of ${FREE_PLAN.maxLeads} on Free`, icon: "users" }} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-h"><div><b>Activity</b><small>Sends, replies and booked meetings.</small></div></div>
          <div className="emp">
            <span className="ei2"><Icon name="trend" size={24} /></span>
            <b>Nothing here yet</b>
            <p>Once your campaign is running, every send, reply and meeting shows up here, newest first.</p>
            {nextId && nextId !== "workspace" ? (
              <div className="acts">
                <button type="button" className="bt bt-p" onClick={() => router.push(welcomeSteps.find(step => step.id === nextId).href)}>
                  {welcomeSteps.find(step => step.id === nextId).action}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="card unl">
          <h3>What Free includes</h3>
          <p>Enough to see if the agent works for you, on your own leads.</p>
          {[
            ["Email campaign", `${FREE_PLAN.emailCampaigns} at a time`],
            ["Emails a day", String(FREE_PLAN.dailyEmailCap)],
            ["AI-written emails", `~${FREE_PLAN.monthlyAiEmails} a month`],
            ["Leads", `Up to ${FREE_PLAN.maxLeads}`],
          ].map(([label, value]) => (
            <div key={label} className="lk"><i><Icon name="check" size={13} /></i><span>{label}</span><em>{value}</em></div>
          ))}
          <button type="button" className="bt bt-g" onClick={() => router.push("/billing")}>See paid plans · from ${plan.monthly}/mo</button>
        </div>
      </div>
    </main>
  );
}

function FreeDashboard({ firstName, kpis, tasks, activity, campaigns, router }) {
  const plan = upgradePlan();
  const usage = useFreeUsage(true);
  const emailsUsed = usage?.emailsThisMonth ?? 0;
  const creditsUsed = usage?.creditsUsed ?? 0;
  const creditsTotal = usage?.creditsTotal || FREE_PLAN.monthlyCredits;
  const sentToday = usage?.sentToday;
  const dailyCap = usage?.dailyCap || FREE_PLAN.dailyEmailCap;
  const dailyCapHit = sentToday != null && sentToday >= dailyCap;
  const leadsUsed = kpis.savedLeads ?? 0;
  const leadsLeft = Math.max(0, FREE_PLAN.maxLeads - leadsUsed);
  const campaign = campaigns.find(c => c.status === "active") || campaigns[0] || null;
  const enrolled = Number(campaign?.enrolled || 0);
  const sent = Number(campaign?.sent || 0);
  const creditsLow = creditsUsed >= creditsTotal * 0.6;

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>{timeOfDayGreeting()}, {firstName}</h1>
          <p>You are on the Free plan. Your agent writes and sends one campaign from your own inbox.</p>
        </div>
        <div className="acts">
          <button type="button" className="bt bt-g" onClick={() => router.push("/prospects")}><Icon name="doc" size={15} /> Import CSV</button>
          <button type="button" className="bt bt-p" onClick={() => router.push("/billing")}><Icon name="star" size={15} color="#06231a" /> Upgrade</button>
        </div>
      </div>

      {dailyCapHit ? (
        <div className="lim-banner">
          <span className="li"><Icon name="clock" size={18} /></span>
          <div>
            <b>{sentToday} of {dailyCap} emails sent today</b>
            <span>The rest send tomorrow inside your sending window. Paid plans send up to {plan.dailyEmailCap} a day.</span>
          </div>
          <div className="acts">
            <button type="button" className="bt bt-p sm" onClick={() => router.push("/billing")}>Upgrade to {plan.name}</button>
          </div>
        </div>
      ) : creditsLow ? (
        <div className="lim-banner">
          <span className="li"><Icon name="alertCircle" size={18} /></span>
          <div>
            <b>{creditsUsed} of {creditsTotal} AI credits used this month</b>
            <span>{creditsUsed >= creditsTotal ? "New drafts are paused until your credits reset" : "New drafts pause when they run out"}, or upgrade to keep going today.</span>
          </div>
          <div className="acts">
            <button type="button" className="bt bt-g sm" onClick={() => router.push("/pricing")}>See plans</button>
            <button type="button" className="bt bt-p sm" onClick={() => router.push("/billing")}>Upgrade to {plan.name}</button>
          </div>
        </div>
      ) : null}

      <div className="needs">
        {tasks.slice(0, 2).map((task, index) => (
          <NeedCard
            key={`${task.type}-${task.title}`}
            highlight={index === 0}
            icon={TASK_ICON_MAP[task.type] || "bell"}
            title={task.title}
            detail={task.detail}
            action={task.actionLabel}
            primary={index === 0}
            onClick={() => router.push(task.href)}
          />
        ))}
        <NeedCard
          dataTour="dashboard-free-leads"
          tone="warn"
          icon="users"
          title={`${leadsLeft} leads left on Free`}
          detail={`${leadsUsed} of ${FREE_PLAN.maxLeads} used. Upload more, or let a paid plan find them for you.`}
          action={<><Icon name="doc" size={14} /> Import CSV</>}
          onClick={() => router.push("/prospects")}
        />
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <KpiCard item={{ label: "Emails sent", value: emailsUsed, detail: sentToday != null ? `this month · ${sentToday} of ${dailyCap} today` : "this month", icon: "send" }} />
        <KpiCard item={{ label: "Replies", value: kpis.replies ?? 0, detail: <><span className="up">{kpis.replyRate ?? 0}%</span> reply rate</>, icon: "chat" }} />
        <KpiCard item={{ label: "Meetings", value: kpis.meetings ?? 0, detail: "booked", icon: "calendar" }} />
        <KpiCard item={{ label: "Your leads", value: leadsUsed, detail: `of ${FREE_PLAN.maxLeads} on Free`, icon: "users" }} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-h">
            <div><b>Your campaign</b><small>Free runs one email campaign at a time.</small></div>
            {campaign ? <span className={`pl ${campaign.status === "active" ? "pl-ok" : "pl-mute"}`}><u /> {campaign.status === "active" ? "Active" : campaign.status}</span> : null}
          </div>
          {campaign ? (
            <button type="button" className="cm" style={{ display: "block", width: "100%", textAlign: "left" }} onClick={() => router.push(`/campaigns/${campaign.campaignId}`)}>
              <div className="cm-top"><b>{campaign.name}</b><span className="pl pl-mute">Email</span></div>
              <div className="bar"><u style={{ width: `${enrolled ? Math.min(100, Math.round((sent / enrolled) * 100)) : 0}%` }} /></div>
              <div className="cm-meta"><span>{sent} sent · {enrolled} enrolled</span><span>{campaign.replies} replies · {campaign.meetings} meetings</span></div>
            </button>
          ) : (
            <div className="empty">
              No campaign yet.{" "}
              <button type="button" className="lnk" onClick={() => router.push("/campaigns/new")}>Create one</button>
            </div>
          )}
          {activity.map((item, index) => (
            <div key={`${item.type}-${item.time}-${index}`} className="act">
              <span className={`act-ic ${ACTIVITY_TONE[item.type] || ""}`}><Icon name={ICON_MAP[item.type] || "send"} size={16} /></span>
              <div className="act-main"><div className="act-t">{item.text}</div></div>
              <span className="act-time">{item.timeAgo}</span>
            </div>
          ))}
        </div>

        <div className="card unl">
          <h3>Unlock with {plan.name}</h3>
          <p>${plan.monthly} a month. Everything on Free, plus your agent finds and verifies your buyers and calls them.</p>
          {[
            ["Find leads in the lead database", "Included"],
            ["Verified work emails", "Included"],
            ["AI calling", `${plan.voiceCampaigns} voice campaign${plan.voiceCampaigns === 1 ? "" : "s"}`],
            ["Email campaigns", `${plan.emailCampaigns} at once`],
            ["Emails a day", String(plan.dailyEmailCap)],
            ["Monthly credits", plan.monthlyCredits.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="lk"><i><Icon name="lock" size={13} /></i><span>{label}</span><em>{value}</em></div>
          ))}
          <button type="button" className="bt bt-p" onClick={() => router.push("/billing")}>
            <Icon name="star" size={14} color="#06231a" /> Upgrade to {plan.name}
          </button>
        </div>
      </div>
    </main>
  );
}

const CHANNEL_LABEL = { email: "Email", voice: "Voice", both: "Email + Voice", multi: "Email + Voice" };

export default function DashboardPage() {
  const router = useRouter();
  const organization = useOrg();
  const [data, setData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [onboardingPreparation, setOnboardingPreparation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityTab, setActivityTab] = useState("all");
  const [activityPage, setActivityPage] = useState(1);
  const showSkeleton = useFirstLoad(loading);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(() => setError("Dashboard data could not be loaded."))
      .finally(() => setLoading(false));
    // The campaign progress card is secondary; the dashboard renders without it.
    api.get("/analytics/campaigns")
      .then(res => setCampaigns(res.data?.campaigns ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const loadPreparation = async () => {
      try {
        const { data: nextPreparation } = await api.get("/onboarding/preparation/current");
        if (cancelled) return;
        setOnboardingPreparation(nextPreparation || null);

        const target = Number(nextPreparation?.targetEnriched || 50);
        const enriched = Number(nextPreparation?.enriched || 0);
        const stillPreparing = nextPreparation?.status === "queued"
          || nextPreparation?.status === "preparing"
          || (enriched < target && nextPreparation?.status !== "attention" && nextPreparation?.status !== "ready");
        if (stillPreparing) timer = window.setTimeout(loadPreparation, 5000);
      } catch {
        // The dashboard should remain usable if preparation status is
        // temporarily unavailable; the campaign and other dashboard data are
        // independent of this background indicator.
      }
    };

    loadPreparation();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const kpis = data?.kpis ?? {};
  const activity = data?.activity ?? [];
  const tasks = data?.tasks ?? [];
  const weeklyGoal = data?.weeklyGoal ?? { current: 0, target: 1, progress: 0, monthlyTarget: 0 };
  const nextMeeting = data?.nextMeeting ?? null;
  const firstName = data?.user?.firstName || "there";
  const agentName = data?.agentName || "GNX sales";

  const kpiItems = useMemo(() => ([
    { label: "Emails sent", value: kpis.emailsSent ?? 0, detail: "total sent", icon: "send" },
    { label: "Replies", value: kpis.replies ?? 0, detail: <><span className="up">{kpis.replyRate ?? 0}%</span> reply rate</>, icon: "chat" },
    { label: "Meetings", value: kpis.meetings ?? 0, detail: "booked", icon: "calendar" },
    { label: "Hot leads", value: kpis.hotLeads ?? 0, detail: "need attention", icon: "flame", tone: "warn" },
    { label: "Saved leads", value: kpis.savedLeads ?? 0, detail: `${kpis.activeCampaigns ?? 0} active campaigns`, icon: "users" },
  ]), [kpis]);

  const visibleActivity = activityTab === "all" ? activity : activity.filter(item => item.type === activityTab);
  const activityPageCount = Math.max(1, Math.ceil(visibleActivity.length / ACTIVITY_PER_PAGE));
  const currentActivityPage = Math.min(activityPage, activityPageCount);
  const pageActivity = visibleActivity.slice((currentActivityPage - 1) * ACTIVITY_PER_PAGE, currentActivityPage * ACTIVITY_PER_PAGE);
  const activeCampaigns = campaigns.filter(c => c.status === "active").slice(0, 3);
  const goalRemaining = Math.max(0, (weeklyGoal.target ?? 1) - (weeklyGoal.current ?? 0));

  if (showSkeleton) return <RouteSkeleton />;

  if (isFreePlan(organization)) {
    if (!(kpis.emailsSent > 0) && !(kpis.savedLeads > 0) && campaigns.length === 0) {
      return <FreeWelcome firstName={firstName} organization={organization} router={router} />;
    }
    return <FreeDashboard firstName={firstName} kpis={kpis} tasks={tasks} activity={activity} campaigns={campaigns} router={router} />;
  }

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>{timeOfDayGreeting()}, {firstName}</h1>
          <p>{tasks.length > 0 ? `${tasks.length} thing${tasks.length === 1 ? "" : "s"} need${tasks.length === 1 ? "s" : ""} you today.` : "Pipeline health, reply work, and weekly progress."}</p>
        </div>
        <div className="acts">
          <button type="button" className="bt bt-g" onClick={() => router.push("/prospects")}>
            <Icon name="users" size={15} /> Add leads
          </button>
          <button type="button" className="bt bt-g" onClick={() => router.push("/campaigns/new")}>
            <Icon name="plus" size={15} /> New campaign
          </button>
          <button type="button" className="bt bt-p" onClick={() => router.push("/agent")}>
            <Icon name="spark" size={15} color="#06231a" /> Talk to {agentName}
          </button>
        </div>
      </div>

      {error && <div className="note">{error}</div>}

      <InboxHealthNote />

      <OnboardingPreparationCard
        preparation={onboardingPreparation}
        onOpenCampaign={() => router.push(`/campaigns/${onboardingPreparation?.campaignId}`)}
        onOpenProspects={() => router.push("/prospects")}
      />

      <SetupChecklist variant="compact" />

      {(tasks.length > 0 || nextMeeting) && (
        <div className="needs">
          {tasks.slice(0, nextMeeting ? 2 : 3).map((task, index) => (
            <NeedCard
              key={`${task.type}-${task.title}`}
              highlight={index === 0}
              tone={task.priority === "high" && index !== 0 ? "warn" : ""}
              icon={TASK_ICON_MAP[task.type] || "bell"}
              title={task.title}
              detail={task.detail}
              action={task.actionLabel}
              primary={index === 0}
              onClick={() => router.push(task.href)}
            />
          ))}
          {nextMeeting && (
            <NeedCard
              tone="dark"
              icon="calendar"
              title={`${nextMeeting.attendee?.name || nextMeeting.title} · ${formatMeetingTime(nextMeeting.scheduledAt)}`}
              detail={[nextMeeting.attendee?.title, nextMeeting.attendee?.company, `${nextMeeting.durationMinutes ?? 30} min`].filter(Boolean).join(" · ")}
              action={nextMeeting.attendeePhone ? <><Icon name="phone" size={14} /> Call {nextMeeting.attendee?.name || "guest"}</> : "View meeting"}
              onClick={() => nextMeeting.attendeePhone ? window.location.assign(`tel:${nextMeeting.attendeePhone}`) : router.push("/calendar")}
            />
          )}
        </div>
      )}

      <div className="kpis" data-tour="dashboard-kpis" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
        {kpiItems.map(item => <KpiCard key={item.label} item={item} />)}
      </div>

      <div className="dash-grid">
        <div className="card" data-tour="dashboard-activity">
          <div className="card-h">
            <div>
              <b>Activity</b>
              <small>Sends, replies and booked meetings.</small>
            </div>
            <div className="tabs-mini" role="tablist">
              {ACTIVITY_TABS.map(tab => (
                <button key={tab.id} type="button" role="tab" aria-selected={activityTab === tab.id} className={activityTab === tab.id ? "on" : ""} onClick={() => { setActivityTab(tab.id); setActivityPage(1); }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {visibleActivity.length === 0 ? (
            <div className="empty">{activity.length === 0 ? "No activity yet. Start a campaign to see activity here." : "Nothing of this type yet."}</div>
          ) : (
            pageActivity.map((item, index) => (
              <div key={`${item.type}-${item.time}-${index}`} className="act">
                <span className={`act-ic ${ACTIVITY_TONE[item.type] || ""}`}><Icon name={ICON_MAP[item.type] || "send"} size={16} /></span>
                <div className="act-main"><div className="act-t">{item.text}</div></div>
                {item.hot && <span className="pl pl-ok">Hot</span>}
                <span className="act-time">{item.timeAgo}</span>
              </div>
            ))
          )}
          {visibleActivity.length > ACTIVITY_PER_PAGE ? (
            <div className="tfoot">
              <span>Showing {(currentActivityPage - 1) * ACTIVITY_PER_PAGE + 1} to {Math.min(visibleActivity.length, currentActivityPage * ACTIVITY_PER_PAGE)} of {visibleActivity.length}</span>
              <div className="acts">
                <span className="pg-of">Page {currentActivityPage} of {activityPageCount}</span>
                <button type="button" className="bt bt-g sm" disabled={currentActivityPage <= 1} onClick={() => setActivityPage(currentActivityPage - 1)}>Previous</button>
                <button type="button" className="bt bt-g sm" disabled={currentActivityPage >= activityPageCount} onClick={() => setActivityPage(currentActivityPage + 1)}>Next</button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="dash-right">
          <div className="card goal">
            <GoalRing current={weeklyGoal.current} target={weeklyGoal.target} />
            <div className="goal-t">
              <b>Weekly meeting goal</b>
              <p>
                {goalRemaining > 0 ? `${goalRemaining} more to hit this week's target` : "This week's target is hit"}
                {weeklyGoal.monthlyTarget ? `, based on ${weeklyGoal.monthlyTarget} meetings a month.` : "."}
              </p>
              <button type="button" className="lnk" onClick={() => router.push("/analytics")}>View analytics <Icon name="arrow" size={14} /></button>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <div>
                <b>Active campaigns</b>
                <small>Progress through each audience.</small>
              </div>
              <button type="button" className="lnk" onClick={() => router.push("/campaigns")}>All <Icon name="arrow" size={14} /></button>
            </div>
            {activeCampaigns.length === 0 ? (
              <div className="empty">No active campaigns.</div>
            ) : activeCampaigns.map(campaign => {
              const enrolled = Number(campaign.enrolled || 0);
              const sent = Number(campaign.sent || 0);
              const pct = enrolled > 0 ? Math.min(100, Math.round((sent / enrolled) * 100)) : 0;
              return (
                <button key={campaign.campaignId} type="button" className="cm" style={{ display: "block", width: "100%", textAlign: "left" }} onClick={() => router.push(`/campaigns/${campaign.campaignId}`)}>
                  <div className="cm-top"><b>{campaign.name}</b><span className="pl pl-mute">{CHANNEL_LABEL[campaign.channel] || "Email"}</span></div>
                  <div className="bar"><u style={{ width: `${pct}%` }} /></div>
                  <div className="cm-meta"><span>{sent} sent · {enrolled} enrolled</span><span>{campaign.replies} replies · {campaign.meetings} meetings</span></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
