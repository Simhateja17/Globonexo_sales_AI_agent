// Onboarding flow model: which steps a channel choice needs, what each step
// requires, the live preview text, and the payload sent to POST /onboarding.
// Pure functions only, so the page stays a thin view over this.
import { cleanList, cleanText, normalizeUrl } from './validation';
import {
  CADENCES, CALL_GOALS, COMPANY_SIZES, DO_NOT_CALL, HOOKS, MAX_EMAILS, TONES, VOICES, defaultObjections,
} from './onboarding-data';

export const DRAFT_KEY = 'gnx_onboarding_draft_v2';
export const CHANNEL_KEY = 'gnx_onboarding_channels';
export const PRODUCT_MIN = 20;
export const OUTCOME_MIN = 10;

export const DEFAULTS = {
  channels: 'both',
  firstName: '',
  lastName: '',
  company: '',
  role: 'Founder / CEO',
  industry: '',
  agentName: 'Nexo',
  productDescription: '',
  valueProp: '',
  pains: [],
  customPains: [],
  titles: [],
  targetIndustries: [],
  companySizes: [],
  geos: [],
  dealSize: '',
  salesCycle: '',
  tone: 'friendly',
  customTone: '',
  hook: 'personal',
  customHook: '',
  cadence: 'balanced',
  customGaps: [2, 5, 7],
  emailRules: 'Keep every email under 90 words.\nNever mention pricing in the first email.',
  meetingTarget: 15,
  tools: [],
  voice: 'warm',
  // A Retell voice picked from GET /voice/voices. Empty means the style above.
  voiceId: '',
  voiceName: '',
  callLanguage: 'English',
  openingLine: '',
  callGoal: 'meeting',
  customGoal: '',
  objections: null,
  callDays: [1, 2, 3, 4, 5],
  maxAttempts: 3,
  callsPerHour: 5,
  callRules: 'Keep calls under 3 minutes.\nNever quote exact prices on the call.',
  bookingLink: '',
  practiceCallsFirst: true,
  permissionConfirmed: false,
  // Which suggestion sets were already applied, so revisiting a step never
  // overwrites what the user changed.
  seeded: {},
};

export const hasEmail = channels => channels !== 'voice';
export const hasVoice = channels => channels !== 'email';

const STEP_LABELS = {
  profile: 'Profile', product: 'Product', audience: 'Ideal customer', email: 'Email style', voice: 'Call style', launch: 'Launch',
};

/** Numbered steps after the channel choice. */
export function stepsFor(channels) {
  const ids = ['profile', 'product', 'audience'];
  if (hasEmail(channels)) ids.push('email');
  if (hasVoice(channels)) ids.push('voice');
  ids.push('launch');
  return ids.map(id => ({ id, label: STEP_LABELS[id] }));
}

