// Made-up workspace for the hero product demo. Every person, company, email and
// phone number here is fictional (555-01xx numbers are reserved for fiction).
// Labels and layouts copy the real screens so the demo never shows UI the
// product does not have.

export const WORKSPACE_USER = { name: "Maya Collins", org: "Northwind Labs" };

export const STAGE_COLORS = {
  new: "#9aa8a0",
  queued: "#7c8bf0",
  contacted: "#15c4c0",
  engaged: "#00a86a",
  meeting_booked: "#00c27a",
};

export const STAGE_LABELS = {
  new: "New",
  queued: "Queued",
  contacted: "Contacted",
  engaged: "Engaged",
  meeting_booked: "Meeting set",
};

// Listed in "recently added" order; the scene sorts them by score.
export const LEADS = [
  { id: "l1", name: "Marcus Bell", title: "Head of Sales", company: "Quillstack", email: "marcus@quillstack.io", phone: "+1 312 555 0118", stage: "contacted", score: 71, next: "Oct 2, 10:15 AM" },
  { id: "l2", name: "Priya Raman", title: "VP Sales", company: "Loopwise", email: "priya@loopwise.io", phone: "+1 415 555 0142", stage: "new", score: 94, next: "Oct 1, 9:30 AM" },
  { id: "l3", name: "Tom Alvarez", title: "Founder", company: "Brightlane", email: "tom@brightlane.co", phone: "Not requested", stage: "queued", score: 66, next: "Oct 1, 2:00 PM" },
  { id: "l4", name: "Hannah Lee", title: "RevOps Lead", company: "Cobaltly", email: "hannah@cobaltly.com", phone: "+1 206 555 0187", stage: "engaged", score: 88, next: "Not scheduled" },
  { id: "l5", name: "Owen Park", title: "CRO", company: "Tidewell", email: "owen@tidewell.io", phone: "+1 646 555 0103", stage: "new", score: 91, next: "Oct 1, 11:00 AM" },
  { id: "l6", name: "Sofia Marin", title: "Director of Growth", company: "Fernhill Analytics", email: "sofia@fernhill.ai", phone: "Not requested", stage: "contacted", score: 62, next: "Oct 3, 9:00 AM" },
  { id: "l7", name: "Ravi Shah", title: "Co-founder & CEO", company: "Nimbusly", email: "ravi@nimbusly.app", phone: "+1 512 555 0164", stage: "meeting_booked", score: 86, next: "Not scheduled" },
  { id: "l8", name: "Grace Okoye", title: "VP Revenue", company: "Harborline", email: "grace@harborline.co", phone: "+1 617 555 0129", stage: "queued", score: 79, next: "Oct 2, 1:30 PM" },
  { id: "l9", name: "Leo Fischer", title: "Head of BD", company: "Stackmint", email: "leo@stackmint.io", phone: "Not requested", stage: "new", score: 58, next: "Oct 4, 10:00 AM" },
  { id: "l10", name: "Nina Kowal", title: "Sales Director", company: "Brightpath HR", email: "nina@brightpathhr.com", phone: "+1 303 555 0171", stage: "contacted", score: 74, next: "Oct 2, 3:45 PM" },
  { id: "l11", name: "Aaron Dutta", title: "Founder", company: "Parcelo", email: "aaron@parcelo.io", phone: "+1 408 555 0136", stage: "new", score: 83, next: "Oct 1, 4:00 PM" },
];

export const TOP_LEAD = {
  ...LEADS[1],
  headline: "Building the outbound team at Loopwise · ex-Salesforce",
  location: "San Francisco, California, United States",
  seniority: "Vp",
  department: "Sales",
  jobFunction: "Sales",
  emailStatus: "Verified",
  emailConfidence: "98%",
  history: [
    { title: "VP Sales", where: "Loopwise · 2024 – Present" },
    { title: "Director, Mid-Market Sales", where: "Relaylane · 2020 – 2024" },
    { title: "Account Executive", where: "Salesforce · 2016 – 2020" },
  ],
};

