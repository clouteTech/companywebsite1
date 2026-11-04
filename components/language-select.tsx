"use client";

import { BR, CA, CN, DE, ES, FR, GB, ID, IL, IN, JP, KR, NL, SA, TH, TW, VN } from "country-flag-icons/react/3x2";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import { chooseLanguage, currentLanguageId, languages, resumeTranslation, subscribeLanguage, type Language } from "@/lib/translate";
import copy from "@/content/navbar.json";

let resumed = false;

// SVG flags rather than emoji, which Windows shows as plain letters.
const flags = { BR, CA, CN, DE, ES, FR, GB, ID, IL, IN, JP, KR, NL, SA, TH, TW, VN };

function Flag({ country, className = "" }: { country: Language["country"]; className?: string }) {
  const Svg = flags[country];
  return <Svg aria-hidden="true" className={`shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgb(15_23_42/0.12)] ${className}`} />;
}

interface LanguageSelectProps {
  /** Light text and glass button for dark heroes. */
  dark?: boolean;
  className?: string;
}

/** Globe button with a dropdown of the site's languages (machine translated via lib/translate). */
export function LanguageSelect({ dark = false, className = "" }: LanguageSelectProps) {
  const current = useSyncExternalStore(subscribeLanguage, currentLanguageId, () => "en");
  const language = languages.find((l) => l.id === current) ?? languages[0];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (resumed) return;
    resumed = true;
    resumeTranslation();
  }, []);

  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLElement>("[aria-current=true]")?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // translate="no": the menu always shows each language in its own script.
    <div ref={rootRef} translate="no" className={`notranslate relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language: ${language.label}`}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-300 ${
          dark ? "bg-white/14 text-white backdrop-blur-md hover:bg-white/22" : "bg-ink/5 hover:bg-ink/10"
        }`}
      >
        <Flag country={language.country} className="h-3.5 w-[1.3125rem]" />
        <span>{language.short}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform duration-300 ease-(--ease-premium) ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={listId}
        className={`absolute top-full right-0 z-10 mt-2 w-[28rem] origin-top-right max-sm:fixed max-sm:inset-x-3 max-sm:top-16 max-sm:w-auto max-sm:origin-top rounded-2xl border border-line bg-white p-1.5 text-ink shadow-[0_24px_60px_-20px_rgb(11_30_57/0.35)] transition-[opacity,scale,visibility] duration-300 ease-(--ease-premium) ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        <p className="text-eyebrow px-3 pt-2 pb-1.5 text-muted">{copy.languageSelect.LanguageSelect.text01_language}</p>
        {/* Two columns read top to bottom, so every language shows at once without scrolling. */}
        <ul className="grid grid-flow-col grid-cols-2 grid-rows-8 gap-x-1">
          {languages.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                aria-current={l.id === current}
                onClick={() => {
                  setOpen(false);
                  chooseLanguage(l.id);
                }}
                className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm leading-tight sm:px-3 transition-colors hover:bg-paper focus-visible:bg-paper aria-[current=true]:font-semibold aria-[current=true]:text-brand"
              >
                <span className="flex items-center gap-2.5">
                  <Flag country={l.country} className="h-4 w-6" />
                  <span lang={l.id}>{l.label}</span>
                </span>
                {l.id === current ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
