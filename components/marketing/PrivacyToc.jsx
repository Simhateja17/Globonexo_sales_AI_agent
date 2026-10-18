"use client";
import useActiveSection from "../../hooks/useActiveSection";

export default function PrivacyToc({ items }) {
  const active = useActiveSection(items.map(([id]) => id));
  return (
    <nav className="privacy-toc" aria-label="On this page">
      <span>On this page</span>
      {items.map(([id, label], i) => (
        <a key={id} href={`#${id}`} className={active === id ? "is-active" : undefined} aria-current={active === id ? "location" : undefined}>
          <em>{String(i + 1).padStart(2, "0")}</em>
          {label}
        </a>
      ))}
    </nav>
  );
}
