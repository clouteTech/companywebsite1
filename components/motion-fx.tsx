"use client";

import { useEffect } from "react";

/*
 * Site-wide pointer effects for mouse users (styles in globals.css, .fx-*):
 *  - Magnetic buttons: a `.btn` under the pointer leans up to 6px towards it (as --mag-x/--mag-y) and springs
 *    back when the pointer leaves.
 * Nothing runs on touch devices or when the visitor prefers reduced motion.
 */
const MAGNET = 6;

export function MotionFx() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let magnet: HTMLElement | null = null;

    const release = () => {
      magnet?.style.removeProperty("--mag-x");
      magnet?.style.removeProperty("--mag-y");
      magnet = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX;
      const y = event.clientY;

      const target = event.target as Element | null;

      const button = target?.closest<HTMLElement>(".btn");
      if (button !== magnet) release();
      if (button && !button.matches(":disabled")) {
        magnet = button;
        const rect = button.getBoundingClientRect();
        const dx = (x - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (y - (rect.top + rect.height / 2)) / (rect.height / 2);
        button.style.setProperty("--mag-x", `${(dx * MAGNET).toFixed(1)}px`);
        button.style.setProperty("--mag-y", `${(dy * MAGNET).toFixed(1)}px`);
      }
    };
    const onLeave = () => release();

    document.documentElement.classList.add("fx-on");
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      release();
      document.documentElement.classList.remove("fx-on");
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
