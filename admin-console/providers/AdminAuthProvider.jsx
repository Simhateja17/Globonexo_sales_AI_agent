'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import adminApi from '../lib/admin-api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [stepUpRequired, setStepUpRequired] = useState(false);

  const reload = () => adminApi.get('/ops-auth/me')
    .then(response => {
      setAdmin(response.data.admin);
      return response.data.admin;
    })
    .catch(() => {
      setAdmin(null);
      return null;
    });

  useEffect(() => {
    let active = true;
    reload().finally(() => { if (active) setLoading(false); });
    const onExpired = () => setAdmin(null);
    const onStepUp = () => setStepUpRequired(true);
    window.addEventListener('gnx:admin:session-expired', onExpired);
    window.addEventListener('gnx:admin:step-up-required', onStepUp);
    return () => {
      active = false;
      window.removeEventListener('gnx:admin:session-expired', onExpired);
      window.removeEventListener('gnx:admin:step-up-required', onStepUp);
    };
  }, []);

  const value = useMemo(() => ({
    admin,
    loading,
    challenge,
    stepUpRequired,
    startLogin: async email => {
      await adminApi.post('/ops-auth/login/start', { email });
    },
    verifyLogin: async (email, otp) => {
      const response = await adminApi.post('/ops-auth/login/verify', { email, otp });
      setChallenge({ ...response.data, email });
      return response.data;
    },
    enrollMfa: async () => {
      const response = await adminApi.post('/ops-auth/mfa/enroll');
      return response.data;
    },
    verifyMfa: async code => {
      const response = await adminApi.post('/ops-auth/mfa/verify', { code });
      setChallenge(null);
      setAdmin(response.data.admin);
      return response.data.admin;
    },
    stepUp: async code => {
      await adminApi.post('/ops-auth/mfa/step-up', { code });
      setStepUpRequired(false);
    },
    logout: async () => {
      try { await adminApi.post('/ops-auth/logout'); } finally { setAdmin(null); setChallenge(null); setStepUpRequired(false); }
    },
    reload,
  }), [admin, loading, challenge, stepUpRequired]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}
