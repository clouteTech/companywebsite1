"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Inertia ("buttery") scrolling for every page. Lenis keeps the browser's native scroll position, so sticky
 * sections, scroll-driven CSS animations and the scroll progress bar all keep working; it only eases the wheel
 * and keyboard movement. It is skipped for reduced-motion visitors and touch devices (native momentum is
 * already smooth there). The instance is exposed as window.__lenis so scroll buttons can reuse it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      lerp: 0.16,
      wheelMultiplier: 1.1,
      allowNestedScroll: true,
      anchors: { offset: -80 },
      // Dialogs, the chat window and other inner scrollers keep their own native scrolling.
      prevent: (node) => !!node.closest("[role='dialog'], [data-lenis-prevent]"),
    });
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
