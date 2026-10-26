import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const UPGRADE_REQUIRED_EVENT = 'gnx:upgrade-required';

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

    // Plan limits (Free campaign cap, lead cap, no calling or enrichment)
    // open one shared upgrade prompt instead of each page inventing its own.
    const code = err.response?.data?.details?.code ?? err.response?.data?.code;
    if (err.response?.status === 402 && ['plan_upgrade_required', 'credits_exhausted'].includes(code) && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPGRADE_REQUIRED_EVENT, {
        detail: { message: err.response?.data?.error ?? 'Upgrade your plan to use this.' },
      }));
    }

    return Promise.reject(err);
  }
);

export { API_BASE_URL };
export default api;
