"use client";

import { useEffect } from "react";

/*
 * Marks every [data-seen-target] element with data-seen once it has scrolled into view, which is what starts
 * the motion in the home page's "What We Build" cards (globals.css, .ba-*). Each element is marked once.
 * Renders nothing; it only watches the page.
 */
export function Seen() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-seen-target]");
    if (!targets.length || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.setAttribute("data-seen", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-seen", "");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return null;
}
