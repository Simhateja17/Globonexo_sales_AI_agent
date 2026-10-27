import { describe, expect, it } from "vitest";
import {
  DEFAULTS, audienceSentence, buildPayload, buildPreviewRequest, buildStylePayload, campaignDefaultsFromConfig, cadenceDays, followUpGaps, fromServer, productStrength, readDraft, sampleCall, sampleEmail,
  sampleFollowUp, sizeSummary, stepsFor, validateStep, writeDraft,
} from "./onboarding-flow";

const filled = {
  ...DEFAULTS,
  firstName: "Poojitha",
  lastName: "Gobburu",
  company: "Ambel POS",
  industry: "retail",
  productDescription: "Ambel POS is a point-of-sale system for retail stores. It handles billing, inventory and invoices.",
  valueProp: "Stores bill customers faster at the counter.",
  pains: ["Long checkout queues", "Stock running out unnoticed"],
  titles: ["Owner", "Store Manager"],
  targetIndustries: ["retail", "supermarkets"],
  companySizes: ["11,50", "51,200"],
  geos: ["India", "United Arab Emirates"],
};

function memoryStorage() {
  const map = new Map();
  return { getItem: k => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: k => map.delete(k) };
}

describe("stepsFor", () => {
  it("only asks what the channel choice needs", () => {
    expect(stepsFor("email").map(s => s.id)).toEqual(["profile", "product", "audience", "email", "launch"]);
    expect(stepsFor("voice").map(s => s.id)).toEqual(["profile", "product", "audience", "voice", "launch"]);
    expect(stepsFor("both").map(s => s.id)).toEqual(["profile", "product", "audience", "email", "voice", "launch"]);
  });
});

describe("validateStep", () => {
  it("asks for the profile basics", () => {
    expect(validateStep("profile", { ...DEFAULTS })).toMatch(/first name/);
    expect(validateStep("profile", { ...filled, industry: "" })).toMatch(/industry/);
    expect(validateStep("profile", filled)).toBe("");
  });

  it("explains how much more the product answer needs", () => {
    expect(validateStep("product", { ...filled, productDescription: "It is a POS" })).toMatch(/at least 20 characters, you have 11/);
    expect(validateStep("product", filled)).toBe("");
  });

  it("needs titles, a size and a location for the audience", () => {
    expect(validateStep("audience", { ...filled, geos: [] })).toMatch(/location/);
    expect(validateStep("audience", filled)).toBe("");
  });

  it("needs words for a custom tone and calling permission for voice", () => {
    expect(validateStep("email", { ...filled, tone: "custom", customTone: " " })).toMatch(/tone/);
    expect(validateStep("launch", { ...filled, channels: "voice" })).toMatch(/allowed to call/);
    expect(validateStep("launch", { ...filled, channels: "email" })).toBe("");
    expect(validateStep("launch", { ...filled, channels: "email", bookingLink: "not a url" })).toMatch(/booking link/);
  });
});

describe("follow-ups", () => {
  it("turns gaps into send days", () => {
    expect(cadenceDays([3, 4])).toEqual([0, 3, 7]);
    expect(followUpGaps({ ...filled, cadence: "gentle" })).toEqual([4, 6]);
  });

  it("clamps custom gaps", () => {
    expect(followUpGaps({ ...filled, cadence: "custom", customGaps: [0, 2.6, 99] })).toEqual([1, 3, 30]);
  });
});

