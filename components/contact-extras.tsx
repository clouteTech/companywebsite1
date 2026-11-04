"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import cms from "@/content/contact.json";

/*
 * Small interactive pieces for the contact page: a live open/closed badge driven by the published
 * business hours (IST), and a copy-to-clipboard button for the email address.
 */

// Business hours as listed on the About page, in IST: [open hour, close hour] per weekday (0 = Sunday).
const hours: Record<number, [number, number] | null> = {
  0: null,
  1: [9, 18],
  2: [9, 18],
  3: [9, 18],
  4: [9, 18],
  5: [9, 18],
  6: [10, 14],
};

function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const time = Number(get("hour")) + Number(get("minute")) / 60;
  const today = hours[day];
  return today ? time >= today[0] && time < today[1] : false;
}

/** "Open now" / "Closed now", worked out in the browser so it reflects the visitor's moment. */
export function OpenStatus() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (open === null) return <span className="ct-status">{cms.contactExtras.OpenStatus.text01_business_hours}</span>;
  return (
    <span className="ct-status" data-open={open}>
      <i aria-hidden="true" />
      {open ? "Open now" : "Closed now"}
    </span>
  );
}

/** Copies the email address and confirms it for a moment. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={copy} className="ct-copy" data-copied={copied}>
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
