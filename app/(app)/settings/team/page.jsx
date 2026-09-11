'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import Icon from '../../../../components/ui/Icon';
import RouteSkeleton from '../../../../components/ui/RouteSkeleton';

function nameOf(person) { return [person.first_name, person.last_name].filter(Boolean).join(' ') || person.email; }
function roleLabel(role) { return role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'Member'; }
function Badge({ children, kind }) {
  const style = kind === 'owner'
    ? { background: 'var(--g-50)', color: 'var(--g-700)', borderColor: 'var(--g-100)' }
    : kind === 'admin'
      ? { background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }
      : kind === 'plan_suspended'
        ? { background: '#fff7ed', color: '#b45309', borderColor: '#fed7aa' }
        : { background: 'var(--bg-2)', color: 'var(--muted)', borderColor: 'var(--line)' };
  return <span style={{ display: 'inline-flex', border: '1px solid', borderRadius: 999, padding: '4px 8px', fontSize: 11.5, fontWeight: 800, ...style }}>{children}</span>;
}

export default function TeamPage() {
  const [team, setTeam] = useState(null);
  const [audit, setAudit] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const loadTeam = useCallback(async () => { const { data } = await api.get('/team'); setTeam(data); }, []);

  useEffect(() => { loadTeam().catch(err => setError(err.response?.data?.error || 'Failed to load your team.')).finally(() => setLoading(false)); }, [loadTeam]);
  if (loading) return <RouteSkeleton />;

  const members = team?.members ?? [];
  const invitations = team?.invitations ?? [];
  const viewerRole = team?.viewer?.role;
  const canManage = ['owner', 'admin'].includes(viewerRole) && team?.viewer?.membership_status === 'active';
  const canManageRoles = viewerRole === 'owner';
  const activeMembers = members.filter(member => member.membership_status === 'active');
  const activeAdmins = activeMembers.filter(member => member.role === 'admin');
  const pendingTransfer = team?.ownershipTransfers?.[0];
  const incomingTransfer = pendingTransfer?.target_user_id === team?.viewer?.id ? pendingTransfer : null;

  const run = async (operation, message) => {
    setBusy(true); setError(''); setNotice('');
    try { await operation(); await loadTeam(); setNotice(message); }
    catch (err) { setError(err.response?.data?.error || 'The team action could not be completed.'); }
    finally { setBusy(false); }
  };
  const invite = async event => {
    event.preventDefault();
    if (!email.trim()) return;
    await run(async () => { await api.post('/team/invitations', { email: email.trim() }); setEmail(''); }, 'Invitation sent.');
  };
  const changeRole = async (member, role) => {
    let confirmed = false;
    try { await api.patch(`/team/members/${member.id}/role`, { role, confirmImpact: false }); }
    catch (err) {
      const impacted = err.response?.data?.details?.impactedUsers;
      if (err.response?.status !== 409 || !Array.isArray(impacted)) { setError(err.response?.data?.error || 'Role change failed.'); return; }
      confirmed = window.confirm(`This may suspend ${impacted.map(item => item.email).join(', ')} because the plan is full. Continue?`);
      if (!confirmed) return;
    }
    await run(() => api.patch(`/team/members/${member.id}/role`, { role, confirmImpact: confirmed }), 'Role updated.');
  };
  const remove = async member => {
    const replacement = activeMembers.find(candidate => candidate.id !== member.id);
    if (!window.confirm(`Remove ${nameOf(member)}${replacement ? ` and reassign their work to ${nameOf(replacement)}` : ''}?`)) return;
    await run(() => api.delete(`/team/members/${member.id}`, { data: { replacementUserId: replacement?.id } }), 'Teammate removed.');
  };
  const loadAudit = async () => {
    if (!auditOpen && audit.length === 0) { try { const { data } = await api.get('/team/audit'); setAudit(data); } catch (err) { setError(err.response?.data?.error || 'Failed to load team activity.'); return; } }
    setAuditOpen(open => !open);
  };
  const startTransfer = async () => {
    if (!transferTargetId) return;
    const target = activeAdmins.find(member => member.id === transferTargetId);
    if (!target || !window.confirm(`Transfer ownership to ${nameOf(target)}? You will become an Admin after they accept.`)) return;
    await run(() => api.post('/team/ownership-transfer', { targetUserId: transferTargetId }), 'Ownership transfer request sent.');
    setTransferTargetId('');
  };
  const acceptTransfer = async () => {
    if (!incomingTransfer || !window.confirm('Accept ownership of this workspace? The current Owner will become an Admin.')) return;
    await run(() => api.post(`/team/ownership-transfer/${incomingTransfer.id}/accept`), 'You are now the Owner.');
  };
  const cancelTransfer = async () => {
    if (!pendingTransfer || !window.confirm('Cancel this ownership transfer?')) return;
    await run(() => api.delete(`/team/ownership-transfer/${pendingTransfer.id}`), 'Ownership transfer cancelled.');
  };

  return (
    <div className="scroll grow app-page" style={{ minHeight: 0 }}>
      <div style={{ padding: '34px 40px 48px', maxWidth: 1120, width: '100%', margin: '0 auto' }}>
        <div className="row spread" style={{ gap: 18, alignItems: 'flex-start', marginBottom: 24 }}><div><h1 className="display" style={{ fontSize: 28, marginBottom: 8 }}>Your team</h1><p className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>Invite teammates into the same workspace and keep campaign responsibility clear.</p></div><Link className="btn btn-ghost btn-sm" href="/settings">Back to settings</Link></div>
        {error && <div role="alert" className="card" style={{ padding: 13, marginBottom: 16, color: '#b42318', background: '#fff5f4', borderColor: '#fecaca' }}>{error}</div>}
        {notice && <div role="status" className="card" style={{ padding: 13, marginBottom: 16, color: 'var(--g-700)', background: 'var(--g-50)', borderColor: 'var(--g-100)' }}>{notice}</div>}
        <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }}>
          <div className="col" style={{ gap: 18 }}>
            <section className="card" style={{ padding: 22, borderRadius: 8 }}>
              <div className="row spread" style={{ gap: 12, marginBottom: 16 }}><div><h2 style={{ fontSize: 16, fontWeight: 800 }}>Members</h2><p className="faint" style={{ fontSize: 12.5, marginTop: 3 }}>Admins and Members share the workspace, with assignments controlling edit access.</p></div><span style={{ fontSize: 12.5, fontWeight: 800, color: team?.seats?.available ? 'var(--g-700)' : 'var(--muted)' }}>{team?.seats?.active ?? 0} / {team?.seats?.limit ?? 0} seats</span></div>
              <div className="col" style={{ gap: 9 }}>{members.map(member => <div key={member.id} className="row spread" style={{ gap: 14, padding: '13px 0', borderTop: '1px solid var(--line)', alignItems: 'center' }}><div className="row" style={{ gap: 11, minWidth: 0 }}><div style={{ width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', background: member.membership_status === 'active' ? 'var(--g-50)' : '#fff7ed', color: member.membership_status === 'active' ? 'var(--g-700)' : '#b45309', fontWeight: 900 }}>{(member.first_name || member.email || '?').slice(0, 1).toUpperCase()}</div><div className="col" style={{ gap: 4, minWidth: 0 }}><span style={{ fontWeight: 800, fontSize: 13.5 }} className="ellip">{nameOf(member)}</span><span style={{ color: 'var(--muted)', fontSize: 12.5 }} className="ellip">{member.email}</span></div></div><div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}><Badge kind={member.role}>{roleLabel(member.role)}</Badge><Badge kind={member.membership_status}>{member.membership_status === 'plan_suspended' ? 'No active seat' : 'Active'}</Badge>{canManageRoles && member.role !== 'owner' && member.membership_status !== 'removed' && <label className="row" style={{ gap: 5, fontSize: 11.5, color: 'var(--muted)', fontWeight: 800 }}>Priority<input aria-label={`Access priority for ${member.email}`} className="input" type="number" min="1" max="100000" defaultValue={member.access_priority ?? ''} style={{ width: 72, height: 30, padding: '0 7px' }} disabled={busy} onBlur={event => { const priority = Number(event.target.value); if (Number.isInteger(priority) && priority > 0 && priority !== member.access_priority) run(() => api.patch(`/team/members/${member.id}/priority`, { priority }), 'Access priority updated.'); }} /></label>}{member.role !== 'owner' && member.membership_status !== 'removed' && <div className="row" style={{ gap: 6 }}>{member.role === 'member' && <button type="button" className="btn btn-ghost btn-sm" disabled={busy || !canManageRoles} onClick={() => changeRole(member, 'admin')}>Make Admin</button>}{member.role === 'admin' && <button type="button" className="btn btn-ghost btn-sm" disabled={busy || !canManageRoles} onClick={() => changeRole(member, 'member')}>Make Member</button>}<button type="button" className="btn btn-ghost btn-sm" disabled={busy || !canManage} onClick={() => remove(member)}><Icon name="close" size={14} /> Remove</button></div>}</div></div>)}{members.length === 0 && <p className="muted">No members found.</p>}</div>
            </section>
            <section className="card" style={{ padding: 22, borderRadius: 8 }}><div className="row" style={{ gap: 10, marginBottom: 16 }}><span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--g-50)', display: 'grid', placeItems: 'center', color: 'var(--g-700)' }}><Icon name="mail" size={17} /></span><div><h2 style={{ fontSize: 16, fontWeight: 800 }}>Pending invitations</h2><p className="faint" style={{ fontSize: 12.5, marginTop: 3 }}>Each active invitation reserves a seat for seven days.</p></div></div><div className="col" style={{ gap: 8 }}>{invitations.filter(inv => inv.status === 'pending').map(inv => <div key={inv.id} className="row spread" style={{ gap: 12, borderTop: '1px solid var(--line)', padding: '12px 0' }}><div className="col" style={{ gap: 3 }}><span style={{ fontWeight: 800, fontSize: 13 }}>{inv.email}</span><span className="faint" style={{ fontSize: 12 }}>Expires {new Date(inv.expires_at).toLocaleDateString()}</span></div><div className="row" style={{ gap: 6 }}><button type="button" className="btn btn-ghost btn-sm" disabled={busy || !canManage} onClick={() => run(() => api.post(`/team/invitations/${inv.id}/resend`), 'Invitation resent.')}>Resend</button><button type="button" className="btn btn-ghost btn-sm" disabled={busy || !canManage} onClick={() => run(() => api.delete(`/team/invitations/${inv.id}`), 'Invitation revoked.')}>Revoke</button></div></div>)}{invitations.filter(inv => inv.status === 'pending').length === 0 && <p className="muted">No pending invitations.</p>}</div></section>
            <section className="card" style={{ padding: 22, borderRadius: 8 }}><button type="button" className="row spread" style={{ width: '100%', textAlign: 'left' }} onClick={loadAudit}><span style={{ fontSize: 16, fontWeight: 800 }}>Team activity</span><span style={{ fontSize: 12, color: 'var(--muted)' }}>{auditOpen ? 'Hide' : 'Show'}</span></button>{auditOpen && <div className="col" style={{ gap: 8, marginTop: 16 }}>{audit.length === 0 ? <p className="muted">No team activity recorded yet.</p> : audit.map(event => <div key={event.id} style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}><strong style={{ fontSize: 12.5 }}>{event.event_type.replaceAll('_', ' ')}</strong><span className="faint" style={{ display: 'block', fontSize: 12, marginTop: 3 }}>{new Date(event.created_at).toLocaleString()}</span></div>)}</div>}</section>
          </div>
          <aside className="col" style={{ gap: 18 }}><section className="card" style={{ padding: 22, borderRadius: 8, background: 'var(--g-50)', borderColor: 'var(--g-100)' }}><h2 style={{ fontSize: 16, fontWeight: 800 }}>Invite a Member</h2><p className="muted" style={{ fontSize: 12.5, lineHeight: 1.55, margin: '8px 0 16px' }}>They will verify this email, create their own account, and join the existing workspace.</p><form onSubmit={invite} className="col" style={{ gap: 10 }}><input className="input" type="email" required placeholder="teammate@company.com" value={email} onChange={event => setEmail(event.target.value)} disabled={!canManage || busy} /><button type="submit" className="btn btn-primary" disabled={!canManage || busy || !team?.seats?.available}>{busy ? 'Working...' : team?.seats?.available ? 'Send invitation' : 'No seats available'}</button></form></section>{(viewerRole === 'owner' || incomingTransfer) && <section className="card" style={{ padding: 22, borderRadius: 8 }}><h2 style={{ fontSize: 15, fontWeight: 800 }}>Ownership</h2>{viewerRole === 'owner' && <>{pendingTransfer ? <div className="col" style={{ gap: 9, marginTop: 12 }}><p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Waiting for {nameOf(members.find(member => member.id === pendingTransfer.target_user_id) || { email: 'the selected Admin' })} to accept. Expires {new Date(pendingTransfer.expires_at).toLocaleDateString()}.</p><button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={cancelTransfer}>Cancel transfer</button></div> : <div className="col" style={{ gap: 10, marginTop: 12 }}><p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Transfer the single Owner role to an active Admin. You will become an Admin after acceptance.</p><select className="input" value={transferTargetId} onChange={event => setTransferTargetId(event.target.value)} disabled={busy || activeAdmins.length === 0}><option value="">Select an Admin</option>{activeAdmins.map(member => <option key={member.id} value={member.id}>{nameOf(member)}</option>)}</select><button type="button" className="btn btn-ghost btn-sm" disabled={busy || !transferTargetId} onClick={startTransfer}>Request transfer</button>{activeAdmins.length === 0 && <span className="faint" style={{ fontSize: 12 }}>Promote a Member to Admin first.</span>}</div>}</>}{incomingTransfer && viewerRole === 'admin' && <div className="col" style={{ gap: 10, marginTop: 12 }}><p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>The current Owner nominated you. This request expires {new Date(incomingTransfer.expires_at).toLocaleDateString()}.</p><button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={acceptTransfer}>Accept ownership</button></div>}</section>}<section className="card" style={{ padding: 22, borderRadius: 8 }}><h2 style={{ fontSize: 15, fontWeight: 800 }}>Seat access</h2><div className="col" style={{ gap: 8, marginTop: 13, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}><span>Owner always has access.</span><span>Admins receive seats before Members.</span><span>Owner-controlled priority resolves ties.</span><span>Suspended teammates keep their history but cannot access workspace data.</span></div></section></aside>
        </div>
      </div>
    </div>
  );
}