describe("buildPayload", () => {
  it("maps the answers onto the onboarding API", () => {
    const payload = buildPayload({ ...filled, channels: "email", hook: "story", tone: "direct" });
    expect(payload).toMatchObject({
      firstName: "Poojitha",
      tone: "direct",
      hookStyle: "social_proof",
      painPoints: "Long checkout queues; Stock running out unnoticed",
      followUpCadence: "Day 0, Day 3, Day 7",
      icpCompanySizes: ["11,50", "51,200"],
    });
    expect(payload.preferences.channels).toBe("email");
    expect(payload.preferences.followUpGaps).toEqual([3, 4]);
    expect(payload.preferences.voice).toBeUndefined();
    expect(payload.objections).toBeUndefined();
  });

  it("sends custom tone text and voice settings only when used", () => {
    const payload = buildPayload({ ...filled, channels: "both", tone: "custom", customTone: "Plain and practical.", permissionConfirmed: true });
    expect(payload.tone).toBe("consultative");
    expect(payload.preferences.customTone).toBe("Plain and practical.");
    expect(payload.preferences.voice).toMatchObject({ voice: "warm", goal: "meeting", callDays: [1, 2, 3, 4, 5], permissionConfirmed: true });
    expect(payload.objections).toMatch(/"Don't call me again\." ->/);
  });

  it("keeps every location from a large region", () => {
    const geos = Array.from({ length: 27 }, (_, i) => `Country ${i}`);
    expect(buildPayload({ ...filled, geos }).icpGeos).toHaveLength(27);
  });

  it("skips half-written objections", () => {
    const payload = buildPayload({ ...filled, channels: "voice", objections: [{ q: "Too busy.", a: "" }, { q: "Not now.", a: "When suits you?" }] });
    expect(payload.objections).not.toMatch(/Too busy/);
    expect(payload.objections).toMatch(/Not now/);
  });
});

describe("fromServer", () => {
  it("round-trips a saved setup", () => {
    const payload = buildPayload({ ...filled, channels: "both", cadence: "custom", customGaps: [2, 5], hook: "question", permissionConfirmed: true });
    const config = {
      first_name: payload.firstName, last_name: payload.lastName, company: payload.company, role: payload.role, industry: payload.industry,
      agent_name: payload.agentName, product_description: payload.productDescription, value_proposition: payload.valueProp,
      pain_points: payload.painPoints, tone: payload.tone, hook_style: payload.hookStyle, icp_titles: payload.icpTitles,
      icp_company_sizes: payload.icpCompanySizes, icp_target_industries: payload.icpTargetIndustries, icp_geos: payload.icpGeos,
      objections: payload.objections, onboarding_preferences: payload.preferences, meeting_target: 15, tools: [],
    };
    const restored = fromServer(config);
    expect(restored.channels).toBe("both");
    expect(restored.cadence).toBe("custom");
    expect(restored.customGaps).toEqual([2, 5]);
    expect(restored.hook).toBe("question");
    expect(restored.pains).toEqual(filled.pains);
    expect(restored.objections).toHaveLength(3);
    expect(restored.permissionConfirmed).toBe(true);
  });

  it("ignores empty responses", () => {
    expect(fromServer(null)).toBeNull();
  });
});

describe("previews", () => {
  it("describes the audience in one sentence", () => {
    const text = audienceSentence(filled).map(p => p.text).join("");
    expect(text).toBe("Owner and Store Manager at retail and supermarkets businesses with 11 to 200 employees in India and United Arab Emirates.");
  });

  it("summarises company sizes as one range", () => {
    expect(sizeSummary(["11,50", "51,200"])).toBe("11 to 200");
    expect(sizeSummary(["201,1000", "1001,"])).toBe("201+");
    expect(sizeSummary([])).toBe("Any size");
  });

  it("flags a thin product answer in the sample email", () => {
    const email = sampleEmail({ ...filled, productDescription: "A POS" });
    expect(email.body.flat().some(p => p.weak)).toBe(true);
    expect(email.to).toMatch(/Owner/);
  });

  it("opens every sample call as an AI assistant", () => {
    const call = sampleCall(filled);
    expect(call[0].text[0].text).toMatch(/This is Nexo, an AI assistant calling on behalf of Poojitha at Ambel POS/);
  });

  it("rates how specific the product answer is", () => {
    expect(productStrength("A POS").level).toBe(1);
    expect(productStrength(filled.productDescription).level).toBe(3);
  });
});

