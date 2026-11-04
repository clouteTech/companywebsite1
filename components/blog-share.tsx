import type { CSSProperties } from "react";

import { SocialIcon } from "@/components/social-icon";
import { socials } from "@/lib/site";
import copy from "@/content/blogs.json";

/**
 * Share links for one post (Instagram, LinkedIn, X, WhatsApp and Facebook), opening the network's own share dialog. Each button
 * wears its network's colour (styles in globals.css, .bs-btn) and fills with it on hover.
 */
export function BlogShare({
  slug,
  title,
  dark = false,
  vertical = false,
}: {
  slug: string;
  title: string;
  dark?: boolean;
  vertical?: boolean;
}) {
  const url = encodeURIComponent(`https://cloute.co.in/blogs/${slug}`);
  const text = encodeURIComponent(title);
  // Instagram has no web share dialog, so it opens the company profile.
  const instagram = socials.find((item) => item.network === "instagram")?.href ?? "https://www.instagram.com/";
  const links = [
    { network: "instagram", label: "Instagram", href: instagram },
    { network: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { network: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { network: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${text}%20${url}` },
    { network: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  ] as const;
  return (
    <ul className={`flex gap-2.5 ${vertical ? "flex-col" : "items-center"}`} aria-label={copy.page.shareLabel}>
      {links.map((link, i) => (
        <li key={link.network} className="bs-pop" style={{ "--i": i } as CSSProperties}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.page.shareLabel} on ${link.label}`}
            className="bs-btn"
            data-network={link.network}
            data-dark={dark || undefined}
          >
            <SocialIcon network={link.network} />
          </a>
        </li>
      ))}
    </ul>
  );
}
