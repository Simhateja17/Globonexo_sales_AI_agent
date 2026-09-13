import { describe, expect, it } from "vitest";
import {
  ACTIVE_ATTEMPT_STATUSES,
  CALL_NOW_ACTIVE_RETRY_MS,
  callNowLimitFromError,
  formatRetryTime,
  outreachAttemptLabel,
} from "./outreach-status";

describe("outreachAttemptLabel", () => {
  it("says a busy call is waiting for a free line", () => {
    expect(outreachAttemptLabel({ status: "waiting_for_line", scheduled_at: "2026-09-14T10:00:00Z" })).toBe("Waiting for a free line");
  });

  it("explains a call moved past today's calling hours", () => {
    expect(outreachAttemptLabel({ status: "scheduled", schedule_reason: "outside_calling_hours", scheduled_at: "2026-09-15T13:00:00Z" }))
      .toBe("Moved to next calling window, today's hours ended");
  });

  it("labels a scheduled call that Call now replaced", () => {
    expect(outreachAttemptLabel({ status: "cancelled", blocked_reason: "replaced_by_call_now" })).toBe("Replaced by Call now");
  });

  it("labels a plain scheduled attempt", () => {
    expect(outreachAttemptLabel({ status: "scheduled", schedule_reason: "initial_voice_slot" })).toBe("Scheduled");
  });

  it("makes other statuses and blocked reasons readable", () => {
    expect(outreachAttemptLabel({ status: "calling" })).toBe("Calling now");
    expect(outreachAttemptLabel({ status: "blocked", blocked_reason: "campaign_paused" })).toBe("Blocked: campaign paused");
    expect(outreachAttemptLabel({ status: "some_new_status" })).toBe("Some new status");
    expect(outreachAttemptLabel(null)).toBe("Not scheduled");
  });

  it("treats waiting for a line as an upcoming attempt", () => {
    expect(ACTIVE_ATTEMPT_STATUSES).toContain("waiting_for_line");
  });
});

describe("formatRetryTime", () => {
  it("shows a short clock time", () => {
    expect(formatRetryTime("2026-09-14T15:40:00Z", { timeZone: "UTC" })).toBe("3:40 PM");
    expect(formatRetryTime("2026-09-14T15:40:00Z", { timeZone: "Asia/Kolkata" })).toBe("9:10 PM");
  });

  it("returns null for a missing or bad time", () => {
    expect(formatRetryTime(undefined)).toBeNull();
    expect(formatRetryTime("not a date")).toBeNull();
  });
});

describe("callNowLimitFromError", () => {
  const now = Date.parse("2026-09-14T15:00:00Z");
  const tooMany = (data) => ({ response: { status: 429, data } });

  it("adds the time Call now is available again for the hourly limit", () => {
    const result = callNowLimitFromError(tooMany({
      error: "You've used Call now 20 times this hour.",
      details: { code: "call_now_hourly_limit", limit: 20, retryAt: "2026-09-14T15:40:00Z" },
    }), { now, timeZone: "UTC" });
    expect(result).toEqual({
      code: "call_now_hourly_limit",
      message: "You've used Call now 20 times this hour. Available again at 3:40 PM",
      until: Date.parse("2026-09-14T15:40:00Z"),
    });
  });

  it("greys out for about 30 seconds on the in-progress limit", () => {
    const error = "You already have 2 instant calls in progress. Try again when one finishes.";
    const result = callNowLimitFromError(tooMany({ error, details: { code: "call_now_active_limit", limit: 2 } }), { now });
    expect(result).toEqual({ code: "call_now_active_limit", message: error, until: now + CALL_NOW_ACTIVE_RETRY_MS });
  });

  it("still works when retryAt is missing", () => {
    const result = callNowLimitFromError(tooMany({ error: "You've used Call now 20 times this hour.", details: { code: "call_now_hourly_limit" } }), { now });
    expect(result.message).toBe("You've used Call now 20 times this hour.");
    expect(result.until).toBe(now + CALL_NOW_ACTIVE_RETRY_MS);
  });

  it("ignores other errors", () => {
    expect(callNowLimitFromError({ response: { status: 400, data: { error: "Lead needs a phone" } } })).toBeNull();
    expect(callNowLimitFromError(tooMany({ error: "Too many requests" }))).toBeNull();
    expect(callNowLimitFromError(new Error("Network Error"))).toBeNull();
  });
});
