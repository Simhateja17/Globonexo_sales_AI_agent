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
 * A Free workspace the backend paused for inactivity (free_paused_at) gets a
 * welcome-back screen; the backend lifts the pause on that first visit.
 */
export function postAuthPath({ user, organization, freePlan } = {}) {
  if (freePlan === 'eligible') return '/onboarding';
  if (!hasWorkspaceAccess(user, organization)) return '/subscribe';
  return organization.free_paused_at ? '/welcome-back' : '/dashboard';
}

const PAUSED_KEY = 'gnx:paused-workspace';

// The pause is cleared by the first authenticated request after sign-in, so
// the welcome-back screen reads what the sign-in response said instead.
export function rememberPausedWorkspace({ user, organization } = {}) {
  if (!organization?.free_paused_at) return;
  try {
    window.sessionStorage.setItem(PAUSED_KEY, JSON.stringify({
      pausedAt: organization.free_paused_at,
      organizationName: organization.name || '',
      firstName: user?.first_name || '',
    }));
  } catch {
    // The screen falls back to generic copy.
  }
}

export function readPausedWorkspace() {
  try {
    return JSON.parse(window.sessionStorage.getItem(PAUSED_KEY) || 'null');
  } catch {
    return null;
  }
}

export function hasWorkspaceAccess(user, organization) {
  if (!user || !organization) return false;
  if (user.membership_status && user.membership_status !== 'active') return false;
  if (DEV_BILLING_BYPASS) return true;
  return BILLING_ACCESS_STATUSES.has(organization.subscription_status);
}
