import type { CSSProperties } from "react";

import copy from "@/content/common.json";
import desk from "@/public/images/laptop-desk.jpg";

import { logos } from "./brand-logos";

/*
 * A photo of someone working at a laptop whose screen is replaced by an animated boot-logo showcase:
 * each hardware brand fades in on the screen in turn. The photo and the overlay live in one SVG
 * on the photo's own pixel grid (1536 x 1024) with a "cover" crop, so the screen stays glued to the
 * photo at any size. The cycle is pure CSS (.lps-*, in globals.css); its keyframes assume seven brands
 * (the six marks in brand-logos.tsx plus Canon as text).
 */

// Screen size in its own units, and the matrix that maps it onto the laptop's screen in the photo.
const W = 860;
const H = 600;
const SCREEN = "matrix(0.45 0.0535 -0.075 0.4467 809 279)";
const LOGO_UNIT = 360;

const marks = logos.map((logo) => {
  const [, y, w, h] = logo.viewBox.split(" ").map(Number);
  const height = logo.height * LOGO_UNIT;
  const width = (w / h) * height;
  return { ...logo, y, w, h, x: (W - width) / 2, top: (H - height) / 2 - 20, width, height };
});

const count = marks.length + 1;

// Floating dust motes, spread over the scene with fixed arithmetic so server and client agree.
const motes = Array.from({ length: 18 }, (_, i) => ({
  x: 140 + ((i * 331) % 1280),
  y: 160 + ((i * 197) % 640),
  r: 1.6 + (i % 4) * 0.9,
  delay: -((i * 1.7) % 11),
  dur: 9 + (i % 5) * 2,
}));
// Benefit chips that pop up around the laptop one after another (positions in photo pixels).
const chips = [
  { x: 905, y: 175, text: copy.laptopShowcase.chip0 },
  { x: 560, y: 330, text: copy.laptopShowcase.chip1 },
  { x: 520, y: 455, text: copy.laptopShowcase.chip2 },
  { x: 1000, y: 735, text: copy.laptopShowcase.chip3 },
];
// Steam wisps rising from the coffee cup.
const steam = [1284, 1306, 1328];
const names = [...marks.map((mark) => mark.name), "Canon"];

export function LaptopShowcase({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} role="img" aria-label={`Laptops and hardware from ${names.join(", ")}`}>
      {/* Anchored at 62% across, so on narrow cards the laptop stays in view. */}
      <div className="absolute inset-y-0 left-[62%] aspect-[3/2] min-h-full min-w-full -translate-x-[62%]">
        <svg viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 size-full">
          <g className="lps-scene">
          <image href={desk.src} width="1536" height="1024" preserveAspectRatio="none" style={{ filter: "brightness(1.1) contrast(1.05) saturate(1.1)" }} />
          <defs>
            <radialGradient id="lps-a" cx="25%" cy="25%" r="60%">
              <stop offset="0" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lps-b" cx="80%" cy="85%" r="65%">
              <stop offset="0" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lps-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1b2a8a" />
              <stop offset="0.6" stopColor="#2a2f9e" />
              <stop offset="1" stopColor="#141a66" />
            </linearGradient>
            <linearGradient id="lps-glare" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lps-spill" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.75" />
              <stop offset="0.55" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lps-shaft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="lps-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <clipPath id="lps-clip">
              <rect x="28" y="0" width={W - 56} height={H - 38} rx="14" />
            </clipPath>
          </defs>

          {/* Light from the screen spills onto the desk, keyboard and hands. */}
          <ellipse className="lps-spill" cx="990" cy="470" rx="420" ry="290" fill="url(#lps-spill)" />
          <ellipse className="lps-spill lps-spill-2" cx="930" cy="640" rx="330" ry="120" fill="url(#lps-spill)" />

          {/* A slow shaft of window light drifting across the scene. */}
          <rect className="lps-shaft" x="-200" y="-100" width="260" height="1300" fill="url(#lps-shaft)" transform="rotate(18 0 0)" />

          {steam.map((x, i) => (
            <path
              key={x}
              className="lps-steam"
              d={`M${x} 566 C${x - 14} 546 ${x + 14} 528 ${x} 504`}
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#lps-blur)"
              style={{ "--d": `${i * 0.9}s` } as CSSProperties}
            />
          ))}

          <g transform={SCREEN} style={{ "--n": count } as CSSProperties}>
            <rect width={W} height={H} rx="18" fill="#04060c" />
            <g clipPath="url(#lps-clip)">
              <rect width={W} height={H} fill="url(#lps-base)" />
              <g className="lps-wall">
                <rect x="-200" y="-200" width={W + 400} height={H + 400} fill="url(#lps-a)" />
                <rect x="-200" y="-200" width={W + 400} height={H + 400} fill="url(#lps-b)" />
              </g>

              {marks.map((mark, i) => (
                <g key={mark.name} className="lps-logo" style={{ "--i": i, "--brand": mark.color } as CSSProperties}>
                  <svg x={mark.x} y={mark.top} width={mark.width} height={mark.height} viewBox={mark.viewBox} fill="#fff" overflow="visible">
                    <path d={mark.path} />
                  </svg>
                  <rect className="lps-bar" x={W * 0.3} y={H * 0.82} width={W * 0.4} height="7" rx="3.5" fill={mark.color} />
                </g>
              ))}
              <g className="lps-logo" style={{ "--i": marks.length, "--brand": "#E5352B" } as CSSProperties}>
                <text x={W / 2} y={H / 2 + 40} textAnchor="middle" fill="#fff" fontSize="150" fontWeight="700" className="font-display">
                  {copy.brandLogos.brandLogos.text01_canon}
                </text>
                <rect className="lps-bar" x={W * 0.3} y={H * 0.82} width={W * 0.4} height="7" rx="3.5" fill="#E5352B" />
              </g>

              <rect className="lps-scan" x="0" y="-20" width={W} height="16" fill="url(#lps-shaft)" />
              <rect className="lps-glare" x="-300" width="300" height={H} fill="url(#lps-glare)" />
            </g>
          </g>

          {/* Typing lights on the keyboard and the webcam's "on" light. */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle
              key={i}
              className="lps-key"
              cx={845 + i * 38 + (i % 2) * 10}
              cy={592 + (i % 3) * 16 + i * 2}
              r="3.2"
              fill="#a5b4fc"
              style={{ "--k": `${(i * 0.37) % 1.6}s` } as CSSProperties}
            />
          ))}
          <circle className="lps-cam" cx="987" cy="297" r="2.6" fill="#4ade80" />

          {chips.map((chip, i) => (
            <g key={chip.text} transform={`translate(${chip.x} ${chip.y})`}>
              <g className="lps-chip" style={{ "--c": i } as CSSProperties}>
                <rect x="-16" y="-34" width="250" height="68" rx="34" fill="#fff" fillOpacity="0.94" />
                <circle cx="22" cy="0" r="19" fill="#1e5fdb" />
                <path d="M13 1 l7 7 l12 -14" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="54" y="9" fontSize="26" fontWeight="700" fill="#0b1b3a" className="font-display">
                  {chip.text}
                </text>
              </g>
            </g>
          ))}

          {motes.map((m, i) => (
            <circle
              key={i}
              className="lps-mote"
              cx={m.x}
              cy={m.y}
              r={m.r}
              fill="#fff"
              style={{ "--dly": `${m.delay}s`, "--dur": `${m.dur}s` } as CSSProperties}
            />
          ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
