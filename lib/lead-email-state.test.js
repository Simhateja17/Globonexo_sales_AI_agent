import { describe, expect, it } from "vitest";
import {
  AI_CREDITS_EXHAUSTED,
  hasEmailsBeingWritten,
  outreachSummary,
  readinessEmailLabel,
  sendButtonState,
  writingCounts,
} from "./lead-email-state";
import { shouldPollCampaignPreparation } from "./campaign-display";

const campaign = { id: "c-1", name: "Ambel POS - First outreach", channel: "email", status: "draft" };
const now = Date.parse("2026-10-26T12:00:00Z");

describe("outreachSummary", () => {
  it("names the campaign the lead is actually in", () => {
    expect(outreachSummary({ campaign, draft: { state: "not_started" } }).detail).toContain("Ambel POS");
    expect(outreachSummary({ campaign: null, draft: null }).title).toBe("Not in a campaign yet");
  });

  it("shows the email being written", () => {
    expect(outreachSummary({ campaign, draft: { state: "writing" } })).toMatchObject({ title: "Writing email…", busy: true });
  });

  it("tells a draft campaign's approved email it waits for launch", () => {
    const summary = outreachSummary({ campaign, draft: { state: "ready", status: "approved" } });
    expect(summary.detail).toContain("launches");
  });

  it("asks the person to write the email when AI credits are used up", () => {
    const summary = outreachSummary({ campaign, draft: { state: "write_yourself", reasonCode: AI_CREDITS_EXHAUSTED } });
    expect(summary).toMatchObject({ title: "AI credits used up", detail: "Write this email yourself" });
  });
});

describe("sendButtonState", () => {
  it("cannot be pressed while the email is being written", () => {
    expect(sendButtonState({ campaign, draft: { state: "writing" } })).toMatchObject({ label: "Writing email…", disabled: true });
  });

  it("opens the email to read before sending once it is written", () => {
    expect(sendButtonState({ campaign, draft: { state: "ready", status: "draft" } })).toMatchObject({ label: "Send now", disabled: false });
  });

  it("offers to write the email when there is none", () => {
    expect(sendButtonState({ campaign, draft: { state: "write_yourself" } })).toMatchObject({ label: "Write email", disabled: false });
    expect(sendButtonState({ campaign, draft: { state: "not_started" } })).toMatchObject({ label: "Write email", disabled: false });
  });

  it("stays off without a campaign, an email or for a stopped lead", () => {
    expect(sendButtonState({ campaign: null }).disabled).toBe(true);
    expect(sendButtonState({ campaign, draft: { state: "ready" } }, { hasEmail: false }).disabled).toBe(true);
    expect(sendButtonState({ campaign, draft: { state: "ready" } }, { stopped: true }).disabled).toBe(true);
  });
});

describe("campaign readiness labels", () => {
  const row = (status, blocked_reason = null, ageMs = 0) => ({
    channel: "email", status, blocked_reason, updated_at: new Date(now - ageMs).toISOString(),
  });

  it("labels each lead's email for the campaign table", () => {
    expect(readinessEmailLabel(row("researching"), now)).toMatchObject({ label: "Writing email…" });
    expect(readinessEmailLabel(row("validating"), now)).toMatchObject({ label: "Email needs your OK" });
    expect(readinessEmailLabel(row("blocked", AI_CREDITS_EXHAUSTED), now).label).toContain("write it yourself");
    expect(readinessEmailLabel(row("ready"), now)).toBeNull();
    expect(readinessEmailLabel({ ...row("generating"), channel: "voice" }, now)).toBeNull();
  });

  it("stops calling a stuck lead 'writing'", () => {
    expect(readinessEmailLabel(row("generating", null, 11 * 60 * 1000), now).tone).toBe("warn");
  });

  it("counts what the Writing emails step reports", () => {
    const counts = writingCounts([row("generating"), row("blocked", AI_CREDITS_EXHAUSTED), row("ready")], now);
    expect(counts).toEqual({ writing: 1, writeYourself: 1, creditsExhausted: 1 });
  });

  it("keeps the campaign page polling while an email is being written", () => {
    expect(hasEmailsBeingWritten([row("researching", null, 0)])).toBe(true);
    expect(shouldPollCampaignPreparation({ campaign: { preparation_status: "attention" }, readiness: [{ channel: "email", status: "researching", updated_at: new Date().toISOString() }] })).toBe(true);
    expect(shouldPollCampaignPreparation({ campaign: { preparation_status: "attention" }, readiness: [] })).toBe(false);
  });
});
