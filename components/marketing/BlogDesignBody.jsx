"use client";
import { useEffect, useRef } from "react";

// The blog pages come straight out of the design files, which lean on plain
// HTML plus a little scroll choreography: reveals, bars that grow, numbers that
// count up, dot grids that fade in, and `style-hover` attributes for hover
// states. This renders that markup and wires the behaviour back up.
export default function BlogDesignBody({ html, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const stagger = 70;
    const reveals = Array.from(root.querySelectorAll("[data-reveal]"));
    const bars = Array.from(root.querySelectorAll("[data-grow],[data-grow-y]"));
    const counts = Array.from(root.querySelectorAll("[data-count]"));
    const dots = Array.from(root.querySelectorAll("[data-dot]"));

    const grow = (el) => {
      if (el.hasAttribute("data-grow-y")) el.style.height = el.getAttribute("data-h") || "100%";
      else el.style.width = el.getAttribute("data-w") || "100%";
    };
    const finalValue = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      return target.toFixed(decimals) + (el.getAttribute("data-suffix") || "");
    };
    const countUp = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 900);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Hover states carried over from the design file as `style-hover`.
    const hoverCleanups = [];
    root.querySelectorAll("[style-hover]").forEach((el) => {
      const base = el.getAttribute("style") || "";
      const hover = el.getAttribute("style-hover") || "";
      const enter = () => el.setAttribute("style", base + ";" + hover);
      const leave = () => el.setAttribute("style", base);
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("focusin", enter);
      el.addEventListener("focusout", leave);
      hoverCleanups.push(() => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.removeEventListener("focusin", enter);
        el.removeEventListener("focusout", leave);
      });
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      reveals.forEach((el) => el.setAttribute("data-reveal", "in"));
      bars.forEach(grow);
      dots.forEach((el) => el.setAttribute("data-in", ""));
      counts.forEach((el) => { el.textContent = finalValue(el); });
      return () => hoverCleanups.forEach((fn) => fn());
    }

    reveals.forEach((el) => {
      const sibs = Array.from(el.parentElement ? el.parentElement.children : []);
      const i = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = Math.min(i, 6) * stagger + "ms";
    });
    dots.forEach((el, i) => { el.style.transitionDelay = i * 12 + "ms"; });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          if (el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "in");
          if (el.hasAttribute("data-grow") || el.hasAttribute("data-grow-y")) grow(el);
          if (el.hasAttribute("data-dot")) el.setAttribute("data-in", "");
          if (el.hasAttribute("data-count")) countUp(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    [...reveals, ...bars, ...counts, ...dots].forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      hoverCleanups.forEach((fn) => fn());
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className={`blog-design ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
