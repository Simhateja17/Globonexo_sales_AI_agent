import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

import LandingPage from "./LandingPage";

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true });
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: { getItem: vi.fn(() => null) },
  });
});

afterEach(cleanup);

describe("LandingPage authentication navigation", () => {
  it("always sends a signed-out visitor to the sign-in page", () => {
    render(<LandingPage />);

    expect(screen.getByRole("link", { name: "Sign in" }).getAttribute("href")).toBe("/login");

    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByRole("link", { name: "Sign in" }))
      .toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Sign in" })
      .every((link) => link.getAttribute("href") === "/login"))
      .toBe(true);
  });
});
