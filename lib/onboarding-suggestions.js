// Starter text for the Product step, picked from the industry chosen on the
// Profile step. Everything is a draft the user edits, not a claim about them.
const GROUPS = [
  {
    match: /software|internet|computer|information technology|network|security|e-learning|semiconductor|wireless|telecom|online media|nanotech/,
    product: 'We build software that helps {buyer} automate manual work and get more done with a smaller team.',
    value: 'Teams save hours every week, cut manual errors, and see results within the first month of use.',
    pains: 'Slow manual processes, tools that do not talk to each other, rising costs, and teams stretched too thin.',
    buyer: 'growing companies',
    painChips: ['Too much manual work', 'Tools that do not talk to each other', 'Rising software costs', 'Teams stretched too thin', 'Slow onboarding of new hires', 'No single view of the data'],
    titles: ['Founder / CEO', 'CTO', 'Head of Operations', 'VP of Engineering'],
    alsoTitles: ['Co-Founder', 'COO', 'VP of Product', 'IT Manager', 'Head of Sales'],
    targets: ['computer software', 'internet', 'information technology & services', 'financial services', 'marketing & advertising'],
  },
  {
    match: /financ|banking|insurance|capital|invest|venture|accounting|fund-raising/,
    product: 'We help {buyer} manage money, risk and reporting with less paperwork and more accuracy.',
    value: 'Customers close their books faster, reduce compliance risk, and spend less time on manual reconciliation.',
    pains: 'Slow month-end close, compliance pressure, manual data entry, and limited visibility into cash and risk.',
    buyer: 'finance teams',
    painChips: ['Slow month-end close', 'Compliance pressure', 'Manual data entry', 'No clear view of cash', 'Reconciliation errors', 'Too many spreadsheets'],
    titles: ['CFO', 'Finance Manager', 'Founder / CEO', 'Head of Operations'],
    alsoTitles: ['Director of Finance', 'VP of Finance', 'COO', 'Co-Founder', 'Owner'],
    targets: ['financial services', 'accounting', 'banking', 'insurance', 'investment management'],
  },
  {
    match: /health|hospital|medical|pharma|biotech|mental|veterinary|wellness|alternative medicine/,
    product: 'We help {buyer} deliver better care with less administrative work.',
    value: 'Clinics see more patients, cut admin time, and improve patient satisfaction and follow-up rates.',
    pains: 'Heavy admin load, missed appointments, staffing shortages, and complex compliance requirements.',
    buyer: 'healthcare providers',
    painChips: ['Heavy admin load', 'Missed appointments', 'Staffing shortages', 'Complex compliance', 'Slow patient follow-up', 'Billing delays'],
    titles: ['Owner', 'Founder / CEO', 'Operations Manager', 'Head of Operations'],
    alsoTitles: ['General Manager', 'COO', 'IT Manager', 'Finance Manager', 'Co-Founder'],
    targets: ['hospital & health care', 'medical practice', 'health, wellness & fitness', 'mental health care', 'veterinary'],
  },
  {
    match: /marketing|advertising|public relations|market research|media|publishing|broadcast|design|graphic|photography|animation|writing|translation|events|entertainment|music|motion pictures/,
    product: 'We help {buyer} produce better work faster and win more clients.',
    value: 'Agencies and brands launch campaigns sooner, show clearer results to clients, and grow revenue per client.',
    pains: 'Unpredictable lead flow, tight deadlines, hard-to-prove ROI, and too much time spent on repeat tasks.',
    buyer: 'agencies and brand teams',
    painChips: ['Unpredictable lead flow', 'Tight deadlines', 'Hard-to-prove ROI', 'Too much repeat work', 'Clients leaving after one project', 'Pricing pressure'],
    titles: ['Founder / CEO', 'Marketing Director', 'Head of Marketing', 'Brand Manager'],
    alsoTitles: ['Co-Founder', 'Marketing Manager', 'Head of Growth', 'CMO', 'Owner'],
    targets: ['marketing & advertising', 'consumer goods', 'retail', 'computer software', 'hospitality'],
  },
  {
    match: /staffing|recruit|human resources|professional training|coaching/,
    product: 'We help {buyer} find, hire and develop people faster.',
    value: 'Customers shorten time to hire, improve candidate quality, and reduce cost per hire.',
    pains: 'Long hiring cycles, unqualified applicants, high turnover, and scattered hiring data.',
    buyer: 'HR and talent teams',
    painChips: ['Long hiring cycles', 'Unqualified applicants', 'High staff turnover', 'Scattered hiring data', 'Rising cost per hire', 'Slow onboarding'],
    titles: ['HR Manager', 'Recruiter / Talent Acquisition', 'Founder / CEO', 'Director of HR'],
    alsoTitles: ['CHRO', 'VP of HR', 'Head of Operations', 'COO', 'Co-Founder'],
    targets: ['staffing & recruiting', 'information technology & services', 'computer software', 'hospital & health care', 'financial services'],
  },
  {
    match: /logistics|supply chain|transport|trucking|warehous|package|freight|maritime|airlines|aviation|railroad|import|wholesale|shipbuilding/,
    product: 'We help {buyer} move goods more reliably and at lower cost.',
    value: 'Shippers cut delivery delays, lower freight spend, and gain real-time visibility across shipments.',
    pains: 'Late deliveries, rising freight costs, poor shipment visibility, and manual dispatch and paperwork.',
    buyer: 'logistics and operations teams',
    painChips: ['Late deliveries', 'Rising freight costs', 'Poor shipment visibility', 'Manual dispatch and paperwork', 'Warehouse errors', 'Customer delivery complaints'],
    titles: ['Operations Manager', 'Head of Operations', 'Owner', 'Founder / CEO'],
    alsoTitles: ['Director of Operations', 'COO', 'General Manager', 'VP of Operations', 'Co-Founder'],
    targets: ['logistics & supply chain', 'warehousing', 'wholesale', 'retail', 'transportation/trucking/railroad'],
  },
  {
    match: /real estate|construction|architecture|civil engineering|building materials|facilities|furniture/,
    product: 'We help {buyer} plan, build and manage properties and projects on time and on budget.',
    value: 'Customers finish projects on schedule, reduce cost overruns, and win more repeat business.',
    pains: 'Project delays, cost overruns, slow lead follow-up, and disconnected teams and tools.',
    buyer: 'builders and property teams',
    painChips: ['Project delays', 'Cost overruns', 'Slow lead follow-up', 'Disconnected teams and tools', 'Paperwork on site', 'Missed handovers'],
    titles: ['Owner', 'Founder / CEO', 'Project Manager', 'Operations Manager'],
    alsoTitles: ['Managing Director', 'General Manager', 'Director of Operations', 'Co-Founder', 'COO'],
    targets: ['real estate', 'construction', 'commercial real estate', 'architecture & planning', 'facilities services'],
  },
  {
    match: /manufactur|machinery|chemical|electrical|automotive|industrial|mining|metals|oil|energy|utilities|renewables|plastics|paper|packaging|textile|glass|aerospace|defense|mechanical/,
    product: 'We help {buyer} produce more with less downtime and waste.',
    value: 'Plants raise output, cut unplanned downtime, and lower cost per unit.',
    pains: 'Unplanned downtime, supply delays, quality issues, and rising material and energy costs.',
    buyer: 'manufacturers and plant teams',
    painChips: ['Unplanned downtime', 'Supply delays', 'Quality issues', 'Rising material costs', 'Rising energy costs', 'Manual production tracking'],
    titles: ['Operations Manager', 'Head of Operations', 'Owner', 'Managing Director'],
    alsoTitles: ['Director of Operations', 'General Manager', 'COO', 'VP of Operations', 'Founder / CEO'],
    targets: ['machinery', 'industrial automation', 'automotive', 'electrical/electronic manufacturing', 'chemicals'],
  },
  {
    match: /retail|consumer|e-commerce|apparel|cosmetics|luxury|food|beverage|restaurant|supermarket|hospitality|leisure|travel|sporting|wine|gambling|dairy|tobacco|recreational/,
    product: 'We help {buyer} attract more customers and keep them coming back.',
    value: 'Brands grow repeat purchases, raise average order value, and spend less to win each customer.',
    pains: 'Rising acquisition costs, low repeat purchase rates, thin margins, and inventory or demand swings.',
    buyer: 'retail and consumer brands',
    painChips: ['Long checkout queues', 'Stock running out unnoticed', 'Manual invoicing', 'End-of-day cash mismatches', 'Too many separate tools', 'No sales reports by store', 'Slow billing at peak hours'],
    titles: ['Owner', 'Founder / CEO', 'Store Manager', 'Operations Manager'],
    alsoTitles: ['Co-Founder', 'General Manager', 'Head of Operations', 'Finance Manager', 'IT Manager'],
    targets: ['retail', 'supermarkets', 'restaurants', 'food & beverages', 'apparel & fashion'],
  },
  {
    match: /consult|legal|law|alternative dispute|judiciary|outsourcing|government|public|political|think tank|research/,
    product: 'We help {buyer} deliver expert work more efficiently and win new clients.',
    value: 'Firms save billable hours, shorten turnaround times, and win more of the work they pitch for.',
    pains: 'Time lost on admin, unpredictable pipeline, long sales cycles, and clients who compare on price.',
    buyer: 'professional services firms',
    painChips: ['Time lost on admin', 'Unpredictable pipeline', 'Long sales cycles', 'Clients comparing on price', 'Unbilled hours', 'Slow proposals'],
    titles: ['Managing Director', 'Partner', 'Founder / CEO', 'Operations Manager'],
    alsoTitles: ['Owner', 'Co-Founder', 'Head of Operations', 'Finance Manager', 'General Manager'],
    targets: ['management consulting', 'legal services', 'accounting', 'financial services', 'computer software'],
  },
  {
    match: /education|school|libraries|museums|non-profit|philanthropy|civic|religious|individual & family/,
    product: 'We help {buyer} reach more people and make a bigger impact with limited resources.',
    value: 'Organizations raise more funds, serve more people, and spend less time on admin.',
    pains: 'Limited budgets, small teams, hard-to-measure impact, and slow manual processes.',
    buyer: 'education and non-profit teams',
    painChips: ['Limited budgets', 'Small teams', 'Hard-to-measure impact', 'Slow manual processes', 'Falling enrolment or donations', 'Too many tools'],
    titles: ['Founder / CEO', 'Managing Director', 'Operations Manager', 'Head of Operations'],
    alsoTitles: ['Director of Operations', 'IT Manager', 'Finance Manager', 'Program Manager', 'Owner'],
    targets: ['education management', 'primary/secondary education', 'higher education', 'non-profit organization management', 'e-learning'],
  },
];

