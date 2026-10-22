'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { postAuthPath } from '../../../lib/billingAccess';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hash.get('access_token');
    const refreshToken = hash.get('refresh_token');
    const expiresIn = Number(hash.get('expires_in')) || 3600;
    const errorDescription = hash.get('error_description');
    const invitationToken = new URLSearchParams(window.location.search).get('invite');

    if (errorDescription || !accessToken) {
      router.replace('/login?error=' + encodeURIComponent(errorDescription || 'oauth_failed'));
      return;
    }

    api
      .post('/auth/google/callback', { accessToken, refreshToken, expiresIn, invitationToken })
      .then((res) => {
        localStorage.setItem('returning_user', '1');
        router.replace(postAuthPath(res.data));
      })
      .catch(() => router.replace('/login?error=oauth_failed'));
  }, [router]);

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <p className="muted" style={{ fontSize: 15 }}>Signing you in with Google…</p>
    </div>
  );
}
