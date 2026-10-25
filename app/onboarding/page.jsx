"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/ui/Logo";
import Aurora from "../../components/ui/Aurora";
import Icon from "../../components/ui/Icon";
import Field from "../../components/ui/Field";
import api from "../../lib/api";
import { clampNumber, cleanList, cleanText, normalizeUrl } from "../../lib/validation";

const STEPS = [
  { title: 'Profile', sub: 'Tell GNX sales who is setting up the workspace.', ico: 'user' },
  { title: 'Product', sub: 'Explain what you sell and why buyers care.', ico: 'doc' },
  { title: 'Ideal customer', sub: 'Define the accounts and people to target.', ico: 'target' },
  { title: 'Outreach strategy', sub: 'Set the messaging style and campaign goals.', ico: 'send' },
  { title: 'Review & launch', sub: "Everything looks right? Let's go.", ico: 'checkCircle' },
];

// Apollo's seniority levels and department titles, so the role matches how
// leads are filtered when searching Apollo.
const ROLES = [
  'Owner', 'Founder', 'Co-Founder', 'Partner', 'C-Suite', 'CEO', 'COO', 'CFO', 'CTO', 'CMO', 'CRO', 'CIO', 'CISO', 'CPO', 'CHRO',
  'President', 'Managing Director', 'General Manager',
  'VP of Sales', 'VP of Marketing', 'VP of Engineering', 'VP of Product', 'VP of Operations', 'VP of Finance', 'VP of Customer Success', 'VP of HR',
  'Head of Sales', 'Head of Marketing', 'Head of Growth', 'Head of Product', 'Head of Engineering', 'Head of Operations', 'Head of Partnerships',
  'Sales Director', 'Marketing Director', 'Director of Business Development', 'Director of Operations', 'Director of Engineering', 'Director of Product', 'Director of Finance', 'Director of HR', 'Director of IT',
  'Account Executive', 'Senior Account Executive', 'SDR / BDR', 'Sales Manager', 'Business Development Manager', 'Account Manager', 'Key Account Manager', 'Sales Engineer', 'Sales Operations / RevOps',
  'Marketing Manager', 'Demand Generation Manager', 'Growth Manager', 'Content Marketing Manager', 'Product Marketing Manager', 'Brand Manager', 'Digital Marketing Manager',
  'Customer Success Manager', 'Customer Support Manager', 'Partnerships Manager', 'Operations Manager', 'Project Manager', 'Product Manager', 'Program Manager',
  'Engineering Manager', 'Software Engineer', 'Data Analyst', 'Designer', 'IT Manager',
  'Finance Manager', 'HR Manager', 'Recruiter / Talent Acquisition', 'Legal Counsel',
  'Consultant', 'Freelancer', 'Agency Owner', 'Senior Individual Contributor', 'Entry Level', 'Intern', 'Other',
];

// Apollo's industry list, kept in its lowercase form so values match Apollo
// searches. The dropdown capitalizes them for display.
const INDUSTRIES = [
  'accounting', 'airlines/aviation', 'alternative dispute resolution', 'alternative medicine', 'animation', 'apparel & fashion',
  'architecture & planning', 'arts & crafts', 'automotive', 'aviation & aerospace', 'banking', 'biotechnology', 'broadcast media',
  'building materials', 'business supplies & equipment', 'capital markets', 'chemicals', 'civic & social organization', 'civil engineering',
  'commercial real estate', 'computer & network security', 'computer games', 'computer hardware', 'computer networking', 'computer software',
  'construction', 'consumer electronics', 'consumer goods', 'consumer services', 'cosmetics', 'dairy', 'defense & space', 'design',
  'e-learning', 'education management', 'electrical/electronic manufacturing', 'entertainment', 'environmental services', 'events services',
  'executive office', 'facilities services', 'farming', 'financial services', 'fine art', 'fishery', 'food & beverages', 'food production',
  'fund-raising', 'furniture', 'gambling & casinos', 'glass, ceramics & concrete', 'government administration', 'government relations',
  'graphic design', 'health, wellness & fitness', 'higher education', 'hospital & health care', 'hospitality', 'human resources',
  'import & export', 'individual & family services', 'industrial automation', 'information services', 'information technology & services',
  'insurance', 'international affairs', 'international trade & development', 'internet', 'investment banking', 'investment management',
  'judiciary', 'law enforcement', 'law practice', 'legal services', 'legislative office', 'leisure, travel & tourism', 'libraries',
  'logistics & supply chain', 'luxury goods & jewelry', 'machinery', 'management consulting', 'maritime', 'market research',
  'marketing & advertising', 'mechanical or industrial engineering', 'media production', 'medical devices', 'medical practice',
  'mental health care', 'military', 'mining & metals', 'motion pictures & film', 'museums & institutions', 'music',
  'nanotechnology', 'newspapers', 'non-profit organization management', 'oil & energy', 'online media', 'outsourcing/offshoring',
  'package/freight delivery', 'packaging & containers', 'paper & forest products', 'performing arts', 'pharmaceuticals', 'philanthropy',
  'photography', 'plastics', 'political organization', 'primary/secondary education', 'printing', 'professional training & coaching',
  'program development', 'public policy', 'public relations & communications', 'public safety', 'publishing', 'railroad manufacture',
  'ranching', 'real estate', 'recreational facilities & services', 'religious institutions', 'renewables & environment', 'research',
  'restaurants', 'retail', 'security & investigations', 'semiconductors', 'shipbuilding', 'sporting goods', 'sports',
  'staffing & recruiting', 'supermarkets', 'telecommunications', 'textiles', 'think tanks', 'tobacco', 'translation & localization',
  'transportation/trucking/railroad', 'utilities', 'venture capital & private equity', 'veterinary', 'warehousing', 'wholesale',
  'wine & spirits', 'wireless', 'writing & editing', 'Other',
];

