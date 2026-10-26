"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StateNote from "./StateNote";
import api from "../../lib/api";

// Tells people why an inbox is sending fewer emails than its limit: slow
// start is on, so a new (or newly warmed) inbox builds up its daily volume.
// Pass `accounts` when the page already has the inbox list; otherwise the
// note loads it. `showAction` hides the link when already on Settings.
export default function InboxWarmupNote({ accounts: given = null, showAction = true }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState([]);

  useEffect(() => {
    if (given) return undefined;
    let active = true;
    api.get("/email-accounts")
      .then(({ data }) => {
        if (active) setLoaded(Array.isArray(data?.accounts) ? data.accounts : []);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [given]);

  const accounts = given ?? loaded;
  const warming = accounts.filter(account => account.status === "active" && account.warmup?.active);
  if (warming.length === 0) return null;

  const first = warming[0];
  const title = warming.length === 1
    ? `${first.email} is warming up: day ${first.warmup.day} of ${first.warmup.totalDays}`
    : `${warming.length} inboxes are warming up`;
  const text = warming.length === 1
    ? `It can send ${first.todayLimit} emails today, 5 more each day until it reaches ${first.dailySendCap}. Starting slow keeps your emails out of spam. You can turn it off any time.`
    : `Each one sends a few more emails every day until it reaches its daily limit. Starting slow keeps your emails out of spam. You can turn it off any time.`;

  return (
    <StateNote
      tone="info"
      icon="clock"
      title={title}
      text={text}
      action={showAction ? { label: "Manage slow start", onClick: () => router.push("/settings#settings-inboxes") } : null}
    />
  );
}