export const PROSPECT_METRICS = [
  { label: "total prospects", value: "1,248", icon: "users" },
  { label: "hot leads", value: "64", icon: "flame", tone: "warn" },
  { label: "meetings set", value: "29", icon: "calendar" },
  { label: "emails revealed", value: "1,102", icon: "mail" },
];

export const CAMPAIGN_STATUS = {
  active: { label: "Active", bg: "var(--g-50)", color: "var(--g-700)", dot: "var(--g-500)" },
  paused: { label: "Paused", bg: "#fff7ed", color: "#9a3412", dot: "#f97316" },
  draft: { label: "Draft", bg: "var(--bg-2)", color: "var(--muted)", dot: "var(--faint)" },
  completed: { label: "Completed", bg: "#eef2ff", color: "#4338ca", dot: "#6366f1" },
};

export const CAMPAIGNS = [
  { id: "c1", name: "Series A SaaS founders", channel: "email", status: "active", created: "Aug 18, 2026", owner: "Maya Collins", stats: ["412", "386", "26", "48", "2,140", "18"] },
  { id: "c3", name: "Agency owners call-down", channel: "voice", status: "active", created: "Sep 4, 2026", owner: "Maya Collins", stats: ["150", "142", "0", "20", "248", "9"] },
  { id: "c2", name: "RevOps leaders · US", channel: "both", status: "active", created: "Aug 29, 2026", owner: "Jordan Pike", stats: ["268", "251", "17", "32", "1,386", "11"] },
  { id: "c4", name: "Fintech CFOs", channel: "email", status: "paused", created: "Sep 9, 2026", owner: "Jordan Pike", stats: ["96", "90", "6", "0", "1,386", "3"] },
  { id: "c5", name: "Q4 webinar invite", channel: "email", status: "draft", created: "Sep 24, 2026", owner: "Unassigned", stats: ["0", "0", "0", "0", "0", "0"] },
];

export const CHANNEL_LABELS = { email: "Email", voice: "Voice", both: "Email + Voice" };

export const DRAFTS = [
  { id: "d1", lead: "Priya Raman", title: "VP Sales", company: "Loopwise", email: "priya@loopwise.io", subject: "Loopwise's 3 new SDR seats", body: "Hi Priya,\n\nSaw Loopwise is hiring three SDRs after the Series A. Most teams at that stage spend the first month building lists by hand before a single email goes out.\n\nGNX finds and researches the buyers, drafts each first email, and follows up on its own, so your new reps start on warm replies instead of spreadsheets.\n\nWorth a 20-minute look next week?" },
  { id: "d2", lead: "Owen Park", title: "CRO", company: "Tidewell", subject: "Tidewell's move into mid-market", body: "Hi Owen, congrats on the mid-market launch. Teams expanding upmarket usually…" },
  { id: "d3", lead: "Hannah Lee", title: "RevOps Lead", company: "Cobaltly", subject: "Cobaltly's reply rates after the CRM switch", body: "Hi Hannah, noticed Cobaltly moved to a new CRM this summer. That switch often…" },
  { id: "d4", lead: "Ravi Shah", title: "Co-founder & CEO", company: "Nimbusly", subject: "Founder-led sales at Nimbusly", body: "Hi Ravi, you're still closing most deals yourself at Nimbusly. That's where…" },
  { id: "d5", lead: "Aaron Dutta", title: "Founder", company: "Parcelo", subject: "Parcelo's first outbound hire", body: "Hi Aaron, saw the first sales role posted at Parcelo. Before that hire lands…" },
  { id: "d6", lead: "Grace Okoye", title: "VP Revenue", company: "Harborline", subject: "Harborline's healthcare pipeline", body: "Hi Grace, Harborline's new clinic partnerships caught my eye. Reaching the…" },
  { id: "d7", lead: "Nina Kowal", title: "Sales Director", company: "Brightpath HR", subject: "Brightpath HR's Q4 targets", body: "Hi Nina, Q4 is usually when HR platforms push hardest on new logos…" },
];

