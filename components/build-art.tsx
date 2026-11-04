import type { CSSProperties } from "react";

/*
 * Small animated pictures for the "What We Build" cards on the home page: code being written, a web page
 * loading, modules snapping together, a chart growing and systems linking up. Pure markup and CSS; the motion
 * starts when the card gets data-seen (components/seen.tsx). Styles in globals.css (.ba-*).
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

const codeLines = [
  { w: "46%", x: "0%", c: "#7b8cff" },
  { w: "64%", x: "8%", c: "#17c3e6" },
  { w: "38%", x: "8%", c: "#fbbf24" },
  { w: "56%", x: "16%", c: "#34d399" },
  { w: "30%", x: "8%", c: "#17c3e6" },
  { w: "22%", x: "0%", c: "#7b8cff" },
];

function Code() {
  return (
    <div className="ba-code">
      {codeLines.map((line, i) => (
        <span key={i} className="ba-line" style={v({ "--i": i, "--w": line.w, "--x": line.x, "--c": line.c })} />
      ))}
      <span className="ba-cursor" />
    </div>
  );
}

function Web() {
  return (
    <div className="ba-browser">
      <div className="ba-top">
        <i />
        <i />
        <i />
        <span className="ba-url" />
      </div>
      <span className="ba-load" />
      <div className="ba-page">
        <span className="ba-hero" />
        <span className="ba-block" style={v({ "--i": 0 })} />
        <span className="ba-block" style={v({ "--i": 1 })} />
        <span className="ba-block" style={v({ "--i": 2 })} />
      </div>
    </div>
  );
}

function Modules() {
  return (
    <div className="ba-modules">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="ba-tile" style={v({ "--i": i })}>
          <b />
          <b />
        </span>
      ))}
    </div>
  );
}

function Chart() {
  const bars = [38, 62, 46, 80, 58, 92];
  return (
    <div className="ba-chart">
      <div className="ba-bars">
        {bars.map((h, i) => (
          <span key={i} className="ba-bar" style={v({ "--i": i, "--h": `${h}%` })} />
        ))}
      </div>
      <svg viewBox="0 0 120 60" className="ba-trend" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 46 L24 34 L44 40 L68 18 L90 26 L118 6" pathLength="1" />
      </svg>
    </div>
  );
}

function Link() {
  return (
    <svg viewBox="0 0 160 90" className="ba-link" aria-hidden="true">
      <path className="ba-wire" d="M30 45 H70 M90 45 H130 M80 22 V32 M80 58 V68" pathLength="1" />
      <circle className="ba-node ba-node-a" cx="22" cy="45" r="10" />
      <circle className="ba-node ba-node-b" cx="138" cy="45" r="10" />
      <circle className="ba-node ba-node-c" cx="80" cy="45" r="14" />
      <circle className="ba-node ba-node-d" cx="80" cy="14" r="7" />
      <circle className="ba-node ba-node-e" cx="80" cy="76" r="7" />
    </svg>
  );
}

const pictures = [Code, Web, Modules, Chart, Link];

export function BuildArt({ index }: { index: number }) {
  const Picture = pictures[index % pictures.length];
  return (
    <div className="ba" aria-hidden="true">
      <Picture />
    </div>
  );
}
