"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

/**
 * A section that stays pinned while the content after it scrolls up and over it. When it is
 * taller than the screen it first scrolls until its bottom is in view, so nothing is hidden.
 * Its videos pause once the next section fully covers it.
 */
export function PinnedSection({ className = "", style, children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const measure = () => setTop(Math.min(0, window.innerHeight - section.offsetHeight));
    const resize = new ResizeObserver(measure);
    resize.observe(section);
    window.addEventListener("resize", measure);
    measure();

    let covered = false;
    let frame = 0;
    const check = () => {
      frame = 0;
      const next = section.nextElementSibling;
      const nowCovered = !!next && next.getBoundingClientRect().top <= 0;
      if (nowCovered === covered) return;
      covered = nowCovered;
      section.querySelectorAll("video").forEach((video) => (covered ? video.pause() : video.play().catch(() => {})));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    // A video still loading can start after being paused; keep it paused while covered.
    const onPlay = (event: Event) => {
      if (covered) (event.target as HTMLVideoElement).pause();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    section.addEventListener("play", onPlay, true);
    check();

    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("play", onPlay, true);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} {...props} className={`sticky ${className}`} style={{ ...style, top }}>
      {children}
    </section>
  );
}
