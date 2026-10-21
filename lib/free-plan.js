import { createContext, useContext } from 'react';
import { findPlan } from './plans';

// Free-plan limits shown in the workspace. The backend has no free tier yet
// (BILLING_PLANS only knows starter/growth/scale), so nothing here is
// enforced server-side: these numbers only drive the free-plan screens, which
// appear for an organization whose plan_id is 'free'.
export const FREE_PLAN = {
  id: 'free',
  name: 'Free',
  monthlyAiEmails: 200,
  dailyEmailCap: 30,
  maxLeads: 500,
  emailCampaigns: 1,
};

export const FREE_UPGRADE_PLAN_ID = 'starter';

export function isFreePlan(organization) {
  return organization?.plan_id === FREE_PLAN.id;
}

export function upgradePlan() {
  return findPlan(FREE_UPGRADE_PLAN_ID);
}

// Rows for the Free vs paid comparison in the upgrade prompt.
export function freeComparisonRows(plan = upgradePlan()) {
  return [
    ['Find leads in the lead database', 'No', 'Yes'],
    ['Email checking', 'Format and domain', 'Verified'],
    ['Email campaigns at once', String(FREE_PLAN.emailCampaigns), String(plan.emailCampaigns)],
    ['Emails a day', String(FREE_PLAN.dailyEmailCap), String(plan.dailyEmailCap)],
    ['AI calling', 'No', `${plan.voiceCampaigns} voice campaign${plan.voiceCampaigns === 1 ? '' : 's'}`],
    ['AI writing', `~${FREE_PLAN.monthlyAiEmails} emails`, `${plan.monthlyCredits.toLocaleString()} credits`],
  ];
}

// Free sends from a company inbox only: a personal mailbox on a shared
// consumer domain would put the provider's reputation, not the customer's,
// behind cold email.
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "msn.com",
  "yahoo.com", "ymail.com", "icloud.com", "me.com", "mac.com", "aol.com",
  "proton.me", "protonmail.com", "gmx.com", "zoho.com", "yandex.com", "mail.com",
]);

export function isPersonalEmail(email) {
  const domain = String(email || "").trim().toLowerCase().split("@")[1];
  return Boolean(domain && PERSONAL_EMAIL_DOMAINS.has(domain));
}

export const OrgContext = createContext(null);
export function useOrg() { return useContext(OrgContext); }