export function capitalize(value) {
  const text = String(value || '');
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

export function joinList(items, max = 3) {
  const list = items.filter(Boolean);
  if (list.length === 0) return '';
  if (list.length > max) return `${list.slice(0, max).join(', ')} and ${list.length - max} more`;
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

export function textLength(value) {
  return cleanText(value, { max: 4000, multiline: true }).length;
}

/** How specific the product answer is, for the meter on the Product step. */
export function productStrength(description) {
  const text = cleanText(description, { max: 4000, multiline: true });
  const words = text ? text.split(/\s+/).length : 0;
  if (text.length < PRODUCT_MIN) return { level: 1, label: 'Too short', note: 'Say who it is for and what it handles. One or two sentences is enough.' };
  if (text.length < 70 || words < 12) return { level: 2, label: 'Getting there', note: 'Saying who it is for and what it handles lifts this to Strong.' };
  return { level: 3, label: 'Strong', note: 'Specific enough for Nexo to write emails that sound like you.' };
}

export function allPains(d) {
  return [...d.pains, ...d.customPains.filter(p => !d.pains.includes(p))];
}

/** The follow-up gaps (days after the previous email) for the chosen cadence. */
export function followUpGaps(d) {
  if (d.cadence === 'custom') return d.customGaps.slice(0, MAX_EMAILS - 1).map(n => Math.min(30, Math.max(1, Math.round(Number(n) || 1))));
  return (CADENCES.find(c => c.id === d.cadence) || CADENCES[1]).gaps;
}

/** Cumulative send days, e.g. gaps [3, 4] -> [0, 3, 7]. */
export function cadenceDays(gaps) {
  return gaps.reduce((days, gap) => [...days, days[days.length - 1] + gap], [0]);
}

export function sizeSummary(keys) {
  const picked = COMPANY_SIZES.filter(s => keys.includes(s.key));
  if (picked.length === 0) return 'Any size';
  const min = Math.min(...picked.map(s => s.min));
  const max = picked.some(s => s.max === null) ? null : Math.max(...picked.map(s => s.max));
  return max === null ? `${min.toLocaleString('en-US')}+` : `${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}`;
}

export function objectionsFor(d) {
  return d.objections || defaultObjections(d.firstName);
}

/** Objections with both sides filled in, the ones Nexo can actually use. */
export function usableObjections(d) {
  return objectionsFor(d).filter(o => cleanText(o.q, { max: 200 }) && cleanText(o.a, { max: 600 }));
}

export function defaultOpeningLine(d) {
  const product = cleanText(d.productDescription, { max: 400 });
  const firstSentence = product.split(/(?<=[.!?])\s/)[0] || '';
  const pitch = firstSentence || `${d.company || 'We'} help teams like yours save time every week.`;
  return `${pitch.replace(/[.!?]?$/, '.')} Do you have two minutes?`;
}

// ---------------------------------------------------------------- validation

/** The first problem on a step, as a sentence the user can act on. */
export function validateStep(id, d) {
  if (id === 'profile') {
    if (!cleanText(d.firstName, { max: 80 })) return 'Enter your first name.';
    if (!cleanText(d.company, { max: 160 })) return 'Enter your company name.';
    if (!cleanText(d.role, { max: 80 })) return 'Pick your role.';
    if (!cleanText(d.industry, { max: 120 })) return 'Pick your industry so Nexo can pre-write the next steps.';
    if (!cleanText(d.agentName, { max: 40 })) return 'Give your AI agent a name.';
  }
  if (id === 'product') {
    const productLen = textLength(d.productDescription);
    const outcomeLen = textLength(d.valueProp);
    if (productLen < PRODUCT_MIN) return `Tell us a bit more about what ${d.company || 'your company'} does (at least ${PRODUCT_MIN} characters, you have ${productLen}).`;
    if (outcomeLen < OUTCOME_MIN) return `Add what changes for customers (at least ${OUTCOME_MIN} characters, you have ${outcomeLen}).`;
  }
  if (id === 'audience') {
    if (d.titles.length === 0) return 'Add at least one job title to reach.';
    if (d.companySizes.length === 0) return 'Pick at least one company size.';
    if (d.geos.length === 0) return 'Add at least one location.';
  }
  if (id === 'email') {
    if (d.tone === 'custom' && !cleanText(d.customTone, { max: 500 })) return 'Describe the tone you want, or pick one of the tones.';
    if (d.hook === 'custom' && !cleanText(d.customHook, { max: 500 })) return 'Describe how the first email should open, or pick an option.';
  }
  if (id === 'voice') {
    if (!cleanText(d.openingLine, { max: 600 }) && !defaultOpeningLine(d)) return 'Add why you are calling.';
    if (d.callGoal === 'custom' && !cleanText(d.customGoal, { max: 500 })) return 'Describe what a good call looks like, or pick an option.';
    if (d.callDays.length === 0) return 'Pick at least one day Nexo can call.';
  }
  if (id === 'launch') {
    if (hasVoice(d.channels) && !d.permissionConfirmed) return 'Confirm you are allowed to call these contacts to launch.';
    try { normalizeUrl(d.bookingLink); } catch { return 'Enter a valid booking link or leave it blank.'; }
  }
  return '';
}

// ------------------------------------------------------------------- payload

export function buildPayload(d) {
  const toneDef = TONES.find(t => t.id === d.tone) || TONES[0];
  const hookDef = HOOKS.find(h => h.id === d.hook) || HOOKS[0];
  const email = hasEmail(d.channels);
  const voice = hasVoice(d.channels);
  const objections = voice ? [...usableObjections(d), DO_NOT_CALL] : [];
  return {
    firstName: cleanText(d.firstName, { max: 80 }),
    lastName: cleanText(d.lastName, { max: 80 }),
    company: cleanText(d.company, { max: 160 }),
    role: cleanText(d.role, { max: 80 }),
    industry: cleanText(d.industry, { max: 120 }),
    agentName: cleanText(d.agentName, { max: 40 }) || 'Nexo',
    productDescription: cleanText(d.productDescription, { max: 4000, multiline: true }),
    valueProp: cleanText(d.valueProp, { max: 2000, multiline: true }),
    painPoints: cleanText(allPains(d).join('; '), { max: 2000 }),
    tone: toneDef.custom ? 'consultative' : toneDef.id,
    hookStyle: hookDef.api,
    followUpCadence: cadenceDays(followUpGaps(d)).map(n => `Day ${n}`).join(', '),
    icpTitles: cleanList(d.titles),
    icpCompanySizes: cleanList(d.companySizes),
    icpTargetIndustries: cleanList(d.targetIndustries, { maxItems: 40 }),
    icpGeos: cleanList(d.geos, { maxItems: 60 }),
    meetingTarget: Math.min(50, Math.max(1, Math.round(Number(d.meetingTarget) || 15))),
    dealSize: cleanText(d.dealSize, { max: 80 }),
    salesCycle: cleanText(d.salesCycle, { max: 80 }),
    bookingLink: normalizeUrl(d.bookingLink) || undefined,
    tools: cleanList(d.tools),
    ...(voice ? { objections: objections.map(o => `"${cleanText(o.q, { max: 200 })}" -> ${cleanText(o.a, { max: 600 })}`).join('\n') } : {}),
    preferences: {
      channels: d.channels,
      ...(email && toneDef.custom ? { customTone: cleanText(d.customTone, { max: 500 }) } : {}),
      ...(email && hookDef.custom ? { customHook: cleanText(d.customHook, { max: 500 }) } : {}),
      ...(email ? { followUpGaps: followUpGaps(d), emailRules: cleanText(d.emailRules, { max: 2000, multiline: true }) } : {}),
      ...(voice ? {
        voice: {
          voice: d.voice,
          ...(d.voiceId ? { voiceId: d.voiceId, voiceName: cleanText(d.voiceName, { max: 80 }) } : {}),
          language: d.callLanguage,
          openingLine: cleanText(d.openingLine, { max: 600, multiline: true }) || defaultOpeningLine(d),
          goal: d.callGoal,
          ...(d.callGoal === 'custom' ? { customGoal: cleanText(d.customGoal, { max: 500 }) } : {}),
          callDays: [...d.callDays].sort((a, b) => a - b),
          maxAttempts: d.maxAttempts,
          callsPerHour: d.callsPerHour,
          rules: cleanText(d.callRules, { max: 2000, multiline: true }),
          practiceCallsFirst: d.practiceCallsFirst,
          permissionConfirmed: d.permissionConfirmed,
        },
      } : {}),
    },
  };
}

/** Rebuild the form from a saved agent config, for people editing their setup. */
export function fromServer(config) {
  if (!config || typeof config !== 'object') return null;
  const prefs = config.onboarding_preferences || {};
  const voicePrefs = prefs.voice || {};
  const toneId = prefs.customTone ? 'custom' : (TONES.find(t => t.id === config.tone)?.id || DEFAULTS.tone);
  const hook = prefs.customHook ? 'custom' : (HOOKS.find(h => !h.custom && h.api === config.hook_style)?.id || DEFAULTS.hook);
  const gaps = Array.isArray(prefs.followUpGaps) ? prefs.followUpGaps : null;
  const preset = gaps && CADENCES.find(c => c.gaps && c.gaps.join() === gaps.join());
  const objections = String(config.objections || '').split('\n').map(line => line.match(/^"(.+)" -> (.+)$/)).filter(Boolean)
    .map(([, q, a]) => ({ q, a })).filter(o => o.q !== DO_NOT_CALL.q);
  const pains = String(config.pain_points || '').split(';').map(p => p.trim()).filter(Boolean);
  return {
    ...DEFAULTS,
    channels: ['email', 'voice', 'both'].includes(prefs.channels) ? prefs.channels : DEFAULTS.channels,
    firstName: config.first_name || '',
    lastName: config.last_name || '',
    company: config.company || '',
    role: config.role || DEFAULTS.role,
    industry: config.industry || '',
    agentName: config.agent_name || DEFAULTS.agentName,
    productDescription: config.product_description || '',
    valueProp: config.value_proposition || '',
    pains: pains.length > 1 || (pains[0] || '').length < 60 ? pains : [],
    customPains: [],
    titles: config.icp_titles || [],
    targetIndustries: config.icp_target_industries || [],
    companySizes: (config.icp_company_sizes || []).filter(k => COMPANY_SIZES.some(s => s.key === k)),
    geos: config.icp_geos || [],
    dealSize: config.deal_size || '',
    salesCycle: config.sales_cycle || '',
    tone: toneId,
    customTone: prefs.customTone || '',
    hook,
    customHook: prefs.customHook || '',
    cadence: gaps ? (preset ? preset.id : 'custom') : DEFAULTS.cadence,
    customGaps: gaps && !preset ? gaps : DEFAULTS.customGaps,
    emailRules: prefs.emailRules ?? DEFAULTS.emailRules,
    meetingTarget: config.meeting_target || 15,
    tools: config.tools || [],
    voice: VOICES.some(v => v.id === voicePrefs.voice) ? voicePrefs.voice : DEFAULTS.voice,
    voiceId: voicePrefs.voiceId || '',
    voiceName: voicePrefs.voiceName || '',
    callLanguage: voicePrefs.language || DEFAULTS.callLanguage,
    openingLine: voicePrefs.openingLine || '',
    callGoal: CALL_GOALS.some(g => g.id === voicePrefs.goal) ? voicePrefs.goal : DEFAULTS.callGoal,
    customGoal: voicePrefs.customGoal || '',
    objections: objections.length ? objections : null,
    callDays: Array.isArray(voicePrefs.callDays) && voicePrefs.callDays.length ? voicePrefs.callDays : DEFAULTS.callDays,
    maxAttempts: voicePrefs.maxAttempts || DEFAULTS.maxAttempts,
    callsPerHour: voicePrefs.callsPerHour || DEFAULTS.callsPerHour,
    callRules: voicePrefs.rules ?? DEFAULTS.callRules,
    bookingLink: config.booking_link || '',
    practiceCallsFirst: voicePrefs.practiceCallsFirst ?? true,
    permissionConfirmed: voicePrefs.permissionConfirmed === true,
    seeded: { product: true, pains: true, audience: true },
  };
}

// ------------------------------------------------------------------ previews

const SAMPLE_LEAD = 'Alex';

function firstPain(d, i = 0) {
  const pains = allPains(d);
  return (pains[i] || '').toLowerCase();
}

function audienceIndustry(d) {
  return (d.targetIndustries[0] || d.industry || '').toLowerCase();
}

/** Who the sample email goes to, e.g. "Owner, 11 to 200 person retail business". */
export function sampleRecipient(d) {
  const title = d.titles[0] || 'Founder';
  const industry = audienceIndustry(d);
  const size = d.companySizes.length ? ` (${sizeSummary(d.companySizes)} people)` : '';
  return `${SAMPLE_LEAD}, ${title}${industry ? ` at a ${industry} business${size}` : ''}`;
}

/** Sample opening line and subject for each tone, using the user's own answers. */
export function toneSample(toneId, d) {
  const company = d.company || 'our team';
  const pain = firstPain(d) || 'slow manual work';
  const samples = {
    consultative: { line: `Curious how your team handles ${pain} today?`, subject: `A question about ${pain}`, ask: 'Would it help to compare notes for 15 minutes?' },
    direct: { line: `${company} fixes ${pain}. Worth 15 minutes?`, subject: 'Quick idea, 15 minutes', ask: 'Free for 15 minutes on Thursday?' },
    friendly: { line: 'Hope your week is off to a good start!', subject: `Quick hello from ${company}`, ask: 'Happy to show you around in 15 minutes, whenever suits you.' },
    challenger: { line: `Most teams lose more to ${pain} than they realise.`, subject: `The real cost of ${pain}`, ask: 'Worth 15 minutes to check if it applies to you?' },
    formal: { line: `I am writing to introduce ${company}.`, subject: `Introducing ${company}`, ask: 'May I request 15 minutes of your time this week?' },
    custom: { line: 'Describe your own tone in a sentence.', subject: `An idea from ${company}`, ask: 'Open to a quick 15-minute look this week?' },
  };
  return samples[toneId] || samples.consultative;
}

/** The line after the greeting, set by "How the first email opens". */
export function hookLine(hookId, d) {
  const pain = firstPain(d) || 'slow manual work';
  const pain2 = firstPain(d, 1);
  const industry = audienceIndustry(d) || 'businesses like yours';
  const lines = {
    problem: `Teams like yours often run into ${pain}${pain2 ? ` and ${pain2}` : ''}.`,
    personal: 'Saw your team has grown over the last few months, congratulations.',
    insight: `More ${industry} teams are rethinking how they deal with ${pain} this year.`,
    story: `We recently helped a ${industry} business like yours get on top of ${pain}.`,
    question: `Is ${pain} something your team deals with?`,
    custom: '(Your own opening goes here. Press Generate to see it written.)',
  };
  return lines[hookId] || lines.problem;
}

function sentence(text) {
  const clean = cleanText(text, { max: 600 });
  return clean ? clean.replace(/[.!?]?$/, '.') : '';
}

/**
 * Email 1 as Nexo would write it for a sample lead. Segments marked `mark`
 * come straight from the user's answers; `weak` marks an answer that is too
 * thin to write a specific email from.
 */
export function sampleEmail(d) {
  const tone = toneSample(d.tone, d);
  const productWeak = textLength(d.productDescription) < PRODUCT_MIN;
  const opener = d.tone === 'custom' && d.customTone ? null : tone.line;
  const body = [
    opener ? [{ text: opener, mark: true }] : [],
    [{ text: hookLine(d.hook, d), mark: d.hook !== 'custom' }],
    [
      { text: sentence(d.productDescription) || `${d.company || 'We'} help teams like yours.`, mark: true, weak: productWeak },
      { text: ' ' },
      { text: sentence(d.valueProp) || 'Customers save time every week.', mark: !!d.valueProp },
    ],
    [{ text: tone.ask }],
  ].filter(p => p.length);
  const words = body.flat().map(s => s.text).join(' ').split(/\s+/).filter(Boolean).length;
  return {
    to: sampleRecipient(d),
    subject: tone.subject,
    greeting: `Hi ${SAMPLE_LEAD},`,
    body,
    signoff: d.firstName || 'You',
    words,
  };
}

/**
 * Follow-up `n` (2 = the first follow-up) for the same sample lead. Each one
 * is shorter than email 1, adds one new angle, and the last offers to step back.
 */
export function sampleFollowUp(d, n, last) {
  const tone = toneSample(d.tone, d);
  const pain = firstPain(d) || 'slow manual work';
  const company = d.company || 'our team';
  const value = sentence(d.valueProp);
  const angles = [
    [[{ text: `Following up on my note about ${pain}.`, mark: true }], [{ text: value || `${company} takes most of that work off your plate.`, mark: !!value }]],
    [[{ text: `One thing I left out: teams usually notice the difference with ${pain} within the first few weeks.`, mark: true }]],
    [[{ text: `Thought this might be useful even if now is not the right time.` }], [{ text: `Most teams we talk to try to fix ${pain} by hand first, and it rarely sticks.`, mark: true }]],
  ];
  const body = last
    ? [
      [{ text: `I have reached out a few times about ${pain}, so I will step back after this one.`, mark: true }],
      [{ text: 'If it ever becomes a priority, just reply to this email and I will pick it up.' }],
    ]
    : [...angles[(n - 2) % angles.length], [{ text: tone.ask }]];
  const words = body.flat().map(s => s.text).join(' ').split(/\s+/).filter(Boolean).length;
  return {
    to: sampleRecipient(d),
    subject: `Re: ${tone.subject}`,
    greeting: `Hi ${SAMPLE_LEAD},`,
    body,
    signoff: d.firstName || 'You',
    words,
  };
}

/** A sample call, built from the call style answers. */
export function sampleCall(d) {
  const agent = cleanText(d.agentName, { max: 40 }) || 'Nexo';
  const who = d.firstName || 'our team';
  const company = d.company || 'our company';
  const objection = usableObjections(d)[0];
  const opening = cleanText(d.openingLine, { max: 600, multiline: true }) || defaultOpeningLine(d);
  const close = d.callGoal === 'interest'
    ? { text: `Would it be okay if ${who} followed up by email with a few details?`, mark: true }
    : d.callGoal === 'custom'
      ? { text: d.customGoal ? `(Nexo steers the call toward your goal: ${d.customGoal})` : '(Nexo steers the call toward the goal you describe.)', mark: true }
      : { text: `${who} can show you how it works in 15 minutes. Thursday at 11 or Friday at 3?`, mark: true };
  return [
    { from: 'n', text: [{ text: `Hi, is this ${SAMPLE_LEAD}? This is ${agent}, an AI assistant calling on behalf of ${who} at ${company}.` }] },
    { from: 'l', text: [{ text: 'Yes, speaking.' }] },
    { from: 'n', text: [{ text: opening, mark: true }] },
    ...(objection ? [
      { from: 'l', text: [{ text: objection.q }] },
      { from: 'n', text: [{ text: objection.a, mark: true }] },
    ] : []),
    { from: 'l', text: [{ text: 'Honestly, it has been on my list.' }] },
    { from: 'n', text: [close] },
  ];
}

/** "Owners and founders at retail and restaurant businesses with 11 to 200 employees in India." */
export function audienceSentence(d) {
  const titles = joinList(d.titles, 4) || 'Decision makers';
  const industries = joinList(d.targetIndustries.map(i => i.toLowerCase()), 3);
  const size = d.companySizes.length ? ` with ${sizeSummary(d.companySizes)} employees` : '';
  const where = d.geos.length ? ` in ${joinList(d.geos, 3)}` : '';
  return [
    { text: titles, mark: true },
    { text: ' at ' },
    { text: industries ? `${industries} businesses` : 'businesses in any industry', mark: !!industries },
    ...(size ? [{ text: ' with ' }, { text: `${sizeSummary(d.companySizes)} employees`, mark: true }] : []),
    ...(where ? [{ text: ' in ' }, { text: joinList(d.geos, 3), mark: true }] : []),
    { text: '.' },
  ];
}

export function callDaysSummary(days) {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.join() === '1,2,3,4,5') return 'Weekdays';
  if (sorted.length === 7) return 'Every day';
  const names = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  return sorted.map(n => names[n]).join(', ');
}

// --------------------------------------------------------------- draft store

export function readDraft(storage) {
  try {
    const raw = storage?.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.data) return null;
    return { step: typeof parsed.step === 'string' ? parsed.step : 'channel', data: { ...DEFAULTS, ...parsed.data } };
  } catch {
    return null;
  }
}

