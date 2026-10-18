"use client";
import { useEffect, useState } from "react";

// Returns the id of the section currently crossing the upper part of the
// viewport, so a sticky table of contents can highlight where the reader is.
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || null);
  const key = ids.join("|");

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length || typeof IntersectionObserver === "undefined") return undefined;

    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) seen.add(entry.target.id);
          else seen.delete(entry.target.id);
        });
        const current = targets.find((el) => seen.has(el.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}
