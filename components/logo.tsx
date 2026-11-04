import Image from "next/image";
import type { CSSProperties } from "react";

// The cloud is the original artwork, trimmed. The lettering is live vector text in the site's
// display face, so it stays bold and sharp at every size (the source image was too small).
import mark from "@/public/images/logo-mark.png";
import copy from "@/content/common.json";

interface LogoProps {
  /** `white` turns the lettering white for dark backgrounds; the cloud always stays blue. */
  tone?: "color" | "white";
  className?: string;
  preload?: boolean;
}

// The cloud's own shape masks the shine that sweeps across it (styles in globals.css).
// A small WebP copy of the same shape does the masking, so the browser fetches ~5 KB instead of the full PNG.
const markMask = {
  maskImage: "url(/images/logo-mark-mask.webp)",
  WebkitMaskImage: "url(/images/logo-mark-mask.webp)",
} as CSSProperties;

export function Logo({ tone = "color", className = "", preload = false }: LogoProps) {
  return (
    <span role="img" aria-label={copy.logo.Logo.arialabel01_cloute_technologies} translate="no" className={`notranslate logo inline-flex shrink-0 items-center gap-1.5 ${className}`}>
      <span className="logo-mark relative block shrink-0" style={markMask}>
        <Image src={mark} alt="" preload={preload} className="block h-11 w-auto max-[359px]:h-9 sm:h-12" />
      </span>
      {/* viewBox hugs the ink of "CLOUTE" at 100px; the second line is stretched to the same width. */}
      <svg
        viewBox="3 -76 413 116"
        aria-hidden="true"
        className={`logo-word block h-auto w-[7.625rem] shrink-0 overflow-visible max-[359px]:w-[6.5rem] font-display transition-colors duration-300 ease-(--ease-premium) sm:w-[8.5rem] xl:w-[9rem] ${
          tone === "white" ? "text-white" : "text-black"
        }`}
        fill="currentColor"
      >
        <text x="0" y="0" fontSize="100" fontWeight="800">{copy.logo.Logo.text02_cloute}</text>
        <text x="3" y="39" fontSize="32.5" fontWeight="700" textLength="413" lengthAdjust="spacing">{copy.logo.Logo.text03_technologies_pvt_ltd}</text>
      </svg>
    </span>
  );
}
