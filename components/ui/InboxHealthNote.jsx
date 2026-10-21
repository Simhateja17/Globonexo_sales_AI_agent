"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StateNote from "./StateNote";
import api from "../../lib/api";

// Warns when a connected inbox has stopped working. The backend marks an
// inbox needs_attention when the mail server rejects the login, and pauses
// the campaigns that send from it, so this is worth surfacing outside
// Settings too.
export default function InboxHealthNote() {
  const router = useRouter();
  const [broken, setBroken] = useState([]);

  useEffect(() => {
    let active = true;
    api.get("/email-accounts")
      .then(({ data }) => {
        if (!active) return;
        const accounts = Array.isArray(data?.accounts) ? data.accounts : [];
        setBroken(accounts.filter(account => account.status === "needs_attention"));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (broken.length === 0) return null;
  const first = broken[0];
  return (
    <StateNote
      tone="bad"
      title={broken.length === 1 ? `${first.email} needs attention` : `${broken.length} inboxes need attention`}
      text={`${first.lastError || "The mail server rejected the login"}. Campaigns that send from ${broken.length === 1 ? "it" : "them"} are paused until it is fixed.`}
      action={{ label: "Fix connection", onClick: () => router.push("/settings#settings-inboxes") }}
    />
  );
}
