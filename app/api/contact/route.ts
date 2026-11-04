// Contact form endpoint: validates the enquiry, emails it to the company inbox, then sends the customer an
// acknowledgement. Emails go through Resend's REST API; nothing is stored apart from short-lived in-memory counters.
import { createHash } from "node:crypto";

import { validateEnquiry, type ContactResponse } from "@/lib/contact";
import { companyEnquiryEmail, customerAcknowledgementEmail } from "@/lib/contact-emails";
import { company } from "@/lib/site";

const MAX_BODY_BYTES = 10_000;
// Real people take a few seconds to fill the form; bots usually post instantly.
const MIN_FILL_MS = 3_000;
const RATE_LIMIT = { requests: 5, windowMs: 10 * 60_000 };
// The same message from the same address within this window is treated as a resubmission and not emailed again.
const DUPLICATE_WINDOW_MS = 10 * 60_000;

// Per-instance memory. On a single server this is exact; on serverless each instance keeps its own counts,
// which still slows down abuse. Swap for a shared store (e.g. Upstash) if stricter limits are ever needed.
const requestLog = new Map<string, number[]>();
const recentEnquiries = new Map<string, { at: number; pending: boolean }>();

function json(body: ContactResponse, status = 200, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  );
}

/** Records this request and returns how many seconds to wait if the IP is over the limit. */
function rateLimit(ip: string, now: number) {
  if (requestLog.size > 5_000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t > RATE_LIMIT.windowMs)) requestLog.delete(key);
    }
  }
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.requests) {
    requestLog.set(ip, recent);
    return Math.ceil((recent[0] + RATE_LIMIT.windowMs - now) / 1000);
  }
  recent.push(now);
  requestLog.set(ip, recent);
  return 0;
}

function pruneEnquiries(now: number) {
  for (const [key, entry] of recentEnquiries) {
    if (!entry.pending && now - entry.at > DUPLICATE_WINDOW_MS) recentEnquiries.delete(key);
  }
}

/** Rejects posts from other websites. Requests without an Origin header (non-browser clients) are allowed through. */
function isCrossOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== (request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  } catch {
    return true;
  }
}

interface OutgoingEmail {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo: string;
}

async function sendEmail(apiKey: string, from: string, email: OutgoingEmail) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: email.replyTo,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const companyInbox = (process.env.CONTACT_TO_EMAIL ?? company.salesEmail)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!apiKey || !from || companyInbox.length === 0) {
    console.error("[contact] RESEND_API_KEY and CONTACT_FROM_EMAIL must be set in .env.local.");
    return json({ ok: false, error: "The contact form is temporarily unavailable." }, 503);
  }

  if (isCrossOrigin(request)) {
    return json({ ok: false, error: "Forbidden." }, 403);
  }

  const now = Date.now();
  const retryAfter = rateLimit(clientIp(request), now);
  if (retryAfter > 0) {
    return json(
      { ok: false, error: "You've sent several messages in a short time. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Unsupported request format." }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Your message is too long." }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Spam traps: a hidden field only bots fill in, and a form completed implausibly fast (or with no start time).
  // Bots get a normal-looking success so they don't adapt; nothing is sent.
  const startedAt = Number(body.startedAt);
  const elapsed = now - startedAt;
  if (body.website || !Number.isFinite(startedAt) || elapsed < MIN_FILL_MS || elapsed > 24 * 60 * 60_000) {
    console.warn("[contact] Dropped a submission that looked automated.");
    return json({ ok: true });
  }

  const result = validateEnquiry(body);
  if (!result.ok) {
    return json({ ok: false, error: "Please correct the highlighted fields.", errors: result.errors }, 422);
  }
  const enquiry = result.data;

  pruneEnquiries(now);
  const fingerprint = createHash("sha256")
    .update(`${enquiry.email}\n${enquiry.service}\n${enquiry.message}`)
    .digest("hex");
  if (recentEnquiries.has(fingerprint)) {
    // Already delivered (or being delivered right now), so the customer is told it went through.
    return json({ ok: true });
  }
  recentEnquiries.set(fingerprint, { at: now, pending: true });

  try {
    const companyEmail = companyEnquiryEmail(enquiry, new Date(now));
    await sendEmail(apiKey, from, { to: companyInbox, replyTo: enquiry.email, ...companyEmail });
  } catch (error) {
    recentEnquiries.delete(fingerprint);
    console.error("[contact] Could not deliver the enquiry to the company inbox:", error);
    return json(
      { ok: false, error: `We couldn't send your message right now. Please try again, or call us on ${company.phone}.` },
      502,
    );
  }
  recentEnquiries.set(fingerprint, { at: now, pending: false });

  // The enquiry has reached the team, so a failed acknowledgement is logged rather than shown as an error.
  try {
    const acknowledgement = customerAcknowledgementEmail(enquiry);
    await sendEmail(apiKey, from, { to: [enquiry.email], replyTo: companyInbox[0], ...acknowledgement });
  } catch (error) {
    console.error("[contact] Enquiry delivered, but the customer acknowledgement failed:", error);
  }

  return json({ ok: true });
}
