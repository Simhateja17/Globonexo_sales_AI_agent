import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const apiMock = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn() }));

vi.mock("../../lib/api", () => ({ default: apiMock }));

import SendEmailDialog from "./SendEmailDialog";

const lead = { id: "lead-1", firstName: "Simha", name: "Simha Teja Ugrarapu", email: "couture.founders@gmail.com" };
const campaign = { id: "campaign-1", name: "Ambel POS - First outreach", channel: "email", status: "draft" };
const outreach = draft => ({ data: { campaign, draft } });

describe("SendEmailDialog", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("says the email is being written instead of offering to send nothing", async () => {
    apiMock.get.mockResolvedValue(outreach({ state: "writing" }));
    render(<SendEmailDialog lead={lead} onClose={() => {}} />);
    expect(await screen.findByText(/Writing an email to Simha Teja Ugrarapu/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^Send now$/ })).toBeNull();
  });

  it("lets the person write and send the email when AI credits are used up", async () => {
    apiMock.get.mockResolvedValue(outreach({ state: "write_yourself", reasonCode: "ai_credits_exhausted", reason: "Your AI credits are used up, so this email was not written." }));
    apiMock.put.mockResolvedValue(outreach({ state: "ready", status: "approved", messageId: "message-1", subject: "Hello", body: "Hi Simha" }));
    apiMock.post.mockResolvedValue({ data: { success: true, lead: { ...lead, status: "contacted" } } });
    const onSent = vi.fn();
    const onClose = vi.fn();
    render(<SendEmailDialog lead={lead} onClose={onClose} onSent={onSent} />);

    expect(await screen.findByText(/AI credits are used up/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Add credits" })).toBeTruthy();
    // Asking the AI again would only be refused again.
    expect(screen.queryByRole("button", { name: /Ask AI/ })).toBeNull();

    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Hello" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hi Simha" } });
    fireEvent.click(screen.getByRole("button", { name: /Save and send now/ }));

    await waitFor(() => expect(onSent).toHaveBeenCalled());
    expect(apiMock.put).toHaveBeenCalledWith("/leads/lead-1/draft", { campaignId: "campaign-1", subject: "Hello", body: "Hi Simha" });
    expect(apiMock.post).toHaveBeenCalledWith("/leads/lead-1/send-now", { campaignId: "campaign-1", messageId: "message-1" });
    expect(onClose).toHaveBeenCalled();
  });

  it("asks for a missing job title, saves it on the lead and hands it back to the AI", async () => {
    apiMock.get.mockResolvedValue(outreach({ state: "needs_info", missing: ["title"], reason: "The AI needs this lead's job title to write the email." }));
    apiMock.patch = vi.fn().mockResolvedValue({ data: { ...lead, title: "CEO" } });
    apiMock.post.mockResolvedValue(outreach({ state: "writing" }));
    render(<SendEmailDialog lead={lead} onClose={() => {}} />);

    fireEvent.change(await screen.findByLabelText("Job title"), { target: { value: "CEO" } });
    fireEvent.click(screen.getByRole("button", { name: /Save and write email/ }));

    await waitFor(() => expect(apiMock.patch).toHaveBeenCalledWith("/leads/lead-1", { title: "CEO" }));
    expect(apiMock.post).toHaveBeenCalledWith("/leads/lead-1/draft/generate", { campaignId: "campaign-1" });
    expect(await screen.findByText(/Writing an email to Simha Teja Ugrarapu/)).toBeTruthy();
  });

  it("sends exactly the email that was shown", async () => {
    apiMock.get.mockResolvedValue(outreach({ state: "ready", status: "draft", messageId: "message-9", subject: "Quick idea", body: "Hi Simha, ..." }));
    apiMock.post.mockResolvedValue({ data: { success: true } });
    render(<SendEmailDialog lead={lead} onClose={() => {}} />);

    expect(await screen.findByText("Quick idea")).toBeTruthy();
    expect(screen.getByText(/has not launched yet/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Send now/ }));
    await waitFor(() => expect(apiMock.post).toHaveBeenCalledWith("/leads/lead-1/send-now", { campaignId: "campaign-1", messageId: "message-9" }));
  });

  it("shows the server's sentence, never its code, when a send is refused", async () => {
    apiMock.get.mockResolvedValue(outreach({ state: "ready", status: "approved", messageId: "message-9", subject: "Quick idea", body: "Hi" }));
    apiMock.post.mockRejectedValue({ response: { data: { error: "You have sent all 50 of today's emails. This one can go tomorrow.", details: { code: "daily_cap_reached" } } } });
    render(<SendEmailDialog lead={lead} onClose={() => {}} />);

    fireEvent.click(await screen.findByRole("button", { name: /Send now/ }));
    expect(await screen.findByText(/all 50 of today's emails/)).toBeTruthy();
    expect(screen.queryByText(/daily_cap_reached/)).toBeNull();
  });
});
