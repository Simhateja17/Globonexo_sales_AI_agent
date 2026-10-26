"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const ConfirmContext = createContext(null);

/**
 * App-wide confirmation dialog. `useConfirm()` returns
 * `confirm({ title, body, confirmLabel, danger, keeps })`, which resolves to
 * true or false. `keeps` lists what is kept, so the dialog can say both what
 * goes and what stays.
 */
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolver = useRef(null);
  const confirmButton = useRef(null);

  const confirm = useCallback(options => new Promise(resolve => {
    resolver.current = resolve;
    setRequest(options);
  }), []);

  const close = useCallback(result => {
    resolver.current?.(result);
    resolver.current = null;
    setRequest(null);
  }, []);

  useEffect(() => {
    if (!request) return undefined;
    confirmButton.current?.focus();
    const onKey = event => { if (event.key === "Escape") close(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [request, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request ? (
        <div className="gx gx-layer">
          <div className="ovl" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) close(false); }}>
            <div className="mdl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" style={{ width: 520 }}>
              <div className="mdl-h">
                <span className="li" style={request.danger ? { background: "#fef3f2", color: "#b42318" } : undefined}>
                  <Icon name={request.danger ? "trash" : "alertCircle"} size={20} />
                </span>
                <div style={{ flex: 1 }}>
                  <b id="confirm-title">{request.title}</b>
                  {request.body ? <p>{request.body}</p> : null}
                  {request.keeps ? <p style={{ marginTop: 8, color: "#088256" }}><b style={{ display: "inline", font: "inherit", fontWeight: 800 }}>Kept:</b> {request.keeps}</p> : null}
                </div>
              </div>
              <div className="mdl-f">
                <button type="button" className="bt bt-g" style={{ marginLeft: "auto" }} onClick={() => close(false)}>Cancel</button>
                <button ref={confirmButton} type="button" className={`bt ${request.danger ? "bt-x" : "bt-p"}`} onClick={() => close(true)}>
                  {request.confirmLabel || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  // Outside the provider (tests, public pages) fall back to the browser
  // dialog rather than silently confirming.
  return confirm ?? (async ({ title, body }) => window.confirm([title, body].filter(Boolean).join("\n\n")));
}
