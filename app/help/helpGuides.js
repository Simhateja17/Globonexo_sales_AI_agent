// Help center guides. Steps and tips are trusted static HTML (<strong> only),
// rendered with dangerouslySetInnerHTML and stripped to text for search.
export const helpGroups = [
  {
    "id": "start",
    "title": "Getting started",
    "blurb": "Everything the agent needs to know before it writes a single email.",
    "summary": "Onboarding, the setup checklist, the AI Agent chat and your team.",
    "guides": [
      {
        "title": "Complete onboarding so the agent learns your offer",
        "where": "Onboarding",
        "steps": [
          "<strong>Profile.</strong> Add your first name, company, role and industry.",
          "<strong>Product.</strong> Describe what your product does, the measurable outcome customers get, and the buyer pains outreach should mention.",
          "<strong>Ideal customer.</strong> Pick at least one job title and one industry, then company sizes, geographies, typical deal size and sales cycle.",
          "<strong>Outreach strategy.</strong> Set a monthly meeting target, writing tone, opening hook style, follow-up cadence and the tools you already use.",
          "<strong>Review and launch.</strong> Name your agent, add a booking link if you have one, check the summary and finish."
        ],
        "tip": "The agent explains your product from these answers, so vague input gives vague emails. You can edit them later from <strong>Get set up</strong>."
      },
      {
        "title": "Use the Get set up checklist",
        "where": "Sidebar › Get set up",
        "steps": [
          "Open <strong>Get set up</strong> from the sidebar. Tasks are grouped as Tell the agent about you, Connect your tools and Launch your first campaign.",
          "Click any task to jump straight to the screen that finishes it, such as Settings for your inbox or Calendar for your availability.",
          "Come back to see the badge change once a task is done. Work top to bottom for the smoothest first launch."
        ],
        "tip": null
      },
      {
        "title": "Ask the AI Agent to do the work for you",
        "where": "Sidebar › AI Agent",
        "steps": [
          "Open <strong>AI Agent</strong> and type what you want in plain words, for example \"Give me 50 ICP leads\" or \"Summarize hottest leads\".",
          "For a lead search, the agent shows the exact filters it will use. Check them, then choose <strong>Proceed with lead search</strong>.",
          "Drafts, campaigns and bookings come back as cards marked <strong>Approval needed</strong>. Nothing is sent or booked until you press Approve.",
          "To work from your own list, attach a CSV or Excel file up to 10 MB and tell the agent what to do with it."
        ],
        "tip": null
      },
      {
        "title": "Invite teammates and manage seats",
        "where": "Settings › Team",
        "steps": [
          "Go to <strong>Team</strong> in the sidebar and choose <strong>Invite a Member</strong>.",
          "Enter their work email. They verify it, create their own account and join your workspace.",
          "Each pending invitation holds a seat for seven days. Use <strong>Resend</strong> or <strong>Revoke</strong> under Pending invitations.",
          "Promote people with <strong>Make Admin</strong>. Admins get seats before Members, and the Owner always has access."
        ],
        "tip": "Seats by plan: <strong>Individual 1</strong>, <strong>Agency 5</strong>, <strong>Startup 15</strong>."
      }
    ]
  },
  {
    "id": "email",
    "title": "Sending inboxes",
    "blurb": "Each inbox uses SMTP to send and IMAP to read replies. We test both before saving.",
    "summary": "Connect Gmail or any mailbox and fix one that needs attention.",
    "guides": [
      {
        "title": "Connect a Gmail or Google Workspace inbox",
        "where": "Settings › Sending inboxes",
        "steps": [
          "In your Google account, turn on 2-Step Verification, then create an <strong>app password</strong>.",
          "In GNX Sales, open <strong>Settings</strong> and find <strong>Sending inboxes</strong>. Add an inbox.",
          "Choose the <strong>Gmail</strong> preset. The SMTP and IMAP servers are filled in for you.",
          "Enter your email address and paste the app password, not your normal Google password.",
          "Save. We test both connections, and the inbox shows <strong>Ready</strong> when it works."
        ],
        "tip": null
      },
      {
        "title": "Connect Outlook or any other mailbox",
        "where": "Settings › Sending inboxes",
        "steps": [
          "Add an inbox and pick your provider's preset, or the custom option.",
          "Enter the SMTP host and port your provider gives you, and the IMAP host.",
          "Use one username and password for both. If your host needs an app password, create one there first.",
          "Save and wait for the connection test. Fix any field it flags and save again."
        ],
        "tip": "Inboxes by plan: <strong>Individual 1</strong>, <strong>Agency 10</strong>, <strong>Startup 30</strong>. Give an inbox to one teammate, or leave it shared with the team."
      },
      {
        "title": "Fix an inbox that needs attention",
        "where": "Settings › Sending inboxes",
        "steps": [
          "An inbox marked <strong>Needs attention</strong> lost its connection. Campaigns using it pause until it is fixed.",
          "Choose <strong>Edit settings</strong> on that inbox. A changed password or an expired app password is the usual cause.",
          "Enter the new password and save. When the test passes, resume the paused campaigns from Campaigns."
        ],
        "tip": null
      }
    ]
  },
  {
    "id": "leads",
    "title": "Leads and prospects",
    "blurb": "Find people who match your ideal customer, or bring the list you already have.",
    "summary": "Lead database search, CSV import, manual prospects and enrichment.",
    "guides": [
      {
        "title": "Search the lead database",
        "where": "Prospects › Lead database search",
        "steps": [
          "Open <strong>Prospects</strong> and choose <strong>Lead database search</strong>.",
          "Pick job titles, management level, people locations and target industries.",
          "Open additional filters to narrow by company HQ location or technologies used.",
          "Choose <strong>Find and prepare leads</strong>. Matching people land in Prospects, ready to add to a campaign."
        ],
        "tip": "Revealing an email or phone number uses credits. Phone numbers cost more than emails."
      },
      {
        "title": "Import leads from a CSV",
        "where": "Leads › Import CSV",
        "steps": [
          "Choose <strong>Import CSV</strong> and drag your file in. Files can be up to 10 MB.",
          "Under <strong>Column mapping</strong>, match each CSV column to a GNX field, or choose <strong>Skip this field</strong>.",
          "Check the sample row to make sure names and emails landed in the right place.",
          "Start the import and wait for <strong>Import complete</strong>."
        ],
        "tip": "Importing for a voice campaign? You confirm DNC screening and a lawful basis for every number before the import runs."
      },
      {
        "title": "Add a single prospect by hand",
        "where": "Prospects › Add prospect",
        "steps": [
          "Choose <strong>Add prospect</strong>.",
          "Enter at least a name, email or company. A LinkedIn URL is optional.",
          "Add notes the AI should consider for this person, then save."
        ],
        "tip": null
      },
      {
        "title": "Enrich a lead's details",
        "where": "Leads › open a lead",
        "steps": [
          "Search or filter <strong>Leads</strong> and open the person.",
          "Choose <strong>Enrich lead details</strong> to fill in missing contact and company data.",
          "Fields that show <strong>Not revealed</strong> still need a reveal before the lead can be emailed or called."
        ],
        "tip": null
      }
    ]
  },
  {
    "id": "campaigns",
    "title": "Email campaigns",
    "blurb": "One campaign, one channel. Build the sequence, set the schedule, approve the drafts.",
    "summary": "Sequences, schedules, draft review, launching and pausing.",
    "guides": [
      {
        "title": "Create an email campaign",
        "where": "Campaigns › New campaign",
        "steps": [
          "Choose <strong>New campaign</strong>, give it a name your team will recognise, and set the channel to Email.",
          "Add <strong>prompt notes</strong>: anything the agent should know about this campaign and who you are targeting.",
          "Shape the <strong>email sequence</strong>. It starts with three steps, and you can use 1 to 10.",
          "Under <strong>Assign leads</strong>, pick <strong>Automatic audience</strong> to let GNX find, deduplicate and enrich leads for you, or choose existing prospects.",
          "Save. The agent researches each lead and writes their emails."
        ],
        "tip": "Each campaign holds up to 25 leads. Email campaigns by plan: <strong>Individual 3</strong>, <strong>Agency 10</strong>, <strong>Startup 25</strong>."
      },
      {
        "title": "Set sending times and limits",
        "where": "New campaign › Controls",
        "steps": [
          "Set the <strong>lead-local start and end time</strong> and <strong>contact days</strong>. Emails go out in each lead's own timezone.",
          "Choose a <strong>daily send cap</strong>. Your plan allows up to 100, 200 or 500 emails a day.",
          "Pick <strong>lead preparation days</strong>, Saturday and Sunday by default. Research and drafting run on these days.",
          "Choose a <strong>research policy</strong>: Strict only picks leads with enough evidence, Review holds unclear matches for you."
        ],
        "tip": null
      },
      {
        "title": "Review and approve drafts",
        "where": "Campaigns › open a campaign",
        "steps": [
          "Open the campaign when the dashboard says your emails are ready to review.",
          "Read each draft. Use <strong>Edit email</strong> to change the subject or message.",
          "Not right? Choose <strong>Regenerate</strong> for a fresh version.",
          "Choose <strong>Approve</strong> one by one, or <strong>Approve all</strong> when you are happy with the batch."
        ],
        "tip": null
      },
      {
        "title": "Launch, pause or archive a campaign",
        "where": "Campaigns",
        "steps": [
          "Choose <strong>Launch campaign</strong>. Every lead needs a revealed or uploaded email first.",
          "Choose <strong>Pause</strong> anytime to stop sends. Launch again to pick up where it left off.",
          "From the Campaigns list, <strong>Archive</strong> a finished campaign to keep its history, or <strong>Delete</strong> it."
        ],
        "tip": null
      }
    ]
  },
  {
    "id": "inbox",
    "title": "Replies and pipeline",
    "blurb": "When someone replies, follow-ups to them stop and the conversation is yours.",
    "summary": "Answer replies, turn on autopilot and track every conversation.",
    "guides": [
      {
        "title": "Answer a reply with an AI draft",
        "where": "Inbox",
        "steps": [
          "Open <strong>Inbox</strong>. Use <strong>All inboxes</strong> to filter by one sending inbox.",
          "Pick a conversation on the left to see the full thread.",
          "Choose <strong>Ask GNX sales to draft</strong>. Edit the reply and add an attachment if you need one.",
          "Choose <strong>Send message</strong>. It goes out through the inbox the lead was contacted from."
        ],
        "tip": null
      },
      {
        "title": "Turn on autopilot replies",
        "where": "Settings › Agent Configuration",
        "steps": [
          "Open <strong>Settings</strong> and find <strong>Agent Configuration</strong>.",
          "Switch on <strong>Auto-approve AI replies</strong>. It is off by default.",
          "Save. Replies now send without waiting for you, after passing the same checks as approved drafts."
        ],
        "tip": "Follow-ups stop on their own when a lead replies, books a meeting, says they are not interested or unsubscribes."
      },
      {
        "title": "Track conversations in Pipeline",
        "where": "Pipeline",
        "steps": [
          "Open <strong>Pipeline</strong> to see every active lead grouped by stage.",
          "Search by lead, company, title or email, or filter to one stage.",
          "An empty board means no leads yet. Add leads from Prospects to start it."
        ],
        "tip": null
      }
    ]
  },
  {
    "id": "voice",
    "title": "AI voice calls",
    "blurb": "Every paid plan includes calling. Every call opens by saying it is an AI.",
    "summary": "Voice agent, phone number, voice campaigns, Call History and inbound.",
    "guides": [
      {
        "title": "Set up your voice agent",
        "where": "Settings › Voice Agent",
        "steps": [
          "Finish onboarding first. The voice agent builds its call script from your answers.",
          "In <strong>Settings</strong>, choose <strong>Set up voice agent</strong>. The status changes to Connected.",
          "Changed your tone, product description or objections? Choose <strong>Update voice agent</strong> to refresh the script."
        ],
        "tip": null
      },
      {
        "title": "Get your included phone number",
        "where": "Settings › Included number",
        "steps": [
          "Choose <strong>Provision included number</strong>.",
          "Wait while it shows <strong>Provisioning</strong>. The number appears here once it is <strong>Active</strong>.",
          "If it shows <strong>Failed</strong>, no number was bought. Choose <strong>Retry provisioning</strong>, and contact Support with the time if it fails again."
        ],
        "tip": "Phone numbers by plan: <strong>Individual 1</strong>, <strong>Agency 3</strong>, <strong>Startup 10</strong>."
      },
      {
        "title": "Run a voice campaign",
        "where": "Campaigns › New campaign",
        "steps": [
          "Create a campaign and set the channel to <strong>Voice</strong>.",
          "Set <strong>calls per hour</strong>, <strong>maximum call attempts</strong> for no-answers and voicemails, and the voice mode.",
          "Confirm each number is a direct or mobile line, checked against the Do Not Call lists that apply, and lawful to call.",
          "Launch. GNX screens every lead before dialing and blocks any Do Not Call match."
        ],
        "tip": null
      },
      {
        "title": "Review calls in Call History",
        "where": "Call History",
        "steps": [
          "Open <strong>Call History</strong> and switch between in progress, completed, voicemail, unanswered, busy, failed and rejected.",
          "Open a call to play the recording and read the transcript, call summary and sales analysis.",
          "For a call that did not connect, choose <strong>Retry</strong> to queue it again."
        ],
        "tip": null
      },
      {
        "title": "Turn on the inbound AI receptionist",
        "where": "Settings › Inbound AI receptionist",
        "steps": [
          "Choose <strong>Enable inbound calls</strong>. It is off by default and available on Agency and Startup.",
          "Set the <strong>unknown-caller daily cap</strong> in minutes, so calls from unknown numbers cannot run up your credits.",
          "Save. Inbound calls open with an AI disclosure, and their recordings and transcripts are not kept."
        ],
        "tip": null
      }
    ]
  },
  {
    "id": "meetings",
    "title": "Meetings and calendar",
    "blurb": "The agent books only inside the hours you allow.",
    "summary": "Availability, meeting links and the meetings the agent books.",
    "guides": [
      {
        "title": "Set your availability",
        "where": "Calendar › Availability",
        "steps": [
          "Pick your <strong>timezone</strong>. Slot times are spoken to leads in this timezone.",
          "Choose working days and your start and end time.",
          "Set meeting duration, buffer between meetings, minimum notice, and how many days ahead people can book.",
          "Add your <strong>default meeting link</strong>, such as a Google Meet room, and choose <strong>Save availability</strong>."
        ],
        "tip": null
      },
      {
        "title": "See and cancel booked meetings",
        "where": "Calendar",
        "steps": [
          "Meetings the agent books appear in <strong>Calendar</strong> on their own. Use <strong>Today</strong> to jump back to now.",
          "The meeting link goes to the prospect and to your connected mailbox automatically.",
          "Open a meeting to see the lead and company, or cancel it if plans change."
        ],
        "tip": "Google Calendar sync is coming soon. Until then, GNX Sales keeps its own calendar."
      }
    ]
  },
  {
    "id": "analytics",
    "title": "Dashboard and analytics",
    "blurb": "Where to look each morning, and what the numbers mean.",
    "summary": "What each number means and where to look first.",
    "guides": [
      {
        "title": "Read your dashboard",
        "where": "Dashboard",
        "steps": [
          "Start with <strong>Tasks</strong>: drafts to review and replies waiting on you.",
          "Check <strong>Next meeting</strong> and your progress on the <strong>weekly meeting goal</strong>.",
          "Scroll the <strong>Activity feed</strong> for the latest sends, replies and booked meetings."
        ],
        "tip": null
      },
      {
        "title": "Understand your analytics",
        "where": "Analytics",
        "steps": [
          "Analytics covers the last 30 days: prospects found, emails sent, reply rate and meetings booked.",
          "<strong>Call performance</strong> shows total calls and answer rate for voice campaigns.",
          "The <strong>conversion funnel</strong> shows where leads drop off, from found to booked."
        ],
        "tip": null
      }
    ]
  },
  {
    "id": "billing",
    "title": "Billing and credits",
    "blurb": "Only the workspace owner or billing manager can change the plan.",
    "summary": "Change or cancel a plan, read your credits and get support.",
    "guides": [
      {
        "title": "Change your plan or billing period",
        "where": "Billing › Change plan",
        "steps": [
          "Open <strong>Billing</strong> and choose <strong>Change plan</strong> or <strong>Change billing period</strong>.",
          "Pick the plan. Upgrades show the price with your unused credit taken off before you pay.",
          "Pay through Razorpay. The new plan and credits apply once the payment is confirmed.",
          "Moving to a smaller plan is scheduled for the end of your current period. Choose which inboxes and numbers to keep in Settings."
        ],
        "tip": null
      },
      {
        "title": "Read your credits",
        "where": "Billing",
        "steps": [
          "<strong>Credit balance</strong> is what you have left this period. <strong>Credits used</strong> is what the agent has spent.",
          "<strong>Credits reserved</strong> are held for work already queued, like drafts and calls in progress.",
          "<strong>Campaign ceiling</strong> is the most one campaign can spend. The agent stops before going over it."
        ],
        "tip": "Monthly credits: <strong>Individual 2,645</strong>, <strong>Agency 5,370</strong>, <strong>Startup 14,370</strong>. Unused credits do not carry over."
      },
      {
        "title": "Cancel your plan",
        "where": "Billing",
        "steps": [
          "Choose <strong>Cancel at period end</strong> and confirm.",
          "Your plan keeps working until the end of the period you paid for. Nothing renews after that.",
          "Unused time is not refunded. See the <a href=\"/refund\">Refund Policy</a> for the cases we review."
        ],
        "tip": null
      },
      {
        "title": "Open a support ticket in the app",
        "where": "Support",
        "steps": [
          "Open <strong>Support</strong> in the sidebar and choose <strong>Create ticket</strong>.",
          "Add a subject and describe the problem. Paste links, screenshots or error messages.",
          "Replies appear in the thread in real time. Choose <strong>Resolve</strong> when you are done, or <strong>Reopen</strong> if it comes back."
        ],
        "tip": null
      }
    ]
  }
];