const TONE_API_VALUE = {
  'Consultative': 'consultative',
  'Direct & concise': 'direct',
  'Friendly & warm': 'friendly',
  'Challenger': 'challenger',
  'Formal': 'formal',
};

const HOOK_STYLE_API_VALUE = {
  'Pain-based (problem-first)': 'pain_based',
  'Insight-based (data/trend)': 'insight_based',
  'Social proof (customer story)': 'social_proof',
  'Personalized signal (news/hire)': 'personalized_signal',
  'Question-led': 'question_led',
};

const DEFAULTS = {
  firstName: '',
  lastName: '',
  company: '',
  role: 'Account Executive',
  industry: '',
  productDescription: '',
  valueProp: '',
  painPoints: '',
  titles: [],
  companySizes: [],
  targetIndustries: [],
  geos: [],
  meetingTarget: 15,
  dealSize: '',
  salesCycle: '',
  tone: 'Consultative',
  hookStyle: 'Pain-based (problem-first)',
  followUpCadence: 'Day 0, Day 3, Day 7',
  tools: [],
  agentName: 'GNX sales',
  bookingLink: '',
};

function OSelect({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="row wrap" style={{ gap: 9 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            height: 40, padding: '0 16px', borderRadius: 'var(--r-pill)', fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap',
            border: '1.5px solid ' + (value === o ? 'var(--g-400)' : 'var(--line)'),
            background: value === o ? 'var(--g-50)' : '#fff',
            color: value === o ? 'var(--g-700)' : 'var(--ink-2)', transition: 'all .13s',
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function OSearchSelect({ label, value, onChange, options, placeholder, icon, hint, capitalize }) {
  const cap = capitalize ? { textTransform: 'capitalize' } : null;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [otherMode, setOtherMode] = useState(false);
  const isOther = otherMode || (!!value && !options.includes(value));
  const box = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const shown = options.filter(o => o.toLowerCase().includes(q.trim().toLowerCase()));
  const pick = o => { setOtherMode(o === 'Other'); onChange(o); setOpen(false); setQ(''); };
  return (
    <div className="field" ref={box} style={{ position: 'relative' }}>
      <label>{label}</label>
      <button type="button" className={'input' + (icon ? ' has-ico' : '')} onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox" aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', cursor: 'pointer', position: 'relative', color: value ? 'var(--ink)' : 'var(--faint)' }}>
        {icon && <span className="lead-ico" style={{ position: 'absolute', left: 15, color: 'var(--faint)', display: 'flex' }}><Icon name={icon} size={19} /></span>}
        <span style={value && !isOther ? cap : null}>{isOther ? 'Other' : value || placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', zIndex: 30, top: '100%', left: 0, right: 0, marginTop: 6, background: '#fff', border: '1.5px solid var(--line)', borderRadius: 'var(--r-md)', boxShadow: '0 16px 40px rgba(10,23,18,.14)', padding: 8 }}>
          <input className="input" autoFocus placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} style={{ height: 40, fontSize: 14, marginBottom: 6 }} />
          <div role="listbox" style={{ maxHeight: 240, overflowY: 'auto' }}>
            {shown.length === 0 && <div style={{ padding: '10px 12px', fontSize: 13.5, color: 'var(--faint)' }}>No matches</div>}
            {shown.map(o => (
              <button type="button" key={o} role="option" aria-selected={o === 'Other' ? isOther : value === o} onClick={() => pick(o)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 10,
                fontSize: 14, fontWeight: (o === 'Other' ? isOther : value === o) ? 800 : 600, ...(o === 'Other' ? null : cap), color: (o === 'Other' ? isOther : value === o) ? 'var(--g-700)' : 'var(--ink-2)', background: (o === 'Other' ? isOther : value === o) ? 'var(--g-50)' : 'transparent',
              }}
                onMouseEnter={e => { if (!(o === 'Other' ? isOther : value === o)) e.currentTarget.style.background = 'var(--g-50)'; }}
                onMouseLeave={e => { if (!(o === 'Other' ? isOther : value === o)) e.currentTarget.style.background = 'transparent'; }}>
                {o}{(o === 'Other' ? isOther : value === o) && <Icon name="check" size={14} color="var(--g-600)" stroke={2.5} />}
              </button>
            ))}
          </div>
        </div>
      )}
      {isOther && (
        <input className="input" placeholder={`Type your ${label.toLowerCase().replace('your ', '')} (required)`} value={value === 'Other' ? '' : value}
          onChange={e => onChange(e.target.value || 'Other')} maxLength={80} style={{ marginTop: 8 }} />
      )}
      {hint && <span style={{ fontSize: 12.5, color: 'var(--faint)' }}>{hint}</span>}
    </div>
  );
}

function OMulti({ label, hint, options, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      {hint && <span className="faint" style={{ fontSize: 12.5, marginTop: -4 }}>{hint}</span>}
      <div className="row wrap" style={{ gap: 9 }}>
        {options.map(o => {
          const on = value.includes(o);
          return (
            <button key={o} onClick={() => onChange(o)} style={{
              height: 40, padding: '0 16px', borderRadius: 'var(--r-pill)', fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap',
              border: '1.5px solid ' + (on ? 'var(--g-400)' : 'var(--line)'),
              background: on ? 'var(--g-50)' : '#fff',
              color: on ? 'var(--g-700)' : 'var(--ink-2)', transition: 'all .13s',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {on && <Icon name="check" size={14} color="var(--g-600)" stroke={2.5} />}{o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OTextarea({ label, hint, rows = 5, placeholder, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea
        className="input"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          minHeight: rows >= 5 ? 148 : 118,
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.55,
          padding: '14px 16px',
        }}
      />
      {hint && <span className="faint" style={{ fontSize: 12.5 }}>{hint}</span>}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [d, setD] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const toggle = (k, v) => setD(prev => ({
    ...prev,
    [k]: prev[k].includes(v) ? prev[k].filter(x => x !== v) : [...prev[k], v],
  }));

  const back = () => step > 0 ? setStep(s => s - 1) : router.push('/signup');

  const validateCurrentStep = () => {
    if (step === 0 && (!cleanText(d.firstName, { max: 80 }) || !cleanText(d.company, { max: 160 }))) {
      return 'Enter your first name and company.';
    }
    if (step === 0 && d.role === 'Other') return 'Tell us your role, since you chose Other.';
    if (step === 0 && d.industry === 'Other') return 'Tell us your industry, since you chose Other.';
    if (step === 1 && (cleanText(d.productDescription, { max: 4000, multiline: true }).length < 20 || cleanText(d.valueProp, { max: 2000, multiline: true }).length < 10)) {
      return 'Add product context and a measurable customer outcome.';
    }
    if (step === 2 && (d.titles.length === 0 || d.targetIndustries.length === 0)) {
      return 'Select at least one target title and industry.';
    }
    return '';
  };

  const continueStep = () => {
    const message = validateCurrentStep();
    if (message) {
      setError(message);
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const launch = async () => {
    setError('');
    setLoading(true);
    let bookingLink = '';
    try {
      bookingLink = normalizeUrl(d.bookingLink);
    } catch {
      setLoading(false);
      setError('Enter a valid booking link or leave it blank.');
      return;
    }
    const payload = {
      productDescription: cleanText(d.productDescription, { max: 4000, multiline: true }),
      valueProp: cleanText(d.valueProp, { max: 2000, multiline: true }),
      firstName: cleanText(d.firstName, { max: 80 }),
      lastName: cleanText(d.lastName, { max: 80 }),
      company: cleanText(d.company, { max: 160 }),
      role: cleanText(d.role, { max: 80 }),
      industry: cleanText(d.industry, { max: 120 }),
      painPoints: cleanText(d.painPoints, { max: 2000, multiline: true }),
      tone: TONE_API_VALUE[d.tone] || 'consultative',
      hookStyle: HOOK_STYLE_API_VALUE[d.hookStyle] || 'pain_based',
      followUpCadence: cleanText(d.followUpCadence, { max: 120 }),
      icpTitles: cleanList(d.titles),
      icpCompanySizes: cleanList(d.companySizes),
      icpTargetIndustries: cleanList(d.targetIndustries),
      icpGeos: cleanList(d.geos),
      meetingTarget: clampNumber(d.meetingTarget, { min: 1, max: 50, fallback: 15 }),
      dealSize: cleanText(d.dealSize, { max: 80 }),
      salesCycle: cleanText(d.salesCycle, { max: 80 }),
      agentName: cleanText(d.agentName, { max: 80 }) || 'GNX sales',
      bookingLink: bookingLink || undefined,
      tools: cleanList(d.tools),
    };
    if (!payload.firstName || !payload.company || !payload.productDescription || !payload.valueProp) {
      setLoading(false);
      setError('Complete the required onboarding fields before launch.');
      return;
    }
    try {
      const { data: result } = await api.post('/onboarding', payload, { timeout: 120000 });
      if (!result?.campaign?.id) {
        setLoading(false);
        setError('We saved your onboarding details, but could not prepare the first campaign. Please try again.');
        return;
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('gnx_onboarding_preparation', JSON.stringify(result.preparation || {}));
      }
      router.push(`/celebrate?campaignId=${encodeURIComponent(result.campaign.id)}`);
      return;
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err?.response?.data?.error || 'We could not prepare your first campaign. Please try again.');
      return;
    }
  };

  const pct = (step / (STEPS.length - 1)) * 100;
  const s = STEPS[step];

  const reviewRows = [
    { l: 'Name', v: [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Not provided' },
    { l: 'Company', v: d.company || 'Not provided' },
    { l: 'Role', v: d.role },
    { l: 'Industry', v: d.industry || 'Not provided' },
    { l: 'Product', v: d.productDescription || 'Not provided' },
    { l: 'Value prop', v: d.valueProp || 'Not provided' },
    { l: 'Pain points', v: d.painPoints || 'Not provided' },
    { l: 'Target titles', v: d.titles.join(', ') || 'Not provided' },
    { l: 'Target industries', v: d.targetIndustries.join(', ') || 'Not provided' },
    { l: 'Target market', v: d.companySizes.join(', ') || 'Not provided' },
    { l: 'Geographies', v: d.geos.join(', ') || 'Not provided' },
    { l: 'Meeting target', v: `${d.meetingTarget || 15} meetings / month` },
    { l: 'Deal size', v: d.dealSize || 'Not provided' },
    { l: 'Sales cycle', v: d.salesCycle || 'Not provided' },
    { l: 'Tone', v: d.tone },
    { l: 'Hook style', v: d.hookStyle },
    { l: 'Follow-up cadence', v: d.followUpCadence },
    { l: 'Tools', v: d.tools.join(', ') || 'Not provided' },
    { l: 'Agent name', v: d.agentName },
  ];

  return (
    <div className="screen onboarding-screen">
      {/* Left sidebar */}
      <div className="onboarding-sidebar" style={{
        background: 'linear-gradient(170deg,#06311f,#085c40)',
        color: '#fff', display: 'flex', flexDirection: 'column', padding: '32px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <Aurora />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo size={30} light />
          <div style={{ marginTop: 36 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.5)', marginBottom: 18, letterSpacing: '.06em', textTransform: 'uppercase' }}>Setup steps</div>
            <div className="col" style={{ gap: 4 }}>
              {STEPS.map((st, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={i} className="row" style={{ gap: 12, padding: '10px 10px', borderRadius: 12, background: active ? 'rgba(255,255,255,.12)' : 'transparent', cursor: done ? 'pointer' : 'default' }}
                    onClick={() => done && setStep(i)}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flex: 'none',
                      display: 'grid', placeItems: 'center',
                      background: done ? 'var(--g-500)' : active ? '#fff' : 'rgba(255,255,255,.12)',
                      color: done ? '#06231a' : active ? 'var(--ink)' : 'rgba(255,255,255,.5)',
                      fontSize: 12, fontWeight: 800,
                    }}>
                      {done ? <Icon name="check" size={14} color="#06231a" stroke={3} /> : i + 1}
                    </span>
                    <span className="nw" style={{ fontSize: 13.5, fontWeight: active ? 800 : 600, color: active ? '#fff' : done ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)' }}>
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <div style={{ height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: pct + '%', borderRadius: 99, background: 'linear-gradient(90deg,var(--g-400),var(--teal))', transition: 'width .4s ease' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.55)' }}>Step {step + 1} of {STEPS.length}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grow col" style={{ background: '#fff', minWidth: 0 }}>
        <div className="scroll grow onboarding-main-pad" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 0 }}>
          <div style={{ width: '100%', maxWidth: 860, animation: 'rise .35s both' }} key={step}>
            <div className="row" style={{ gap: 14, marginBottom: 28 }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--g-50)', border: '1px solid var(--g-100)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Icon name={s.ico} size={26} color="var(--g-600)" />
              </span>
              <div className="col">
                <h2 className="display" style={{ fontSize: 26 }}>{s.title}</h2>
                <p className="muted" style={{ fontSize: 14, marginTop: 3 }}>{s.sub}</p>
              </div>
            </div>

            {error && step !== 4 && (
              <div style={{ padding: '12px 16px', borderRadius: 'var(--r-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13.5, fontWeight: 600, marginBottom: 18 }}>
                {error}
              </div>
            )}

            {/* Step 0: Profile */}
            {step === 0 && (
              <div className="col" style={{ gap: 22 }}>
                <div className="onboarding-name-grid">
                  <Field label="First name" icon="user" placeholder="Maya" value={d.firstName} onChange={e => set('firstName', e.target.value)} />
                  <Field label="Last name" icon="user" placeholder="Collins" value={d.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
                <Field label="Company" icon="building" placeholder="Northwind Logistics" value={d.company} onChange={e => set('company', e.target.value)}
                  hint="Used to create your organization profile." />
                <OSearchSelect label="Your role" icon="user" value={d.role} onChange={v => set('role', v)} options={ROLES} placeholder="Select your role" />
                <OSearchSelect label="Industry" icon="target" value={d.industry} onChange={v => set('industry', v)} options={INDUSTRIES} capitalize placeholder="Select your industry"
                  hint="Helps GNX sales frame outreach around your market." />
              </div>
            )}

            {/* Step 1: Product */}
            {step === 1 && (
              <div className="col" style={{ gap: 22 }}>
                <OTextarea
                  label="What does your product do?"
                  rows={5}
                  placeholder="e.g. We build a sales engagement platform that helps B2B teams automate outbound prospecting, follow-up, and reply handling using AI."
                  value={d.productDescription}
                  onChange={e => set('productDescription', e.target.value)}
                  hint="This becomes the core context for email generation, replies, and campaign prompts."
                />
                <OTextarea
                  label="What measurable outcome do customers get?"
                  rows={5}
                  placeholder="e.g. Sales teams book more qualified meetings, reduce manual prospecting time, and keep follow-ups consistent without hiring extra SDRs."
                  value={d.valueProp}
                  onChange={e => set('valueProp', e.target.value)}
                  hint="Focus on business outcomes, not only features."
                />
                <OTextarea
                  label="Which buyer pains should outreach mention?"
                  rows={4}
                  placeholder="e.g. Low reply rates, stale lead lists, manual research, missed follow-ups, and SDR teams spending too much time writing first drafts."
                  value={d.painPoints}
                  onChange={e => set('painPoints', e.target.value)}
                  hint="These pains help GNX sales write stronger first lines and follow-ups."
                />
              </div>
            )}

            {/* Step 2: Ideal customer */}
            {step === 2 && (
              <div className="col" style={{ gap: 24 }}>
                <OMulti label="Job titles you target" hint="GNX sales will prioritize these roles in outreach."
                  options={['CEO / Founder', 'VP Sales', 'Head of Sales', 'Sales Manager', 'CTO', 'VP Marketing', 'RevOps / SalesOps', 'Director of Ops']}
                  value={d.titles} onChange={v => toggle('titles', v)} />
                <OMulti label="Target industries" hint="Use this to keep prospecting focused."
                  options={['B2B SaaS', 'IT Services', 'Marketing Agencies', 'Recruiting', 'Fintech', 'Healthcare', 'Manufacturing', 'Real Estate', 'E-commerce', 'Education']}
                  value={d.targetIndustries} onChange={v => toggle('targetIndustries', v)} />
                <OMulti label="Target company sizes"
                  options={['Startup (1-20)', 'SMB (21-200)', 'Mid-Market (201-1k)', 'Enterprise (1k+)']}
                  value={d.companySizes} onChange={v => toggle('companySizes', v)} />
                <OMulti label="Geographies"
                  options={['United States', 'North America', 'Europe', 'APAC', 'LATAM', 'Middle East', 'Global']}
                  value={d.geos} onChange={v => toggle('geos', v)} />
                <OSelect label="Typical deal size" value={d.dealSize} onChange={v => set('dealSize', v)}
                  options={['Under $5k', '$5k-$20k', '$20k-$50k', '$50k-$100k', '$100k+']} />
                <OSelect label="Typical sales cycle" value={d.salesCycle} onChange={v => set('salesCycle', v)}
                  options={['Less than 2 weeks', '2-4 weeks', '1-3 months', '3-6 months', '6+ months']} />
              </div>
            )}

            {/* Step 3: Outreach strategy */}
            {step === 3 && (
              <div className="col" style={{ gap: 24 }}>
                <div className="field">
                  <label>Monthly meeting target</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="50"
                    value={d.meetingTarget}
                    onChange={e => set('meetingTarget', e.target.value)}
                  />
                  <span className="faint" style={{ fontSize: 12.5 }}>Used as a realistic success target for campaigns and dashboard goals.</span>
                </div>
                <OSelect label="Writing tone" value={d.tone} onChange={v => set('tone', v)}
                  options={['Consultative', 'Direct & concise', 'Friendly & warm', 'Challenger', 'Formal']} />
                <OSelect label="Opening hook style" value={d.hookStyle} onChange={v => set('hookStyle', v)}
                  options={['Pain-based (problem-first)', 'Insight-based (data/trend)', 'Social proof (customer story)', 'Personalized signal (news/hire)', 'Question-led']} />
                <OSelect label="Follow-up cadence" value={d.followUpCadence} onChange={v => set('followUpCadence', v)}
                  options={['Day 0, Day 3, Day 7', 'Day 0, Day 2, Day 5', 'Day 0, Day 4, Day 10', 'Custom later']} />
                <OMulti label="Tools you already use" hint="Helps GNX sales understand the sales workflow it should fit into."
                  options={['Gmail', 'Lead database tool', 'HubSpot', 'Salesforce', 'Pipedrive', 'Slack', 'Google Calendar', 'Calendly / Cal.com']}
                  value={d.tools} onChange={v => toggle('tools', v)} />
              </div>
            )}

            {/* Step 4: Review & launch */}
            {step === 4 && (
              <div className="col" style={{ gap: 20 }}>
                <Field label="Agent name" icon="spark" placeholder="GNX sales" value={d.agentName} onChange={e => set('agentName', e.target.value)}
                  hint="What your AI agent is called inside the app." />
                <Field label="Booking link (optional)" icon="link" placeholder="https://cal.com/yourname"
                  value={d.bookingLink} onChange={e => set('bookingLink', e.target.value)}
                  hint="GNX sales will include this when a prospect is ready to book." />
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>Your setup summary</span>
                  </div>
                  {reviewRows.map((r, i) => (
                    <div key={i} className="row spread" style={{ padding: '11px 16px', borderBottom: i < reviewRows.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                      <span className="faint" style={{ fontSize: 13.5, fontWeight: 600 }}>{r.l}</span>
                      <span style={{ fontWeight: 700, fontSize: 13.5, textAlign: 'right', maxWidth: 300, color: 'var(--ink-2)' }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                {error && (
                  <div style={{ padding: '12px 16px', borderRadius: 'var(--r-md)', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13.5, fontWeight: 600 }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div className="row spread onboarding-footer-nav" style={{ borderTop: '1px solid var(--line)', flex: 'none' }}>
          <button className="btn btn-ghost" onClick={back} disabled={loading}>
            <Icon name="arrowLeft" size={17} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary btn-lg" onClick={continueStep}>
              Continue <Icon name="arrow" size={18} color="#06231a" />
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={launch} disabled={loading}
              style={{ background: 'linear-gradient(135deg,var(--g-400),var(--teal))', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Launching…' : <><Icon name="bolt" size={18} color="#06231a" /> Launch my agent</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
