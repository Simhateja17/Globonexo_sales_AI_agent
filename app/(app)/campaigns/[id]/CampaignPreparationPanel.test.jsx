import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const apiMock = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("../../../../lib/api", () => ({ default: apiMock }));

import CampaignPreparationPanel from "./CampaignPreparationPanel";

// A Free campaign made before Free stopped searching still carries that
// search's empty run. It must not be shown.
const preparation = {
  campaign: { preparation_status: "not_started", preparation_progress: 0, target_qualified_leads: 25 },
  readinessCounts: { ready: 0 },
  latestImport: {
    status: "partial", isTerminal: true, qualified: 0, requested: 10, candidatesFound: 0,
    candidatesAttempted: 0, pagesSearched: 1, duplicates: 0, rejected: 0, failed: 0,
  },
  events: [],
};

describe("CampaignPreparationPanel on the Free plan", () => {
  afterEach(() => {
    cleanup();
    apiMock.get.mockReset();
  });

  it("asks for the customer's own leads instead of showing a lead search", async () => {
    apiMock.get.mockResolvedValue({ data: preparation });
    render(<CampaignPreparationPanel campaignId="c-1" channel="email" campaignStatus="draft" freePlan leadCount={0} />);

    expect(await screen.findByText("Add your leads to start")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Import CSV/ }).getAttribute("href")).toBe("/prospects?tab=csv&campaignId=c-1");
    expect(screen.queryByText(/No contactable leads found/)).toBeNull();
    expect(screen.queryByText(/Lead acquisition/)).toBeNull();
    expect(screen.queryByText(/submitted for enrichment/)).toBeNull();
    expect(screen.queryByText(/target prospects/)).toBeNull();
  });

  it("still shows the search run on paid plans", async () => {
    apiMock.get.mockResolvedValue({ data: preparation });
    render(<CampaignPreparationPanel campaignId="c-1" channel="email" campaignStatus="draft" leadCount={0} />);

    expect(await screen.findByText("No contactable leads found")).toBeTruthy();
  });
});
