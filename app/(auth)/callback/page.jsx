'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { postAuthPath, rememberPausedWorkspace } from '../../../lib/billingAccess';
import { AuthFrame } from '../../../components/auth/AuthFrame';
import { DomainTaken, FreePaused, JoinRequestSent, PersonalGoogle } from '../../../components/auth/FreeRules';

// Free plan rules that leave a new Google sign-up on a paid plan. The account
// already exists, so each screen explains why before checkout.
const RULE_SCREENS = new Set(['personal_email', 'domain_taken', 'paused']);

export default function AuthCallbackPage() {
  const router = useRouter();
  const [rule, setRule] = useState(null);
  const [asking, setAsking] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinResult, setJoinResult] = useState(null);

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
        if (RULE_SCREENS.has(res.data?.freePlan)) {
          setRule({ kind: res.data.freePlan, data: res.data });
          return;
        }
        rememberPausedWorkspace(res.data);
        router.replace(postAuthPath(res.data));
      })
      .catch(() => router.replace('/login?error=oauth_failed'));
  }, [router]);

  if (!rule) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <p className="muted" style={{ fontSize: 15 }}>Signing you in with Google…</p>
      </div>
    );
  }

  const email = rule.data.user?.email || '';
  const continuePaid = () => router.replace(postAuthPath(rule.data));
  // Swaps the empty workspace Google sign-up just made for a join request.
  // The backend signs the visitor out, since they have no workspace yet.
  const askToJoin = async () => {
    setAsking(true);
    setJoinError('');
    try {
      const { data } = await api.post('/auth/join-requests/from-signup');
      setJoinResult(data);
    } catch (err) {
      setJoinError(err.response?.data?.error || 'Could not send your request. Please try again.');
    } finally {
      setAsking(false);
    }
  };

  if (joinResult) {
    return <AuthFrame panel="free"><JoinRequestSent result={joinResult} /></AuthFrame>;
  }
  const signOutThen = async (href) => {
    try { await api.post('/auth/logout'); } catch { /* cookies expire anyway */ }
    window.location.href = href;
  };

  return (
    <AuthFrame panel="free">
      {rule.kind === 'personal_email' ? (
        <>
          <PersonalGoogle
            email={email}
            onChooseAnother={() => signOutThen(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`)}
            onContinuePaid={continuePaid}
          />
          <div className="au-foot"><Link href="/signup" onClick={(event) => { event.preventDefault(); signOutThen('/signup'); }}>Sign up with your work email</Link></div>
        </>
      ) : rule.kind === 'domain_taken' ? (
        <DomainTaken
          email={email}
          workspace={rule.data.workspace}
          asking={asking}
          error={joinError}
          onAskToJoin={askToJoin}
          onContinuePaid={continuePaid}
        />
      ) : (
        <FreePaused email={email} company={rule.data.organization?.name} onContinuePaid={continuePaid} />
      )}
    </AuthFrame>
  );
}
