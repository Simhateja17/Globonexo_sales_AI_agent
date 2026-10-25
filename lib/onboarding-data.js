// Static choices for the onboarding flow. Industry values keep Apollo's
// lowercase form so they match lead searches; the UI capitalizes them.

// Apollo's seniority levels and department titles, so the role matches how
// leads are filtered when searching Apollo.
export const ROLES = [
  'Owner', 'Founder', 'Founder / CEO', 'Co-Founder', 'Partner', 'C-Suite', 'CEO', 'COO', 'CFO', 'CTO', 'CMO', 'CRO', 'CIO', 'CISO', 'CPO', 'CHRO',
  'President', 'Managing Director', 'General Manager',
  'VP of Sales', 'VP of Marketing', 'VP of Engineering', 'VP of Product', 'VP of Operations', 'VP of Finance', 'VP of Customer Success', 'VP of HR',
  'Head of Sales', 'Head of Marketing', 'Head of Growth', 'Head of Product', 'Head of Engineering', 'Head of Operations', 'Head of Partnerships',
  'Sales Director', 'Marketing Director', 'Director of Business Development', 'Director of Operations', 'Director of Engineering', 'Director of Product', 'Director of Finance', 'Director of HR', 'Director of IT',
  'Account Executive', 'Senior Account Executive', 'SDR / BDR', 'Sales Manager', 'Business Development Manager', 'Account Manager', 'Key Account Manager', 'Sales Engineer', 'Sales Operations / RevOps',
  'Marketing', 'Marketing Manager', 'Demand Generation Manager', 'Growth Manager', 'Content Marketing Manager', 'Product Marketing Manager', 'Brand Manager', 'Digital Marketing Manager',
  'Customer Success Manager', 'Customer Support Manager', 'Partnerships Manager', 'Operations Manager', 'Project Manager', 'Product Manager', 'Program Manager',
  'Engineering Manager', 'Software Engineer', 'Data Analyst', 'Designer', 'IT Manager',
  'Finance Manager', 'HR Manager', 'Recruiter / Talent Acquisition', 'Legal Counsel',
  'Consultant', 'Freelancer', 'Agency Owner', 'Senior Individual Contributor',
];

export const QUICK_ROLES = ['Founder / CEO', 'Account Executive', 'SDR / BDR', 'Sales Manager', 'Head of Sales', 'Marketing'];

export const INDUSTRIES = [
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
  'wine & spirits', 'wireless', 'writing & editing',
];

/** Industry picker groups on the Ideal customer step. */
export const INDUSTRY_GROUPS = [
  { label: 'Retail & consumer', items: ['retail', 'supermarkets', 'restaurants', 'food & beverages', 'apparel & fashion', 'consumer goods', 'consumer electronics', 'cosmetics', 'luxury goods & jewelry', 'sporting goods', 'furniture', 'wholesale', 'wine & spirits', 'hospitality'] },
  { label: 'Software & internet', items: ['computer software', 'internet', 'information technology & services', 'computer & network security', 'e-learning', 'online media', 'telecommunications', 'computer games'] },
  { label: 'Finance & insurance', items: ['financial services', 'banking', 'insurance', 'accounting', 'investment management', 'capital markets', 'venture capital & private equity'] },
  { label: 'Health & wellness', items: ['hospital & health care', 'medical practice', 'medical devices', 'pharmaceuticals', 'health, wellness & fitness', 'mental health care', 'veterinary'] },
  { label: 'Industrial', items: ['mechanical or industrial engineering', 'machinery', 'automotive', 'industrial automation', 'chemicals', 'electrical/electronic manufacturing', 'packaging & containers', 'plastics'] },
  { label: 'Logistics & transport', items: ['logistics & supply chain', 'warehousing', 'package/freight delivery', 'transportation/trucking/railroad', 'import & export', 'maritime', 'airlines/aviation'] },
  { label: 'Property & construction', items: ['real estate', 'commercial real estate', 'construction', 'architecture & planning', 'building materials', 'facilities services'] },
  { label: 'Services & agencies', items: ['marketing & advertising', 'management consulting', 'staffing & recruiting', 'legal services', 'design', 'events services', 'public relations & communications'] },
  { label: 'Education & public', items: ['higher education', 'primary/secondary education', 'education management', 'non-profit organization management', 'government administration'] },
];

/** Apollo employee ranges ("min,max"), passed straight through to lead search. */
export const COMPANY_SIZES = [
  { key: '1,10', label: '1 to 10', sub: 'Micro', min: 1, max: 10 },
  { key: '11,50', label: '11 to 50', sub: 'Small', min: 11, max: 50 },
  { key: '51,200', label: '51 to 200', sub: 'Growing', min: 51, max: 200 },
  { key: '201,1000', label: '201 to 1,000', sub: 'Mid-market', min: 201, max: 1000 },
  { key: '1001,', label: '1,000+', sub: 'Enterprise', min: 1001, max: null },
];

const EU = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'];

