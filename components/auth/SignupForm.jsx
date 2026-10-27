'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { postAuthPath } from '../../lib/billingAccess';
import { rememberFreeEligibility } from '../../lib/plan-choice';
import { FREE_PLAN, isPersonalEmail } from '../../lib/free-plan';
import { cleanText, isValidEmail } from '../../lib/validation';
import { GoogleButton } from './AuthFrame';
import { CodeExpired, DomainTaken, FreePaused, JoinRequestSent } from './FreeRules';
import { NextSteps, VerifyStep } from './VerifyStep';

const FREE_NEXT = [
  [null, 'Connect your inbox', 'Nexo sends from your own work address'],
  [null, 'Add your leads', `CSV or paste, up to ${FREE_PLAN.maxLeads}`],
  [null, 'Start your campaign', 'Every email waits for your OK'],
];
const PAID_NEXT = [
  [null, 'Choose a plan', 'Monthly or annual, cancel whenever you want'],
  [null, 'Connect your inbox', 'Nexo sends from your own work address'],
  [null, 'Start your campaign', 'Every email waits for your OK'],
];

const JOIN_NEXT = (workspace) => [
  [null, `${workspace?.ownerFirstName || 'The Owner'} gets your request`, 'By email, with a link to review it'],
  [null, 'You get an invitation', `Once you are let in to ${workspace?.name || 'the workspace'}`],
  [null, 'Create your sign-in', 'Then share the campaign, leads and Inbox'],
];

const DRAFT_KEY = 'signup_draft';

function FieldInput({ label, error, hint, ...props }) {
  return (
    <label className="fld">
      <span>{label}</span>
      <div className={`in${error ? ' bad' : ''}`}>
        <input aria-invalid={error ? 'true' : undefined} {...props} />
      </div>
      {error ? <span className="ferr" role="alert">{error}</span> : hint ? <small className="hint">{hint}</small> : null}
    </label>
  );
}

