'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import Logo from '../../../components/ui/Logo';
import { Field } from '../../../components/ui/Input';
import Icon from '../../../components/ui/Icon';
import { API_BASE_URL } from '../../../lib/api';

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;
  const [invitation, setInvitation] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('loading');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (!token) return; api.get(`/auth/invitations/${encodeURIComponent(token)}`).then(({ data }) => { setInvitation(data); setEmail(data.email); setStep('details'); }).catch(err => { setError(err.response?.data?.error || 'This invitation is no longer available.'); setStep('error'); }); }, [token]);
  const startVerification = async event => { event.preventDefault(); setBusy(true); setError(''); try { await api.post(`/auth/invitations/${encodeURIComponent(token)}/start`, { email }); setStep('verify'); } catch (err) { setError(err.response?.data?.error || 'Could not send a verification code.'); } finally { setBusy(false); } };
  const verify = async event => { event.preventDefault(); setBusy(true); setError(''); try { await api.post(`/auth/invitations/${encodeURIComponent(token)}/verify`, { email, otp, firstName, lastName }); router.replace('/dashboard'); } catch (err) { setError(err.response?.data?.error || 'The code could not be verified.'); } finally { setBusy(false); } };
  return <div className="screen auth-screen" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--bg)' }}><div className="card" style={{ width: 'min(100%, 480px)', padding: 32, borderRadius: 14, background: '#fff' }}><Logo size={32} />{step === 'loading' && <p className="muted" style={{ marginTop: 28 }}>Checking invitation…</p>}{step === 'error' && <div style={{ marginTop: 28 }}><h1 className="display" style={{ fontSize: 26 }}>Invitation unavailable</h1><p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>{error}</p><button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => router.replace('/login')}>Go to sign in</button></div>}{step === 'details' && invitation && <form onSubmit={startVerification} className="col" style={{ gap: 15, marginTop: 28 }}><div><h1 className="display" style={{ fontSize: 26 }}>Join {invitation.organizationName}</h1><p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>Create your GNX account for this workspace. The invitation is for <strong>{invitation.email}</strong>.</p></div><Field label="Email" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" />{error && <p role="alert" style={{ color: '#b42318', fontSize: 13 }}>{error}</p>}<button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Sending code…' : 'Email me a code'} <Icon name="arrow" size={16} color="#06231a" /></button><a className="btn btn-ghost btn-sm" href={`${API_BASE_URL}/auth/google?invite=${encodeURIComponent(token)}`}>Continue with Google</a></form>}{step === 'verify' && <form onSubmit={verify} className="col" style={{ gap: 15, marginTop: 28 }}><div><h1 className="display" style={{ fontSize: 26 }}>Create your account</h1><p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>We sent a six-digit code to {email}. You will join {invitation?.organizationName || 'the workspace'} as a Member.</p></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}><Field label="First name" value={firstName} onChange={event => setFirstName(event.target.value)} required autoComplete="given-name" /><Field label="Last name" value={lastName} onChange={event => setLastName(event.target.value)} required autoComplete="family-name" /></div><Field label="Verification code" value={otp} onChange={event => setOtp(event.target.value)} required autoComplete="one-time-code" placeholder="123456" />{error && <p role="alert" style={{ color: '#b42318', fontSize: 13 }}>{error}</p>}<button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Join workspace'} <Icon name="check" size={16} color="#06231a" /></button><button className="btn btn-ghost btn-sm" type="button" disabled={busy} onClick={() => setStep('details')}>Use a different email</button></form>}</div></div>;
}
