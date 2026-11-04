"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Site-wide scroll reveal. After every navigation it tags the headings,
 * copy, images and cards that start below the fold with a varied entrance (rise, slide in from either side,
 * zoom, blur-in, clip-wipe) and plays it as they scroll into view. Siblings are staggered, and the first and
 * last card of a row come in from opposite sides.
 *
 * Elements that already have their own animation (scroll-driven or keyframed) are left alone, and so is
 * everything that is on screen at load. The effect runs entirely through the Web Animations API, so the
 * server-rendered markup is never edited (no classes, attributes or styles that React would flag as a
 * hydration mismatch). Without JavaScript or with reduced motion the page is simply static.
 */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const FROM: Record<string, Keyframe> = {
  up: { opacity: 0, translate: "0 48px" },
  left: { opacity: 0, translate: "-72px 0", rotate: "-1.5deg" },
  right: { opacity: 0, translate: "72px 0", rotate: "1.5deg" },
  zoom: { opacity: 0, scale: 0.86, translate: "0 24px" },
  blur: { opacity: 0, filter: "blur(14px)", translate: "0 28px", letterSpacing: "0.04em" },
  flip: { opacity: 0, transform: "perspective(900px) rotateX(18deg) translateY(36px)" },
  clip: { opacity: 0, clipPath: "inset(0 0 100% 0 round 1rem)", scale: 1.06 },
};
const ClipEnd: Keyframe = { clipPath: "inset(0 0 0 0 round 1rem)" };

const TARGETS = [
  "main h1, main h2, main h3, main h4",
  "main p, main li, main figure, main img, main video",
  "main .btn, main blockquote, main table",
  "main [class*='card'], main [class*='tile'], main [class*='panel']",
  "footer h2, footer h3, footer li",
].join(",");

const SKIP = "[data-no-reveal], [role='dialog'], .slide, header, nav, button, [class*='slider'], [class*='carousel'], [class*='marquee'], input, textarea, select, svg *";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new Set<Element>();
    // Each pending element keeps its "hidden" animation and the reveal to play when it scrolls into view.
    const pending = new Map<Element, { hold: Animation; kind: string; delay: number }>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const item = pending.get(entry.target);
          io.unobserve(entry.target);
          if (!item) continue;
          pending.delete(entry.target);
          item.hold.cancel();
          const frames: Keyframe[] = [FROM[item.kind]];
          if (item.kind === "clip") frames.push(ClipEnd);
          entry.target.animate(frames, { duration: 900, delay: item.delay, easing: EASE, fill: "backwards" });
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const tag = () => {
      const all = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
      const chosen = new Set(all);
      const fold = window.innerHeight;
      for (const el of all) {
        if (seen.has(el) || el.closest(SKIP)) continue;
        // Only the outermost match animates; its contents ride along.
        let parent = el.parentElement;
        let nested = false;
        while (parent) {
          if (chosen.has(parent) && !parent.matches(SKIP)) {
            nested = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (nested) continue;

        // No box yet (content the browser has not rendered, see .defer-render): look again when it renders.
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) continue;
        seen.add(el);
        if (rect.top < fold * 0.92) continue;
        if (getComputedStyle(el).animationName !== "none") continue;

        const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => chosen.has(c as HTMLElement)) : [el];
        const index = Math.max(0, siblings.indexOf(el));
        const row = siblings.length;
        const media = el.matches("img, video, figure");
        const heading = el.matches("h1, h2, h3, h4");

        let kind = "up";
        if (media) kind = index % 2 ? "clip" : "zoom";
        else if (heading) kind = "blur";
        else if (row > 1) {
          if (index === 0 && row > 2) kind = "left";
          else if (index === row - 1 && row > 2) kind = "right";
          else kind = ["up", "zoom", "flip"][index % 3];
        }

        // Hold the element invisible until it scrolls in; cancelling this animation reveals it.
        const hold = el.animate({ opacity: 0 }, { duration: 1, fill: "both" });
        pending.set(el, { hold, kind, delay: Math.min(index, 6) * 80 });
        io.observe(el);
      }
    };

    // Wait for the route's content (and any lazy sections) to be laid out, then pick up late arrivals too.
    let later = 0;
    const first = window.setTimeout(tag, 60);
    const mutations = new MutationObserver(() => {
      window.clearTimeout(later);
      later = window.setTimeout(tag, 120);
    });
    mutations.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });
    // Sections the browser skips rendering (content-visibility) get their boxes when they near the window.
    const rendered = (event: Event) => {
      if ((event as Event & { skipped?: boolean }).skipped) return;
      window.clearTimeout(later);
      later = window.setTimeout(tag, 30);
    };
    document.addEventListener("contentvisibilityautostatechange", rendered, true);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(later);
      mutations.disconnect();
      document.removeEventListener("contentvisibilityautostatechange", rendered, true);
      io.disconnect();
      pending.forEach((item) => item.hold.cancel());
      pending.clear();
    };
  }, [pathname]);

  return null;
}
