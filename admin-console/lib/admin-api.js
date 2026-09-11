import axios from 'axios';

// The admin deployment proxies this relative path to the separately routed
// admin API host. No customer API URL or customer session cookie is reused.
export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL || '/api',
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.response.use(
  response => response,
  error => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const detail = error.response.data;
      const stepUpRequired = detail?.details?.code === 'admin_mfa_step_up_required';
      window.dispatchEvent(new CustomEvent(stepUpRequired ? 'gnx:admin:step-up-required' : 'gnx:admin:session-expired', { detail }));
    }
    return Promise.reject(error);
  },
);

export default adminApi;
