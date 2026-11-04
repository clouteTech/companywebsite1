"use client";

import { useEffect } from "react";

/**
 * Feeds the pointer position to whichever `.spotlight` card, `.btn` or `.nav-glow` is under it, as
 * `--mx`/`--my` (card glow, button hover fill origin) and `--tilt-x`/`--tilt-y` (card depth).
 * One passive listener for the whole document, throttled to a frame, and only on devices
 * that actually hover — cards themselves stay server-rendered.
 */
export function PointerSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      if (!last) return;
      const card = (last.target as Element | null)?.closest<HTMLElement>(".btn, .spotlight, .nav-glow");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = last.clientX - rect.left;
      const y = last.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      // Up to 3° of tilt towards the pointer, used by `.lift` cards.
      card.style.setProperty("--tilt-x", `${((0.5 - y / rect.height) * 6).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${((x / rect.width - 0.5) * 6).toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
