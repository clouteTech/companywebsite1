"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { languages, type Lang } from "@/lib/chatbot/knowledge";
import { languageNames, t } from "@/lib/chatbot/translations";

/**
 * Custom listbox (a native <select> menu can't be styled): a pill button that opens a small card of
 * languages, each in its own script with the English name beneath. Arrow keys, Home/End, Enter/Space
 * and Escape work as in a native select; clicking outside closes it. Styles in globals.css (.cb-lang*).
 */
export function LanguageSelector({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(languages.indexOf(lang));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function show() {
    setActive(languages.indexOf(lang));
    setOpen(true);
  }

  function choose(code: Lang) {
    setOpen(false);
    buttonRef.current?.focus();
    if (code !== lang) onChange(code);
  }

  function onButtonKey(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      show();
    }
  }

  function onListKey(event: KeyboardEvent) {
    const last = languages.length - 1;
    const moves: Record<string, () => number> = {
      ArrowDown: () => Math.min(active + 1, last),
      ArrowUp: () => Math.max(active - 1, 0),
      Home: () => 0,
      End: () => last,
    };
    if (moves[event.key]) {
      event.preventDefault();
      setActive(moves[event.key]());
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(languages[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div ref={rootRef} className="cb-lang" data-open={open || undefined}>
      <button
        ref={buttonRef}
        type="button"
        className="cb-lang-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${t("language", lang)}: ${languageNames[lang].native}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onButtonKey}
      >
        <span className="cb-lang-globe" aria-hidden="true">
          <Languages className="size-3.5" />
        </span>
        <span lang={lang}>{languageNames[lang].native}</span>
        <ChevronDown className="cb-lang-chevron size-4" aria-hidden="true" />
      </button>

      <ul
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        aria-label={t("language", lang)}
        aria-activedescendant={open ? `${id}-${languages[active]}` : undefined}
        className="cb-lang-menu"
        hidden={!open}
        onKeyDown={onListKey}
      >
        {languages.map((code, i) => (
          <li
            key={code}
            id={`${id}-${code}`}
            role="option"
            aria-selected={code === lang}
            data-active={i === active || undefined}
            className="cb-lang-option"
            style={{ "--i": i } as CSSProperties}
            onPointerEnter={() => setActive(i)}
            onClick={() => choose(code)}
          >
            <span className="cb-lang-code" aria-hidden="true">
              {code.toUpperCase()}
            </span>
            <span className="cb-lang-names">
              <span lang={code} className="cb-lang-native">
                {languageNames[code].native}
              </span>
              <span className="cb-lang-english">{languageNames[code].english}</span>
            </span>
            {code === lang ? <Check className="cb-lang-check size-4" aria-hidden="true" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
