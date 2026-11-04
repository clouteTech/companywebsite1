"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/*
 * Extra hero atmosphere, layered over the background video and under the copy (styles in globals.css, .hx-*):
 * a slowly moving colour mesh, floating glass shapes that drift with the mouse (desktop), and rising particles.
 * Purely decorative: aria-hidden, no pointer events, and still when the visitor prefers reduced motion.
 */
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function HeroFx() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;
    const onMove = (event: PointerEvent) => {
      // -1…1 from the centre of the window; the shapes move by different depths in CSS.
      px = event.clientX / window.innerWidth - 0.5;
      py = event.clientY / window.innerHeight - 0.5;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="hx">
      <div className="hx-mesh">
        <span className="hx-blob hx-blob-a" />
        <span className="hx-blob hx-blob-b" />
        <span className="hx-blob hx-blob-c" />
      </div>

      {/* Glass cube */}
      <div className="hx-shape hx-cube-wrap" style={v({ "--depth": 40 })}>
        <div className="hx-cube">
          {["front", "back", "right", "left", "top", "bottom"].map((face) => (
            <span key={face} className={`hx-face hx-face-${face}`} />
          ))}
        </div>
      </div>
      {/* Glowing ring */}
      <div className="hx-shape hx-ring" style={v({ "--depth": 26 })} />
      {/* Glass orb */}
      <div className="hx-shape hx-orb" style={v({ "--depth": 18 })} />
      {/* Small glass tiles */}
      <div className="hx-shape hx-tile hx-tile-a" style={v({ "--depth": 34 })} />
      <div className="hx-shape hx-tile hx-tile-b" style={v({ "--depth": 22 })} />

      <div className="hx-particles">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className="decor-particle" style={v({ "--i": i, "--x": `${(i * 53 + 7) % 100}%` })} />
        ))}
      </div>
    </div>
  );
}
