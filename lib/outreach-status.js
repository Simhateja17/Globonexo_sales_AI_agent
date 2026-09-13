// Friendly wording for outreach attempts (the "next call / next email" line)
// and for the "Call now" limits. Shared by the campaign and prospects pages so
// both say the same thing.

// Attempts that are still upcoming or in flight. `waiting_for_line` means the
// call is due but every phone line is busy.
export const ACTIVE_ATTEMPT_STATUSES = [
  "planned",
  "scheduled",
  "waiting_for_line",
  "processing",
  "calling",
  "paused",
  "blocked",
  "rescheduling",
];

const STATUS_LABELS = {
  planned: "Planned",
  scheduled: "Scheduled",
  waiting_for_line: "Waiting for a free line",
  processing: "Starting",
  calling: "Calling now",
  sent: "Sent",
  completed: "Completed",
  paused: "Paused",
  blocked: "Blocked",
  cancelled: "Cancelled",
  failed: "Failed",
  rescheduling: "Rescheduling",
};

const BLOCKED_REASON_LABELS = {
  replaced_by_call_now: "Replaced by Call now",
};

const SCHEDULE_REASON_LABELS = {
  outside_calling_hours: "Moved to next calling window, today's hours ended",
};

function humanize(value) {
  const text = String(value || "").replace(/_/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export function outreachAttemptLabel(attempt) {
  if (!attempt) return "Not scheduled";
  const { status, blocked_reason: blockedReason, schedule_reason: scheduleReason } = attempt;

  if (blockedReason) {
    return BLOCKED_REASON_LABELS[blockedReason] || `Blocked: ${humanize(blockedReason).toLowerCase()}`;
  }
  if (status === "waiting_for_line") return STATUS_LABELS.waiting_for_line;
  if (SCHEDULE_REASON_LABELS[scheduleReason] && (status === "scheduled" || status === "rescheduling")) {
    return SCHEDULE_REASON_LABELS[scheduleReason];
  }
  return STATUS_LABELS[status] || humanize(status) || "Not scheduled";
}

export const CALL_NOW_ACTIVE_LIMIT = "call_now_active_limit";
export const CALL_NOW_HOURLY_LIMIT = "call_now_hourly_limit";
export const CALL_NOW_ACTIVE_RETRY_MS = 30_000;

// Short local clock time, e.g. "3:40 PM". `timeZone` is only for tests; the
// page leaves it out so the viewer's own time zone is used.
export function formatRetryTime(retryAt, { timeZone } = {}) {
  if (!retryAt) return null;
  const date = new Date(retryAt);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(date);
}

// Turns a 429 from POST /leads/:id/call-now into what the page shows:
// the message, and until when the Call now buttons stay greyed out.
// Returns null for any other error so existing handling still applies.
export function callNowLimitFromError(err, { now = Date.now(), timeZone } = {}) {
  const response = err?.response;
  if (response?.status !== 429) return null;
  const body = response.data || {};
  const code = body.details?.code;

  if (code === CALL_NOW_HOURLY_LIMIT) {
    const base = body.error || "You've used Call now too many times this hour.";
    const time = formatRetryTime(body.details?.retryAt, { timeZone });
    const retryMs = time ? new Date(body.details.retryAt).getTime() : now + CALL_NOW_ACTIVE_RETRY_MS;
    return {
      code,
      message: time ? `${base} Available again at ${time}` : base,
      until: retryMs,
    };
  }

  if (code === CALL_NOW_ACTIVE_LIMIT) {
    return {
      code,
      message: body.error || "You already have instant calls in progress. Try again when one finishes.",
      until: now + CALL_NOW_ACTIVE_RETRY_MS,
    };
  }

  return null;
}
