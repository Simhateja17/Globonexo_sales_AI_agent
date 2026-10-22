// Opt-in, not opt-out: an unset env var must never grant workspace access.
// This is a NEXT_PUBLIC_* var baked into the client bundle at build time, so
// if it's simply absent from an environment's config (as it is in production
// today) the bypass must default to off, not on.
export const DEV_BILLING_BYPASS = process.env.NEXT_PUBLIC_DEV_BILLING_BYPASS === '1';

// `free` is the backend's no-payment plan (organizations.subscription_status
// 'free'); its limits are enforced server-side by the plan catalog.
export const BILLING_ACCESS_STATUSES = new Set(['active', 'past_due', 'free']);

/**
 * Where to send someone straight after signing up or in. A brand-new Free
 * workspace goes to onboarding first, the same step a paid workspace reaches
 * after checkout. `freePlan` is the eligibility the signup endpoints return.
 */
export function postAuthPath({ user, organization, freePlan } = {}) {
  if (freePlan === 'eligible') return '/onboarding';
  return hasWorkspaceAccess(user, organization) ? '/dashboard' : '/subscribe';
}

export function hasWorkspaceAccess(user, organization) {
  if (!user || !organization) return false;
  if (user.membership_status && user.membership_status !== 'active') return false;
  if (DEV_BILLING_BYPASS) return true;
  return BILLING_ACCESS_STATUSES.has(organization.subscription_status);
}
