"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useConfirm } from "../../../components/ui/ConfirmDialog";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import RouteSkeleton from "../../../components/ui/RouteSkeleton";
import Icon from "../../../components/ui/Icon";
import { useFirstLoad } from "../../../hooks/useFirstLoad";
import useBillingCheckout from "../../../hooks/useBillingCheckout";
import api from "../../../lib/api";
import useFreeUsage from "../../../hooks/useFreeUsage";
import { useCanSee } from "../../../lib/access";
import { ACCESS_STATUSES as ACTIVE_STATUSES, MAX_ANNUAL_SAVINGS_PERCENT, PLAN_CONFIG } from "../../../lib/plans";
import { FREE_PLAN, isFreePlan, upgradePlan, useOrg } from "../../../lib/free-plan";

function Meter({ label, value, used, limit, note }) {
  const pct = limit ? Math.min(100, Math.round(((used ?? 0) / limit) * 100)) : 0;
  return (
    <div className="meter">
      <div><span>{label}</span><b>{value}</b></div>
      <div className="bar"><u style={{ width: `${pct}%` }} /></div>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

const MEMBER_PERMISSIONS = [
  ['Work leads, Inbox, Calls and Calendar', 'Yes'],
  ['Edit campaigns assigned to you', 'Yes'],
  ['Use the AI Agent', 'Yes'],
  ['Create or delete campaigns', 'Admin or Owner'],
  ['Senders and Settings', 'Admin or Owner'],
  ['Plan, credits and invoices', 'Owner only'],
];

function formatDate(iso) {
  if (!iso) return 'Not available';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format((Number(amount) || 0) / 100);
}

export default function BillingPage() {
  const confirm = useConfirm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [annual, setAnnual] = useState(true);
  const organization = useOrg();
  const freePlan = isFreePlan(organization);
  const [freeKpis, setFreeKpis] = useState(null);
  const [owner, setOwner] = useState(null);
  const freeLive = useFreeUsage(freePlan);
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [planChangeQuote, setPlanChangeQuote] = useState(null);
  const [planChangeSubmitting, setPlanChangeSubmitting] = useState(false);
  const showSkeleton = useFirstLoad(loading);

  const loadBillingData = useCallback(async () => {
    const [usageRes, historyRes] = await Promise.allSettled([
      api.get('/billing/usage'),
      api.get('/billing/history'),
    ]);
    if (usageRes.status === 'fulfilled') setUsage(usageRes.value.data);
    if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data ?? []);
  }, []);

  useEffect(() => {
    if (!freePlan) return;
    api.get('/dashboard').then(res => setFreeKpis(res.data?.kpis ?? null)).catch(() => {});
  }, [freePlan]);

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 4500);
  }, []);

  const { busy, setBusy, startCheckout } = useBillingCheckout({
    onToast: showToast,
    onRefresh: loadBillingData,
    onVerified: () => router.push('/onboarding'),
  });

  useEffect(() => {
    loadBillingData().finally(() => setLoading(false));
  }, [loadBillingData]);

  const status = usage?.subscriptionStatus ?? 'payment_required';
  const subscription = usage?.subscription;
  const hasEntitlement = ACTIVE_STATUSES.has(status);
  const roleSeesPlanControls = useCanSee('billing.planControls');
  const canManageBilling = roleSeesPlanControls && usage?.canManageBilling !== false;
  const currentPlanId = usage?.plan ?? 'starter';
  const currentPlanConfig = PLAN_CONFIG.find((p) => p.id === currentPlanId) ?? PLAN_CONFIG[0];
  const currentPlanRank = PLAN_CONFIG.findIndex((p) => p.id === currentPlanId);
  const currentPeriodActive = Boolean(subscription?.currentPeriodEnd && new Date(subscription.currentPeriodEnd).getTime() > Date.now());
  const currentPlanPrice = subscription?.billingPeriod === 'annual' ? currentPlanConfig.annualMonthly : currentPlanConfig.monthly;
  const selectedBillingPeriod = annual ? 'annual' : 'monthly';
  const requiredNotice = searchParams.get('required') === '1';

  const statusLabel = useMemo(() => ({
    active: 'Active',
    past_due: 'Payment retry in progress',
    restricted: 'Restricted',
    payment_required: 'Billing required',
    cancelled: 'Cancelled',
  }[status] ?? 'Billing required'), [status]);

  useEffect(() => {
    if (loading || canManageBilling) return;
    api.get('/team')
      .then(res => setOwner((res.data?.members ?? []).find(member => member.role === 'owner') ?? null))
      .catch(() => {});
  }, [loading, canManageBilling]);

  const handleCheckout = (planId, period = selectedBillingPeriod) => {
    if (!canManageBilling) {
      showToast('Ask your organization billing manager to choose a plan.');
      return;
    }
    startCheckout(planId, period);
  };

  const handlePlanChange = async (planId, period = selectedBillingPeriod) => {
    if (!canManageBilling) {
      showToast('Ask your organization billing manager to change the plan.');
      return;
    }
    setBusy(planId);
    try {
      const { data } = await api.post('/billing/subscription/change-quote', {
        planId,
        billingPeriod: period,
        idempotencyKey: `billing-${planId}-${period}-${Date.now()}`,
      });
      setPlanChangeQuote(data);
    } catch (err) {
      showToast(err?.response?.data?.error ?? 'Could not change the plan.');
    } finally {
      setBusy("");
    }
  };

  const closePlanChangeQuote = () => {
    if (!planChangeSubmitting) setPlanChangeQuote(null);
  };

  const confirmPlanChange = async () => {
    if (!planChangeQuote?.quoteId || planChangeSubmitting) return;
    setPlanChangeSubmitting(true);
    try {
      let { data } = await api.patch('/billing/subscription', { attemptId: planChangeQuote.quoteId });
      if (data.status === 'payment_pending' || data.status === 'submitted') {
        showToast('Payment is being processed. We will activate the plan after Razorpay confirms it.');
        for (let attempt = 0; attempt < 8; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 1500));
          const statusResponse = await api.get(`/billing/subscription/change/${planChangeQuote.quoteId}`);
          data = statusResponse.data;
          if (['paid', 'scheduled', 'failed', 'expired'].includes(data.status)) break;
        }
      }
      if (data.status === 'paid') {
        showToast('Payment confirmed. Your plan and credits have been updated.');
      } else if (data.status === 'scheduled') {
        showToast('Change scheduled for the end of the current billing period.');
      } else if (data.status === 'payment_pending' || data.status === 'submitted') {
        showToast('Payment is still being confirmed. Refresh shortly to see the result.');
      } else {
        showToast('The plan change could not be confirmed. Your current plan is unchanged.');
      }
      await loadBillingData();
      setPlanChangeQuote(null);
    } catch (err) {
      showToast(err?.response?.data?.error ?? 'Could not confirm the plan change.');
    } finally {
      setPlanChangeSubmitting(false);
    }
  };

  const handlePlanAction = (planId, period = selectedBillingPeriod) => {
    const samePlan = hasEntitlement && planId === currentPlanId && period === subscription?.billingPeriod;
    if (samePlan) return;
    const isDowngrade = hasEntitlement && PLAN_CONFIG.findIndex((plan) => plan.id === planId) < currentPlanRank;
    if (isDowngrade && currentPeriodActive) {
      showToast(`Downgrades are available after ${formatDate(subscription.currentPeriodEnd)}.`);
      return;
    }
    if (hasEntitlement && subscription?.providerStatus !== 'halted') {
      handlePlanChange(planId, period);
    } else {
      handleCheckout(planId, period);
    }
  };

  const handleCancel = async () => {
    if (!canManageBilling || subscription?.cancelAtCycleEnd) return;
    if (!(await confirm({ title: 'Cancel your plan?', body: `It stays active until ${formatDate(subscription?.currentPeriodEnd)} and does not renew. Campaigns pause when it ends.`, keeps: 'Your leads, campaigns and history.', confirmLabel: 'Cancel plan', danger: true }))) return;
    setBusy('cancel');
    try {
      await api.post('/billing/cancel');
      showToast('Cancellation scheduled. Your access remains active through the paid period.');
      await loadBillingData();
    } catch (err) {
      showToast(err?.response?.data?.error ?? 'Could not schedule cancellation.');
    } finally {
      setBusy("");
    }
  };

  if (showSkeleton) return <RouteSkeleton />;

  return (
    <main className="gx billing-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {toast && (
        <div role="status" style={{ position: "fixed", bottom: 24, right: 24, background: "var(--ink)", color: "var(--bg)", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999, maxWidth: 380, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {planChangeQuote && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePlanChangeQuote(); }} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(9, 17, 18, 0.62)', display: 'grid', placeItems: 'center', padding: 20 }}>
          <div role="dialog" aria-modal="true" aria-labelledby="plan-change-title" className="card" style={{ width: 'min(560px, 100%)', padding: 26, boxShadow: '0 20px 70px rgba(0,0,0,0.25)' }}>
            <div className="row spread" style={{ gap: 16, alignItems: 'flex-start' }}>
              <div>
                <h2 id="plan-change-title" className="display" style={{ fontSize: 22 }}>Confirm plan changes</h2>
                <p className="muted" style={{ fontSize: 13.5, marginTop: 5 }}>
                  {planChangeQuote.change === 'cycle_end' ? 'Your current plan stays active until the end of this billing period.' : 'Your new plan starts after Razorpay confirms the payment.'}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={closePlanChangeQuote} disabled={planChangeSubmitting} aria-label="Close">×</button>
            </div>

            <div style={{ borderTop: '1px solid var(--line-2)', marginTop: 20, paddingTop: 18 }}>
              <div className="row spread" style={{ marginBottom: 14 }}>
                <span style={{ fontWeight: 700 }}>{planChangeQuote.current.planName} subscription</span>
                <strong>{formatMoney(planChangeQuote.current.amount, planChangeQuote.adjustment.currency)}</strong>
              </div>
              <div className="row spread muted" style={{ marginBottom: 18, fontSize: 13.5 }}>
                <span>New plan billed {planChangeQuote.requested.billingPeriod}</span>
                <span>{formatMoney(planChangeQuote.requested.amount, planChangeQuote.adjustment.currency)}</span>
              </div>
              {planChangeQuote.change === 'immediate' && (
                <>
                  <div className="row spread" style={{ marginBottom: 10 }}><span>Unused {planChangeQuote.current.planName} credit</span><span style={{ color: 'var(--g-700)' }}>−{formatMoney(planChangeQuote.adjustment.unusedCurrentCredit, planChangeQuote.adjustment.currency)}</span></div>
                  <div className="row spread" style={{ marginBottom: 10 }}><span>Subtotal</span><span>{formatMoney(planChangeQuote.adjustment.subtotal, planChangeQuote.adjustment.currency)}</span></div>
                  <div className="row spread muted" style={{ marginBottom: 16 }}><span>Tax ({planChangeQuote.adjustment.taxRatePercent}%)</span><span>{formatMoney(planChangeQuote.adjustment.tax, planChangeQuote.adjustment.currency)}</span></div>
                  <div className="row spread" style={{ borderTop: '1px solid var(--line-2)', paddingTop: 14, fontSize: 16, fontWeight: 800 }}><span>Total due today</span><span>{formatMoney(planChangeQuote.adjustment.total, planChangeQuote.adjustment.currency)}</span></div>
                </>
              )}
              {planChangeQuote.change === 'cycle_end' && (
                <div className="card" style={{ padding: 13, marginTop: 12, background: 'var(--g-50)', border: '1px solid var(--g-100)' }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>No payment due today</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>The change takes effect after {formatDate(planChangeQuote.currentPeriodEnd)}. Your current credits remain unchanged until then.</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 18, fontSize: 13.5 }}>
              <span className="muted">Payment method </span>
              <strong>{planChangeQuote.paymentMethod ?? 'Saved Razorpay payment method'}</strong>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12.5 }}>Next renewal: {formatDate(planChangeQuote.currentPeriodEnd)} at {formatMoney(planChangeQuote.requested.amount, planChangeQuote.adjustment.currency)} per {planChangeQuote.requested.billingPeriod === 'annual' ? 'year' : 'month'}.</div>

            <div className="row" style={{ justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={closePlanChangeQuote} disabled={planChangeSubmitting}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmPlanChange} disabled={planChangeSubmitting}>
                {planChangeSubmitting ? 'Processing…' : planChangeQuote.change === 'cycle_end' ? 'Schedule change' : 'Pay now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ph">
        <div>
          <h1>Billing &amp; plan</h1>
          <p>
            {freePlan
              ? `${organization?.name || 'Your workspace'} is on the Free plan. No card on file.`
              : canManageBilling
                ? 'Your plan, credits and invoices. Payments run through Razorpay.'
                : 'You can see the plan and credits. Only the Owner can change them.'}
          </p>
        </div>
        {canManageBilling || freePlan ? (
          <div className="acts">
            <button type="button" className="bt bt-g" onClick={() => router.push('/pricing')}>Compare plans</button>
            <button type="button" className="bt bt-p" onClick={() => document.getElementById('billing-plans')?.scrollIntoView({ behavior: 'smooth' })}>
              {freePlan ? <><Icon name="star" size={15} color="#06231a" /> Upgrade to {upgradePlan().name}</> : 'Explore plans'}
            </button>
          </div>
        ) : null}
      </div>

      {(requiredNotice || status === 'payment_required') && !freePlan && (
        <div className="gnote warn" role="alert"><b>Please complete billing to continue.</b> Select a monthly or yearly plan below. Razorpay securely connects your payment method, and successful verification takes you through onboarding.</div>
      )}
      {status === 'past_due' && (
        <div className="gnote warn" role="alert"><b>Your renewal needs attention.</b> Access stays available during the seven-day grace period while Razorpay retries the payment. Contact Support if it does not complete.</div>
      )}
      {status === 'restricted' && (
        <div className="gnote bad" role="alert"><b>Access is restricted until billing is restored.</b> Choose a plan below to start a new paid subscription. Your previous subscription will not be charged again by this action.</div>
      )}
      {subscription?.cancelAtCycleEnd && (
        <div className="gnote ok" role="status"><b>Cancellation scheduled.</b> Your plan stays available through {formatDate(subscription.currentPeriodEnd)} and will not renew after that.</div>
      )}
      {(usage?.meteringStatus === 'unavailable' || (hasEntitlement && (usage?.credits?.remainingCredits ?? 0) <= 0)) && (
        <div className="gnote bad" role="alert">
          {usage?.meteringStatus === 'unavailable'
            ? 'Credit metering is not available yet. New AI, enrichment, and voice actions are paused until the billing ledger is ready.'
            : 'Your credit balance is empty. New AI, enrichment, and voice actions are paused; work already in flight can still finish.'}
        </div>
      )}

      <div className="plan-hero">
        <div>
          <div className="pn">
            {freePlan ? 'Free' : hasEntitlement ? currentPlanConfig.name : 'No active plan'}
            <small>
              {freePlan
                ? '$0'
                : hasEntitlement
                  ? `$${currentPlanPrice} a month · ${subscription?.cancelAtCycleEnd ? 'ends' : 'renews'} ${formatDate(subscription?.currentPeriodEnd)}`
                  : statusLabel}
            </small>
          </div>
          <p>
            {freePlan
              ? `${FREE_PLAN.emailCampaigns} email campaign from your own inbox, your own leads, about ${FREE_PLAN.monthlyAiEmails} AI-written emails a month.`
              : !canManageBilling
                ? `Managed by ${owner ? [owner.first_name, owner.last_name].filter(Boolean).join(' ') || owner.email : 'the Owner'}. Ask them to upgrade, top up credits or change seats.`
                : hasEntitlement
                  ? `${currentPlanConfig.monthlyCredits.toLocaleString()} credits a month, ${currentPlanConfig.emailCampaigns} email and ${currentPlanConfig.voiceCampaigns} voice campaigns at once, ${currentPlanConfig.maxSeats} seat${currentPlanConfig.maxSeats === 1 ? '' : 's'}.`
                  : 'Choose a paid plan to unlock your workspace.'}
          </p>
        </div>
        {freePlan ? (
          <button type="button" className="bt bt-p" onClick={() => handlePlanAction(upgradePlan().id)} disabled={!canManageBilling}>
            <Icon name="star" size={14} color="#06231a" /> Upgrade · ${upgradePlan().monthly}/mo
          </button>
        ) : canManageBilling && hasEntitlement ? (
          <div className="acts">
            {subscription?.billingPeriod !== 'annual' && (
              <button type="button" className="bt bt-g" onClick={() => { setAnnual(true); handlePlanAction(currentPlanId, 'annual'); }}>
                Switch to yearly · ${currentPlanConfig.annualMonthly}/mo
              </button>
            )}
            <button type="button" className="bt bt-p" onClick={() => document.getElementById('billing-plans')?.scrollIntoView({ behavior: 'smooth' })}>Change plan</button>
          </div>
        ) : null}
      </div>

      <div className="meters" data-tour="billing-usage">
        {freePlan ? (
          <>
            <Meter
              label="AI credits this month"
              value={`${freeLive?.creditsUsed ?? 0} of ${freeLive?.creditsTotal || FREE_PLAN.monthlyCredits}`}
              used={freeLive?.creditsUsed}
              limit={freeLive?.creditsTotal || FREE_PLAN.monthlyCredits}
              note={`About ${FREE_PLAN.monthlyAiEmails} AI-written emails. Drafts pause when they run out.`}
            />
            <Meter
              label="Sent today"
              value={freeLive?.sentToday != null ? `${freeLive.sentToday} of ${freeLive.dailyCap || FREE_PLAN.dailyEmailCap}` : `Up to ${FREE_PLAN.dailyEmailCap}`}
              used={freeLive?.sentToday}
              limit={freeLive?.dailyCap || FREE_PLAN.dailyEmailCap}
              note="Resets each day in your timezone"
            />
            <Meter label="Leads" value={`${freeKpis?.savedLeads ?? 0} of ${FREE_PLAN.maxLeads}`} used={freeKpis?.savedLeads} limit={FREE_PLAN.maxLeads} note="CSV upload or manual entry only" />
            <Meter label="Email campaigns" value={`${usage?.campaignUsage?.email?.used ?? 0} of ${FREE_PLAN.emailCampaigns}`} used={usage?.campaignUsage?.email?.used} limit={FREE_PLAN.emailCampaigns} note="Pause it to start a different one" />
          </>
        ) : (
          <>
            <Meter
              label="Credits left"
              value={(usage?.credits?.remainingCredits ?? 0).toLocaleString()}
              used={usage?.credits?.remainingCredits}
              limit={usage?.credits?.totalCredits ?? currentPlanConfig.monthlyCredits}
              note={`of ${(usage?.credits?.totalCredits ?? currentPlanConfig.monthlyCredits).toLocaleString()} this month · 1 credit is 1 cent of provider cost`}
            />
            <Meter label="Seats" value={`${usage?.seatsUsed ?? 0} of ${usage?.seatLimit ?? currentPlanConfig.maxSeats}`} used={usage?.seatsUsed} limit={usage?.seatLimit ?? currentPlanConfig.maxSeats} note={canManageBilling ? 'Manage people in Team' : 'You have an active seat'} />
            <Meter label="Email campaigns" value={`${usage?.campaignUsage?.email?.used ?? 0} of ${usage?.campaignUsage?.email?.limit ?? currentPlanConfig.emailCampaigns}`} used={usage?.campaignUsage?.email?.used} limit={usage?.campaignUsage?.email?.limit ?? currentPlanConfig.emailCampaigns} />
            <Meter label="Voice campaigns" value={`${usage?.campaignUsage?.voice?.used ?? 0} of ${usage?.campaignUsage?.voice?.limit ?? currentPlanConfig.voiceCampaigns}`} used={usage?.campaignUsage?.voice?.used} limit={usage?.campaignUsage?.voice?.limit ?? currentPlanConfig.voiceCampaigns} />
          </>
        )}
      </div>

      {!canManageBilling && !freePlan ? (
        <div className="two">
          <div className="card">
            <div className="card-h"><div><b>What you can do</b><small>Set by the Owner and Admins in Team.</small></div></div>
            <div className="pad" style={{ paddingTop: 6 }}>
              {MEMBER_PERMISSIONS.map(([label, value]) => (
                <div key={label} className="lk"><i><Icon name={value === 'Yes' ? 'check' : 'lock'} size={13} /></i><span>{label}</span><em style={value === 'Yes' ? undefined : { color: '#69786f' }}>{value}</em></div>
              ))}
            </div>
          </div>
          <div className="scol">
            <div className="card pad">
              <h3 className="h3">Need more credits?</h3>
              <p className="sub">Only {owner ? [owner.first_name, owner.last_name].filter(Boolean).join(' ') || owner.email : 'the Owner'} can top up or change the plan.</p>
              {owner?.email ? <a className="bt bt-p" style={{ marginTop: 14, justifyContent: 'center' }} href={`mailto:${owner.email}?subject=${encodeURIComponent('GNX credits')}`}>Email {owner.first_name || 'the Owner'}</a> : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="two">
          <div className="scol">
            <div className="card" id="billing-plans" style={{ scrollMarginTop: 16 }}>
              <div className="card-h">
                <div><b>Plans</b><small>{freePlan ? 'Upgrade any time. Your campaign, leads and inbox carry over.' : 'You see the amount due before you confirm any change.'}</small></div>
                <div className="seg" role="tablist" aria-label="Billing period">
                  <button type="button" role="tab" aria-selected={!annual} className={!annual ? 'on' : ''} onClick={() => setAnnual(false)}>Monthly</button>
                  <button type="button" role="tab" aria-selected={annual} className={annual ? 'on' : ''} onClick={() => setAnnual(true)}>Yearly <em>save {MAX_ANNUAL_SAVINGS_PERCENT}%</em></button>
                </div>
              </div>
              <div className="pad">
                <div className="plans-row" style={{ gridTemplateColumns: `repeat(${PLAN_CONFIG.length + (freePlan ? 1 : 0)}, minmax(0, 1fr))` }}>
                  {freePlan ? (
                    <div className="pc2 cur">
                      <b>Free</b>
                      <div className="pp">$0</div>
                      <ul><li>~{FREE_PLAN.monthlyAiEmails} AI emails a month</li><li>{FREE_PLAN.emailCampaigns} email campaign</li><li>Your own leads by CSV</li></ul>
                      <button type="button" className="bt bt-g" disabled>Current plan</button>
                    </div>
                  ) : null}
                  {PLAN_CONFIG.map((plan) => {
                    const isCurrent = hasEntitlement && plan.id === currentPlanId;
                    const sameSelection = isCurrent && selectedBillingPeriod === subscription?.billingPeriod;
                    const planRank = PLAN_CONFIG.findIndex((candidate) => candidate.id === plan.id);
                    const downgradeBlocked = hasEntitlement && planRank < currentPlanRank && currentPeriodActive;
                    const actionDisabled = !canManageBilling || sameSelection || downgradeBlocked || busy === plan.id || (status === 'past_due' && isCurrent);
                    const upgrade = !hasEntitlement || planRank > currentPlanRank;
                    const actionLabel = busy === plan.id
                      ? 'Please wait…'
                      : sameSelection
                        ? 'Current plan'
                        : downgradeBlocked
                          ? 'After period ends'
                          : !hasEntitlement
                            ? (freePlan ? 'Upgrade' : 'Choose plan')
                            : isCurrent
                              ? 'Change billing period'
                              : upgrade ? 'Upgrade' : 'Switch';
                    return (
                      <div key={plan.id} className={`pc2 ${isCurrent ? 'cur' : ''}`}>
                        <b>{plan.name}</b>
                        <div className="pp">${annual ? plan.annualMonthly : plan.monthly}<span>/mo</span></div>
                        <ul>
                          <li>{plan.monthlyCredits.toLocaleString()} credits a month</li>
                          <li>{plan.emailCampaigns} email · {plan.voiceCampaigns} voice campaign{plan.voiceCampaigns === 1 ? '' : 's'}</li>
                          <li>{plan.maxSeats} seat{plan.maxSeats === 1 ? '' : 's'} · {plan.maxEmailAccounts} inbox{plan.maxEmailAccounts === 1 ? '' : 'es'} · {plan.maxPhoneNumbers} number{plan.maxPhoneNumbers === 1 ? '' : 's'}</li>
                          {annual ? <li>Billed ${plan.annualTotal.toLocaleString()} a year</li> : null}
                        </ul>
                        <button type="button" className={`bt ${sameSelection || !upgrade ? 'bt-g' : 'bt-p'}`} disabled={actionDisabled} onClick={() => handlePlanAction(plan.id)}>{actionLabel}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-h"><div><b>Billing history</b><small>{history.length ? 'Payments processed by Razorpay.' : freePlan ? 'Invoices appear here once you upgrade.' : 'No charges yet.'}</small></div></div>
              {history.length === 0 ? (
                <div className="empty">No charges yet.</div>
              ) : (
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead><tr><th>Date</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>{history.map((item) => (
                      <tr key={item.id} style={{ cursor: 'default' }}>
                        <td>{formatDate(item.created_at)}</td>
                        <td style={{ textTransform: 'capitalize' }}>{(PLAN_CONFIG.find(plan => plan.id === item.plan_id)?.name || item.plan_id)} · {item.billing_period}</td>
                        <td>{formatMoney(item.amount, item.currency)}</td>
                        <td><span className={`pl ${item.status === 'paid' || item.status === 'captured' ? 'pl-ok' : 'pl-mute'}`} style={{ textTransform: 'capitalize' }}>{item.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="scol">
            {freePlan ? (
              <div className="card pad unl">
                <h3 className="h3">What changes when you upgrade</h3>
                {[['Lead database search', upgradePlan().name], ['Verified work emails', upgradePlan().name], ['AI calling', upgradePlan().name], ['More seats', PLAN_CONFIG[1].name]].map(([label, plan]) => (
                  <div key={label} className="lk"><i><Icon name="lock" size={13} /></i><span>{label}</span><em>{plan}</em></div>
                ))}
              </div>
            ) : (
              <div className="card pad">
                <h3 className="h3">This month</h3>
                <p className="sub">{subscription?.currentPeriodStart ? `${formatDate(subscription.currentPeriodStart)} to ${formatDate(subscription.currentPeriodEnd)}` : 'Current billing month'}</p>
                <div style={{ marginTop: 8 }}>
                  <div className="kv"><span>Included credits</span><b>{(usage?.credits?.includedCredits ?? currentPlanConfig.monthlyCredits).toLocaleString()}</b></div>
                  <div className="kv"><span>Top-up credits</span><b>{(usage?.credits?.topUpCredits ?? 0).toLocaleString()}</b></div>
                  <div className="kv"><span>Used</span><b>{(usage?.credits?.usedCredits ?? 0).toLocaleString()}</b></div>
                  <div className="kv"><span>Reserved for running actions</span><b>{(usage?.credits?.reservedCredits ?? 0).toLocaleString()}</b></div>
                  <div className="kv"><span>Credit balance</span><b>{(usage?.credits?.remainingCredits ?? 0).toLocaleString()}</b></div>
                </div>
                <div className="gnote" style={{ marginTop: 12 }}>1 credit is 1 cent of reported provider cost. Usage resets at the start of each billing month.</div>
              </div>
            )}
            {!freePlan && hasEntitlement ? (
              <div className="card pad">
                <h3 className="h3">Payment method</h3>
                <p className="sub">Managed securely by Razorpay. You confirm the payment method before any plan change is charged.</p>
              </div>
            ) : null}
            {canManageBilling && hasEntitlement && !subscription?.cancelAtCycleEnd ? (
              <div className="card pad">
                <h3 className="h3">Cancel plan</h3>
                <p className="sub">Your plan stays active until {formatDate(subscription?.currentPeriodEnd)}. Campaigns pause when it ends.</p>
                <button type="button" className="lnk" style={{ marginTop: 10, color: '#b42318' }} onClick={handleCancel} disabled={busy === 'cancel'}>{busy === 'cancel' ? 'Scheduling…' : 'Cancel plan'}</button>
              </div>
            ) : null}
            {freePlan ? (
              <div className="card pad">
                <h3 className="h3">Free plan rules</h3>
                <div className="gnote" style={{ marginTop: 10 }}>The Free plan includes {FREE_PLAN.emailCampaigns} email campaign, up to {FREE_PLAN.dailyEmailCap} emails a day and {FREE_PLAN.maxLeads} leads. Upgrade any time to remove the limits.</div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
