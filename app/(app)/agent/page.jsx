"use client";
import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../components/ui/Icon";
import Avatar from "../../../components/ui/Avatar";
import Typing from "../../../components/ui/Typing";
import api from "../../../lib/api";

const QUICK = ['Draft follow-ups for no-replies', 'Give me 50 ICP leads', 'Summarize hottest leads', 'Pause weekend sending'];

const STAT_ICONS = { 'emails sent': 'send', 'replies': 'chat', 'meetings booked': 'calendar' };

function apiMessageToMsg(m) {
  return {
    id: m.id,
    conversationId: m.conversationId,
    who: m.role === 'user' ? 'user' : 'agent',
    kind: m.kind || 'text',
    text: m.content,
    stats: m.metadata?.stats,
    drafts: m.metadata?.drafts,
    chart: m.metadata?.chart,
    replies: m.metadata?.replies,
    researched: m.metadata?.researched,
    slots: m.metadata?.slots,
    timezone: m.metadata?.timezone,
    sequences: m.metadata?.sequences,
    usage: m.metadata?.usage,
    providerFailures: m.metadata?.providerFailures,
    campaign: m.metadata?.campaign,
    proposal: m.metadata?.proposal,
    approval: m.metadata?.approval,
    leadSearchPreview: m.metadata?.leadSearchPreview,
    exactFilters: m.metadata?.exactFilters,
    relaxations: m.metadata?.relaxations,
  };
}

