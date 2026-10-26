import { createContext, useContext } from 'react';
import { findPlan } from './plans';

// Free-plan limits shown in the workspace. They mirror the backend's
// BILLING_PLANS.free (gnx_backend src/config/billing-catalog.ts), which is
// what actually enforces them.
export const FREE_PLAN = {
  id: 'free',
  name: 'Free',
  // 300 credits a month is about 200 AI-written emails at ~1 credit each.
  monthlyCredits: 300,
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
// Mirrors PERSONAL_EMAIL_DOMAINS in gnx_backend src/services/free-plan.service.ts.
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk", "ymail.com", "rocketmail.com",
  "outlook.com", "hotmail.com", "hotmail.co.uk", "live.com", "msn.com", "icloud.com", "me.com", "mac.com",
  "aol.com", "proton.me", "protonmail.com", "pm.me", "gmx.com", "gmx.net", "mail.com", "zoho.com",
  "zohomail.com", "yandex.com", "yandex.ru", "rediffmail.com", "tutanota.com", "tuta.io", "fastmail.com",
  "hey.com", "qq.com", "163.com", "126.com", "web.de", "mail.ru", "inbox.com", "duck.com",
]);

export function isPersonalEmail(email) {
  const domain = String(email || "").trim().toLowerCase().split("@")[1];
  return Boolean(domain && PERSONAL_EMAIL_DOMAINS.has(domain));
}

export const OrgContext = createContext(null);
export function useOrg() { return useContext(OrgContext); }
