'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import { OtpField } from './AuthFrame';

// Supabase refuses a new email code for about a minute after the last one.
export const RESEND_WAIT_SECONDS = 60;

export function useResendTimer() {
  const [left, setLeft] = useState(RESEND_WAIT_SECONDS);
  useEffect(() => {
    if (left <= 0) return undefined;
    const timer = setTimeout(() => setLeft(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);
  return { left, restart: () => setLeft(RESEND_WAIT_SECONDS) };
}

function clock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// The "Check your inbox" step shared by sign up and sign in.
// codeError is 'wrong' when the backend rejected the code.
export function VerifyStep({ email, otp, setOtp, codeError, error, submitting, submitLabel, onSubmit, onResend, onChangeEmail, children }) {
  const timer = useResendTimer();
  const resend = async () => {
    const sent = await onResend();
    if (sent !== false) timer.restart();
  };

  return (
    <>
      <span className="kpi-ic big"><Icon name="mail" size={24} /></span>
      <h1>Check your inbox</h1>
      <p>We sent a 6-digit code to <b>{email}</b>.</p>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OtpField value={otp} onChange={setOtp} bad={codeError === 'wrong'} />
        {codeError === 'wrong' ? (
          <span className="ferr" role="alert">That code did not work. Check the latest email from us, or send a new code.</span>
        ) : null}
        {error ? <span className="ferr" role="alert">{error}</span> : null}
        <button type="submit" className="bt bt-p" disabled={submitting || otp.length !== 6}>
          {submitting ? 'Checking…' : submitLabel}
        </button>
      </form>
      {codeError === 'wrong' ? (
        <button type="button" className="bt bt-g" onClick={resend} disabled={submitting || timer.left > 0}>
          {timer.left > 0 ? `Send a new code in ${clock(timer.left)}` : 'Send a new code'}
        </button>
      ) : (
        <div className="au-foot">
          No email? Check spam, or{' '}
          <button type="button" onClick={resend} disabled={submitting || timer.left > 0}>send a new code</button>
          {timer.left > 0 ? ` in ${clock(timer.left)}` : ''}
        </div>
      )}
      <div className="au-foot"><button type="button" onClick={onChangeEmail}>Use a different email</button></div>
      {children}
    </>
  );
}

export function NextSteps({ title, steps }) {
  return (
    <div className="next3">
      <div>{title}</div>
      {steps.map(([icon, heading, detail], index) => (
        <div key={heading}>
          <i>{icon ? <Icon name={icon} size={14} /> : index + 1}</i>
          <span><b>{heading}</b><small>{detail}</small></span>
        </div>
      ))}
    </div>
  );
}
