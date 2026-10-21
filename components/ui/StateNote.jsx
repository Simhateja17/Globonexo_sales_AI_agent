import React from "react";
import Icon from "./Icon";

const TONE_ICON = { warn: "alertCircle", bad: "alertCircle", ok: "checkCircle", info: "clock", dark: "spark" };

/**
 * One-line state banner: what happened, what still works, the one next step.
 * `tone` is warn | bad | ok | info | dark. Renders inside a `.gx` page.
 */
export default function StateNote({ tone = "info", icon, title, text, action, secondary, children }) {
  return (
    <div className={`sn sn-${tone}`} role={tone === "bad" || tone === "warn" ? "alert" : "status"}>
      <span className="sn-ic"><Icon name={icon || TONE_ICON[tone] || "alertCircle"} size={17} /></span>
      <div className="sn-tx">
        <b>{title}</b>
        {text ? <span>{text}</span> : null}
        {children}
      </div>
      {secondary || action ? (
        <div className="acts">
          {secondary ? <button type="button" className="bt bt-g sm" onClick={secondary.onClick} disabled={secondary.disabled}>{secondary.label}</button> : null}
          {action ? <button type="button" className={`bt ${tone === "bad" ? "bt-x" : "bt-p"} sm`} onClick={action.onClick} disabled={action.disabled}>{action.label}</button> : null}
        </div>
      ) : null}
    </div>
  );
}
