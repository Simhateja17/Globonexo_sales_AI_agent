// The plan picked on /onboarding/plan, right after sign-up. Paid plans are
// not charged then: setup runs first and checkout opens from the Launch
// button, so the choice is remembered in the browser until that point.
import { FREE_PLAN, findPlan, marketingCeilingsFor } from './plans';
import { BILLING_ACCESS_STATUSES } from './billingAccess';

export const PLAN_CHOICE_KEY = 'gnx_plan_choice';
export const FREE_ELIGIBILITY_KEY = 'gnx_free_eligibility';

const PERIODS = new Set(['monthly', 'annual']);

export function readPlanChoice(storage) {
  try {
    const parsed = JSON.parse(storage?.getItem(PLAN_CHOICE_KEY) || 'null');
    if (!parsed || (parsed.planId !== FREE_PLAN.id && !findPlan(parsed.planId))) return null;
    return { planId: parsed.planId, billingPeriod: PERIODS.has(parsed.billingPeriod) ? parsed.billingPeriod : 'annual' };
  } catch {
    return null;
  }
}

export function writePlanChoice(storage, choice) {
  try { storage?.setItem(PLAN_CHOICE_KEY, JSON.stringify(choice)); } catch { /* convenience only */ }
}

export function clearPlanChoice(storage) {
  try { storage?.removeItem(PLAN_CHOICE_KEY); } catch { /* ignore */ }
}

/** What sign-up said about Free for this email, kept for the plan page. */
export function rememberFreeEligibility(storage, eligibility) {
  if (!eligibility) return;
  try { storage?.setItem(FREE_ELIGIBILITY_KEY, eligibility); } catch { /* ignore */ }
}

export function readFreeEligibility(storage) {
  try { return storage?.getItem(FREE_ELIGIBILITY_KEY) || null; } catch { return null; }
}

/** Free can be picked when the workspace is already on it (sign-up granted it). */
export function canUseFree(organization) {
  return organization?.subscription_status === 'free';
}

/** Why Free is not available, in words the person can act on. */
export function freeUnavailableReason(eligibility) {
  if (eligibility === 'personal_email') return 'Needs a work email. You signed up with a personal address.';
  if (eligibility === 'domain_taken') return 'Someone at your company already has a Free workspace. Ask them to invite you.';
  if (eligibility === 'paused') return "Free sign-ups are paused right now. You're on the waitlist.";
  return 'Free needs a work email that is not already on another Free workspace.';
}

function hasPaidAccess(organization) {
  return organization?.plan_id !== FREE_PLAN.id && BILLING_ACCESS_STATUSES.has(organization?.subscription_status);
}

/**
 * The plan setup should be shaped for: the paid plan picked on the plan page
 * (not charged yet), otherwise the workspace's own plan.
 */
export function effectivePlanId(organization, choice) {
  if (hasPaidAccess(organization)) return organization.plan_id;
  if (choice?.planId) return choice.planId;
  return organization?.plan_id || FREE_PLAN.id;
}

/** Checkout still has to run before launch: a paid plan was picked and is not active yet. */
export function needsCheckout(organization, choice) {
  if (!choice || choice.planId === FREE_PLAN.id) return false;
  return !(hasPaidAccess(organization) && organization.plan_id === choice.planId);
}

/** A workspace that cannot use the app yet and has not picked a plan. */
export function needsPlanChoice(organization, choice) {
  if (!organization) return false;
  if (BILLING_ACCESS_STATUSES.has(organization.subscription_status)) return false;
  return !choice || choice.planId === FREE_PLAN.id;
}

export const money = n => `$${Number(n).toLocaleString("en-US")}`;
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** One plan card's numbers and checklist, from the shared plan catalogue. */
export function planCard(plan, annual) {
  if (plan.id === FREE_PLAN.id) {
    return {
      id: plan.id, name: plan.name, desc: plan.desc,
      price: "$0", per: "forever", billed: "No card needed",
      stats: [["Emails / month", (plan.dailyEmailCap * 30).toLocaleString("en-US")], ["AI calls / month", "None"], ["Campaigns", `${plan.emailCampaigns} email`], ["Seats", String(plan.maxSeats)]],
      feats: ["AI-written emails and follow-ups", "Send from your own inbox", `Up to ${plan.maxLeads} uploaded leads`],
      missing: ["Verified lead search", "AI voice calling"],
    };
  }
  const ceilings = marketingCeilingsFor(plan);
  return {
    id: plan.id, name: plan.name, desc: plan.desc,
    price: money(annual ? plan.annualMonthly : plan.monthly), per: "/ month",
    billed: annual ? `Billed ${money(plan.annualTotal)} yearly` : "Billed monthly",
    stats: [
      ["Emails / month", ceilings.emailsPerMonth.toLocaleString("en-US")],
      ["AI calls / month", `About ${ceilings.callsPerMonth}`],
      ["Campaigns", `${plan.emailCampaigns} email · ${plan.voiceCampaigns} voice`],
      ["Seats", String(plan.maxSeats)],
    ],
    feats: [
      `${plan.monthlyCredits.toLocaleString("en-US")} credits a month`,
      "Verified lead search",
      `AI voice calling, ${plural(plan.maxPhoneNumbers, "number")}`,
      plural(plan.maxEmailAccounts, "sending inbox").replace("inboxs", "inboxes"),
    ],
    missing: [],
  };
}

