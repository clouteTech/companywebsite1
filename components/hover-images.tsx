"use client";

import Image, { type ImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type HoverImagesProps = Omit<ImageProps, "src" | "preload"> & {
  images: StaticImageData[];
  /** Time each photo stays up while the pointer is over the link, in milliseconds. */
  interval?: number;
};

/**
 * Shows the first photo at rest. While the pointer (or keyboard focus) is on the surrounding link, it fades to
 * the next photo straight away and keeps stepping through the rest; leaving returns to the first. The photos
 * are stacked in the same box (the parent must be positioned, as with `fill`), and the rest load lazily.
 */
export function HoverImages({ images, interval = 1100, style, alt, ...rest }: HoverImagesProps) {
  const [active, setActive] = useState(0);
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = anchor.current?.closest("a");
    if (!link || images.length < 2) return;
    let timer = 0;
    const start = () => {
      window.clearInterval(timer);
      setActive(1);
      timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), interval);
    };
    const stop = () => {
      window.clearInterval(timer);
      setActive(0);
    };
    link.addEventListener("pointerenter", start);
    link.addEventListener("pointerleave", stop);
    link.addEventListener("focus", start);
    link.addEventListener("blur", stop);
    return () => {
      window.clearInterval(timer);
      link.removeEventListener("pointerenter", start);
      link.removeEventListener("pointerleave", stop);
      link.removeEventListener("focus", start);
      link.removeEventListener("blur", stop);
    };
  }, [images.length, interval]);

  return (
    <>
      <span ref={anchor} hidden />
      {images.map((image, i) => (
        <Image
          key={image.src}
          src={image}
          alt={i === 0 ? alt : ""}
          loading={i === 0 ? undefined : "lazy"}
          aria-hidden={i === 0 ? undefined : true}
          style={{ ...style, opacity: i === active ? 1 : 0, transition: "opacity 600ms ease-in-out" }}
          {...rest}
        />
      ))}
    </>
  );
}
