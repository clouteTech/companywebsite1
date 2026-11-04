"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

import { Presenter } from "./presenter";
import copy from "@/content/common.json";

export interface Stage {
  id: string;
  label: string;
}

/**
 * Keynote progress for the technology page. Tracks which stage is on screen (native scrolling,
 * nothing hijacked) and shows it two ways: a sticky "now presenting" rail with the presenter on
 * desktop, and a compact sticky bar on smaller screens. Both link straight to any stage.
 */
export function StageNav({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = stages.map((stage) => document.getElementById(stage.id)).filter((el): el is HTMLElement => !!el);
    // A stage is "on" while it crosses the middle band of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(sections.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: copy.stageNav.StageNav.rootMargin01_45_0px_50_0px },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [stages]);

  const current = stages[active];
  const next = stages[active + 1];
  const number = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      {/* Phones and tablets: a slim bar that stays under the header. */}
      <nav
        aria-label={copy.stageNav.StageNav.arialabel02_presentation_stages}
        className="on-dark glass sticky top-16 z-30 border-b border-white/10 bg-midnight/80 text-white lg:hidden"
      >
        <div className="shell flex h-12 items-center gap-3">
          <span className="font-display text-sm text-accent tabular-nums">
            {number(active)} / {number(stages.length - 1)}
          </span>
          <span className="truncate text-sm font-medium">{current.label}</span>
          {next ? (
            <a href={`#${next.id}`} className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs text-white/70 hover:text-white">{copy.stageNav.StageNav.text03_next}<ArrowDown className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
        <div className="h-0.5 bg-white/10">
          <div
            className="h-full origin-left bg-[linear-gradient(90deg,var(--color-brand),var(--color-accent))] transition-transform duration-500 ease-(--ease-premium)"
            style={{ transform: `scaleX(${(active + 1) / stages.length})` }}
          />
        </div>
      </nav>

      {/* Desktop: the presenter rail rides alongside the stages. */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="shell h-full">
          <aside className="on-dark pointer-events-auto sticky top-24 w-64 text-white">
            <Presenter className="mx-auto h-56 w-auto" />
            <div className="glass mt-2 rounded-2xl p-5">
              <p className="text-eyebrow text-accent">{copy.stageNav.StageNav.text04_now_presenting}</p>
              <p className="mt-2 font-display text-[1.375rem] leading-tight font-semibold tracking-tight">
                <span className="mr-2 text-white/40 tabular-nums">{number(active)}</span>
                {current.label}
              </p>
              <nav aria-label={copy.stageNav.StageNav.arialabel05_presentation_stages} className="mt-5">
                <ol className="space-y-1">
                  {stages.map((stage, i) => (
                    <li key={stage.id}>
                      <a
                        href={`#${stage.id}`}
                        aria-current={i === active ? "step" : undefined}
                        className="group flex items-center gap-3 rounded-lg py-1.5 text-sm text-white/55 transition-colors hover:text-white aria-[current=step]:text-white"
                      >
                        <span
                          className={`h-0.5 rounded-full transition-[width,background-color] duration-500 ease-(--ease-premium) ${
                            i === active ? "w-8 bg-accent" : i < active ? "w-4 bg-white/50" : "w-4 bg-white/20"
                          }`}
                        />
                        {stage.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
