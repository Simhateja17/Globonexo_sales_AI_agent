'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { readPausedWorkspace } from '../../../lib/billingAccess';
import { AuthFrame } from '../../../components/auth/AuthFrame';
import { Icon } from '../../../components/ui/Icon';
import Spinner from '../../../components/ui/Spinner';

function formatDay(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function Row({ icon, title, detail, pill, tone }) {
  return (
    <div className="rw">
      <span className="kpi-ic"><Icon name={icon} size={15} /></span>
      <div><b>{title}</b><small>{detail}</small></div>
      <span className={`pl pl-${tone}`}>{pill}</span>
    </div>
  );
}

// Shown once after signing in to a Free workspace the backend paused for
// inactivity. That sign-in lifts the pause and reconnects the inboxes it
// disconnected; campaigns stay paused until the customer resumes them here.
export default function WelcomeBackPage() {
  const router = useRouter();
  const [paused, setPaused] = useState(null);
  const [state, setState] = useState({ loading: true, campaigns: [], inboxes: [], kpis: {} });
  const [resuming, setResuming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPaused(readPausedWorkspace());
    Promise.allSettled([api.get('/campaigns'), api.get('/email-accounts'), api.get('/dashboard')]).then(([campaignRes, inboxRes, dashRes]) => {
      const items = campaignRes.status === 'fulfilled' && Array.isArray(campaignRes.value.data?.items) ? campaignRes.value.data.items : [];
      setState({
        loading: false,
        campaigns: items.filter(item => item.status === 'paused' && item.suspensionReason === 'free_inactive'),
        inboxes: inboxRes.status === 'fulfilled' && Array.isArray(inboxRes.value.data?.accounts) ? inboxRes.value.data.accounts : [],
        kpis: dashRes.status === 'fulfilled' ? dashRes.value.data?.kpis || {} : {},
      });
    });
  }, []);

  const brokenInbox = state.inboxes.find(inbox => inbox.status === 'disconnected' || inbox.status === 'needs_attention');
  const name = paused?.firstName ? `, ${paused.firstName}` : '';
  const org = paused?.organizationName || 'your workspace';

  const resume = async () => {
    setResuming(true);
    setError('');
    const results = await Promise.allSettled(state.campaigns.map(campaign => api.post(`/campaigns/${campaign.id}/launch`)));
    const failed = results.find(result => result.status === 'rejected');
    if (failed) {
      setError(failed.reason?.response?.data?.error || 'Some campaigns could not be resumed. Open Campaigns to try again.');
      setResuming(false);
      return;
    }
    router.push(state.campaigns.length === 1 ? `/campaigns/${state.campaigns[0].id}` : '/campaigns');
  };

  return (
    <AuthFrame panel="paused">
      <span className="kpi-ic warn big"><Icon name="pause" size={24} /></span>
      <h1>Welcome back{name}</h1>
      <p>
        Nobody at {org} signed in for 60 days, so we paused your campaign{state.campaigns.length === 1 ? '' : 's'}
        {paused?.pausedAt ? ` on ${formatDay(paused.pausedAt)}` : ''} and disconnected your inbox. Everything else is kept.
      </p>

      {state.loading ? (
        <div className="card" style={{ display: 'grid', placeItems: 'center', padding: 28 }}><Spinner size={20} /></div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <Row icon="users" title={`${state.kpis.savedLeads ?? 0} leads`} detail="Stages and history kept" pill="Kept" tone="ok" />
          <Row icon="chat" title={`${state.kpis.replies ?? 0} replies`} detail="Replies and drafts wait in Inbox" pill="Kept" tone="ok" />
          {state.campaigns.map(campaign => (
            <Row key={campaign.id} icon="send" title={campaign.name} detail="Paused while you were away" pill="Paused" tone="warn" />
          ))}
          {state.inboxes.map(inbox => (
            <Row
              key={inbox.id}
              icon="mail"
              title={inbox.email}
              detail={inbox.status === 'active' ? 'Reconnected when you signed in' : 'Needs reconnecting in Settings'}
              pill={inbox.status === 'active' ? 'Connected' : 'Reconnect'}
              tone={inbox.status === 'active' ? 'ok' : 'warn'}
            />
          ))}
        </div>
      )}

      {error ? <span className="ferr" role="alert">{error}</span> : null}

      {state.loading ? null : brokenInbox ? (
        <Link className="bt bt-p" href="/settings#settings-inboxes">Reconnect inbox</Link>
      ) : state.campaigns.length > 0 ? (
        <button type="button" className="bt bt-p" onClick={resume} disabled={resuming}>
          {resuming ? 'Resuming…' : state.campaigns.length === 1 ? 'Resume campaign' : `Resume ${state.campaigns.length} campaigns`}
        </button>
      ) : (
        <Link className="bt bt-p" href="/dashboard">Go to dashboard</Link>
      )}
      {state.campaigns.length > 0 || brokenInbox ? (
        <div className="au-foot"><Link href="/dashboard">Look around first</Link> · nothing sends until you resume</div>
      ) : null}
    </AuthFrame>
  );
}
