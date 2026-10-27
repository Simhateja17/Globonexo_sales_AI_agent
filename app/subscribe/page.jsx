"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PLAN_PAGE } from "../../lib/billingAccess";

// Plans are now picked on /onboarding/plan, right after sign-up, and paid
// plans are charged at the first launch. Old links land there.
export default function SubscribePage() {
  const router = useRouter();
  useEffect(() => { router.replace(PLAN_PAGE); }, [router]);
  return (
    <div className="screen" style={{ display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <p className="muted">Loading plans…</p>
    </div>
  );
}
