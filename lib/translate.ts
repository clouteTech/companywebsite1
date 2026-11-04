// Site-wide machine translation through Google's website translator. The site's own language
// menu drives it; Google's widget stays hidden. Its script is only fetched once a visitor picks
// a language other than English, and the choice is kept in Google's `googtrans` cookie so later
// page loads in the same tab stay translated. Every new visit starts in English.

export interface Language {
  id: string;
  label: string;
  short: string;
  /** Country whose flag represents the language in the menu. */
  country: "GB" | "ES" | "BR" | "DE" | "FR" | "NL" | "JP" | "SA" | "ID" | "TH" | "VN" | "CN" | "CA" | "TW" | "IL" | "KR" | "IN";
  /** Google Translate language code. */
  code: string;
}

export const languages: Language[] = [
  { id: "en", country: "GB", label: "English", short: "EN", code: "en" },
  { id: "es", country: "ES", label: "Español", short: "ES", code: "es" },
  { id: "pt-BR", country: "BR", label: "Português (Brasil)", short: "PT", code: "pt" },
  { id: "de", country: "DE", label: "Deutsch", short: "DE", code: "de" },
  { id: "fr", country: "FR", label: "Français", short: "FR", code: "fr" },
  { id: "nl", country: "NL", label: "Nederlands", short: "NL", code: "nl" },
  { id: "ja", country: "JP", label: "日本語", short: "JA", code: "ja" },
  { id: "ar", country: "SA", label: "العربية", short: "AR", code: "ar" },
  { id: "id", country: "ID", label: "Bahasa Indonesia", short: "ID", code: "id" },
  { id: "th", country: "TH", label: "ภาษาไทย", short: "TH", code: "th" },
  { id: "vi", country: "VN", label: "Tiếng Việt", short: "VI", code: "vi" },
  { id: "zh-CN", country: "CN", label: "简体中文", short: "中文", code: "zh-CN" },
  // Google has a single French; the Canadian entry is kept so visitors find their own label.
  { id: "fr-CA", country: "CA", label: "Français (Canada)", short: "FR", code: "fr" },
  { id: "zh-TW", country: "TW", label: "繁体中文", short: "繁中", code: "zh-TW" },
  { id: "he", country: "IL", label: "עברית", short: "HE", code: "iw" },
  { id: "ko", country: "KR", label: "한국어", short: "KO", code: "ko" },
  { id: "ta", country: "IN", label: "தமிழ்", short: "TA", code: "ta" },
];

const STORAGE_KEY = "cloute-language";
/** Marks a tab in which the visitor picked a language, so the choice holds only there. */
const SESSION_KEY = "cloute-translated";
const COOKIE = "googtrans";

// --- current choice (shared by every language menu on the page) ---

const listeners = new Set<() => void>();

export function subscribeLanguage(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function readCookieCode() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "en";
}

export function currentLanguageId() {
  const code = readCookieCode();
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {}
  const preferred = languages.find((l) => l.id === stored && l.code === code);
  return (preferred ?? languages.find((l) => l.code === code) ?? languages[0]).id;
}

// --- Google's translator ---

declare global {
  interface Window {
    googleTranslateInit?: () => void;
    google?: { translate?: { TranslateElement: new (options: object, elementId: string) => unknown } };
  }
}

let loading: Promise<void> | null = null;

/**
 * Google rewrites text nodes in place, which can make React throw when it later removes or
 * reorders them. Tolerate nodes that have already been moved (the fix suggested in the React
 * issue tracker for page translators).
 */
function guardDomForTranslation() {
  const proto = Node.prototype as Node & { __translateGuard?: boolean };
  if (proto.__translateGuard) return;
  proto.__translateGuard = true;
  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

function loadTranslator() {
  if (loading) return loading;
  guardDomForTranslation();
  loading = new Promise<void>((resolve, reject) => {
    const host = document.createElement("div");
    host.id = "google_translate_element";
    host.hidden = true;
    document.body.append(host);
    window.googleTranslateInit = () => {
      new window.google!.translate!.TranslateElement(
        { pageLanguage: "en", autoDisplay: false, includedLanguages: [...new Set(languages.map((l) => l.code))].join(",") },
        host.id,
      );
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit";
    script.async = true;
    script.onerror = () => {
      loading = null;
      reject(new Error("Translator failed to load"));
    };
    document.head.append(script);
  });
  return loading;
}

/** Switch the translator's own (hidden) language picker once it has rendered. */
function selectInWidget(code: string) {
  let tries = 0;
  const attempt = () => {
    const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (combo && combo.options.length > 1) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
    } else if (tries++ < 40) {
      setTimeout(attempt, 150);
    }
  };
  attempt();
}

function setCookie(value: string | null) {
  // Google may also have written it for the bare and dotted domain, so clear every variant.
  const host = location.hostname;
  const expires = value ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
  for (const domain of ["", `;domain=${host}`, `;domain=.${host}`]) {
    document.cookie = `${COOKIE}=${value ?? ""};path=/${domain}${expires}`;
    if (value) break;
  }
}

export function chooseLanguage(id: string) {
  const language = languages.find((l) => l.id === id) ?? languages[0];
  try {
    localStorage.setItem(STORAGE_KEY, language.id);
  } catch {}

  if (language.code === "en") {
    // Restoring the original text is only reliable with a fresh load.
    const wasTranslated = readCookieCode() !== "en";
    setCookie(null);
    listeners.forEach((l) => l());
    if (wasTranslated) location.reload();
    return;
  }

  setCookie(`/en/${language.code}`);
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {}
  listeners.forEach((l) => l());
  const alreadyLoaded = !!loading;
  loadTranslator()
    .then(() => {
      // A fresh widget reads the cookie itself; an existing one needs telling.
      if (alreadyLoaded) selectInWidget(language.code);
    })
    .catch(() => {});
}

/** On page load, resume a translation chosen earlier. */
export function resumeTranslation() {
  if (readCookieCode() === "en") return;
  let sameTab = false;
  try {
    sameTab = sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {}
  if (sameTab) {
    // Google rewrites the page's text as soon as it runs. Starting it before React has hydrated the whole
    // page makes React see translated text instead of the server's English (a hydration mismatch), so wait
    // for the page to finish loading and hydrating first.
    const start = () => setTimeout(() => loadTranslator().catch(() => {}), 1500);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  } else {
    // A new visit (or an old cookie from Google): open in English.
    setCookie(null);
    listeners.forEach((l) => l());
  }
}
