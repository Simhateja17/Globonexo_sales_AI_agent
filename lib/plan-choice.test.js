import { describe, expect, it } from "vitest";
import {
  canUseFree, effectivePlanId, freeUnavailableReason, needsCheckout, needsPlanChoice, planCard, readPlanChoice, writePlanChoice,
} from "./plan-choice";
import { FREE_PLAN, findPlan } from "./plans";

function memoryStorage() {
  const map = new Map();
  return { getItem: k => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: k => map.delete(k) };
}

const freeOrg = { plan_id: "free", subscription_status: "free" };
const unpaidOrg = { plan_id: "starter", subscription_status: "payment_required" };
const agencyOrg = { plan_id: "growth", subscription_status: "active" };
const agency = { planId: "growth", billingPeriod: "annual" };

describe("plan choice storage", () => {
  it("remembers the plan and billing period", () => {
    const store = memoryStorage();
    writePlanChoice(store, agency);
    expect(readPlanChoice(store)).toEqual(agency);
  });

  it("ignores unknown plans and broken storage", () => {
    const store = memoryStorage();
    store.setItem("gnx_plan_choice", JSON.stringify({ planId: "enterprise" }));
    expect(readPlanChoice(store)).toBeNull();
    expect(readPlanChoice({ getItem: () => "{nope" })).toBeNull();
  });
});

describe("who pays and when", () => {
  it("lets Free go straight ahead with no checkout", () => {
    expect(needsCheckout(freeOrg, { planId: "free", billingPeriod: "annual" })).toBe(false);
    expect(effectivePlanId(freeOrg, { planId: "free" })).toBe("free");
    expect(needsPlanChoice(freeOrg, null)).toBe(false);
  });

  it("charges a picked paid plan at launch, even from Free", () => {
    expect(needsCheckout(freeOrg, agency)).toBe(true);
    expect(needsCheckout(unpaidOrg, agency)).toBe(true);
    expect(effectivePlanId(freeOrg, agency)).toBe("growth");
  });

  it("skips checkout once that plan is paid", () => {
    expect(needsCheckout(agencyOrg, agency)).toBe(false);
    expect(effectivePlanId(agencyOrg, { planId: "starter" })).toBe("growth");
  });

  it("sends an unpaid workspace without a paid pick to the plan page", () => {
    expect(needsPlanChoice(unpaidOrg, null)).toBe(true);
    expect(needsPlanChoice(unpaidOrg, { planId: "free" })).toBe(true);
    expect(needsPlanChoice(unpaidOrg, agency)).toBe(false);
  });

  it("only offers Free to workspaces sign-up put on it", () => {
    expect(canUseFree(freeOrg)).toBe(true);
    expect(canUseFree(unpaidOrg)).toBe(false);
    expect(freeUnavailableReason("personal_email")).toMatch(/work email/);
    expect(freeUnavailableReason("domain_taken")).toMatch(/invite you/);
  });
});

describe("plan cards", () => {
  it("shows the yearly and monthly prices from the catalogue", () => {
    const plan = findPlan("growth");
    expect(planCard(plan, true)).toMatchObject({ price: "$149", billed: "Billed $1,788 yearly" });
    expect(planCard(plan, false)).toMatchObject({ price: "$179", billed: "Billed monthly" });
    expect(planCard(plan, true).feats).toEqual(["5,370 credits a month", "Verified lead search", "AI voice calling, 3 numbers", "10 sending inboxes"]);
    expect(planCard(findPlan("starter"), true).feats).toContain("1 sending inbox");
  });

  it("shows what Free leaves out", () => {
    const card = planCard(FREE_PLAN, true);
    expect(card.stats[0]).toEqual(["Emails / month", "900"]);
    expect(card.missing).toEqual(["Verified lead search", "AI voice calling"]);
  });
});
