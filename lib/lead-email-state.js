// Mirrors the backend's lead-email-draft states. Every lead view describes a
// lead's first email from the same function, so the drawer, the full profile
// and the campaign table never disagree about it.

export const AI_CREDITS_EXHAUSTED = "ai_credits_exhausted";
// Matches the backend: a lead still "being written" after this is stuck.
const WRITING_STALL_MS = 10 * 60 * 1000;
const WRITING_READINESS = new Set(["discovered", "enriching", "researching", "generating"]);

/** Whether a lead's campaign sends email ("both" is legacy, but it does). */
export function campaignSendsEmail(campaign) {
  return campaign?.channel === "email" || campaign?.channel === "both";
}

/** One line (and a detail) for "Next step" on a lead. */
export function outreachSummary(outreach) {
  const campaign = outreach?.campaign;
  if (!campaign) return { title: "Not in a campaign yet", detail: "Add this lead to a campaign to write their first email" };
  const inCampaign = `In ${campaign.name}`;
  if (!campaignSendsEmail(campaign)) return { title: inCampaign, detail: "Calls are scheduled by the campaign" };
  const draft = outreach.draft;
  switch (draft?.state) {
    case "writing":
      return { title: "Writing email…", detail: `${inCampaign} · ready to review in a few seconds`, busy: true };
    case "ready":
      if (draft.status === "queued") return { title: "Sending now", detail: inCampaign };
      if (draft.status === "approved") {
        return { title: "Email approved", detail: campaign.status === "active" ? `${inCampaign} · sends on schedule` : `${inCampaign} · sends when the campaign launches` };
      }
      return { title: "Email ready for your OK", detail: `${inCampaign} · review it, then send` };
    case "sent":
      return { title: "First email sent", detail: inCampaign };
    case "write_yourself":
      return { title: draft.reasonCode === AI_CREDITS_EXHAUSTED ? "AI credits used up" : "Email not written", detail: "Write this email yourself", tone: "warn" };
    case "blocked":
      return { title: "Can't email this lead", detail: draft.reason, tone: "bad" };
    default:
      return { title: "Email not written yet", detail: inCampaign };
  }
}

/**
 * The label on a lead's email button, and whether it can be pressed. Pressing
 * it always opens the email first; nothing is sent without being read.
 */
export function sendButtonState(outreach, { hasEmail = true, stopped = false } = {}) {
  if (!hasEmail) return { label: "Send now", disabled: true, title: "Lead needs an email" };
  if (stopped) return { label: "Send now", disabled: true, title: "Sequence is stopped for this lead" };
  const campaign = outreach?.campaign;
  if (!campaign) return { label: "Send now", disabled: true, title: "Add this lead to an email campaign first" };
  if (!campaignSendsEmail(campaign)) return { label: "Send now", disabled: true, title: "This lead's campaign does not send email" };
  const draft = outreach.draft;
  switch (draft?.state) {
    case "writing":
      return { label: "Writing email…", disabled: true, busy: true, title: "Your agent is writing this email" };
    case "ready":
      return draft.status === "queued"
        ? { label: "Sending…", disabled: true, busy: true, title: "This email is being sent" }
        : { label: "Send now", disabled: false, title: "Read the email, then send it" };
    case "sent":
      return { label: "Sent", disabled: true, title: "Step 1 has already been sent" };
    case "blocked":
      return { label: "Send now", disabled: true, title: draft.reason || "This lead cannot be emailed" };
    default:
      return { label: "Write email", disabled: false, title: "Write this lead's first email" };
  }
}

/**
 * A short label for a campaign lead, from the campaign's preparation
 * readiness rows. Null when there is nothing worth saying.
 */
export function readinessEmailLabel(row, now = Date.now()) {
  if (!row || row.channel !== "email") return null;
  if (WRITING_READINESS.has(row.status)) {
    const updated = row.updated_at ? new Date(row.updated_at).getTime() : NaN;
    if (Number.isFinite(updated) && now - updated > WRITING_STALL_MS) return { label: "Email not written · write it yourself", tone: "warn" };
    return { label: "Writing email…", tone: "busy" };
  }
  if (row.status === "validating") return { label: "Email needs your OK", tone: "info" };
  if (row.status === "blocked" && row.blocked_reason === AI_CREDITS_EXHAUSTED) return { label: "AI credits used up · write it yourself", tone: "warn" };
  if (row.status === "blocked" && row.blocked_reason === "generation_failed") return { label: "AI couldn't write this · write it yourself", tone: "warn" };
  return null;
}

/** Counts for the campaign's "Writing emails" step. */
export function writingCounts(readiness = [], now = Date.now()) {
  let writing = 0;
  let writeYourself = 0;
  let creditsExhausted = 0;
  for (const row of readiness) {
    const label = readinessEmailLabel(row, now);
    if (!label) continue;
    if (label.tone === "busy") writing++;
    if (label.tone === "warn") writeYourself++;
    if (row.blocked_reason === AI_CREDITS_EXHAUSTED) creditsExhausted++;
  }
  return { writing, writeYourself, creditsExhausted };
}

/** Whether preparation data still has emails being written, so it is worth polling. */
export function hasEmailsBeingWritten(readiness = [], now = Date.now()) {
  return writingCounts(readiness, now).writing > 0;
}
