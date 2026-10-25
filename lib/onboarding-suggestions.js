// Starter text for the Product step, picked from the industry chosen on the
// Profile step. Everything is a draft the user edits, not a claim about them.
const GROUPS = [
  {
    match: /software|internet|computer|information technology|network|security|e-learning|semiconductor|wireless|telecom|online media|nanotech/,
    product: 'We build software that helps {buyer} automate manual work and get more done with a smaller team.',
    value: 'Teams save hours every week, cut manual errors, and see results within the first month of use.',
    pains: 'Slow manual processes, tools that do not talk to each other, rising costs, and teams stretched too thin.',
    buyer: 'growing companies',
  },
  {
    match: /financ|banking|insurance|capital|invest|venture|accounting|fund-raising/,
    product: 'We help {buyer} manage money, risk and reporting with less paperwork and more accuracy.',
    value: 'Customers close their books faster, reduce compliance risk, and spend less time on manual reconciliation.',
    pains: 'Slow month-end close, compliance pressure, manual data entry, and limited visibility into cash and risk.',
    buyer: 'finance teams',
  },
  {
    match: /health|hospital|medical|pharma|biotech|mental|veterinary|wellness|alternative medicine/,
    product: 'We help {buyer} deliver better care with less administrative work.',
    value: 'Clinics see more patients, cut admin time, and improve patient satisfaction and follow-up rates.',
    pains: 'Heavy admin load, missed appointments, staffing shortages, and complex compliance requirements.',
    buyer: 'healthcare providers',
  },
  {
    match: /marketing|advertising|public relations|market research|media|publishing|broadcast|design|graphic|photography|animation|writing|translation|events|entertainment|music|motion pictures/,
    product: 'We help {buyer} produce better work faster and win more clients.',
    value: 'Agencies and brands launch campaigns sooner, show clearer results to clients, and grow revenue per client.',
    pains: 'Unpredictable lead flow, tight deadlines, hard-to-prove ROI, and too much time spent on repeat tasks.',
    buyer: 'agencies and brand teams',
  },
  {
    match: /staffing|recruit|human resources|professional training|coaching/,
    product: 'We help {buyer} find, hire and develop people faster.',
    value: 'Customers shorten time to hire, improve candidate quality, and reduce cost per hire.',
    pains: 'Long hiring cycles, unqualified applicants, high turnover, and scattered hiring data.',
    buyer: 'HR and talent teams',
  },
  {
    match: /logistics|supply chain|transport|trucking|warehous|package|freight|maritime|airlines|aviation|railroad|import|wholesale|shipbuilding/,
    product: 'We help {buyer} move goods more reliably and at lower cost.',
    value: 'Shippers cut delivery delays, lower freight spend, and gain real-time visibility across shipments.',
    pains: 'Late deliveries, rising freight costs, poor shipment visibility, and manual dispatch and paperwork.',
    buyer: 'logistics and operations teams',
  },
  {
    match: /real estate|construction|architecture|civil engineering|building materials|facilities|furniture/,
    product: 'We help {buyer} plan, build and manage properties and projects on time and on budget.',
    value: 'Customers finish projects on schedule, reduce cost overruns, and win more repeat business.',
    pains: 'Project delays, cost overruns, slow lead follow-up, and disconnected teams and tools.',
    buyer: 'builders and property teams',
  },
  {
    match: /manufactur|machinery|chemical|electrical|automotive|industrial|mining|metals|oil|energy|utilities|renewables|plastics|paper|packaging|textile|glass|aerospace|defense|mechanical/,
    product: 'We help {buyer} produce more with less downtime and waste.',
    value: 'Plants raise output, cut unplanned downtime, and lower cost per unit.',
    pains: 'Unplanned downtime, supply delays, quality issues, and rising material and energy costs.',
    buyer: 'manufacturers and plant teams',
  },
  {
    match: /retail|consumer|e-commerce|apparel|cosmetics|luxury|food|beverage|restaurant|supermarket|hospitality|leisure|travel|sporting|wine|gambling|dairy|tobacco|recreational/,
    product: 'We help {buyer} attract more customers and keep them coming back.',
    value: 'Brands grow repeat purchases, raise average order value, and spend less to win each customer.',
    pains: 'Rising acquisition costs, low repeat purchase rates, thin margins, and inventory or demand swings.',
    buyer: 'retail and consumer brands',
  },
  {
    match: /consult|legal|law|alternative dispute|judiciary|outsourcing|government|public|political|think tank|research/,
    product: 'We help {buyer} deliver expert work more efficiently and win new clients.',
    value: 'Firms save billable hours, shorten turnaround times, and win more of the work they pitch for.',
    pains: 'Time lost on admin, unpredictable pipeline, long sales cycles, and clients who compare on price.',
    buyer: 'professional services firms',
  },
  {
    match: /education|school|libraries|museums|non-profit|philanthropy|civic|religious|individual & family/,
    product: 'We help {buyer} reach more people and make a bigger impact with limited resources.',
    value: 'Organizations raise more funds, serve more people, and spend less time on admin.',
    pains: 'Limited budgets, small teams, hard-to-measure impact, and slow manual processes.',
    buyer: 'education and non-profit teams',
  },
];

const GENERIC = {
  product: 'We help {buyer} work faster, spend less and get better results.',
  value: 'Customers save time every week, cut costs, and see measurable results within the first few months.',
  pains: 'Slow manual work, rising costs, scattered tools, and too little time to focus on growth.',
  buyer: 'teams in this industry',
};

export function suggestProductText(industry, company) {
  const key = String(industry || '').toLowerCase();
  const group = GROUPS.find(g => g.match.test(key)) || GENERIC;
  const buyer = key && key !== 'other' && group === GENERIC ? `${key} teams` : group.buyer;
  const who = String(company || '').trim();
  return {
    productDescription: (who ? `At ${who}, ` : '') + (who ? group.product.replace(/^We/, 'we') : group.product).replace('{buyer}', buyer),
    valueProp: group.value,
    painPoints: group.pains,
  };
}