/** Quick-add regions expand into the countries lead search understands. */
export const REGIONS = [
  { label: 'GCC countries', places: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'] },
  { label: 'Southeast Asia', places: ['Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines'] },
  { label: 'South Asia', places: ['India', 'Sri Lanka', 'Bangladesh', 'Nepal', 'Pakistan'] },
  { label: 'North America', places: ['United States', 'Canada'] },
  { label: 'United Kingdom & Ireland', places: ['United Kingdom', 'Ireland'] },
  { label: 'European Union', places: EU },
  { label: 'DACH', places: ['Germany', 'Austria', 'Switzerland'] },
  { label: 'Nordics', places: ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland'] },
  { label: 'Australia & NZ', places: ['Australia', 'New Zealand'] },
  { label: 'LATAM', places: ['Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru'] },
  { label: 'Africa', places: ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana'] },
];

export const POPULAR_CITIES = ['Bengaluru', 'Mumbai', 'Dubai', 'London', 'New York', 'San Francisco', 'Toronto'];
export const POPULAR_COUNTRIES = ['United States', 'United Kingdom', 'Saudi Arabia', 'Malaysia', 'Australia', 'Canada', 'Germany'];

const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru',
  'United Kingdom', 'Ireland', ...EU.filter(c => c !== 'Ireland'), 'Switzerland', 'Norway', 'Iceland',
  'India', 'Sri Lanka', 'Bangladesh', 'Nepal', 'Pakistan', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines',
  'Japan', 'South Korea', 'China', 'Hong Kong', 'Taiwan', 'Australia', 'New Zealand',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Israel', 'Turkey',
  'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana',
];

const CITIES = [
  ['Bengaluru', 'Karnataka, India'], ['Mumbai', 'Maharashtra, India'], ['Delhi', 'India'], ['Hyderabad', 'Telangana, India'], ['Chennai', 'Tamil Nadu, India'], ['Pune', 'Maharashtra, India'], ['Kolkata', 'West Bengal, India'], ['Ahmedabad', 'Gujarat, India'],
  ['Dubai', 'United Arab Emirates'], ['Abu Dhabi', 'United Arab Emirates'], ['Riyadh', 'Saudi Arabia'], ['Jeddah', 'Saudi Arabia'], ['Doha', 'Qatar'],
  ['Singapore', 'Singapore'], ['Kuala Lumpur', 'Malaysia'], ['Jakarta', 'Indonesia'], ['Bangkok', 'Thailand'], ['Manila', 'Philippines'], ['Ho Chi Minh City', 'Vietnam'],
  ['London', 'England, United Kingdom'], ['Manchester', 'England, United Kingdom'], ['Dublin', 'Ireland'], ['Paris', 'France'], ['Berlin', 'Germany'], ['Munich', 'Germany'], ['Amsterdam', 'Netherlands'], ['Madrid', 'Spain'], ['Barcelona', 'Spain'], ['Stockholm', 'Sweden'], ['Zurich', 'Switzerland'],
  ['New York', 'New York, United States'], ['San Francisco', 'California, United States'], ['San Francisco Bay Area', 'United States', 'Metro area'], ['Los Angeles', 'California, United States'], ['Chicago', 'Illinois, United States'], ['Austin', 'Texas, United States'], ['Boston', 'Massachusetts, United States'], ['Seattle', 'Washington, United States'], ['Miami', 'Florida, United States'],
  ['Toronto', 'Ontario, Canada'], ['Vancouver', 'British Columbia, Canada'], ['Sydney', 'New South Wales, Australia'], ['Melbourne', 'Victoria, Australia'], ['Auckland', 'New Zealand'],
  ['São Paulo', 'Brazil'], ['Mexico City', 'Mexico'], ['Lagos', 'Nigeria'], ['Nairobi', 'Kenya'], ['Cape Town', 'South Africa'], ['Johannesburg', 'South Africa'], ['Tokyo', 'Japan'], ['Hong Kong', 'Hong Kong'],
];

const US_STATES = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Washington', 'Massachusetts', 'Georgia', 'Colorado', 'New Jersey'];

/** Searchable places: what is stored, what is shown, and what kind it is. */
export const PLACES = [
  ...COUNTRIES.map(name => ({ value: name, label: name, kind: 'Country' })),
  ...US_STATES.map(name => ({ value: name, label: `${name}, United States`, kind: 'State' })),
  ...CITIES.filter(([name]) => !COUNTRIES.includes(name)).map(([name, where, kind]) => ({ value: name, label: `${name}, ${where}`, kind: kind || 'City' })),
];

export const CITY_NAMES = new Set(CITIES.map(([name]) => name));

export const TONES = [
  { id: 'consultative', label: 'Consultative' },
  { id: 'direct', label: 'Direct & concise' },
  { id: 'friendly', label: 'Friendly & warm' },
  { id: 'challenger', label: 'Challenger' },
  { id: 'formal', label: 'Formal' },
  { id: 'custom', label: '+ Custom', custom: true },
];

export const HOOKS = [
  { id: 'problem', label: 'Their problem', desc: 'Leads with a pain they likely have.', api: 'pain_based' },
  { id: 'personal', label: 'Something about them', desc: 'A recent opening, hire or news item. Most personal.', api: 'personalized_signal' },
  { id: 'insight', label: 'A useful insight', desc: 'A trend in their industry.', api: 'insight_based' },
  { id: 'story', label: 'A customer story', desc: 'A similar business you helped.', api: 'social_proof' },
  { id: 'question', label: 'A question', desc: 'Opens with one short question.', api: 'question_led' },
  { id: 'custom', label: '+ Custom', desc: 'Tell Nexo how to open, in your words.', api: 'pain_based', custom: true },
];

/** Gaps are days after the previous email, which is how follow-ups are scheduled. */
export const CADENCES = [
  { id: 'gentle', label: 'Gentle', desc: '3 emails over 10 days', gaps: [4, 6] },
  { id: 'balanced', label: 'Balanced', desc: '3 emails over 7 days', gaps: [3, 4], recommended: true },
  { id: 'persistent', label: 'Persistent', desc: '3 emails over 5 days', gaps: [2, 3] },
  { id: 'custom', label: '+ Custom', desc: 'Pick how many emails and the gaps', custom: true },
];

export const MAX_EMAILS = 10;

export const EMAIL_RULES = [
  { label: 'Under 90 words', line: 'Keep every email under 90 words.' },
  { label: 'No pricing in email 1', line: 'Never mention pricing in the first email.' },
  { label: 'Use British English', line: 'Use British English spelling.' },
  { label: 'No exclamation marks', line: 'Never use exclamation marks.' },
  { label: 'Sign off with first name only', line: 'Sign off with my first name only.' },
  { label: 'Mention our free trial', line: 'Mention that we offer a free trial.' },
  { label: 'Never name competitors', line: 'Never name competitors.' },
];

export const CALL_RULES = [
  { label: 'Under 3 minutes', line: 'Keep calls under 3 minutes.' },
  { label: 'No prices on calls', line: 'Never quote exact prices on the call.' },
  { label: 'Speak slowly', line: 'Speak slowly and clearly.' },
  { label: 'Offer a callback time', line: 'If they are busy, offer a specific callback time.' },
  { label: 'Mention our free trial', line: 'Mention that we offer a free trial.' },
];

export const TOOLS = ['Gmail', 'Outlook', 'HubSpot', 'Zoho CRM', 'Salesforce', 'WhatsApp', 'Calendly / Cal.com'];

/** Voice styles. The exact voice is matched by the GNX team when calling is set up. */
export const VOICES = [
  { id: 'warm', name: 'Warm', desc: 'Female · friendly and calm' },
  { id: 'calm', name: 'Calm', desc: 'Male · steady and clear' },
  { id: 'bright', name: 'Bright', desc: 'Female · upbeat and quick' },
  { id: 'steady', name: 'Steady', desc: 'Male · formal and measured' },
];

export const CALL_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Portuguese'];

export const CALL_GOALS = [
  { id: 'meeting', label: 'A meeting is booked', desc: 'Nexo offers open times from your calendar and confirms one on the call.' },
  { id: 'interest', label: "They say they're interested", desc: 'Nexo checks fit, then you follow up yourself.' },
  { id: 'custom', label: '+ Custom', desc: 'Describe the outcome you want, in your words.', custom: true },
];

export const WEEKDAYS = [
  { n: 1, label: 'Mon' }, { n: 2, label: 'Tue' }, { n: 3, label: 'Wed' }, { n: 4, label: 'Thu' }, { n: 5, label: 'Fri' }, { n: 6, label: 'Sat' }, { n: 0, label: 'Sun' },
];

/** "Don't call me again" is always honoured, so it is shown but not editable. */
export const DO_NOT_CALL = { q: "Don't call me again.", a: "Understood. I'll make sure we don't call you again. Have a good day." };

export function defaultObjections(firstName) {
  const who = firstName || 'Our team';
  return [
    { q: 'We already have something for this.', a: "That makes sense, most of our customers switched from another tool. What would you change about yours if you could?" },
    { q: 'Just send me an email.', a: "Happy to. I'll send a short note right after this call. Is this the best email for you?" },
    { q: 'What does it cost?', a: `It depends on your setup. ${who} can walk you through it in 15 minutes. Would later this week work?` },
  ];
}

export const MORE_OBJECTIONS = [
  { q: "We're too busy right now.", a: 'Totally understand. When would be a better time for a two-minute chat?' },
  { q: 'Who gave you my number?', a: 'We found your business details in a public business directory. I can remove you from our list right away if you prefer.' },
  { q: 'Not interested.', a: 'No problem at all. Is that because the timing is off, or because it is not a fit?' },
  { q: 'We tried something like this before.', a: 'Good to know. What did not work last time? It helps me see if we are any different.' },
];
