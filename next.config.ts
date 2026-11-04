import type { NextConfig } from "next";

// Pages from the original static site, so existing links and search results keep working.
const legacyPages = [
  "about-us",
  "cloud-services",
  "contact",
  "cybersecurity-services",
  "it-support-and-helpdesk",
  "managed-it-services",
  "networking-and-infrastructure",
  "products",
  "recruitment",
  "software-development-services",
  "thank-you",
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /* config options here */
  // Hide the on-screen route indicator badge in development; compile and runtime errors still surface.
  devIndicators: false,
  // Let phones on the local network load dev scripts (otherwise the page renders but nothing is interactive).
  // Dev-only; update these if the machine's LAN address changes.
  // Any address on the local network, so other devices keep working when the LAN IP changes.
  // The GoDaddy preview host is allowed too, otherwise its dev resources (HMR, error overlay) are blocked.
  allowedDevOrigins: ["192.168.*.*", "172.23.0.1", "*.airoapp.ai"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      // Slugs from the WordPress site, so its indexed URLs keep resolving.
      { source: "/home4", destination: "/", permanent: true },
      { source: "/it-hardware", destination: "/products", permanent: true },
      ...legacyPages.map((page) => ({ source: `/${page}.html`, destination: `/${page}`, permanent: true })),
    ];
  },
};

export default nextConfig;
