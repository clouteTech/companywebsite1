"use client";

import Image, { type ImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type RotatingImageProps = Omit<ImageProps, "src" | "preload"> & {
  images: StaticImageData[];
  /** Time each photo stays up, in milliseconds. */
  interval?: number;
  /** Delay before the first change, so neighbouring images do not all switch together. */
  offset?: number;
  /** Load the first photo with priority (above the fold). */
  preload?: boolean;
};

/**
 * Cross-fades between photos on a timer, in place of a single next/image. Every photo is stacked in the
 * same box (so the parent must be positioned, as with `fill`); the first is the one painted on the server
 * and the rest load lazily. It only runs while the image is on screen and the tab is visible, and it
 * stays on the first photo for visitors who prefer reduced motion. Hovering its card changes the photo at once.
 */
export function RotatingImage({
  images,
  interval = 6000,
  offset = 0,
  preload = false,
  style,
  alt,
  ...rest
}: RotatingImageProps) {
  const [active, setActive] = useState(0);
  const first = useRef<HTMLImageElement>(null);
  const hovering = useRef(false);

  // Hovering (or focusing) the surrounding link, card or section switches to the next photo straight away and
  // keeps stepping through them; leaving returns to the first. Works for touch-free pointers only.
  useEffect(() => {
    const target = first.current?.closest("a, article, li, section") ?? first.current?.parentElement;
    if (!target || images.length < 2) return;
    let timer = 0;
    const start = () => {
      hovering.current = true;
      window.clearInterval(timer);
      setActive(1);
      timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), 1400);
    };
    const stop = () => {
      hovering.current = false;
      window.clearInterval(timer);
      setActive(0);
    };
    target.addEventListener("pointerenter", start);
    target.addEventListener("pointerleave", stop);
    return () => {
      window.clearInterval(timer);
      target.removeEventListener("pointerenter", start);
      target.removeEventListener("pointerleave", stop);
    };
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = true;
    let timer = 0;
    let started = 0;
    const tick = () => {
      if (onScreen && !hovering.current && document.visibilityState === "visible") setActive((index) => (index + 1) % images.length);
    };
    // Randomised a little so a page full of images does not change in lock-step.
    started = window.setTimeout(() => {
      tick();
      timer = window.setInterval(tick, interval);
    }, offset + Math.random() * 1500);

    const watcher =
      first.current && "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting))
        : null;
    if (first.current) watcher?.observe(first.current);

    return () => {
      window.clearTimeout(started);
      window.clearInterval(timer);
      watcher?.disconnect();
    };
  }, [images.length, interval, offset]);

  return (
    <>
      {images.map((image, i) => (
        <Image
          key={image.src}
          ref={i === 0 ? first : undefined}
          src={image}
          alt={i === 0 ? alt : ""}
          preload={i === 0 ? preload : undefined}
          loading={i === 0 ? undefined : "lazy"}
          style={{ ...style, opacity: i === active ? 1 : 0, transition: "opacity 1800ms ease-in-out" }}
          aria-hidden={i === 0 ? undefined : true}
          {...rest}
        />
      ))}
    </>
  );
}