describe("draft storage", () => {
  it("saves and restores the current step and answers", () => {
    const store = memoryStorage();
    writeDraft(store, "audience", filled);
    const draft = readDraft(store);
    expect(draft.step).toBe("audience");
    expect(draft.data.company).toBe("Ambel POS");
  });

  it("survives broken storage", () => {
    expect(readDraft({ getItem: () => "{nope" })).toBeNull();
    expect(() => writeDraft({ setItem: () => { throw new Error("full"); } }, "profile", filled)).not.toThrow();
  });
});

describe("after onboarding", () => {
  const config = {
    onboarding_preferences: {
      channels: "voice",
      emailRules: "Keep every email under 90 words.",
      followUpGaps: [2, 5],
      voice: { openingLine: "We help stores bill faster.", goal: "meeting", callDays: [5, 1], maxAttempts: 2, callsPerHour: 8, practiceCallsFirst: false, rules: "Under 3 minutes." },
    },
  };

  it("starts voice campaigns from the call style", () => {
    const voice = campaignDefaultsFromConfig(config, "voice");
    expect(voice).toMatchObject({ callCadencePerHour: 8, maxCallAttempts: 2, allowedWeekdays: [1, 5], simulationEnabled: false, stepDelays: [0, 2, 5] });
    expect(voice.promptNotes).toContain("We help stores bill faster.");
    expect(voice.promptNotes).toContain("A good call ends with a booked meeting.");
    expect(voice.promptNotes).not.toContain("90 words");
  });

  it("starts email campaigns from the email rules", () => {
    const email = campaignDefaultsFromConfig(config, "email");
    expect(email.promptNotes).toContain("Keep every email under 90 words.");
    expect(email.promptNotes).not.toContain("bill faster");
  });

  it("keeps page defaults when nothing was saved", () => {
    expect(campaignDefaultsFromConfig(null, "voice")).toMatchObject({ promptNotes: "", callCadencePerHour: null, stepDelays: null });
  });

  it("saves the style from Settings, clearing a removed custom tone", () => {
    const payload = buildStylePayload({ ...filled, channels: "email", customTone: "", hook: "question", voiceId: "openai-Coral", voiceName: "Coral" });
    expect(payload).toMatchObject({ hookStyle: "question_led", followUpCadence: "Day 0, Day 3, Day 7" });
    expect(payload.preferences).toMatchObject({ channels: "email", customTone: "", customHook: "" });
    expect(payload.preferences.voice).toMatchObject({ voiceId: "openai-Coral", voiceName: "Coral" });
  });

  it("round-trips a picked Retell voice", () => {
    const payload = buildPayload({ ...filled, channels: "voice", voiceId: "openai-Coral", voiceName: "Coral", permissionConfirmed: true });
    const restored = fromServer({ product_description: "x", onboarding_preferences: payload.preferences });
    expect(restored.voiceId).toBe("openai-Coral");
    expect(restored.voiceName).toBe("Coral");
  });

  it("asks for an email preview in the user's own words", () => {
    const request = buildPreviewRequest({ ...filled, tone: "custom", customTone: "Be authoritative.", hook: "custom", customHook: "Start with their city." });
    expect(request).toMatchObject({ tone: "consultative", customTone: "Be authoritative.", hookStyle: "pain_based", customHook: "Start with their city.", recipientTitle: "Owner", recipientIndustry: "retail" });
    expect(buildPreviewRequest({ ...filled, tone: "direct", customTone: "ignored" }).customTone).toBe("");
  });
});

describe("sampleFollowUp", () => {
  it("replies in the same thread and the last one steps back", () => {
    const second = sampleFollowUp(filled, 2, false);
    expect(second.subject).toMatch(/^Re: /);
    expect(second.body.flat().map(p => p.text).join(" ")).toMatch(/long checkout queues/);
    const last = sampleFollowUp(filled, 4, true);
    expect(last.body.flat().map(p => p.text).join(" ")).toMatch(/step back/);
  });
});
