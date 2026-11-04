"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { serviceLinks } from "@/lib/site";
import logoMark from "@/public/images/logo-mark.png";
import copy from "@/content/services.json";

/*
 * "4D" service cube (styles in globals.css, .sc-*): a neon photo cube spinning continuously inside three
 * gyroscope rings, over a moving grid floor, with every service listed either side as a chip joined to it by a beam. Its four sides are reused as it turns (each side is given the next
 * service while it is behind the cube), so all eight services come round in order. Below it, the service at the
 * front is named, and the chips jump to any service. It always turns, tumbling on three axes inside a spinning
 * wireframe cube (the "4D" tesseract look).
 */
const LEFT = 4; // services listed left of the cube; the rest go on the right
const SPEED = 45; // degrees per second: a quarter turn (one service) every 2 seconds
const SIDES = 4;
const TILT = 25; // degrees; keep in step with the extra rotateY in .sc-cube

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function ServiceCube() {
  const count = serviceLinks.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<number | null>(null);
  const slotRef = useRef(0);
  // The quarter-turn currently facing the front; it only grows, so the cube keeps turning one way.
  const [slot, setSlot] = useState(0);

  useEffect(() => {
    const cube = cubeRef.current;
    const root = rootRef.current;
    if (!cube || !root) return;

    let angle = 0;
    let last = 0;
    let frame = 0;
    let visible = false;

    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      const target = targetRef.current;
      if (target !== null) {
        angle += (target - angle) * Math.min(1, dt * 5);
        if (Math.abs(target - angle) < 0.3) targetRef.current = null;
      } else {
        angle += SPEED * dt;
      }
      cube.style.setProperty("--angle", `${angle}deg`);
      // The "4D" tumble: while it turns, the cube also nods forward and back and leans side to side,
      // on slow, out-of-step waves so the motion never repeats exactly.
      const t = now / 1000;
      cube.style.setProperty("--nod", `${(-16 + 12 * Math.sin(t * 0.7)).toFixed(2)}deg`);
      cube.style.setProperty("--lean", `${(7 * Math.sin(t * 0.45 + 1)).toFixed(2)}deg`);
      // The cube is drawn turned a further 25° (see .sc-cube), so the face nearest the viewer is at angle + 25.
      const n = Math.round((angle + TILT) / 90);
      if (n !== slotRef.current) {
        slotRef.current = n;
        setSlot(n);
      }
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    // Only spin while on screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = 0;
        frame = requestAnimationFrame(loop);
      }
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const active = mod(slot, count);

  // Each side shows the service for the nearest quarter-turn at which it faces the front.
  const sideService = (side: number) => {
    let offset = mod(side - slot, SIDES);
    if (offset === 3) offset = -1;
    return mod(slot + offset, count);
  };

  /** Spin forward to the next quarter-turn that shows service `index`. */
  function goTo(index: number) {
    const ahead = mod(index - active, count);
    targetRef.current = (slotRef.current + ahead) * 90 - TILT;
  }

  const current = serviceLinks[active];

  // A service chip: choosing it turns the cube to that service; the active one glows and its beam fills.
  const chip = (service: (typeof serviceLinks)[number], i: number) => (
    <li key={service.href} className="sc-chip-item" style={{ "--i": i } as CSSProperties}>
      <button
        type="button"
        className="sc-chip"
        data-active={i === active || undefined}
        aria-pressed={i === active}
        onClick={() => goTo(i)}
      >
        <span className="sc-chip-icon">
          <service.icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="sc-chip-label">{service.footerLabel}</span>
        <span aria-hidden="true" className="sc-chip-num">
          {String(i + 1).padStart(2, "0")}
        </span>
      </button>
      <span aria-hidden="true" className="sc-beam">
        <i />
      </span>
    </li>
  );

  return (
    <div ref={rootRef} className="sc">
      {/* Data streams falling at the far edges */}
      <div aria-hidden="true" className="sc-streams">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      {/* Services on the left of the cube, each joined to it by a beam */}
      <ul className="sc-chips sc-chips-left" aria-label={copy.serviceCube.ServiceCube.arialabel01_services}>
        {serviceLinks.slice(0, LEFT).map((service, i) => chip(service, i))}
      </ul>

      <div className="sc-stage">
        <div aria-hidden="true" className="sc-floor" />
        <div aria-hidden="true" className="sc-glow" />
        <div className="sc-scene">
          {/* Gyroscope rings, each turning on its own axis */}
          <span aria-hidden="true" className="sc-gyro sc-gyro-a" />
          <span aria-hidden="true" className="sc-gyro sc-gyro-b" />
          <span aria-hidden="true" className="sc-gyro sc-gyro-c" />

          {/* Tesseract frame: a wireframe cube spinning on all three axes around the photo cube */}
          <div aria-hidden="true" className="sc-tess">
            {["front", "back", "right", "left", "top", "bottom"].map((face) => (
              <span key={face} className={`sc-tess-face sc-tess-${face}`} />
            ))}
          </div>

          <div ref={cubeRef} className="sc-cube">
            {Array.from({ length: SIDES }, (_, side) => {
              const service = serviceLinks[sideService(side)];
              const front = mod(slot, SIDES) === side;
              return (
                <Link
                  key={side}
                  href={service.href}
                  tabIndex={front ? 0 : -1}
                  aria-hidden={front ? undefined : true}
                  className={`sc-face sc-side-${side}`}
                >
                  <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 300px, 220px" className="sc-img" />
                  <span aria-hidden="true" className="sc-shade" />
                  <span aria-hidden="true" className="sc-holo" />
                  <span className="sc-face-icon">
                    <service.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="sc-face-label">{service.label}</span>
                </Link>
              );
            })}
            {["top", "bottom"].map((cap) => (
              <span key={cap} aria-hidden="true" className={`sc-face sc-cap sc-${cap}`}>
                <Image src={logoMark} alt="" sizes="6rem" className="sc-cap-logo" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* …and on the right */}
      <ul className="sc-chips sc-chips-right" aria-label={copy.serviceCube.ServiceCube.arialabel02_more_services}>
        {serviceLinks.slice(LEFT).map((service, i) => chip(service, i + LEFT))}
      </ul>

      {/* The service at the front */}
      <div className="sc-caption text-center">
        <p className="sc-kicker" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <p key={active} className="sc-name" aria-live="polite">
          {current.label}
        </p>
        <Link href={current.href} className="btn btn-primary mt-2">{copy.serviceCube.ServiceCube.text03_explore}{current.footerLabel}
          <ArrowRight className="btn-arrow size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
