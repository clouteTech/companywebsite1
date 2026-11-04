"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

export interface Review {
  name: string;
  rating: number;
  text: string;
  localGuide?: boolean;
  reply?: string;
}

interface Labels {
  badge: string;
  localGuide: string;
  ownerReply: string;
  stars: string;
  previous: string;
  next: string;
  showReview: string;
  play: string;
  pause: string;
}

const AUTO_MS = 5500;
const SWIPE_PX = 40;
/** Cards further than this from the middle are hidden. */
const VISIBLE = 3;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const hueOf = (name: string) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;
const initialOf = (name: string) => name.trim().charAt(0).toUpperCase();

/** Splits text into words (keeping spaces and line breaks) so they can fade in one after another. */
function Words({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        part === "" || /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={i} className="grf-word" style={v({ "--w": n++ })}>
            {part}
          </span>
        ),
      )}
    </>
  );
}

/*
 * A 3D cover-flow: the review in the middle faces you, the ones either side turn away and sink back into the
 * distance, fading out. Every card stays mounted and is placed by its distance from the middle (--d signed,
 * --ad absolute), so a change is one smooth CSS transition. It advances by itself, pauses under the pointer,
 * and can be moved with the arrows, a swipe, the dots or a click on a side card. Styles in globals.css (.grf-*).
 */
export function ReviewFlow({ reviews, labels }: { reviews: Review[]; labels: Labels }) {
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  // Plays by itself; the play/pause button stops and restarts it. The restart count re-times the progress ring.
  const [playing, setPlaying] = useState(true);
  const [restarts, setRestarts] = useState(0);
  const drag = useRef<number | null>(null);

  const go = (to: number) => setIndex(((to % count) + count) % count);

  useEffect(() => {
    if (!playing || count < 2) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, playing, restarts, count]);

  const toggle = () => {
    setPlaying((on) => !on);
    setRestarts((n) => n + 1);
  };

  const onDown = (event: PointerEvent) => {
    drag.current = event.clientX;
  };
  const onUp = (event: PointerEvent) => {
    if (drag.current === null) return;
    const delta = event.clientX - drag.current;
    drag.current = null;
    if (Math.abs(delta) > SWIPE_PX) go(index + (delta < 0 ? 1 : -1));
  };

  return (
    <div className="grf">
      <div className="grf-stage" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (drag.current = null)}>
        {reviews.map((review, i) => {
          // Signed distance from the middle card, the short way round the loop.
          let d = i - index;
          if (d > count / 2) d -= count;
          if (d < -count / 2) d += count;
          const ad = Math.abs(d);
          const active = d === 0;
          return (
            <article
              key={review.name}
              className="grf-card"
              data-active={active || undefined}
              data-far={ad > VISIBLE || undefined}
              style={v({ "--d": d, "--ad": Math.min(ad, VISIBLE + 1), "--s": Math.sign(d), "--h": hueOf(review.name) })}
              aria-hidden={!active}
              aria-live={active ? "polite" : undefined}
              onClick={active ? undefined : () => go(i)}
            >
              <span aria-hidden="true" className="grf-shine" />
              <div className="grf-person">
                <span className="grf-avatar" aria-hidden="true">
                  {initialOf(review.name)}
                </span>
                <div className="min-w-0">
                  <p className="grf-name">{review.name}</p>
                  <p className="grf-meta">{review.localGuide ? labels.localGuide : labels.badge}</p>
                </div>
              </div>
              <span className="grf-stars" role="img" aria-label={labels.stars}>
                {Array.from({ length: 5 }, (_, s) => (
                  <Star key={s} className="grf-star size-4" data-on={s < review.rating || undefined} style={v({ "--i": s })} aria-hidden="true" />
                ))}
              </span>
              <p className="grf-text">{active ? <Words text={review.text} /> : review.text}</p>
              {review.reply ? (
                <p className="grf-reply">
                  <b>{labels.ownerReply}</b>
                  {review.reply}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="grf-controls">
        <button type="button" className="grf-arrow" onClick={() => go(index - 1)} aria-label={labels.previous}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <ul className="grf-dots">
          {reviews.map((review, i) => (
            <li key={review.name}>
              <button
                type="button"
                className="grf-dot"
                data-active={i === index || undefined}
                onClick={() => go(i)}
                aria-label={`${labels.showReview} ${review.name}`}
                aria-current={i === index}
              />
            </li>
          ))}
        </ul>
        <button type="button" className="grf-arrow" onClick={() => go(index + 1)} aria-label={labels.next}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="grf-play"
          data-playing={playing || undefined}
          onClick={toggle}
          aria-label={playing ? labels.pause : labels.play}
          aria-pressed={playing}
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {playing ? (
            <svg key={`${index}-${restarts}`} className="grf-ring" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="20" pathLength="1" />
            </svg>
          ) : null}
        </button>
      </div>
    </div>
  );
}
