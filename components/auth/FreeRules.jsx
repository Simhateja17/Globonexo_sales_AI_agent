'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { api } from '../../lib/api';
import { upgradePlan } from '../../lib/free-plan';
import { isValidEmail } from '../../lib/validation';

function domainOf(email) {
  return String(email || '').split('@')[1] || '';
}

// Screens for the Free plan's sign-up rules (gnx_backend free-plan.service):
// one Free workspace per company domain, a work email, and an admin switch
// that pauses new Free workspaces. Each offers the paid route, which the
// backend allows in every case. A second person from a company that already
// has a workspace can instead ask its Owner to let them in.

export function DomainTaken({ email, workspace, asking, error, onAskToJoin, onContinuePaid }) {
  const name = workspace?.name || domainOf(email);
  const plan = workspace?.planId === 'free' || !workspace ? 'Free plan' : 'GNX workspace';
  return (
    <>
      <h1>{name} is already on GNX</h1>
      <p>Your company has a Free workspace. Join it to share the campaign, leads and Inbox with your team.</p>
      <div className="wsrow">
        <span className="orgav">{name.charAt(0).toUpperCase() || 'G'}</span>
        <div><b>{name}</b><small>{workspace?.ownerFirstName ? `${plan} · owned by ${workspace.ownerFirstName}` : plan}</small></div>
      </div>
      {error ? <span className="ferr" role="alert">{error}</span> : null}
      <button type="button" className="bt bt-p" onClick={onAskToJoin} disabled={asking}>{asking ? 'Sending…' : `Ask to join ${name}`}</button>
      <div className="au-foot">Need a separate workspace? <button type="button" onClick={onContinuePaid}>Start on a paid plan</button></div>
    </>
  );
}

// After "Ask to join": the Owner was emailed and approving sends an invitation.
export function JoinRequestSent({ result }) {
  const name = result?.workspace?.name || 'the workspace';
  const owner = result?.workspace?.ownerFirstName;
  if (result?.alreadyInvited) {
    return (
      <>
        <span className="kpi-ic big"><Icon name="mail" size={24} /></span>
        <h1>You are already invited</h1>
        <p>Look for the invitation to {name} in your inbox. If it expired, ask {owner || 'the Owner'} to send it again.</p>
        <Link className="bt bt-g" href="/login">Back to sign in</Link>
      </>
    );
  }
  return (
    <>
      <span className="kpi-ic big"><Icon name="clock" size={24} /></span>
      <h1>Request sent to {owner || 'the Owner'}</h1>
      <p>We emailed {owner ? `${owner}, the Owner of ${name}` : `the Owner of ${name}`}. You will get an email as soon as they let you in.</p>
      <Link className="bt bt-g" href="/login">Back to sign in</Link>
    </>
  );
}

export function FreePaused({ email, company, onContinuePaid }) {
  const [address, setAddress] = useState(email || '');
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const notify = async () => {
    if (!isValidEmail(address.trim())) {
      setError('Enter a full email address, like you@company.com.');
      return;
    }
    setError('');
    setState('sending');
    try {
      await api.post('/auth/free-waitlist', { email: address.trim().toLowerCase(), company: company || undefined });
      setState('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add you to the list. Please try again.');
      setState('error');
    }
  };

  return (
    <>
      <span className="kpi-ic warn big"><Icon name="clock" size={24} /></span>
      <h1>New Free accounts are paused for now</h1>
      <p>We are letting people in gradually. Paid plans are open, from ${upgradePlan()?.monthly ?? 59} a month, or leave your email and we will tell you when Free reopens.</p>
      {state === 'done' ? (
        <div className="okmsg" role="status">You are on the list. We will email {address.trim()} when Free reopens.</div>
      ) : (
        <label className="fld">
          <span>Email</span>
          <div className={`in${error ? ' bad' : ''}`}>
            <input type="email" value={address} onChange={event => setAddress(event.target.value)} placeholder="you@company.com" autoComplete="email" />
          </div>
          {error ? <span className="ferr" role="alert">{error}</span> : null}
        </label>
      )}
      <div className="acts2">
        {state !== 'done' ? (
          <button type="button" className="bt bt-g" onClick={notify} disabled={state === 'sending'}>{state === 'sending' ? 'Adding…' : 'Notify me'}</button>
        ) : null}
        <button type="button" className="bt bt-p" onClick={onContinuePaid}>Continue on a paid plan</button>
      </div>
      <div className="au-foot"><Link href="/pricing">Compare plans</Link></div>
    </>
  );
}

export function PersonalGoogle({ email, onChooseAnother, onContinuePaid }) {
  return (
    <>
      <span className="kpi-ic warn big"><Icon name="building" size={24} /></span>
      <h1>Use your work Google account</h1>
      <p>{email ? <><b>{email}</b> is a personal account. </> : 'That is a personal Google account. '}Free workspaces need a company address. Switch to your work Google account, or sign up with your work email.</p>
      <button type="button" className="gbtn" onClick={onChooseAnother}><Icon name="google" size={19} /> Choose another account</button>
      <button type="button" className="bt bt-g" onClick={onContinuePaid}>Keep this account on a paid plan</button>
    </>
  );
}

export function CodeExpired({ email, submitting, error, onResend, onChangeEmail }) {
  return (
    <>
      <span className="kpi-ic warn big"><Icon name="clock" size={24} /></span>
      <h1>That code has expired</h1>
      <p>Codes only work for a short time. We can send a fresh one to <b>{email}</b>.</p>
      {error ? <span className="ferr" role="alert">{error}</span> : null}
      <button type="button" className="bt bt-p" onClick={onResend} disabled={submitting}>{submitting ? 'Sending…' : 'Send a new code'}</button>
      <div className="au-foot"><button type="button" onClick={onChangeEmail}>Use a different email</button></div>
    </>
  );
}
