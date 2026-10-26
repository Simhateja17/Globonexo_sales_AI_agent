import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import SelectMenu from "./SelectMenu";

const options = [
  { value: "", label: "All phone numbers (2)" },
  { value: "n1", label: "+13525582260" },
  { value: "n2", label: "+14155550142" },
];

describe("SelectMenu", () => {
  afterEach(cleanup);

  it("opens its own list and picks an option", () => {
    const onChange = vi.fn();
    render(<SelectMenu value="" options={options} onChange={onChange} ariaLabel="Filter by phone number" />);
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Filter by phone number/ }));
    expect(screen.getByRole("option", { name: "All phone numbers (2)" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.click(screen.getByRole("option", { name: "+13525582260" }));
    expect(onChange).toHaveBeenCalledWith("n1");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("works from the keyboard and closes on Escape", () => {
    const onChange = vi.fn();
    render(<SelectMenu value="" options={options} onChange={onChange} ariaLabel="Filter by phone number" />);
    const button = screen.getByRole("button", { name: /Filter by phone number/ });
    fireEvent.keyDown(button, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.keyDown(button, { key: "ArrowDown" });
    fireEvent.keyDown(button, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("n1");
    fireEvent.keyDown(button, { key: "ArrowDown" });
    fireEvent.keyDown(button, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
