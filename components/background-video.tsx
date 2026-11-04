"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundVideoProps {
  /** Video for tablets and larger. */
  src: string;
  /** Sharper video for large screens (1440px wide and up). */
  largeSrc?: string;
  /** Lighter video for phones (up to 767px wide). */
  mobileSrc?: string;
  /** Still frame shown until the video plays (omit when an image already sits underneath). */
  poster?: string;
  /** Only start downloading once the video comes near the viewport. */
  lazy?: boolean;
  className?: string;
}

/**
 * Muted, looping, decorative background video. It fades in once actually playing, pauses while
 * off screen, and — when `lazy` — downloads nothing until its section approaches the viewport,
 * so a page with several videos only ever fetches the ones a visitor reaches.
 */
export function BackgroundVideo({ src, largeSrc, mobileSrc, poster, lazy = false, className = "" }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not reflect `muted` into the server HTML, so set it before asking to play.
    video.muted = true;

    // Autoplay can begin before hydration, so check the current state as well as listening.
    const reveal = () => (video.dataset.playing = "true");
    if (!video.paused && video.readyState > 2) reveal();
    video.addEventListener("playing", reveal);

    // Start fetching a little before the video scrolls into view.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "400px 0px" },
    );
    // Play only while visible.
    const player = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    loader.observe(video);
    player.observe(video);

    // A video that is not lazy still waits for the page to finish loading, so its download never competes with
    // the first paint (the poster shows meanwhile).
    let idle = 0;
    const start = () => {
      idle = window.setTimeout(() => setNear(true), 300);
    };
    if (!lazy) {
      if (document.readyState === "complete") start();
      else window.addEventListener("load", start, { once: true });
    }
    return () => {
      window.clearTimeout(idle);
      window.removeEventListener("load", start);
      loader.disconnect();
      player.disconnect();
      video.removeEventListener("playing", reveal);
    };
  }, [lazy]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload={near ? "auto" : "none"}
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      className={`transition-opacity duration-1000 ease-(--ease-premium) ${
        poster ? "" : "opacity-0 data-[playing=true]:opacity-100"
      } ${className}`}
    >
      {/* Sources are only added once near, which starts the download. */}
      {near ? (
        <>
          {mobileSrc ? <source src={mobileSrc} type="video/mp4" media="(max-width: 767px)" /> : null}
          {largeSrc ? <source src={largeSrc} type="video/mp4" media="(min-width: 1440px)" /> : null}
          <source src={src} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}