const GENERIC = {
  product: 'We help {buyer} work faster, spend less and get better results.',
  value: 'Customers save time every week, cut costs, and see measurable results within the first few months.',
  pains: 'Slow manual work, rising costs, scattered tools, and too little time to focus on growth.',
  buyer: 'teams in this industry',
  painChips: ['Slow manual work', 'Rising costs', 'Scattered tools', 'No time to focus on growth', 'Inconsistent follow-up', 'Hard to track results'],
  titles: ['Founder / CEO', 'Owner', 'Head of Operations', 'General Manager'],
  alsoTitles: ['Co-Founder', 'COO', 'Head of Sales', 'Operations Manager', 'Finance Manager'],
  targets: [],
};

function groupFor(industry) {
  const key = String(industry || '').toLowerCase();
  return GROUPS.find(g => g.match.test(key)) || GENERIC;
}

/**
 * Problems, buyer titles and buyer industries that usually fit a seller in
 * this industry. Starting points the user ticks or edits, never claims.
 */
export function suggestAudience(industry) {
  const group = groupFor(industry);
  const key = String(industry || '').toLowerCase().trim();
  const targets = group.targets.length ? group.targets : (key && key !== 'other' ? [key] : []);
  return { painChips: group.painChips, titles: group.titles, alsoTitles: group.alsoTitles, targets };
}

export function suggestProductText(industry, company) {
  const key = String(industry || '').toLowerCase();
  const group = groupFor(industry);
  const buyer = key && key !== 'other' && group === GENERIC ? `${key} teams` : group.buyer;
  const who = String(company || '').trim();
  return {
    productDescription: (who ? `At ${who}, ` : '') + (who ? group.product.replace(/^We/, 'we') : group.product).replace('{buyer}', buyer),
    valueProp: group.value,
    painPoints: group.pains,
  };
}