export const THREADS = [
  { id: "t1", name: "Daniel Okafor", company: "Brightlane", time: "9:42 AM", subject: "Re: Brightlane's outbound after the Series A", preview: "Hi, this sounds useful. Can you share how it works for a 10-person team?", kind: "reply", unread: true },
  { id: "t2", name: "Grace Okoye", company: "Harborline", time: "9:10 AM", subject: "Re: Harborline's healthcare pipeline", preview: "Thursday could work. What does onboarding look like?", kind: "reply", unread: true },
  { id: "t3", name: "Priya Raman", company: "Loopwise", time: "8:55 AM", subject: "Loopwise's 3 new SDR seats", preview: "Saw Loopwise is hiring three SDRs after the Series A…", kind: "sent" },
  { id: "t4", name: "Ravi Shah", company: "Nimbusly", time: "Yesterday", subject: "Re: Founder-led sales at Nimbusly", preview: "Booked a slot for Friday. Looking forward to it.", kind: "reply" },
  { id: "t5", name: "Owen Park", company: "Tidewell", time: "Yesterday", subject: "Tidewell's move into mid-market", preview: "Congrats on the mid-market launch. Teams expanding…", kind: "sent" },
  { id: "t6", name: "Sofia Marin", company: "Fernhill Analytics", time: "Yesterday", subject: "Re: Fernhill's data team", preview: "Not the right time for us, maybe in Q1.", kind: "reply" },
  { id: "t7", name: "Hannah Lee", company: "Cobaltly", time: "Mon", subject: "Re: Cobaltly's reply rates", preview: "Can you send pricing for 3 seats?", kind: "reply" },
  { id: "t8", name: "Marcus Bell", company: "Quillstack", time: "Mon", subject: "Quillstack's outbound playbook", preview: "Noticed Quillstack opened a Chicago office…", kind: "sent" },
  { id: "t9", name: "Aaron Dutta", company: "Parcelo", time: "Mon", subject: "Parcelo's first outbound hire", preview: "Saw the first sales role posted at Parcelo…", kind: "sent" },
  { id: "t10", name: "Nina Kowal", company: "Brightpath HR", time: "Sun", subject: "Brightpath HR's Q4 targets", preview: "Q4 is usually when HR platforms push hardest…", kind: "sent" },
];

export const OPEN_THREAD = {
  name: "Daniel Okafor",
  email: "daniel@brightlane.co",
  sentAt: "Sep 29, 4:10 PM",
  subject: "Brightlane's outbound after the Series A",
  sentBody: "Hi Daniel,\n\nCongrats on the Series A. Teams that grow from 3 to 10 reps usually find follow-ups are the first thing to slip.\n\nGNX keeps every lead followed up and books the calls, so your reps spend their day selling.\n\nOpen to a quick look?",
  replyAt: "Sep 30, 9:42 AM",
  replyBody: "Hi, this sounds useful. Can you share how it works for a 10-person team?",
  draft: "Hi Daniel,\n\nHappy to. For a 10-person team, GNX finds and researches the leads, writes each first email, and follows up until someone replies, so your reps only step in once a buyer is interested.\n\nWould Thursday at 2:00 PM or Friday at 11:00 AM work for a 20-minute walkthrough?",
};

export const MEETING_STATUS = {
  scheduled: { label: "Scheduled", bg: "var(--g-50)", color: "var(--g-700)" },
  completed: { label: "Completed", bg: "#f0fdf4", color: "#15803d" },
};

