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
// backend allows in every case.

export function DomainTaken({ email, onContinuePaid, onBack }) {
  const domain = domainOf(email);
  return (
    <>
      <h1>{domain} is already on GNX</h1>
      <p>Your company has a Free workspace. To share its campaign, leads and Inbox, ask its Owner to invite you from Settings, Team.</p>
      <div className="wsrow">
        <span className="orgav">{domain.charAt(0).toUpperCase() || 'G'}</span>
        <div><b>{domain}</b><small>Free plan · one per company</small></div>
      </div>
      <button type="button" className="bt bt-p" onClick={onContinuePaid}>Start on a paid plan instead</button>
      <div className="au-foot">Already invited? Open the link in your invitation email, or <button type="button" onClick={onBack}>go back</button></div>
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