export function SignupForm() {
  const router = useRouter();
  const { startSignup, verifySignup } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '' });
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState({});
  const [personalOk, setPersonalOk] = useState(false);
  const [freePlan, setFreePlan] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  // True once the visitor chose "Ask to join" instead of a new workspace.
  const [joining, setJoining] = useState(false);
  const [joinResult, setJoinResult] = useState(null);
  const [otp, setOtp] = useState('');
  const [codeError, setCodeError] = useState('');
  // details | domain_taken | paused | otp | expired | join_sent
  const [step, setStep] = useState('details');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Keep what was typed while the visitor reads Terms or Privacy in this tab.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
      if (saved?.form) setForm((f) => ({ ...f, ...saved.form }));
      if (typeof saved?.agreed === 'boolean') setAgreed(saved.agreed);
    } catch {}
  }, []);

  const saveDraft = (nextForm, nextAgreed) => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form: nextForm, agreed: nextAgreed })); } catch {}
  };

  const update = (field) => (e) => {
    const nextForm = { ...form, [field]: e.target.value };
    setForm(nextForm);
    saveDraft(nextForm, agreed);
    setErrors((current) => ({ ...current, [field]: '' }));
    if (field === 'email') setPersonalOk(false);
  };

  const send = async (payload, { resend = false } = {}) => {
    const { freePlan: eligibility, workspace: existing } = await startSignup(payload);
    setFreePlan(eligibility || null);
    setWorkspace(existing);
    setOtp('');
    setCodeError('');
    // A new code for someone already asking to join keeps them on that path.
    if (resend && joining && eligibility === 'domain_taken') { setStep('otp'); return; }
    setJoining(false);
    // The code is already on its way; these screens only explain why the
    // account will start on a paid plan before asking for it.
    setStep(eligibility === 'domain_taken' || eligibility === 'paused' ? eligibility : 'otp');
  };

  const handleDetailsSubmit = async (e, { allowPersonal = personalOk } = {}) => {
    e?.preventDefault();
    setError('');
    const payload = {
      firstName: cleanText(form.firstName, { max: 80 }),
      lastName: cleanText(form.lastName, { max: 80 }),
      email: cleanText(form.email, { max: 254 }).toLowerCase(),
      company: cleanText(form.company, { max: 160 }),
    };
    const next = {};
    if (!payload.firstName) next.firstName = 'Add your first name.';
    if (!payload.lastName) next.lastName = 'Add your last name.';
    if (!isValidEmail(payload.email)) next.email = 'Enter a full email address, like you@company.com.';
    else if (isPersonalEmail(payload.email) && !allowPersonal) next.email = 'personal';
    if (!payload.company) next.company = 'Add your company name.';
    if (!agreed) next.agreed = 'Please agree to the Terms and Privacy Policy.';
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setForm(payload);
    setSubmitting(true);
    try {
      await send(payload);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCodeError('');
    if (!/^\d{6}$/.test(otp)) return;
    setSubmitting(true);
    if (joining) {
      // The sign-up code proves the email; no account is created yet.
      try {
        const { data } = await api.post('/auth/join-requests', { email: form.email, otp });
        try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
        setJoinResult(data);
        setStep('join_sent');
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) setCodeError('wrong');
        else if (status === 400) setStep('expired');
        else setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }
    try {
      const data = await verifySignup(form.email, otp);
      try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
      localStorage.setItem('returning_user', '1');
      rememberFreeEligibility(window.sessionStorage, data?.freePlan);
      router.push(postAuthPath(data));
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setCodeError('wrong');
      // 400 means the pending signup behind the code timed out.
      else if (status === 400) setStep('expired');
      else setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSubmitting(true);
    try {
      await send(form, { resend: true });
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send a new code. Please try again in a minute.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = () => { setStep('details'); setOtp(''); setCodeError(''); setError(''); setJoining(false); };

  if (step === 'join_sent') {
    return <JoinRequestSent result={joinResult} />;
  }
  if (step === 'domain_taken') {
    return (
      <DomainTaken
        email={form.email}
        workspace={workspace}
        onAskToJoin={() => { setJoining(true); setError(''); setStep('otp'); }}
        onContinuePaid={() => { setJoining(false); setStep('otp'); }}
      />
    );
  }
  if (step === 'paused') {
    return <FreePaused email={form.email} company={form.company} onContinuePaid={() => setStep('otp')} />;
  }
  if (step === 'expired') {
    return <CodeExpired email={form.email} submitting={submitting} error={error} onResend={handleResend} onChangeEmail={startOver} />;
  }
  if (step === 'otp') {
    return (
      <VerifyStep
        email={form.email}
        otp={otp}
        setOtp={(value) => { setOtp(value); setCodeError(''); }}
        codeError={codeError}
        error={error}
        submitting={submitting}
        submitLabel={joining ? 'Verify and send request' : 'Verify and continue'}
        onSubmit={handleOtpSubmit}
        onResend={handleResend}
        onChangeEmail={startOver}
      >
        {joining ? (
          <NextSteps title="What happens next" steps={JOIN_NEXT(workspace)} />
        ) : (
          <NextSteps title="What happens next" steps={freePlan === 'eligible' ? FREE_NEXT : PAID_NEXT} />
        )}
      </VerifyStep>
    );
  }

  return (
    <>
      <h1>Create your account</h1>
      <p>Let&apos;s build your autonomous pipeline. Free to start, no card needed.</p>
      <GoogleButton />
      <div className="or">or</div>
      <form onSubmit={handleDetailsSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="fg">
          <FieldInput label="First name" placeholder="Jane" value={form.firstName} onChange={update('firstName')} error={errors.firstName} autoComplete="given-name" maxLength={80} />
          <FieldInput label="Last name" placeholder="Smith" value={form.lastName} onChange={update('lastName')} error={errors.lastName} autoComplete="family-name" maxLength={80} />
        </div>
        <label className="fld">
          <span>Work email</span>
          <div className={`in${errors.email ? ' bad' : ''}`}>
            <input type="email" placeholder="you@company.com" value={form.email} onChange={update('email')} aria-invalid={errors.email ? 'true' : undefined} autoComplete="email" maxLength={254} />
          </div>
          {errors.email === 'personal' ? (
            <span className="ferr" role="alert">
              Please use your work email, like you@yourcompany.com. Free workspaces are one per company, so we need your company domain.{' '}
              <button type="button" onClick={() => { setPersonalOk(true); handleDetailsSubmit(null, { allowPersonal: true }); }}>
                Use this address on a paid plan
              </button>
            </span>
          ) : errors.email ? (
            <span className="ferr" role="alert">{errors.email}</span>
          ) : (
            <small className="hint">Use your company address. Each company gets one Free workspace.</small>
          )}
        </label>
        <FieldInput label="Company" placeholder="Your company" value={form.company} onChange={update('company')} error={errors.company} autoComplete="organization" maxLength={160} />
        <label className="chkl">
          <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); saveDraft(form, e.target.checked); setErrors((current) => ({ ...current, agreed: '' })); }} />
          <span className={`cb${agreed ? ' on' : ''}`} aria-hidden="true" />
          <span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link></span>
        </label>
        {errors.agreed ? <span className="ferr" role="alert">{errors.agreed}</span> : null}
        {error ? <span className="ferr" role="alert">{error}</span> : null}
        <button type="submit" className="bt bt-p" disabled={submitting}>
          {submitting ? 'Sending code…' : 'Create account'}
        </button>
      </form>
      <div className="au-foot">Already have an account? <Link href="/login">Sign in</Link></div>
    </>
  );
}
