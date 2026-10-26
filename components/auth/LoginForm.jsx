'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { postAuthPath, rememberPausedWorkspace } from '../../lib/billingAccess';
import { cleanText, isValidEmail } from '../../lib/validation';
import { GoogleButton } from './AuthFrame';
import { NextSteps, VerifyStep } from './VerifyStep';

const OAUTH_ERRORS = {
  oauth_failed: 'Google sign-in did not finish. Please try again, or use your email.',
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { startLogin, verifyLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [codeError, setCodeError] = useState('');
  const [step, setStep] = useState('email');
  const oauthError = params?.get('error');
  const [error, setError] = useState(oauthError ? OAUTH_ERRORS[oauthError] || oauthError : '');
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const normalizedEmail = cleanText(email, { max: 254 }).toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setEmailError('Enter a full email address, like you@company.com.');
      return;
    }
    setEmail(normalizedEmail);
    setSubmitting(true);
    try {
      await startLogin(normalizedEmail);
      setOtp('');
      setCodeError('');
      setStep('otp');
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
    try {
      const data = await verifyLogin(email, otp);
      localStorage.setItem('returning_user', '1');
      rememberPausedWorkspace(data);
      router.push(postAuthPath(data));
    } catch (err) {
      if (err.response?.status === 401 && /code/i.test(err.response?.data?.error || '')) setCodeError('wrong');
      else setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSubmitting(true);
    try {
      await startLogin(email);
      setOtp('');
      setCodeError('');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send a new code. Please try again in a minute.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'otp') {
    return (
      <VerifyStep
        email={email}
        otp={otp}
        setOtp={(value) => { setOtp(value); setCodeError(''); }}
        codeError={codeError}
        error={error}
        submitting={submitting}
        submitLabel="Sign in"
        onSubmit={handleOtpSubmit}
        onResend={handleResend}
        onChangeEmail={() => { setStep('email'); setOtp(''); setCodeError(''); setError(''); }}
      />
    );
  }

  return (
    <>
      <h1>Sign in</h1>
      <p>Welcome back. Let&apos;s get to work.</p>
      <GoogleButton />
      <div className="or">or</div>
      <form onSubmit={handleEmailSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label className="fld">
          <span>Work email</span>
          <div className={`in${emailError ? ' bad' : ''}`}>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              aria-invalid={emailError ? 'true' : undefined}
              autoComplete="email"
              maxLength={254}
            />
          </div>
          {emailError ? <span className="ferr" role="alert">{emailError}</span> : null}
        </label>
        {error ? <span className="ferr" role="alert">{error}</span> : null}
        <button type="submit" className="bt bt-p" disabled={submitting}>
          {submitting ? 'Sending code…' : 'Email me a code'}
        </button>
      </form>
      <div className="au-foot">New to GNX? <Link href="/signup">Create an account</Link></div>
      <NextSteps
        title="New to GNX?"
        steps={[
          ['spark', 'Start free', '1 email campaign from your own inbox'],
          ['card', 'No card needed', 'Upgrade only when it books meetings'],
        ]}
      />
    </>
  );
}
