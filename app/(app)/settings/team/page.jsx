'use client';

import { useCallback, useEffect, useState } from 'react';
import { useConfirm } from "../../../../components/ui/ConfirmDialog";
import Link from 'next/link';
import { api } from '../../../../lib/api';
import Icon from '../../../../components/ui/Icon';
import RouteSkeleton from '../../../../components/ui/RouteSkeleton';
import { canSee } from '../../../../lib/access';
import Avatar from '../../../../components/ui/Avatar';

function nameOf(person) { return [person.first_name, person.last_name].filter(Boolean).join(' ') || person.email; }
function roleLabel(role) { return role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'Member'; }
function RolePill({ role }) {
  const cls = role === 'owner' ? 'pl-dark' : role === 'admin' ? 'pl-info' : 'pl-mute';
  return <span className={`pl ${cls}`}>{roleLabel(role)}</span>;
}

function auditLabel(event) {
  return event.event_type.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());
}

export default function TeamPage() {
  const confirm = useConfirm();
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
  const joinRequests = team?.joinRequests ?? [];
  const viewerRole = team?.viewer?.role;
  const canManage = canSee(viewerRole, 'team.invite') && team?.viewer?.membership_status === 'active';
  const canManageRoles = canSee(viewerRole, 'team.changeRole');
  const canOwnTransfer = canSee(viewerRole, 'team.ownershipTransfer');
  const canSeeActivity = canSee(viewerRole, 'team.activity');
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
      confirmed = await confirm({ title: 'Change this role?', body: `The plan is full, so this may suspend ${impacted.map(item => item.email).join(', ')}.`, keeps: 'Their history and assigned work.', confirmLabel: 'Change role' });
      if (!confirmed) return;
    }
    await run(() => api.patch(`/team/members/${member.id}/role`, { role, confirmImpact: confirmed }), 'Role updated.');
  };
  const remove = async member => {
    const replacement = activeMembers.find(candidate => candidate.id !== member.id);
    if (!(await confirm({ title: `Remove ${nameOf(member)}?`, body: 'They lose access to this workspace straight away.', keeps: replacement ? `Their campaigns and leads, reassigned to ${nameOf(replacement)}.` : 'Their campaigns and leads.', confirmLabel: 'Remove teammate', danger: true }))) return;
    await run(() => api.delete(`/team/members/${member.id}`, { data: { replacementUserId: replacement?.id } }), 'Teammate removed.');
  };
  const loadAudit = async () => {
    if (!auditOpen && audit.length === 0) { try { const { data } = await api.get('/team/audit'); setAudit(data); } catch (err) { setError(err.response?.data?.error || 'Failed to load team activity.'); return; } }
    setAuditOpen(open => !open);
  };
  const startTransfer = async () => {
    if (!transferTargetId) return;
    const target = activeAdmins.find(member => member.id === transferTargetId);
    if (!target || !(await confirm({ title: `Transfer ownership to ${nameOf(target)}?`, body: 'You become an Admin once they accept. Only the Owner manages billing.', confirmLabel: 'Request transfer' }))) return;
    await run(() => api.post('/team/ownership-transfer', { targetUserId: transferTargetId }), 'Ownership transfer request sent.');
    setTransferTargetId('');
  };
  const acceptTransfer = async () => {
    if (!incomingTransfer || !(await confirm({ title: 'Accept ownership of this workspace?', body: 'You take over billing and the plan. The current Owner becomes an Admin.', confirmLabel: 'Accept ownership' }))) return;
    await run(() => api.post(`/team/ownership-transfer/${incomingTransfer.id}/accept`), 'You are now the Owner.');
  };
  const cancelTransfer = async () => {
    if (!pendingTransfer || !(await confirm({ title: 'Cancel this ownership transfer?', body: 'The request is withdrawn and you stay the Owner.', confirmLabel: 'Cancel transfer' }))) return;
    await run(() => api.delete(`/team/ownership-transfer/${pendingTransfer.id}`), 'Ownership transfer cancelled.');
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const approveJoin = request => run(() => api.post(`/team/join-requests/${request.id}/approve`), `Invitation sent to ${request.email}.`);
  const declineJoin = async request => {
    if (!(await confirm({ title: `Decline ${nameOf(request)}?`, body: 'They are not told, and they can ask again later.', confirmLabel: 'Decline request' }))) return;
    await run(() => api.post(`/team/join-requests/${request.id}/decline`), 'Request declined.');
  };

  return (
    <main className="gx">
      <div className="ph">
        <div>
          <h1>Team</h1>
          <p>Invite teammates into the same workspace. Assignments decide who can edit each campaign.</p>
        </div>
        <div className="acts">
          <span className={`pl ${team?.seats?.available ? 'pl-ok' : 'pl-warn'}`}>{team?.seats?.active ?? 0} of {team?.seats?.limit ?? 0} seats used</span>
          {canSee(viewerRole, 'page.settings') && <Link className="bt bt-g" href="/settings">Back to settings</Link>}
        </div>
      </div>
      {error && <div role="alert" className="note">{error}</div>}
      {notice && <div role="status" className="gnote ok">{notice}</div>}

      <div className="two">
        <div className="scol">
          <section className="card" style={{ overflow: 'hidden' }}>
            <div className="card-h"><div><b>Your team</b><small>Admins and Members share the workspace.</small></div></div>
            {members.map(member => (
              <div key={member.id} className="srow" style={{ flexWrap: 'wrap' }}>
                <Avatar name={nameOf(member)} size={36} />
                <div><b className="ellip">{nameOf(member)}</b><small className="ellip">{member.email}</small></div>
                <span className="mc"><RolePill role={member.role} /></span>
                <span className="mc"><span className={`pl ${member.membership_status === 'active' ? 'pl-ok' : 'pl-warn'}`}><u />{member.membership_status === 'plan_suspended' ? 'No active seat' : 'Active'}</span></span>
                {member.role === 'owner' ? <span className="mc muted" style={{ fontSize: 12, fontWeight: 700 }}>Always has access</span> : null}
                {canManageRoles && member.role !== 'owner' && member.membership_status !== 'removed' && (
                  <label className="mc muted" style={{ gap: 6, fontSize: 12, fontWeight: 700 }}>
                    Priority
                    <input aria-label={`Access priority for ${member.email}`} className="input" type="number" min="1" max="100000" defaultValue={member.access_priority ?? ''} style={{ width: 64, height: 30, padding: '0 7px' }} disabled={busy} onBlur={event => { const priority = Number(event.target.value); if (Number.isInteger(priority) && priority > 0 && priority !== member.access_priority) run(() => api.patch(`/team/members/${member.id}/priority`, { priority }), 'Access priority updated.'); }} />
                  </label>
                )}
                {canManage && member.role !== 'owner' && member.membership_status !== 'removed' && member.id !== team?.viewer?.id && (
                  <span className="mc" style={{ gap: 6 }}>
                    {canManageRoles && member.role === 'member' && <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => changeRole(member, 'admin')}>Make Admin</button>}
                    {canManageRoles && member.role === 'admin' && <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => changeRole(member, 'member')}>Make Member</button>}
                    <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => remove(member)}><Icon name="close" size={13} /> Remove</button>
                  </span>
                )}
              </div>
            ))}
            {members.length === 0 && <div className="empty">No members found.</div>}
          </section>

          {canManage && joinRequests.length > 0 && (
            <section className="card" style={{ overflow: 'hidden' }}>
              <div className="card-h"><div><b>Asking to join</b><small>People from your company. Letting someone in sends them an invitation.</small></div></div>
              {joinRequests.map(request => (
                <div key={request.id} className="srow" style={{ flexWrap: 'wrap' }}>
                  <Avatar name={nameOf(request)} size={36} />
                  <div><b className="ellip">{nameOf(request)}</b><small className="ellip">{request.email} · asked {new Date(request.created_at).toLocaleDateString()}</small></div>
                  <span className="mc" style={{ gap: 6 }}>
                    <button type="button" className="bt bt-p sm" disabled={busy} onClick={() => approveJoin(request)}>Let them in</button>
                    <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => declineJoin(request)}>Decline</button>
                  </span>
                </div>
              ))}
            </section>
          )}

          {canManage && (
            <section className="card" style={{ overflow: 'hidden' }}>
              <div className="card-h"><div><b>Pending invitations</b><small>Each active invitation holds a seat for 7 days.</small></div></div>
              {pendingInvitations.map(inv => (
                <div key={inv.id} className="srow">
                  <span className="si"><Icon name="mail" size={17} /></span>
                  <div><b className="ellip">{inv.email}</b><small>Expires {new Date(inv.expires_at).toLocaleDateString()}</small></div>
                  <span className="mc" style={{ gap: 6 }}>
                    <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => run(() => api.post(`/team/invitations/${inv.id}/resend`), 'Invitation resent.')}>Resend</button>
                    <button type="button" className="bt bt-g sm" disabled={busy} onClick={() => run(() => api.delete(`/team/invitations/${inv.id}`), 'Invitation revoked.')}>Revoke</button>
                  </span>
                </div>
              ))}
              {pendingInvitations.length === 0 && <div className="empty">No pending invitations.</div>}
            </section>
          )}

          {canSeeActivity && (
            <section className="card" style={{ overflow: 'hidden' }}>
              <div className="card-h">
                <div><b>Team activity</b><small>Invitations, role changes and joins.</small></div>
                <button type="button" className="lnk" onClick={loadAudit}>{auditOpen ? 'Hide' : 'Show'}</button>
              </div>
              {auditOpen && (audit.length === 0 ? <div className="empty">No team activity recorded yet.</div> : audit.map(event => (
                <div key={event.id} className="srow">
                  <span className="si"><Icon name="users" size={16} /></span>
                  <div><b>{auditLabel(event)}</b><small>{new Date(event.created_at).toLocaleString()}</small></div>
                </div>
              )))}
            </section>
          )}
        </div>

        <aside className="scol">
          {canManage && (
            <section className="card pad">
              <h3 className="h3">Invite a Member</h3>
              <p className="sub">They verify this email, create their own account and join your workspace.</p>
              <form onSubmit={invite} className="col" style={{ gap: 10, marginTop: 14 }}>
                <input className="input" type="email" required aria-label="Teammate email" placeholder="teammate@company.com" value={email} onChange={event => setEmail(event.target.value)} disabled={busy} />
                <button type="submit" className="bt bt-p" style={{ justifyContent: 'center' }} disabled={busy || !team?.seats?.available}>{busy ? 'Working...' : team?.seats?.available ? 'Send invitation' : 'No seats available'}</button>
              </form>
            </section>
          )}
          {(canOwnTransfer || incomingTransfer) && (
            <section className="card pad">
              <h3 className="h3">Ownership</h3>
              {canOwnTransfer && (pendingTransfer ? (
                <div className="col" style={{ gap: 10, marginTop: 6 }}>
                  <p className="sub">Waiting for {nameOf(members.find(member => member.id === pendingTransfer.target_user_id) || { email: 'the selected Admin' })} to accept. Expires {new Date(pendingTransfer.expires_at).toLocaleDateString()}.</p>
                  <button type="button" className="bt bt-g sm" disabled={busy} onClick={cancelTransfer}>Cancel transfer</button>
                </div>
              ) : (
                <div className="col" style={{ gap: 10, marginTop: 6 }}>
                  <p className="sub">Hand the Owner role to an active Admin. You become an Admin once they accept.</p>
                  <select className="sel-box" aria-label="New owner" value={transferTargetId} onChange={event => setTransferTargetId(event.target.value)} disabled={busy || activeAdmins.length === 0}>
                    <option value="">Select an Admin</option>
                    {activeAdmins.map(member => <option key={member.id} value={member.id}>{nameOf(member)}</option>)}
                  </select>
                  <button type="button" className="bt bt-g sm" style={{ alignSelf: 'flex-start' }} disabled={busy || !transferTargetId} onClick={startTransfer}>Request transfer</button>
                  {activeAdmins.length === 0 && <span className="muted" style={{ fontSize: 12 }}>Promote a Member to Admin first.</span>}
                </div>
              ))}
              {incomingTransfer && viewerRole === 'admin' && (
                <div className="col" style={{ gap: 10, marginTop: 6 }}>
                  <p className="sub">The current Owner nominated you. This request expires {new Date(incomingTransfer.expires_at).toLocaleDateString()}.</p>
                  <button type="button" className="bt bt-p sm" disabled={busy} onClick={acceptTransfer}>Accept ownership</button>
                </div>
              )}
            </section>
          )}
          <section className="card pad">
            <h3 className="h3">Seat access</h3>
            <div className="tl" style={{ marginTop: 12 }}>
              <div><i /><span style={{ marginTop: 0 }}>The Owner always has a seat.</span></div>
              <div><i /><span style={{ marginTop: 0 }}>Admins get seats before Members.</span></div>
              <div><i /><span style={{ marginTop: 0 }}>Your priority numbers settle ties.</span></div>
              <div><i /><span style={{ marginTop: 0 }}>Anyone without a seat keeps their history but cannot open workspace data.</span></div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