export function writeDraft(storage, step, data) {
  try {
    storage?.setItem(DRAFT_KEY, JSON.stringify({ step, data }));
  } catch {
    // Private windows and full storage: the draft is a convenience only.
  }
}

export function clearDraft(storage) {
  try { storage?.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

// ------------------------------------------------- after onboarding: reuse

/** Same wording as the backend's buildWritingNotes, so new campaigns read like the first one. */
export function writingNotes(prefs = {}) {
  return [
    prefs.customTone ? `Tone, in the sender's words: ${prefs.customTone}` : '',
    prefs.customHook ? `How the first email should open: ${prefs.customHook}` : '',
    prefs.emailRules ? `Rules the sender set (always follow them):\n${prefs.emailRules}` : '',
  ].filter(Boolean);
}

/** Same wording as the backend's buildCallNotes. */
export function callNotes(voice) {
  if (!voice) return [];
  const goal = voice.goal === 'interest'
    ? 'A good call ends with the person agreeing that the sender can follow up. Do not push for a meeting.'
    : voice.goal === 'custom' && voice.customGoal
      ? `What a good call achieves, in the sender's words: ${voice.customGoal}`
      : voice.goal === 'meeting' ? 'A good call ends with a booked meeting.' : '';
  return [
    voice.openingLine ? `After the AI introduction, explain the reason for calling like this: ${voice.openingLine}` : '',
    goal,
    voice.language && voice.language !== 'English' ? `Preferred call language: ${voice.language}.` : '',
    voice.rules ? `Rules the sender set for calls (always follow them):\n${voice.rules}` : '',
  ].filter(Boolean);
}

/**
 * Starting values for a new campaign from the saved onboarding answers:
 * campaign notes for the channel, call settings for voice, and the email
 * follow-up delays. Null fields mean "keep the page default".
 */
export function campaignDefaultsFromConfig(config, channel) {
  const prefs = config?.onboarding_preferences || {};
  const voice = prefs.voice || {};
  const notes = (channel === 'voice' ? callNotes(prefs.voice) : writingNotes(prefs)).join('\n\n').slice(0, 2000);
  const days = Array.isArray(voice.callDays) && voice.callDays.length ? [...new Set(voice.callDays)].sort((a, b) => a - b) : null;
  return {
    promptNotes: notes,
    callCadencePerHour: voice.callsPerHour || null,
    maxCallAttempts: voice.maxAttempts || null,
    allowedWeekdays: days,
    simulationEnabled: typeof voice.practiceCallsFirst === 'boolean' ? voice.practiceCallsFirst : null,
    stepDelays: Array.isArray(prefs.followUpGaps) && prefs.followUpGaps.length ? [0, ...prefs.followUpGaps] : null,
  };
}

/** What the Settings "Outreach style" section saves through PUT /onboarding/style. */
export function buildStylePayload(d) {
  const payload = buildPayload({ ...d, channels: 'both', bookingLink: '' });
  return {
    hookStyle: payload.hookStyle,
    followUpCadence: payload.followUpCadence,
    objections: payload.objections,
    preferences: {
      ...payload.preferences,
      channels: d.channels,
      customTone: cleanText(d.customTone, { max: 500 }),
      customHook: d.hook === 'custom' ? cleanText(d.customHook, { max: 500 }) : '',
    },
  };
}

/** The request for POST /onboarding/preview-email, from the current answers. */
export function buildPreviewRequest(d) {
  const toneDef = TONES.find(t => t.id === d.tone) || TONES[0];
  const hookDef = HOOKS.find(h => h.id === d.hook) || HOOKS[0];
  return {
    company: cleanText(d.company, { max: 160 }),
    senderName: cleanText(d.firstName, { max: 80 }),
    senderRole: cleanText(d.role, { max: 80 }),
    industry: cleanText(d.industry, { max: 120 }),
    productDescription: cleanText(d.productDescription, { max: 2000, multiline: true }),
    valueProp: cleanText(d.valueProp, { max: 2000, multiline: true }),
    painPoints: cleanText(allPains(d).slice(0, 4).join('; '), { max: 2000 }),
    recipientTitle: cleanText(d.titles[0] || '', { max: 120 }),
    recipientIndustry: cleanText((d.targetIndustries[0] || d.industry || '').toLowerCase(), { max: 120 }),
    tone: toneDef.custom ? 'consultative' : toneDef.id,
    customTone: toneDef.custom ? cleanText(d.customTone, { max: 500 }) : '',
    hookStyle: hookDef.api,
    customHook: hookDef.custom ? cleanText(d.customHook, { max: 500 }) : '',
    emailRules: cleanText(d.emailRules, { max: 2000, multiline: true }),
  };
}
