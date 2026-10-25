"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import Icon from "../ui/Icon";

export function Brand() {
  return (
    <div className="brand">
      <svg width="28" height="28" viewBox="0 0 74 74" aria-hidden="true">
        <g fill="#00A86B">
          <path d="M36 36 8 12c-2-2 0-5 3-4l31 12c2 1 2 4 0 5z" />
          <path d="M36 36 22 66c-1 2-4 2-5-1l-6-30c0-2 2-4 4-3z" />
          <path d="M36 36 66 26c2-1 4 2 3 4L48 60c-1 2-4 2-5 0z" />
        </g>
      </svg>
      <span>GNX <em>Sales</em></span>
    </div>
  );
}

/** Top bar with the numbered steps. Done steps can be clicked to go back. */
export function TopBar({ steps, current, onJump, onSave, saveLabel = "Save and finish later" }) {
  const index = steps ? steps.findIndex(s => s.id === current) : -1;
  return (
    <>
      <header className="top">
        <Brand />
        {steps && (
          <ol className="steps" aria-label="Setup progress">
            {steps.map((s, i) => {
              const done = i < index;
              const on = i === index;
              return (
                <React.Fragment key={s.id}>
                  {i > 0 && <li className="sep" aria-hidden="true" />}
                  <li className={done ? "done" : on ? "on" : ""} aria-current={on ? "step" : undefined}>
                    {done ? (
                      <button type="button" onClick={() => onJump(s.id)} aria-label={`Back to ${s.label}`}>
                        <i><Icon name="check" size={12} stroke={3} /></i><span className="lb">{s.label}</span>
                      </button>
                    ) : (
                      <><i>{i + 1}</i><span className="lb">{s.label}</span></>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        )}
        {onSave && <button type="button" className="save" onClick={onSave}>{saveLabel}</button>}
      </header>
      {steps && (
        <div className="prog" aria-hidden="true">
          <u style={{ width: `${Math.round(((index + 0.6) / steps.length) * 100)}%` }} />
        </div>
      )}
    </>
  );
}

export function Live() {
  return <span className="live"><u />Live</span>;
}

export function Chip({ on, children, onClick, className = "", ...rest }) {
  return (
    <button type="button" className={`chip ${className} ${on ? "on" : ""}`} aria-pressed={on === undefined ? undefined : !!on} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export function NumberStepper({ value, onChange, min, max, label }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <b aria-live="polite">{value}</b>
      <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

/** Renders preview segments, highlighting the parts that come from the user's answers. */
export function Marked({ parts }) {
  return parts.map((p, i) => (p.mark
    ? <span key={i} className={`mk ${p.weak ? "w" : ""}`}>{p.text}</span>
    : <React.Fragment key={i}>{p.text}</React.Fragment>));
}

function useOutsideClose(open, close) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) close(); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);
  return ref;
}

/**
 * Type-to-search input with a suggestion list. Free text is allowed: Enter
 * keeps what was typed when nothing is highlighted.
 */
export function Combo({ value, onChange, options, placeholder, icon, label, capitalize, allowFree = true, inputRef }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(null);
  const [active, setActive] = useState(-1);
  const close = React.useCallback(() => { setOpen(false); setQ(null); setActive(-1); }, []);
  const ref = useOutsideClose(open, close);
  const listId = useId();
  const query = (q ?? "").trim().toLowerCase();
  const shown = options.filter(o => o.toLowerCase().includes(query)).slice(0, 60);
  const pick = o => { onChange(o); close(); };
  const onKey = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive(a => Math.min(shown.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && open) {
      e.preventDefault();
      e.stopPropagation();
      if (active >= 0 && shown[active]) pick(shown[active]);
      else if (allowFree && q !== null && q.trim()) pick(q.trim());
      else close();
    } else if (e.key === "Escape") close();
  };
  return (
    <div className="combo" ref={ref}>
      <span className="in">
        {icon && <span className="ic"><Icon name={icon} size={18} /></span>}
        <input
          ref={inputRef}
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className={capitalize && q === null ? "cap" : ""}
          value={q ?? value}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={e => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onKeyDown={onKey}
          onBlur={() => { if (allowFree && q !== null && q.trim() && q.trim() !== value) onChange(q.trim()); }}
        />
        <button type="button" className="caret-btn" tabIndex={-1} aria-label={open ? "Close list" : "Open list"} onClick={() => (open ? close() : setOpen(true))}>
          <span className={`caret ${open ? "up" : ""}`}><Icon name="chevronDown" size={18} stroke={2} /></span>
        </button>
      </span>
      {open && (
        <div className="menu" role="listbox" id={listId}>
          {shown.length === 0 && <div className="empty">{allowFree && query ? <>Press Enter to use “{q.trim()}”</> : "No matches"}</div>}
          {shown.map((o, i) => (
            <button type="button" role="option" aria-selected={o === value} key={o} className={`${i === active ? "act" : ""} ${o === value ? "cur" : ""} ${capitalize ? "cap" : ""}`}
              onMouseDown={e => e.preventDefault()} onClick={() => pick(o)}>
              {o}{o === value && <Icon name="check" size={14} stroke={2.6} color="#00a86b" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Chip input: type and press Enter (or comma) to add, Backspace to remove the
 * last one. `suggest(query)` returns [{ value, label, kind }] for the dropdown.
 */
export function TokenInput({ values, onAdd, onRemove, placeholder, label, suggest, tokenIcon, highlight }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const items = suggest && q.trim() ? suggest(q.trim()).filter(s => !values.includes(s.value)).slice(0, 6) : [];
  const add = value => { const v = String(value || "").trim(); if (v && !values.includes(v)) onAdd(v); setQ(""); setActive(0); };
  const onKey = e => {
    if (e.key === "Enter" || e.key === ",") {
      if (!q.trim()) return;
      e.preventDefault();
      add(items[active]?.value ?? q);
    } else if (e.key === "Backspace" && !q && values.length) {
      onRemove(values[values.length - 1]);
    } else if (e.key === "ArrowDown" && items.length) {
      e.preventDefault(); setActive(a => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault(); setActive(a => Math.max(0, a - 1));
    } else if (e.key === "Escape") setQ("");
  };
  return (
    <>
      <div className="tok">
        {values.map(v => (
          <span className="tk" key={v}>
            {tokenIcon && tokenIcon(v) && <Icon name={tokenIcon(v)} size={12} stroke={2.2} />}
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onRemove(v)}><Icon name="close" size={12} stroke={2.6} /></button>
          </span>
        ))}
        <input value={q} placeholder={values.length ? "" : placeholder} aria-label={label}
          role={suggest ? "combobox" : undefined} aria-expanded={suggest ? items.length > 0 : undefined} aria-controls={suggest ? listId : undefined}
          onChange={e => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey}
          onBlur={() => { if (!suggest && q.trim()) add(q); }} />
      </div>
      {items.length > 0 && (
        <div className="picker" style={{ marginTop: -6 }}>
          <div className="pk-list one" role="listbox" id={listId}>
            {items.map((s, i) => (
              <button type="button" role="option" aria-selected={i === active} key={s.value + s.label} className={`ck sp ${i === active ? "act" : ""}`}
                onMouseDown={e => e.preventDefault()} onClick={() => add(s.value)}>
                <span>{highlight ? highlight(s.label, q.trim()) : s.label}</span>
                {s.kind && <span className="hint">{s.kind}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/** Bold the typed part of a suggestion, like the design's location search. */
export function boldMatch(label, query) {
  const i = label.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0 || !query) return label;
  return <>{label.slice(0, i)}<b>{label.slice(i, i + query.length)}</b>{label.slice(i + query.length)}</>;
}

/** Toggle a whole line in a rules textarea from a chip. */
export function RuleChips({ rules, text, onChange, label }) {
  const lines = text.split("\n").map(l => l.trim());
  return (
    <div className="chips">
      {label && <span className="hint b">{label}</span>}
      {rules.map(r => {
        const on = lines.includes(r.line);
        return (
          <button type="button" key={r.label} className={`chip rule ${on ? "on" : ""}`} aria-pressed={on}
            onClick={() => onChange(on
              ? text.split("\n").filter(l => l.trim() !== r.line).join("\n")
              : [text.trimEnd(), r.line].filter(Boolean).join("\n"))}>
            {on ? r.label : `+ ${r.label}`}
          </button>
        );
      })}
    </div>
  );
}

export function FormError({ message, id }) {
  if (!message) return null;
  return (
    <div className="err" role="alert" id={id}>
      <Icon name="alertCircle" size={18} />
      <span>{message}</span>
    </div>
  );
}
