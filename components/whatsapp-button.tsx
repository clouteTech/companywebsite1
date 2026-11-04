"use client";

import { lazy, Suspense, useState } from "react";

import { SocialIcon } from "@/components/social-icon";
import { whatsappUrl } from "@/lib/whatsapp";
import copy from "@/content/common.json";

// The assistant's code loads the first time it's needed (or when the button is hovered/focused, to feel instant).
const loadAssistant = () => import("@/components/enquiry-assistant");
const EnquiryAssistant = lazy(() => loadAssistant().then((module) => ({ default: module.EnquiryAssistant })));

/**
 * Floating WhatsApp button, stacked above the back-to-top button (styles in globals.css, .wa-float).
 * It opens the enquiry assistant; it is still a plain wa.me link, so it works before JavaScript loads and
 * Ctrl/Cmd-click opens WhatsApp directly.
 */
export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.whatsappButton.WhatsAppButton.arialabel01_chat_with_us_on}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={loadAssistant}
        onFocus={loadAssistant}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
          event.preventDefault();
          setMounted(true);
          setOpen(true);
        }}
        className="wa-float"
      >
        <span aria-hidden="true" className="wa-float-pulse" />
        <SocialIcon network="whatsapp" className="relative size-7" />
        <span aria-hidden="true" className="wa-float-tip">{copy.whatsappButton.WhatsAppButton.text02_chat_with_us_on}</span>
      </a>
      {mounted ? (
        <Suspense fallback={null}>
          <EnquiryAssistant open={open} onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}
