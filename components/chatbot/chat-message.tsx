"use client";

import { ArrowUpRight, Bot, Check, Square, Volume2 } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { SocialIcon } from "@/components/social-icon";
import type { Lang, TopicId } from "@/lib/chatbot/knowledge";
import { enquiryPayload, enquiryWhatsAppUrl, type EnquiryDraft, type EnquiryField } from "@/lib/chatbot/enquiry";
import { speechLang, t, te } from "@/lib/chatbot/translations";

export interface ChatMessageData {
  id: string;
  from: "bot" | "user";
  text: string;
  /** ISO time the message was added. */
  time: string;
  /** Language the message was written in (its quick replies and speech use it). */
  lang: Lang;
  kind?: "welcome" | "error" | "summary" | "success";
  followUps?: TopicId[];
  link?: { href: string; label: string };
  /** An enquiry question; its answer buttons (services, skip) and cancel are offered. */
  enquiryField?: EnquiryField;
  /** Summary and success messages keep the enquiry they describe. */
  draft?: EnquiryDraft;
  saved?: boolean;
}

export function formatTime(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(speechLang[lang], { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

interface ChatMessageProps {
  message: ChatMessageData;
  speaking: boolean;
  canSpeak: boolean;
  onSpeak: () => void;
  onStopSpeaking: () => void;
  /** Quick replies, summary or other interactive content under the bubble. */
  children?: ReactNode;
}

export function ChatMessage({ message, speaking, canSpeak, onSpeak, onStopSpeaking, children }: ChatMessageProps) {
  const bot = message.from === "bot";
  const lang = message.lang;

  return (
    <div className={`cb-row ${bot ? "" : "cb-row-user"}`}>
      {bot ? (
        <span aria-hidden="true" className="cb-avatar-sm">
          <Bot className="size-3.5" strokeWidth={2} />
        </span>
      ) : null}
      <div className={`flex min-w-0 flex-col ${bot ? "items-start" : "items-end"} max-w-[86%]`}>
        <div
          className={`cb-bubble ${bot ? "cb-bubble-bot" : "cb-bubble-user"} ${message.kind === "error" ? "cb-bubble-error" : ""}`}
        >
          <span className="sr-only">{bot ? `${t("title", lang)}: ` : `${t("you", lang)}: `}</span>
          {message.text ? <p className="whitespace-pre-line">{message.text}</p> : null}
          {message.link ? (
            message.link.href.startsWith("http") ? (
              <a href={message.link.href} target="_blank" rel="noopener noreferrer" className="cb-link">
                {message.link.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : (
              <Link href={message.link.href} className="cb-link">
                {message.link.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            )
          ) : null}
          {message.kind === "success" && message.draft ? <HandOff draft={message.draft} lang={lang} /> : null}
          {children}
        </div>
        <div className="cb-meta">
          <time dateTime={message.time}>{formatTime(message.time, lang)}</time>
          {bot && canSpeak && message.text ? (
            <button
              type="button"
              onClick={speaking ? onStopSpeaking : onSpeak}
              className="cb-speak"
              aria-label={speaking ? t("stop", lang) : t("play", lang)}
              title={speaking ? t("stop", lang) : t("play", lang)}
            >
              {speaking ? <Square className="size-3" aria-hidden="true" /> : <Volume2 className="size-3.5" aria-hidden="true" />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Gmail's multicolour "M" mark. */
function GmailLogo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75V40h7c1.657 0 3-1.343 3-3V16.2z" />
      <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z" />
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
      <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A5.5 5.5 0 0 0 7.298 8C4.924 8 3 9.924 3 12.298z" />
      <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A5.5 5.5 0 0 1 40.702 8C43.076 8 45 9.924 45 12.298z" />
    </svg>
  );
}

/** WhatsApp link, and a button that emails the enquiry to the team through the contact API. */
function HandOff({ draft, lang }: { draft: EnquiryDraft; lang: Lang }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendEmail() {
    if (status === "sending" || status === "sent") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        // The API drops posts that arrive within seconds of the page opening, so the start time is the page load.
        body: JSON.stringify({ ...enquiryPayload(draft), website: "", startedAt: Math.round(performance.timeOrigin) }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      setStatus(response.ok && data?.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-3 grid gap-2">
      <a href={enquiryWhatsAppUrl(draft)} target="_blank" rel="noopener noreferrer" className="cb-handoff cb-handoff-wa">
        <SocialIcon network="whatsapp" className="size-6" />
        {te("whatsapp", lang)}
      </a>
      <button type="button" onClick={sendEmail} disabled={status === "sending" || status === "sent"} data-state={status} className="cb-handoff cb-handoff-mail">
        <span className="cb-mail-icon">
          {status === "sent" ? <Check className="size-4" aria-hidden="true" /> : <GmailLogo />}
        </span>
        <span>{status === "sending" ? te("emailSending", lang) : status === "sent" ? te("emailSent", lang) : te("emailButton", lang)}</span>
      </button>
      {status === "error" ? (
        <p role="alert" className="text-xs text-red-600">
          {te("emailFailed", lang)}
        </p>
      ) : null}
    </div>
  );
}
