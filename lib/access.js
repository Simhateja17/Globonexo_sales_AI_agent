"use client";
import { createContext, useContext } from "react";

// Who sees what. One table for the whole customer app: the sidebar, page
// guards, and in-page sections all read from here. Rule: if a role cannot use
// something it is hidden, not disabled. The server still enforces every action.
const ALL = ["owner", "admin", "member"];
const MANAGERS = ["owner", "admin"];
const OWNER = ["owner"];

export const ACCESS = {
  // Pages (sidebar items and direct URLs)
  "page.dashboard": ALL,
  "page.setup": MANAGERS,
  "page.agent": ALL,
  "page.prospects": ALL,
  "page.pipeline": ALL,
  "page.campaigns": ALL,
  "page.inbox": ALL,
  "page.calls": ALL,
  "page.calendar": ALL,
  "page.analytics": ALL,
  "page.billing": ALL,
  "page.settings": MANAGERS,
  "page.settings/senders": MANAGERS,
  "page.settings/team": ALL,
  "page.support": ALL,
  // Sections and controls
  "billing.planControls": OWNER,
  "team.invite": MANAGERS,
  "team.pendingInvitations": MANAGERS,
  "team.remove": MANAGERS,
  "team.changeRole": OWNER,
  "team.accessPriority": OWNER,
  "team.ownershipTransfer": OWNER,
  "team.activity": MANAGERS,
  "campaign.delete": OWNER,
  "campaign.assign": MANAGERS,
  "campaign.manageSenders": MANAGERS,
};

export function canSee(role, key) {
  const roles = ACCESS[key];
  if (!roles) return true;
  return Boolean(role) && roles.includes(role);
}

// Maps an app path to the most specific page key in the table, or null when
// the path is not listed (unlisted pages are not guarded).
export function pageKeyForPath(pathname) {
  const parts = (pathname || "/").split("/").filter(Boolean);
  for (let i = parts.length; i > 0; i -= 1) {
    const key = `page.${parts.slice(0, i).join("/")}`;
    if (ACCESS[key]) return key;
  }
  return null;
}

export const RoleContext = createContext(null);
export function useRole() { return useContext(RoleContext); }
export function useCanSee(key) { return canSee(useContext(RoleContext), key); }
