"use client";

import {
  BadgeCheck,
  CalendarCheck,
  Check,
  FileText,
  Radar,
  Send,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface Candidate {
  initials: string;
  skills: string[];
  match: boolean;
}

interface Labels {
  live: string;
  sample: string;
  brief: string;
  role: string;
  need: string[];
  scanning: string;
  match: string;
  shortlist: string;
  interview: string;
  offer: string;
  joined: string;
}

const TICK_MS = 1000;
const LOOP = 19;
const COLS = 4;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/*
 * Talent match: a job brief sits under a pool of candidate profiles. A scan sweeps across the pool, and as it
 * passes each column the profiles that fit light up with a "Match" badge while the rest dim. The matches then
 * glide into a shortlist, move on to "Interview set" and "Offer sent", and the first one ends as "Joined" with a
 * ring bursting out. It loops while on screen. The candidates are sample content, labelled as such. Styles in
 * globals.css (.rm-*).
 */
export function TalentMatch({
  candidates,
  labels,
}: {
  candidates: Candidate[];
  labels: Labels;
}) {
  const [tick, setTick] = useState(0);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(
      () => setTick((n) => (n + 1) % LOOP),
      TICK_MS,
    );
    return () => window.clearInterval(timer);
  }, [visible]);

  // Sweep: how many columns of the pool it has passed (it starts at tick 2 and moves a column every 1.2 ticks).
  const scanning = tick >= 2 && tick < 7.5;
  const passed =
    tick < 2 ? 0 : Math.min(COLS, Math.floor((tick - 2) / 1.2) + 1);
  const beam = Math.min(1, Math.max(0, (tick - 2) / (COLS * 1.2)));
  const shortlisted = tick >= 8;

  const cards = candidates.map((candidate, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const scanned = col < passed;
    const matched = candidate.match && scanned;
    const dim = scanned && !candidate.match;
    const moved = candidate.match && shortlisted;
    // A match's place in the shortlist is its order among the matches.
    const my = candidate.match
      ? candidates.slice(0, i).filter((other) => other.match).length
      : 0;
    let step = 0;
    if (moved)
      step =
        tick >= 15 && my === 0 ? 4 : tick >= 12.5 ? 3 : tick >= 10.5 ? 2 : 1;
    return { candidate, i, col, row, matched, dim, moved, my, step };
  });

  return (
    <div ref={rootRef} className="rm">
      <div className="rm-head">
        <p className="rm-live">
          <i />
          {labels.live}
        </p>
        <p className="rm-sample">{labels.sample}</p>
      </div>

      <div className="rm-stage">
        <div className="rm-pool" aria-hidden="true">
          <span
            className="rm-beam"
            data-on={scanning || undefined}
            style={v({ "--p": beam })}
          />
          {cards.map(
            ({ candidate, i, col, row, matched, dim, moved, my, step }) => (
              <div
                key={i}
                className="rm-card"
                data-match={matched || undefined}
                data-dim={dim || undefined}
                data-fade={tick >= 17 || undefined}
                data-snap={tick === 0 || undefined}
                data-moved={moved || undefined}
                data-step={step}
                style={v({
                  "--c": moved ? COLS : col,
                  "--r": moved ? my : row,
                  "--h": (i * 57 + 20) % 360,
                })}
              >
                <span className="rm-avatar">{candidate.initials}</span>
                <span className="rm-card-text">
                  <span className="rm-skills">
                    {candidate.skills.map((skill) => (
                      <b key={skill}>{skill}</b>
                    ))}
                  </span>
                  <small>
                    {step === 4 ? (
                      <>
                        <BadgeCheck className="size-3" aria-hidden="true" />{" "}
                        {labels.joined}
                      </>
                    ) : step === 3 ? (
                      <>
                        <Send className="size-3" aria-hidden="true" />{" "}
                        {labels.offer}
                      </>
                    ) : step === 2 ? (
                      <>
                        <CalendarCheck className="size-3" aria-hidden="true" />{" "}
                        {labels.interview}
                      </>
                    ) : matched ? (
                      <>
                        <Sparkles className="size-3" aria-hidden="true" />{" "}
                        {labels.match}
                      </>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </small>
                </span>
                {matched || moved ? (
                  <Check
                    className="rm-tick size-4 shrink-0"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            ),
          )}
        </div>

        <div className="rm-lane" aria-hidden="true">
          <p>
            <Sparkles className="size-4" aria-hidden="true" />
            {labels.shortlist}
          </p>
        </div>

        <div className="rm-brief" aria-hidden="true">
          <span className="rm-brief-icon">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          <div className="rm-brief-text">
            <small>{labels.brief}</small>
            <b>{labels.role}</b>
          </div>
          <ul className="rm-need">
            {labels.need.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="rm-scan-label" data-on={scanning || undefined}>
            <Radar className="size-4" aria-hidden="true" />
            {labels.scanning}
          </span>
        </div>
      </div>
    </div>
  );
}
