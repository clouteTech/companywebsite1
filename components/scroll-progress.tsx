"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-progress line along the top of the page. It glides towards the scroll position with
 * time-based easing (the same feel at 60Hz or 144Hz), so it grows smoothly even with a notched
 * mouse wheel, and stops animating once it catches up. A thin line easing a few pixels is not
 * the kind of motion reduced-motion users need spared, so it glides for everyone.
 */
const GLIDE_MS = 140;

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let shown = 0;
    let frame = 0;
    let last = 0;

    const target = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const goal = target();
      shown += (goal - shown) * (1 - Math.exp(-dt / GLIDE_MS));
      if (Math.abs(goal - shown) < 0.0005) shown = goal;
      bar.style.scale = `${shown} 1`;
      if (shown === goal) {
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    start();
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    // The page grows as images and lazy sections load, which changes the progress without a scroll.
    const pageSize = new ResizeObserver(start);
    pageSize.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      pageSize.disconnect();
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="scroll-progress" />;
}
