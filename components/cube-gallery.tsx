"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Code,
  Hand,
  Headset,
  LockKeyhole,
  Megaphone,
  Pause,
  Play,
  Settings,
  UserPlus,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";

interface Item {
  image: StaticImageData;
  label: string;
  href: string;
  text: string;
}

interface Labels {
  hint: string;
  previous: string;
  next: string;
  play: string;
  pause: string;
  explore: string;
  service: string;
}

const SPEED = 14; // degrees per second while it turns by itself
const DRAG = 0.4; // degrees turned per pixel dragged
const SIDES = 4;
const CLICK_SLOP = 6; // pixels of movement after which a press counts as a drag, not a click

/** An icon for each service page, for the panel beside the cube (icons cannot be passed down from the server). */
const icons: Record<string, LucideIcon> = {
  "/networking-and-infrastructure": Waypoints,
  "/software-development-services": Code,
  "/it-support-and-helpdesk": Headset,
  "/managed-it-services": Settings,
  "/cybersecurity-services": LockKeyhole,
  "/cloud-services": CloudUpload,
  "/digital-marketing-services": Megaphone,
  "/recruitment": UserPlus,
};

/** Splits text into words (keeping spaces) so they can rise into place one after another. */
function Words({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        part === "" || /^\s+$/.test(part) ? (
          part
        ) : (
          <span
            key={i}
            className="cg-word"
            style={{ "--w": n++ } as CSSProperties}
          >
            {part}
          </span>
        ),
      )}
    </>
  );
}

const mod = (n: number, m: number) => ((n % m) + m) % m;
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/*
 * A pyramid that turns in 3D with the service details beside it: on the left a pyramid whose four faces each show one
 * service (a face is given the next service while it is behind the pyramid, so all of them come round in order), on
 * the right the name, description and link of the service now at the front. It rotates by itself, can be dragged
 * round, stepped with the arrows or stopped with the play button, and the list of services on the right turns it
 * to any one. It only turns while on screen. The angle goes straight to a CSS variable each frame (no re-render);
 * only the faces and the details change state. Styles in globals.css (.cg-*).
 */
