"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

interface Step {
  title: string;
  text: string;
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const readReduced = () => window.matchMedia(reducedQuery).matches;

const STEP_MS = 1500;
const HOLD_MS = 3200;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/*
 * The delivery process as a live pipeline: a light runs along the track, lighting each stage in turn, the stage's
 * card rises and brightens, and after the last one the pipeline rests, then runs again for as long as it is on
 * screen. A row of six across on wide screens, a vertical line on narrow ones. Reduced motion shows every stage
 * lit and still. Styles in globals.css (.pl-*).
 */
export function Pipeline({ steps }: { steps: Step[] }) {
  const total = steps.length;
  const rootRef = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(-1);
  const still = useSyncExternalStore(subscribeReduced, readReduced, () => false);
  const active = still ? total - 1 : step;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || still) return;
    let timers: number[] = [];
    const clear = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };
    const play = () => {
      clear();
      setStep(-1);
      for (let i = 0; i < total; i++) timers.push(window.setTimeout(() => setStep(i), 500 + i * STEP_MS));
      timers.push(window.setTimeout(play, 500 + total * STEP_MS + HOLD_MS));
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else {
          clear();
          setStep(-1);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      clear();
    };
  }, [total, still]);

  const progress = total > 1 ? Math.max(0, active) / (total - 1) : 0;

  return (
    <ol ref={rootRef} className="pl" style={v({ "--n": total, "--p": active < 0 ? 0 : progress })}>
      <span aria-hidden="true" className="pl-track">
        <i className="pl-fill" />
        <i className="pl-packet" />
      </span>
      {steps.map((item, i) => (
        <li key={item.title} className="pl-step" data-on={i <= active || undefined} data-now={i === active || undefined}>
          <span aria-hidden="true" className="pl-node">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pl-card">
            <h3 className="text-card-title">{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
