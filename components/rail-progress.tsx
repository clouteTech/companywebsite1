"use client";

import { useEffect } from "react";

/*
 * Drives the home of the networking "line" band (globals.css, .nt-*). As the page scrolls it sets --p (0 to 1) on
 * each [data-rail] element, the share of the line the reading point has passed, and marks every .nt-stop that the
 * line has reached with data-on. Reduced motion lights every stop at once. Renders nothing.
 */
export function RailProgress() {
  useEffect(() => {
    const rails = document.querySelectorAll<HTMLElement>("[data-rail]");
    if (!rails.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.62;
      for (const rail of rails) {
        const box = rail.getBoundingClientRect();
        const progress = reduced ? 1 : Math.min(1, Math.max(0, (line - box.top) / box.height));
        rail.style.setProperty("--p", progress.toFixed(4));
        rail.querySelectorAll<HTMLElement>(".nt-stop").forEach((stop) => {
          const reached = reduced || stop.getBoundingClientRect().top + 40 < line;
          if (reached) stop.setAttribute("data-on", "");
          else stop.removeAttribute("data-on");
        });
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