export function CubeGallery({
  items,
  labels,
}: {
  items: Item[];
  labels: Labels;
}) {
  const count = items.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const angle = useRef(0);
  const target = useRef<number | null>(null);
  const drag = useRef<{ x: number; from: number } | null>(null);
  const movedRef = useRef(false);
  const playingRef = useRef(true);
  const slotRef = useRef(0);
  const [playing, setPlaying] = useState(true);
  // The quarter-turn now facing the front; it keeps counting up or down as the cube turns.
  const [slot, setSlot] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    const cube = cubeRef.current;
    if (!stage || !cube) return;

    let frame = 0;
    let last = 0;
    let written = Number.NaN;
    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      if (!drag.current) {
        if (target.current !== null) {
          angle.current +=
            (target.current - angle.current) * Math.min(1, dt * 6);
          if (Math.abs(target.current - angle.current) < 0.2) {
            angle.current = target.current;
            target.current = null;
          }
        } else if (playingRef.current) {
          angle.current += SPEED * dt;
        }
      }
      if (angle.current !== written) {
        written = angle.current;
        cube.style.setProperty("--a", `${angle.current.toFixed(2)}deg`);
        // How far round the current quarter turn it is (0 to 1), for the ring on the play button.
        playRef.current?.style.setProperty(
          "--p",
          (mod(angle.current, 90) / 90).toFixed(3),
        );
        const front = Math.round(angle.current / 90);
        if (front !== slotRef.current) {
          slotRef.current = front;
          setSlot(front);
        }
      }
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    let onScreen = false;
    const sync = () =>
      onScreen && document.visibilityState === "visible" ? start() : stop();
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(stage);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, []);

  const active = mod(slot, count);

  const step = (direction: number) => {
    target.current = (Math.round(angle.current / 90) + direction) * 90;
  };

  /** Turn forward to the next quarter-turn that shows service `index`. */
  const goTo = (index: number) => {
    target.current =
      (Math.round(angle.current / 90) + mod(index - active, count)) * 90;
  };

  // Dragging is tracked on the window, so the link on the front face still gets a normal click.
  const onDown = (event: PointerEvent) => {
    drag.current = { x: event.clientX, from: angle.current };
    movedRef.current = false;
    target.current = null;
    const move = (e: globalThis.PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x;
      if (Math.abs(dx) > CLICK_SLOP) movedRef.current = true;
      angle.current = drag.current.from - dx * DRAG;
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  // A press that turned into a drag is not a click on the link.
  const onClickCapture = (event: MouseEvent) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      movedRef.current = false;
    }
  };

  // With a mouse, moving over the stage tips the pyramid up or down a little; leaving it settles back.
  const onMove = (event: PointerEvent) => {
    const stage = stageRef.current;
    if (!stage || event.pointerType !== "mouse" || drag.current) return;
    const box = stage.getBoundingClientRect();
    const y = ((event.clientY - box.top) / box.height) * 2 - 1;
    stage.style.setProperty("--lean", `${(-12 + y * -9).toFixed(2)}deg`);
  };
  const onLeave = () => stageRef.current?.style.removeProperty("--lean");

  const toggle = () => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };

  // Each side shows the service for the nearest quarter-turn at which it faces the front.
  const sideItem = (side: number) => {
    let offset = mod(side - slot, SIDES);
    if (offset === 3) offset = -1;
    return items[mod(slot + offset, count)];
  };

  const current = items[active];
  const Icon = icons[current.href] ?? Code;

  return (
    <div className="cg">
      <div className="cg-visual">
        <p className="cg-hint">
          <Hand className="size-4" aria-hidden="true" />
          {labels.hint}
        </p>
        <div
          ref={stageRef}
          className="cg-stage"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClickCapture={onClickCapture}
        >
          <div ref={cubeRef} className="cg-cube">
            {Array.from({ length: SIDES }, (_, side) => {
              const item = sideItem(side);
              const front = mod(slot, SIDES) === side;
              return (
                <Link
                  key={side}
                  href={item.href}
                  draggable={false}
                  tabIndex={front ? 0 : -1}
                  aria-hidden={front ? undefined : true}
                  className="cg-face"
                  style={v({ "--k": side })}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 288px, 72vw"
                    quality={60}
                    placeholder="blur"
                    decoding="async"
                    className="cg-img"
                    draggable={false}
                  />
                  <span aria-hidden="true" className="cg-shade" />
                  <span className="cg-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            className="cg-arrow cg-prev"
            onClick={() => step(-1)}
            aria-label={labels.previous}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="cg-arrow cg-next"
            onClick={() => step(1)}
            aria-label={labels.next}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="cg-foot">
          <button
            ref={playRef}
            type="button"
            className="cg-play"
            onClick={toggle}
            aria-label={playing ? labels.pause : labels.play}
            aria-pressed={playing}
          >
            {playing ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
            <svg className="cg-progress" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="20" pathLength="1" />
            </svg>
          </button>
          <ul className="cg-dots" aria-hidden="true">
            {items.map((item, i) => (
              <li key={item.href} data-on={i === active || undefined} />
            ))}
          </ul>
        </div>
      </div>

      <div className="cg-info">
        <div className="cg-detail" key={active} aria-live="polite">
          <p className="cg-count">
            <span className="cg-icon">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            {labels.service} {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
          <h3 className="cg-title">{current.label}</h3>
          <p className="cg-text">
            <Words text={current.text} />
          </p>
          <Link href={current.href} className="btn btn-primary cg-cta">
            {labels.explore} {current.label}
            <ArrowRight className="btn-arrow size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="cg-list">
          {items.map((item, i) => (
            <li key={item.href}>
              <button
                type="button"
                className="cg-chip"
                style={v({ "--i": i })}
                data-on={i === active || undefined}
                onClick={() => goTo(i)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
