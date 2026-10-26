"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "./api";

export {
  AI_CREDITS_EXHAUSTED,
  campaignSendsEmail,
  hasEmailsBeingWritten,
  listMissingFields,
  MISSING_CONTEXT,
  missingEmailWriterFields,
  outreachSummary,
  readinessEmailLabel,
  sendButtonState,
  writingCounts,
} from "./lead-email-state";

const WRITING_POLL_MS = 3000;

/**
 * Loads a lead's campaign and first-email state, and keeps polling while the
 * email is being written so the draft appears without a reload.
 */
export function useLeadOutreach(leadId, { campaignId, enabled = true } = {}) {
  const [outreach, setOutreach] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const request = useRef(0);

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!leadId || !enabled) return null;
    const current = ++request.current;
    if (!quiet) setLoading(true);
    try {
      const { data } = await api.get(`/leads/${leadId}/outreach`, campaignId ? { params: { campaignId } } : undefined);
      if (current !== request.current) return null;
      setOutreach(data ?? null);
      setError("");
      return data ?? null;
    } catch (err) {
      if (current === request.current && !quiet) setError(err?.response?.data?.error || "This lead's email could not be loaded.");
      return null;
    } finally {
      if (current === request.current && !quiet) setLoading(false);
    }
  }, [leadId, campaignId, enabled]);

  useEffect(() => {
    setOutreach(null);
    load();
  }, [load]);

  const writing = outreach?.draft?.state === "writing" || outreach?.draft?.status === "queued";
  useEffect(() => {
    if (!writing) return undefined;
    const timer = window.setInterval(() => load({ quiet: true }), WRITING_POLL_MS);
    return () => window.clearInterval(timer);
  }, [writing, load]);

  return { outreach, setOutreach, loading, error, reload: load };
}
