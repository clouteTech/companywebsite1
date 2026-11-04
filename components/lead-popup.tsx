"use client";

import { usePathname } from "next/navigation";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

// The popup's code only loads when it is about to be shown.
const LeadDialog = lazy(() => import("@/components/lead-dialog").then((module) => ({ default: module.LeadDialog })));

/*
 * When the enquiry popup appears: 20 seconds after the visitor arrives (counted from arrival, across page changes
 * and reloads), and not before.
 * It shows once per visit; if closed without sending it stays away for 3 days; after sending, for good.
 * Never on pages that already have a form, and it waits while another dialog or the chat is open.
 * Add ?popup to any URL to show it immediately (for checking the design; nothing is recorded).
 */
export const LEAD_POPUP_DELAY_MS = 20_000;
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60_000;

export const leadKeys = {
  start: "cloute-lead-start",
  shown: "cloute-lead-shown",
  dismissed: "cloute-lead-dismissed",
  submitted: "cloute-lead-submitted",
} as const;

// Pages that already carry a form, or where an interruption would be unwelcome.
const quietRoutes = ["/contact", "/thank-you", "/enquiries"];

function read(storage: () => Storage, key: string) {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value);
  } catch {
    // Private mode or blocked storage: the popup still works, it just may show again next visit.
  }
}

const session = () => window.sessionStorage;
const local = () => window.localStorage;

/** Something else is already asking for the visitor's attention: a modal, or the chat window. */
const busy = () => Boolean(document.querySelector("dialog[open], .cb-panel:not([hidden])"));

function allowed() {
  if (read(session, leadKeys.shown) || read(local, leadKeys.submitted)) return false;
  const dismissed = Number(read(local, leadKeys.dismissed));
  return !dismissed || Date.now() - dismissed > DISMISS_COOLDOWN_MS;
}

export function LeadPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  // A ?popup preview opens once per page visit, not again each time it is closed.
  const previewedPath = useRef<string | null>(null);
  const quiet = quietRoutes.includes(pathname);

  useEffect(() => {
    if (open) return;
    if (new URLSearchParams(window.location.search).has("popup")) {
      if (previewedPath.current === pathname) return;
      previewedPath.current = pathname;
      const timer = window.setTimeout(() => {
        setPreviewing(true);
        setOpen(true);
      }, 300);
      return () => window.clearTimeout(timer);
    }
    if (quiet || !allowed()) return;

    let start = Number(read(session, leadKeys.start));
    if (!start) {
      start = Date.now();
      write(session, leadKeys.start, String(start));
    }

    let timer = 0;
    let done = false;
    const show = () => {
      if (done) return;
      if (busy()) {
        window.clearTimeout(timer);
        timer = window.setTimeout(show, 5_000);
        return;
      }
      done = true;
      write(session, leadKeys.shown, "1");
      setPreviewing(false);
      setOpen(true);
    };

    timer = window.setTimeout(show, Math.max(0, start + LEAD_POPUP_DELAY_MS - Date.now()));
    return () => {
      done = true;
      window.clearTimeout(timer);
    };
  }, [open, quiet, pathname]);

  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <LeadDialog
        onClose={(sent) => {
          setOpen(false);
          if (!previewing && !sent) write(local, leadKeys.dismissed, String(Date.now()));
        }}
        onSubmitted={() => {
          if (!previewing) write(local, leadKeys.submitted, String(Date.now()));
        }}
      />
    </Suspense>
  );
}
