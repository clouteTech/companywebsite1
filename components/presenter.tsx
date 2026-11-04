import { useId } from "react";

/**
 * Stylised keynote presenter: a silhouette under a spotlight on a glowing stage floor,
 * gesturing towards the content beside it. Purely decorative, drawn in SVG (no photo of a
 * real person), animated with CSS in globals.css (`.presenter-*`).
 */
export function Presenter({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${uid}`;

  return (
    <svg viewBox="0 0 240 420" aria-hidden="true" className={`presenter overflow-visible ${className}`}>
      <defs>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9ff" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#4a85f0" stopOpacity="0.12" />
          <stop offset="1" stopColor="#4a85f0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("floor")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#17c3e6" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#1e5fdb" stopOpacity="0.25" />
          <stop offset="1" stopColor="#1e5fdb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15264a" />
          <stop offset="1" stopColor="#050b18" />
        </linearGradient>
        {/* Cool rim light catching the figure's edge. */}
        <linearGradient id={id("rim")} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fe3f7" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#4a85f0" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4a85f0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Spotlight cone and the pool of light on the stage floor. */}
      <polygon className="presenter-beam" points="104,-60 136,-60 220,392 20,392" fill={`url(#${id("beam")})`} />
      <ellipse className="presenter-floor" cx="120" cy="394" rx="118" ry="22" fill={`url(#${id("floor")})`} />
      <ellipse cx="120" cy="394" rx="62" ry="7" fill="#020611" opacity="0.7" />

      <g className="presenter-figure" stroke={`url(#${id("rim")})`} strokeWidth="1.5">
        {/* Legs and shoes */}
        <path d="M92 252 L98 382 L118 382 L120 284 L122 382 L142 382 L148 252 Z" fill={`url(#${id("body")})`} />
        <ellipse cx="106" cy="386" rx="15" ry="5" fill="#03070f" />
        <ellipse cx="134" cy="386" rx="15" ry="5" fill="#03070f" />
        {/* Resting arm */}
        <path
          d="M86 134 L74 196 L80 250"
          fill="none"
          stroke={`url(#${id("body")})`}
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Torso / jacket */}
        <path d="M84 128 Q120 112 156 128 L166 150 L158 258 L82 258 L74 150 Z" fill={`url(#${id("body")})`} />
        {/* Shirt collar */}
        <path d="M110 122 L120 146 L130 122 Z" fill="#9fdcf0" fillOpacity="0.18" stroke="none" />
        {/* Neck and head */}
        <rect x="112" y="100" width="16" height="22" rx="6" fill={`url(#${id("body")})`} />
        <ellipse cx="120" cy="78" rx="23" ry="27" fill={`url(#${id("body")})`} />
        {/* Gesturing arm, pivoting at the shoulder towards the content. */}
        <g className="presenter-arm">
          <path
            d="M154 136 L186 168 L214 130"
            fill="none"
            stroke={`url(#${id("body")})`}
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="216" cy="126" r="9" fill={`url(#${id("body")})`} />
        </g>
      </g>
    </svg>
  );
}