function ConversationHistory({ conversations, activeId, loading, onSelect, onNew, onArchive }) {
  return (
    <div className="card" style={{ padding: 14, borderRadius: 14, marginBottom: 18 }}>
      <div className="row spread" style={{ gap: 8 }}>
        <div className="row" style={{ gap: 7 }}>
          <Icon name="chat" size={14} color="var(--g-600)" />
          <span className="eyebrow" style={{ margin: 0 }}>Chat history</span>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 7px', fontSize: 11 }} onClick={onNew} disabled={loading}>
          <Icon name="plus" size={13} /> New
        </button>
      </div>
      {loading ? <p className="faint" style={{ fontSize: 11.5, margin: '10px 0 0' }}>Loading conversations…</p> : conversations.length === 0 ? (
        <p className="faint" style={{ fontSize: 11.5, margin: '10px 0 0' }}>Your conversations will appear here.</p>
      ) : (
        <div className="col" style={{ gap: 4, marginTop: 10 }}>
          {conversations.slice(0, 8).map(conversation => (
            <div key={conversation.id} className="row" style={{ gap: 5 }}>
              <button
                onClick={() => onSelect(conversation.id)}
                className="row grow"
                style={{
                  minWidth: 0, gap: 8, border: 0, borderRadius: 8, padding: '8px 7px', textAlign: 'left', cursor: 'pointer',
                  background: conversation.id === activeId ? 'var(--g-50)' : 'transparent', color: 'var(--ink)',
                }}
              >
                <Icon name="chat" size={13} color={conversation.id === activeId ? 'var(--g-600)' : 'var(--muted)'} />
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11.5, fontWeight: conversation.id === activeId ? 700 : 500 }}>{conversation.title || 'New conversation'}</span>
              </button>
              <button className="btn btn-ghost btn-sm" title="Archive conversation" style={{ padding: '4px 5px', color: 'var(--muted)' }} onClick={() => onArchive(conversation.id)} disabled={loading}>
                <Icon name="close" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const bubbleStyle = (isUser) => ({
  maxWidth: 480, padding: '12px 16px', fontSize: 14.5, lineHeight: 1.55,
  borderRadius: 18, fontWeight: isUser ? 600 : 500, whiteSpace: 'pre-line',
  background: isUser ? 'linear-gradient(180deg,var(--g-400),var(--g-500))' : '#fff',
  color: isUser ? '#06231a' : 'var(--ink)',
  border: isUser ? 'none' : '1px solid var(--line)',
  borderTopRightRadius: isUser ? 4 : 18, borderTopLeftRadius: isUser ? 18 : 4,
  boxShadow: isUser ? 'var(--sh-green)' : 'var(--sh-xs)',
});

function AgentAvatar() {
  return (
    <span style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(140deg,#29d68f,#15c4c0)', display: 'grid', placeItems: 'center', flex: 'none', boxShadow: '0 4px 12px rgba(0,168,106,.22)' }}>
      <Icon name="spark" size={17} color="#06231a" />
    </span>
  );
}

function TextRow({ text, isUser }) {
  return (
    <div className="row" style={{ gap: 9, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && <AgentAvatar />}
      <div style={bubbleStyle(isUser)}>{text}</div>
    </div>
  );
}

function DraftCard({ draft }) {
  const [status, setStatus] = useState('pending');
  const [editing, setEditing] = useState(false);
  const [subject, setSubject] = useState(draft.subject || '');
  const [body, setBody] = useState(draft.body || '');
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState('');

  const approve = async () => {
    setBusy(true);
    setErrorText('');
    try {
      await api.post(`/emails/drafts/${draft.id}/approve`);
      setStatus('approved');
    } catch (err) {
      setErrorText(err?.response?.data?.error || 'Failed to approve this draft.');
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    setBusy(true);
    setErrorText('');
    try {
      await api.post(`/emails/drafts/${draft.id}/reject`);
      setStatus('rejected');
    } catch (err) {
      setErrorText(err?.response?.data?.error || 'Failed to reject this draft.');
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    setBusy(true);
    setErrorText('');
    try {
      await api.patch(`/emails/drafts/${draft.id}`, { subject, body });
      setEditing(false);
    } catch (err) {
      setErrorText(err?.response?.data?.error || 'Failed to save changes.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16, maxWidth: 480, borderRadius: 16 }}>
      <div className="row" style={{ gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
        <Avatar name={draft.leadName || 'Lead'} size={32} />
        <div className="col grow" style={{ minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{draft.leadName}</span>
          {draft.company && <span className="faint" style={{ fontSize: 11.5 }}>{draft.company}</span>}
        </div>
        {status !== 'pending' && (
          <span className="chip" style={{ fontSize: 11, flex: 'none' }}>
            {status === 'approved' ? 'Approved · queued to send' : 'Rejected'}
          </span>
        )}
      </div>

      {editing ? (
        <div className="col" style={{ gap: 6 }}>
          <input className="input" value={subject} onChange={e => setSubject(e.target.value)} disabled={busy} />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            disabled={busy}
            style={{
              width: '100%', minHeight: 120, resize: 'vertical', border: '1px solid var(--line)',
              borderRadius: 8, padding: '10px 12px', font: 'inherit', fontSize: 13.5, lineHeight: 1.55,
              color: 'var(--ink-2)', background: '#fff', outline: 'none',
            }}
          />
        </div>
      ) : (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{subject}</div>
          <div className="faint" style={{ fontSize: 12.5, whiteSpace: 'pre-line' }}>{body}</div>
        </div>
      )}

      {errorText && <p style={{ color: 'var(--red-600, #c0392b)', fontSize: 12, marginTop: 8 }}>{errorText}</p>}

      {status === 'pending' && (
        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          {editing ? (
            <>
              <button className="btn btn-primary btn-sm" disabled={busy || !subject.trim() || !body.trim()} onClick={saveEdit}>Save</button>
              <button className="btn btn-sm" disabled={busy} onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" disabled={busy} onClick={approve}>Approve</button>
              <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-ghost btn-sm btn-reject" disabled={busy} onClick={reject}>Reject</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TrendCard({ chart }) {
  const labels = chart?.labels || [];
  const series = chart?.series || [];
  const max = Math.max(1, ...series.flatMap(s => s.values || []).map(Number));
  const summary = chart?.summary || {};
  const funnel = chart?.funnel || {};
  return (
    <div className="card" style={{ padding: 16, maxWidth: 560, borderRadius: 16 }}>
      <div className="row spread" style={{ marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 13.5 }}>Campaign performance</span>
        <span className="faint" style={{ fontSize: 11 }}>Last 7 days</span>
      </div>
      <div style={{ height: 142, display: 'grid', gridTemplateColumns: `repeat(${Math.max(labels.length, 1)}, minmax(0, 1fr))`, gap: 7, alignItems: 'end', borderBottom: '1px solid var(--line)', padding: '8px 4px 0' }}>
        {labels.length === 0 ? <span className="faint" style={{ gridColumn: '1/-1', textAlign: 'center', alignSelf: 'center' }}>No trend data yet.</span> : labels.map((label, index) => (
          <div key={`${label}-${index}`} className="col" style={{ gap: 4, height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div className="row" style={{ gap: 2, height: 112, alignItems: 'end' }}>
              {series.map(s => {
                const value = Number(s.values?.[index] ?? 0);
                return <span key={s.label} title={`${s.label}: ${value}`} style={{ width: 8, height: `${Math.max(value ? 8 : 2, (value / max) * 100)}%`, borderRadius: '4px 4px 0 0', background: s.color === 'teal' ? 'var(--teal-500, #28b7b0)' : 'var(--g-500)', minHeight: 2 }} />;
              })}
            </div>
            <span className="faint" style={{ fontSize: 9 }}>{label}</span>
          </div>
        ))}
      </div>
      <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
        {series.map(s => <span key={s.label} className="faint" style={{ fontSize: 11 }}><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 3, background: s.color === 'teal' ? 'var(--teal-500, #28b7b0)' : 'var(--g-500)', marginRight: 4 }} />{s.label}</span>)}
      </div>
      <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
        {[
          ['Emails sent', summary.emailsSent ?? 0],
          ['Reply rate', `${summary.replyRate ?? 0}%`],
          ['Meetings', summary.meetings ?? 0],
          ['Prospects', funnel.prospects ?? 0],
        ].map(([label, value]) => <div key={label} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '8px 10px', minWidth: 86 }}><div className="display" style={{ fontSize: 17, color: 'var(--g-700)' }}>{value}</div><div className="faint" style={{ fontSize: 10 }}>{label}</div></div>)}
      </div>
    </div>
  );
}

function ReplyReviewCard({ replies, drafts }) {
  const rows = replies || [];
  const draftRows = drafts || [];
  return (
    <div className="card" style={{ padding: 16, maxWidth: 560, borderRadius: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>{draftRows.length > 0 ? 'Response drafts ready for review' : 'Incoming replies'}</div>
      {(draftRows.length > 0 ? draftRows : rows).length === 0 ? <p className="faint" style={{ fontSize: 12.5 }}>No incoming replies found.</p> : (
        <div className="col" style={{ gap: 9 }}>
          {(draftRows.length > 0 ? draftRows : rows).map((item, i) => {
            const lead = item.lead || {};
            return <div key={item.id || i} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 10 }}>
              <div className="row spread" style={{ gap: 8 }}><strong style={{ fontSize: 12.5 }}>{lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Prospect'}</strong><span className="faint" style={{ fontSize: 10.5 }}>{item.draftStatus || ''}</span></div>
              {item.subject && <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4 }}>{item.subject}</div>}
              <div className="faint" style={{ fontSize: 11.5, whiteSpace: 'pre-line', marginTop: 4 }}>{item.body}</div>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

function SlotCard({ slots, timezone }) {
  return (
    <div className="card" style={{ padding: 16, maxWidth: 480, borderRadius: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>Available meeting times</div>
      <div className="faint" style={{ fontSize: 11.5, marginBottom: 10 }}>{timezone || 'Calendar timezone'}</div>
      {(slots || []).length === 0 ? <p className="faint" style={{ fontSize: 12.5 }}>No open slots matched those preferences.</p> : <div className="row wrap" style={{ gap: 7 }}>{slots.map(slot => <span key={slot.startAt} className="chip" style={{ fontSize: 11.5 }}>{slot.label}</span>)}</div>}
    </div>
  );
}

function SequencePreviewCard({ sequences }) {
  return (
    <div className="card" style={{ padding: 16, maxWidth: 560, borderRadius: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Personalized sequence drafts</div>
      {(sequences || []).map((sequence, i) => <div key={sequence.lead?.id || i} style={{ borderTop: i ? '1px solid var(--line)' : 'none', paddingTop: i ? 10 : 0, marginTop: i ? 10 : 0 }}>
        <strong style={{ fontSize: 12.5 }}>{sequence.lead?.name || [sequence.lead?.first_name, sequence.lead?.last_name].filter(Boolean).join(' ') || 'Lead'}</strong>
        <div className="col" style={{ gap: 6, marginTop: 7 }}>{(sequence.steps || []).map(step => <div key={step.stepNumber} style={{ background: 'var(--bg-2)', borderRadius: 9, padding: 8 }}><div style={{ fontSize: 11.5, fontWeight: 700 }}>Step {step.stepNumber}: {step.subject}</div><div className="faint" style={{ fontSize: 11.5, whiteSpace: 'pre-line', marginTop: 3 }}>{step.body}</div></div>)}</div>
      </div>)}
    </div>
  );
}

function CreditSummaryCard({ usage, providerFailures }) {
  return (
    <div className="card" style={{ padding: 16, maxWidth: 480, borderRadius: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13.5 }}>Credit usage</div>
      {usage && <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>{[['Used', usage.usedCredits], ['Reserved', usage.reservedCredits], ['Remaining', usage.remainingCredits]].map(([label, value]) => <div key={label} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '8px 10px', minWidth: 86 }}><div className="display" style={{ fontSize: 17, color: 'var(--g-700)' }}>{value ?? 0}</div><div className="faint" style={{ fontSize: 10 }}>{label}</div></div>)}</div>}
      {(providerFailures || []).length > 0 && <div style={{ marginTop: 12, fontSize: 11.5 }}><strong>Recent provider events</strong>{providerFailures.slice(0, 4).map((failure, i) => <div key={i} className="faint" style={{ marginTop: 4 }}>{failure.provider} · {failure.operation} · {failure.status}</div>)}</div>}
    </div>
  );
}

function CampaignDraftCard({ campaign, onPrepare }) {
  const [busy, setBusy] = useState(false);
  const prepare = async () => {
    if (!campaign?.id || !onPrepare) return;
    setBusy(true);
    try {
      await onPrepare(campaign.id);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="card" style={{ padding: 16, maxWidth: 480, borderRadius: 16, border: '1px solid var(--g-200, #b9efd8)' }}>
      <div className="row spread" style={{ gap: 10 }}>
        <div className="row" style={{ gap: 8 }}><Icon name="target" size={16} color="var(--g-600)" /><strong style={{ fontSize: 13.5 }}>Campaign draft created</strong></div>
        <span className="chip" style={{ fontSize: 10.5 }}>Draft</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 12 }}>{campaign.name || 'New campaign'}</div>
      <div className="faint" style={{ fontSize: 11.5, marginTop: 4 }}>{campaign.channel || 'email'} · up to {campaign.maxLeads ?? '—'} leads · nothing will send yet</div>
      <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} disabled={busy} onClick={prepare}>
        <Icon name="bolt" size={13} color="#06231a" /> {busy ? 'Preparing…' : 'Proceed with Campaign preparation'}
      </button>
    </div>
  );
}

function MeetingProposalCard({ proposal }) {
  const lead = proposal?.lead || {};
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || lead.name || 'Prospect';
  const slots = proposal?.slots || [];
  return (
    <div className="card" style={{ padding: 16, maxWidth: 520, borderRadius: 16 }}>
      <div className="row spread" style={{ gap: 10 }}><div className="row" style={{ gap: 8 }}><Icon name="calendar" size={16} color="var(--g-600)" /><strong style={{ fontSize: 13.5 }}>Meeting proposal draft</strong></div><span className="chip" style={{ fontSize: 10.5 }}>{proposal?.status === 'draft' ? 'Ready to review' : 'Unavailable'}</span></div>
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>{name}{lead.company ? ` · ${lead.company}` : ''}</div>
      {proposal?.text && <p className="faint" style={{ fontSize: 12, lineHeight: 1.5, margin: '8px 0 10px' }}>{proposal.text}</p>}
      {slots.length > 0 ? <div className="row wrap" style={{ gap: 7 }}>{slots.map(slot => <span key={slot.startAt} className="chip" style={{ fontSize: 11.5 }}>{slot.label}</span>)}</div> : <p className="faint" style={{ fontSize: 12 }}>No real calendar slots were available for this proposal.</p>}
      <p className="faint" style={{ fontSize: 10.5, marginTop: 10 }}>Draft only — nothing was sent or booked.</p>
    </div>
  );
}

function LeadResearchCard({ researched }) {
  const rows = researched || [];
  return (
    <div className="card" style={{ padding: 16, maxWidth: 560, borderRadius: 16 }}>
      <div className="row spread" style={{ gap: 10 }}><div className="row" style={{ gap: 8 }}><Icon name="search" size={16} color="var(--g-600)" /><strong style={{ fontSize: 13.5 }}>Lead research</strong></div><span className="chip" style={{ fontSize: 10.5 }}>{rows.length} researched</span></div>
      {rows.length === 0 ? <p className="faint" style={{ fontSize: 12, marginTop: 10 }}>No selected leads were available to research.</p> : <div className="col" style={{ gap: 9, marginTop: 10 }}>{rows.map((item, index) => {
        const lead = item.lead || {};
        const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || lead.name || 'Lead';
        const facts = item.facts?.verifiedFacts || item.facts?.facts || [];
        return <div key={lead.id || index} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 10 }}><div className="row spread" style={{ gap: 8 }}><strong style={{ fontSize: 12.5 }}>{name}</strong><span className="faint" style={{ fontSize: 10.5 }}>{lead.company || lead.title || ''}</span></div>{item.summary && <div className="faint" style={{ fontSize: 11.5, marginTop: 5, whiteSpace: 'pre-line' }}>{item.summary}</div>}{Array.isArray(facts) && facts.slice(0, 3).map((fact, factIndex) => <div key={factIndex} style={{ fontSize: 11, marginTop: 4 }}>• {typeof fact === 'string' ? fact : fact?.text || fact?.value || 'Verified fact recorded'}</div>)}</div>;
      })}</div>}
    </div>
  );
}

function LeadSearchPreviewCard({ preview }) {
  if (!preview) return null;
  const person = preview.person || {};
  const company = preview.company || {};
  const rows = value => Array.isArray(value) ? value.join(', ') : value ? JSON.stringify(value) : 'None';
  return <div className="card" style={{ padding: 16, maxWidth: 620, borderRadius: 16, border: '1px solid var(--g-200)' }}>
    <div className="row spread" style={{ gap: 10 }}><strong style={{ fontSize: 13.5 }}>Lead search filter preview</strong><span className="chip">{preview.requestedCount} requested</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12, marginTop: 12 }}>
      <div><div className="eyebrow">Person</div><div className="faint" style={{ fontSize: 11.5, lineHeight: 1.6 }}>Titles: {rows(person.titles)}<br/>Seniorities: {rows(person.seniorities)}<br/>Locations: {rows(person.locations)}<br/>Email status: {rows(person.emailStatuses)}</div></div>
      <div><div className="eyebrow">Company</div><div className="faint" style={{ fontSize: 11.5, lineHeight: 1.6 }}>HQ: {rows(company.hqLocations)}<br/>Domains: {rows(company.domains)}<br/>Employees: {rows(company.employeeRanges)}<br/>Company tags: {rows(company.keywordTags)}</div></div>
    </div>
    {preview.explicitGeneralKeywords && <p style={{ fontSize: 11.5, margin: '10px 0 0' }}>Exact keyword: “{preview.explicitGeneralKeywords}”</p>}
    {(preview.ambiguousLocations || []).length > 0 && <p style={{ fontSize: 11.5, color: 'var(--orange-700)', margin: '10px 0 0' }}>Clarify person location vs company HQ: {preview.ambiguousLocations.join(', ')}</p>}
    {(preview.unresolvedConcepts || []).length > 0 && <p style={{ fontSize: 11.5, color: 'var(--orange-700)', margin: '6px 0 0' }}>Unresolved company concepts: {preview.unresolvedConcepts.join(', ')}</p>}
    {(preview.unresolvedTechnologies || []).length > 0 && <p style={{ fontSize: 11.5, color: 'var(--orange-700)', margin: '6px 0 0' }}>Unmatched technologies: {preview.unresolvedTechnologies.join(', ')}</p>}
    <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>{(preview.operations || []).map(op => <span className="chip" key={op.name}>{op.name.replaceAll('_', ' ')} · {op.creditCost}</span>)}</div>
    {preview.maximumOrganizationSearchCredits > 0 && <p style={{ fontSize: 11.5, fontWeight: 700, margin: '10px 0 0' }}>Maximum Organization Search cost: {preview.maximumOrganizationSearchCredits} Apollo credit{preview.maximumOrganizationSearchCredits === 1 ? '' : 's'}</p>}
  </div>;
}

function ApprovalCard({ approval, onResolved }) {
  const [status, setStatus] = useState(approval?.status || 'pending');
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState('');
  const resolve = async decision => {
    if (!approval?.id) return;
    setBusy(true);
    setErrorText('');
    try {
      const { data } = await api.post(`/agent/approvals/${approval.id}`, { decision });
      setStatus(decision === 'approve' ? 'approved' : 'rejected');
      if (data?.message) onResolved?.(apiMessageToMsg(data.message));
    } catch (err) {
      setErrorText(err?.response?.data?.error || 'This approval could not be resolved.');
    } finally {
      setBusy(false);
    }
  };
  const leadSearch = approval?.tool === 'execute_company_first_lead_search';
  return <div className="card" style={{ padding: 16, maxWidth: 480, borderRadius: 16, border: '1px solid var(--orange-200, #f6d2a5)' }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>Approval needed</div><p className="faint" style={{ fontSize: 12.5, margin: '7px 0 10px' }}>Proceed with <strong>{leadSearch ? 'company-first Apollo lead search' : String(approval?.tool || 'this action').replaceAll('_', ' ')}</strong>?</p>{errorText && <p style={{ color: 'var(--red-600, #c0392b)', fontSize: 11.5, margin: '0 0 9px' }}>{errorText}</p>}{status === 'pending' ? <div className="row" style={{ gap: 8 }}><button className="btn btn-primary btn-sm" disabled={busy} onClick={() => resolve('approve')}>{leadSearch ? 'Proceed with lead search' : 'Proceed'}</button><button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => resolve('reject')}>Cancel</button></div> : <span className="chip" style={{ fontSize: 11 }}>{status}</span>}</div>;
}

function Bubble({ m, onResolved, onPrepare }) {
  const isUser = m.who === 'user';

  if (m.kind === 'stats') {
    return (
      <div className="col" style={{ gap: 10 }}>
        {m.text && <TextRow text={m.text} isUser={false} />}
        {(m.stats || []).length > 0 && (
          <div className="row" style={{ gap: 9, marginLeft: 41 }}>
            {m.stats.map(([v, k]) => (
              <div key={k} className="card kpi-card-accent" style={{ padding: '12px 14px 11px', minWidth: 106, borderRadius: 14 }}>
                <span className="kpi-icon-badge" style={{ width: 26, height: 26, borderRadius: 8 }}>
                  <Icon name={STAT_ICONS[k] || 'trend'} size={14} />
                </span>
                <div className="display" style={{ fontSize: 20, color: 'var(--g-700)', marginTop: 8 }}>{v}</div>
                <div className="faint" style={{ fontSize: 10.5, fontWeight: 700, marginTop: 2 }}>{k}</div>
              </div>
            ))}
          </div>
        )}
        {m.leadSearchPreview && <div style={{ marginLeft: 41 }}><LeadSearchPreviewCard preview={m.leadSearchPreview} /></div>}
        {m.exactFilters && <details style={{ marginLeft: 41, fontSize: 11.5 }}><summary>Exact Apollo filters applied</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(m.exactFilters, null, 2)}</pre></details>}
        {(m.relaxations || []).length > 0 && <div className="row wrap" style={{ gap: 6, marginLeft: 41 }}>{m.relaxations.map(item => <button key={item.field} className="btn btn-ghost btn-sm">Try: {item.label}</button>)}</div>}
      </div>
    );
  }

  if (m.kind === 'draft_review') {
    return (
      <div className="col" style={{ gap: 10 }}>
        {m.text && <TextRow text={m.text} isUser={false} />}
        {(m.drafts || []).length > 0 && (
          <div className="col" style={{ gap: 10, marginLeft: 41 }}>
            {m.drafts.map(d => <DraftCard key={d.id} draft={d} />)}
          </div>
        )}
      </div>
    );
  }

  if (m.kind === 'chart') {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><TrendCard chart={m.chart} /></div></div>;
  }
  if (m.kind === 'reply_review') {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><ReplyReviewCard replies={m.replies} drafts={m.drafts} /></div></div>;
  }
  if (m.kind === 'sequence_preview') {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><SequencePreviewCard sequences={m.sequences} /></div></div>;
  }
  if (m.kind === 'credit_summary') {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><CreditSummaryCard usage={m.usage} providerFailures={m.providerFailures} /></div></div>;
  }
  if (m.campaign) {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><CampaignDraftCard campaign={m.campaign} onPrepare={onPrepare} /></div></div>;
  }
  if (m.proposal) {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><MeetingProposalCard proposal={m.proposal} /></div></div>;
  }
  if (m.researched) {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><LeadResearchCard researched={m.researched} /></div></div>;
  }
  if (m.approval) {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}{m.leadSearchPreview && <div style={{ marginLeft: 41 }}><LeadSearchPreviewCard preview={m.leadSearchPreview} /></div>}<div style={{ marginLeft: 41 }}><ApprovalCard approval={m.approval} onResolved={onResolved} /></div></div>;
  }
  if (m.slots) {
    return <div className="col" style={{ gap: 10 }}>{m.text && <TextRow text={m.text} isUser={false} />}<div style={{ marginLeft: 41 }}><SlotCard slots={m.slots} timezone={m.timezone} /></div></div>;
  }

  return <TextRow text={m.text} isUser={isUser} />;
}

export default function AgentPage() {
  const [msgs, setMsgs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sidebarData, setSidebarData] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [name, setName] = useState('GNX sales');
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [dashboardRes, conversationsRes] = await Promise.all([
        api.get('/dashboard').catch(() => null),
        api.get('/agent/conversations').catch(() => null),
      ]);
      if (cancelled) return;
      const d = dashboardRes?.data;
      if (d) {
        setSidebarData(d);
        if (d.agentName) setName(d.agentName);
      }

      const availableConversations = conversationsRes?.data?.items || [];
      setConversations(availableConversations);
      const active = availableConversations.find(item => !item.archivedAt) || availableConversations[0] || null;
      setActiveConversationId(active?.id || null);
      const messagesRes = await api.get('/agent/messages', active?.id ? { params: { conversationId: active.id } } : undefined).catch(() => null);
      if (cancelled) return;
      const items = messagesRes?.data?.items || [];
      if (items.length > 0) {
        setMsgs(items.map(apiMessageToMsg));
        return;
      }

      if (d) {
        const kpis = d.kpis || {};
        const firstName = d.user?.firstName || 'there';
        setMsgs([
          { who: 'agent', kind: 'text', text: `Hi ${firstName} 👋 Here's your current status:` },
          { who: 'agent', kind: 'stats', stats: [
            [kpis.emailsSent ?? 0, 'emails sent'],
            [kpis.replies ?? 0, 'replies'],
            [kpis.meetings ?? 0, 'meetings booked'],
          ]},
          { who: 'agent', kind: 'text', text: kpis.hotLeads > 0
            ? `You have ${kpis.hotLeads} hot leads that need attention. What would you like me to do?`
            : 'Everything looks good. What would you like me to work on?'
          },
        ]);
      } else {
        setMsgs([{ who: 'agent', kind: 'text', text: `Hi 👋 I'm ${name}, your AI sales agent. How can I help?` }]);
      }
    };
    load().finally(() => {
      if (!cancelled) {
        setHistoryLoading(false);
        setInitialLoaded(true);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const reloadConversations = async () => {
    const { data } = await api.get('/agent/conversations');
    setConversations(data?.items || []);
  };

  const selectConversation = async (conversationId) => {
    if (conversationId === activeConversationId) return;
    setHistoryLoading(true);
    try {
      const { data } = await api.get('/agent/messages', { params: { conversationId } });
      setActiveConversationId(conversationId);
      setMsgs((data?.items || []).map(apiMessageToMsg));
    } finally {
      setHistoryLoading(false);
    }
  };

  const createConversation = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await api.post('/agent/conversations', { title: 'New conversation' });
      const conversation = data;
      setConversations(current => [conversation, ...current]);
      setActiveConversationId(conversation.id);
      setMsgs([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const archiveConversation = async (conversationId) => {
    setHistoryLoading(true);
    try {
      await api.patch(`/agent/conversations/${conversationId}`, { archived: true });
      const remaining = conversations.filter(item => item.id !== conversationId);
      setConversations(remaining);
      if (conversationId === activeConversationId) {
        const next = remaining.find(item => !item.archivedAt) || remaining[0];
        if (next) await selectConversation(next.id);
        else {
          setActiveConversationId(null);
          setMsgs([]);
        }
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const send = async (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setMsgs(m => [...m, { who: 'user', kind: 'text', text: t }]);
    setInput('');
    setTyping(true);

    try {
      // Search/draft tools can chase Apollo results across several calls plus
      // an extra LLM round-trip, so this needs real headroom past the 10s
      // default set on the shared api client.
      const { data } = await api.post('/agent/chat', { message: t, conversationId: activeConversationId }, { timeout: 60000 });
      const nextMessage = apiMessageToMsg(data);
      if (nextMessage.conversationId && nextMessage.conversationId !== activeConversationId) setActiveConversationId(nextMessage.conversationId);
      setMsgs(m => [...m, nextMessage]);
      await reloadConversations().catch(() => undefined);
    } catch (err) {
      const isTimeout = err?.code === 'ECONNABORTED';
      const reason = err?.response?.data?.error
        || (isTimeout
          ? "That took too long to finish. It may still be running - check the relevant page, or try again."
          : "Something went wrong reaching the agent. Please try again.");
      setMsgs(m => [...m, { who: 'agent', kind: 'text', text: reason }]);
    } finally {
      setTyping(false);
    }
  };

  const prepareCampaign = (campaignId) => send(`Prepare campaign ${campaignId} end to end`);

  const kpis = sidebarData?.kpis ?? {};
  const activity = sidebarData?.activity ?? [];

  return (
    <div className="row agent-page" style={{ flex: 1, minHeight: 0, alignItems: 'stretch', overflow: 'hidden' }}>
      <div className="grow col agent-chat-pane" style={{ minWidth: 0 }}>
        <div className="row spread agent-chat-head" style={{ padding: '16px 24px 12px', flex: 'none', borderBottom: '1px solid var(--line)' }}>
          <div className="row" style={{ gap: 12 }}>
            <span className="agent-avatar-ring" style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(140deg,#29d68f,#15c4c0)', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <Icon name="spark" size={22} color="#06231a" />
            </span>
            <div className="col">
              <div className="row" style={{ gap: 8 }}>
                <span className="display" style={{ fontSize: 18, fontWeight: 600 }}>{name}</span>
                <span className="chip agent-status-chip"><span className="dot" style={{ animation: 'pulse-dot 1.4s infinite' }} /> Active</span>
              </div>
              <span className="faint" style={{ fontSize: 12.5 }}>Your autonomous sales agent</span>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="scroll grow agent-chat-scroll" style={{ padding: '16px 24px', minHeight: 0 }}>
          <div className="col agent-message-list" style={{ gap: 14, maxWidth: 700, margin: '0 auto', paddingBottom: 8 }}>
            {!initialLoaded ? (
              <div style={{ padding: 20, textAlign: 'center' }}>
                <p className="muted">Loading…</p>
              </div>
            ) : (
              msgs.map((m, i) => <Bubble key={m.id ?? i} m={m} onResolved={resolved => setMsgs(current => [...current, resolved])} onPrepare={prepareCampaign} />)
            )}
            {typing && (
              <div className="row" style={{ gap: 9 }}>
                <AgentAvatar />
                <div className="card" style={{ padding: '10px 14px', borderTopLeftRadius: 4 }}><Typing /></div>
              </div>
            )}
          </div>
        </div>
        <div className="agent-composer" style={{ flex: 'none', padding: '10px 24px 18px', borderTop: '1px solid var(--line)', background: '#fff' }}>
          <div className="row wrap agent-quick-actions" style={{ gap: 7, maxWidth: 700, margin: '0 auto 10px' }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} className="chip" style={{ cursor: 'pointer', background: '#fff', border: '1px solid var(--line)', color: 'var(--ink-2)', height: 30, fontSize: 12.5 }} disabled={typing}>
                <Icon name="bolt" size={12} color="var(--g-600)" /> {q}
              </button>
            ))}
          </div>
          <div className="row agent-input-row" style={{ gap: 10, maxWidth: 700, margin: '0 auto' }}>
            <div className="input-wrap grow">
              <span className="lead-ico"><Icon name="spark" size={16} /></span>
              <input className="input has-ico" style={{ height: 50 }} placeholder={`Ask ${name} to prospect, draft, or follow up…`} value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} disabled={typing} />
            </div>
            <button className="btn btn-primary agent-send-btn" style={{ width: 50, height: 50, padding: 0, borderRadius: 14, flex: 'none' }} onClick={() => send()} disabled={typing}>
              <Icon name="send" size={19} color="#06231a" />
            </button>
          </div>
        </div>
      </div>

      <aside data-tour="agent-overview" className="scroll agent-overview-panel" style={{ width: 300, flex: 'none', borderLeft: '1px solid var(--line)', background: '#fff', padding: 18 }}>
        <ConversationHistory conversations={conversations} activeId={activeConversationId} loading={historyLoading} onSelect={selectConversation} onNew={createConversation} onArchive={archiveConversation} />
        <span className="eyebrow">Overview</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            { k: 'Emails sent', v: kpis.emailsSent ?? 0, ico: 'send' },
            { k: 'Replies', v: kpis.replies ?? 0, ico: 'chat' },
            { k: 'Meetings', v: kpis.meetings ?? 0, ico: 'calendar' },
            { k: 'Hot leads', v: kpis.hotLeads ?? 0, ico: 'flame', warn: true },
          ].map(s => (
            <div key={s.k} className="card kpi-card-accent" data-tone={s.warn ? 'warn' : undefined} style={{ padding: 14, borderRadius: 14 }}>
              <span className="kpi-icon-badge" data-tone={s.warn ? 'warn' : undefined}>
                <Icon name={s.ico} size={15} />
              </span>
              <div className="display" style={{ fontSize: 22, marginTop: 8 }}>{s.v}</div>
              <div className="faint" style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{s.k}</div>
            </div>
          ))}
        </div>
        <span className="eyebrow" style={{ display: 'block', marginTop: 20 }}>Recent activity</span>
        <div className="col" style={{ gap: 2, marginTop: 10 }}>
          {activity.length === 0 ? (
            <p className="faint" style={{ fontSize: 12.5, padding: '8px 0' }}>No recent activity.</p>
          ) : (
            activity.slice(0, 5).map((a, i) => (
              <div key={i} className="row agent-activity-row" style={{ gap: 10, padding: '9px 6px' }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, flex: 'none', display: 'grid', placeItems: 'center', background: a.hot ? 'var(--g-50)' : 'var(--bg-2)', color: a.hot ? 'var(--g-600)' : 'var(--muted)' }}>
                  <Icon name={a.type === 'reply' ? 'chat' : a.type === 'meeting' ? 'calendar' : 'send'} size={15} />
                </span>
                <div className="col" style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</span>
                  <span className="faint" style={{ fontSize: 11.5 }}>{a.timeAgo}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
