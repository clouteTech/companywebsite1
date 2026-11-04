"use client";

import { useEffect } from "react";

/*
 * Fills the big outlined numbers on the hardware cards (.hw-num) as they scroll into view, the same
 * colour-fill the cards show on hover (see globals.css, .hw-num[data-filled]). Each number fills once.
 * Renders nothing; it only watches the page.
 */
export function NumFill() {
  useEffect(() => {
    const numbers = document.querySelectorAll<HTMLElement>(".hw-num");
    if (!numbers.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-filled", "");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.9, rootMargin: "0px 0px -12% 0px" },
    );
    numbers.forEach((number, i) => {
      number.style.transitionDelay = `${(i % 3) * 140}ms`;
      observer.observe(number);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
