import type { CSSProperties } from "react";

/*
 * Small looping pictures for the cloud page's "console" tiles, one per capability: data moving up to the cloud,
 * bars of usage, a shield pulsing, a backup ring filling, layers sliding, server lights, code being typed, an
 * on-premises box linked to the cloud, and a window ticking off checks. Pure markup and CSS; the loops start when
 * the tile gets data-seen (components/seen.tsx). Styles in globals.css (.ca-*).
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

function Migration() {
  return (
    <svg viewBox="0 0 200 90" className="ca-svg" aria-hidden="true">
      <rect className="ca-stroke" x="14" y="38" width="38" height="30" rx="6" />
      <path className="ca-stroke" d="M24 50h18M24 58h12" />
      <path
        className="ca-fill-soft"
        d="M142 66h24a16 16 0 0 0 1-31 22 22 0 0 0-42-5 18 18 0 0 0 4 36z"
      />
      <path className="ca-dash" d="M58 52 H118" />
      <circle className="ca-pkt" cx="58" cy="52" r="4" style={v({ "--d": "0s" })} />
      <circle className="ca-pkt" cx="58" cy="52" r="4" style={v({ "--d": "0.7s" })} />
      <circle className="ca-pkt" cx="58" cy="52" r="4" style={v({ "--d": "1.4s" })} />
    </svg>
  );
}

function Infra() {
  return (
    <div className="ca-bars">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <i key={i} style={v({ "--i": i })} />
      ))}
    </div>
  );
}

function Security() {
  return (
    <div className="ca-shield">
      <span className="ca-ping" />
      <span className="ca-ping ca-ping-b" />
      <svg viewBox="0 0 64 72" aria-hidden="true">
        <path className="ca-fill-soft ca-stroke" d="M32 4 6 14v18c0 17 11 31 26 36 15-5 26-19 26-36V14z" />
        <path className="ca-tick" d="M20 36l8 8 16-18" pathLength="1" />
      </svg>
    </div>
  );
}

function Backup() {
  return (
    <div className="ca-ring">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle className="ca-ring-bg" cx="40" cy="40" r="32" />
        <circle className="ca-ring-fg" cx="40" cy="40" r="32" pathLength="1" />
        <path className="ca-stroke" d="M40 28v22m-8-8 8 8 8-8" />
      </svg>
    </div>
  );
}

function Layers() {
  return (
    <div className="ca-layers">
      {[0, 1, 2].map((i) => (
        <i key={i} style={v({ "--i": i })} />
      ))}
    </div>
  );
}

function Servers() {
  return (
    <div className="ca-rack">
      {[0, 1, 2].map((i) => (
        <span key={i} style={v({ "--i": i })}>
          <b />
          <b />
          <em />
        </span>
      ))}
    </div>
  );
}

function Code() {
  return (
    <div className="ca-code">
      <span className="ca-brace">{"{ }"}</span>
      <div>
        {[62, 84, 48].map((w, i) => (
          <i key={i} style={v({ "--w": `${w}%`, "--i": i })} />
        ))}
        <u />
      </div>
    </div>
  );
}

function Hybrid() {
  return (
    <svg viewBox="0 0 200 90" className="ca-svg" aria-hidden="true">
      <rect className="ca-fill-soft ca-stroke" x="14" y="28" width="46" height="36" rx="8" />
      <path className="ca-stroke" d="M26 40h22M26 50h14" />
      <path className="ca-fill-soft ca-stroke" d="M148 62h18a14 14 0 0 0 1-27 20 20 0 0 0-38-4 16 16 0 0 0 3 31z" />
      <path className="ca-dash" d="M66 46 H128" />
      <circle className="ca-pkt ca-pkt-both" cx="66" cy="46" r="4.5" />
      <circle className="ca-pkt ca-pkt-both ca-pkt-rev" cx="66" cy="46" r="4.5" />
    </svg>
  );
}

function Saas() {
  return (
    <div className="ca-window">
      <div className="ca-window-bar">
        <i />
        <i />
        <i />
      </div>
      {[0, 1, 2].map((i) => (
        <p key={i} style={v({ "--i": i })}>
          <b>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 6.5l2.5 2.5L10 3" pathLength="1" />
            </svg>
          </b>
          <span />
        </p>
      ))}
    </div>
  );
}

const pictures = [Migration, Infra, Security, Backup, Layers, Servers, Code, Hybrid, Saas];

export function CloudArt({ index }: { index: number }) {
  const Picture = pictures[index % pictures.length];
  return (
    <div className="ca" aria-hidden="true">
      <Picture />
    </div>
  );
}