// Sun–Sat, like the real week view. Wednesday is "today".
export const WEEK = [
  { short: "Sun", date: 27, meetings: [] },
  { short: "Mon", date: 28, meetings: [
    { id: "m1", name: "Ava Chen", company: "Tidewell", time: "10:00 AM", status: "completed" },
    { id: "m2", name: "Leo Fischer", company: "Stackmint", time: "3:30 PM", status: "completed" },
  ] },
  { short: "Tue", date: 29, meetings: [
    { id: "m3", name: "Ravi Shah", company: "Nimbusly", time: "11:00 AM", status: "completed" },
  ] },
  { short: "Wed", date: 30, today: true, meetings: [
    { id: "m4", name: "Hannah Lee", company: "Cobaltly", time: "1:00 PM", status: "scheduled", join: true },
  ] },
  { short: "Thu", date: 1, meetings: [
    { id: "m5", name: "Grace Okoye", company: "Harborline", time: "10:30 AM", status: "scheduled", join: true },
    { id: "m5b", name: "Owen Park", company: "Tidewell", time: "11:30 AM", status: "scheduled", join: true },
  ] },
  { short: "Fri", date: 2, meetings: [
    { id: "m6", name: "Marcus Bell", company: "Quillstack", time: "9:00 AM", status: "scheduled", join: true },
    { id: "m7", name: "Nina Kowal", company: "Brightpath HR", time: "4:00 PM", status: "scheduled", join: true },
  ] },
  { short: "Sat", date: 3, meetings: [] },
];

export const NEW_MEETING = { id: "m-new", name: "Daniel Okafor", company: "Brightlane", time: "2:00 PM", status: "scheduled", join: true };

export const AGENT_HISTORY = [
  "Northwind leads upload",
  "Pause weekend sending",
  "Summarize hottest leads",
  "Draft follow-ups for no-replies",
  "Give me 50 ICP leads",
];

export const AGENT_KPIS = [
  { k: "Emails sent", v: "4,912", ico: "send" },
  { k: "Replies", v: "186", ico: "chat" },
  { k: "Meetings", v: "29", ico: "calendar" },
  { k: "Hot leads", v: "64", ico: "flame", warn: true },
];

export const AGENT_QUICK = ["Draft follow-ups for no-replies", "Give me 50 ICP leads", "Summarize hottest leads", "Pause weekend sending"];

export const AGENT_FILE = "northwind-leads.xlsx";
export const AGENT_PROMPT = "Add these as leads and create an email campaign just for them";
export const AGENT_STEPS = [
  "Read 50 rows",
  "Added 48 leads (2 had no email)",
  "Researched each company",
  "Wrote a 3-email series",
];

export const CHANNEL_STYLES = {
  email: { label: "Email", bg: "#e0f2fe", color: "#0369a1" },
  voice: { label: "Voice", bg: "#f0fdf4", color: "#15803d" },
  both: { label: "Email + Voice", bg: "#ede9fe", color: "#6d28d9" },
};

// Leads in the voice campaign. Owen is the one the cursor calls.
export const VOICE_LEADS = [
  { id: "v1", name: "Owen Park", title: "CRO", company: "Tidewell", phone: "+1 646 555 0103", status: "queued", next: "Oct 1, 11:00 AM", nextNote: "Scheduled · America/New_York", location: "New York, US" },
  { id: "v2", name: "Grace Okoye", title: "VP Revenue", company: "Harborline", phone: "+1 617 555 0129", status: "contacted", next: "Oct 2, 1:30 PM", nextNote: "Scheduled · America/New_York", location: "Boston, US" },
  { id: "v3", name: "Aaron Dutta", title: "Founder", company: "Parcelo", phone: "+1 408 555 0136", status: "queued", next: "Oct 1, 4:00 PM", nextNote: "Scheduled · America/Los_Angeles", location: "San Jose, US" },
  { id: "v4", name: "Nina Kowal", title: "Sales Director", company: "Brightpath HR", phone: "+1 303 555 0171", status: "meeting_booked", next: "Not scheduled", nextNote: "", location: "Denver, US" },
  { id: "v5", name: "Marcus Bell", title: "Head of Sales", company: "Quillstack", phone: "+1 312 555 0118", status: "contacted", next: "Oct 2, 10:15 AM", nextNote: "Scheduled · America/Chicago", location: "Chicago, US" },
  { id: "v6", name: "Hannah Lee", title: "RevOps Lead", company: "Cobaltly", phone: "+1 206 555 0187", status: "new", next: "Oct 3, 9:00 AM", nextNote: "Planned · America/Los_Angeles", location: "Seattle, US" },
];

