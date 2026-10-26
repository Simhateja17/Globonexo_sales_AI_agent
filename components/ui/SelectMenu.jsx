"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";

/**
 * A compact dropdown drawn in the app's own style, for toolbar filters where a
 * native <select> would open the operating system's grey menu.
 * `options` is [{ value, label }]. Renders inside a `.gx` page.
 */
export default function SelectMenu({ value, options, onChange, icon, ariaLabel, align = "right", disabled = false, block = false }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef(null);
  const listId = useId();
  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const close = event => { if (!box.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const openMenu = () => { setActive(selectedIndex); setOpen(true); };
  const pick = option => { onChange(option.value); setOpen(false); };

  const onKeyDown = event => {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { openMenu(); return; }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive(current => (current + step + options.length) % options.length);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      pick(options[active]);
    }
  };

  return (
    <div className={`smenu${block ? " block" : ""}`} ref={box} onKeyDown={disabled ? undefined : onKeyDown}>
      <button
        type="button"
        className="sel-box smenu-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        aria-label={ariaLabel ? `${ariaLabel}: ${selected?.label ?? ""}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        {icon ? <Icon name={icon} size={15} /> : null}
        <span className="smenu-val">{selected?.label}</span>
        <svg className="smenu-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && !disabled ? (
        <div className={`smenu-pop ${align === "left" ? "left" : ""}`} role="listbox" id={listId} aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`smenu-opt${isSelected ? " on" : ""}${index === active ? " act" : ""}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => pick(option)}
              >
                <span>{option.label}</span>
                {isSelected ? <Icon name="check" size={14} color="var(--g-600)" stroke={2.5} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
