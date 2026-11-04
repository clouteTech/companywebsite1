"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Phase = "final" | "armed" | "rolling";

/**
 * Odometer-style stat such as "500+" or "95%": the first time it scrolls into view every digit
 * rolls upward from 0, each old digit sliding out as the next slides in. The ones digit spins a
 * few full turns and the digits to its left fewer, so they land together like an odometer.
 *
 * The server renders the final value; it also reserves the width so nothing shifts, and assistive
 * tech only ever hears the final value. Styles live in globals.css (.odo-*).
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("final");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    // Snap to zero without animating, then roll once seen.
    setPhase("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Two frames so the zero position is painted before the transition starts.
        frame = requestAnimationFrame(() => (frame = requestAnimationFrame(() => setPhase("rolling"))));
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  const chars = [...value];
  let position = 0;

  return (
    <span ref={ref} translate="no" data-phase={phase} className="notranslate odo">
      <span aria-hidden="true" className="odo-reserve">
        {value}
      </span>
      <span aria-hidden="true" className="odo-row">
        {chars.map((char, i) => {
          if (!/\d/.test(char)) return <span key={i}>{char}</span>;
          const digit = Number(char);
          // Each digit spins one more full turn than the one to its left (leftmost: none).
          const turns = position++;
          const index = phase === "armed" ? 0 : turns * 10 + digit;
          return (
            <span key={i} className="odo-col">
              <span
                className={`odo-strip ${phase === "rolling" ? "odo-rolling" : ""}`}
                style={{ "--i": index, "--delay": `${turns * 150}ms` } as CSSProperties}
              >
                {Array.from({ length: (turns + 1) * 10 }, (_, n) => (
                  <span key={n}>{n % 10}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
