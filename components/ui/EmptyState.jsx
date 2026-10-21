import React from "react";
import Icon from "./Icon";

/**
 * Workspace empty state: what will appear here and one clear next step.
 * `actions` are { label, icon?, onClick, primary? }. Renders inside a `.gx`
 * page, which provides the .emp styles.
 */
export default function EmptyState({ icon, title, text, actions = [], compact = false }) {
  return (
    <div className="emp" style={compact ? { padding: "28px 20px" } : undefined}>
      <span className="ei2"><Icon name={icon} size={24} /></span>
      <b>{title}</b>
      {text ? <p>{text}</p> : null}
      {actions.length ? (
        <div className="acts">
          {actions.map(action => (
            <button key={action.label} type="button" className={`bt ${action.primary ? "bt-p" : "bt-g"} sm`} onClick={action.onClick}>
              {action.icon ? <Icon name={action.icon} size={14} color={action.primary ? "#06231a" : undefined} /> : null} {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
