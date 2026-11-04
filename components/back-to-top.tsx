"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import copy from "@/content/common.json";

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Floating back-to-top button. It appears once the visitor has scrolled a screen down, and its
 * ring fills with reading progress (styles in globals.css, .back-to-top).
 */
export function BackToTop() {
  const ringRef = useRef<SVGCircleElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      ringRef.current?.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)));
      setShown(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.__lenis && !reduced) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      data-shown={shown}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className="back-to-top"
    >
      <svg viewBox="0 0 52 52" aria-hidden="true" className="back-to-top-ring">
        <circle cx="26" cy="26" r={RADIUS} fill="none" stroke="rgb(30 95 219 / 0.15)" strokeWidth="2.5" />
        <circle
          ref={ringRef}
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="url(#back-to-top-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
        <defs>
          <linearGradient id="back-to-top-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e5fdb" />
            <stop offset="100%" stopColor="#17c3e6" />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp className="back-to-top-arrow relative size-5" strokeWidth={2} aria-hidden="true" />
      <span className="sr-only">{copy.backToTop.BackToTop.text01_back_to_top}</span>
    </button>
  );
}
