// Plain-words lifecycle state for a campaign, from the fields the API
// returns. Pure so the campaign list and the detail page always agree.
//
// "Active but outside sending hours" is deliberately not modelled: sends run
// in each lead's own timezone, so the campaign's display timezone cannot say
// whether anything is sending right now.

const SUSPENSION_TEXT = {
  email_account_needs_attention: "The sending inbox needs attention. Reconnect it in Settings and sending resumes.",
};

export function campaignLifecycle(campaign, { readyCount = 0 } = {}) {
  if (!campaign) return null;
  const status = campaign.status;
  const acquisition = campaign.acquisitionStatus;
  const prep = campaign.preparationStatus;
  const target = Number(campaign.targetQualifiedLeads || campaign.maxLeads || 0);

  if (status === "completed") {
    return { key: "completed", tone: "ok", title: "Completed", text: "Every step went to every lead. Replies still land in Inbox." };
  }
  if (status === "paused" && campaign.suspensionReason) {
    return {
      key: "paused_problem",
      tone: "bad",
      title: "Paused by a problem",
      text: SUSPENSION_TEXT[campaign.suspensionReason] || "Something the campaign needs is not working. Nothing sends until it is fixed.",
      fix: campaign.suspensionReason === "email_account_needs_attention" ? "/settings#settings-inboxes" : null,
    };
  }
  if (acquisition === "credit_limit_reached") {
    return { key: "credit_limit", tone: "warn", title: "Credit limit reached", text: "Lead search stopped because this campaign used its credit limit. Leads already found keep their sequence." };
  }
  if (acquisition === "audience_exhausted") {
    return {
      key: "audience_exhausted",
      tone: "warn",
      title: "Audience ran out",
      text: `There are no more people who match this audience${target ? ` to reach ${target} leads` : ""}. Widen the titles, locations or company size to find more.`,
    };
  }
  if (status === "paused") {
    return { key: "paused", tone: "info", title: "Paused", text: "Nothing sends while paused. Leads and drafts are kept, and you can resume any time." };
  }
  if (status === "active") {
    return { key: "active", tone: "ok", title: "Active", text: "Sending inside each lead's local sending window." };
  }
  // Draft: the backend's preparation_status says how far preparation got.
  if (prep === "preparing" || acquisition === "searching") {
    return { key: "preparing", tone: "info", title: "Preparing", text: "Finding, checking and researching leads. This runs in the background, so it is safe to leave." };
  }
  if (prep === "attention") {
    return { key: "prep_attention", tone: "warn", title: "Preparation needs attention", text: "Preparation stopped before it finished. Open the preparation panel to see what is missing." };
  }
  if (prep === "ready_partial" || (readyCount > 0 && target && readyCount < target)) {
    return { key: "ready_partly", tone: "warn", title: "Ready, partly", text: `${readyCount || "Some"}${target ? ` of ${target}` : ""} leads are ready. You can launch now or widen the audience first.` };
  }
  if (prep === "ready" || readyCount > 0) {
    return { key: "ready", tone: "ok", title: "Ready for review", text: "Drafts are written and waiting for your OK before launch." };
  }
  return { key: "draft", tone: "info", title: "Draft", text: "Created but not prepared yet. Prepare it to find leads and write the first emails." };
}
