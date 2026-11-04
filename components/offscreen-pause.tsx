"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Keeps the page light: while a section (or the footer) is outside the window, with a little margin, every CSS
 * animation inside it is paused through the Web Animations API, and resumed as it comes back into view. A page
 * with a few hundred looping animations then only animates what you can see, which cuts the work the browser does
 * on every frame while scrolling. Entrance animations play when you reach them. Renders nothing.
 *
 * Nothing in the markup is touched (no attributes or classes), so there is nothing for React to flag while it
 * hydrates the page, however slowly a device does it.
 */
export function OffscreenPause() {
  const pathname = usePathname();

  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("main section, footer"));
    if (!blocks.length || !("IntersectionObserver" in window)) return;

    // What each block paused, so that only those animations are resumed.
    const paused = new Map<Element, Animation[]>();
    const resume = (block: Element) => {
      paused.get(block)?.forEach((animation) => {
        if (animation.playState === "paused") animation.play();
      });
      paused.delete(block);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            resume(entry.target);
          } else if (!paused.has(entry.target)) {
            const running = entry.target
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running" && animation instanceof CSSAnimation);
            running.forEach((animation) => animation.pause());
            paused.set(entry.target, running);
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    blocks.forEach((block) => observer.observe(block));
    return () => {
      observer.disconnect();
      blocks.forEach(resume);
    };
  }, [pathname]);

  return null;
}
