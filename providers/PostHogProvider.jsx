"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

let initialized = false;
let posthogClient = null;
const ATTRIBUTION_KEY = "gnx_first_touch_attribution";

function readFirstTouchAttribution() {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(ATTRIBUTION_KEY);
    if (saved) return JSON.parse(saved);

    const params = new URLSearchParams(window.location.search);
    const attribution = {
      landing_page: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || "direct",
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_term: params.get("utm_term") || undefined,
      utm_content: params.get("utm_content") || undefined,
    };

    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return {};
  }
}

async function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;
  if (initialized) return true;

  const posthogModule = await import("posthog-js");
  posthogClient = posthogModule.default;

  posthogClient.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    loaded: ph => {
      if (process.env.NODE_ENV === "development") ph.opt_out_capturing();
    },
  });
  initialized = true;
  return true;
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    initPostHog().then(active => {
      if (!active || cancelled || !posthogClient) return;
      const query = searchParams.toString();
      posthogClient.capture("$pageview", {
        $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
        path: pathname,
        ...readFirstTouchAttribution(),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }) {
  useEffect(() => {
    const trackMarketingConversion = (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (href === "/signup" || href.startsWith("/signup?")) {
        captureEvent("signup_cta_clicked", {
          cta_text: link.textContent?.trim(),
          source_path: window.location.pathname,
          destination: href,
        });
      } else if (href.includes("calendly.com/gnxsales-support")) {
        captureEvent("demo_booking_started", {
          cta_text: link.textContent?.trim(),
          source_path: window.location.pathname,
          destination: href,
        });
      }
    };

    document.addEventListener("click", trackMarketingConversion);
    return () => document.removeEventListener("click", trackMarketingConversion);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

export async function captureEvent(name, properties = {}) {
  const active = await initPostHog();
  if (!active || !posthogClient) return;
  posthogClient.capture(name, {
    ...readFirstTouchAttribution(),
    ...properties,
  });
}
