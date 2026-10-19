"use client";
import useActiveSection from "../../hooks/useActiveSection";

// "On this page" list for the long-form guides, highlighting the section being read.
export default function GuideToc({ items }) {
  const active = useActiveSection(items.map((item) => item.id));
  return (
    <nav className="gd-toc" aria-label="On this page">
      <div className="gd-toc-title">On this page</div>
      {items.map((item, index) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? "is-active" : undefined}
          aria-current={active === item.id ? "location" : undefined}
        >
          <span>{index + 1}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
