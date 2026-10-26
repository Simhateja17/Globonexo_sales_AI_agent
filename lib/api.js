import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isSessionCheck = url.includes('/auth/me');
    const isAuthEndpoint = url.includes('/auth/');

    if (err.response?.status === 401 && !isSessionCheck && !isAuthEndpoint && typeof window !== 'undefined') {
      const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
      window.location.assign(`/login?next=${next}`);
    }

    // The backend answers 402 with code plan_upgrade_required when the plan
    // does not include an action (Free and lead search, AI calling, the lead
    // cap), and credits_exhausted when the credit balance is empty. The
    // workspace shell listens and offers the upgrade; the page that made the
    // request still shows its own error.
    const details = err.response?.data?.details;
    const upgradeCodes = ['plan_upgrade_required', 'credits_exhausted'];
    if (err.response?.status === 402 && upgradeCodes.includes(details?.code) && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gnx:upgrade-required', {
        detail: {
          title: details.code === 'credits_exhausted' ? 'You are out of credits' : undefined,
          message: err.response?.data?.error,
          details,
        },
      }));
    }

    return Promise.reject(err);
  }
);

export { API_BASE_URL };
export default api;
