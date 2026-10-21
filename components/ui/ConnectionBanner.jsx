"use client";

import React, { useEffect, useState } from "react";
import Icon from "./Icon";
import api from "../../lib/api";

const SLOW_AFTER_MS = 10000;

// Counts requests that have been waiting longer than SLOW_AFTER_MS. Kept at
// module level so the interceptors are installed once, however many times
// the banner mounts.
let slowCount = 0;
let installed = false;
const listeners = new Set();
const notify = () => listeners.forEach(listener => listener(slowCount));

function install() {
  if (installed) return;
  installed = true;
  api.interceptors.request.use(config => {
    config.__slowTimer = setTimeout(() => {
      config.__wasSlow = true;
      slowCount += 1;
      notify();
    }, SLOW_AFTER_MS);
    return config;
  });
  const settle = config => {
    if (!config) return;
    clearTimeout(config.__slowTimer);
    if (config.__wasSlow) {
      config.__wasSlow = false;
      slowCount = Math.max(0, slowCount - 1);
      notify();
    }
  };
  api.interceptors.response.use(
    response => { settle(response.config); return response; },
    error => { settle(error?.config); return Promise.reject(error); },
  );
}

/**
 * Bar at the bottom of the workspace when the browser is offline or the
 * server has not answered for ten seconds. Work already saved is safe, so
 * the copy says so rather than alarming anyone.
 */
export default function ConnectionBanner() {
  const [offline, setOffline] = useState(false);
  const [slow, setSlow] = useState(0);

  useEffect(() => {
    install();
    const onSlow = count => setSlow(count);
    listeners.add(onSlow);
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      listeners.delete(onSlow);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline && slow === 0) return null;
  return (
    <div className="conn-banner" role="status">
      <Icon name={offline ? "alertCircle" : "clock"} size={16} />
      <span>
        <b>{offline ? "You are offline." : "This is taking longer than usual."}</b>{" "}
        {offline ? "Changes you already saved are safe. We will reconnect when you are back online." : "Still working on it. Your saved work is safe."}
      </span>
      {offline ? null : <button type="button" onClick={() => window.location.reload()}>Reload</button>}
    </div>
  );
}
