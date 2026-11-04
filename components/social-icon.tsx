import type { SocialNetwork } from "@/lib/site";
import copy from "@/content/common.json";

// Brand marks are not part of lucide-react; these outlines are adapted from Tabler Icons (MIT)
// so they share Lucide's 24px grid and stroke style.
const paths: Record<SocialNetwork, string[]> = copy.socialIcon.paths;

export function SocialIcon({ network, className = "size-4" }: { network: SocialNetwork; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[network].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
