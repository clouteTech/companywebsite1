import { ArrowUpRight, Star } from "lucide-react";
import type { CSSProperties } from "react";

import { ReviewFlow, type Review } from "@/components/review-flow";
import { SectionHeading } from "@/components/sections";
import copy from "@/content/reviews.json";

/*
 * Customer reviews taken from the Google Business Profile (text in content/reviews.json, kept as written).
 * The heading and Google badge sit above the 3D cover-flow of reviews (review-flow.tsx) on the
 * right. Styles in globals.css (.grv-*, .grf-*).
 */

const { GoogleReviews: ui, reviews } = copy.googleReviews;

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function GoogleReviews() {
  return (
    <section id="testimonials" className="on-dark grv section-y relative isolate overflow-clip bg-midnight text-white">
      <span aria-hidden="true" className="grv-orb grv-orb-a" />
      <span aria-hidden="true" className="grv-orb grv-orb-b" />
      {/* Stars drifting up behind the content. */}
      <div aria-hidden="true" className="grv-float">
        {Array.from({ length: 9 }, (_, i) => (
          <Star key={i} className="grv-float-star" style={{ "--i": i } as CSSProperties} />
        ))}
      </div>
      <div className="shell">
        <SectionHeading eyebrow={ui.eyebrow} title={ui.title} text={ui.text} dark />
        <div className="reveal mt-8 flex justify-center">
          <span className="grv-badge">
            <GoogleLogo className="size-5" />
            {ui.badge}
            <span className="flex gap-0.5" role="img" aria-label={ui.arialabel_stars}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-[#fbbc04] text-[#fbbc04]" aria-hidden="true" />
              ))}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-10">
        <ReviewFlow
          reviews={reviews as Review[]}
          labels={{
            badge: ui.badge,
            localGuide: ui.local_guide,
            ownerReply: ui.owner_reply,
            stars: ui.arialabel_stars,
            previous: ui.previous,
            next: ui.next,
            showReview: ui.show_review,
            play: ui.play,
            pause: ui.pause,
          }}
        />
      </div>

      <div className="shell mt-8 text-center">
        <a href={ui.url} target="_blank" rel="noopener noreferrer" className="btn btn-glass reveal">
          {ui.cta}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
