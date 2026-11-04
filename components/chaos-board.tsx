"use client";

import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const readReduced = () => window.matchMedia(reducedQuery).matches;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Where each problem sits while it is still "scattered": a nudge sideways and up or down, and a tilt. */
const scatter = [
  { x: "-1.1rem", y: "0.4rem", r: "-3deg" },
  { x: "1.4rem", y: "-0.3rem", r: "2.5deg" },
  { x: "-0.6rem", y: "0.7rem", r: "-1.5deg" },
  { x: "1.7rem", y: "0rem", r: "3deg" },
  { x: "-1.4rem", y: "-0.4rem", r: "-2.5deg" },
  { x: "0.8rem", y: "0.5rem", r: "2deg" },
];

/*
 * The business problems start out scattered and crooked, each marked with a warning. When the panel scrolls into
 * view they swing into a neat, numbered, ticked list one after another, and the panel goes calm; scrolling away
 * scatters them again so it plays each time. With reduced motion the list is simply tidy. Styles in globals.css
 * (.cb-*).
 */
export function ChaosBoard({ title, problems }: { title?: string; problems: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const still = useSyncExternalStore(subscribeReduced, readReduced, () => false);
  const ordered = still || inView;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || still) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) timer = window.setTimeout(() => setInView(true), 500);
        else setInView(false);
      },
      { threshold: 0.55 },
    );
    observer.observe(root);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [still]);

  return (
    <div ref={rootRef} className="cb" data-ordered={ordered || undefined}>
      <span aria-hidden="true" className="cb-glow" />
      {title ? <h3 className="text-subheading">{title}</h3> : null}
      <ul className={`cb-list ${title ? "" : "cb-list-flush"}`}>
        {problems.map((problem, i) => {
          const s = scatter[i % scatter.length];
          return (
            <li key={problem} className="cb-case" style={v({ "--i": i, "--x": s.x, "--y": s.y, "--r": s.r })}>
              <span className="cb-badge" aria-hidden="true">
                <AlertTriangle className="cb-warn size-3.5" strokeWidth={2.5} />
                <Check className="cb-ok size-3.5" strokeWidth={3} />
              </span>
              <span className="cb-text">{problem}</span>
              <span className="cb-no" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
