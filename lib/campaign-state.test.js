import { describe, expect, it } from "vitest";
import { campaignLifecycle } from "./campaign-state";

describe("campaignLifecycle", () => {
  it("puts a suspended pause ahead of a plain pause", () => {
    expect(campaignLifecycle({ status: "paused", suspensionReason: "email_account_needs_attention" }).key).toBe("paused_problem");
    expect(campaignLifecycle({ status: "paused", suspensionReason: "free_inactive" }).key).toBe("paused_inactive");
    expect(campaignLifecycle({ status: "paused" }).key).toBe("paused");
  });

  it("reports audience and credit stops on a running campaign", () => {
    expect(campaignLifecycle({ status: "active", acquisitionStatus: "audience_exhausted", targetQualifiedLeads: 25 }).key).toBe("audience_exhausted");
    expect(campaignLifecycle({ status: "active", acquisitionStatus: "credit_limit_reached" }).key).toBe("credit_limit");
  });

  it("walks a draft through preparation", () => {
    expect(campaignLifecycle({ status: "draft", preparationStatus: "not_started" }).key).toBe("draft");
    expect(campaignLifecycle({ status: "draft", preparationStatus: "preparing" }).key).toBe("preparing");
    expect(campaignLifecycle({ status: "draft", preparationStatus: "ready_partial", targetQualifiedLeads: 25 }, { readyCount: 9 }).text).toContain("9 of 25");
    expect(campaignLifecycle({ status: "draft", preparationStatus: "ready" }).key).toBe("ready");
  });

  it("marks completed campaigns", () => {
    expect(campaignLifecycle({ status: "completed", acquisitionStatus: "audience_exhausted" }).key).toBe("completed");
  });
});
