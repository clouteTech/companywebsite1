"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import copy from "@/content/services.json";

/** Time each slide stays on screen. */
const INTERVAL = 2500;

interface ServiceSliderProps {
  /** Server-rendered slide contents; every slide stays in the HTML for search engines. */
  slides: ReactNode[];
  /** Short name per slide, used for the tabs and announcements. */
  labels: string[];
}

/**
 * Full-screen slideshow that advances on its own: each new slide enters from the left and
 * pushes the current one off to the right (a soft cross-fade when reduced motion is requested).
 * Pauses for keyboard focus, when scrolled out of view, or when the tab is hidden.
 */
export function ServiceSlider({ slides, labels }: ServiceSliderProps) {
  const count = slides.length;
  // `dir` 1 = forward (new slide from the left), -1 = backward (new slide from the right).
  const [{ active, previous, dir }, setPosition] = useState({ active: 0, previous: -1, dir: 1 });
  const [held, setHeld] = useState(false); // keyboard focus inside
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const rootRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<number | null>(null);

  const autoplay = !held && inView && tabVisible;

  const goTo = (index: number, direction: number) => {
    setPosition((current) =>
      index === current.active ? current : { active: (index + count) % count, previous: current.active, dir: direction },
    );
  };
  const next = () => goTo(active + 1, 1);
  const prev = () => goTo(active - 1, -1);

  // Advance after the interval; restarting whenever the slide changes keeps the progress bar in sync.
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => {
      setPosition((current) => ({ active: (current.active + 1) % count, previous: current.active, dir: 1 }));
    }, INTERVAL);
    return () => clearTimeout(timer);
  }, [autoplay, active, count]);

  // Only run while the slider is on screen and the tab is visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(root);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const slideClass = (i: number) => {
    if (i === active) {
      if (previous === -1) return "z-20";
      return `z-20 ${dir === 1 ? "slide-from-left" : "slide-from-right"}`;
    }
    if (i === previous) return `z-10 ${dir === 1 ? "slide-to-right" : "slide-to-left"}`;
    return "invisible";
  };

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={copy.serviceSlider.ServiceSlider.arialabel01_our_services}
      // Keyboard focus pauses; a mouse click on a control should not freeze the show.
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) setHeld(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") prev();
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return;
        const distance = event.clientX - swipeStart.current;
        swipeStart.current = null;
        // Swiping right follows the slide direction (forward); swiping left goes back.
        if (distance > 50) next();
        if (distance < -50) prev();
      }}
      className="on-dark relative isolate h-svh min-h-[38rem] touch-pan-y overflow-clip bg-midnight text-white select-none"
    >
      {slides.map((slide, i) => (
        <div
          key={labels[i]}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}: ${labels[i]}`}
          aria-hidden={i !== active}
          inert={i !== active}
          data-active={i === active}
          className={`slide absolute inset-0 ${slideClass(i)}`}
        >
          {slide}
        </div>
      ))}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-[linear-gradient(to_top,rgb(4_12_25/0.85),transparent)] pt-16">
        {/* Right padding on phones keeps the last tabs clear of the floating WhatsApp / back-to-top buttons. */}
        <div className="shell pb-6 max-md:pr-20 sm:pb-8">
          <ol className="flex flex-1 gap-2 sm:gap-3">
            {labels.map((label, i) => (
              <li key={label} className="flex-1">
                <button
                  type="button"
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  aria-label={`Show ${label}`}
                  aria-current={i === active ? "true" : undefined}
                  className="group block w-full py-3 text-left sm:py-2"
                >
                  <span className="relative block h-0.5 overflow-clip rounded-full bg-white/25">
                    <span
                      key={i === active ? `${active}-${previous}` : undefined}
                      className={`absolute inset-0 origin-left rounded-full bg-accent ${
                        i !== active ? "scale-x-0" : autoplay ? "slide-progress" : "scale-x-100"
                      }`}
                      style={{ "--slide-interval": `${INTERVAL}ms` } as CSSProperties}
                    />
                  </span>
                  <span
                    className={`mt-3 hidden truncate text-xs font-medium transition-colors duration-300 lg:block ${
                      i === active ? "text-white" : "text-white/50 group-hover:text-white/80"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Announce slide changes only when the visitor is driving, not on every automatic turn. */}
      <p aria-live={autoplay ? "off" : "polite"} className="sr-only">
        {`Showing ${active + 1} of ${count}: ${labels[active]}`}
      </p>
    </section>
  );
}