export const CALL_STATUS = {
  in_progress: { label: "In Progress", bg: "#e0f2fe", color: "#0369a1", dot: "#0ea5e9" },
  completed: { label: "Completed", bg: "var(--g-50)", color: "var(--g-700)", dot: "var(--g-500)" },
  voicemail: { label: "Voicemail", bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" },
  no_answer: { label: "No Answer", bg: "#fff7ed", color: "#9a3412", dot: "#f97316" },
  busy: { label: "Busy", bg: "#fff7ed", color: "#9a3412", dot: "#f97316" },
};

export const CALL_OUTCOME = {
  meeting_booked: { label: "Meeting Booked", bg: "var(--g-50)", color: "var(--g-700)" },
  interested: { label: "Interested", bg: "#e0f2fe", color: "#0369a1" },
  callback: { label: "Callback", bg: "#fff7ed", color: "#9a3412" },
  voicemail: { label: "Voicemail", bg: "#f3f4f6", color: "#374151" },
  no_answer: { label: "No Answer", bg: "#f3f4f6", color: "#374151" },
  busy: { label: "Busy", bg: "#fff7ed", color: "#9a3412" },
};

// Owen's call is first; its status and outcome are driven by the scene.
export const CALLS = [
  { id: "k1", name: "Owen Park", company: "Tidewell", from: "+1 415 555 0190", campaign: "Agency owners call-down", duration: "2m 47s", date: "Sep 30, 10:58 AM" },
  { id: "k2", name: "Grace Okoye", company: "Harborline", from: "+1 415 555 0190", campaign: "Agency owners call-down", status: "completed", outcome: "interested", duration: "3m 12s", date: "Sep 30, 10:21 AM" },
  { id: "k3", name: "Nina Kowal", company: "Brightpath HR", from: "+1 415 555 0190", campaign: "RevOps leaders · US", status: "completed", outcome: "meeting_booked", duration: "4m 05s", date: "Sep 30, 9:47 AM" },
  { id: "k4", name: "Marcus Bell", company: "Quillstack", from: "+1 415 555 0190", campaign: "Agency owners call-down", status: "no_answer", outcome: "no_answer", duration: "0s", date: "Sep 30, 9:30 AM" },
  { id: "k5", name: "Aaron Dutta", company: "Parcelo", from: "+1 415 555 0190", campaign: "RevOps leaders · US", status: "completed", outcome: "callback", duration: "1m 38s", date: "Sep 29, 4:12 PM" },
  { id: "k6", name: "Leo Fischer", company: "Stackmint", from: "+1 415 555 0190", campaign: "Agency owners call-down", status: "voicemail", outcome: "voicemail", duration: "32s", date: "Sep 29, 3:40 PM" },
  { id: "k7", name: "Sofia Marin", company: "Fernhill Analytics", from: "+1 415 555 0190", campaign: "RevOps leaders · US", status: "busy", outcome: "busy", duration: "0s", date: "Sep 29, 2:05 PM" },
];

export const OWEN_CALL = {
  summary: "Owen Park (CRO, Tidewell) first asked for an email instead. The agent offered a short walkthrough tied to Tidewell's mid-market launch, checked the calendar, and booked Thursday at 11:30 AM. Owen wants to see how follow-ups work for a 4-rep team.",
  rows: [["Direction", "outbound"], ["Connection", "Agent Hangup"], ["Sentiment", "Positive"], ["Call success", "Yes"]],
  analysis: [["Meeting Booked", "Yes"], ["Interest Level", "High"], ["Objection", "Wanted an email first"], ["Next Step", "Walkthrough Thu 11:30 AM"]],
  transcript: [
    ["Agent", "Hi Owen, this is Ava, an AI assistant calling for Northwind Labs. Did I catch you at an okay time?"],
    ["User", "I've got a minute. What's this about?"],
    ["Agent", "Tidewell is moving into mid-market. We help teams like yours book more first meetings without adding reps."],
    ["User", "Honestly, just send me an email."],
    ["Agent", "Happy to. Would a 20-minute walkthrough also help? I have Thursday at 11:30 or Friday at 2."],
    ["User", "Thursday at 11:30 works."],
    ["Agent", "Booked. The invite is on its way to owen@tidewell.io. Thanks, Owen!"],
  ],
};
