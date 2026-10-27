"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Plan selection is now the first step of /onboarding. This route stays so
// older links and redirects keep working.
export default function PlanPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/onboarding?step=plan"); }, [router]);
  return null;
}
